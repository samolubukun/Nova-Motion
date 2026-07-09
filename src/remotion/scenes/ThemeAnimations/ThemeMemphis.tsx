/**
 * ThemeMemphis - Memphis - メンフィスデザイン
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const ThemeMemphis = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bounceProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  const shapes = [
    { type: "circle", x: 100, y: 150, size: 80, color: "#ff6b6b", delay: 0 },
    { type: "triangle", x: 200, y: 400, size: 100, color: "#4ecdc4", delay: 5 },
    { type: "zigzag", x: 900, y: 200, size: 120, color: "#ffe66d", delay: 10 },
    { type: "circle", x: 1000, y: 500, size: 60, color: "#ff6b6b", delay: 15 },
    { type: "squiggle", x: 150, y: 550, size: 80, color: "#95e1d3", delay: 8 },
  ];

  return (
    <AbsoluteFill style={{ background: "#ffeaa7" }}>
      {/* ドットパターン背景 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.black} 2px, transparent 2px)`,
          backgroundSize: "30px 30px",
          opacity: 0.1,
        }}
      />

      {/* シェイプ */}
      {shapes.map((shape, i) => {
        const shapeProgress = spring({
          frame: frame - startDelay - shape.delay,
          fps,
          config: { damping: 10, stiffness: 200 },
        });

        return (
          <div
            key={`memphis-${shape.type}-${shape.x}-${shape.y}`}
            style={{
              position: "absolute",
              left: shape.x,
              top: shape.y,
              transform: `scale(${shapeProgress}) rotate(${(frame - startDelay) * (i % 2 === 0 ? 1 : -1)}deg)`,
            }}
          >
            {shape.type === "circle" && (
              <div
                style={{
                  width: shape.size,
                  height: shape.size,
                  borderRadius: "50%",
                  background: shape.color,
                  border: `4px solid ${C.black}`,
                }}
              />
            )}
            {shape.type === "triangle" && (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${shape.size / 2}px solid transparent`,
                  borderRight: `${shape.size / 2}px solid transparent`,
                  borderBottom: `${shape.size}px solid ${shape.color}`,
                }}
              />
            )}
            {shape.type === "zigzag" && (
              <svg width={shape.size} height={shape.size / 2} aria-hidden="true">
                <path
                  d={`M0 ${shape.size / 4} L${shape.size / 4} 0 L${shape.size / 2} ${shape.size / 4} L${shape.size * 0.75} 0 L${shape.size} ${shape.size / 4}`}
                  stroke={shape.color}
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            )}
            {shape.type === "squiggle" && (
              <svg width={shape.size} height={shape.size / 2} aria-hidden="true">
                <path
                  d={`M0 ${shape.size / 4} Q${shape.size / 4} 0 ${shape.size / 2} ${shape.size / 4} Q${shape.size * 0.75} ${shape.size / 2} ${shape.size} ${shape.size / 4}`}
                  stroke={shape.color}
                  strokeWidth="6"
                  fill="none"
                />
              </svg>
            )}
          </div>
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${bounceProgress})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: C.black,
            textShadow: "6px 6px 0 #ff6b6b, 12px 12px 0 #4ecdc4",
          }}
        >
          MEMPHIS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            fontWeight: 700,
            color: C.black,
            letterSpacing: 15,
            marginTop: 10,
          }}
        >
          DESIGN GROUP
        </div>
      </div>
    </AbsoluteFill>
  );
};
