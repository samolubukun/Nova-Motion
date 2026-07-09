/**
 * ListTimeline - タイムライン風縦リスト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListTimeline = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { year: "2022", title: "Foundation", desc: "Company established" },
    { year: "2023", title: "Growth", desc: "Series A funding" },
    { year: "2024", title: "Scale", desc: "Global expansion" },
  ];

  // タイムラインの線のアニメーション
  const lineProgress = lerp(frame, [startDelay, startDelay + 80], [0, 100], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 12,
            color: C.gray[600],
            letterSpacing: 3,
            marginBottom: 10,
          }}
        >
          OUR JOURNEY
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 32,
            fontWeight: 700,
            color: C.white,
          }}
        >
          Timeline
        </div>
      </div>

      {/* タイムライン */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 200,
        }}
      >
        {/* 縦線 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 2,
            height: `${lineProgress}%`,
            maxHeight: 350,
            background: C.gray[800],
          }}
        />

        {items.map((item, i) => {
          const delay = startDelay + 20 + i * 25;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`timeline-${item.year}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 80,
                opacity: progress,
                transform: `translateX(${(1 - progress) * 30}px)`,
              }}
            >
              {/* ドット */}
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: i === items.length - 1 ? C.accent : C.gray[700],
                  border: `2px solid ${C.black}`,
                  marginLeft: -5,
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />

              {/* コンテンツ */}
              <div style={{ marginLeft: 40 }}>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 14,
                    color: i === items.length - 1 ? C.accent : C.gray[600],
                    marginBottom: 8,
                  }}
                >
                  {item.year}
                </div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 24,
                    fontWeight: 600,
                    color: C.white,
                    marginBottom: 6,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 14,
                    color: C.gray[500],
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 右側の年（大きく） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 180,
          fontWeight: 100,
          color: C.gray[900],
          opacity: lerp(frame, [startDelay + 60, startDelay + 80], [0, 1]),
        }}
      >
        24
      </div>
    </AbsoluteFill>
  );
};
