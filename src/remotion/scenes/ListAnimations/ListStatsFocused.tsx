/**
 * ListStatsFocused - 数字強調型（統計リスト）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListStatsFocused = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "99.9", unit: "%", label: "Uptime" },
    { value: "50", unit: "ms", label: "Latency" },
    { value: "10", unit: "x", label: "Faster" },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 最初の統計（大きく左に） */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 120,
          opacity: lerp(frame, [startDelay, startDelay + 25], [0, 1], EASE.out),
          transform: `translateX(${lerp(frame, [startDelay, startDelay + 25], [-50, 0], EASE.out)}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: font,
              fontSize: 150,
              fontWeight: 800,
              color: C.white,
              lineHeight: 1,
            }}
          >
            {stats[0].value}
          </span>
          <span
            style={{
              fontFamily: font,
              fontSize: 60,
              fontWeight: 300,
              color: C.accent,
              marginLeft: 10,
            }}
          >
            {stats[0].unit}
          </span>
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 18,
            color: C.gray[500],
            marginTop: 10,
            letterSpacing: 2,
          }}
        >
          {stats[0].label}
        </div>
      </div>

      {/* 残りの統計（右側に小さく縦並び） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 150,
          display: "flex",
          flexDirection: "column",
          gap: 60,
        }}
      >
        {stats.slice(1).map((stat, i) => {
          const delay = startDelay + 30 + i * 15;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`stat-${stat.label}`}
              style={{
                textAlign: "right",
                borderRight: `2px solid ${C.gray[800]}`,
                paddingRight: 25,
                transform: `translateY(${(1 - progress) * 30}px)`,
                opacity: progress,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end" }}>
                <span
                  style={{
                    fontFamily: font,
                    fontSize: 56,
                    fontWeight: 700,
                    color: C.white,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: font,
                    fontSize: 24,
                    fontWeight: 300,
                    color: C.gray[500],
                    marginLeft: 5,
                  }}
                >
                  {stat.unit}
                </span>
              </div>
              <div
                style={{
                  fontFamily: font,
                  fontSize: 13,
                  color: C.gray[600],
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 下部ライン */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 100,
          width: lerp(frame, [startDelay + 50, startDelay + 80], [0, 600], EASE.out),
          height: 1,
          background: C.gray[800],
        }}
      />
    </AbsoluteFill>
  );
};
