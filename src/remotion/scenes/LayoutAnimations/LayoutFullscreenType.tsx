/**
 * LayoutFullscreenType - フルスクリーンタイポグラフィ - 画面いっぱいの文字
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutFullscreenType = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const line1Y = lerp(frame, [startDelay, startDelay + 25], [100, 0], EASE.out);
  const line2Y = lerp(frame, [startDelay + 8, startDelay + 33], [100, 0], EASE.out);
  const line3Y = lerp(frame, [startDelay + 16, startDelay + 41], [100, 0], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      {/* 行1 */}
      <div style={{ overflow: "hidden", position: "absolute", left: 40, top: 80 }}>
        <div
          style={{
            fontFamily: font,
            fontSize: 180,
            fontWeight: 900,
            color: C.white,
            letterSpacing: -8,
            lineHeight: 0.85,
            transform: `translateY(${line1Y}%)`,
          }}
        >
          MAKE
        </div>
      </div>

      {/* 行2 */}
      <div style={{ overflow: "hidden", position: "absolute", left: 40, top: 250 }}>
        <div
          style={{
            fontFamily: font,
            fontSize: 180,
            fontWeight: 900,
            color: C.white,
            letterSpacing: -8,
            lineHeight: 0.85,
            transform: `translateY(${line2Y}%)`,
          }}
        >
          IT<span style={{ color: C.secondary }}> HAPPEN</span>
        </div>
      </div>

      {/* 行3 */}
      <div style={{ overflow: "hidden", position: "absolute", left: 40, top: 420 }}>
        <div
          style={{
            fontFamily: font,
            fontSize: 180,
            fontWeight: 900,
            color: C.accent,
            letterSpacing: -8,
            lineHeight: 0.85,
            transform: `translateY(${line3Y}%)`,
          }}
        >
          NOW.
        </div>
      </div>

      {/* 右下の小テキスト */}
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 12,
            color: C.gray[600],
            letterSpacing: 3,
          }}
        >
          START TODAY
        </div>
      </div>
    </AbsoluteFill>
  );
};
