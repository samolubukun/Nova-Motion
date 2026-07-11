/**
 * ListStaggered - ジグザグ/スタッガード配置
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

const defaultItems = [
  { title: "Capture", desc: "Voice-to-text notes capture", align: "left", top: 100 },
  { title: "Co-Brainstorm", desc: "AI-assisted generation", align: "right", top: 220 },
  { title: "Optimize", desc: "Platform tailored formats", align: "left", top: 340 },
];

export const ListStaggered = ({ items = defaultItems, startDelay = 0 }: {
  items?: Array<{ title: string; desc: string }>;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const alignMap = ["left", "right", "left"];
  const topMap = [100, 220, 340];

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {items.map((item, i) => {
        const delay = startDelay + i * 20;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 18, stiffness: 120 },
        });

        const isLeft = alignMap[i] === "left";

        return (
          <div
            key={`stagger-${item.title}`}
            style={{
              position: "absolute",
              [isLeft ? "left" : "right"]: 100,
              top: topMap[i],
              textAlign: isLeft ? "left" : "right",
              transform: `translateX(${(1 - progress) * (isLeft ? -60 : 60)}px)`,
              opacity: progress,
            }}
          >
            {/* 番号 */}
            <div
              style={{
                fontFamily: font,
                fontSize: 12,
                color: C.gray[600],
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              0{i + 1}
            </div>

            {/* タイトル */}
            <div
              style={{
                fontFamily: font,
                fontSize: 48,
                fontWeight: 700,
                color: C.white,
                marginBottom: 10,
              }}
            >
              {item.title}
            </div>

            {/* 説明 */}
            <div
              style={{
                fontFamily: font,
                fontSize: 16,
                color: C.gray[500],
              }}
            >
              {item.desc}
            </div>

            {/* Underline */}
            <div
              style={{
                width: lerp(frame, [delay + 10, delay + 30], [0, 150], EASE.out),
                height: 2,
                background: i === 0 ? C.accent : C.gray[700],
                marginTop: 20,
                [isLeft ? "marginLeft" : "marginRight"]: 0,
                [isLeft ? "marginRight" : "marginLeft"]: "auto",
              }}
            />
          </div>
        );
      })}

      {/* 中央縦線 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 80,
          width: 1,
          height: lerp(frame, [startDelay, startDelay + 60], [0, 400], EASE.out),
          background: C.gray[900],
          transform: "translateX(-50%)",
        }}
      />
    </AbsoluteFill>
  );
};
