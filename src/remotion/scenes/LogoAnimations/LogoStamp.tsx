/**
 * LogoStamp - ロゴスタンプ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, random } from "remotion";
import { C, font } from "../../common";

export const LogoStamp = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stampProgress = spring({
    frame: frame - startDelay - 10,
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.5 },
  });

  const scale = interpolate(stampProgress, [0, 0.5, 1], [3, 0.9, 1]);
  const rotation = interpolate(stampProgress, [0, 1], [-15, 0]);

  // インクスプラッシュ
  const showSplash = frame >= startDelay + 15 && frame < startDelay + 25;

  return (
    <AbsoluteFill style={{ background: C.gray[100] }}>
      {/* 紙のテクスチャ */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
        }}
      />

      {/* スタンプ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
          opacity: stampProgress,
        }}
      >
        <div
          style={{
            border: `6px solid ${C.danger}`,
            borderRadius: 8,
            padding: "20px 40px",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 48,
              fontWeight: 900,
              color: C.danger,
              letterSpacing: 8,
            }}
          >
            APPROVED
          </div>
        </div>
      </div>

      {/* インクスプラッシュ */}
      {showSplash && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 100 + random(`splash-${i}`) * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <div
                key={`splash-${i}`}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 10 + random(`splash-s-${i}`) * 15,
                  height: 10 + random(`splash-s-${i}`) * 15,
                  background: C.danger,
                  borderRadius: "50%",
                  transform: `translate(${x}px, ${y}px)`,
                  opacity: 0.3,
                }}
              />
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
