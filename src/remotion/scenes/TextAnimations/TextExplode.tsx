/**
 * TextExplode - 爆発テキスト - 中心から文字が散らばる
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextExplode = ({ text = "BOOM", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");

  // 爆発前の集合フェーズ
  const gatherProgress = lerp(frame, [startDelay, startDelay + 25], [0, 1], EASE.out);
  // 爆発フェーズ
  const explodeFrame = startDelay + 30;
  const isExploding = frame >= explodeFrame;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* フラッシュ効果 */}
      {frame >= explodeFrame && frame < explodeFrame + 5 && (
        <AbsoluteFill
          style={{
            background: C.white,
            opacity: interpolate(frame, [explodeFrame, explodeFrame + 5], [0.8, 0]),
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {chars.map((char, i) => {
          const angle = (i / chars.length) * Math.PI * 2;
          const distance = isExploding
            ? spring({
                frame: frame - explodeFrame,
                fps,
                config: { damping: 20, stiffness: 100 },
              }) * 300
            : 0;

          const x = isExploding ? Math.cos(angle) * distance : 0;
          const y = isExploding ? Math.sin(angle) * distance : 0;
          const rotation = isExploding ? (frame - explodeFrame) * (i % 2 === 0 ? 5 : -5) : 0;
          const scale = isExploding
            ? interpolate(frame, [explodeFrame, explodeFrame + 40], [1.5, 0.8], {
                extrapolateRight: "clamp",
              })
            : gatherProgress;

          return (
            <span
              key={`explode-${i}-${char}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                fontFamily: font,
                fontSize: 120,
                fontWeight: 900,
                color: C.white,
                transform: `
                  translate(-50%, -50%)
                  translate(${x}px, ${y}px)
                  rotate(${rotation}deg)
                  scale(${scale})
                `,
                opacity: isExploding
                  ? interpolate(frame, [explodeFrame + 20, explodeFrame + 50], [1, 0], {
                      extrapolateRight: "clamp",
                    })
                  : gatherProgress,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* 衝撃波 */}
      {isExploding && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: spring({
              frame: frame - explodeFrame,
              fps,
              config: { damping: 30, stiffness: 80 },
            }) * 800,
            height: spring({
              frame: frame - explodeFrame,
              fps,
              config: { damping: 30, stiffness: 80 },
            }) * 800,
            borderRadius: "50%",
            border: `3px solid ${C.accent}`,
            transform: "translate(-50%, -50%)",
            opacity: interpolate(frame, [explodeFrame, explodeFrame + 30], [0.8, 0], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
