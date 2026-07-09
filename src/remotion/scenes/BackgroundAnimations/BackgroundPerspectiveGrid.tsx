/**
 * BackgroundPerspectiveGrid - パースペクティブグリッド
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundPerspectiveGrid = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const scrollZ = (frame - startDelay) * 2;

  return (
    <AbsoluteFill style={{ background: C.black, perspective: 500, overflow: "hidden" }}>
      {/* グリッド */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 2000,
          height: 2000,
          transform: `translate(-50%, -50%) rotateX(70deg) translateZ(${scrollZ % 100}px)`,
          transformStyle: "preserve-3d",
          backgroundImage: `
            linear-gradient(${C.accent}40 1px, transparent 1px),
            linear-gradient(90deg, ${C.accent}40 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* 水平線 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          width: "100%",
          height: 2,
          background: C.accent,
          transform: "translateY(-50%)",
        }}
      />

      {/* 太陽/光源 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 80,
          height: 80,
          background: `radial-gradient(circle, ${C.orange}, ${C.secondary})`,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 60px ${C.orange}, 0 0 120px ${C.secondary}`,
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "15%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 60,
          fontWeight: 700,
          color: C.white,
          letterSpacing: 8,
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      >
        RETRO GRID
      </div>
    </AbsoluteFill>
  );
};
