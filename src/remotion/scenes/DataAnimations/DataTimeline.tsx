/**
 * DataTimeline - タイムライン - 時系列表示
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const DataTimeline = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const events = [
    { year: "2020", title: "Founded", desc: "Company established" },
    { year: "2021", title: "Series A", desc: "$10M funding raised" },
    { year: "2022", title: "Global", desc: "Expanded to 20 countries" },
    { year: "2023", title: "IPO", desc: "Public listing" },
    { year: "2024", title: "100M Users", desc: "Major milestone" },
  ];

  return (
    <AbsoluteFill style={{ background: C.black, padding: 60 }}>
      {/* タイトル */}
      <div
        style={{
          fontFamily: font,
          fontSize: 40,
          fontWeight: 700,
          color: C.white,
          marginBottom: 60,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        Our Journey
      </div>

      {/* タイムライン */}
      <div style={{ position: "relative", marginLeft: 100 }}>
        {/* 縦線 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 3,
            height: lerp(frame, [startDelay, startDelay + 80], [0, events.length * 100 - 20]),
            background: `linear-gradient(to bottom, ${C.accent}, ${C.secondary})`,
          }}
        />

        {/* イベント */}
        {events.map((event, i) => {
          const delay = startDelay + 15 + i * 12;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`timeline-${event.year}`}
              style={{
                position: "relative",
                marginBottom: 60,
                paddingLeft: 50,
                transform: `translateX(${(1 - progress) * 50}px)`,
                opacity: progress,
              }}
            >
              {/* ドット */}
              <div
                style={{
                  position: "absolute",
                  left: -8,
                  top: 8,
                  width: 20,
                  height: 20,
                  background: C.accent,
                  borderRadius: "50%",
                  border: `3px solid ${C.black}`,
                  transform: `scale(${progress})`,
                }}
              />

              {/* 年 */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 14,
                  color: C.accent,
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                {event.year}
              </div>

              {/* タイトル */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.white,
                  marginBottom: 8,
                }}
              >
                {event.title}
              </div>

              {/* 説明 */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 16,
                  color: C.gray[500],
                }}
              >
                {event.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
