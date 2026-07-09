/**
 * CinematicSciFi - SF/テック風
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const CinematicSciFi = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const scanlineY = ((frame - startDelay) * 5) % 720;
  const titleOpacity = lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "#000510" }}>
      {/* グリッド */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${C.accent}20 1px, transparent 1px),
            linear-gradient(90deg, ${C.accent}20 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          perspective: 500,
          transform: "rotateX(60deg) translateY(-200px)",
          transformOrigin: "center center",
        }}
      />

      {/* スキャンライン */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: scanlineY,
          width: "100%",
          height: 4,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          boxShadow: `0 0 20px ${C.accent}`,
        }}
      />

      {/* HUDフレーム */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          width: 100,
          height: 100,
          borderLeft: `2px solid ${C.accent}`,
          borderTop: `2px solid ${C.accent}`,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 0.6]),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          width: 100,
          height: 100,
          borderRight: `2px solid ${C.accent}`,
          borderBottom: `2px solid ${C.accent}`,
          opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 0.6]),
        }}
      />

      {/* タイトル */}
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
            fontFamily: "monospace",
            fontSize: 14,
            color: C.accent,
            letterSpacing: 8,
            marginBottom: 20,
            opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
          }}
        >
          INITIALIZING SYSTEM
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 700,
            color: C.white,
            letterSpacing: 20,
            textShadow: `0 0 30px ${C.accent}`,
            opacity: titleOpacity,
          }}
        >
          NEXUS
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: C.accent,
            marginTop: 20,
            opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
          }}
        >
          [ SYSTEM ONLINE ]
        </div>
      </div>
    </AbsoluteFill>
  );
};
