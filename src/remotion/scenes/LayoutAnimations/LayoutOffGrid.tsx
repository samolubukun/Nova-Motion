/**
 * LayoutOffGrid - オフグリッドレイアウト - 意図的にずらした配置
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutOffGrid = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elements = [
    { text: "THINK", x: 5, y: 15, size: 100, weight: 900, delay: 0 },
    { text: "DIFFERENT", x: 35, y: 45, size: 80, weight: 300, delay: 8 },
    { text: "BE", x: 70, y: 20, size: 60, weight: 700, delay: 16 },
    { text: "BOLD", x: 55, y: 70, size: 120, weight: 900, delay: 24 },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {elements.map((el) => {
        const progress = spring({
          frame: frame - startDelay - el.delay,
          fps,
          config: { damping: 15, stiffness: 150 },
        });

        return (
          <div
            key={`offgrid-${el.text}`}
            style={{
              position: "absolute",
              left: `${el.x}%`,
              top: `${el.y}%`,
              fontFamily: font,
              fontSize: el.size,
              fontWeight: el.weight,
              color: el.text === "BOLD" ? C.accent : C.white,
              transform: `translateY(${(1 - progress) * 50}px)`,
              opacity: progress,
            }}
          >
            {el.text}
          </div>
        );
      })}

      {/* 装飾ライン */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "80%",
          width: lerp(frame, [startDelay + 40, startDelay + 70], [0, 300], EASE.out),
          height: 2,
          background: C.gray[700],
        }}
      />

      {/* 小さな情報 */}
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 40,
          fontFamily: font,
          fontSize: 11,
          color: C.gray[600],
          letterSpacing: 2,
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
        }}
      >
        CREATIVE
        <br />
        DIRECTION
      </div>
    </AbsoluteFill>
  );
};
