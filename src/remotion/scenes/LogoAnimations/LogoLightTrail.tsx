/**
 * LogoLightTrail - ロゴライトトレイル
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LogoLightTrail = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const logoOpacity = lerp(frame, [startDelay + 35, startDelay + 50], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* ライトトレイル */}
      {[0, 1, 2, 3, 4].map((i) => {
        const trailDelay = i * 5;
        const x = lerp(frame, [startDelay + trailDelay, startDelay + 40 + trailDelay], [-100, 50], EASE.out);
        const opacity = lerp(frame, [startDelay + 30 + trailDelay, startDelay + 50 + trailDelay], [0.8, 0]);

        return (
          <div
            key={`trail-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: "50%",
              width: 200 - i * 30,
              height: 4,
              background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? C.accent : C.secondary})`,
              transform: "translateY(-50%)",
              opacity: opacity,
              filter: "blur(2px)",
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
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 900,
          color: C.white,
          opacity: logoOpacity,
          textShadow: `0 0 30px ${C.accent}`,
        }}
      >
        SPEED
      </div>

      {/* グロー */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 400,
          height: 150,
          background: C.accent,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          opacity: logoOpacity * 0.3,
        }}
      />
    </AbsoluteFill>
  );
};
