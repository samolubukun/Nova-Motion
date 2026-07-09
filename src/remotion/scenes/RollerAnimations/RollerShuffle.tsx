/**
 * RollerShuffle - シャッフルリビール - 文字がシャッフルされて収束
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const RollerShuffle = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const finalWord = "REVEALED";
  const shuffleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const t = frame - startDelay;

  // 各文字が順番に確定していく
  const duration = 60;
  const charsPerFrame = finalWord.length / duration;

  // 確定した文字数
  const confirmedCount = Math.min(
    Math.floor(t * charsPerFrame * 1.5),
    finalWord.length
  );

  // シードベースの擬似ランダム
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

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
            fontSize: 18,
            fontWeight: 500,
            color: C.gray[600],
            letterSpacing: 4,
            marginBottom: 20,
            opacity: lerp(t, [0, 15], [0, 1]),
          }}
        >
          DECODING
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {finalWord.split("").map((char, pos) => {
            const isConfirmed = pos < confirmedCount;

            // シャッフル中の文字
            let displayChar = char;
            if (!isConfirmed) {
              const randomIdx = Math.floor(
                pseudoRandom(t * 0.5 + pos * 100) * shuffleChars.length
              );
              displayChar = shuffleChars[randomIdx];
            }

            // 確定時のアニメーション
            const confirmFrame = pos / charsPerFrame / 1.5;
            const confirmProgress = isConfirmed
              ? spring({
                  frame: Math.max(0, t - confirmFrame),
                  fps,
                  config: { damping: 12, stiffness: 300 },
                })
              : 0;

            // finalWord="REVEALED"は固定なのでcharとposで一意
            const uniqueKey = `${char}${pos}`;

            return (
              <div
                key={`shuffle-${uniqueKey}`}
                style={{
                  fontFamily: font,
                  fontSize: 80,
                  fontWeight: 900,
                  color: isConfirmed ? C.accent : C.gray[800],
                  width: 60,
                  textAlign: "center",
                  transform: `scale(${1 + confirmProgress * 0.2}) translateY(${isConfirmed ? 0 : Math.sin(t * 0.3 + pos) * 3}px)`,
                  textShadow: isConfirmed
                    ? `0 0 ${20 * confirmProgress}px ${C.accent}99`
                    : "none",
                }}
              >
                {displayChar}
              </div>
            );
          })}
        </div>

        {/* プログレスバー */}
        <div
          style={{
            width: 300,
            height: 4,
            background: C.gray[800],
            margin: "30px auto 0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(confirmedCount / finalWord.length) * 100}%`,
              height: "100%",
              background: C.accent,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
