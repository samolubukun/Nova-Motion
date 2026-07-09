/**
 * ParticleLightning - 電気/雷エフェクト
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, font } from "../../common";

export const ParticleLightning = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const lightningActive = (frame - startDelay) % 40 < 5;
  const flashIntensity = lightningActive ? random(`lightning-${Math.floor(frame / 5)}`) : 0;

  // 雷の生成
  const generateLightningPath = () => {
    let path = "M 640 0";
    let x = 640;
    let y = 0;

    while (y < 720) {
      const newX = x + (random(`lx-${y}-${frame}`) - 0.5) * 100;
      const newY = y + random(`ly-${y}-${frame}`) * 50 + 30;
      path += ` L ${newX} ${newY}`;
      x = newX;
      y = newY;
    }

    return path;
  };

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {/* 雲 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to bottom, ${C.gray[800]}, transparent)`,
        }}
      />

      {/* 雷 */}
      {lightningActive && (
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute" }}
          aria-hidden="true"
        >
          <path
            d={generateLightningPath()}
            stroke={C.white}
            strokeWidth={4}
            fill="none"
            opacity={flashIntensity}
            filter="url(#glow)"
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      )}

      {/* フラッシュ */}
      {lightningActive && (
        <AbsoluteFill
          style={{
            background: C.white,
            opacity: flashIntensity * 0.3,
          }}
        />
      )}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "20%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
          textShadow: lightningActive ? `0 0 30px ${C.white}` : "none",
        }}
      >
        THUNDER
      </div>
    </AbsoluteFill>
  );
};
