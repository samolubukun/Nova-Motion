/**
 * ThemeSwiss - Swiss/International - スイスデザイン
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ThemeSwiss = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textProgress = lerp(frame, [startDelay + 10, startDelay + 40], [0, 1], EASE.out);
  const gridProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* グリッドライン */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(#e0e0e0 1px, transparent 1px),
            linear-gradient(90deg, #e0e0e0 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: gridProgress * 0.5,
        }}
      />

      {/* 赤いアクセントブロック */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: lerp(frame, [startDelay, startDelay + 25], [0, 320]),
          height: 160,
          background: "#ff0000",
        }}
      />

      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 200,
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 800,
            color: C.gray[900],
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          GRID
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 200,
            color: C.gray[900],
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          SYSTEM
        </div>
      </div>

      {/* サイドテキスト */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 200,
          textAlign: "right",
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[600],
            lineHeight: 2,
          }}
        >
          HELVETICA
          <br />
          NEUE
          <br />
          TYPOGRAPHY
        </div>
      </div>

      {/* 番号 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 200,
          fontWeight: 100,
          color: "#f0f0f0",
        }}
      >
        21
      </div>

      {/* 下部テキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 12,
          color: C.gray[400],
          letterSpacing: 2,
          opacity: textProgress,
        }}
      >
        INTERNATIONAL TYPOGRAPHIC STYLE — SINCE 1950
      </div>
    </AbsoluteFill>
  );
};
