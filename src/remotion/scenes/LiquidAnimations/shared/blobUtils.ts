/**
 * Blob utility functions for LiquidAnimations
 */

import { random } from "remotion";

/**
 * Generate a blob SVG path
 */
export const generateBlobPath = (
  seed: string,
  points: number = 6,
  variance: number = 0.3,
  radius: number = 100
): string => {
  const angleStep = (Math.PI * 2) / points;
  const pathPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * (1 + (random(`${seed}-${i}`) - 0.5) * variance * 2);
    pathPoints.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
    });
  }

  // スムーズなベジェ曲線でパスを生成
  let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;

  for (let i = 0; i < points; i++) {
    const curr = pathPoints[i];
    const next = pathPoints[(i + 1) % points];
    const prev = pathPoints[(i - 1 + points) % points];
    const nextNext = pathPoints[(i + 2) % points];

    // コントロールポイント
    const cp1x = curr.x + (next.x - prev.x) * 0.25;
    const cp1y = curr.y + (next.y - prev.y) * 0.25;
    const cp2x = next.x - (nextNext.x - curr.x) * 0.25;
    const cp2y = next.y - (nextNext.y - curr.y) * 0.25;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  return path + " Z";
};
