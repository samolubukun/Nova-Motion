/**
 * DataStatsCards - スタッツカード - 統計カード（非対称レイアウト）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const DataStatsCards = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // メイン数値のアニメーション
  const mainProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const subProgress = spring({
    frame: frame - startDelay - 15,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const countProgress = lerp(frame, [startDelay + 10, startDelay + 50], [0, 1], EASE.out);
  const mainValue = Math.floor(89420 * countProgress).toLocaleString();

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 左側：メイン統計（大きく表示） */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - mainProgress) * -80}px)`,
          opacity: mainProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 12,
            color: C.gray[600],
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          TOTAL REVENUE
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 800,
            color: C.white,
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          ${mainValue}
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.success,
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }}>↑</span>
          <span>12.5% from last quarter</span>
        </div>
      </div>

      {/* 右側：サブ統計（小さめ、縦積み） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 120,
          width: 280,
          opacity: subProgress,
          transform: `translateY(${(1 - subProgress) * 40}px)`,
        }}
      >
        {/* サブ統計1 */}
        <div
          style={{
            borderLeft: `2px solid ${C.accent}`,
            paddingLeft: 20,
            marginBottom: 50,
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 11,
              color: C.gray[600],
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            ACTIVE USERS
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 36,
              fontWeight: 700,
              color: C.white,
            }}
          >
            24,580
          </div>
        </div>

        {/* サブ統計2 */}
        <div
          style={{
            borderLeft: `2px solid ${C.secondary}`,
            paddingLeft: 20,
            marginBottom: 50,
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 11,
              color: C.gray[600],
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            CONVERSION
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 36,
              fontWeight: 700,
              color: C.white,
            }}
          >
            4.8%
          </div>
        </div>

        {/* サブ統計3 */}
        <div
          style={{
            borderLeft: `2px solid ${C.tertiary}`,
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 11,
              color: C.gray[600],
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            ONLINE NOW
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 36,
              fontWeight: 700,
              color: C.white,
            }}
          >
            1,847
          </div>
        </div>
      </div>

      {/* 下部の装飾ライン */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 60,
          width: lerp(frame, [startDelay + 30, startDelay + 60], [0, 400]),
          height: 1,
          background: C.gray[800],
        }}
      />

      {/* 右下の番号 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 60,
          fontFamily: font,
          fontSize: 11,
          color: C.gray[700],
          letterSpacing: 2,
          opacity: subProgress,
        }}
      >
        Q4 2024 — OVERVIEW
      </div>
    </AbsoluteFill>
  );
};
