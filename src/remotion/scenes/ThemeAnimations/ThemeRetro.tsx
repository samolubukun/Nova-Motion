/**
 * ThemeRetro - レトロ/ヴィンテージ - セピア、ノイズ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, lerp, font } from "../../common";

export const ThemeRetro = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: "#f4e9d8" }}>
      {/* ノイズテクスチャ */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.1,
          mixBlendMode: "multiply",
        }}
      />

      {/* ビネット */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* メインコンテンツ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "#8b7355",
            letterSpacing: 8,
            marginBottom: 20,
            opacity: textProgress,
          }}
        >
          ★ ESTABLISHED 1985 ★
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 900,
            color: "#3d3027",
            letterSpacing: -2,
            textTransform: "uppercase",
            opacity: textProgress,
            transform: `translateY(${(1 - textProgress) * 30}px)`,
          }}
        >
          Vintage
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            fontWeight: 300,
            color: "#6b5a47",
            marginTop: 10,
            fontStyle: "italic",
            opacity: textProgress,
          }}
        >
          Classic Style Never Dies
        </div>

        {/* 装飾線 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 30,
            opacity: textProgress,
          }}
        >
          <div style={{ width: 60, height: 1, background: "#8b7355" }} />
          <div
            style={{
              width: 8,
              height: 8,
              background: "#8b7355",
              transform: "rotate(45deg)",
            }}
          />
          <div style={{ width: 60, height: 1, background: "#8b7355" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
