/**
 * ShapeCircularProgress - 円形プログレス
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ShapeCircularProgress = ({ percentage = 75, startDelay = 0 }: {
  percentage?: number;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const progress = lerp(frame, [startDelay, startDelay + 60], [0, percentage], EASE.out);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 円形プログレス */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(-90deg)",
        }}
        width="300"
        height="300"
        aria-hidden="true"
      >
        {/* 背景円 */}
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke={C.gray[800]}
          strokeWidth="12"
        />
        {/* プログレス円 */}
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke={`url(#progressGradient-${startDelay})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
        <defs>
          <linearGradient id={`progressGradient-${startDelay}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.accent} />
            <stop offset="100%" stopColor={C.secondary} />
          </linearGradient>
        </defs>
      </svg>

      {/* 中央の数字 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
        }}
      >
        {Math.round(progress)}
        <span style={{ fontSize: 40, color: C.gray[500] }}>%</span>
      </div>

      {/* ラベル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 150,
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 18,
          color: C.gray[500],
          letterSpacing: 4,
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        COMPLETION RATE
      </div>
    </AbsoluteFill>
  );
};
