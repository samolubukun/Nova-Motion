/**
 * TextNeon - ネオンテキスト - グロウ効果
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextNeon = ({ text = "NEON", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const entryProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);
  const flicker = frame > startDelay + 30
    ? 0.8 + random(`neon-${Math.floor(frame / 3)}`) * 0.2
    : entryProgress;

  const glowIntensity = flicker * 40;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 背景グロー */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 600,
          height: 200,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${C.accent}30 0%, transparent 70%)`,
          opacity: flicker,
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${0.8 + entryProgress * 0.2})`,
          fontFamily: font,
          fontSize: 140,
          fontWeight: 700,
          color: C.white,
          textShadow: `
            0 0 10px ${C.accent},
            0 0 20px ${C.accent},
            0 0 ${glowIntensity}px ${C.accent},
            0 0 ${glowIntensity * 2}px ${C.accent}
          `,
          opacity: flicker,
        }}
      >
        {text}
      </div>

      {/* サブテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "30%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 20,
          color: C.secondary,
          letterSpacing: 8,
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, flicker]),
          textShadow: `0 0 10px ${C.secondary}`,
        }}
      >
        LIGHTS ON
      </div>
    </AbsoluteFill>
  );
};
