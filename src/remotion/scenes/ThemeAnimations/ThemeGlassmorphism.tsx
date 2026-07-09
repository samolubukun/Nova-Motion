/**
 * ThemeGlassmorphism - グラスモーフィズム - 半透明、ブラー
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const ThemeGlassmorphism = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame: frame - startDelay - 10,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      }}
    >
      {/* 背景の装飾円 */}
      <div
        style={{
          position: "absolute",
          left: -100,
          top: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "#ffffff30",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -50,
          bottom: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#ffffff20",
        }}
      />

      {/* グラスカード */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${cardProgress})`,
          width: 500,
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.3)",
          padding: 50,
          opacity: cardProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          GLASSMORPHISM
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 42,
            fontWeight: 600,
            color: C.white,
            lineHeight: 1.2,
          }}
        >
          Frosted Glass
          <br />
          Effect
        </div>
      </div>
    </AbsoluteFill>
  );
};
