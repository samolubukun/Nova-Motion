/**
 * DataStatsCards - Stats Cards - Statistical Cards (Asymmetric Layout)
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export interface StatsCardItem {
  label: string;
  value: string;
  color?: string;
}

export const DataStatsCards = ({ startDelay = 0, title = "TOTAL REVENUE", subtitle = "Q4 2024 — OVERVIEW", mainValue = 89420, mainChange = "12.5% from last quarter", mainPrefix = "$", data = [
    { label: "ACTIVE USERS", value: "24,580", color: C.accent },
    { label: "CONVERSION", value: "4.8%", color: C.secondary },
    { label: "ONLINE NOW", value: "1,847", color: C.tertiary },
  ] }: {
  startDelay?: number;
  title?: string;
  subtitle?: string;
  mainValue?: number;
  mainChange?: string;
  mainPrefix?: string;
  data?: Array<StatsCardItem>;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const subProgress = spring({
    frame: frame - startDelay - 15,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const countProgress = lerp(frame, [startDelay + 10, startDelay + 50], [0, 1], EASE.out);
  const animatedValue = Math.floor(mainValue * countProgress).toLocaleString();

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - mainProgress) * -80}px)`,
          opacity: mainProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 12,
            color: C.gray[600],
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 800,
            color: C.white,
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          {mainPrefix}{animatedValue}
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.success,
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }}>↑</span>
          <span>{mainChange}</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 80,
          top: 120,
          width: 280,
          opacity: subProgress,
          transform: `translateY(${(1 - subProgress) * 40}px)`,
        }}
      >
        {data.map((item, i) => (
          <div
            key={`stat-${i}`}
            style={{
              borderLeft: `2px solid ${item.color || C.accent}`,
              paddingLeft: 20,
              marginBottom: i < data.length - 1 ? 50 : 0,
            }}
          >
            <div
              style={{
                fontFamily: font,
                fontSize: 11,
                color: C.gray[600],
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: 36,
                fontWeight: 700,
                color: C.white,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 60,
          width: lerp(frame, [startDelay + 30, startDelay + 60], [0, 400]),
          height: 1,
          background: C.gray[800],
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 60,
          fontFamily: font,
          fontSize: 11,
          color: C.gray[700],
          letterSpacing: 2,
          opacity: subProgress,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
