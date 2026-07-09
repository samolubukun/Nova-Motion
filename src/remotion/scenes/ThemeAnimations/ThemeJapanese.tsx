/**
 * ThemeJapanese - 和風/ジャパニーズ - 余白、縦書き
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ThemeJapanese = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textOpacity = lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]);
  const lineHeight = lerp(frame, [startDelay + 20, startDelay + 50], [0, 300], EASE.out);

  return (
    <AbsoluteFill style={{ background: "#f5f0e8" }}>
      {/* 縦書きテキスト */}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 100,
          writingMode: "vertical-rl",
          fontFamily: font,
          fontSize: 60,
          fontWeight: 300,
          color: "#2d2d2d",
          letterSpacing: 15,
          opacity: textOpacity,
        }}
      >
        静寂の美
      </div>

      {/* 横書きサブテキスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 150,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[400],
            letterSpacing: 4,
            marginBottom: 15,
          }}
        >
          JAPANESE AESTHETICS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 28,
            fontWeight: 300,
            color: "#2d2d2d",
          }}
        >
          The beauty of
          <br />
          empty space
        </div>
      </div>

      {/* 縦線装飾 */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 100,
          width: 1,
          height: lineHeight,
          background: "#c4a77d",
        }}
      />

      {/* 円（家紋風） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "1px solid #c4a77d",
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 0.5]),
        }}
      />
    </AbsoluteFill>
  );
};
