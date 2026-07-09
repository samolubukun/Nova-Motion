/**
 * TextGlitch - グリッチテキスト - デジタルグリッチ効果
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextGlitch = ({ text = "GLITCH", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const entryProgress = lerp(frame, [startDelay, startDelay + 20], [0, 1], EASE.out);
  const glitchActive = frame > startDelay + 25 && random(`glitch-${frame}`) < 0.15;

  const offsetX = glitchActive ? (random(`gx-${frame}`) - 0.5) * 30 : 0;
  const offsetY = glitchActive ? (random(`gy-${frame}`) - 0.5) * 10 : 0;
  const skew = glitchActive ? (random(`gs-${frame}`) - 0.5) * 8 : 0;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 赤チャンネル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${offsetX + 3}px, ${offsetY}px)`,
          fontFamily: font,
          fontSize: 140,
          fontWeight: 900,
          color: "rgba(255, 0, 0, 0.8)",
          mixBlendMode: "screen",
          opacity: glitchActive ? 1 : 0,
        }}
      >
        {text}
      </div>

      {/* シアンチャンネル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${-offsetX - 3}px, ${-offsetY}px)`,
          fontFamily: font,
          fontSize: 140,
          fontWeight: 900,
          color: "rgba(0, 255, 255, 0.8)",
          mixBlendMode: "screen",
          opacity: glitchActive ? 1 : 0,
        }}
      >
        {text}
      </div>

      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `
            translate(-50%, -50%)
            translate(${offsetX}px, ${offsetY}px)
            skewX(${skew}deg)
            scale(${entryProgress})
          `,
          fontFamily: font,
          fontSize: 140,
          fontWeight: 900,
          color: C.white,
        }}
      >
        {text}
      </div>

      {/* スキャンライン */}
      {glitchActive && (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.3) 2px,
              rgba(0, 0, 0, 0.3) 4px
            )`,
          }}
        />
      )}

      {/* ノイズバー */}
      {glitchActive && (
        <>
          {[10, 40, 70].map((offset) => (
            <div
              key={`noise-bar-${offset}`}
              style={{
                position: "absolute",
                left: 0,
                top: `${random(`nb-${frame}-${offset}`) * 100}%`,
                width: "100%",
                height: random(`nbh-${frame}-${offset}`) * 20 + 5,
                background: C.white,
                opacity: 0.1,
              }}
            />
          ))}
        </>
      )}
    </AbsoluteFill>
  );
};
