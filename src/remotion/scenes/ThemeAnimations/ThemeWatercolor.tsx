/**
 * ThemeWatercolor - Watercolor - 水彩
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeWatercolor = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textOpacity = lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]);

  const blobs = [
    { x: 200, y: 150, size: 300, color: "rgba(100, 200, 255, 0.4)", delay: 0 },
    { x: 400, y: 300, size: 250, color: "rgba(255, 150, 200, 0.4)", delay: 10 },
    { x: 600, y: 200, size: 200, color: "rgba(200, 255, 150, 0.4)", delay: 5 },
    { x: 900, y: 400, size: 280, color: "rgba(255, 200, 100, 0.3)", delay: 15 },
  ];

  return (
    <AbsoluteFill style={{ background: "#fefefe" }}>
      {/* 紙テクスチャ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />

      {/* 水彩ブロブ */}
      {blobs.map((blob) => {
        const blobOpacity = lerp(
          frame,
          [startDelay + blob.delay, startDelay + blob.delay + 30],
          [0, 1]
        );
        const spread = lerp(
          frame,
          [startDelay + blob.delay, startDelay + blob.delay + 40],
          [0.5, 1]
        );

        return (
          <div
            key={`watercolor-${blob.x}-${blob.y}`}
            style={{
              position: "absolute",
              left: blob.x,
              top: blob.y,
              width: blob.size * spread,
              height: blob.size * spread,
              borderRadius: "60% 40% 50% 70% / 50% 60% 40% 50%",
              background: blob.color,
              filter: "blur(30px)",
              opacity: blobOpacity,
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 18,
            color: C.gray[400],
            letterSpacing: 6,
            marginBottom: 15,
          }}
        >
          HAND PAINTED
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 72,
            fontWeight: 200,
            color: C.gray[800],
            fontStyle: "italic",
          }}
        >
          Watercolor
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[400],
            marginTop: 20,
          }}
        >
          Organic textures & soft edges
        </div>
      </div>
    </AbsoluteFill>
  );
};
