/**
 * ShapeExplosion - 爆発するシェイプ
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ShapeExplosion = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shapeCount = 20;
  const shapes = React.useMemo(() => {
    return Array.from({ length: shapeCount }).map((_, i) => ({
      id: `explosion-shape-${i}`,
      angle: (i / shapeCount) * Math.PI * 2 + random(`angle-${i}`) * 0.5,
      distance: random(`dist-${i}`) * 200 + 150,
      size: random(`size-${i}`) * 30 + 20,
      rotation: random(`rot-${i}`) * 360,
      color: [C.accent, C.secondary, C.tertiary, C.orange][i % 4],
      isCircle: random(`shape-${i}`) > 0.5,
    }));
  }, []);

  const explodeProgress = spring({
    frame: frame - startDelay - 20,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* フラッシュ */}
      {frame >= startDelay + 20 && frame < startDelay + 28 && (
        <AbsoluteFill
          style={{
            background: C.white,
            opacity: lerp(frame, [startDelay + 20, startDelay + 28], [0.6, 0]),
          }}
        />
      )}

      {/* シェイプ */}
      {shapes.map((shape) => {
        const x = Math.cos(shape.angle) * shape.distance * explodeProgress;
        const y = Math.sin(shape.angle) * shape.distance * explodeProgress;
        const rotation = shape.rotation * explodeProgress;

        return (
          <div
            key={shape.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: shape.size,
              height: shape.size,
              background: shape.color,
              borderRadius: shape.isCircle ? "50%" : "0",
              transform: `
                translate(-50%, -50%)
                translate(${x}px, ${y}px)
                rotate(${rotation}deg)
                scale(${explodeProgress})
              `,
              opacity: lerp(frame, [startDelay + 60, startDelay + 90], [1, 0]),
            }}
          />
        );
      })}

      {/* 中央テキスト（爆発前） */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${1 - explodeProgress})`,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 900,
          color: C.white,
          opacity: 1 - explodeProgress,
        }}
      >
        BANG!
      </div>
    </AbsoluteFill>
  );
};
