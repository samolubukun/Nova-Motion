/**
 * EffectChromaticAberration - 色収差 - クロマティックアベレーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const EffectChromaticAberration = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const aberrationAmount = Math.sin((frame - startDelay) * 0.1) * 8 + 8;
  const textOpacity = lerp(frame, [startDelay, startDelay + 20], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 赤チャンネル */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${aberrationAmount}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: "rgba(255, 0, 0, 0.7)",
            mixBlendMode: "screen",
            opacity: textOpacity,
          }}
        >
          CHROMATIC
        </div>
      </AbsoluteFill>

      {/* 緑チャンネル */}
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
            fontWeight: 900,
            color: "rgba(0, 255, 0, 0.7)",
            mixBlendMode: "screen",
            opacity: textOpacity,
          }}
        >
          CHROMATIC
        </div>
      </AbsoluteFill>

      {/* 青チャンネル */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${-aberrationAmount}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: "rgba(0, 0, 255, 0.7)",
            mixBlendMode: "screen",
            opacity: textOpacity,
          }}
        >
          CHROMATIC
        </div>
      </AbsoluteFill>

      {/* サブテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 150,
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 18,
          color: C.gray[500],
          letterSpacing: 6,
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        ABERRATION EFFECT
      </div>
    </AbsoluteFill>
  );
};
