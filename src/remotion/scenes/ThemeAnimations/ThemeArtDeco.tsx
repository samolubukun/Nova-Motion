/**
 * ThemeArtDeco - Art Deco - アールデコ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ThemeArtDeco = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const goldOpacity = lerp(frame, [startDelay, startDelay + 30], [0, 1]);
  const fanScale = lerp(frame, [startDelay + 10, startDelay + 40], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: "#1a1a2e" }}>
      {/* 放射状パターン */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${fanScale})`,
        }}
        width="600"
        height="600"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
      >
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((angle) => (
          <path
            key={`deco-fan-${angle}`}
            d="M300 300 L300 50 L350 100 Z"
            fill="#d4af37"
            fillOpacity="0.3"
            transform={`rotate(${angle} 300 300)`}
          />
        ))}
        {/* 中心円 */}
        <circle cx="300" cy="300" r="80" stroke="#d4af37" strokeWidth="2" fill="none" />
        <circle cx="300" cy="300" r="60" stroke="#d4af37" strokeWidth="1" fill="none" />
        <circle cx="300" cy="300" r="100" stroke="#d4af37" strokeWidth="3" fill="none" />
      </svg>

      {/* コーナー装飾 */}
      <svg
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          opacity: goldOpacity,
        }}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#d4af37" />
        <path d="M30 30 L60 30 L60 35 L35 35 L35 60 L30 60 Z" fill="#d4af37" />
      </svg>
      <svg
        style={{
          position: "absolute",
          right: 40,
          bottom: 40,
          transform: "rotate(180deg)",
          opacity: goldOpacity,
        }}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#d4af37" />
        <path d="M30 30 L60 30 L60 35 L35 35 L35 60 L30 60 Z" fill="#d4af37" />
      </svg>

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: goldOpacity,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: "#d4af37",
            letterSpacing: 8,
            marginBottom: 15,
          }}
        >
          THE ROARING
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 100,
            color: C.white,
            letterSpacing: 20,
          }}
        >
          1920
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "#d4af37",
            letterSpacing: 6,
            marginTop: 15,
          }}
        >
          ART DECO STYLE
        </div>
      </div>

      {/* 縦線装飾 */}
      {[-150, -75, 75, 150].map((offset) => (
        <div
          key={`deco-line-${offset}`}
          style={{
            position: "absolute",
            left: `calc(50% + ${offset}px)`,
            top: 0,
            width: 1,
            height: lerp(frame, [startDelay + 20, startDelay + 50], [0, 100]) + "%",
            background: "linear-gradient(180deg, #d4af37, transparent)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
