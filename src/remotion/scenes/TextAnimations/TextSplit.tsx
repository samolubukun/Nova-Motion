/**
 * TextSplit - スプリットテキスト - 上下に分割して登場
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TextSplit = ({ textTop = "SPLIT", textBottom = "REVEAL", startDelay = 0 }: {
  textTop?: string;
  textBottom?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const topY = lerp(frame, [startDelay, startDelay + 30], [-100, 0], EASE.out);
  const bottomY = lerp(frame, [startDelay + 5, startDelay + 35], [100, 0], EASE.out);
  const topOpacity = lerp(frame, [startDelay, startDelay + 20], [0, 1]);
  const bottomOpacity = lerp(frame, [startDelay + 5, startDelay + 25], [0, 1]);

  // 中央の線
  const lineWidth = lerp(frame, [startDelay + 20, startDelay + 50], [0, 600], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 上部テキスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "35%",
          fontFamily: font,
          fontSize: 140,
          fontWeight: 800,
          color: C.white,
          letterSpacing: -4,
          transform: `translateY(${topY}px)`,
          opacity: topOpacity,
        }}
      >
        {textTop}
      </div>

      {/* 中央線 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          width: lineWidth,
          height: 4,
          background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})`,
        }}
      />

      {/* 下部テキスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "55%",
          fontFamily: font,
          fontSize: 140,
          fontWeight: 800,
          color: C.white,
          letterSpacing: -4,
          transform: `translateY(${bottomY}px)`,
          opacity: bottomOpacity,
        }}
      >
        {textBottom}
      </div>

      {/* 装飾 - 右側の縦線 */}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: "30%",
          width: 3,
          height: lerp(frame, [startDelay + 30, startDelay + 60], [0, 300], EASE.out),
          background: C.gray[700],
        }}
      />
    </AbsoluteFill>
  );
};
