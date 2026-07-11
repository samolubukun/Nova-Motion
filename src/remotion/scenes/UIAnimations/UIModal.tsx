/**
 * UIModal - Modal Animation
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const UIModal = ({ title = "Dashboard", startDelay = 0 }: {
  title?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const openStart = startDelay + 20;
  const closeStart = startDelay + 70;

  const isOpen = frame >= openStart && frame < closeStart;

  const backdropOpacity = isOpen
    ? lerp(frame, [openStart, openStart + 10], [0, 0.8])
    : lerp(frame, [closeStart, closeStart + 10], [0.8, 0]);

  const modalProgress = spring({
    frame: isOpen ? frame - openStart : closeStart - frame + 10,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* Background Content */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          right: 60,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 28,
            fontWeight: 700,
            color: C.white,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={`bg-card-${i}`}
              style={{
                background: C.gray[900],
                borderRadius: 12,
                height: 150,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Backdrop */}
      <AbsoluteFill
        style={{
          background: C.black,
          opacity: backdropOpacity,
        }}
      />

      {/* Modal */}
      {(isOpen || frame < closeStart + 15) && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${modalProgress})`,
            width: 500,
            background: C.gray[900],
            borderRadius: 20,
            padding: 40,
            opacity: modalProgress,
          }}
        >
          {/* Close Button */}
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 20,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.gray[500],
              fontSize: 24,
            }}
          >
            ×
          </div>

          {/* Checkmark Icon（SVG） */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `${C.success}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 25px",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12l5 5L19 7"
                stroke={C.success}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 22,
              fontWeight: 700,
              color: C.white,
              marginBottom: 12,
            }}
          >
            Campaign Scheduled
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 15,
              color: C.gray[400],
              marginBottom: 30,
              lineHeight: 1.6,
            }}
          >
            Your content campaign is successfully scheduled. All platforms synced.
          </div>
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
              cursor: "pointer",
            }}
          >
            View Dashboard
          </button>
        </div>
      )}
    </AbsoluteFill>
  );
};
