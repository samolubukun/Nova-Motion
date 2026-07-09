/**
 * ThemeGeometricAbstract - Geometric Abstraction - 幾何学抽象
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeGeometricAbstract = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shapes = [
    { type: "rect", x: 100, y: 100, w: 200, h: 150, color: "#264653", rotation: 15, delay: 0 },
    { type: "rect", x: 250, y: 250, w: 180, h: 180, color: "#2a9d8f", rotation: -10, delay: 5 },
    { type: "circle", x: 500, y: 150, r: 100, color: "#e9c46a", delay: 10 },
    { type: "rect", x: 700, y: 300, w: 250, h: 100, color: "#f4a261", rotation: 25, delay: 15 },
    { type: "circle", x: 900, y: 200, r: 80, color: "#e76f51", delay: 8 },
    { type: "rect", x: 150, y: 450, w: 300, h: 80, color: "#264653", rotation: -5, delay: 12 },
  ];

  return (
    <AbsoluteFill style={{ background: "#fafafa" }}>
      {shapes.map((shape) => {
        const progress = spring({
          frame: frame - startDelay - shape.delay,
          fps,
          config: { damping: 15, stiffness: 100 },
        });

        if (shape.type === "rect") {
          return (
            <div
              key={`geo-${shape.x}-${shape.y}-${shape.color}`}
              style={{
                position: "absolute",
                left: shape.x,
                top: shape.y,
                width: shape.w,
                height: shape.h,
                background: shape.color,
                transform: `scale(${progress}) rotate(${shape.rotation}deg)`,
                transformOrigin: "center",
              }}
            />
          );
        }
        return (
          <div
            key={`geo-circle-${shape.x}-${shape.y}`}
            style={{
              position: "absolute",
              left: shape.x,
              top: shape.y,
              width: (shape.r ?? 50) * 2,
              height: (shape.r ?? 50) * 2,
              borderRadius: "50%",
              background: shape.color,
              transform: `scale(${progress})`,
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 25, startDelay + 45], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 800,
            color: "#264653",
          }}
        >
          ABSTRACT
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[400],
            letterSpacing: 3,
            marginTop: 10,
          }}
        >
          GEOMETRIC COMPOSITION
        </div>
      </div>
    </AbsoluteFill>
  );
};
