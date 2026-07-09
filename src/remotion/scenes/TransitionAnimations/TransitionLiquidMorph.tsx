/**
 * TransitionLiquidMorph - リキッドモーフ - 液体状に変形
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TransitionLiquidMorph = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const morphProgress = lerp(frame, [startDelay, startDelay + 50], [0, 1], EASE.inOut);

  // 波形のパス生成
  const generateWavePath = (progress: number, amplitude: number) => {
    const points = 20;
    const yBase = 100 - progress * 100;

    let path = `M 0 100 L 0 ${yBase}`;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * 100;
      const wave = Math.sin((i / points) * Math.PI * 4 + frame * 0.1) * amplitude * (1 - progress);
      const y = yBase + wave;
      path += ` L ${x} ${y}`;
    }

    path += ` L 100 100 Z`;
    return path;
  };

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 古いシーン */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: font, fontSize: 80, fontWeight: 700, color: C.gray[800] }}>
          LIQUID
        </div>
      </AbsoluteFill>

      {/* 液体オーバーレイ */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={C.accent} />
            <stop offset="100%" stopColor={C.secondary} />
          </linearGradient>
        </defs>
        <path d={generateWavePath(morphProgress, 8)} fill="url(#liquidGrad)" />
      </svg>

      {/* 新しいシーン */}
      {morphProgress > 0.5 && (
        <AbsoluteFill
          style={{
            clipPath: `inset(${(1 - morphProgress) * 200}% 0 0 0)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 80,
              fontWeight: 700,
              color: C.white,
            }}
          >
            MORPH
          </div>
        </AbsoluteFill>
      )}

      {/* 泡 */}
      {morphProgress > 0.2 && morphProgress < 0.8 && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const x = random(`bubble-x-${i}`) * 80 + 10;
            const bubbleFrame = (frame - startDelay - 10 + i * 5) % 40;
            const y = 100 - bubbleFrame * 3;
            const size = random(`bubble-s-${i}`) * 20 + 10;

            return (
              <div
                key={`bubble-${i}`}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  border: `2px solid ${C.white}40`,
                  borderRadius: "50%",
                  opacity: y > 20 && y < 80 ? 0.6 : 0,
                }}
              />
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
