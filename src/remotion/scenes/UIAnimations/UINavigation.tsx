/**
 * UINavigation - ナビゲーションメニュー
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const UINavigation = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const menuItems = ["Home", "Products", "About", "Contact"];
  const activeIndex = Math.floor((frame - startDelay) / 25) % menuItems.length;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* ナビゲーションバー */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: C.gray[900],
          borderBottom: `1px solid ${C.gray[800]}`,
          display: "flex",
          alignItems: "center",
          padding: "0 60px",
          justifyContent: "space-between",
        }}
      >
        {/* ロゴ */}
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            fontWeight: 800,
            color: C.white,
          }}
        >
          BRAND
        </div>

        {/* メニュー */}
        <div style={{ display: "flex", gap: 40 }}>
          {menuItems.map((item, i) => {
            const isActive = i === activeIndex;
            const progress = spring({
              frame: isActive ? frame - startDelay - i * 25 : 0,
              fps,
              config: { damping: 15, stiffness: 200 },
            });

            return (
              <div
                key={`nav-${item}`}
                style={{
                  position: "relative",
                  fontFamily: font,
                  fontSize: 16,
                  fontWeight: 500,
                  color: isActive ? C.white : C.gray[500],
                  cursor: "pointer",
                }}
              >
                {item}
                {/* アンダーライン */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: `${progress * 100}%`,
                    height: 2,
                    background: C.accent,
                    borderRadius: 1,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 600,
            color: C.white,
            background: C.accent,
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      {/* コンテンツエリア */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          fontFamily: font,
          fontSize: 48,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay, startDelay + 30], [0, 1]),
        }}
      >
        {menuItems[activeIndex]}
      </div>
    </AbsoluteFill>
  );
};
