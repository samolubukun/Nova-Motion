/**
 * LiquidInkSplash - インクスプラッシュリビール（Spotify風）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, font } from "../../common";
import { generateBlobPath } from "./shared/blobUtils";

export const LiquidInkSplash = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({
    frame: frame - startDelay - 25,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const rotation = (frame - startDelay) * 2;

  // 複数のスプラッシュレイヤー
  const splashes = [
    { scale: 1, rotation: rotation, color: C.white, delay: 0 },
    { scale: 0.8, rotation: -rotation * 1.2, color: C.spotify, delay: 5 },
    { scale: 0.6, rotation: rotation * 0.8, color: C.black, delay: 10 },
  ];

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* スプラッシュレイヤー */}
      {splashes.map((splash, i) => {
        const splashSpring = spring({
          frame: frame - startDelay - splash.delay,
          fps,
          config: { damping: 10, stiffness: 50 },
        });

        return (
          <div
            key={`splash-layer-${splash.color}-${splash.delay}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${splash.rotation}deg) scale(${splashSpring * splash.scale * 3})`,
            }}
          >
            <svg
              width="600"
              height="600"
              viewBox="-300 -300 600 600"
              style={{ overflow: "visible" }}
              aria-hidden="true"
            >
              {/* メインブロブ */}
              <path
                d={generateBlobPath(`splash-${i}`, 8, 0.4, 150)}
                fill={splash.color}
                opacity={0.9}
              />
              {/* サブブロブ */}
              {Array.from({ length: 5 }).map((_, j) => {
                const angle = (j / 5) * Math.PI * 2 + rotation * 0.01;
                const dist = 120 + random(`sub-dist-${i}-${j}`) * 60;
                const x = Math.cos(angle) * dist;
                const y = Math.sin(angle) * dist;
                const size = 30 + random(`sub-size-${i}-${j}`) * 40;

                return (
                  <circle
                    key={`sub-${splash.delay}-${j}`}
                    cx={x}
                    cy={y}
                    r={size * splashSpring}
                    fill={splash.color}
                    opacity={0.8}
                  />
                );
              })}
            </svg>
          </div>
        );
      })}

      {/* 中央のロゴ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${logoProgress})`,
          fontFamily: font,
          fontSize: 80,
          fontWeight: 900,
          color: C.white,
          textShadow: `0 0 40px ${C.spotify}`,
          opacity: logoProgress,
        }}
      >
        SPLASH
      </div>
    </AbsoluteFill>
  );
};
