/**
 * CinematicVintage - ヴィンテージ風
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { lerp, font } from "../../common";

export const CinematicVintage = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const flickerSeed = Math.floor(frame / 2);
  const flicker = 0.9 + random(`vintage-${flickerSeed}`) * 0.1;

  const titleOpacity = lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "#1a1410",
      }}
    >
      {/* セピアオーバーレイ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, #2a2015 0%, #0a0805 100%)`,
          opacity: flicker,
        }}
      />

      {/* フィルム傷 */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = random(`scratch-x-${flickerSeed}-${i}`) * 100;
        const show = random(`scratch-show-${flickerSeed}-${i}`) > 0.7;

        return show ? (
          <div
            key={`scratch-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: 0,
              width: 2,
              height: "100%",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
        ) : null;
      })}

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "#d4a574",
            letterSpacing: 10,
            marginBottom: 20,
            opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
          }}
        >
          PRESENTS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 300,
            color: "#f5e6d3",
            letterSpacing: 8,
            opacity: titleOpacity * flicker,
          }}
        >
          Memories
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: "#8b7355",
            letterSpacing: 4,
            marginTop: 30,
            opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
          }}
        >
          — 1952 —
        </div>
      </div>

      {/* ビネット */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)`,
        }}
      />

      {/* フィルムグレイン */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${flickerSeed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.15,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
