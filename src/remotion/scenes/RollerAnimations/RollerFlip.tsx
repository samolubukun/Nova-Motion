/**
 * RollerFlip - フリップ（カードめくり風）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { font } from "../../common";

const C = {
  light: "#fafafa",
  dark: "#1a1a1a",
  gray: { 600: "#666666", 400: "#999999" },
};

export const RollerFlip = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Ideas", "Dreams", "Goals", "Reality"];
  const cycleDuration = 30;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const nextIndex = Math.min(currentIndex + 1, finalIndex);
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const flipProgress = spring({
    frame: cycleT,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const rotation = currentIndex >= finalIndex ? 0 : flipProgress * 180;
  const showNext = rotation > 90;
  const displayWord = currentIndex >= finalIndex
    ? words[finalIndex]
    : showNext ? words[nextIndex] : words[currentIndex];

  return (
    <AbsoluteFill style={{ background: C.light }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: font, fontSize: 24, fontWeight: 400, color: C.gray[600], marginBottom: 10 }}>
          Turn your
        </div>

        <div style={{ perspective: "1000px", height: 80 }}>
          <div
            style={{
              fontFamily: font,
              fontSize: 72,
              fontWeight: 800,
              color: C.dark,
              transform: `rotateX(${showNext ? 180 - rotation : -rotation}deg)`,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {displayWord}
          </div>
        </div>

        <div style={{ fontFamily: font, fontSize: 24, fontWeight: 400, color: C.gray[600], marginTop: 10 }}>
          into success
        </div>
      </div>

      <div style={{ position: "absolute", right: 60, bottom: 60, fontFamily: font, fontSize: 12, color: C.gray[400], letterSpacing: 2 }}>
        FLIP TRANSITION
      </div>
    </AbsoluteFill>
  );
};
