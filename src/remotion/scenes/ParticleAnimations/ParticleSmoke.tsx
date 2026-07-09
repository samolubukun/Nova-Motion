/**
 * ParticleSmoke - 煙エフェクト
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const ParticleSmoke = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const smokeCount = 20;
  const smokeParticles = React.useMemo(() => {
    return Array.from({ length: smokeCount }).map((_, i) => ({
      id: `smoke-${i}`,
      delay: i * 5,
      offsetX: (random(`sm-x-${i}`) - 0.5) * 100,
      speed: random(`sm-sp-${i}`) * 0.5 + 0.3,
      size: random(`sm-s-${i}`) * 100 + 80,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {smokeParticles.map((s) => {
        const particleFrame = frame - startDelay - s.delay;
        if (particleFrame < 0) return null;

        const y = 600 - particleFrame * s.speed * 3;
        const x = 640 + s.offsetX + Math.sin(particleFrame * 0.05) * 30;
        const currentSize = s.size + particleFrame * 2;
        const opacity = Math.max(0, 1 - particleFrame / 100);

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: currentSize,
              height: currentSize,
              background: `radial-gradient(circle, ${C.gray[500]}80 0%, transparent 70%)`,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              opacity: opacity * 0.6,
              filter: "blur(20px)",
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      >
        SMOKE
      </div>
    </AbsoluteFill>
  );
};
