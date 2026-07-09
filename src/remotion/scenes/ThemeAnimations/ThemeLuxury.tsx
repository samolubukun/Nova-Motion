/**
 * ThemeLuxury - ラグジュアリー - ゴールド、高級感
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ThemeLuxury = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textOpacity = lerp(frame, [startDelay + 15, startDelay + 35], [0, 1]);
  const lineWidth = lerp(frame, [startDelay + 25, startDelay + 55], [0, 200], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 金色のライン装飾 */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          right: 80,
          bottom: 80,
          border: "1px solid #c9a962",
          opacity: 0.3,
        }}
      />

      {/* メインコンテンツ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "#c9a962",
            letterSpacing: 10,
            marginBottom: 30,
            opacity: textOpacity,
          }}
        >
          PREMIUM COLLECTION
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 72,
            fontWeight: 200,
            color: C.white,
            letterSpacing: 20,
            textTransform: "uppercase",
            opacity: textOpacity,
          }}
        >
          Luxury
        </div>
        <div
          style={{
            width: lineWidth,
            height: 1,
            background: "linear-gradient(90deg, transparent, #c9a962, transparent)",
            margin: "30px auto",
          }}
        />
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[400],
            letterSpacing: 3,
            opacity: textOpacity,
          }}
        >
          Timeless Elegance
        </div>
      </div>

      {/* コーナー装飾 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          width: 40,
          height: 40,
          borderLeft: "1px solid #c9a962",
          borderTop: "1px solid #c9a962",
          opacity: textOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          width: 40,
          height: 40,
          borderRight: "1px solid #c9a962",
          borderBottom: "1px solid #c9a962",
          opacity: textOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
