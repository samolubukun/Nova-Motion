/**
 * TransitionLineSweep - ラインスイープ - 複数の線が横切る
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TransitionLineSweep = ({ startDelay = 0, lineCount = 5 }: {
  startDelay?: number;
  lineCount?: number;
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景 */}
      <AbsoluteFill style={{ background: C.black }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: font,
            fontSize: 60,
            color: C.gray[800],
          }}
        >
          SWEEPING
        </div>
      </AbsoluteFill>

      {/* ライン */}
      {Array.from({ length: lineCount }).map((_, i) => {
        const delay = i * 8;
        const progress = lerp(
          frame,
          [startDelay + delay, startDelay + delay + 25],
          [-20, 120],
          EASE.out
        );

        const thickness = 80 - i * 12;
        const colors = [C.accent, C.secondary, C.tertiary, C.white, C.gray[500]];

        return (
          <div
            key={`sweep-line-${i}`}
            style={{
              position: "absolute",
              left: `${progress}%`,
              top: 0,
              width: thickness,
              height: "100%",
              background: colors[i % colors.length],
              transform: "skewX(-15deg)",
              opacity: 0.9,
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 1]),
        }}
      >
        LINES
      </div>
    </AbsoluteFill>
  );
};
