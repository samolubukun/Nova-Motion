/**
 * DemoModal - モーダル表示デモ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";

export const DemoModal = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // モーダル開閉
  const modalOpenFrame = startDelay + 35;
  const modalCloseFrame = startDelay + 100;
  const isModalOpen = frame >= modalOpenFrame && frame < modalCloseFrame;

  const modalProgress = spring({
    frame: isModalOpen ? frame - modalOpenFrame : modalCloseFrame - frame + 5,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const backdropOpacity = isModalOpen
    ? lerp(frame, [modalOpenFrame, modalOpenFrame + 15], [0, 0.7])
    : lerp(frame, [modalCloseFrame, modalCloseFrame + 10], [0.7, 0]);

  // カーソル
  const cursorX = lerp(frame, [startDelay, modalOpenFrame - 5], [300, 200], EASE.smooth);
  const cursorY = lerp(frame, [startDelay, modalOpenFrame - 5], [400, 160], EASE.smooth);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景コンテンツ */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 80,
          right: 60,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            fontWeight: 600,
            color: C.white,
            marginBottom: 30,
          }}
        >
          Settings
        </div>

        {/* トリガーボタン */}
        <button
          type="button"
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 500,
            color: C.white,
            background: C.accent,
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          Delete Account
        </button>
      </div>

      {/* バックドロップ */}
      <AbsoluteFill
        style={{
          background: C.black,
          opacity: backdropOpacity,
        }}
      />

      {/* モーダル */}
      {(isModalOpen || frame < modalCloseFrame + 15) && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${modalProgress})`,
            width: 450,
            background: C.gray[900],
            borderRadius: 16,
            padding: 30,
            opacity: modalProgress,
          }}
        >
          {/* 閉じるボタン */}
          <button
            type="button"
            style={{
              position: "absolute",
              right: 15,
              top: 15,
              width: 30,
              height: 30,
              background: "none",
              border: "none",
              color: C.gray[500],
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          {/* 警告アイコン */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: `${C.secondary}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke={C.secondary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            style={{
              fontFamily: font,
              fontSize: 20,
              fontWeight: 600,
              color: C.white,
              marginBottom: 10,
            }}
          >
            Delete Account?
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[400],
              marginBottom: 25,
              lineHeight: 1.6,
            }}
          >
            This action cannot be undone. All your data will be permanently removed from our servers.
          </div>

          {/* ボタン */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              style={{
                flex: 1,
                fontFamily: font,
                fontSize: 14,
                fontWeight: 500,
                color: C.white,
                background: C.gray[800],
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                fontFamily: font,
                fontSize: 14,
                fontWeight: 500,
                color: C.white,
                background: C.secondary,
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* カーソル */}
      {!isModalOpen && frame < modalOpenFrame && (
        <Cursor
          x={cursorX}
          y={cursorY}
          clicking={frame >= modalOpenFrame - 3}
        />
      )}
    </AbsoluteFill>
  );
};
