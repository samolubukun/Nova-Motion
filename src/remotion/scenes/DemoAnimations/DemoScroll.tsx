/**
 * DemoScroll - 画面スクロールデモ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const DemoScroll = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // スクロール量
  const scrollY = lerp(frame, [startDelay + 20, startDelay + 80], [0, 400], EASE.smooth);

  // ダミーコンテンツ
  const items = Array.from({ length: 8 }, (_, i) => ({
    id: `item-${i}`,
    title: `Section ${i + 1}`,
    height: 120 + (i % 3) * 40,
  }));

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ブラウザフレーム */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 60,
          right: 100,
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
            height: 40,
            background: C.gray[800],
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              height: 24,
              background: C.gray[700],
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
            }}
          >
            <span style={{ fontFamily: font, fontSize: 12, color: C.gray[400] }}>
              app.example.com
            </span>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div
          style={{
            height: "calc(100% - 40px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              transform: `translateY(-${scrollY}px)`,
              padding: 30,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  height: item.height,
                  background: C.gray[800],
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 16,
                    fontWeight: 600,
                    color: C.white,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    width: "60%",
                    height: 12,
                    background: C.gray[700],
                    borderRadius: 4,
                  }}
                />
              </div>
            ))}
          </div>

          {/* スクロールバー */}
          <div
            style={{
              position: "absolute",
              right: 4,
              top: 4,
              width: 6,
              height: "calc(100% - 8px)",
              background: C.gray[800],
              borderRadius: 3,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 80,
                background: C.gray[600],
                borderRadius: 3,
                transform: `translateY(${scrollY * 0.3}px)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 11,
            color: C.gray[500],
            letterSpacing: 1,
            writingMode: "vertical-rl",
          }}
        >
          SCROLL
        </div>
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke={C.gray[600]} strokeWidth="2" />
          <circle
            cx="10"
            cy={8 + lerp(frame, [startDelay + 20, startDelay + 80], [0, 12])}
            r="3"
            fill={C.accent}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
