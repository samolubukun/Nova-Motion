/**
 * LayoutDiagonal - 対角線構成 - ダイナミックな斜め配置
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutDiagonal = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const diagonalProgress = lerp(frame, [startDelay, startDelay + 40], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
      {/* 斜めの背景 */}
      <div
        style={{
          position: "absolute",
          left: "-20%",
          top: "-20%",
          width: "80%",
          height: "140%",
          background: C.black,
          transform: `rotate(-15deg) translateX(${(1 - diagonalProgress) * -100}%)`,
        }}
      />

      {/* 左側（黒背景上）のテキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "40%",
          transform: `translateY(-50%) rotate(-15deg)`,
          opacity: lerp(frame, [startDelay + 15, startDelay + 35], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.9,
          }}
        >
          DYNAMIC
        </div>
      </div>

      {/* 右側（白背景上）のテキスト */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: "30%",
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 25, startDelay + 45], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 60,
            fontWeight: 300,
            color: C.black,
            lineHeight: 1.2,
          }}
        >
          Motion
          <br />
          Design
        </div>
      </div>

      {/* アクセントライン */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: "25%",
          width: lerp(frame, [startDelay + 35, startDelay + 55], [0, 150], EASE.out),
          height: 4,
          background: C.accent,
        }}
      />
    </AbsoluteFill>
  );
};
