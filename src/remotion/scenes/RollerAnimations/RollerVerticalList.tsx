/**
 * RollerVerticalList - 縦スクロール（リスト風）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const RollerVerticalList = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Speed", "Quality", "Value", "Trust"];
  const itemHeight = 70;
  const cycleDuration = 25;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const scrollProgress = spring({ frame: t, fps, config: { damping: 20, stiffness: 80 } });

  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  const cycleProgress = spring({ frame: cycleT, fps, config: { damping: 15, stiffness: 200 } });

  const scrollY = currentIndex >= finalIndex
    ? finalIndex * itemHeight
    : currentIndex * itemHeight + cycleProgress * itemHeight;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 300,
            color: C.gray[600],
          }}
        >
          We deliver
        </div>

        {/* スクロールウィンドウ */}
        <div
          style={{
            height: itemHeight,
            overflow: "hidden",
            position: "relative",
            opacity: scrollProgress,
          }}
        >
          {/* マスク（上下グラデーション） */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 15,
              background: `linear-gradient(${C.black}, transparent)`,
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 15,
              background: `linear-gradient(transparent, ${C.black})`,
              zIndex: 1,
            }}
          />

          {/* スクロールリスト */}
          <div
            style={{
              transform: `translateY(-${scrollY}px)`,
            }}
          >
            {[...words, ...words, ...words].map((word, i) => (
              <div
                key={`list-${i}-${word}`}
                style={{
                  height: itemHeight,
                  display: "flex",
                  alignItems: "center",
                  fontFamily: font,
                  fontSize: 48,
                  fontWeight: 700,
                  color: C.secondary,
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
