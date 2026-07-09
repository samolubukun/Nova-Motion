/**
 * RollerWave - 波形スライド
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerWave = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const words = ["Design", "Develop", "Deploy", "Delight"];
  const cycleDuration = 28;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const currentWord = words[currentIndex];
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  return (
    <AbsoluteFill style={{ background: "#1a1a2e" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div style={{ fontFamily: font, fontSize: 56, fontWeight: 300, color: C.gray[600] }}>
          We
        </div>

        <div style={{ display: "flex" }}>
          {currentWord.split("").map((char, i) => {
            const charDelay = i * 2;
            const enterY = lerp(cycleT - charDelay, [0, 10], [30, 0], EASE.out);
            const enterOpacity = lerp(cycleT - charDelay, [0, 10], [0, 1], EASE.out);

            const exitStart = cycleDuration - 10 + i * 1;
            const exitY = currentIndex >= finalIndex ? 0 : lerp(cycleT, [exitStart, cycleDuration], [0, -30], EASE.smooth);
            const exitOpacity = currentIndex >= finalIndex ? 1 : lerp(cycleT, [exitStart, cycleDuration], [1, 0], EASE.smooth);

            const y = currentIndex >= finalIndex ? 0 : (cycleT < cycleDuration - 10 ? enterY : exitY);
            const opacity = currentIndex >= finalIndex ? 1 : (cycleT < cycleDuration - 10 ? enterOpacity : exitOpacity);

            return (
              <div
                key={`wave-${currentIndex}-${i}-${char}`}
                style={{
                  fontFamily: font,
                  fontSize: 56,
                  fontWeight: 700,
                  color: "#8b5cf6",
                  transform: `translateY(${y}px)`,
                  opacity,
                }}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
