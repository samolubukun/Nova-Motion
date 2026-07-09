/**
 * ListFullscreenSequence - フルスクリーン順次表示（1要素ずつ）
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListFullscreenSequence = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const items = [
    { num: "01", text: "INNOVATE", color: C.accent },
    { num: "02", text: "CREATE", color: C.secondary },
    { num: "03", text: "DELIVER", color: C.tertiary },
  ];

  // 各シーンの時間
  const sceneDuration = 30;

  // 現在のシーン
  const sceneIndex = Math.min(
    Math.floor((frame - startDelay) / sceneDuration),
    items.length - 1
  );

  const sceneFrame = (frame - startDelay) % sceneDuration;
  const currentItem = items[Math.max(0, sceneIndex)];

  const enterProgress = lerp(sceneFrame, [0, 15], [0, 1], EASE.out);
  const exitProgress = lerp(sceneFrame, [20, 30], [1, 0], EASE.out);
  const progress = Math.min(enterProgress, exitProgress);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - progress) * -100}px)`,
          opacity: progress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[600],
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          STEP {currentItem.num}
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 140,
            fontWeight: 900,
            color: currentItem.color,
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          {currentItem.text}
        </div>
      </div>

      {/* 進捗インジケーター */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          display: "flex",
          gap: 8,
        }}
      >
        {items.map((item, i) => (
          <div
            key={`indicator-${item.num}`}
            style={{
              width: i === sceneIndex ? 40 : 20,
              height: 4,
              background: i === sceneIndex ? currentItem.color : C.gray[800],
              borderRadius: 2,
              transition: "width 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>

      {/* 右側の番号（大きく薄く） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 200,
          fontWeight: 100,
          color: C.gray[900],
          opacity: progress,
        }}
      >
        {currentItem.num}
      </div>
    </AbsoluteFill>
  );
};
