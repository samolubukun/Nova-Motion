/**
 * RollerBlur - ブラー切り替え
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerBlur = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const words = ["Creative", "Innovative", "Powerful", "Elegant"];
  const cycleDuration = 30;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const enterBlur = lerp(cycleT, [0, 10], [20, 0], EASE.out);
  const exitBlur = currentIndex >= finalIndex ? 0 : lerp(cycleT, [cycleDuration - 10, cycleDuration], [0, 20], EASE.smooth);
  const blur = Math.max(enterBlur, exitBlur);

  const enterOpacity = lerp(cycleT, [0, 10], [0, 1], EASE.out);
  const exitOpacity = currentIndex >= finalIndex ? 1 : lerp(cycleT, [cycleDuration - 10, cycleDuration], [1, 0], EASE.smooth);
  const opacity = Math.min(enterOpacity, exitOpacity);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            fontWeight: 500,
            color: C.gray[400],
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          SOLUTIONS THAT ARE
        </div>

        {/* ブラーローラー */}
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 800,
            color: C.gray[900],
            filter: `blur(${blur}px)`,
            opacity,
          }}
        >
          {words[currentIndex]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
