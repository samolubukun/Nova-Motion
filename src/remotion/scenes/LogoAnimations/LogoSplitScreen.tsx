/**
 * LogoSplitScreen - ロゴスプリットスクリーン
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LogoSplitScreen = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const splitProgress = lerp(frame, [startDelay, startDelay + 30], [50, 0], EASE.out);
  const logoOpacity = lerp(frame, [startDelay + 25, startDelay + 45], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      {/* 上半分 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: "50%",
          background: C.accent,
          transform: `translateY(-${splitProgress}%)`,
        }}
      />

      {/* 下半分 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          height: "50%",
          background: C.secondary,
          transform: `translateY(${splitProgress}%)`,
        }}
      />

      {/* ロゴ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 100,
          fontWeight: 900,
          color: C.white,
          opacity: logoOpacity,
          textShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        BRAND
      </div>

      {/* 境界線 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          right: 0,
          height: 2,
          background: C.white,
          transform: "translateY(-50%)",
          opacity: 1 - splitProgress / 50,
        }}
      />
    </AbsoluteFill>
  );
};
