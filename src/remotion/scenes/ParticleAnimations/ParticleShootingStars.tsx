/**
 * ParticleShootingStars - 流れ星エフェクト
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const ParticleShootingStars = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const starCount = 8;
  const shootingStars = React.useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: `shooting-${i}`,
      startX: random(`ss-x-${i}`) * 80 + 10,
      startY: random(`ss-y-${i}`) * 30,
      angle: random(`ss-a-${i}`) * 30 + 30,
      speed: random(`ss-sp-${i}`) * 15 + 10,
      delay: i * 12,
      length: random(`ss-l-${i}`) * 100 + 50,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: "#0a0a1a" }}>
      {/* 背景の星 */}
      {Array.from({ length: 50 }).map((_, i) => {
        const twinkle = Math.sin((frame - startDelay) * 0.1 + i * 0.5) * 0.5 + 0.5;
        return (
          <div
            key={`bg-star-${i}`}
            style={{
              position: "absolute",
              left: `${random(`bgst-x-${i}`) * 100}%`,
              top: `${random(`bgst-y-${i}`) * 100}%`,
              width: random(`bgst-s-${i}`) * 3 + 1,
              height: random(`bgst-s-${i}`) * 3 + 1,
              background: C.white,
              borderRadius: "50%",
              opacity: twinkle * 0.8,
            }}
          />
        );
      })}

      {/* 流れ星 */}
      {shootingStars.map((star) => {
        const starFrame = frame - startDelay - star.delay;
        if (starFrame < 0 || starFrame > 30) return null;

        const progress = starFrame / 30;
        const x = star.startX + Math.cos((star.angle * Math.PI) / 180) * star.speed * starFrame;
        const y = star.startY + Math.sin((star.angle * Math.PI) / 180) * star.speed * starFrame;
        const opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

        return (
          <div
            key={star.id}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: star.length,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${C.white})`,
              transform: `rotate(${star.angle}deg)`,
              opacity: opacity,
              boxShadow: `0 0 10px ${C.white}`,
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "25%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 60,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      >
        SHOOTING STARS
      </div>
    </AbsoluteFill>
  );
};
