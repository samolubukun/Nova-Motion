/**
 * EffectNoise - ノイズテクスチャ - TVノイズ
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const EffectNoise = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const noiseSeed = frame;
  const noiseIntensity = lerp(frame, [startDelay, startDelay + 20], [1, 0.3]);

  // ノイズパターン生成
  const noiseLines = Array.from({ length: 50 }).map((_, i) => ({
    y: random(`noise-y-${noiseSeed}-${i}`) * 100,
    opacity: random(`noise-o-${noiseSeed}-${i}`) * 0.3,
    width: random(`noise-w-${noiseSeed}-${i}`) * 100,
  }));

  const textOpacity = lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* ノイズオーバーレイ */}
      <AbsoluteFill
        style={{
          opacity: noiseIntensity,
        }}
      >
        {noiseLines.map((line, i) => (
          <div
            key={`noise-${i}`}
            style={{
              position: "absolute",
              left: 0,
              top: `${line.y}%`,
              width: `${line.width}%`,
              height: 2,
              background: C.white,
              opacity: line.opacity,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* コンテンツ */}
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
            fontSize: 100,
            fontWeight: 800,
            color: C.white,
            opacity: textOpacity,
            textShadow: `
              ${random(`shadow-x-${frame}`) * 4 - 2}px 0 0 ${C.secondary},
              ${random(`shadow-x2-${frame}`) * -4 + 2}px 0 0 ${C.accent}
            `,
          }}
        >
          STATIC
        </div>
      </AbsoluteFill>

      {/* スキャンライン */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: `${((frame * 3) % 100)}%`,
          width: "100%",
          height: 4,
          background: `linear-gradient(to right, transparent, ${C.white}20, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
