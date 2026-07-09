/**
 * TextTypewriter - タイプライターテキスト - カーソル付き
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const TextTypewriter = ({ text = "TYPING EFFECT...", startDelay = 0 }: {
  text?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const charsToShow = Math.floor(
    lerp(frame, [startDelay, startDelay + text.length * 3], [0, text.length])
  );

  const displayText = text.slice(0, charsToShow);
  const cursorVisible = Math.floor((frame - startDelay) / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* ターミナル風ウィンドウ */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 150,
          width: 1000,
          background: C.gray[900],
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${C.gray[700]}`,
        }}
      >
        {/* ウィンドウヘッダー */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27ca40" }} />
        </div>

        {/* テキスト */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 36,
            color: C.white,
          }}
        >
          <span style={{ color: C.accent }}>$ </span>
          {displayText}
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 36,
              background: C.accent,
              marginLeft: 4,
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* 装飾テキスト */}
      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 100,
          fontFamily: font,
          fontSize: 14,
          color: C.gray[600],
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        <div>TERMINAL</div>
        <div>v2.0.1</div>
      </div>
    </AbsoluteFill>
  );
};
