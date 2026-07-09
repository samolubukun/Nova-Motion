/**
 * RollerSlotReveal - スロットリビール - 「New [X]」形式でゆっくり→高速→キャッチコピー
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const RollerSlotReveal = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const prefix = "New";
  const words = [
    "Feature",
    "Product",
    "Design",
    "Service",
    "Solution",
    "Platform",
    "Experience",
    "Vision",
    "Future",
    "Beginning",
  ];

  const wordHeight = 100;
  const t = frame - startDelay;
  const finalIndex = words.length - 1;

  // 連続的なスクロール位置を計算（ピクセル単位）
  // イージングカーブで滑らかに加速→減速
  const totalScrollDistance = finalIndex * wordHeight;

  // 全体の進行度を1つのイージングで管理
  // カスタムイージング：最初ゆっくり→中盤高速→最後ゆっくり
  // 85fでロール完了（最後をめちゃゆっくり）、残り5fは余韻
  const duration = 85;
  const progress = Math.min(Math.max(t / duration, 0), 1);

  // ベジェ曲線でS字カーブを作成（ゆっくり→速く→最後めちゃゆっくり）
  const easeInOutCustom = (x: number): number => {
    if (x < 0.15) {
      // 最初15%：ゆっくり加速
      return 0.02 * Math.pow(x / 0.15, 2);
    } else if (x < 0.3) {
      // 中盤15%：高速
      const mid = (x - 0.15) / 0.15;
      return 0.02 + 0.45 * mid;
    } else {
      // 最後70%：めちゃゆっくり減速（Beginningがゆ〜っくり上がってくる）
      const end = (x - 0.3) / 0.7;
      return 0.47 + 0.53 * (1 - Math.pow(1 - end, 7));
    }
  };

  const easedProgress = easeInOutCustom(progress);
  const scrollY = easedProgress * totalScrollDistance;

  // スプリングで最終停止を滑らかに
  const isStopping = t >= duration - 15;
  const springScroll = isStopping
    ? spring({
        frame: t - (duration - 15),
        fps,
        config: { damping: 20, stiffness: 150 },
      })
    : 0;

  // 最終スクロール位置
  const targetScroll = totalScrollDistance;
  const finalScroll = isStopping
    ? scrollY + (targetScroll - scrollY) * springScroll
    : scrollY;

  // 現在表示するワードとオフセット
  const currentIndex = Math.floor(finalScroll / wordHeight);
  const offsetY = finalScroll % wordHeight;

  const displayIndex = Math.min(currentIndex, finalIndex);
  const nextIndex = Math.min(displayIndex + 1, finalIndex);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* 固定テキスト */}
        <div
          style={{
            fontFamily: font,
            fontSize: 64,
            fontWeight: 300,
            color: C.white,
            opacity: lerp(t, [0, 15], [0, 1]),
          }}
        >
          {prefix}
        </div>

        {/* ローラー */}
        <div
          style={{
            height: wordHeight,
            overflow: "hidden",
            position: "relative",
            minWidth: 500,
          }}
        >
          {/* グラデーションマスク */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 20,
              background: `linear-gradient(${C.black}, transparent)`,
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
              height: 20,
              background: `linear-gradient(transparent, ${C.black})`,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* ワードコンテナ */}
          <div
            style={{
              transform: `translateY(${-offsetY}px)`,
            }}
          >
            {/* 現在のワード */}
            <div
              style={{
                fontFamily: font,
                fontSize: displayIndex === finalIndex ? 80 : 64,
                fontWeight: displayIndex === finalIndex ? 800 : 700,
                color: displayIndex === finalIndex ? C.accent : C.white,
                height: wordHeight,
                display: "flex",
                alignItems: "center",
              }}
            >
              {words[displayIndex]}
            </div>

            {/* 次のワード */}
            {displayIndex < finalIndex && (
              <div
                style={{
                  fontFamily: font,
                  fontSize: nextIndex === finalIndex ? 80 : 64,
                  fontWeight: nextIndex === finalIndex ? 800 : 700,
                  color: nextIndex === finalIndex ? C.accent : C.white,
                  height: wordHeight,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {words[nextIndex]}
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
