/**
 * BackgroundAurora - オーロラ効果
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundAurora = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const layer1X = Math.sin((frame - startDelay) * 0.02) * 20;
  const layer2X = Math.cos((frame - startDelay) * 0.03) * 30;
  const layer3X = Math.sin((frame - startDelay) * 0.015 + 1) * 25;

  return (
    <AbsoluteFill style={{ background: "#0a0a20" }}>
      {/* オーロラレイヤー1 */}
      <div
        style={{
          position: "absolute",
          left: `${40 + layer1X}%`,
          top: "10%",
          width: "60%",
          height: "50%",
          background: `radial-gradient(ellipse at center, ${C.accent}60 0%, transparent 70%)`,
          filter: "blur(60px)",
          transform: `rotate(${(frame - startDelay) * 0.2}deg)`,
        }}
      />

      {/* オーロラレイヤー2 */}
      <div
        style={{
          position: "absolute",
          left: `${20 + layer2X}%`,
          top: "20%",
          width: "70%",
          height: "40%",
          background: `radial-gradient(ellipse at center, ${C.tertiary}50 0%, transparent 70%)`,
          filter: "blur(80px)",
          transform: `rotate(${-(frame - startDelay) * 0.15}deg)`,
        }}
      />

      {/* オーロラレイヤー3 */}
      <div
        style={{
          position: "absolute",
          left: `${50 + layer3X}%`,
          top: "5%",
          width: "50%",
          height: "60%",
          background: `radial-gradient(ellipse at center, ${C.secondary}40 0%, transparent 70%)`,
          filter: "blur(70px)",
          transform: `rotate(${(frame - startDelay) * 0.1}deg)`,
        }}
      />

      {/* 星 */}
      {Array.from({ length: 30 }).map((_, i) => {
        const twinkle = Math.sin((frame - startDelay) * 0.1 + i) * 0.5 + 0.5;
        return (
          <div
            key={`star-aurora-${i}`}
            style={{
              position: "absolute",
              left: `${random(`star-x-${i}`) * 100}%`,
              top: `${random(`star-y-${i}`) * 60}%`,
              width: random(`star-s-${i}`) * 3 + 1,
              height: random(`star-s-${i}`) * 3 + 1,
              background: C.white,
              borderRadius: "50%",
              opacity: twinkle * 0.8,
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "20%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 60,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay, startDelay + 40], [0, 1]),
          textShadow: `0 0 40px ${C.accent}`,
        }}
      >
        AURORA
      </div>
    </AbsoluteFill>
  );
};
