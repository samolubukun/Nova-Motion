/**
 * BackgroundMeshGradient - メッシュグラデーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundMeshGradient = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const blob1X = 30 + Math.sin((frame - startDelay) * 0.02) * 20;
  const blob1Y = 30 + Math.cos((frame - startDelay) * 0.03) * 15;
  const blob2X = 70 + Math.cos((frame - startDelay) * 0.025) * 15;
  const blob2Y = 60 + Math.sin((frame - startDelay) * 0.02) * 20;
  const blob3X = 50 + Math.sin((frame - startDelay) * 0.015) * 25;
  const blob3Y = 80 + Math.cos((frame - startDelay) * 0.02) * 10;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ブロブ1 */}
      <div
        style={{
          position: "absolute",
          left: `${blob1X}%`,
          top: `${blob1Y}%`,
          width: "60%",
          height: "60%",
          background: C.accent,
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.6,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ブロブ2 */}
      <div
        style={{
          position: "absolute",
          left: `${blob2X}%`,
          top: `${blob2Y}%`,
          width: "50%",
          height: "50%",
          background: C.secondary,
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.5,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ブロブ3 */}
      <div
        style={{
          position: "absolute",
          left: `${blob3X}%`,
          top: `${blob3Y}%`,
          width: "40%",
          height: "40%",
          background: C.tertiary,
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.5,
          transform: "translate(-50%, -50%)",
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
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      >
        MESH
      </div>
    </AbsoluteFill>
  );
};
