/**
 * RollerCountdown - カウントダウンリビール
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerCountdown = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numbers = ["5", "4", "3", "2", "1"];
  const finalWord = "LAUNCH";
  const wordHeight = 180;
  const t = frame - startDelay;

  // フェーズ分け
  // 0-60f: カウントダウン（各12f）
  // 60-75f: 高速回転
  // 75-90f: 減速→LAUNCH停止
  const countdownDuration = 60;
  const spinDuration = 15;

  const isCountdown = t < countdownDuration;
  const isSpinning = t >= countdownDuration && t < countdownDuration + spinDuration;
  const isStopping = t >= countdownDuration + spinDuration;

  // カウントダウンフェーズの計算
  let scrollY = 0;
  let displayIndex = 0;
  let showFinal = false;

  if (isCountdown) {
    // 各数字を順番に表示（スロット風に上から落ちてくる）
    const framePerNumber = countdownDuration / numbers.length;
    displayIndex = Math.floor(t / framePerNumber);
    const localT = t % framePerNumber;

    // スプリングで滑らかに次の数字へ
    const slideProgress = spring({
      frame: localT,
      fps,
      config: { damping: 15, stiffness: 200 },
    });

    scrollY = (displayIndex + (1 - slideProgress)) * wordHeight;
  } else if (isSpinning) {
    // 高速回転フェーズ
    const spinT = t - countdownDuration;
    // 加速しながら回転
    const speed = 15 + spinT * 2;
    scrollY = numbers.length * wordHeight + spinT * speed;
  } else {
    // 停止フェーズ：LAUNCHで止まる
    showFinal = true;
  }

  // 緊迫感演出：カウントダウンが進むにつれて
  const urgency = isCountdown ? displayIndex / (numbers.length - 1) : 1;

  // 背景色の変化
  const bgRed = Math.floor(10 + urgency * 20);
  const bgColor = isCountdown
    ? `rgb(${bgRed}, 10, 20)`
    : isStopping
      ? "#1a0a0a"
      : C.black;

  // パルス効果（カウントダウン中）
  const pulseScale = isCountdown
    ? 1 + 0.02 * Math.sin(t * 0.5) * (1 + urgency)
    : 1;

  // LAUNCH時の強調
  const launchProgress = isStopping
    ? spring({
        frame: t - (countdownDuration + spinDuration),
        fps,
        config: { damping: 8, stiffness: 150 },
      })
    : 0;

  // 回転中のブラー
  const blurAmount = isSpinning ? 8 : 0;

  return (
    <AbsoluteFill
      style={{
        background: isStopping
          ? `radial-gradient(circle, #2a1a2e 0%, ${C.black} 100%)`
          : bgColor,
        transform: `scale(${pulseScale})`,
      }}
    >
      {/* ビネット効果（緊迫感） */}
      {isCountdown && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle, transparent 30%, rgba(255,0,0,${urgency * 0.15}) 100%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* メインコンテナ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        {showFinal ? (
          // LAUNCH表示
          <div
            style={{
              fontFamily: font,
              fontSize: 100 + launchProgress * 20,
              fontWeight: 900,
              color: "#ff6b6b",
              transform: `scale(${1 + launchProgress * 0.1})`,
              textShadow: `0 0 ${50 * launchProgress}px rgba(255, 107, 107, 0.8)`,
            }}
          >
            {finalWord}
          </div>
        ) : (
          // カウントダウン/回転表示
          <div
            style={{
              height: wordHeight,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* グラデーションマスク */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 40,
                background: `linear-gradient(${bgColor}, transparent)`,
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 40,
                background: `linear-gradient(transparent, ${bgColor})`,
                zIndex: 1,
              }}
            />

            {/* スクロールコンテナ */}
            <div
              style={{
                filter: `blur(${blurAmount}px)`,
              }}
            >
              {isCountdown ? (
                // カウントダウン中：現在と次の数字を表示
                <>
                  <div
                    style={{
                      fontFamily: font,
                      fontSize: 180,
                      fontWeight: 900,
                      color: C.white,
                      height: wordHeight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `translateY(${-(scrollY % wordHeight)}px)`,
                    }}
                  >
                    {numbers[Math.min(displayIndex, numbers.length - 1)]}
                  </div>
                  {displayIndex < numbers.length - 1 && (
                    <div
                      style={{
                        fontFamily: font,
                        fontSize: 180,
                        fontWeight: 900,
                        color: C.white,
                        height: wordHeight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `translateY(${-(scrollY % wordHeight)}px)`,
                      }}
                    >
                      {numbers[displayIndex + 1]}
                    </div>
                  )}
                </>
              ) : (
                // 高速回転中：数字がぐるぐる
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 180,
                    fontWeight: 900,
                    color: C.white,
                    height: wordHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {numbers[Math.floor(scrollY / wordHeight) % numbers.length]}
                </div>
              )}
            </div>
          </div>
        )}

        {/* サブテキスト */}
        {isStopping && (
          <div
            style={{
              fontFamily: font,
              fontSize: 20,
              color: C.gray[400],
              marginTop: 30,
              opacity: launchProgress,
              letterSpacing: 5,
            }}
          >
            YOUR JOURNEY BEGINS
          </div>
        )}
      </div>

      {/* パーティクル（LAUNCH時） */}
      {isStopping &&
        [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg, i) => {
          const angle = (deg / 360) * Math.PI * 2;
          const distance = 80 + launchProgress * 250;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const size = 6 + (i % 3) * 3;

          return (
            <div
              key={`countdown-particle-${deg}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#ff6b6b" : "#ffaa6b",
                transform: `translate(${x}px, ${y}px)`,
                opacity: (1 - launchProgress) * 0.8,
              }}
            />
          );
        })}

      {/* 停止時のフラッシュ */}
      {isStopping && t < countdownDuration + spinDuration + 8 && (
        <AbsoluteFill
          style={{
            background: "#ff6b6b",
            opacity: lerp(
              t - (countdownDuration + spinDuration),
              [0, 8],
              [0.5, 0],
              EASE.out
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
