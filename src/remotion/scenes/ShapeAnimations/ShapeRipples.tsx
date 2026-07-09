/**
 * ShapeRipples - 波紋エフェクト - 水面の波紋
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ShapeRipples = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const ripples = [0, 20, 40, 60, 80].map((delay) => {
    const localFrame = (frame - startDelay - delay + 100) % 100;
    const size = localFrame * 8;
    const opacity = 1 - localFrame / 100;
    return { size, opacity, delay };
  });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 波紋 */}
      {ripples.map((ripple, i) => (
        <div
          key={`ripple-${i}-${ripple.delay}`}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: ripple.size,
            height: ripple.size,
            border: `2px solid ${C.accent}`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            opacity: ripple.opacity * (frame > startDelay ? 1 : 0),
          }}
        />
      ))}

      {/* 中央のドット */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 16,
          height: 16,
          background: C.accent,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 30px ${C.accent}`,
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 150,
          fontFamily: font,
          fontSize: 80,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
        }}
      >
        RIPPLE
      </div>
    </AbsoluteFill>
  );
};
