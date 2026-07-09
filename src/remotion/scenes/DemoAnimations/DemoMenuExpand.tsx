/**
 * DemoMenuExpand - メニュー展開デモ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";

export const DemoMenuExpand = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // メニュー開閉
  const menuOpenFrame = startDelay + 30;
  const isMenuOpen = frame >= menuOpenFrame;

  const menuProgress = spring({
    frame: frame - menuOpenFrame,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  const menuItems = [
    { label: "Profile", shortcut: "⌘P" },
    { label: "Settings", shortcut: "⌘," },
    { label: "Help", shortcut: "⌘?" },
    { label: "Logout", shortcut: "⌘Q" },
  ];

  // カーソル
  const cursorX = lerp(frame, [startDelay, menuOpenFrame - 5], [400, 1100], EASE.smooth);
  const cursorY = lerp(frame, [startDelay, menuOpenFrame - 5], [400, 75], EASE.smooth);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ヘッダーバー */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: 60,
          background: C.gray[900],
          borderBottom: `1px solid ${C.gray[800]}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
        }}
      >
        <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: C.white }}>
          Application
        </div>

        {/* ユーザーメニュートリガー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 12px",
            borderRadius: 8,
            background: isMenuOpen ? C.gray[800] : "transparent",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font,
              fontSize: 14,
              fontWeight: 600,
              color: C.white,
            }}
          >
            J
          </div>
          <span style={{ fontFamily: font, fontSize: 14, color: C.white }}>John</span>
          <span
            style={{
              color: C.gray[500],
              transform: `rotate(${isMenuOpen ? 180 : 0}deg)`,
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>

          {/* ドロップダウンメニュー */}
          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                width: 220,
                background: C.gray[900],
                borderRadius: 12,
                border: `1px solid ${C.gray[700]}`,
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                transform: `scale(${menuProgress}) translateY(${(1 - menuProgress) * -10}px)`,
                opacity: menuProgress,
                transformOrigin: "top right",
              }}
            >
              {menuItems.map((item, i) => {
                const itemProgress = spring({
                  frame: frame - menuOpenFrame - i * 3,
                  fps,
                  config: { damping: 15, stiffness: 200 },
                });

                return (
                  <div
                    key={`menu-item-${item.label}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderBottom: i < menuItems.length - 1 ? `1px solid ${C.gray[800]}` : "none",
                      transform: `translateX(${(1 - itemProgress) * 20}px)`,
                      opacity: itemProgress,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: font,
                        fontSize: 14,
                        color: item.label === "Logout" ? C.secondary : C.white,
                      }}
                    >
                      {item.label}
                    </span>
                    <span style={{ fontFamily: font, fontSize: 12, color: C.gray[500] }}>
                      {item.shortcut}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* メインコンテンツ（ブラー効果） */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 100,
          right: 60,
          filter: isMenuOpen ? "blur(2px)" : "none",
          opacity: isMenuOpen ? 0.5 : 1,
          transition: "filter 0.3s, opacity 0.3s",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            fontWeight: 600,
            color: C.white,
            marginBottom: 20,
          }}
        >
          Dashboard
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1, height: 200, background: C.gray[900], borderRadius: 12 }} />
          <div style={{ flex: 1, height: 200, background: C.gray[900], borderRadius: 12 }} />
        </div>
      </div>

      {/* カーソル */}
      <Cursor
        x={cursorX}
        y={cursorY}
        clicking={frame >= menuOpenFrame - 3 && frame < menuOpenFrame + 2}
      />
    </AbsoluteFill>
  );
};
