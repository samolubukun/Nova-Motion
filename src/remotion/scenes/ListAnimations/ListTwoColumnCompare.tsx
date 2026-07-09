/**
 * ListTwoColumnCompare - 特徴比較（2カラム）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListTwoColumnCompare = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftItems = ["Speed", "Security", "Support"];
  const rightValues = ["10x faster", "Enterprise-grade", "24/7 available"];

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 100,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 40,
            fontWeight: 700,
            color: C.white,
          }}
        >
          Why Choose Us
        </div>
      </div>

      {/* 2カラムリスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 200,
          right: 100,
        }}
      >
        {leftItems.map((item, i) => {
          const delay = startDelay + 25 + i * 15;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`compare-${item}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "30px 0",
                borderBottom: i < leftItems.length - 1 ? `1px solid ${C.gray[800]}` : "none",
                transform: `translateY(${(1 - progress) * 20}px)`,
                opacity: progress,
              }}
            >
              {/* 左カラム（ラベル） */}
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 14,
                    color: C.gray[600],
                  }}
                >
                  0{i + 1}
                </div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 22,
                    fontWeight: 500,
                    color: C.gray[400],
                  }}
                >
                  {item}
                </div>
              </div>

              {/* 右カラム（値） */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 22,
                  fontWeight: 600,
                  color: i === 0 ? C.accent : C.white,
                }}
              >
                {rightValues[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* 下部装飾 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 80,
          width: lerp(frame, [startDelay + 60, startDelay + 90], [0, 200], EASE.out),
          height: 4,
          background: C.accent,
        }}
      />
    </AbsoluteFill>
  );
};
