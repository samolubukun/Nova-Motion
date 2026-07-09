/**
 * RollerGradientWave - グラデーションウェーブ - 色が波のように流れながら変化
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerGradientWave = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const words = ["Dream", "Design", "Develop", "Deliver", "DOMINATE"];
  const t = frame - startDelay;

  const wordDuration = 25;
  const currentIndex = Math.min(
    Math.floor(t / wordDuration),
    words.length - 1
  );
  const currentWord = words[currentIndex];
  const isFinal = currentIndex === words.length - 1;

  const cycleFrame = t % wordDuration;

  // 波のオフセット
  const waveOffset = t * 0.1;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
      }}
    >
      {/* 背景のグラデーション波 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: `
            radial-gradient(
              ellipse at ${50 + Math.sin(waveOffset) * 20}% ${50 + Math.cos(waveOffset) * 20}%,
              ${C.accent}26 0%,
              transparent 50%
            )
          `,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        {/* メインワード */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {currentWord.split("").map((char, pos) => {
            // 各文字に波のような色変化
            const charWave = Math.sin(waveOffset * 2 + pos * 0.5);
            const hue = isFinal ? 45 : 250 + charWave * 20; // 最終は金色
            const lightness = 50 + charWave * 10;

            // 入場アニメーション
            const enterDelay = pos * 2;
            const enterProgress = lerp(cycleFrame - enterDelay, [0, 8], [0, 1], EASE.out);

            // currentWordとposで一意のキーを作成
            const uniqueKey = `${currentWord}-${char}${pos}`;

            return (
              <div
                key={`gradient-${uniqueKey}`}
                style={{
                  fontFamily: font,
                  fontSize: isFinal ? 100 : 80,
                  fontWeight: 800,
                  color: `hsl(${hue}, 80%, ${lightness}%)`,
                  transform: `translateY(${(1 - enterProgress) * 30}px)`,
                  opacity: enterProgress,
                  textShadow: isFinal
                    ? `0 0 30px ${C.warning}80`
                    : `0 0 20px hsla(${hue}, 80%, ${lightness}%, 0.3)`,
                }}
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* 下のバー */}
        <div
          style={{
            width: 200,
            height: 4,
            background: C.gray[800],
            margin: "30px auto 0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((currentIndex + 1) / words.length) * 100}%`,
              height: "100%",
              background: isFinal
                ? `linear-gradient(90deg, ${C.warning}, ${C.gold})`
                : `linear-gradient(90deg, ${C.accent}, #8b5cf6)`,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
