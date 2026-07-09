/**
 * ListHeroWithList - 強調1つ + リスト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListHeroWithList = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const listItems = ["Fast", "Secure", "Reliable"];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ヒーロー（メイン強調） */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 100,
          transform: `translateX(${(1 - heroProgress) * -80}px)`,
          opacity: heroProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          BUILD
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: C.accent,
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          BETTER
        </div>
      </div>

      {/* サブリスト（右下に小さく） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 120,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 11,
            color: C.gray[600],
            letterSpacing: 3,
            marginBottom: 20,
            opacity: lerp(frame, [startDelay + 30, startDelay + 45], [0, 1]),
          }}
        >
          WHAT WE OFFER
        </div>

        {listItems.map((item, i) => {
          const delay = startDelay + 35 + i * 10;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <div
              key={`hero-list-${item}`}
              style={{
                fontFamily: font,
                fontSize: 20,
                color: i === 0 ? C.white : C.gray[500],
                marginBottom: 12,
                transform: `translateX(${(1 - progress) * 30}px)`,
                opacity: progress,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      {/* 装飾ライン */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          width: lerp(frame, [startDelay + 20, startDelay + 50], [0, 300], EASE.out),
          height: 1,
          background: C.gray[800],
        }}
      />
    </AbsoluteFill>
  );
};
