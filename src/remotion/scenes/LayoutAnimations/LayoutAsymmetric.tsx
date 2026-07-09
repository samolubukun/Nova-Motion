/**
 * LayoutAsymmetric - 極端な非対称レイアウト - 左に巨大テキスト、右に小さな情報
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutAsymmetric = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainTextProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const sideInfoProgress = spring({
    frame: frame - startDelay - 15,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 左側：巨大テキスト（画面の70%を占める） */}
      <div
        style={{
          position: "absolute",
          left: -30,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - mainTextProgress) * -100}px)`,
          opacity: mainTextProgress,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 280,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.85,
            letterSpacing: -15,
          }}
        >
          BIG
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 280,
            fontWeight: 900,
            color: C.accent,
            lineHeight: 0.85,
            letterSpacing: -15,
            marginLeft: 60,
          }}
        >
          IDEA
        </div>
      </div>

      {/* 右側：小さな情報群 */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 80,
          width: 200,
          opacity: sideInfoProgress,
          transform: `translateY(${(1 - sideInfoProgress) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 11,
            color: C.gray[500],
            letterSpacing: 3,
            marginBottom: 15,
          }}
        >
          EST. 2024
        </div>
        <div
          style={{
            width: 40,
            height: 2,
            background: C.accent,
            marginBottom: 20,
          }}
        />
        <div
          style={{
            fontFamily: font,
            fontSize: 13,
            color: C.gray[400],
            lineHeight: 1.8,
          }}
        >
          Creative Agency
          <br />
          Tokyo, Japan
        </div>
      </div>

      {/* 右下：装飾番号 */}
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          fontFamily: font,
          fontSize: 120,
          fontWeight: 100,
          color: C.gray[900],
          opacity: sideInfoProgress,
        }}
      >
        01
      </div>

      {/* 縦線装飾 */}
      <div
        style={{
          position: "absolute",
          right: 280,
          top: 60,
          width: 1,
          height: lerp(frame, [startDelay + 20, startDelay + 50], [0, 600], EASE.out),
          background: C.gray[800],
        }}
      />
    </AbsoluteFill>
  );
};
