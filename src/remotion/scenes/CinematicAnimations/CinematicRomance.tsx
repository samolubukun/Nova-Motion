/**
 * CinematicRomance - ロマンスタイトル
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const CinematicRomance = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = lerp(frame, [startDelay + 20, startDelay + 50], [0, 1]);
  const heartScale = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      {/* ボケ効果 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = random(`romance-x-${i}`) * 100;
        const y = random(`romance-y-${i}`) * 100;
        const size = random(`romance-s-${i}`) * 100 + 50;
        const pulse = 0.5 + Math.sin((frame - startDelay) * 0.05 + i) * 0.3;

        return (
          <div
            key={`romance-bokeh-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: `radial-gradient(circle, ${C.secondary}40 0%, transparent 70%)`,
              borderRadius: "50%",
              opacity: pulse * lerp(frame, [startDelay, startDelay + 30], [0, 1]),
            }}
          />
        );
      })}

      {/* ハートアイコン */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "35%",
          transform: `translate(-50%, -50%) scale(${heartScale})`,
          fontSize: 80,
          opacity: heartScale,
        }}
      >
        ❤️
      </div>

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 300,
            fontStyle: "italic",
            color: C.white,
            letterSpacing: 8,
            opacity: titleOpacity,
          }}
        >
          Forever
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            color: C.secondary,
            letterSpacing: 6,
            marginTop: 20,
            opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
          }}
        >
          A LOVE STORY
        </div>
      </div>
    </AbsoluteFill>
  );
};
