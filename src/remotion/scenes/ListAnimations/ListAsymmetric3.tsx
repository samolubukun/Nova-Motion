/**
 * ListAsymmetric3 - 非対称3要素（1大+2小）- 最重要を大きく
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ListAsymmetric3 = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const sub1Progress = spring({
    frame: frame - startDelay - 20,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const sub2Progress = spring({
    frame: frame - startDelay - 30,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* メイン要素（大きく、左寄り） */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 100,
          width: 600,
          transform: `translateX(${(1 - mainProgress) * -80}px)`,
          opacity: mainProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.accent,
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          01 — PRIMARY
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 56,
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Speed &amp;
          <br />
          Performance
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[400],
            lineHeight: 1.7,
            maxWidth: 400,
          }}
        >
          10x faster than traditional solutions with optimized algorithms.
        </div>
      </div>

      {/* サブ要素1（右上、小さめ） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 120,
          width: 280,
          borderLeft: `2px solid ${C.gray[800]}`,
          paddingLeft: 25,
          transform: `translateY(${(1 - sub1Progress) * 30}px)`,
          opacity: sub1Progress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 11,
            color: C.gray[600],
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          02
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            fontWeight: 600,
            color: C.white,
            marginBottom: 8,
          }}
        >
          Security
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 13,
            color: C.gray[500],
            lineHeight: 1.6,
          }}
        >
          Enterprise-grade encryption and compliance.
        </div>
      </div>

      {/* サブ要素2（右下、小さめ） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 320,
          width: 280,
          borderLeft: `2px solid ${C.gray[800]}`,
          paddingLeft: 25,
          transform: `translateY(${(1 - sub2Progress) * 30}px)`,
          opacity: sub2Progress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 11,
            color: C.gray[600],
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          03
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            fontWeight: 600,
            color: C.white,
            marginBottom: 8,
          }}
        >
          Scalability
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 13,
            color: C.gray[500],
            lineHeight: 1.6,
          }}
        >
          From startup to enterprise, grow without limits.
        </div>
      </div>

      {/* 下部装飾ライン */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          width: lerp(frame, [startDelay + 40, startDelay + 70], [0, 500], EASE.out),
          height: 1,
          background: C.gray[800],
        }}
      />
    </AbsoluteFill>
  );
};
