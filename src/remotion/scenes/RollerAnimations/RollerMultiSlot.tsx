/**
 * RollerMultiSlot - マルチスロット - 複数列が順番に止まる
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerMultiSlot = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3列のスロット（最後のワードが最終結果）
  const slots = [
    { words: ["Make", "Build", "Create", "Design", "Craft", "CREATE"], stopFrame: 50 },
    { words: ["the", "a", "your", "our", "THE"], stopFrame: 65 },
    { words: ["magic", "future", "dream", "vision", "FUTURE"], stopFrame: 80 },
  ];

  const wordHeight = 60;
  const t = frame - startDelay;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        {slots.map((slot, slotIndex) => {
          const finalIndex = slot.words.length - 1;
          const totalScroll = finalIndex * wordHeight;

          // スピン中か停止済みか
          const isSpinning = t < slot.stopFrame;

          // 連続スクロール位置を計算
          let scrollY = 0;

          if (isSpinning) {
            // 回転中：加速→高速
            // 開始を少しずらして各スロットの開始タイミングを変える
            const slotStart = slotIndex * 5;
            const localT = Math.max(0, t - slotStart);

            // 加速カーブ：最初ゆっくり→高速
            const accelDuration = 20;
            const maxSpeed = 8; // ピクセル/フレーム

            if (localT < accelDuration) {
              // 加速フェーズ
              const accelProgress = localT / accelDuration;
              const speed = maxSpeed * Easing.in(Easing.quad)(accelProgress);
              scrollY = (localT * speed * 0.5) % (slot.words.length * wordHeight);
            } else {
              // 高速回転フェーズ
              const baseScroll = accelDuration * maxSpeed * 0.5 * 0.5; // 加速中のスクロール量
              const highSpeedT = localT - accelDuration;
              scrollY = (baseScroll + highSpeedT * maxSpeed) % (slot.words.length * wordHeight);
            }
          } else {
            // 停止フェーズ：バウンス付きで最終位置へ
            const stopT = t - slot.stopFrame;
            const bounceSpring = spring({
              frame: stopT,
              fps,
              config: { damping: 10, stiffness: 250 },
            });

            // オーバーシュートしてバウンスバック
            const overshoot = 20 * Math.exp(-stopT * 0.15) * Math.sin(stopT * 0.8);
            scrollY = totalScroll + (1 - bounceSpring) * overshoot;
          }

          // 表示するワードとオフセット
          const wrappedScroll = ((scrollY % (slot.words.length * wordHeight)) + slot.words.length * wordHeight) % (slot.words.length * wordHeight);
          const displayIndex = Math.floor(wrappedScroll / wordHeight) % slot.words.length;
          const nextIndex = (displayIndex + 1) % slot.words.length;
          const offsetY = wrappedScroll % wordHeight;

          // 停止確定後
          const isFinal = !isSpinning && t >= slot.stopFrame + 15;
          const finalWord = slot.words[finalIndex];

          // 停止時の衝撃エフェクト
          const stopImpact = !isSpinning && t < slot.stopFrame + 8
            ? spring({
                frame: t - slot.stopFrame,
                fps,
                config: { damping: 15, stiffness: 400 },
              })
            : 1;

          // モーションブラー（回転中のみ）
          const blurAmount = isSpinning ? 3 : 0;

          return (
            <div
              key={`slot-col-${slot.stopFrame}`}
              style={{
                height: wordHeight + 20,
                minWidth: slotIndex === 0 ? 180 : slotIndex === 1 ? 100 : 180,
                overflow: "hidden",
                background: C.gray[900],
                borderRadius: 8,
                border: isFinal ? `2px solid ${C.accent}` : `2px solid ${C.gray[800]}`,
                position: "relative",
                transform: `scale(${stopImpact})`,
                boxShadow: isFinal ? `0 0 20px ${C.accent}66` : "none",
              }}
            >
              {/* 上下グラデーションマスク */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 15,
                  background: `linear-gradient(${C.gray[900]}, transparent)`,
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 15,
                  background: `linear-gradient(transparent, ${C.gray[900]})`,
                  zIndex: 2,
                }}
              />

              {/* スクロールコンテナ */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 0,
                  right: 0,
                  transform: `translateY(${-offsetY}px)`,
                  filter: `blur(${blurAmount}px)`,
                }}
              >
                {/* 停止後は最終ワードのみ表示 */}
                {isFinal ? (
                  <div
                    style={{
                      height: wordHeight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: font,
                      fontSize: 36,
                      fontWeight: 700,
                      color: C.accent,
                    }}
                  >
                    {finalWord}
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        height: wordHeight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: font,
                        fontSize: 32,
                        fontWeight: 500,
                        color: C.white,
                      }}
                    >
                      {slot.words[displayIndex]}
                    </div>
                    <div
                      style={{
                        height: wordHeight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: font,
                        fontSize: 32,
                        fontWeight: 500,
                        color: C.white,
                      }}
                    >
                      {slot.words[nextIndex]}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 完成時のフラッシュ */}
      {t >= 85 && (
        <AbsoluteFill
          style={{
            background: C.accent,
            opacity: lerp(t, [85, 92], [0.4, 0], EASE.out),
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 100,
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 14,
          color: C.gray[600],
          letterSpacing: 3,
          opacity: t >= 85 ? lerp(t, [85, 95], [0, 1]) : 0,
        }}
      >
        MULTI-SLOT REVEAL
      </div>
    </AbsoluteFill>
  );
};
