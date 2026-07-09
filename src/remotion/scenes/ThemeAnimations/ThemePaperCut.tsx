/**
 * ThemePaperCut - Paper Cut - ペーパーカット
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemePaperCut = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const layers = [
    { color: "#ff6b6b", offset: 60, z: 40 },
    { color: "#4ecdc4", offset: 120, z: 30 },
    { color: "#ffe66d", offset: 180, z: 20 },
    { color: "#95e1d3", offset: 240, z: 10 },
  ];

  return (
    <AbsoluteFill style={{ background: "#fafafa" }}>
      {/* ペーパーレイヤー */}
      {layers.map((layer) => {
        const layerProgress = spring({
          frame: frame - startDelay - (layer.z / 10) * 3,
          fps,
          config: { damping: 15, stiffness: 100 },
        });

        return (
          <div
            key={`paper-${layer.color}`}
            style={{
              position: "absolute",
              left: layer.offset,
              top: 100 + layer.z * 2,
              width: 400,
              height: 500,
              background: layer.color,
              borderRadius: 8,
              boxShadow: `
                ${layer.z / 4}px ${layer.z / 2}px ${layer.z}px rgba(0,0,0,0.15)
              `,
              transform: `
                translateY(${(1 - layerProgress) * 100}px)
                rotate(${-5 + layer.z / 10}deg)
              `,
              opacity: layerProgress,
            }}
          />
        );
      })}

      {/* メインカード */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 150,
          width: 450,
          height: 420,
          background: C.white,
          borderRadius: 8,
          boxShadow: "8px 16px 32px rgba(0,0,0,0.15)",
          padding: 50,
          transform: `translateY(${lerp(frame, [startDelay, startDelay + 30], [50, 0])}px)`,
          opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[400],
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          LAYERED DESIGN
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 64,
            fontWeight: 800,
            color: C.gray[900],
            lineHeight: 1.1,
          }}
        >
          Paper
          <br />
          Cut
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[600],
            marginTop: 30,
            lineHeight: 1.6,
          }}
        >
          Depth through layers
          <br />
          and shadow effects
        </div>
      </div>
    </AbsoluteFill>
  );
};
