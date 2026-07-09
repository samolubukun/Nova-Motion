/**
 * DataBarChart - バーチャート - 棒グラフ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export interface BarChartDataItem {
  label: string;
  value: number;
  color?: string;
}

export const DataBarChart = ({
  startDelay = 0,
  title = "Weekly Activity",
  subtitle = "User engagement metrics",
  data = [
    { label: "Mon", value: 65, color: C.accent },
    { label: "Tue", value: 85, color: C.accent },
    { label: "Wed", value: 45, color: C.accent },
    { label: "Thu", value: 92, color: C.accent },
    { label: "Fri", value: 78, color: C.accent },
    { label: "Sat", value: 55, color: C.gray[600] },
    { label: "Sun", value: 40, color: C.gray[600] },
  ]
}: {
  startDelay?: number;
  title?: string;
  subtitle?: string;
  data?: Array<BarChartDataItem>;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.gray[950], padding: 60 }}>
      {/* タイトル */}
      <div
        style={{
          fontFamily: font,
          fontSize: 40,
          fontWeight: 700,
          color: C.white,
          marginBottom: 20,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: font,
          fontSize: 16,
          color: C.gray[500],
          marginBottom: 50,
          opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
        }}
      >
        {subtitle}
      </div>

      {/* チャートエリア */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: 350,
          paddingBottom: 50,
          borderBottom: `1px solid ${C.gray[800]}`,
        }}
      >
        {data.map((item, i) => {
          const delay = startDelay + 20 + i * 5;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 100 },
          });

          const barHeight = (item.value / 100) * 280 * progress;

          return (
            <div
              key={`bar-${item.label}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 80,
              }}
            >
              {/* 値 */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.white,
                  marginBottom: 10,
                  opacity: progress,
                }}
              >
                {Math.round(item.value * progress)}
              </div>

              {/* バー */}
              <div
                style={{
                  width: 50,
                  height: barHeight,
                  background: `linear-gradient(to top, ${item.color || C.accent}, ${item.color || C.accent}cc)`,
                  borderRadius: "6px 6px 0 0",
                }}
              />

              {/* ラベル */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 14,
                  color: C.gray[500],
                  marginTop: 15,
                  opacity: progress,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div
        style={{
          display: "flex",
          gap: 30,
          marginTop: 30,
          opacity: lerp(frame, [startDelay + 60, startDelay + 80], [0, 1]),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, background: C.accent, borderRadius: 2 }} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.gray[500] }}>Weekday</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, background: C.gray[600], borderRadius: 2 }} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.gray[500] }}>Weekend</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
