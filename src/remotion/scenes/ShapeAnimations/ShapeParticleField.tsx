/**
 * ShapeParticleField - パーティクルフィールド - 浮遊する点
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ShapeParticleField = ({ particleCount = 60, startDelay = 0 }: {
  particleCount?: number;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = React.useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: `particle-field-${i}`,
      x: random(`px-${i}`) * width,
      y: random(`py-${i}`) * height,
      size: random(`ps-${i}`) * 6 + 2,
      speed: random(`psp-${i}`) * 0.5 + 0.2,
      opacity: random(`po-${i}`) * 0.6 + 0.2,
    }));
  }, [particleCount, width, height]);

  const entryProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* パーティクル */}
      {particles.map((p) => {
        const y = (p.y + (frame - startDelay) * p.speed * 2) % height;
        const floatX = Math.sin((frame - startDelay) * 0.02 + p.x * 0.01) * 20;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x + floatX,
              top: y,
              width: p.size,
              height: p.size,
              background: C.white,
              borderRadius: "50%",
              opacity: p.opacity * entryProgress,
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
          transform: `translate(-50%, -50%) scale(${entryProgress})`,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 800,
          color: C.white,
          textShadow: `0 0 60px ${C.accent}`,
        }}
      >
        PARTICLES
      </div>
    </AbsoluteFill>
  );
};
