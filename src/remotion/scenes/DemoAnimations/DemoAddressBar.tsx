/**
 * DemoAddressBar - ブラウザアドレスバーデモ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const DemoAddressBar = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // URL入力
  const url = "app.example.com/dashboard";
  const typingStart = startDelay + 20;
  const typedChars = Math.floor(lerp(frame, [typingStart, typingStart + 60], [0, url.length]));

  // Enter押下
  const enterFrame = startDelay + 90;
  const isNavigating = frame >= enterFrame;

  // ページロード
  const loadProgress = lerp(frame, [enterFrame, enterFrame + 30], [0, 100]);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ブラウザウィンドウ */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          right: 80,
          bottom: 60,
          background: C.gray[900],
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${C.gray[800]}`,
        }}
      >
        {/* ブラウザヘッダー */}
        <div
          style={{
            height: 50,
            background: C.gray[800],
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            gap: 15,
          }}
        >
          {/* ウィンドウボタン */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          </div>

          {/* ナビゲーションボタン */}
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: C.gray[500], fontSize: 18 }}>←</span>
            <span style={{ color: C.gray[600], fontSize: 18 }}>→</span>
          </div>

          {/* アドレスバー */}
          <div
            style={{
              flex: 1,
              height: 32,
              background: C.gray[700],
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 8,
              border: typedChars > 0 && !isNavigating ? `1px solid ${C.accent}` : "1px solid transparent",
            }}
          >
            {/* HTTPS アイコン */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="2" y="6" width="10" height="7" rx="1" stroke={C.gray[500]} strokeWidth="1.5" />
              <path d="M4 6V4a3 3 0 116 0v2" stroke={C.gray[500]} strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <span style={{ fontFamily: font, fontSize: 13, color: C.white }}>
              {url.slice(0, typedChars)}
            </span>

            {!isNavigating && Math.floor(frame / 15) % 2 === 0 && (
              <span style={{ width: 1, height: 14, background: C.accent }} />
            )}
          </div>

          {/* 更新ボタン */}
          <span
            style={{
              color: C.gray[500],
              fontSize: 16,
              transform: isNavigating ? `rotate(${(frame - enterFrame) * 10}deg)` : "none",
            }}
          >
            ⟳
          </span>
        </div>

        {/* ローディングバー */}
        {isNavigating && loadProgress < 100 && (
          <div
            style={{
              height: 3,
              background: C.gray[900],
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})`,
              }}
            />
          </div>
        )}

        {/* ページコンテンツ */}
        <div
          style={{
            height: "calc(100% - 50px)",
            padding: 30,
            opacity: isNavigating ? lerp(frame, [enterFrame + 20, enterFrame + 40], [0, 1]) : 0.3,
          }}
        >
          {isNavigating && loadProgress >= 50 && (
            <>
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
                <div style={{ flex: 1, height: 150, background: C.gray[800], borderRadius: 8 }} />
                <div style={{ flex: 1, height: 150, background: C.gray[800], borderRadius: 8 }} />
              </div>
            </>
          )}

          {!isNavigating && (
            <div
              style={{
                fontFamily: font,
                fontSize: 16,
                color: C.gray[600],
                textAlign: "center",
                marginTop: 100,
              }}
            >
              Enter URL to navigate...
            </div>
          )}
        </div>
      </div>

      {/* キーボードヒント */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 30,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: isNavigating ? 1 : lerp(frame, [typingStart + 50, typingStart + 60], [0, 1]),
        }}
      >
        <div
          style={{
            padding: "6px 12px",
            background: C.gray[800],
            borderRadius: 6,
            fontFamily: font,
            fontSize: 12,
            color: C.gray[400],
          }}
        >
          {isNavigating ? "Loading..." : "Press Enter ↵"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
