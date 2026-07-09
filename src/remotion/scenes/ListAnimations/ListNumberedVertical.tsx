/**
 * ListNumberedVertical - 縦積み番号リスト（左揃え、番号強調）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListNumberedVertical = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { num: "01", text: "Understand your needs" },
    { num: "02", text: "Design the solution" },
    { num: "03", text: "Build and iterate" },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
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
            fontSize: 11,
            color: C.gray[600],
            letterSpacing: 3,
            marginBottom: 15,
          }}
        >
          OUR PROCESS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 36,
            fontWeight: 700,
            color: C.white,
          }}
        >
          Three Steps
        </div>
      </div>

      {/* リスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 220,
          display: "flex",
          flexDirection: "column",
          gap: 50,
        }}
      >
        {items.map((item, i) => {
          const delay = startDelay + 25 + i * 15;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`numbered-${item.num}`}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 40,
                transform: `translateX(${(1 - progress) * -50}px)`,
                opacity: progress,
              }}
            >
              {/* 番号（大きく薄く） */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 80,
                  fontWeight: 200,
                  color: i === 0 ? C.accent : C.gray[800],
                  lineHeight: 1,
                  width: 120,
                }}
              >
                {item.num}
              </div>

              {/* テキスト */}
              <div
                style={{
                  fontFamily: font,
                  fontSize: 28,
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? C.white : C.gray[400],
                }}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* 右側の縦線装飾 */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 100,
          width: 1,
          height: lerp(frame, [startDelay + 50, startDelay + 90], [0, 400], EASE.out),
          background: C.gray[800],
        }}
      />
    </AbsoluteFill>
  );
};
