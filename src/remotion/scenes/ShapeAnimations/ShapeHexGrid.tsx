/**
 * ShapeHexGrid - 六角形グリッド - ハニカム構造
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ShapeHexGrid = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexagons: { id: string; x: number; y: number; delay: number }[] = [];
  const hexSize = 70;
  const rows = 6;
  const cols = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75;
      const y = row * hexSize * 0.866;
      hexagons.push({
        id: `hex-${row}-${col}`,
        x: x + 100,
        y: y + 150,
        delay: (row + col) * 2,
      });
    }
  }

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {hexagons.map((hex) => {
        const progress = spring({
          frame: frame - startDelay - hex.delay,
          fps,
          config: { damping: 15, stiffness: 200 },
        });

        const isHighlighted = random(`hex-hl-${hex.id}`) < 0.15;
        const pulse = isHighlighted
          ? 0.8 + Math.sin((frame - startDelay) * 0.1 + hex.x * 0.01) * 0.2
          : 1;

        return (
          <div
            key={hex.id}
            style={{
              position: "absolute",
              left: hex.x,
              top: hex.y,
              width: hexSize,
              height: hexSize * 1.15,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              background: isHighlighted
                ? `linear-gradient(135deg, ${C.accent}, ${C.secondary})`
                : C.gray[800],
              transform: `scale(${progress * pulse})`,
              opacity: progress * 0.9,
            }}
          />
        );
      })}

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 80,
          fontFamily: font,
          fontSize: 48,
          fontWeight: 700,
          color: C.white,
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        HEXAGONAL
        <div style={{ fontSize: 18, color: C.gray[500], marginTop: 10, letterSpacing: 4 }}>
          GRID PATTERN
        </div>
      </div>
    </AbsoluteFill>
  );
};
