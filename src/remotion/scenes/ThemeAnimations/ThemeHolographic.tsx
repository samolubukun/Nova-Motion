/**
 * ThemeHolographic - Holographic - ホログラフィック
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { lerp, font } from "../../common";

export const ThemeHolographic = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const shimmer = (frame - startDelay) * 3;
  const textOpacity = lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "#1a1a2e" }}>
      {/* ホログラフィック背景 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(
              ${shimmer}deg,
              rgba(255, 0, 128, 0.3) 0%,
              rgba(0, 255, 255, 0.3) 25%,
              rgba(255, 255, 0, 0.3) 50%,
              rgba(128, 0, 255, 0.3) 75%,
              rgba(255, 0, 128, 0.3) 100%
            )
          `,
          opacity: 0.5,
        }}
      />

      {/* プリズムカード */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          height: 300,
          borderRadius: 20,
          background: `
            linear-gradient(
              ${shimmer + 45}deg,
              rgba(255, 100, 200, 0.4) 0%,
              rgba(100, 200, 255, 0.4) 33%,
              rgba(200, 255, 100, 0.4) 66%,
              rgba(255, 100, 200, 0.4) 100%
            )
          `,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: 40,
          opacity: textOpacity,
        }}
      >
        {/* 虹色ライン */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            height: 3,
            background: `linear-gradient(90deg, #ff0080, #00ffff, #ffff00, #ff0080)`,
            backgroundSize: "200% 100%",
            backgroundPosition: `${shimmer}% 0`,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            marginTop: 40,
            fontFamily: font,
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            letterSpacing: 3,
          }}
        >
          IRIDESCENT
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 56,
            fontWeight: 700,
            background: `linear-gradient(${shimmer}deg, #ff0080, #00ffff, #ffff00)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 10,
          }}
        >
          HOLOGRAM
        </div>
      </div>
    </AbsoluteFill>
  );
};
