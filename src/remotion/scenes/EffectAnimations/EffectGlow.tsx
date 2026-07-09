/**
 * EffectGlow - グロー効果 - 発光
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const EffectGlow = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const pulseIntensity = 0.8 + Math.sin((frame - startDelay) * 0.1) * 0.2;
  const glowSize = 40 + Math.sin((frame - startDelay) * 0.15) * 20;

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
          background: C.accent,
          borderRadius: 100,
          transform: `translate(-50%, -50%) scale(${entryProgress})`,
          filter: `blur(${glowSize}px)`,
          opacity: 0.4 * pulseIntensity,
        }}
      />

      {/* テキスト */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 800,
            color: C.white,
            transform: `scale(${entryProgress})`,
            textShadow: `
              0 0 20px ${C.accent},
              0 0 40px ${C.accent},
              0 0 60px ${C.accent}80
            `,
          }}
        >
          GLOW
        </div>
      </AbsoluteFill>

      {/* パーティクル */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const distance = 200 + Math.sin((frame - startDelay) * 0.05 + i) * 50;
        const x = Math.cos(angle + (frame - startDelay) * 0.01) * distance;
        const y = Math.sin(angle + (frame - startDelay) * 0.01) * distance;

        return (
          <div
            key={`glow-particle-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 8,
              height: 8,
              background: C.accent,
              borderRadius: "50%",
              transform: `translate(${x}px, ${y}px)`,
              opacity: 0.6 * entryProgress,
              boxShadow: `0 0 10px ${C.accent}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
