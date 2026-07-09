/**
 * EffectLightLeak - ライトリーク - 光漏れ効果
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, lerp, font } from "../../common";

export const EffectLightLeak = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const leak1X = lerp(frame, [startDelay, startDelay + 80], [-20, 120]);
  const leak2X = lerp(frame, [startDelay + 20, startDelay + 100], [120, -20]);
  const leak1Opacity = interpolate(
    frame,
    [startDelay, startDelay + 30, startDelay + 60, startDelay + 80],
    [0, 0.6, 0.6, 0]
  );
  const leak2Opacity = interpolate(
    frame,
    [startDelay + 20, startDelay + 50, startDelay + 80, startDelay + 100],
    [0, 0.5, 0.5, 0]
  );

  return (
    <AbsoluteFill style={{ background: C.black }}>
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
            fontSize: 80,
            fontWeight: 700,
            color: C.white,
            opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
          }}
        >
          LIGHT LEAKS
        </div>
      </AbsoluteFill>

      {/* ライトリーク1（オレンジ） */}
      <div
        style={{
          position: "absolute",
          left: `${leak1X}%`,
          top: "20%",
          width: 400,
          height: 600,
          background: `radial-gradient(ellipse, rgba(255, 150, 50, 0.8) 0%, transparent 70%)`,
          transform: "rotate(-20deg)",
          opacity: leak1Opacity,
          mixBlendMode: "screen",
          filter: "blur(40px)",
        }}
      />

      {/* ライトリーク2（マゼンタ） */}
      <div
        style={{
          position: "absolute",
          left: `${leak2X}%`,
          bottom: "10%",
          width: 500,
          height: 500,
          background: `radial-gradient(ellipse, rgba(255, 50, 150, 0.7) 0%, transparent 70%)`,
          transform: "rotate(30deg)",
          opacity: leak2Opacity,
          mixBlendMode: "screen",
          filter: "blur(60px)",
        }}
      />

      {/* フレア */}
      <div
        style={{
          position: "absolute",
          left: `${leak1X + 10}%`,
          top: "40%",
          width: 200,
          height: 200,
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`,
          opacity: leak1Opacity * 0.5,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
