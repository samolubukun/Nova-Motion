/**
 * CinematicEpic - エピックタイトル - 大作映画風
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const CinematicEpic = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const titleScale = lerp(frame, [startDelay, startDelay + 40], [0.5, 1], EASE.out);
  const titleOpacity = lerp(frame, [startDelay, startDelay + 30], [0, 1]);
  const subtitleOpacity = lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* パーティクル背景 */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = random(`epic-x-${i}`) * 100;
        const y = random(`epic-y-${i}`) * 100;
        const size = random(`epic-s-${i}`) * 3 + 1;
        const twinkle = Math.sin((frame - startDelay) * 0.1 + i) * 0.5 + 0.5;

        return (
          <div
            key={`epic-star-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: C.gold,
              borderRadius: "50%",
              opacity: twinkle * 0.5,
            }}
          />
        );
      })}

      {/* グラデーションオーバーレイ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, ${C.black} 100%)`,
        }}
      />

      {/* メインタイトル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: C.white,
            letterSpacing: 20,
            textShadow: `0 0 60px ${C.gold}60`,
            opacity: titleOpacity,
          }}
        >
          EPIC
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            fontWeight: 300,
            color: C.gold,
            letterSpacing: 15,
            marginTop: 30,
            opacity: subtitleOpacity,
          }}
        >
          A CINEMATIC EXPERIENCE
        </div>
      </div>

      {/* レターボックス */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: C.black,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: C.black,
        }}
      />
    </AbsoluteFill>
  );
};
