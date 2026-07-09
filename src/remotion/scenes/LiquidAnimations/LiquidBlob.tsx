/**
 * LiquidBlob - 有機的ブロブモーション - 複数レイヤーの巨大ブロブ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LiquidBlob = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 複数のブロブレイヤー
  const blobLayers = [
    { scale: 4, rotation: 1, color: C.accent, opacity: 0.3, blur: 60, delay: 0 },
    { scale: 3.5, rotation: -0.8, color: C.secondary, opacity: 0.4, blur: 40, delay: 3 },
    { scale: 3, rotation: 1.2, color: C.tertiary, opacity: 0.5, blur: 20, delay: 6 },
    { scale: 2.5, rotation: -0.5, color: C.white, opacity: 0.6, blur: 10, delay: 9 },
    { scale: 2, rotation: 0.7, color: C.accent, opacity: 0.9, blur: 0, delay: 12 },
  ];

  // アニメーションするブロブパス生成
  const generateAnimatedBlob = (f: number, seed: number, points: number = 10) => {
    const radius = 100;
    const angleStep = (Math.PI * 2) / points;
    const pathPoints: { x: number; y: number }[] = [];

    for (let i = 0; i < points; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const noise1 = Math.sin(f * 0.04 + i * 1.2 + seed) * 40;
      const noise2 = Math.cos(f * 0.06 + i * 0.8 + seed * 2) * 25;
      const r = radius + noise1 + noise2;
      pathPoints.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      });
    }

    let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 0; i < points; i++) {
      const curr = pathPoints[i];
      const next = pathPoints[(i + 1) % points];
      const prev = pathPoints[(i - 1 + points) % points];
      const nextNext = pathPoints[(i + 2) % points];

      const cp1x = curr.x + (next.x - prev.x) * 0.35;
      const cp1y = curr.y + (next.y - prev.y) * 0.35;
      const cp2x = next.x - (nextNext.x - curr.x) * 0.35;
      const cp2y = next.y - (nextNext.y - curr.y) * 0.35;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return path + " Z";
  };

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 複数のブロブレイヤー */}
      {blobLayers.map((layer, idx) => {
        const layerProgress = spring({
          frame: frame - startDelay - layer.delay,
          fps,
          config: { damping: 12, stiffness: 40 },
        });

        const rotation = (frame - startDelay) * layer.rotation;

        return (
          <div
            key={`blob-layer-${layer.color}-${layer.scale}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${layerProgress * layer.scale})`,
              filter: layer.blur > 0 ? `blur(${layer.blur}px)` : undefined,
            }}
          >
            <svg width="400" height="400" viewBox="-200 -200 400 400" aria-hidden="true">
              <path
                d={generateAnimatedBlob(frame - startDelay, idx * 100)}
                fill={layer.color}
                opacity={layer.opacity}
              />
            </svg>
          </div>
        );
      })}

      {/* 飛び散るサブブロブ */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = random(`blob-angle-${i}`) * Math.PI * 2;
        const dist = 200 + random(`blob-dist-${i}`) * 300;
        const size = 30 + random(`blob-size-${i}`) * 60;
        const delay = random(`blob-delay-${i}`) * 20;

        const subProgress = spring({
          frame: frame - startDelay - 15 - delay,
          fps,
          config: { damping: 15, stiffness: 60 },
        });

        const x = Math.cos(angle) * dist * subProgress;
        const y = Math.sin(angle) * dist * subProgress;
        const rotation = (frame - startDelay) * (i % 2 === 0 ? 2 : -2);

        return (
          <div
            key={`sub-blob-${i}-${size.toFixed(0)}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              background: [C.accent, C.secondary, C.tertiary, C.white][i % 4],
              borderRadius: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${subProgress})`,
              opacity: subProgress * 0.8,
            }}
          />
        );
      })}

      {/* 中央テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${lerp(frame, [startDelay + 25, startDelay + 45], [0, 1], EASE.overshoot)})`,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 900,
          color: C.white,
          textShadow: `0 0 60px ${C.accent}, 0 0 120px ${C.secondary}`,
        }}
      >
        BLOB
      </div>
    </AbsoluteFill>
  );
};
