/**
 * ShapeMorphing - モーフィングシェイプ - 形が変化
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ShapeMorphing = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // 0-1の周期的な値
  const cycle = (frame - startDelay) % 120;
  const morphProgress = cycle < 60
    ? lerp(cycle, [0, 60], [0, 1], EASE.out)
    : lerp(cycle, [60, 120], [1, 0], EASE.out);

  // 形状間の補間
  const borderRadius = interpolate(morphProgress, [0, 0.5, 1], [50, 20, 0]);
  const rotation = (frame - startDelay) * 0.5;
  const scale = 1 + Math.sin((frame - startDelay) * 0.05) * 0.1;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 影 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          width: 250,
          height: 250,
          background: C.accent,
          borderRadius: `${borderRadius}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
          filter: "blur(60px)",
          opacity: 0.3,
        }}
      />

      {/* メインシェイプ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 250,
          height: 250,
          background: `linear-gradient(135deg, ${C.accent}, ${C.secondary})`,
          borderRadius: `${borderRadius}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        }}
      />

      {/* ラベル */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          fontFamily: font,
          fontSize: 60,
          fontWeight: 700,
          color: C.white,
        }}
      >
        MORPH
      </div>

      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 16,
          color: C.gray[500],
        }}
      >
        {morphProgress < 0.33 ? "CIRCLE" : morphProgress < 0.66 ? "ROUNDED" : "SQUARE"}
      </div>
    </AbsoluteFill>
  );
};
