/**
 * UIToast - 通知アニメーション - トースト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const UIToast = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const toasts = [
    { type: "success", message: "File uploaded successfully", icon: "✓", color: C.success, delay: 0 },
    { type: "warning", message: "Storage almost full", icon: "⚠", color: C.warning, delay: 25 },
    { type: "error", message: "Connection failed", icon: "✕", color: C.danger, delay: 50 },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          fontFamily: font,
          fontSize: 24,
          fontWeight: 600,
          color: C.white,
        }}
      >
        Notifications
      </div>

      {/* トースト */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 40,
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        {toasts.map((toast) => {
          const showFrame = startDelay + toast.delay;
          const hideFrame = showFrame + 60;
          const isVisible = frame >= showFrame && frame < hideFrame;

          const enterProgress = spring({
            frame: frame - showFrame,
            fps,
            config: { damping: 15, stiffness: 200 },
          });

          const exitProgress =
            frame >= hideFrame - 10
              ? lerp(frame, [hideFrame - 10, hideFrame], [1, 0], EASE.out)
              : 1;

          if (!isVisible && frame >= hideFrame) return null;

          return (
            <div
              key={`toast-${toast.type}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                background: C.gray[900],
                borderRadius: 12,
                padding: "16px 24px",
                borderLeft: `4px solid ${toast.color}`,
                transform: `translateX(${(1 - enterProgress) * 100}px)`,
                opacity: enterProgress * exitProgress,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: `${toast.color}20`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: toast.color,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {toast.icon}
              </div>
              <div
                style={{
                  fontFamily: font,
                  fontSize: 14,
                  color: C.white,
                }}
              >
                {toast.message}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
