/**
 * ParticleConfetti - 紙吹雪エフェクト
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { C, font } from "../../common";

export const ParticleConfetti = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const confettiCount = 100;
  const confetti = React.useMemo(() => {
    return Array.from({ length: confettiCount }).map((_, i) => ({
      id: `confetti-${i}`,
      x: random(`c-x-${i}`) * 100,
      delay: random(`c-d-${i}`) * 30,
      speed: random(`c-sp-${i}`) * 3 + 2,
      rotation: random(`c-r-${i}`) * 360,
      rotationSpeed: (random(`c-rs-${i}`) - 0.5) * 20,
      size: random(`c-s-${i}`) * 15 + 8,
      color: [C.accent, C.secondary, C.tertiary, C.orange, C.yellow][i % 5],
      type: Math.floor(random(`c-t-${i}`) * 3),
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: C.gray[950], overflow: "hidden" }}>
      {confetti.map((c) => {
        const startFrame = startDelay + c.delay;
        const fallProgress = (frame - startFrame) * c.speed;
        const y = -50 + fallProgress;
        const wobbleX = Math.sin(fallProgress * 0.1 + c.x) * 30;
        const rotation = c.rotation + (frame - startFrame) * c.rotationSpeed;

        if (y > height + 50 || frame < startFrame) return null;

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: `${c.x}%`,
              top: y,
              width: c.type === 0 ? c.size : c.size * 0.5,
              height: c.type === 0 ? c.size * 0.5 : c.size,
              background: c.color,
              borderRadius: c.type === 2 ? "50%" : 2,
              transform: `translateX(${wobbleX}px) rotate(${rotation}deg)`,
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
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
          textShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        CELEBRATE!
      </div>
    </AbsoluteFill>
  );
};
