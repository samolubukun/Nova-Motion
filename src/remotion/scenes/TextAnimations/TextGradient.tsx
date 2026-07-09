/**
 * TextGradient - グラデーションテキスト - 動くグラデーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextGradient = ({ text = "GRADIENT", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const entryProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);
  const gradientOffset = (frame - startDelay) * 2;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${0.8 + entryProgress * 0.2})`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 140,
            fontWeight: 900,
            letterSpacing: -4,
            background: `linear-gradient(
              ${90 + gradientOffset}deg,
              ${C.accent},
              ${C.secondary},
              ${C.tertiary},
              ${C.accent}
            )`,
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: entryProgress,
          }}
        >
          {text}
        </div>
      </div>

      {/* 装飾ライン */}
      {[C.accent, C.secondary, C.tertiary].map((color, i) => (
        <div
          key={`grad-line-${color}`}
          style={{
            position: "absolute",
            left: 100 + i * 150,
            bottom: 150,
            width: 100,
            height: 4,
            background: color,
            opacity: lerp(frame, [startDelay + 30 + i * 10, startDelay + 50 + i * 10], [0, 0.6]),
            borderRadius: 2,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
