/**
 * TransitionBoxReveal - ボックスリビール - グリッド状に表示
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const TransitionBoxReveal = ({ startDelay = 0, gridSize = 6 }: {
  startDelay?: number;
  gridSize?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxes: { row: number; col: number; delay: number }[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const distance = Math.sqrt(
        Math.pow(row - gridSize / 2, 2) + Math.pow(col - gridSize / 2, 2)
      );
      boxes.push({ row, col, delay: distance * 3 });
    }
  }

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 背景コンテンツ */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: font, fontSize: 100, fontWeight: 800, color: C.white }}>
          GRID
        </div>
      </AbsoluteFill>

      {/* ボックスマスク */}
      {boxes.map((box) => {
        const progress = spring({
          frame: frame - startDelay - box.delay,
          fps,
          config: { damping: 15, stiffness: 200 },
        });

        const colors = [C.accent, C.secondary, C.tertiary];
        const color = colors[(box.row + box.col) % colors.length];

        return (
          <div
            key={`box-${box.row}-${box.col}`}
            style={{
              position: "absolute",
              left: `${(box.col / gridSize) * 100}%`,
              top: `${(box.row / gridSize) * 100}%`,
              width: `${100 / gridSize + 0.5}%`,
              height: `${100 / gridSize + 0.5}%`,
              background: color,
              transform: `scale(${progress})`,
              opacity: progress * 0.9,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
