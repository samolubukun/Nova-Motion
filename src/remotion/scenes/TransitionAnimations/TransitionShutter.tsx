/**
 * TransitionShutter - シャッタートランジション - カメラシャッター風
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const TransitionShutter = ({ startDelay = 0, bladeCount = 8 }: {
  startDelay?: number;
  bladeCount?: number;
}) => {
  const frame = useCurrentFrame();

  const closeProgress = lerp(frame, [startDelay, startDelay + 15], [0, 1], EASE.in);
  const openProgress = lerp(frame, [startDelay + 20, startDelay + 35], [0, 1], EASE.out);

  const isClosed = frame >= startDelay + 15 && frame < startDelay + 20;
  const isOpening = frame >= startDelay + 20;

  const apertureSize = isClosed
    ? 0
    : isOpening
    ? openProgress * 150
    : (1 - closeProgress) * 150;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 背景シーン */}
      {!isOpening && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: font, fontSize: 60, color: C.gray[700] }}>
            SCENE A
          </div>
        </AbsoluteFill>
      )}

      {/* 新しいシーン */}
      {isOpening && (
        <AbsoluteFill
          style={{
            background: C.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: font, fontSize: 80, fontWeight: 800, color: C.white }}>
            SCENE B
          </div>
        </AbsoluteFill>
      )}

      {/* シャッターブレード */}
      {Array.from({ length: bladeCount }).map((_, i) => {
        const angle = (i / bladeCount) * 360;
        const bladeLength = 800;

        return (
          <div
            key={`shutter-blade-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: bladeLength,
              height: bladeLength / 2,
              background: C.gray[900],
              transformOrigin: "0 50%",
              transform: `
                rotate(${angle}deg)
                translateX(${apertureSize}px)
              `,
              borderRight: `2px solid ${C.gray[700]}`,
            }}
          />
        );
      })}

      {/* 中央の円（アパーチャー） */}
      {!isClosed && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: apertureSize * 2,
            height: apertureSize * 2,
            border: `2px solid ${C.gray[600]}`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
