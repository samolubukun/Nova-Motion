/**
 * CinematicAction - アクションタイトル
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, lerp, font } from "../../common";

export const CinematicAction = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const impactFrame = startDelay + 25;
  const hasImpact = frame >= impactFrame;

  const titleProgress = spring({
    frame: hasImpact ? frame - impactFrame : 0,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const shake = hasImpact && frame < impactFrame + 10
    ? (random(`action-shake-${frame}`) - 0.5) * 20
    : 0;

  return (
    <AbsoluteFill
      style={{
        background: C.black,
        transform: `translateX(${shake}px)`,
      }}
    >
      {/* 衝撃波 */}
      {hasImpact && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: titleProgress * 1500,
            height: titleProgress * 1500,
            border: `4px solid ${C.accent}`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 1 - titleProgress,
          }}
        />
      )}

      {/* フラッシュ */}
      {hasImpact && frame < impactFrame + 5 && (
        <AbsoluteFill
          style={{
            background: C.white,
            opacity: lerp(frame, [impactFrame, impactFrame + 5], [0.8, 0]),
          }}
        />
      )}

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${hasImpact ? titleProgress : 0})`,
          fontFamily: font,
          fontSize: 140,
          fontWeight: 900,
          color: C.white,
          letterSpacing: 15,
          textShadow: `0 0 40px ${C.accent}`,
        }}
      >
        IMPACT
      </div>

      {/* 飛び散るデブリ */}
      {hasImpact &&
        Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const distance = titleProgress * 400;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const size = random(`debris-s-${i}`) * 10 + 5;

          return (
            <div
              key={`debris-${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size,
                height: size,
                background: C.accent,
                transform: `translate(${x}px, ${y}px)`,
                opacity: 1 - titleProgress,
              }}
            />
          );
        })}

      {/* レターボックス */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: C.black }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: C.black }} />
    </AbsoluteFill>
  );
};
