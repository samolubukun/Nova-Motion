/**
 * UIButton - ボタンアニメーション - ホバー&クリック
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const UIButton = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hoverStart = startDelay + 20;
  const clickStart = startDelay + 45;
  const releaseStart = startDelay + 55;

  const scale = spring({
    frame:
      frame < clickStart
        ? 0
        : frame < releaseStart
        ? frame - clickStart
        : releaseStart - clickStart - (frame - releaseStart) * 2,
    fps,
    config: { damping: 10, stiffness: 300 },
  });

  const buttonScale = 1 - scale * 0.05;
  const isHovered = frame >= hoverStart;
  const isClicked = frame >= clickStart && frame < releaseStart;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* メインボタン */}
        <button
          type="button"
          style={{
            fontFamily: font,
            fontSize: 18,
            fontWeight: 600,
            color: C.white,
            background: isClicked
              ? C.accent
              : isHovered
              ? `linear-gradient(135deg, ${C.accent}, ${C.secondary})`
              : C.accent,
            border: "none",
            borderRadius: 12,
            padding: "16px 48px",
            cursor: "pointer",
            transform: `scale(${buttonScale})`,
            boxShadow: isHovered
              ? `0 10px 40px ${C.accent}60`
              : `0 4px 20px ${C.accent}30`,
            transition: "box-shadow 0.3s",
          }}
        >
          Get Started
        </button>

        {/* セカンダリボタン */}
        <button
          type="button"
          style={{
            fontFamily: font,
            fontSize: 16,
            fontWeight: 500,
            color: C.gray[300],
            background: "transparent",
            border: `2px solid ${C.gray[700]}`,
            borderRadius: 12,
            padding: "14px 40px",
            cursor: "pointer",
            opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
          }}
        >
          Learn More
        </button>
      </div>

      {/* カーソル */}
      <div
        style={{
          position: "absolute",
          left: lerp(frame, [startDelay, hoverStart], [200, 640]),
          top: lerp(frame, [startDelay, hoverStart], [500, 360]),
          width: 20,
          height: 20,
          borderLeft: `3px solid ${C.white}`,
          borderTop: `3px solid ${C.white}`,
          transform: "rotate(-45deg)",
          opacity: lerp(frame, [startDelay, startDelay + 10], [0, 1]),
        }}
      />

      {/* ラベル */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          fontFamily: font,
          fontSize: 14,
          color: C.gray[500],
          letterSpacing: 2,
        }}
      >
        BUTTON INTERACTION
      </div>
    </AbsoluteFill>
  );
};
