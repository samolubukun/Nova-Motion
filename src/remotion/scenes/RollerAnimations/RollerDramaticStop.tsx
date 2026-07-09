/**
 * RollerDramaticStop - ドラマチックストップ - 一度止まりそうになってまた回る
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { C, lerp, font } from "../../common";

export const RollerDramaticStop = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    "Good",
    "Better",
    "Great",
    "Amazing",
    "LEGENDARY", // 最終
  ];

  const wordHeight = 100;
  const t = frame - startDelay;
  const finalIndex = words.length - 1;
  const totalScrollDistance = finalIndex * wordHeight;

  // ドラマチックなイージング：
  // 0-20f: ゆっくり加速（0→15%位置）
  // 20-35f: フェイクストップ（15%付近で減速→ほぼ停止）
  // 35-45f: 「まだだ！」と再加速
  // 45-80f: 高速回転→減速→最終停止
  const duration = 80;
  const progress = Math.min(Math.max(t / duration, 0), 1);

  const dramaticEasing = (x: number): number => {
    if (x < 0.25) {
      // フェーズ1: ゆっくり加速（0→20%位置）
      return 0.2 * Easing.out(Easing.quad)(x / 0.25);
    } else if (x < 0.4375) {
      // フェーズ2: フェイクストップ（減速してほぼ停止、20%→25%でゆっくり）
      const fakeProgress = (x - 0.25) / 0.1875;
      return 0.2 + 0.05 * (1 - Math.pow(1 - fakeProgress, 3));
    } else if (x < 0.5625) {
      // フェーズ3: 再加速！（25%→35%）
      const reaccelProgress = (x - 0.4375) / 0.125;
      return 0.25 + 0.1 * Easing.in(Easing.quad)(reaccelProgress);
    } else {
      // フェーズ4: 高速→最終停止（35%→100%）
      const finalProgress = (x - 0.5625) / 0.4375;
      // 最初は速く、最後はゆっくり止まる
      return 0.35 + 0.65 * (1 - Math.pow(1 - finalProgress, 4));
    }
  };

  const easedProgress = dramaticEasing(progress);
  let scrollY = easedProgress * totalScrollDistance;

  // 最終停止時のバウンス効果
  const isStopping = t >= duration - 10;
  if (isStopping) {
    const bounceProgress = spring({
      frame: t - (duration - 10),
      fps,
      config: { damping: 12, stiffness: 200 },
    });
    const overshoot = 15 * (1 - bounceProgress);
    scrollY = totalScrollDistance + overshoot * Math.sin((t - (duration - 10)) * 0.5);
  }

  // 最終確定
  if (t >= duration) {
    scrollY = totalScrollDistance;
  }

  // 現在表示するワードとオフセット
  const displayIndex = Math.min(Math.floor(scrollY / wordHeight), finalIndex);
  const nextIndex = Math.min(displayIndex + 1, finalIndex);
  const offsetY = scrollY % wordHeight;

  // 最終停止時の強調
  const isFinal = t >= duration;
  const finalEmphasis = isFinal
    ? spring({
        frame: t - duration,
        fps,
        config: { damping: 8, stiffness: 150 },
      })
    : 0;

  // フェイクストップ時の「止まりそう」演出
  const isFakeStop = t >= 20 && t < 35;
  const fakeStopShake = isFakeStop ? Math.sin(t * 2) * 2 * (1 - (t - 20) / 15) : 0;

  return (
    <AbsoluteFill style={{ background: "#1a1a2e" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translateX(${fakeStopShake}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            color: C.gray[400],
            marginBottom: 15,
            opacity: lerp(t, [0, 15], [0, 1]),
          }}
        >
          Not just good, but...
        </div>

        {/* ローラー */}
        <div
          style={{
            height: wordHeight,
            overflow: "hidden",
            position: "relative",
            minWidth: 400,
          }}
        >
          {/* グラデーションマスク */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 25,
              background: "linear-gradient(#1a1a2e, transparent)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 25,
              background: "linear-gradient(transparent, #1a1a2e)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* ワードコンテナ */}
          <div style={{ transform: `translateY(${-offsetY}px)` }}>
            {/* 現在のワード */}
            <div
              style={{
                fontFamily: font,
                fontSize: displayIndex === finalIndex && isFinal ? 72 : 64,
                fontWeight: displayIndex === finalIndex ? 900 : 600,
                color: displayIndex === finalIndex ? "#ffd700" : C.white,
                height: wordHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: displayIndex === finalIndex && isFinal
                  ? `scale(${1 + finalEmphasis * 0.1})`
                  : "none",
                textShadow: displayIndex === finalIndex && isFinal
                  ? `0 0 ${30 * finalEmphasis}px rgba(255, 215, 0, 0.8)`
                  : "none",
              }}
            >
              {words[displayIndex]}
            </div>

            {/* 次のワード */}
            {displayIndex < finalIndex && (
              <div
                style={{
                  fontFamily: font,
                  fontSize: nextIndex === finalIndex ? 72 : 64,
                  fontWeight: nextIndex === finalIndex ? 900 : 600,
                  color: nextIndex === finalIndex ? "#ffd700" : C.white,
                  height: wordHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {words[nextIndex]}
              </div>
            )}
          </div>
        </div>

        {/* サイドライン装飾 */}
        {isFinal && (
          <>
            <div
              style={{
                position: "absolute",
                left: -100,
                top: "50%",
                width: 60 * finalEmphasis,
                height: 3,
                background: "#ffd700",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -100,
                top: "50%",
                width: 60 * finalEmphasis,
                height: 3,
                background: "#ffd700",
                transform: "translateY(-50%)",
              }}
            />
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
