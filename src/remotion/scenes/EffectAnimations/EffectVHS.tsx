/**
 * EffectVHS - VHSエフェクト
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, font } from "../../common";

export const EffectVHS = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const tracking = Math.sin((frame - startDelay) * 0.05) * 5;
  const jitter = random(`vhs-${frame}`) > 0.95;
  const jitterAmount = jitter ? random(`vhs-jitter-${frame}`) * 20 - 10 : 0;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* メインコンテンツ */}
      <AbsoluteFill
        style={{
          transform: `translateX(${jitterAmount}px) skewX(${jitter ? 2 : 0}deg)`,
        }}
      >
        {/* 赤チャンネルずれ */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateX(${tracking}px)`,
            mixBlendMode: "screen",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 100,
              fontWeight: 800,
              color: "rgba(255, 0, 0, 0.7)",
            }}
          >
            VHS
          </div>
        </AbsoluteFill>

        {/* シアンチャンネルずれ */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateX(${-tracking}px)`,
            mixBlendMode: "screen",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 100,
              fontWeight: 800,
              color: "rgba(0, 255, 255, 0.7)",
            }}
          >
            VHS
          </div>
        </AbsoluteFill>

        {/* メインテキスト */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 100,
              fontWeight: 800,
              color: C.white,
            }}
          >
            VHS
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* スキャンライン */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0, 0, 0, 0.2) 1px,
            rgba(0, 0, 0, 0.2) 2px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* ノイズバー */}
      {jitter && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${random(`noise-bar-${frame}`) * 80 + 10}%`,
            width: "100%",
            height: random(`noise-bar-h-${frame}`) * 30 + 10,
            background: `linear-gradient(to bottom, transparent, ${C.white}30, transparent)`,
          }}
        />
      )}

      {/* 日付スタンプ */}
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 40,
          fontFamily: "monospace",
          fontSize: 18,
          color: C.white,
          textShadow: "2px 2px 0 rgba(0, 0, 0, 0.8)",
        }}
      >
        PLAY ▶ 02:26:25
      </div>
    </AbsoluteFill>
  );
};
