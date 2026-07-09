/**
 * ThemeNeon - Neon - ネオン
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeNeon = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const flicker = Math.sin((frame - startDelay) * 0.5) > 0.95 ? 0.7 : 1;
  const glowPulse = 0.8 + Math.sin((frame - startDelay) * 0.1) * 0.2;
  const textOpacity = lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* レンガ壁テクスチャ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(90deg, #1a1a1a 1px, transparent 1px),
            linear-gradient(0deg, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: "60px 25px",
          opacity: 0.3,
        }}
      />

      {/* ネオンテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: textOpacity * flicker,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 700,
            color: "#ff00ff",
            textShadow: `
              0 0 10px #ff00ff,
              0 0 20px #ff00ff,
              0 0 40px #ff00ff,
              0 0 80px #ff00ff
            `,
            filter: `brightness(${glowPulse})`,
          }}
        >
          NEON
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 40,
            fontWeight: 300,
            color: "#00ffff",
            textShadow: `
              0 0 10px #00ffff,
              0 0 20px #00ffff,
              0 0 40px #00ffff
            `,
            marginTop: 20,
            filter: `brightness(${glowPulse})`,
          }}
        >
          LIGHTS
        </div>
      </div>

      {/* 装飾ネオン */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 100,
          width: 150,
          height: 150,
          border: "3px solid #ff6b6b",
          borderRadius: "50%",
          boxShadow: `
            0 0 10px #ff6b6b,
            0 0 20px #ff6b6b,
            inset 0 0 10px #ff6b6b
          `,
          opacity: textOpacity * flicker,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 100,
          width: 200,
          height: 3,
          background: "#ffe66d",
          boxShadow: `
            0 0 10px #ffe66d,
            0 0 20px #ffe66d
          `,
          opacity: textOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
