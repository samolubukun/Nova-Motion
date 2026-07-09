/**
 * ListHorizontalPeek - 横スクロール風（見切れ表現）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListHorizontalPeek = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { num: "01", title: "Design", highlighted: true },
    { num: "02", title: "Develop", highlighted: false },
    { num: "03", title: "Deploy", highlighted: false },
  ];

  // 横スライド
  const slideX = lerp(frame, [startDelay + 30, startDelay + 70], [0, -100], EASE.smooth);

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
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
            fontSize: 14,
            color: C.gray[600],
            letterSpacing: 3,
          }}
        >
          WORKFLOW
        </div>
      </div>

      {/* 横並びカード（一部見切れ） */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 180,
          display: "flex",
          gap: 30,
          transform: `translateX(${slideX}px)`,
        }}
      >
        {items.map((item, i) => {
          const delay = startDelay + i * 10;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`horiz-${item.num}`}
              style={{
                width: 350,
                height: 400,
                background: item.highlighted ? C.accent : C.gray[900],
                borderRadius: 16,
                padding: 40,
                flexShrink: 0,
                transform: `translateY(${(1 - progress) * 50}px)`,
                opacity: progress,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: font,
                  fontSize: 80,
                  fontWeight: 200,
                  color: item.highlighted ? C.white : C.gray[700],
                }}
              >
                {item.num}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 36,
                    fontWeight: 700,
                    color: C.white,
                    marginBottom: 15,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 14,
                    color: item.highlighted ? `${C.white}aa` : C.gray[500],
                    lineHeight: 1.6,
                  }}
                >
                  Professional {item.title.toLowerCase()} services tailored to your needs.
                </div>
              </div>
            </div>
          );
        })}

        {/* 見切れ用の4枚目（薄く） */}
        <div
          style={{
            width: 350,
            height: 400,
            background: C.gray[900],
            borderRadius: 16,
            opacity: 0.5,
            flexShrink: 0,
          }}
        />
      </div>

      {/* スクロールヒント */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 0.5]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            color: C.gray[600],
          }}
        >
          →
        </div>
      </div>
    </AbsoluteFill>
  );
};
