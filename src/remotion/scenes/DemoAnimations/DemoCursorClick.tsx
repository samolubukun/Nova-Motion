/**
 * DemoCursorClick - マウスカーソル移動 + クリック
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";
import { ClickRipple } from "./shared/ClickRipple";

export const DemoCursorClick = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // カーソルパス
  const cursorX = lerp(frame, [startDelay, startDelay + 40], [200, 640], EASE.smooth);
  const cursorY = lerp(frame, [startDelay, startDelay + 40], [400, 300], EASE.smooth);

  // クリックタイミング
  const clickFrame = startDelay + 50;
  const isClicking = frame >= clickFrame && frame < clickFrame + 10;
  const clickProgress = lerp(frame, [clickFrame, clickFrame + 20], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ダミーUI */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 80,
          right: 100,
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 20,
              fontWeight: 700,
              color: C.white,
            }}
          >
            Dashboard
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Home", "Products", "Settings"].map((item) => (
              <div
                key={`nav-${item}`}
                style={{
                  fontFamily: font,
                  fontSize: 14,
                  color: C.gray[400],
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ボタンエリア */}
        <div style={{ display: "flex", gap: 20 }}>
          <button
            type="button"
            style={{
              fontFamily: font,
              fontSize: 14,
              fontWeight: 600,
              color: C.white,
              background: isClicking ? C.secondary : C.accent,
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              transform: isClicking ? "scale(0.95)" : "scale(1)",
            }}
          >
            Create New
          </button>
          <button
            type="button"
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[400],
              background: C.gray[800],
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
            }}
          >
            Import
          </button>
        </div>
      </div>

      {/* クリックリップル */}
      {frame >= clickFrame && (
        <ClickRipple x={640} y={300} progress={clickProgress} />
      )}

      {/* カーソル */}
      <Cursor x={cursorX} y={cursorY} clicking={isClicking} />

      {/* 説明ラベル */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 60,
          fontFamily: font,
          fontSize: 12,
          color: C.gray[600],
          letterSpacing: 2,
        }}
      >
        CURSOR CLICK INTERACTION
      </div>
    </AbsoluteFill>
  );
};
