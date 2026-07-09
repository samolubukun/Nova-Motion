/**
 * ThemeMinimalist - ミニマリスト - 極限のシンプル
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ThemeMinimalist = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textOpacity = lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]);
  const lineWidth = lerp(frame, [startDelay + 30, startDelay + 60], [0, 100], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 150,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 72,
            fontWeight: 300,
            color: C.black,
            letterSpacing: -2,
            opacity: textOpacity,
          }}
        >
          Less is more.
        </div>
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: C.black,
            marginTop: 30,
          }}
        />
      </div>

      {/* 右上の小さなアクセント */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 100,
          width: 8,
          height: 8,
          background: C.black,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      />
    </AbsoluteFill>
  );
};
