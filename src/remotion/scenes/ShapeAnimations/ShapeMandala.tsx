/**
 * ShapeMandala - 幾何学パターン - マンダラ風
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const ShapeMandala = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const rotation = (frame - startDelay) * 0.3;
  const layers = [
    { count: 12, radius: 80, size: 20, color: C.accent },
    { count: 8, radius: 140, size: 30, color: C.secondary },
    { count: 16, radius: 200, size: 15, color: C.tertiary },
    { count: 6, radius: 260, size: 40, color: C.orange },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {layers.map((layer, layerIndex) => (
          <div
            key={`mandala-layer-${layerIndex}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `
                translate(-50%, -50%)
                rotate(${rotation * (layerIndex % 2 === 0 ? 1 : -1)}deg)
                scale(${entryProgress})
              `,
            }}
          >
            {Array.from({ length: layer.count }).map((_, i) => {
              const angle = (i / layer.count) * Math.PI * 2;
              const x = Math.cos(angle) * layer.radius;
              const y = Math.sin(angle) * layer.radius;

              return (
                <div
                  key={`mandala-${layerIndex}-${i}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: layer.size,
                    height: layer.size,
                    background: layer.color,
                    borderRadius: layerIndex % 2 === 0 ? "50%" : "0",
                    transform: `
                      translate(-50%, -50%)
                      translate(${x}px, ${y}px)
                      rotate(${angle * 57}deg)
                    `,
                    opacity: 0.8,
                  }}
                />
              );
            })}
          </div>
        ))}

        {/* 中央 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 40,
            height: 40,
            background: C.white,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${entryProgress})`,
          }}
        />
      </div>

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 14,
          color: C.gray[500],
          letterSpacing: 4,
          textAlign: "right",
          opacity: entryProgress,
        }}
      >
        GEOMETRIC
        <div style={{ marginTop: 5 }}>PATTERN</div>
      </div>
    </AbsoluteFill>
  );
};
