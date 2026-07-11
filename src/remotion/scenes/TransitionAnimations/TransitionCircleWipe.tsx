/**
 * TransitionCircleWipe - Circle Wipe - Spreads in Circle
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TransitionCircleWipe = ({ labelA = "OLD CONTENT", labelB = "REVEAL", startDelay = 0, originX = 50, originY = 50 }: {
  labelA?: string;
  labelB?: string;
  startDelay?: number;
  originX?: number;
  originY?: number;
}) => {
  const frame = useCurrentFrame();

  const progress = lerp(frame, [startDelay, startDelay + 40], [0, 150], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: font, fontSize: 60, color: C.gray[700] }}>
          {labelA}
        </div>
      </AbsoluteFill>

      {/* New Content */}
      <AbsoluteFill
        style={{
          background: C.accent,
          clipPath: `circle(${progress}% at ${originX}% ${originY}%)`,
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
          }}
        >
          {labelB}
        </div>
      </AbsoluteFill>

      {/* Edge Ring */}
      <div
        style={{
          position: "absolute",
          left: `${originX}%`,
          top: `${originY}%`,
          width: progress * 15,
          height: progress * 15,
          border: `4px solid ${C.white}`,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          opacity: progress < 100 ? 0.5 : 0,
        }}
      />
    </AbsoluteFill>
  );
};
