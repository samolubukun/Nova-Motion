/**
 * ListSimpleText - アイコンなしシンプルリスト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListSimpleText = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    "Intuitive interface",
    "Powerful automation",
    "Seamless integration",
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {items.map((item, i) => {
          const delay = startDelay + i * 20;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 18, stiffness: 120 },
          });

          return (
            <div
              key={`simple-${i}-${item.slice(0, 8)}`}
              style={{
                marginBottom: i < items.length - 1 ? 25 : 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: font,
                  fontSize: i === 0 ? 60 : 48,
                  fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? C.white : C.gray[600],
                  transform: `translateY(${(1 - progress) * 100}%)`,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}

        {/* アクセントライン */}
        <div
          style={{
            width: lerp(frame, [startDelay + 50, startDelay + 70], [0, 80], EASE.out),
            height: 4,
            background: C.accent,
            marginTop: 40,
          }}
        />
      </div>

      {/* 右側の番号表示 */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 200,
            fontWeight: 100,
            color: C.gray[900],
            lineHeight: 0.8,
            opacity: lerp(frame, [startDelay, startDelay + 40], [0, 1]),
          }}
        >
          03
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 12,
            color: C.gray[700],
            letterSpacing: 3,
            marginTop: 20,
            opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
          }}
        >
          KEY FEATURES
        </div>
      </div>
    </AbsoluteFill>
  );
};
