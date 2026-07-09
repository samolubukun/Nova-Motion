/**
 * BackgroundGeometric - ジオメトリックパターン
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundGeometric = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const shapes = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `geo-shape-${i}`,
      x: random(`geo-x-${i}`) * 100,
      y: random(`geo-y-${i}`) * 100,
      size: random(`geo-s-${i}`) * 100 + 50,
      rotation: random(`geo-r-${i}`) * 360,
      type: Math.floor(random(`geo-t-${i}`) * 3),
      color: [C.accent, C.secondary, C.tertiary][i % 3],
      speed: random(`geo-sp-${i}`) * 0.5 + 0.2,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {shapes.map((shape) => {
        const rotation = shape.rotation + (frame - startDelay) * shape.speed;
        const opacity = lerp(frame, [startDelay, startDelay + 30], [0, 0.15]);

        return (
          <div
            key={shape.id}
            style={{
              position: "absolute",
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              background: shape.type === 0 ? shape.color : "transparent",
              border: shape.type !== 0 ? `2px solid ${shape.color}` : "none",
              borderRadius: shape.type === 1 ? "50%" : 0,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              opacity: opacity,
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
          fontSize: 100,
          fontWeight: 900,
          color: C.white,
          opacity: lerp(frame, [startDelay + 20, startDelay + 50], [0, 1]),
        }}
      >
        GEOMETRIC
      </div>
    </AbsoluteFill>
  );
};
