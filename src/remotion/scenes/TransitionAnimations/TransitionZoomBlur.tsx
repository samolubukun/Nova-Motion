/**
 * TransitionZoomBlur - ズームブラートランジション
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TransitionZoomBlur = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const zoomProgress = lerp(frame, [startDelay, startDelay + 20], [1, 3], EASE.in);
  const blurProgress = lerp(frame, [startDelay, startDelay + 20], [0, 30]);
  const opacityProgress = lerp(frame, [startDelay + 15, startDelay + 25], [1, 0]);
  const newSceneOpacity = lerp(frame, [startDelay + 20, startDelay + 35], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 古いシーン（ズーム＆ブラー） */}
      <AbsoluteFill
        style={{
          transform: `scale(${zoomProgress})`,
          filter: `blur(${blurProgress}px)`,
          opacity: opacityProgress,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: font, fontSize: 80, fontWeight: 700, color: C.white }}>
          ZOOM OUT
        </div>
      </AbsoluteFill>

      {/* 新しいシーン */}
      <AbsoluteFill
        style={{
          background: C.gray[950],
          opacity: newSceneOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 700,
            color: C.white,
            transform: `scale(${interpolate(newSceneOpacity, [0, 1], [0.8, 1])})`,
          }}
        >
          ZOOM IN
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
