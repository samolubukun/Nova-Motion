/**
 * UILoading - ローディングアニメーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, font } from "../../common";

export const UILoading = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const spinnerRotation = (frame - startDelay) * 6;
  const dotCount = 3;
  const dotDelay = 8;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* スピナー */}
        <div
          style={{
            width: 60,
            height: 60,
            border: `4px solid ${C.gray[800]}`,
            borderTopColor: C.accent,
            borderRadius: "50%",
            transform: `rotate(${spinnerRotation}deg)`,
          }}
        />

        {/* ドットローダー */}
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: dotCount }).map((_, i) => {
            const bounce = Math.sin((frame - startDelay - i * dotDelay) * 0.2) * 10;
            return (
              <div
                key={`dot-${i}-loader`}
                style={{
                  width: 12,
                  height: 12,
                  background: C.accent,
                  borderRadius: "50%",
                  transform: `translateY(${bounce}px)`,
                }}
              />
            );
          })}
        </div>

        {/* プログレスバー */}
        <div
          style={{
            width: 200,
            height: 6,
            background: C.gray[800],
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((frame - startDelay) % 100)}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})`,
              borderRadius: 3,
            }}
          />
        </div>

        {/* スケルトン */}
        <div
          style={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[100, 80, 60].map((width) => {
            const shimmerX = ((frame - startDelay) * 3) % 400 - 100;
            return (
              <div
                key={`skeleton-${width}`}
                style={{
                  width: `${width}%`,
                  height: 16,
                  background: C.gray[800],
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: shimmerX,
                    top: 0,
                    width: 100,
                    height: "100%",
                    background: `linear-gradient(90deg, transparent, ${C.gray[700]}, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 14,
          color: C.gray[600],
          letterSpacing: 2,
        }}
      >
        LOADING STATES
      </div>
    </AbsoluteFill>
  );
};
