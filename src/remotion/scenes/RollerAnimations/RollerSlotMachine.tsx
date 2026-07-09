/**
 * RollerSlotMachine - 高速縦ロール（スロットマシン風）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { font } from "../../common";

const C = {
  black: "#0a0a0a",
  white: "#ffffff",
  accent: "#6366f1",
  gray: { 600: "#666666" },
};

export const RollerSlotMachine = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Feature", "Product", "Design", "Future"];
  const wordHeight = 80;
  const cycleDuration = 25;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const rawIndex = t / cycleDuration;
  // 最後で止める
  const currentIndex = Math.min(Math.floor(rawIndex), finalIndex);
  const nextIndex = Math.min(currentIndex + 1, finalIndex);

  // 最後のワードに完全に到達したらアニメーション停止
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const spinProgress = spring({
    frame: cycleT,
    fps,
    config: { damping: 15, stiffness: 300 },
  });

  const offsetY = currentIndex >= finalIndex ? 0 : (1 - spinProgress) * wordHeight;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 64,
            fontWeight: 300,
            color: C.white,
          }}
        >
          New
        </div>

        <div
          style={{
            height: wordHeight,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 64,
              fontWeight: 700,
              color: C.accent,
              height: wordHeight,
              display: "flex",
              alignItems: "center",
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {words[currentIndex]}
          </div>

          {currentIndex < finalIndex && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                fontFamily: font,
                fontSize: 64,
                fontWeight: 700,
                color: C.accent,
                height: wordHeight,
                display: "flex",
                alignItems: "center",
                transform: `translateY(${offsetY - wordHeight}px)`,
              }}
            >
              {words[nextIndex]}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          fontFamily: font,
          fontSize: 12,
          color: C.gray[600],
          letterSpacing: 2,
        }}
      >
        SLOT MACHINE ROLL
      </div>
    </AbsoluteFill>
  );
};
