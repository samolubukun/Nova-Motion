/**
 * BackgroundGrid - グリッドアニメーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundGrid = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const gridSize = 50;
  const rows = 15;
  const cols = 26;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* アニメーショングリッド */}
      {Array.from({ length: rows * cols }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;

        const distance = Math.sqrt(
          Math.pow(row - rows / 2, 2) + Math.pow(col - cols / 2, 2)
        );

        const wave = Math.sin((frame - startDelay) * 0.1 - distance * 0.3);
        const opacity = (wave + 1) * 0.3;

        return (
          <div
            key={`grid-cell-${i}`}
            style={{
              position: "absolute",
              left: col * gridSize,
              top: row * gridSize,
              width: gridSize - 2,
              height: gridSize - 2,
              background: C.accent,
              opacity: opacity * lerp(frame, [startDelay, startDelay + 30], [0, 1]),
            }}
          />
        );
      })}

      {/* 中央テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
          textShadow: "0 0 40px rgba(0,0,0,0.8)",
        }}
      >
        GRID
      </div>
    </AbsoluteFill>
  );
};
