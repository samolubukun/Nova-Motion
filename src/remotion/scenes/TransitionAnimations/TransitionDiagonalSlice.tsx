/**
 * TransitionDiagonalSlice - 斜めスライス - 斜線で切り替え
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TransitionDiagonalSlice = ({ startDelay = 0, angle = 15 }: {
  startDelay?: number;
  angle?: number;
}) => {
  const frame = useCurrentFrame();

  const progress = lerp(frame, [startDelay, startDelay + 35], [0, 150], EASE.snap);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景コンテンツ */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: font, fontSize: 80, fontWeight: 700, color: C.gray[700] }}>
          SCENE A
        </div>
      </AbsoluteFill>

      {/* 新しいコンテンツ */}
      <AbsoluteFill
        style={{
          background: C.black,
          clipPath: `polygon(
            ${progress - 30}% 0%,
            ${progress + 20}% 0%,
            ${progress - 10}% 100%,
            ${progress - 60}% 100%
          )`,
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
          SCENE B
        </div>
      </AbsoluteFill>

      {/* エッジライン */}
      <div
        style={{
          position: "absolute",
          left: `${progress - 30}%`,
          top: "-10%",
          width: 6,
          height: "120%",
          background: C.accent,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "top left",
        }}
      />
    </AbsoluteFill>
  );
};
