/**
 * LogoMorph - ロゴモーフィング
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LogoMorph = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // 文字変形
  const letters = ["L", "O", "G", "O"];
  const targetLetters = ["B", "R", "N", "D"];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 10,
        }}
      >
        {letters.map((letter, i) => {
          const letterProgress = lerp(
            frame,
            [startDelay + i * 10, startDelay + i * 10 + 30],
            [0, 1],
            EASE.out
          );

          const displayLetter = letterProgress < 0.5 ? letter : targetLetters[i];
          const scale = letterProgress < 0.5
            ? 1 - letterProgress
            : letterProgress;
          const rotation = letterProgress * 360;

          return (
            <div
              key={`morph-letter-${i}-${letter}`}
              style={{
                fontFamily: font,
                fontSize: 100,
                fontWeight: 900,
                color: C.white,
                transform: `scale(${0.5 + scale * 0.5}) rotate(${rotation}deg)`,
                opacity: 0.5 + scale * 0.5,
              }}
            >
              {displayLetter}
            </div>
          );
        })}
      </div>

      {/* アンダーライン */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "65%",
          transform: "translateX(-50%)",
          width: lerp(frame, [startDelay + 50, startDelay + 70], [0, 350], EASE.out),
          height: 4,
          background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})`,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
