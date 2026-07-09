/**
 * TransitionBlinds - ブラインドトランジション - 縦ブラインド
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TransitionBlinds = ({ startDelay = 0, direction = "vertical" }: {
  startDelay?: number;
  direction?: "vertical" | "horizontal";
}) => {
  const frame = useCurrentFrame();

  const blindCount = 12;
  const isVertical = direction === "vertical";

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景コンテンツ */}
      <AbsoluteFill
        style={{
          background: C.black,
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
            color: C.gray[800],
          }}
        >
          BEFORE
        </div>
      </AbsoluteFill>

      {/* ブラインド */}
      {Array.from({ length: blindCount }).map((_, i) => {
        const delay = i * 3;
        const progress = lerp(
          frame,
          [startDelay + delay, startDelay + delay + 20],
          [0, 100],
          EASE.out
        );

        return (
          <div
            key={`blind-${i}`}
            style={{
              position: "absolute",
              ...(isVertical
                ? {
                    left: `${(i / blindCount) * 100}%`,
                    top: 0,
                    width: `${100 / blindCount + 0.5}%`,
                    height: "100%",
                  }
                : {
                    left: 0,
                    top: `${(i / blindCount) * 100}%`,
                    width: "100%",
                    height: `${100 / blindCount + 0.5}%`,
                  }),
              background: C.accent,
              transform: isVertical
                ? `scaleX(${progress / 100})`
                : `scaleY(${progress / 100})`,
              transformOrigin: i % 2 === 0 ? "left" : "right",
            }}
          />
        );
      })}

      {/* 前景コンテンツ */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(${Array.from({ length: blindCount })
            .map((_, i) => {
              const delay = i * 3;
              const progress = lerp(
                frame,
                [startDelay + delay, startDelay + delay + 20],
                [0, 100],
                EASE.out
              );
              const x1 = (i / blindCount) * 100;
              const x2 = ((i + 1) / blindCount) * 100;
              return `${x1}% ${progress}%, ${x2}% ${progress}%`;
            })
            .join(", ")}, 100% 100%, 0% 100%)`,
          background: C.white,
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
            color: C.black,
          }}
        >
          AFTER
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
