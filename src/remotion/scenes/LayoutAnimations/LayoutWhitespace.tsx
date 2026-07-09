/**
 * LayoutWhitespace - ホワイトスペース活用 - ミニマル極致
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutWhitespace = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textProgress = lerp(frame, [startDelay + 20, startDelay + 50], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* 左下に小さく配置 */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          opacity: textProgress,
          transform: `translateY(${(1 - textProgress) * 20}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 11,
            color: C.gray[400],
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          LESS IS MORE
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 300,
            color: C.black,
            lineHeight: 1.3,
          }}
        >
          Simple.
          <br />
          <span style={{ fontWeight: 700 }}>Powerful.</span>
        </div>
      </div>

      {/* 右上に小さなアクセント */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 80,
          width: 40,
          height: 40,
          background: C.accent,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      />

      {/* ほぼ見えない装飾 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 200,
          fontWeight: 100,
          color: C.gray[100],
          opacity: lerp(frame, [startDelay + 30, startDelay + 60], [0, 1]),
        }}
      >
        01
      </div>
    </AbsoluteFill>
  );
};
