/**
 * ThemeNeobrutalism - ネオブルタリズム - 太い枠線、原色、影
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const ThemeNeobrutalism = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ background: "#fffdf0" }}>
      {/* メインカード */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 150,
          width: 500,
          background: "#ff6b6b",
          border: "4px solid #000000",
          boxShadow: "8px 8px 0 #000000",
          padding: 40,
          transform: `scale(${cardProgress}) rotate(-2deg)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 900,
            color: C.black,
            textTransform: "uppercase",
          }}
        >
          Bold &amp;
          <br />
          Brutal
        </div>
      </div>

      {/* サブカード */}
      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 150,
          width: 300,
          background: "#4ecdc4",
          border: "4px solid #000000",
          boxShadow: "8px 8px 0 #000000",
          padding: 30,
          transform: `translateY(${(1 - cardProgress) * 50}px) rotate(3deg)`,
          opacity: cardProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            fontWeight: 700,
            color: C.black,
          }}
        >
          Raw aesthetics with purpose
        </div>
      </div>

      {/* 装飾要素 */}
      <div
        style={{
          position: "absolute",
          right: 200,
          top: 100,
          width: 60,
          height: 60,
          background: "#ffe66d",
          border: "4px solid #000000",
          transform: `rotate(${frame * 2}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
