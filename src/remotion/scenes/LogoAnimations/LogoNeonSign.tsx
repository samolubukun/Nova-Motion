/**
 * LogoNeonSign - ロゴネオンサイン
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const LogoNeonSign = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const flickerSeed = Math.floor(frame / 4);
  const flicker = random(`neon-${flickerSeed}`) > 0.1 ? 1 : 0.3;

  const letters = "NEON".split("");

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {/* 壁のテクスチャ */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at center, #1a1a25 0%, #0a0a15 100%)
          `,
        }}
      />

      {/* ネオンサイン */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 20,
        }}
      >
        {letters.map((letter, i) => {
          const letterDelay = startDelay + i * 15;
          const isOn = frame >= letterDelay;
          const letterFlicker = isOn ? (random(`neon-letter-${flickerSeed}-${i}`) > 0.05 ? 1 : 0.2) : 0;

          return (
            <div
              key={`neon-${i}-${letter}`}
              style={{
                fontFamily: font,
                fontSize: 100,
                fontWeight: 700,
                color: isOn ? C.secondary : C.gray[800],
                textShadow: isOn
                  ? `
                    0 0 10px ${C.secondary},
                    0 0 20px ${C.secondary},
                    0 0 40px ${C.secondary},
                    0 0 80px ${C.secondary}
                  `
                  : "none",
                opacity: letterFlicker * flicker,
                transition: "color 0.1s",
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* 反射光 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "70%",
          width: 400,
          height: 100,
          background: C.secondary,
          borderRadius: "50%",
          transform: "translate(-50%, 0)",
          filter: "blur(60px)",
          opacity: 0.2 * flicker,
        }}
      />

      {/* "OPEN"サイン */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 100,
          fontFamily: font,
          fontSize: 24,
          fontWeight: 600,
          color: C.tertiary,
          textShadow: `0 0 20px ${C.tertiary}`,
          opacity: lerp(frame, [startDelay + 60, startDelay + 80], [0, flicker]),
        }}
      >
        OPEN
      </div>
    </AbsoluteFill>
  );
};
