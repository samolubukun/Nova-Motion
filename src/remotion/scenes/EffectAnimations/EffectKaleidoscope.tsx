/**
 * EffectKaleidoscope - 万華鏡エフェクト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const EffectKaleidoscope = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const rotation = (frame - startDelay) * 0.5;
  const segments = 6;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${entryProgress})`,
        }}
      >
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={`kaleidoscope-segment-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 400,
              height: 400,
              transform: `
                translate(-50%, -50%)
                rotate(${(i * 360) / segments + rotation}deg)
              `,
              clipPath: `polygon(50% 50%, 100% 0%, 100% ${100 / segments}%)`,
            }}
          >
            {/* 内部のパターン */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
                  conic-gradient(
                    from ${rotation * 2}deg,
                    ${C.accent},
                    ${C.secondary},
                    ${C.tertiary},
                    ${C.accent}
                  )
                `,
                opacity: 0.8,
              }}
            />

            {/* 形状 */}
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={`shape-${i}-${j}`}
                style={{
                  position: "absolute",
                  left: `${50 + j * 15}%`,
                  top: `${30 + j * 10}%`,
                  width: 30 - j * 8,
                  height: 30 - j * 8,
                  background: j % 2 === 0 ? C.white : C.accent,
                  borderRadius: j % 2 === 0 ? "50%" : "0",
                  transform: `rotate(${rotation * (j + 1)}deg)`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 中央のテキスト */}
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
            fontSize: 40,
            fontWeight: 700,
            color: C.white,
            textShadow: "0 0 20px rgba(0,0,0,0.8)",
            opacity: entryProgress,
          }}
        >
          KALEIDOSCOPE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
