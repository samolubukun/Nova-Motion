/**
 * ThemeBauhaus - Bauhaus - バウハウス
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeBauhaus = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const circleProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const rectProgress = spring({
    frame: frame - startDelay - 10,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const triProgress = spring({
    frame: frame - startDelay - 20,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: "#f5f1e6" }}>
      {/* 円（赤） */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 150,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "#e63946",
          transform: `scale(${circleProgress})`,
        }}
      />

      {/* 四角（青） */}
      <div
        style={{
          position: "absolute",
          right: 200,
          top: 200,
          width: 200,
          height: 200,
          background: "#1d3557",
          transform: `scale(${rectProgress}) rotate(${rectProgress * 15}deg)`,
        }}
      />

      {/* 三角（黄） */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 100,
          transform: `translateX(-50%) scale(${triProgress})`,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "100px solid transparent",
            borderRight: "100px solid transparent",
            borderBottom: "180px solid #f4a261",
          }}
        />
      </div>

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 900,
            color: C.gray[900],
            letterSpacing: 20,
          }}
        >
          BAUHAUS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[600],
            letterSpacing: 8,
            marginTop: 20,
          }}
        >
          FORM FOLLOWS FUNCTION
        </div>
      </div>

      {/* 線の装飾 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 80,
          width: lerp(frame, [startDelay + 40, startDelay + 60], [0, 300]),
          height: 4,
          background: C.gray[900],
        }}
      />
    </AbsoluteFill>
  );
};
