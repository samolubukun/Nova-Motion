/**
 * RollerDrum - 回転ドラム
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const RollerDrum = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Today", "Tomorrow", "Forever", "Always"];
  const cycleDuration = 28;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const rotationProgress = spring({ frame: cycleT, fps, config: { damping: 15, stiffness: 150 } });

  const anglePerItem = 90;
  const baseRotation = currentIndex >= finalIndex
    ? finalIndex * anglePerItem
    : currentIndex * anglePerItem + rotationProgress * anglePerItem;

  return (
    <AbsoluteFill style={{ background: C.gray[900] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 300,
            color: C.gray[400],
          }}
        >
          Start
        </div>

        {/* 3Dドラム */}
        <div
          style={{
            perspective: "500px",
            height: 80,
            width: 300,
          }}
        >
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(-${baseRotation}deg)`,
              height: "100%",
              position: "relative",
            }}
          >
            {words.map((word, i) => {
              const angle = i * anglePerItem;
              const zOffset = 100;

              return (
                <div
                  key={`drum-${word}`}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: font,
                    fontSize: 56,
                    fontWeight: 700,
                    color: C.tertiary,
                    transform: `rotateX(${angle}deg) translateZ(${zOffset}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
