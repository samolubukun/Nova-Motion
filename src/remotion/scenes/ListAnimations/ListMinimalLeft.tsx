/**
 * ListMinimalLeft - 左寄せミニマルリスト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ListMinimalLeft = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    "Faster development cycles",
    "Reduced operational costs",
    "Improved team collaboration",
  ];

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 100,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 700,
            color: C.black,
            marginBottom: 10,
          }}
        >
          Benefits
        </div>
        <div
          style={{
            width: 60,
            height: 4,
            background: C.accent,
          }}
        />
      </div>

      {/* リスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 220,
        }}
      >
        {items.map((item, i) => {
          const delay = startDelay + 20 + i * 12;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`minimal-${i}-${item.slice(0, 10)}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 25,
                marginBottom: 35,
                transform: `translateX(${(1 - progress) * -40}px)`,
                opacity: progress,
              }}
            >
              {/* ダッシュ */}
              <div
                style={{
                  width: 30,
                  height: 2,
                  background: i === 0 ? C.accent : C.gray[300],
                }}
              />

              {/* テキスト */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 24,
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? C.black : C.gray[600],
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>

      {/* 右下の装飾 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 150,
          fontWeight: 100,
          color: C.gray[200],
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 1]),
        }}
      >
        3
      </div>
    </AbsoluteFill>
  );
};
