/**
 * RollerScaleBounce - スケールバウンス
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerScaleBounce = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Build", "Ship", "Scale", "Grow"];
  const cycleDuration = 25;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const enterProgress = spring({
    frame: cycleT,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const exitProgress = currentIndex >= finalIndex
    ? 1
    : lerp(cycleT, [cycleDuration - 6, cycleDuration], [1, 0], EASE.smooth);

  const scale = enterProgress * exitProgress;

  return (
    <AbsoluteFill style={{ background: C.accent }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "baseline",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 60,
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Let&apos;s
        </div>

        {/* スケールローラー */}
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 800,
            color: C.white,
            transform: `scale(${scale})`,
            transformOrigin: "left bottom",
          }}
        >
          {words[currentIndex]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
