/**
 * Text3DFlip - 3Dフリップテキスト - Y軸回転で登場
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { C, font } from "../../common";

export const Text3DFlip = ({ text = "FLIP", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");

  return (
    <AbsoluteFill
      style={{
        background: C.gray[950],
        perspective: 1000,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 8,
          transformStyle: "preserve-3d",
        }}
      >
        {chars.map((char, i) => {
          const delay = startDelay + i * 5;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const rotateY = interpolate(progress, [0, 1], [-90, 0]);
          const scale = interpolate(progress, [0, 0.5, 1], [0.5, 1.1, 1]);

          return (
            <span
              key={`flip-${i}-${char}`}
              style={{
                fontFamily: font,
                fontSize: 130,
                fontWeight: 800,
                color: C.white,
                display: "inline-block",
                transform: `rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* 影 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          transform: "translateX(-50%) rotateX(80deg)",
          fontFamily: font,
          fontSize: 130,
          fontWeight: 800,
          color: C.white,
          opacity: 0.1,
          filter: "blur(10px)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
