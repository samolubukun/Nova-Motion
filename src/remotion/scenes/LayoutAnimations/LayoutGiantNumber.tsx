/**
 * LayoutGiantNumber - 巨大数字 + テキスト - データ強調レイアウト
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutGiantNumber = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const numberProgress = lerp(frame, [startDelay, startDelay + 40], [0, 1], EASE.dramatic);
  const textProgress = lerp(frame, [startDelay + 20, startDelay + 50], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* 巨大な数字（画面をはみ出す） */}
      <div
        style={{
          position: "absolute",
          right: -80,
          top: "50%",
          transform: `translateY(-50%) scale(${0.8 + numberProgress * 0.2})`,
          fontFamily: font,
          fontSize: 500,
          fontWeight: 900,
          color: C.gray[100],
          lineHeight: 0.8,
          opacity: numberProgress,
        }}
      >
        97
      </div>

      {/* 左側のテキスト情報 */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - textProgress) * -50}px)`,
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 500,
            color: C.accent,
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          CUSTOMER SATISFACTION
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 60,
            fontWeight: 700,
            color: C.black,
            lineHeight: 1.1,
          }}
        >
          Percent
          <br />
          <span style={{ color: C.accent }}>Happy</span>
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[500],
            marginTop: 30,
            maxWidth: 300,
            lineHeight: 1.7,
          }}
        >
          Based on 10,000+ reviews from verified customers worldwide.
        </div>
      </div>

      {/* 上部のライン */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          width: lerp(frame, [startDelay + 30, startDelay + 60], [0, 200], EASE.out),
          height: 4,
          background: C.black,
        }}
      />
    </AbsoluteFill>
  );
};
