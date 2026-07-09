/**
 * RollerGlitch - グリッチ切り替え
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, font } from "../../common";

export const RollerGlitch = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const words = ["HACK", "CODE", "SHIP", "WIN"];
  const cycleDuration = 30;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const cycleT = currentIndex >= finalIndex ? cycleDuration : t % cycleDuration;

  // グリッチ効果（切り替え時のみ、最終状態では無効）
  const isGlitching = currentIndex < finalIndex && cycleT < 8;
  const glitchIntensity = isGlitching ? Math.sin(cycleT * 2) * 5 : 0;

  return (
    <AbsoluteFill style={{ background: C.black }}>
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
            fontSize: 24,
            fontWeight: 400,
            color: C.gray[600],
            marginBottom: 15,
          }}
        >
          READY TO
        </div>

        {/* グリッチローラー */}
        <div style={{ position: "relative" }}>
          {/* シアンレイヤー */}
          {isGlitching && (
            <div
              style={{
                position: "absolute",
                fontFamily: font,
                fontSize: 100,
                fontWeight: 900,
                color: "#00ffff",
                opacity: 0.7,
                transform: `translateX(${glitchIntensity}px)`,
                clipPath: "inset(0 0 50% 0)",
              }}
            >
              {words[currentIndex]}
            </div>
          )}
          {/* マゼンタレイヤー */}
          {isGlitching && (
            <div
              style={{
                position: "absolute",
                fontFamily: font,
                fontSize: 100,
                fontWeight: 900,
                color: "#ff00ff",
                opacity: 0.7,
                transform: `translateX(${-glitchIntensity}px)`,
                clipPath: "inset(50% 0 0 0)",
              }}
            >
              {words[currentIndex]}
            </div>
          )}
          {/* メインテキスト */}
          <div
            style={{
              fontFamily: font,
              fontSize: 100,
              fontWeight: 900,
              color: C.white,
            }}
          >
            {words[currentIndex]}
          </div>
        </div>
      </div>

      {/* スキャンライン */}
      {isGlitching && (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
