/**
 * ParticleSakura - 桜吹雪エフェクト
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { lerp, font } from "../../common";

export const ParticleSakura = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const petalCount = 60;
  const petals = React.useMemo(() => {
    return Array.from({ length: petalCount }).map((_, i) => ({
      id: `sakura-${i}`,
      x: random(`sk-x-${i}`) * 120 - 10,
      delay: random(`sk-d-${i}`) * 40,
      speed: random(`sk-sp-${i}`) * 1.5 + 1,
      size: random(`sk-s-${i}`) * 15 + 10,
      rotationSpeed: (random(`sk-rs-${i}`) - 0.5) * 10,
    }));
  }, []);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(to bottom, #fce4ec 0%, #f8bbd0 100%)",
        overflow: "hidden",
      }}
    >
      {petals.map((p) => {
        const startFrame = startDelay + p.delay;
        const fallProgress = (frame - startFrame) * p.speed;
        const y = -30 + fallProgress;
        const wobbleX = Math.sin(fallProgress * 0.03 + p.x) * 40;
        const rotation = (frame - startFrame) * p.rotationSpeed;

        if (y > height + 30 || frame < startFrame) return null;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: y,
              width: p.size,
              height: p.size * 0.6,
              background: `radial-gradient(ellipse, #ffb6c1 30%, #ff69b4 100%)`,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              transform: `translateX(${wobbleX}px) rotate(${rotation}deg)`,
              opacity: 0.8,
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
          fontSize: 100,
          fontWeight: 300,
          color: "#880e4f",
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      >
        桜
      </div>
    </AbsoluteFill>
  );
};
