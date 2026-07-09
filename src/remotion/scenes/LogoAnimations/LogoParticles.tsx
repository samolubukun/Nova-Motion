/**
 * LogoParticles - ロゴパーティクル集合
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, random } from "remotion";
import { C, lerp, font } from "../../common";

export const LogoParticles = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particleCount = 50;
  const particles = React.useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: `logo-particle-${i}`,
      startX: (random(`px-${i}`) - 0.5) * 800,
      startY: (random(`py-${i}`) - 0.5) * 600,
      endX: (random(`ex-${i}`) - 0.5) * 100,
      endY: (random(`ey-${i}`) - 0.5) * 50,
      size: random(`ps-${i}`) * 8 + 4,
      delay: random(`pd-${i}`) * 20,
    }));
  }, []);

  const logoProgress = spring({
    frame: frame - startDelay - 40,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* パーティクル */}
      {particles.map((p) => {
        const progress = spring({
          frame: frame - startDelay - p.delay,
          fps,
          config: { damping: 20, stiffness: 80 },
        });

        const x = interpolate(progress, [0, 1], [p.startX, p.endX]);
        const y = interpolate(progress, [0, 1], [p.startY, p.endY]);
        const opacity = progress < 0.8 ? progress : lerp(progress, [0.8, 1], [1, 0]);

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: p.size,
              height: p.size,
              background: C.accent,
              borderRadius: "50%",
              transform: `translate(${x}px, ${y}px)`,
              opacity: opacity,
              boxShadow: `0 0 10px ${C.accent}`,
            }}
          />
        );
      })}

      {/* ロゴ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${logoProgress})`,
          fontFamily: font,
          fontSize: 80,
          fontWeight: 900,
          color: C.white,
          opacity: logoProgress,
        }}
      >
        LOGO
      </div>
    </AbsoluteFill>
  );
};
