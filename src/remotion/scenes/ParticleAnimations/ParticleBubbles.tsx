/**
 * ParticleBubbles - 泡エフェクト
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, font } from "../../common";

export const ParticleBubbles = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const bubbleCount = 40;
  const bubbles = React.useMemo(() => {
    return Array.from({ length: bubbleCount }).map((_, i) => ({
      id: `bubble-${i}`,
      x: random(`b-x-${i}`) * 100,
      delay: random(`b-d-${i}`) * 60,
      speed: random(`b-sp-${i}`) * 1.5 + 0.5,
      size: random(`b-s-${i}`) * 40 + 20,
    }));
  }, []);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(to top, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)",
        overflow: "hidden",
      }}
    >
      {bubbles.map((b) => {
        const startFrame = startDelay + b.delay;
        const riseProgress = (frame - startFrame) * b.speed;
        const y = 750 - riseProgress;
        const wobbleX = Math.sin(riseProgress * 0.05 + b.x) * 15;

        if (y < -b.size || frame < startFrame) return null;

        return (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              top: y,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.4)",
              transform: `translateX(${wobbleX}px)`,
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
          fontWeight: 700,
          color: C.white,
          textShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        BUBBLES
      </div>
    </AbsoluteFill>
  );
};
