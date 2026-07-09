/**
 * RollerOutlineHighlight - アウトラインハイライト - 縦に並んだ同じワード、1つだけ塗りつぶし
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { C, font } from "../../common";

export const RollerOutlineHighlight = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const word = "Introducing";
  const rowCount = 7;
  const rowHeight = 120;
  const t = frame - startDelay;

  // ハイライト位置が上から下へ移動
  const duration = 90;
  const progress = Math.min(t / duration, 1);

  // イージング：ゆっくり→高速→ゆっくり止まる
  const easedProgress = Easing.inOut(Easing.cubic)(progress);
  const highlightPosition = easedProgress * (rowCount - 1);

  // スプリングで最終停止
  const isStopping = t >= duration - 15;
  const stopSpring = isStopping
    ? spring({
        frame: t - (duration - 15),
        fps,
        config: { damping: 15, stiffness: 200 },
      })
    : 0;

  const finalPosition = isStopping
    ? highlightPosition + (rowCount - 1 - highlightPosition) * stopSpring
    : highlightPosition;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].slice(0, rowCount).map((rowIdx) => {
          const distance = Math.abs(rowIdx - finalPosition);
          const isHighlighted = distance < 0.5;

          // ハイライトに近いほど不透明度が上がる
          const opacity = isHighlighted ? 1 : Math.max(0.15, 0.4 - distance * 0.08);

          // ハイライト時のスケール
          const scale = isHighlighted
            ? 1 + 0.05 * (1 - distance * 2)
            : 1 - distance * 0.02;

          return (
            <div
              key={`outline-row-${rowIdx}`}
              style={{
                fontFamily: font,
                fontSize: 90,
                fontWeight: 800,
                height: rowHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${Math.max(0.8, scale)})`,
                color: isHighlighted ? C.white : "transparent",
                WebkitTextStroke: isHighlighted ? "none" : "1px rgba(255,255,255,0.3)",
                opacity,
                transition: "all 0.1s",
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
