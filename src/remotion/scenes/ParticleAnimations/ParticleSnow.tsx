/**
 * ParticleSnow - 雪エフェクト
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { C, lerp, font } from "../../common";

export const ParticleSnow = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const snowCount = 80;
  const snowflakes = React.useMemo(() => {
    return Array.from({ length: snowCount }).map((_, i) => ({
      id: `snow-${i}`,
      x: random(`s-x-${i}`) * 100,
      delay: random(`s-d-${i}`) * 50,
      speed: random(`s-sp-${i}`) * 1 + 0.5,
      size: random(`s-s-${i}`) * 6 + 2,
      opacity: random(`s-o-${i}`) * 0.6 + 0.3,
    }));
  }, []);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(to bottom, #1a1a2e 0%, #0f0f1a 100%)",
        overflow: "hidden",
      }}
    >
      {snowflakes.map((s) => {
        const startFrame = startDelay + s.delay;
        const fallProgress = (frame - startFrame) * s.speed;
        const y = -20 + fallProgress;
        const wobbleX = Math.sin(fallProgress * 0.02 + s.x) * 20;

        if (y > height + 20 || frame < startFrame) return null;

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: y,
              width: s.size,
              height: s.size,
              background: C.white,
              borderRadius: "50%",
              transform: `translateX(${wobbleX}px)`,
              opacity: s.opacity,
              boxShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
          />
        );
      })}

      {/* 地面の雪 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "linear-gradient(to top, #e0e0e0 0%, transparent 100%)",
          opacity: lerp(frame, [startDelay + 40, startDelay + 80], [0, 0.3]),
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      >
        WINTER
      </div>
    </AbsoluteFill>
  );
};
