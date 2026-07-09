/**
 * TextScramble - スクランブルテキスト - ランダム文字から確定
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const TextScramble = ({ text = "SCRAMBLE", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  const targetChars = text.split("");

  const getDisplayChar = (index: number, targetChar: string) => {
    const charStartFrame = startDelay + index * 4;
    const progress = lerp(frame, [charStartFrame, charStartFrame + 20], [0, 1]);

    if (progress >= 1) return targetChar;
    if (frame < charStartFrame) return "";

    // ランダム文字を表示
    const randomIndex = Math.floor(
      random(`scramble-${frame}-${index}`) * chars.length
    );
    return chars[randomIndex];
  };

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 100,
            fontWeight: 700,
            color: C.white,
            letterSpacing: 8,
          }}
        >
          {targetChars.map((char, i) => (
            <span
              key={`scramble-${i}`}
              style={{
                display: "inline-block",
                color: getDisplayChar(i, char) === char ? C.white : C.accent,
                textShadow:
                  getDisplayChar(i, char) === char
                    ? "none"
                    : `0 0 20px ${C.accent}`,
              }}
            >
              {getDisplayChar(i, char) || "\u00A0"}
            </span>
          ))}
        </div>

        {/* サブテキスト */}
        <div
          style={{
            fontFamily: font,
            fontSize: 18,
            color: C.gray[500],
            marginTop: 30,
            letterSpacing: 4,
            opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
          }}
        >
          DECODING COMPLETE
        </div>
      </div>
    </AbsoluteFill>
  );
};
