/**
 * LiquidOilSpill - オイルスピル風 - 虹色に輝く巨大な油膜
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LiquidOilSpill = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const hueShift = (frame - startDelay) * 3;
  const time = (frame - startDelay) * 0.02;

  // 動的なオイルブロブパス生成
  const generateOilBlob = (seed: number, t: number, baseRadius: number) => {
    const points = 12;
    const angleStep = (Math.PI * 2) / points;
    const pathPoints: { x: number; y: number }[] = [];

    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      const noise1 = Math.sin(t * 2 + i * 1.2 + seed) * 50;
      const noise2 = Math.cos(t * 1.5 + i * 0.8 + seed * 2) * 30;
      const r = baseRadius + noise1 + noise2;
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

  // 複数のオイルレイヤー（画面を覆うサイズ）
  const oilLayers = [
    { scale: 6, seed: 0, rotation: 0.3, delay: 0 },
    { scale: 5.5, seed: 20, rotation: -0.4, delay: 3 },
    { scale: 5, seed: 40, rotation: 0.5, delay: 6 },
    { scale: 4.5, seed: 60, rotation: -0.3, delay: 9 },
    { scale: 4, seed: 80, rotation: 0.4, delay: 12 },
  ];

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {/* 暗い水面 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0a0a15 100%)`,
        }}
      />

      {/* オイルレイヤー */}
      {oilLayers.map((layer, idx) => {
        const layerProgress = spring({
          frame: frame - startDelay - layer.delay,
          fps,
          config: { damping: 15, stiffness: 35 },
        });

        const rotation = (frame - startDelay) * layer.rotation;
        const layerHue = (hueShift + idx * 60) % 360;

        return (
          <div
            key={`oil-layer-${idx}-${layer.scale}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${layerProgress * layer.scale})`,
            }}
          >
            <svg width="400" height="400" viewBox="-200 -200 400 400" aria-hidden="true">
              <defs>
                <linearGradient
                  id={`oil-grad-${startDelay}-${idx}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={`hsl(${layerHue}, 80%, 60%)`} stopOpacity="0.7" />
                  <stop offset="30%" stopColor={`hsl(${(layerHue + 40) % 360}, 80%, 50%)`} stopOpacity="0.6" />
                  <stop offset="60%" stopColor={`hsl(${(layerHue + 80) % 360}, 80%, 55%)`} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={`hsl(${(layerHue + 120) % 360}, 80%, 45%)`} stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d={generateOilBlob(layer.seed, time, 100)}
                fill={`url(#oil-grad-${startDelay}-${idx})`}
                style={{ mixBlendMode: "screen" }}
              />
            </svg>
          </div>
        );
      })}

      {/* 光の反射 */}
      {Array.from({ length: 15 }).map((_, i) => {
        const reflectProgress = spring({
          frame: frame - startDelay - 15 - i * 3,
          fps,
          config: { damping: 20, stiffness: 60 },
        });

        const x = (random(`ref-x-${i}`) - 0.5) * width;
        const y = (random(`ref-y-${i}`) - 0.5) * height;
        const size = random(`ref-sz-${i}`) * 100 + 50;
        const hue = (hueShift + random(`ref-hue-${i}`) * 180) % 360;

        return (
          <div
            key={`reflect-${i}-${size.toFixed(0)}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              background: `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.6) 0%, transparent 70%)`,
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${reflectProgress})`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}

      {/* テキスト */}
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
          textShadow: `0 0 40px hsl(${hueShift}, 80%, 50%), 0 0 80px hsl(${(hueShift + 60) % 360}, 80%, 50%)`,
        }}
      >
        OIL SPILL
      </div>
    </AbsoluteFill>
  );
};
