/**
 * ThemePop - ポップ/カラフル - 鮮やかな色
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemePop = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#1dd1a1"];

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* カラフルなブロック */}
      {colors.map((color, i) => {
        const progress = spring({
          frame: frame - startDelay - i * 5,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        return (
          <div
            key={`pop-block-${color}`}
            style={{
              position: "absolute",
              left: 80 + i * 220,
              top: 150 + (i % 2) * 100,
              width: 180,
              height: 180,
              background: color,
              borderRadius: 20,
              transform: `scale(${progress}) rotate(${(i - 2) * 5}deg)`,
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 100,
          fontFamily: font,
          fontSize: 80,
          fontWeight: 900,
          color: "#2d3436",
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        POP!
      </div>
    </AbsoluteFill>
  );
};
