/**
 * CinematicAnime - アニメ風タイトル
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const CinematicAnime = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame: frame - startDelay - 10,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  const speedLines = Array.from({ length: 30 }).map((_, i) => ({
    y: random(`speed-y-${i}`) * 100,
    delay: random(`speed-d-${i}`) * 20,
    length: random(`speed-l-${i}`) * 200 + 100,
  }));

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)",
      }}
    >
      {/* スピードライン */}
      {speedLines.map((line, i) => {
        const x = lerp(frame, [startDelay + line.delay, startDelay + line.delay + 15], [120, -20], EASE.out);

        return (
          <div
            key={`speed-line-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${line.y}%`,
              width: line.length,
              height: 2,
              background: `linear-gradient(90deg, ${C.white}, transparent)`,
              opacity: 0.3,
            }}
          />
        );
      })}

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${titleProgress})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: C.white,
            letterSpacing: -4,
            textShadow: `4px 4px 0 ${C.secondary}, 8px 8px 0 ${C.accent}`,
          }}
        >
          HERO
        </div>
      </div>

      {/* サブタイトル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "25%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 20,
          color: C.secondary,
          letterSpacing: 8,
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 1]),
        }}
      >
        THE BEGINNING
      </div>

      {/* 装飾ライン */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "65%",
          transform: "translateX(-50%)",
          width: lerp(frame, [startDelay + 30, startDelay + 50], [0, 300], EASE.out),
          height: 4,
          background: `linear-gradient(90deg, transparent, ${C.secondary}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
