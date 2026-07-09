/**
 * TransitionGlitch - グリッチトランジション
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, font } from "../../common";

export const TransitionGlitch = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const glitchPhase = frame >= startDelay && frame < startDelay + 30;
  const transitionComplete = frame >= startDelay + 30;

  const slices = 15;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 背景シーン */}
      {!transitionComplete && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: font, fontSize: 80, fontWeight: 700, color: C.white }}>
            SCENE 1
          </div>
        </AbsoluteFill>
      )}

      {/* グリッチスライス */}
      {glitchPhase &&
        Array.from({ length: slices }).map((_, i) => {
          const sliceHeight = 100 / slices;
          const offsetX = (random(`glitch-x-${frame}-${i}`) - 0.5) * 100;
          const showSlice = random(`glitch-show-${frame}-${i}`) > 0.3;

          return (
            <div
              key={`glitch-slice-${i}`}
              style={{
                position: "absolute",
                left: 0,
                top: `${i * sliceHeight}%`,
                width: "100%",
                height: `${sliceHeight + 1}%`,
                background: random(`glitch-bg-${frame}-${i}`) > 0.5 ? C.accent : C.secondary,
                transform: `translateX(${offsetX}px)`,
                opacity: showSlice ? 0.8 : 0,
              }}
            />
          );
        })}

      {/* 新しいシーン */}
      {transitionComplete && (
        <AbsoluteFill
          style={{
            background: C.gray[950],
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
            SCENE 2
          </div>
        </AbsoluteFill>
      )}

      {/* RGBずれ */}
      {glitchPhase && (
        <>
          <AbsoluteFill
            style={{
              background: "rgba(255, 0, 0, 0.3)",
              mixBlendMode: "screen",
              transform: `translateX(${(random(`rgb-r-${frame}`) - 0.5) * 20}px)`,
            }}
          />
          <AbsoluteFill
            style={{
              background: "rgba(0, 255, 255, 0.3)",
              mixBlendMode: "screen",
              transform: `translateX(${(random(`rgb-c-${frame}`) - 0.5) * -20}px)`,
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
