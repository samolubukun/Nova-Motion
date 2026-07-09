/**
 * TextCounter - カウンターテキスト - 数字がカウントアップ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextCounter = ({
  targetNumber = 10000,
  prefix = "",
  suffix = "+",
  startDelay = 0,
}: {
  targetNumber?: number;
  prefix?: string;
  suffix?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const progress = lerp(frame, [startDelay, startDelay + 60], [0, 1], EASE.out);
  const currentNumber = Math.floor(targetNumber * progress);

  const formattedNumber = currentNumber.toLocaleString();

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        {/* メイン数字 */}
        <div
          style={{
            fontFamily: font,
            fontSize: 180,
            fontWeight: 800,
            color: C.white,
            letterSpacing: -8,
          }}
        >
          {prefix}
          {formattedNumber}
          <span style={{ color: C.accent }}>{suffix}</span>
        </div>

        {/* ラベル */}
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            color: C.gray[500],
            letterSpacing: 6,
            marginTop: 20,
            opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 1]),
          }}
        >
          ACTIVE USERS
        </div>
      </div>

      {/* 背景の大きな数字 */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: font,
          fontSize: 400,
          fontWeight: 900,
          color: C.gray[900],
          opacity: 0.3,
        }}
      >
        {Math.floor(targetNumber / 1000)}K
      </div>
    </AbsoluteFill>
  );
};
