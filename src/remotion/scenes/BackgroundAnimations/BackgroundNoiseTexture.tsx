/**
 * BackgroundNoiseTexture - ノイズテクスチャ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundNoiseTexture = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const noiseSeed = Math.floor(frame / 2);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${C.accent}80, ${C.secondary}80)`,
      }}
    >
      {/* ノイズオーバーレイ */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${noiseSeed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.15,
          mixBlendMode: "overlay",
        }}
      />

      {/* グレインオーバーレイ */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(255, 255, 255, 0.03) 1px,
            rgba(255, 255, 255, 0.03) 2px
          )`,
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 100,
          fontWeight: 900,
          color: C.white,
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        TEXTURE
      </div>
    </AbsoluteFill>
  );
};
