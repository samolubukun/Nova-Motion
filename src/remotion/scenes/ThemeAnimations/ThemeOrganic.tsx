/**
 * ThemeOrganic - Organic - オーガニック/流動的
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeOrganic = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const morphProgress = (frame - startDelay) * 0.02;
  const textOpacity = lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]);

  // 流動的な形状の座標を計算
  const blobRadius1 = `${50 + Math.sin(morphProgress) * 10}% ${50 + Math.cos(morphProgress * 1.5) * 15}% ${50 + Math.sin(morphProgress * 0.8) * 12}% ${50 + Math.cos(morphProgress) * 10}% / ${50 + Math.sin(morphProgress * 1.2) * 10}% ${50 + Math.cos(morphProgress * 0.7) * 12}% ${50 + Math.sin(morphProgress * 1.1) * 15}% ${50 + Math.cos(morphProgress * 0.9) * 10}%`;

  return (
    <AbsoluteFill style={{ background: "#faf8f5" }}>
      {/* 流動的な背景ブロブ */}
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: blobRadius1,
          background: "linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%)",
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 0.8]),
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: 300,
          height: 300,
          borderRadius: `${60 + Math.cos(morphProgress * 1.3) * 10}% ${40 + Math.sin(morphProgress) * 15}% ${50 + Math.cos(morphProgress * 0.9) * 10}% ${50 + Math.sin(morphProgress * 1.1) * 12}% / ${45 + Math.cos(morphProgress * 0.8) * 15}% ${55 + Math.sin(morphProgress * 1.2) * 10}% ${45 + Math.cos(morphProgress) * 12}% ${55 + Math.sin(morphProgress * 0.7) * 10}%`,
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          opacity: lerp(frame, [startDelay + 10, startDelay + 35], [0, 0.7]),
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
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
          FLUID FORMS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 64,
            fontWeight: 300,
            color: C.gray[800],
            lineHeight: 1.1,
          }}
        >
          Organic
          <br />
          <span style={{ fontWeight: 600 }}>Shapes</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
