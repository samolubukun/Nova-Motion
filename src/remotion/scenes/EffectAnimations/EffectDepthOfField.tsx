/**
 * EffectDepthOfField - ぼかし深度 - デプスオブフィールド
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const EffectDepthOfField = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const focusPoint = lerp(frame, [startDelay, startDelay + 60], [0, 2], EASE.inOut);
  const layer1Blur = Math.abs(focusPoint - 0) * 8;
  const layer2Blur = Math.abs(focusPoint - 1) * 8;
  const layer3Blur = Math.abs(focusPoint - 2) * 8;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景レイヤー（遠い） */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: `blur(${layer3Blur}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 200,
            fontWeight: 900,
            color: C.gray[800],
            opacity: 0.5,
          }}
        >
          FAR
        </div>
      </AbsoluteFill>

      {/* 中間レイヤー */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: `blur(${layer2Blur}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 700,
            color: C.accent,
            marginTop: -50,
          }}
        >
          MIDDLE
        </div>
      </AbsoluteFill>

      {/* 前景レイヤー（近い） */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 100,
          filter: `blur(${layer1Blur}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 60,
            fontWeight: 600,
            color: C.white,
          }}
        >
          NEAR
        </div>
      </AbsoluteFill>

      {/* フォーカスインジケーター */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {["FAR", "MID", "NEAR"].map((label, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                background: Math.round(focusPoint) === 2 - i ? C.accent : C.gray[700],
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontFamily: font,
                fontSize: 12,
                color: Math.round(focusPoint) === 2 - i ? C.white : C.gray[600],
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
