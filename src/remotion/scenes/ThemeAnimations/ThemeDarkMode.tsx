/**
 * ThemeDarkMode - ダークモード - 深い黒、微妙なグラデ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeDarkMode = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const glowIntensity = 0.5 + Math.sin(frame * 0.1) * 0.2;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0d0d0d 0%, #1a1a2e 100%)",
      }}
    >
      {/* 背景グロー */}
      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "40%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, #6366f120 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: glowIntensity,
        }}
      />

      {/* コンテンツ */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.accent,
            letterSpacing: 3,
            marginBottom: 20,
            opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
          }}
        >
          DARK MODE
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 56,
            fontWeight: 600,
            color: C.white,
            lineHeight: 1.2,
            opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
          }}
        >
          Easy on
          <br />
          the eyes
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[600],
            marginTop: 25,
            opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
          }}
        >
          Designed for low-light environments
        </div>
      </div>

      {/* カード */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: "translateY(-50%)",
          width: 280,
          background: "#1f1f2e",
          borderRadius: 16,
          padding: 25,
          border: "1px solid #2d2d3a",
          opacity: lerp(frame, [startDelay + 25, startDelay + 45], [0, 1]),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 15 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            }}
          />
          <div>
            <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.white }}>
              Notification
            </div>
            <div style={{ fontFamily: font, fontSize: 12, color: C.gray[600] }}>
              Just now
            </div>
          </div>
        </div>
        <div style={{ fontFamily: font, fontSize: 14, color: C.gray[400], lineHeight: 1.6 }}>
          Your dark mode preferences have been saved.
        </div>
      </div>
    </AbsoluteFill>
  );
};
