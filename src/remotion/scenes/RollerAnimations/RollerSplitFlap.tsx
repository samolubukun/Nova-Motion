/**
 * RollerSplitFlap - スプリットフラップ（空港案内板風）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const RollerSplitFlap = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["PARIS", "LONDON", "TOKYO", "NEW YORK", "SYDNEY", "BERLIN"];
  const finalWord = "WELCOME";
  const allWords = [...words, finalWord];
  const t = frame - startDelay;

  // 各文字のフラップ
  const maxLength = Math.max(...allWords.map(w => w.length));
  const duration = 90;
  const wordDuration = duration / allWords.length;

  // 現在の単語インデックス
  const currentWordIndex = Math.min(
    Math.floor(t / wordDuration),
    allWords.length - 1
  );
  const currentWord = allWords[currentWordIndex].padEnd(maxLength, " ");
  const isFinal = currentWordIndex === allWords.length - 1;

  // 単語切り替え時のフラップアニメーション
  const wordProgress = (t % wordDuration) / wordDuration;
  const flapProgress = spring({
    frame: Math.floor(wordProgress * 15),
    fps,
    config: { damping: 20, stiffness: 400 },
  });

  return (
    <AbsoluteFill style={{ background: C.gray[900] }}>
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
            fontSize: 14,
            color: C.gray[600],
            letterSpacing: 4,
            marginBottom: 30,
          }}
        >
          DESTINATION
        </div>

        {/* フラップボード */}
        <div
          style={{
            display: "flex",
            gap: 8,
            background: C.black,
            padding: "20px 30px",
            borderRadius: 8,
          }}
        >
          {currentWord.split("").map((char, charIdx) => {
            // 各文字のフラップ遅延
            const charDelay = charIdx * 0.1;
            const charFlap = Math.max(0, flapProgress - charDelay);

            return (
              <div
                key={`flap-pos-${charIdx}-word-${currentWordIndex}`}
                style={{
                  width: 50,
                  height: 70,
                  background: C.gray[800],
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: font,
                  fontSize: 48,
                  fontWeight: 700,
                  color: isFinal ? C.warning : C.white,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {/* 中央の溝 */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "50%",
                    height: 2,
                    background: C.black,
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                />

                {/* 文字 */}
                <span
                  style={{
                    transform: `rotateX(${(1 - charFlap) * 90}deg)`,
                    transformOrigin: "center",
                  }}
                >
                  {char}
                </span>
              </div>
            );
          })}
        </div>

        {/* ステータス */}
        <div
          style={{
            marginTop: 30,
            fontFamily: font,
            fontSize: 16,
            color: isFinal ? C.success : C.gray[600],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {isFinal && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.success,
              }}
            />
          )}
          {isFinal ? "CONFIRMED" : "SEARCHING..."}
        </div>
      </div>
    </AbsoluteFill>
  );
};
