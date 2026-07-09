/**
 * RollerTypewriter - タイプライター置換
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, font } from "../../common";

export const RollerTypewriter = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const words = ["amazing", "stunning", "powerful", "seamless"];
  const cycleDuration = 35;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const currentWord = words[currentIndex];
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const deleteEnd = 12;
  const typeStart = 15;

  let displayText = "";
  let showCursor = true;

  if (currentIndex >= finalIndex) {
    // 最終状態：全文字表示、カーソル点滅
    displayText = currentWord;
    showCursor = Math.floor(frame / 15) % 2 === 0;
  } else if (cycleT < deleteEnd) {
    const prevWord = words[Math.max(0, currentIndex - 1)];
    const charsToShow = Math.max(0, prevWord.length - Math.floor(cycleT * 1.2));
    displayText = prevWord.slice(0, charsToShow);
  } else if (cycleT >= typeStart) {
    const charsTyped = Math.min(currentWord.length, Math.floor((cycleT - typeStart) * 0.8));
    displayText = currentWord.slice(0, charsTyped);
    showCursor = charsTyped < currentWord.length || Math.floor(frame / 8) % 2 === 0;
  }

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
            fontFamily: font,
            fontSize: 48,
            fontWeight: 400,
            color: C.white,
          }}
        >
          Create something{" "}
          <span style={{ color: C.success }}>
            {displayText}
            {showCursor && (
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: 48,
                  background: C.success,
                  marginLeft: 2,
                  verticalAlign: "middle",
                }}
              />
            )}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
