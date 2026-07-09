/**
 * ParticleSparks - 火花エフェクト
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const ParticleSparks = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const sparkCount = 50;
  const sparks = React.useMemo(() => {
    return Array.from({ length: sparkCount }).map((_, i) => ({
      id: `spark-${i}`,
      angle: random(`sp-a-${i}`) * Math.PI * 2,
      speed: random(`sp-sp-${i}`) * 8 + 4,
      size: random(`sp-s-${i}`) * 4 + 2,
      life: random(`sp-l-${i}`) * 30 + 20,
      delay: random(`sp-d-${i}`) * 60,
    }));
  }, []);

  const burstFrame = startDelay + 20;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 火花 */}
      {sparks.map((s) => {
        const particleFrame = frame - burstFrame - s.delay;
        if (particleFrame < 0 || particleFrame > s.life) return null;

        const progress = particleFrame / s.life;
        const distance = s.speed * particleFrame * (1 - progress * 0.5);
        const x = Math.cos(s.angle) * distance;
        const y = Math.sin(s.angle) * distance + particleFrame * 0.5; // 重力
        const opacity = 1 - progress;
        const currentSize = s.size * (1 - progress * 0.5);

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: currentSize,
              height: currentSize,
              background: progress < 0.3 ? C.yellow : progress < 0.6 ? C.orange : C.danger,
              borderRadius: "50%",
              transform: `translate(${x}px, ${y}px)`,
              opacity: opacity,
              boxShadow: `0 0 ${currentSize * 2}px ${progress < 0.5 ? C.yellow : C.orange}`,
            }}
          />
        );
      })}

      {/* 中心のフラッシュ */}
      {frame >= burstFrame && frame < burstFrame + 10 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 100,
            height: 100,
            background: C.white,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            opacity: lerp(frame, [burstFrame, burstFrame + 10], [1, 0]),
            filter: "blur(20px)",
          }}
        />
      )}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "20%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 60,
          fontWeight: 700,
          color: C.orange,
          textShadow: `0 0 30px ${C.orange}`,
          opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
        }}
      >
        SPARKS
      </div>
    </AbsoluteFill>
  );
};
