/**
 * ThemeDuotone - Duotone - デュオトーン
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ThemeDuotone = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const splitProgress = lerp(frame, [startDelay, startDelay + 30], [50, 0], EASE.out);
  const textOpacity = lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 左半分（シアン） */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          height: "100%",
          background: "#00d9ff",
          clipPath: `polygon(0 0, ${100 - splitProgress}% 0, ${100 - splitProgress}% 100%, 0 100%)`,
        }}
      />

      {/* 右半分（マゼンタ） */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          background: "#ff0080",
          clipPath: `polygon(${splitProgress}% 0, 100% 0, 100% 100%, ${splitProgress}% 100%)`,
        }}
      />

      {/* オーバーレイ（中央にブレンド） */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 100,
          height: "100%",
          transform: "translateX(-50%)",
          background: "linear-gradient(90deg, #00d9ff, #ff0080)",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: C.white,
            mixBlendMode: "difference",
          }}
        >
          DUO
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 100,
            color: C.white,
            mixBlendMode: "difference",
            marginTop: -30,
          }}
        >
          TONE
        </div>
      </div>

      {/* ハーフトーンパターン */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.black} 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
          opacity: 0.1,
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
