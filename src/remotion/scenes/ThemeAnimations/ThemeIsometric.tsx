/**
 * ThemeIsometric - 3D/イソメトリック
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, font } from "../../common";

export const ThemeIsometric = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cubeProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: "#1a1a2e" }}>
      {/* イソメトリックグリッド */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotateX(60deg) rotateZ(45deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* キューブ群 */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const delay = (row + col) * 5;
            const height = 40 + random(`cube-${row}-${col}`) * 60;
            const progress = spring({
              frame: frame - startDelay - delay,
              fps,
              config: { damping: 12, stiffness: 150 },
            });

            const colors = [C.accent, "#8b5cf6", "#a855f7"];
            const color = colors[(row + col) % 3];

            return (
              <div
                key={`iso-cube-${row}-${col}`}
                style={{
                  position: "absolute",
                  left: col * 80,
                  top: row * 80,
                  width: 60,
                  height: height * progress,
                  background: color,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${height * progress}px)`,
                  boxShadow: `
                    20px 20px 0 ${color}99,
                    40px 40px 0 ${color}66
                  `,
                }}
              />
            );
          })
        )}
      </div>

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 100,
          opacity: cubeProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 700,
            color: C.white,
          }}
        >
          3D Space
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[400],
            marginTop: 10,
          }}
        >
          Isometric perspective
        </div>
      </div>
    </AbsoluteFill>
  );
};
