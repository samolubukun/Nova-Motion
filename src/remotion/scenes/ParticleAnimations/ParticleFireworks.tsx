/**
 * ParticleFireworks - ファイヤーワークス
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ParticleFireworks = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const fireworks = [
    { x: 30, y: 40, delay: 0, color: C.danger },
    { x: 70, y: 35, delay: 15, color: C.yellow },
    { x: 50, y: 30, delay: 30, color: C.accent },
    { x: 20, y: 45, delay: 45, color: C.secondary },
    { x: 80, y: 40, delay: 55, color: C.tertiary },
  ];

  const particlesPerFirework = 30;

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {fireworks.map((fw, fwIndex) => {
        const explosionFrame = startDelay + fw.delay + 20;
        const isExploding = frame >= explosionFrame;

        // 打ち上げ
        if (!isExploding && frame >= startDelay + fw.delay) {
          const riseProgress = (frame - startDelay - fw.delay) / 20;
          const riseY = 100 - riseProgress * (100 - fw.y);

          return (
            <div
              key={`fw-rise-${fwIndex}`}
              style={{
                position: "absolute",
                left: `${fw.x}%`,
                top: `${riseY}%`,
                width: 4,
                height: 20,
                background: `linear-gradient(to top, ${fw.color}, transparent)`,
                transform: "translateX(-50%)",
              }}
            />
          );
        }

        // 爆発
        if (isExploding) {
          const explosionProgress = (frame - explosionFrame) / 40;
          if (explosionProgress > 1) return null;

          return (
            <React.Fragment key={`fw-explosion-${fwIndex}`}>
              {Array.from({ length: particlesPerFirework }).map((_, i) => {
                const angle = (i / particlesPerFirework) * Math.PI * 2;
                const distance = 150 * explosionProgress * (1 - explosionProgress * 0.3);
                const x = fw.x + (Math.cos(angle) * distance) / 10;
                const y = fw.y + (Math.sin(angle) * distance) / 10 + explosionProgress * 5;
                const opacity = 1 - explosionProgress;
                const size = 6 * (1 - explosionProgress * 0.5);

                return (
                  <div
                    key={`fw-p-${fwIndex}-${i}`}
                    style={{
                      position: "absolute",
                      left: `${x}%`,
                      top: `${y}%`,
                      width: size,
                      height: size,
                      background: fw.color,
                      borderRadius: "50%",
                      opacity: opacity,
                      boxShadow: `0 0 ${size * 2}px ${fw.color}`,
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        }

        return null;
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "15%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 60,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay + 60, startDelay + 80], [0, 1]),
        }}
      >
        FIREWORKS
      </div>
    </AbsoluteFill>
  );
};
