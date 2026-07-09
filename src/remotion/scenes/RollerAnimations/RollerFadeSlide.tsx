/**
 * RollerFadeSlide - フェードスライド（上からフェードイン）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerFadeSlide = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Faster", "Smarter", "Better", "Stronger"];
  const cycleDuration = 28;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const progress = spring({
    frame: cycleT,
    fps,
    config: { damping: 18, stiffness: 150 },
  });

  // 最後は退場しない
  const exitProgress = currentIndex >= finalIndex
    ? 0
    : lerp(cycleT, [cycleDuration - 8, cycleDuration], [0, 1], EASE.smooth);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {/* 固定テキスト */}
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 300,
            color: C.gray[400],
            marginBottom: 5,
          }}
        >
          Work
        </div>

        {/* ローラー部分 */}
        <div
          style={{
            height: 80,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 72,
              fontWeight: 800,
              color: C.white,
              transform: `translateY(${(1 - progress) * 40 - exitProgress * 40}px)`,
              opacity: progress * (1 - exitProgress),
            }}
          >
            {words[currentIndex]}
          </div>
        </div>

        {/* アンダーライン */}
        <div
          style={{
            width: 100,
            height: 4,
            background: C.accent,
            marginTop: 20,
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
        />
      </div>

      {/* 右側の装飾 */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: font,
          fontSize: 200,
          fontWeight: 100,
          color: C.gray[900],
        }}
      >
        {String(currentIndex + 1).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};
