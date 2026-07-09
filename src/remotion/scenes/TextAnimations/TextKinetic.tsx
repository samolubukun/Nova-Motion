/**
 * TextKinetic - キネティックタイポグラフィ - 文字が踊る
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextKinetic = ({ text = "KINETIC", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 8,
        }}
      >
        {chars.map((char, i) => {
          const delay = startDelay + i * 3;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 200, mass: 0.8 },
          });

          const bounce = Math.sin((frame - delay) * 0.15) * 5 * progress;
          const rotate = Math.sin((frame - delay) * 0.1 + i) * 3 * progress;

          return (
            <span
              key={`kinetic-${i}-${char}`}
              style={{
                fontFamily: font,
                fontSize: 120,
                fontWeight: 800,
                color: C.white,
                display: "inline-block",
                transform: `
                  translateY(${interpolate(progress, [0, 1], [80, 0]) + bounce}px)
                  rotate(${rotate}deg)
                  scale(${progress})
                `,
                opacity: progress,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* アンダーライン */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "35%",
          transform: "translateX(-50%)",
          width: lerp(frame, [startDelay + 30, startDelay + 50], [0, 400], EASE.out),
          height: 6,
          background: C.accent,
          borderRadius: 3,
        }}
      />
    </AbsoluteFill>
  );
};
