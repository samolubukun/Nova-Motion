/**
 * ThemeNatural - ナチュラル/オーガニック - 自然、アースカラー
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { lerp, font } from "../../common";

export const ThemeNatural = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const leafSway = Math.sin(frame * 0.05) * 5;

  return (
    <AbsoluteFill style={{ background: "#f5f1eb" }}>
      {/* 有機的な形状 */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: -100,
          width: 500,
          height: 500,
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          background: "#d4c5b0",
          opacity: 0.3,
          transform: `rotate(${leafSway}deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -50,
          bottom: -50,
          width: 300,
          height: 300,
          borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
          background: "#8b9a7d",
          opacity: 0.2,
          transform: `rotate(${-leafSway}deg)`,
        }}
      />

      {/* コンテンツ */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "#8b9a7d",
            letterSpacing: 4,
            marginBottom: 20,
            opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
          }}
        >
          ORGANIC • NATURAL • PURE
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 64,
            fontWeight: 300,
            color: "#3d3d3d",
            lineHeight: 1.1,
            opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
          }}
        >
          Back to
          <br />
          <span style={{ fontWeight: 600, color: "#5a6b4d" }}>Nature</span>
        </div>
      </div>

      {/* 葉のアイコン */}
      <svg
        style={{
          position: "absolute",
          right: 150,
          top: "50%",
          transform: `translateY(-50%) rotate(${leafSway}deg)`,
          opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
        }}
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M60 10 C30 30, 20 60, 40 90 C50 100, 70 100, 80 90 C100 60, 90 30, 60 10"
          fill="#8b9a7d"
          opacity="0.6"
        />
        <path
          d="M60 20 L60 100"
          stroke="#5a6b4d"
          strokeWidth="2"
        />
      </svg>
    </AbsoluteFill>
  );
};
