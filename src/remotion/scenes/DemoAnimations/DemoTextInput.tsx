/**
 * DemoTextInput - テキスト入力デモ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const DemoTextInput = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // タイピングアニメーション
  const text1 = "hello@example.com";
  const text2 = "Welcome to our platform";

  const typing1Start = startDelay + 20;
  const typing1Chars = Math.floor(lerp(frame, [typing1Start, typing1Start + 50], [0, text1.length]));

  const typing2Start = startDelay + 90;
  const typing2Chars = Math.floor(lerp(frame, [typing2Start, typing2Start + 70], [0, text2.length]));

  // カーソル点滅
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  // 入力フィールドフォーカス
  const field1Focused = frame >= typing1Start && frame < typing2Start;
  const field2Focused = frame >= typing2Start;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* フォームコンテナ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            fontWeight: 700,
            color: C.white,
            marginBottom: 30,
          }}
        >
          Create Account
        </div>

        {/* Email入力フィールド */}
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              fontFamily: font,
              fontSize: 13,
              color: C.gray[400],
              marginBottom: 8,
            }}
          >
            Email Address
          </div>
          <div
            style={{
              background: C.gray[900],
              border: `2px solid ${field1Focused ? C.accent : C.gray[700]}`,
              borderRadius: 8,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: font, fontSize: 15, color: C.white }}>
              {text1.slice(0, typing1Chars)}
            </span>
            {field1Focused && cursorVisible && (
              <span style={{ width: 2, height: 18, background: C.accent, marginLeft: 1 }} />
            )}
          </div>
        </div>

        {/* メッセージ入力フィールド */}
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              fontFamily: font,
              fontSize: 13,
              color: C.gray[400],
              marginBottom: 8,
            }}
          >
            Welcome Message
          </div>
          <div
            style={{
              background: C.gray[900],
              border: `2px solid ${field2Focused ? C.accent : C.gray[700]}`,
              borderRadius: 8,
              padding: "14px 16px",
              minHeight: 80,
            }}
          >
            <span style={{ fontFamily: font, fontSize: 15, color: C.white }}>
              {text2.slice(0, typing2Chars)}
            </span>
            {field2Focused && cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 18,
                  background: C.accent,
                  marginLeft: 1,
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="button"
          style={{
            width: "100%",
            fontFamily: font,
            fontSize: 15,
            fontWeight: 600,
            color: C.white,
            background: C.accent,
            border: "none",
            borderRadius: 8,
            padding: "14px 0",
            opacity: typing2Chars === text2.length ? 1 : 0.5,
          }}
        >
          Continue
        </button>
      </div>

      {/* キーボードインジケーター */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          display: "flex",
          gap: 6,
        }}
      >
        {["⌘", "⇧", "A"].map((key, i) => (
          <div
            key={`key-${key}`}
            style={{
              width: 32,
              height: 32,
              background: C.gray[800],
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font,
              fontSize: 14,
              color: C.gray[400],
              opacity: lerp(frame, [startDelay + i * 5, startDelay + 15 + i * 5], [0, 1]),
            }}
          >
            {key}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
