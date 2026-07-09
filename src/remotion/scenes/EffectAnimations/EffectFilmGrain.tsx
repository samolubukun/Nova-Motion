/**
 * EffectFilmGrain - フィルムグレイン - 映画風ノイズ
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const EffectFilmGrain = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // グレイン生成
  const grainSeed = Math.floor(frame * 2);
  const grainPatterns = Array.from({ length: 100 }).map((_, i) => ({
    id: `grain-${i}`,
    x: random(`grain-x-${grainSeed}-${i}`) * 100,
    y: random(`grain-y-${grainSeed}-${i}`) * 100,
    opacity: random(`grain-o-${grainSeed}-${i}`) * 0.15,
    size: random(`grain-s-${grainSeed}-${i}`) * 3 + 1,
  }));

  const textOpacity = lerp(frame, [startDelay, startDelay + 30], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* コンテンツ */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 800,
            color: C.white,
            opacity: textOpacity,
          }}
        >
          CINEMATIC
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            color: C.gray[500],
            letterSpacing: 8,
            marginTop: 20,
            opacity: textOpacity,
          }}
        >
          FILM GRAIN EFFECT
        </div>
      </AbsoluteFill>

      {/* グレインオーバーレイ */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {grainPatterns.map((grain) => (
          <div
            key={grain.id}
            style={{
              position: "absolute",
              left: `${grain.x}%`,
              top: `${grain.y}%`,
              width: grain.size,
              height: grain.size,
              background: C.white,
              borderRadius: "50%",
              opacity: grain.opacity,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* スキャンライン */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* ビネット */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
