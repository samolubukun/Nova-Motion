/**
 * ThemeTech - テック/スタートアップ - モダン、クリーン
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeTech = ({ startDelay = 0 }: {
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
    <AbsoluteFill style={{ background: "#fafafa" }}>
      {/* ヘッダー */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          display: "flex",
          alignItems: "center",
          gap: 15,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${C.accent}, #8b5cf6)`,
          }}
        />
        <div style={{ fontFamily: font, fontSize: 18, fontWeight: 600, color: C.gray[900] }}>
          TechCo
        </div>
      </div>

      {/* メインコンテンツ */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 180,
          maxWidth: 500,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.accent,
            fontWeight: 500,
            marginBottom: 15,
            opacity: lerp(frame, [startDelay + 10, startDelay + 25], [0, 1]),
          }}
        >
          Introducing v2.0
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 52,
            fontWeight: 700,
            color: C.gray[900],
            lineHeight: 1.1,
            opacity: lerp(frame, [startDelay + 15, startDelay + 35], [0, 1]),
          }}
        >
          Build faster.
          <br />
          Ship smarter.
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 18,
            color: C.gray[600],
            marginTop: 25,
            lineHeight: 1.6,
            opacity: lerp(frame, [startDelay + 25, startDelay + 45], [0, 1]),
          }}
        >
          The modern platform for teams who move fast.
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            gap: 15,
            marginTop: 35,
            opacity: lerp(frame, [startDelay + 35, startDelay + 55], [0, 1]),
          }}
        >
          <button
            type="button"
            style={{
              fontFamily: font,
              fontSize: 15,
              fontWeight: 600,
              color: C.white,
              background: C.accent,
              border: "none",
              borderRadius: 10,
              padding: "14px 28px",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
          <button
            type="button"
            style={{
              fontFamily: font,
              fontSize: 15,
              fontWeight: 500,
              color: C.gray[900],
              background: "transparent",
              border: `1px solid ${C.gray[300]}`,
              borderRadius: 10,
              padding: "14px 28px",
              cursor: "pointer",
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* プロダクトカード */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 150,
          width: 380,
          background: C.white,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: 30,
          transform: `translateY(${(1 - cardProgress) * 50}px)`,
          opacity: cardProgress,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 25 }}>
          <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.gray[900] }}>
            Dashboard
          </div>
          <div style={{ fontFamily: font, fontSize: 12, color: C.success }}>
            +24.5%
          </div>
        </div>
        <div
          style={{
            height: 120,
            background: `linear-gradient(180deg, ${C.accent}33 0%, transparent 100%)`,
            borderRadius: 12,
            position: "relative",
          }}
        >
          {/* 簡易グラフ */}
          <svg width="100%" height="100%" viewBox="0 0 320 120" aria-hidden="true">
            <path
              d="M0 100 Q80 80, 160 60 T320 20"
              fill="none"
              stroke={C.accent}
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
