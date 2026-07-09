/**
 * CinematicDocumentary - ドキュメンタリー風
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const CinematicDocumentary = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const lineProgress = lerp(frame, [startDelay, startDelay + 30], [0, 100], EASE.out);
  const titleOpacity = lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* グリッドライン */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${C.gray[200]} 1px, transparent 1px),
            linear-gradient(90deg, ${C.gray[200]} 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
          opacity: 0.5,
        }}
      />

      {/* 横線 */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "50%",
          width: `${lineProgress * 0.8}%`,
          height: 2,
          background: C.black,
        }}
      />

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "52%",
          fontFamily: font,
          fontSize: 60,
          fontWeight: 300,
          color: C.black,
          letterSpacing: 4,
          opacity: titleOpacity,
        }}
      >
        The Story
      </div>

      {/* サブタイトル */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "42%",
          fontFamily: font,
          fontSize: 14,
          fontWeight: 500,
          color: C.gray[500],
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        A Documentary Film
      </div>

      {/* 年号 */}
      <div
        style={{
          position: "absolute",
          right: "10%",
          bottom: "15%",
          fontFamily: font,
          fontSize: 100,
          fontWeight: 100,
          color: C.gray[300],
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 1]),
        }}
      >
        2024
      </div>
    </AbsoluteFill>
  );
};
