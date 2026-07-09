/**
 * LayoutVerticalMix - 縦書き + 横書きミックス
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutVerticalMix = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const verticalProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);
  const horizontalProgress = lerp(frame, [startDelay + 15, startDelay + 45], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 縦書きテキスト（左端） */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 80,
          writingMode: "vertical-rl",
          fontFamily: font,
          fontSize: 14,
          color: C.gray[500],
          letterSpacing: 4,
          opacity: verticalProgress,
          transform: `translateX(${(1 - verticalProgress) * -30}px)`,
        }}
      >
        BRAND IDENTITY 2024
      </div>

      {/* 縦書き大文字（右端） */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 80,
          bottom: 80,
          writingMode: "vertical-rl",
          fontFamily: font,
          fontSize: 200,
          fontWeight: 900,
          color: C.gray[900],
          lineHeight: 0.85,
          opacity: verticalProgress,
        }}
      >
        創造
      </div>

      {/* 横書きメインテキスト */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - horizontalProgress) * 50}px)`,
          opacity: horizontalProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.1,
          }}
        >
          CREATE
          <br />
          <span style={{ color: C.accent }}>SOMETHING</span>
          <br />
          NEW
        </div>
      </div>

      {/* 下部ライン */}
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 100,
          width: lerp(frame, [startDelay + 30, startDelay + 60], [0, 400], EASE.out),
          height: 1,
          background: C.gray[700],
        }}
      />
    </AbsoluteFill>
  );
};
