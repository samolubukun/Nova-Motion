/**
 * ThemeBoho - ボーホー/ボヘミアン - 暖色、パターン
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { lerp, font } from "../../common";

export const ThemeBoho = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textOpacity = lerp(frame, [startDelay + 15, startDelay + 35], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "#faf3e8" }}>
      {/* パターン背景 */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #d4a574 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #8b6d5c 2px, transparent 2px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }}
      />

      {/* アーチ装飾 */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 100,
          width: 200,
          height: 300,
          borderRadius: "100px 100px 0 0",
          border: "3px solid #c4956a",
          borderBottom: "none",
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      />

      {/* 太陽モチーフ */}
      <svg
        style={{
          position: "absolute",
          left: 100,
          top: 100,
          opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
        }}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="20" fill="#d4a574" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={`sun-ray-${angle}`}
            x1="40"
            y1="5"
            x2="40"
            y2="15"
            stroke="#d4a574"
            strokeWidth="2"
            transform={`rotate(${angle} 40 40)`}
          />
        ))}
      </svg>

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 150,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "#8b6d5c",
            letterSpacing: 4,
            marginBottom: 15,
          }}
        >
          FREE SPIRIT
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 56,
            fontWeight: 300,
            color: "#5a4a3f",
            lineHeight: 1.1,
          }}
        >
          Bohemian
          <br />
          <span style={{ fontStyle: "italic" }}>Style</span>
        </div>
      </div>

      {/* 植物装飾 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          width: 60,
          height: 100,
          borderLeft: "2px solid #7d8b6a",
          borderBottom: "2px solid #7d8b6a",
          borderBottomLeftRadius: 30,
          opacity: textOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
