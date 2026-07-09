/**
 * LogoGlitch - ロゴグリッチ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, font } from "../../common";

export const LogoGlitch = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const glitchActive = frame > startDelay + 30 && random(`glitch-${frame}`) < 0.2;
  const offsetX = glitchActive ? (random(`gx-${frame}`) - 0.5) * 20 : 0;
  const offsetY = glitchActive ? (random(`gy-${frame}`) - 0.5) * 10 : 0;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 赤チャンネル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${offsetX + 3}px), calc(-50% + ${offsetY}px))`,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 900,
          color: "rgba(255, 0, 0, 0.7)",
          mixBlendMode: "screen",
          opacity: glitchActive ? 1 : 0,
        }}
      >
        GLITCH
      </div>

      {/* シアンチャンネル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${-offsetX - 3}px), calc(-50% + ${-offsetY}px))`,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 900,
          color: "rgba(0, 255, 255, 0.7)",
          mixBlendMode: "screen",
          opacity: glitchActive ? 1 : 0,
        }}
      >
        GLITCH
      </div>

      {/* メインロゴ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${entryProgress})`,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 900,
          color: C.white,
        }}
      >
        GLITCH
      </div>

      {/* スキャンライン */}
      {glitchActive && (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.2) 2px,
              rgba(0, 0, 0, 0.2) 4px
            )`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
