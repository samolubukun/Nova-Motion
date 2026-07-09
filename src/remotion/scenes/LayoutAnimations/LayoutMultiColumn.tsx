/**
 * LayoutMultiColumn - マルチコラムレイアウト - 情報の並列配置
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const LayoutMultiColumn = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const columns = [
    { number: "01", title: "Strategy", desc: "Define clear goals and roadmap" },
    { number: "02", title: "Design", desc: "Create beautiful experiences" },
    { number: "03", title: "Develop", desc: "Build with modern technology" },
    { number: "04", title: "Deliver", desc: "Launch and iterate fast" },
  ];

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* ヘッダー */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[500],
            letterSpacing: 3,
            marginBottom: 15,
          }}
        >
          OUR PROCESS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 700,
            color: C.black,
          }}
        >
          How We Work
        </div>
      </div>

      {/* 4カラム */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 100,
          display: "flex",
          gap: 40,
        }}
      >
        {columns.map((col, i) => {
          const progress = spring({
            frame: frame - startDelay - 20 - i * 8,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`col-${col.number}`}
              style={{
                flex: 1,
                borderTop: `2px solid ${C.black}`,
                paddingTop: 25,
                transform: `translateY(${(1 - progress) * 40}px)`,
                opacity: progress,
              }}
            >
              <div
                style={{
                  fontFamily: font,
                  fontSize: 48,
                  fontWeight: 200,
                  color: C.gray[300],
                  marginBottom: 15,
                }}
              >
                {col.number}
              </div>
              <div
                style={{
                  fontFamily: font,
                  fontSize: 24,
                  fontWeight: 700,
                  color: C.black,
                  marginBottom: 10,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  fontFamily: font,
                  fontSize: 14,
                  color: C.gray[500],
                  lineHeight: 1.6,
                }}
              >
                {col.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
