/**
 * LiquidMorphBlob - モーフィングブロブ - 巨大な変形するブロブ群
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LiquidMorphBlob = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const time = (frame - startDelay) * 0.03;

  // 動的なブロブパス生成（時間で変形）
  const generateMorphingBlob = (seed: number, t: number, baseRadius: number, points: number = 10) => {
    const angleStep = (Math.PI * 2) / points;
    const pathPoints: { x: number; y: number }[] = [];

    for (let i = 0; i < points; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const noise1 = Math.sin(t * 2 + i * 1.5 + seed) * 40;
      const noise2 = Math.cos(t * 1.5 + i * 2 + seed * 0.5) * 30;
      const noise3 = Math.sin(t * 3 + i * 0.8 + seed * 2) * 20;
      const r = baseRadius + noise1 + noise2 + noise3;
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

  // 複数のブロブレイヤー
  const blobLayers = [
    { scale: 5, seed: 0, color: C.accent, opacity: 0.2, blur: 80, delay: 0 },
    { scale: 4.5, seed: 10, color: C.secondary, opacity: 0.25, blur: 60, delay: 3 },
    { scale: 4, seed: 20, color: C.tertiary, opacity: 0.3, blur: 40, delay: 6 },
    { scale: 3.5, seed: 30, color: C.orange, opacity: 0.4, blur: 20, delay: 9 },
    { scale: 3, seed: 40, color: C.white, opacity: 0.5, blur: 10, delay: 12 },
    { scale: 2.5, seed: 50, color: C.accent, opacity: 0.8, blur: 0, delay: 15 },
  ];

  // 浮遊する小ブロブ
  const floatingBlobs = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `float-${i}`,
      x: (random(`fb-x-${i}`) - 0.5) * width * 1.5,
      y: (random(`fb-y-${i}`) - 0.5) * height * 1.5,
      size: random(`fb-sz-${i}`) * 80 + 40,
      speed: random(`fb-sp-${i}`) * 2 + 1,
      seed: random(`fb-seed-${i}`) * 100,
      color: [C.accent, C.secondary, C.tertiary, C.orange][i % 4],
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 背景グロー */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: width * 2,
          height: height * 2,
          background: `radial-gradient(circle, ${C.accent}30 0%, ${C.secondary}20 40%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* メインブロブレイヤー */}
      {blobLayers.map((layer) => {
        const layerProgress = spring({
          frame: frame - startDelay - layer.delay,
          fps,
          config: { damping: 12, stiffness: 40 },
        });

        return (
          <div
            key={`morph-layer-${layer.color}-${layer.scale}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) scale(${layerProgress * layer.scale})`,
              filter: layer.blur > 0 ? `blur(${layer.blur}px)` : undefined,
            }}
          >
            <svg width="400" height="400" viewBox="-200 -200 400 400" aria-hidden="true">
              <path
                d={generateMorphingBlob(layer.seed, time, 100, 12)}
                fill={layer.color}
                opacity={layer.opacity}
              />
            </svg>
          </div>
        );
      })}

      {/* 浮遊する小ブロブ */}
      {floatingBlobs.map((blob) => {
        const blobProgress = spring({
          frame: frame - startDelay - 20,
          fps,
          config: { damping: 15, stiffness: 50 },
        });

        const floatX = blob.x + Math.sin(time * blob.speed) * 50;
        const floatY = blob.y + Math.cos(time * blob.speed * 0.8) * 40;

        return (
          <div
            key={blob.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${floatX}px, ${floatY}px) scale(${blobProgress})`,
            }}
          >
            <svg width={blob.size * 2} height={blob.size * 2} viewBox="-100 -100 200 200" aria-hidden="true">
              <path
                d={generateMorphingBlob(blob.seed, time * blob.speed, 60, 8)}
                fill={blob.color}
                opacity={0.6}
              />
            </svg>
          </div>
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
        MORPH
      </div>
    </AbsoluteFill>
  );
};
