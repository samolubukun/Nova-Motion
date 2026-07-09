/**
 * LayoutFrameInFrame - フレーム・イン・フレーム
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const LayoutFrameInFrame = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outerProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const innerProgress = spring({
    frame: frame - startDelay - 15,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 外側のフレーム */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          right: 40,
          bottom: 40,
          border: `1px solid ${C.gray[800]}`,
          transform: `scale(${outerProgress})`,
          opacity: outerProgress,
        }}
      >
        {/* コーナー装飾 */}
        <div style={{ position: "absolute", left: -1, top: -1, width: 30, height: 30, borderLeft: `3px solid ${C.accent}`, borderTop: `3px solid ${C.accent}` }} />
        <div style={{ position: "absolute", right: -1, top: -1, width: 30, height: 30, borderRight: `3px solid ${C.accent}`, borderTop: `3px solid ${C.accent}` }} />
        <div style={{ position: "absolute", left: -1, bottom: -1, width: 30, height: 30, borderLeft: `3px solid ${C.accent}`, borderBottom: `3px solid ${C.accent}` }} />
        <div style={{ position: "absolute", right: -1, bottom: -1, width: 30, height: 30, borderRight: `3px solid ${C.accent}`, borderBottom: `3px solid ${C.accent}` }} />
      </div>

      {/* 内側のフレーム */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 120,
          right: 120,
          bottom: 120,
          border: `2px solid ${C.white}`,
          transform: `scale(${innerProgress})`,
          opacity: innerProgress,
        }}
      >
        {/* コンテンツ */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[500],
              letterSpacing: 6,
              marginBottom: 20,
            }}
          >
            INTRODUCING
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 80,
              fontWeight: 700,
              color: C.white,
            }}
          >
            FRAME
          </div>
        </div>
      </div>

      {/* 外側の情報 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          fontFamily: font,
          fontSize: 11,
          color: C.gray[600],
          letterSpacing: 2,
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        VOL.01 — 2024
      </div>
    </AbsoluteFill>
  );
};
