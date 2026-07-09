/**
 * CinematicHorror - ホラータイトル
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const CinematicHorror = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const flickerSeed = Math.floor(frame / 3);
  const flicker = random(`horror-${flickerSeed}`) > 0.15 ? 1 : 0.2;

  const titleOpacity = lerp(frame, [startDelay, startDelay + 10], [0, 1]);
  const glitchOffset = random(`horror-g-${frame}`) > 0.9 ? random(`horror-go-${frame}`) * 10 - 5 : 0;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 血のようなドリップ */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 10 + i * 12;
        const drip = lerp(frame, [startDelay + i * 5, startDelay + 60 + i * 5], [0, 200], EASE.out);

        return (
          <div
            key={`drip-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: 0,
              width: 8,
              height: drip,
              background: `linear-gradient(to bottom, ${C.danger}, ${C.danger}80)`,
              borderRadius: "0 0 4px 4px",
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
          transform: `translate(calc(-50% + ${glitchOffset}px), -50%)`,
          fontFamily: font,
          fontSize: 140,
          fontWeight: 900,
          color: C.danger,
          letterSpacing: 10,
          textShadow: `0 0 30px ${C.danger}, 0 0 60px ${C.danger}60`,
          opacity: titleOpacity * flicker,
        }}
      >
        FEAR
      </div>

      {/* サブテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "25%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 16,
          color: C.gray[500],
          letterSpacing: 8,
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, flicker]),
        }}
      >
        COMING SOON
      </div>

      {/* ノイズオーバーレイ */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.02) 2px,
            rgba(255, 255, 255, 0.02) 4px
          )`,
        }}
      />
    </AbsoluteFill>
  );
};
