/**
 * TextWave - 波形テキスト - 文字が波のように動く
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const TextWave = ({ text = "WAVE MOTION", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
        }}
      >
        {chars.map((char, i) => {
          const delay = startDelay + i * 2;
          const entryProgress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 180 },
          });

          // 波動
          const waveY = Math.sin((frame - startDelay) * 0.1 + i * 0.5) * 15;
          const waveRotate = Math.sin((frame - startDelay) * 0.08 + i * 0.3) * 5;

          return (
            <span
              key={`wave-${i}-${char}`}
              style={{
                fontFamily: font,
                fontSize: 100,
                fontWeight: 700,
                color: C.white,
                display: "inline-block",
                transform: `
                  translateY(${interpolate(entryProgress, [0, 1], [60, 0]) + waveY * entryProgress}px)
                  rotate(${waveRotate * entryProgress}deg)
                `,
                opacity: entryProgress,
                marginRight: char === " " ? 30 : 2,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {/* 下部の波線 */}
      <svg
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          width: "100%",
          height: 60,
        }}
        aria-hidden="true"
      >
        <path
          d={`M 0 30 ${Array.from({ length: 20 })
            .map((_, i) => {
              const x = i * 70;
              const y = 30 + Math.sin((frame * 0.1 + i) * 0.5) * 15;
              return `Q ${x + 35} ${y + (i % 2 === 0 ? 20 : -20)} ${x + 70} ${y}`;
            })
            .join(" ")}`}
          stroke={C.accent}
          strokeWidth="3"
          fill="none"
          opacity={lerp(frame, [startDelay + 20, startDelay + 40], [0, 0.6])}
        />
      </svg>
    </AbsoluteFill>
  );
};
