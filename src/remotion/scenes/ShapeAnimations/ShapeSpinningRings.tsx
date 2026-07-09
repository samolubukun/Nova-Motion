/**
 * ShapeSpinningRings - 回転する円環 - ローディング風
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const ShapeSpinningRings = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const rotation = (frame - startDelay) * 2;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* 外側のリング */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 300,
            height: 300,
            border: `4px solid ${C.accent}`,
            borderRadius: "50%",
            borderTopColor: "transparent",
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${entryProgress})`,
          }}
        />

        {/* 中間のリング */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 220,
            height: 220,
            border: `3px solid ${C.secondary}`,
            borderRadius: "50%",
            borderBottomColor: "transparent",
            transform: `translate(-50%, -50%) rotate(${-rotation * 1.5}deg) scale(${entryProgress})`,
          }}
        />

        {/* 内側のリング */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 140,
            height: 140,
            border: `2px solid ${C.tertiary}`,
            borderRadius: "50%",
            borderLeftColor: "transparent",
            transform: `translate(-50%, -50%) rotate(${rotation * 2}deg) scale(${entryProgress})`,
          }}
        />

        {/* 中央のドット */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 20,
            height: 20,
            background: C.white,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${entryProgress})`,
          }}
        />
      </div>

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 14,
          color: C.gray[500],
          letterSpacing: 4,
          opacity: entryProgress,
        }}
      >
        LOADING
      </div>
    </AbsoluteFill>
  );
};
