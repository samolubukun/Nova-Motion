/**
 * LayoutSplitContrast - スプリットスクリーン - 左右で対比
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutSplitContrast = ({ titleBefore = "BEFORE", titleAfter = "AFTER", startDelay = 0 }: {
  titleBefore?: string;
  titleAfter?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const leftProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);
  const rightProgress = lerp(frame, [startDelay + 10, startDelay + 40], [0, 1], EASE.out);

  return (
    <AbsoluteFill>
      {/* 左半分：黒Background */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          height: "100%",
          background: C.black,
          clipPath: `inset(0 ${(1 - leftProgress) * 100}% 0 0)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 60,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[500],
              letterSpacing: 3,
              marginBottom: 20,
            }}
          >
             {titleBefore}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 80,
              fontWeight: 300,
              color: C.white,
              lineHeight: 1,
            }}
          >
            OLD
            <br />
            WAY
          </div>
        </div>
      </div>

      {/* 右半分：白Background */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          background: C.white,
          clipPath: `inset(0 0 0 ${(1 - rightProgress) * 100}%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 60,
            top: "50%",
            transform: "translateY(-50%)",
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[500],
              letterSpacing: 3,
              marginBottom: 20,
            }}
          >
             {titleAfter}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 80,
              fontWeight: 900,
              color: C.black,
              lineHeight: 1,
            }}
          >
            NEW
            <br />
            <span style={{ color: C.accent }}>ERA</span>
          </div>
        </div>
      </div>

      {/* 中央の縦線 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 4,
          height: "100%",
          background: C.accent,
          transform: "translateX(-50%)",
          opacity: Math.min(leftProgress, rightProgress),
        }}
      />
    </AbsoluteFill>
  );
};
