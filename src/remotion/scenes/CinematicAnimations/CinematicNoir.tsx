/**
 * CinematicNoir - ノワール風
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const CinematicNoir = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const blindsProgress = lerp(frame, [startDelay, startDelay + 40], [0, 1], EASE.out);
  const titleOpacity = lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* ブラインドの光 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`blind-${i}`}
          style={{
            position: "absolute",
            left: 0,
            top: i * 90 + 40,
            width: "100%",
            height: 30,
            background: `linear-gradient(90deg, transparent, ${C.white}10, ${C.white}20, ${C.white}10, transparent)`,
            transform: `scaleX(${blindsProgress}) skewY(-5deg)`,
            transformOrigin: "left",
          }}
        />
      ))}

      {/* シルエット */}
      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 0,
          width: 200,
          height: 400,
          background: C.black,
          clipPath: "polygon(30% 100%, 70% 100%, 60% 0%, 40% 0%)",
          opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
        }}
      />

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 300,
            fontStyle: "italic",
            color: C.white,
            opacity: titleOpacity,
          }}
        >
          Shadows
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[500],
            letterSpacing: 6,
            marginTop: 20,
            opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
          }}
        >
          A NOIR THRILLER
        </div>
      </div>

      {/* フィルムグレイン */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.08,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
