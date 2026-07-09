/**
 * DataRanking - ランキング - リストアニメーション
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const DataRanking = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { rank: 1, name: "Tokyo", value: "37.4M", change: "up" },
    { rank: 2, name: "Delhi", value: "32.9M", change: "up" },
    { rank: 3, name: "Shanghai", value: "29.2M", change: "down" },
    { rank: 4, name: "São Paulo", value: "22.4M", change: "same" },
    { rank: 5, name: "Mexico City", value: "21.9M", change: "up" },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950], padding: 60 }}>
      {/* タイトル */}
      <div
        style={{
          fontFamily: font,
          fontSize: 40,
          fontWeight: 700,
          color: C.white,
          marginBottom: 15,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        Top Cities
      </div>
      <div
        style={{
          fontFamily: font,
          fontSize: 16,
          color: C.gray[500],
          marginBottom: 40,
          opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
        }}
      >
        By population (2024)
      </div>

      {/* リスト */}
      {items.map((item, i) => {
        const delay = startDelay + 25 + i * 8;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 15, stiffness: 150 },
        });

        const changeIcon =
          item.change === "up" ? "↑" : item.change === "down" ? "↓" : "→";
        const changeColor =
          item.change === "up"
            ? C.success
            : item.change === "down"
            ? C.danger
            : C.gray[500];

        return (
          <div
            key={`rank-${item.rank}`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px 30px",
              marginBottom: 15,
              background: i === 0 ? C.accent : C.gray[900],
              borderRadius: 12,
              transform: `translateX(${(1 - progress) * 100}px)`,
              opacity: progress,
            }}
          >
            {/* 順位 */}
            <div
              style={{
                fontFamily: font,
                fontSize: 32,
                fontWeight: 800,
                color: i === 0 ? C.white : C.gray[500],
                width: 60,
              }}
            >
              #{item.rank}
            </div>

            {/* 名前 */}
            <div
              style={{
                flex: 1,
                fontFamily: font,
                fontSize: 24,
                fontWeight: 600,
                color: C.white,
              }}
            >
              {item.name}
            </div>

            {/* 変動 */}
            <div
              style={{
                fontFamily: font,
                fontSize: 20,
                color: changeColor,
                marginRight: 30,
              }}
            >
              {changeIcon}
            </div>

            {/* 値 */}
            <div
              style={{
                fontFamily: font,
                fontSize: 24,
                fontWeight: 700,
                color: C.white,
              }}
            >
              {item.value}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
