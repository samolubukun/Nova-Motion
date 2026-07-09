/**
 * TransitionFlash - フラッシュトランジション
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, font } from "../../common";

export const TransitionFlash = ({ startDelay = 0, flashColor = C.white }: {
  startDelay?: number;
  flashColor?: string;
}) => {
  const frame = useCurrentFrame();

  const phase1 = frame < startDelay + 15;
  const flashPhase = frame >= startDelay + 15 && frame < startDelay + 25;
  const phase2 = frame >= startDelay + 25;

  const flashIntensity = flashPhase
    ? interpolate(frame, [startDelay + 15, startDelay + 20, startDelay + 25], [0, 1, 0])
    : 0;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* シーン1 */}
      {phase1 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: font, fontSize: 80, fontWeight: 700, color: C.white }}>
            BEFORE
          </div>
        </AbsoluteFill>
      )}

      {/* シーン2 */}
      {phase2 && (
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
            AFTER
          </div>
        </AbsoluteFill>
      )}

      {/* フラッシュ */}
      <AbsoluteFill
        style={{
          background: flashColor,
          opacity: flashIntensity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
