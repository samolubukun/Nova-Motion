/**
 * UIForm - 入力フォーム
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const UIForm = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const typingStart = startDelay + 30;
  const typedText = "john@example.com";
  const charsToShow = Math.floor(
    lerp(frame, [typingStart, typingStart + typedText.length * 3], [0, typedText.length])
  );
  const displayText = typedText.slice(0, charsToShow);

  const focusedField = frame < typingStart ? -1 : 0;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 28,
            fontWeight: 700,
            color: C.white,
            textAlign: "center",
            marginBottom: 40,
            opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
          }}
        >
          Sign In
        </div>

        {/* Email入力 */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[400],
              display: "block",
              marginBottom: 8,
            }}
          >
            Email
          </label>
          <div
            style={{
              padding: "14px 16px",
              background: C.gray[900],
              borderRadius: 10,
              border: `2px solid ${focusedField === 0 ? C.accent : C.gray[700]}`,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: font,
                fontSize: 16,
                color: displayText ? C.white : C.gray[600],
                flex: 1,
              }}
            >
              {displayText || "Enter your email"}
            </span>
            {focusedField === 0 && (
              <span
                style={{
                  width: 2,
                  height: 20,
                  background: C.accent,
                  opacity: Math.floor(frame / 15) % 2,
                }}
              />
            )}
          </div>
        </div>

        {/* Password入力 */}
        <div style={{ marginBottom: 30 }}>
          <label
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[400],
              display: "block",
              marginBottom: 8,
            }}
          >
            Password
          </label>
          <div
            style={{
              padding: "14px 16px",
              background: C.gray[900],
              borderRadius: 10,
              border: `2px solid ${C.gray[700]}`,
            }}
          >
            <span style={{ fontFamily: font, fontSize: 16, color: C.gray[600] }}>
              Enter your password
            </span>
          </div>
        </div>

        {/* ボタン */}
        <button
          type="button"
          style={{
            width: "100%",
            fontFamily: font,
            fontSize: 16,
            fontWeight: 600,
            color: C.white,
            background: C.accent,
            border: "none",
            borderRadius: 10,
            padding: "16px 0",
            cursor: "pointer",
            opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
          }}
        >
          Sign In
        </button>

        {/* リンク */}
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontFamily: font,
            fontSize: 14,
            color: C.gray[500],
            opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
          }}
        >
          Don't have an account?{" "}
          <span style={{ color: C.accent, cursor: "pointer" }}>Sign Up</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
