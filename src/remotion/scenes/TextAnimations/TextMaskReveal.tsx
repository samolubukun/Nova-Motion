/**
 * TextMaskReveal - マスクリビールテキスト - マスクで1文字ずつ表示
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextMaskReveal = ({ text = "MASKED", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const chars = text.split("");

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
        }}
      >
        {chars.map((char, i) => {
          const charDelay = startDelay + i * 6;
          const revealProgress = lerp(
            frame,
            [charDelay, charDelay + 15],
            [0, 100],
            EASE.out
          );

          return (
            <div
              key={`mask-${i}-${char}`}
              style={{
                overflow: "hidden",
                marginRight: 4,
              }}
            >
              <div
                style={{
                  fontFamily: font,
                  fontSize: 130,
                  fontWeight: 800,
                  color: C.white,
                  clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
                }}
              >
                {char}
              </div>
            </div>
          );
        })}
      </div>

      {/* 背景のグリッド */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${C.gray[900]} 1px, transparent 1px),
            linear-gradient(90deg, ${C.gray[900]} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};
