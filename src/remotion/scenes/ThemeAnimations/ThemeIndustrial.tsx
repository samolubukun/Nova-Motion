/**
 * ThemeIndustrial - Industrial - 工業的
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeIndustrial = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const gearRotation = (frame - startDelay) * 0.5;
  const textOpacity = lerp(frame, [startDelay + 15, startDelay + 35], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "#2d2d2d" }}>
      {/* 金属テクスチャ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 4px,
              rgba(255,255,255,0.02) 4px,
              rgba(255,255,255,0.02) 5px
            )
          `,
        }}
      />

      {/* ギア */}
      <svg
        style={{
          position: "absolute",
          right: 100,
          top: 100,
          transform: `rotate(${gearRotation}deg)`,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 0.3]),
        }}
        width="300"
        height="300"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M50 10 L55 25 L65 20 L60 35 L75 35 L65 45 L80 50 L65 55 L75 65 L60 65 L65 80 L55 75 L50 90 L45 75 L35 80 L40 65 L25 65 L35 55 L20 50 L35 45 L25 35 L40 35 L35 20 L45 25 Z"
          fill="#ff6600"
        />
        <circle cx="50" cy="50" r="15" fill="#2d2d2d" />
      </svg>

      <svg
        style={{
          position: "absolute",
          right: 300,
          top: 250,
          transform: `rotate(${-gearRotation * 0.8}deg)`,
          opacity: lerp(frame, [startDelay + 5, startDelay + 25], [0, 0.2]),
        }}
        width="200"
        height="200"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M50 10 L55 25 L65 20 L60 35 L75 35 L65 45 L80 50 L65 55 L75 65 L60 65 L65 80 L55 75 L50 90 L45 75 L35 80 L40 65 L25 65 L35 55 L20 50 L35 45 L25 35 L40 35 L35 20 L45 25 Z"
          fill="#666666"
        />
        <circle cx="50" cy="50" r="15" fill="#2d2d2d" />
      </svg>

      {/* 警告ストライプ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 20,
          background: `repeating-linear-gradient(
            45deg,
            #ff6600,
            #ff6600 20px,
            #1a1a1a 20px,
            #1a1a1a 40px
          )`,
          opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "#ff6600",
            letterSpacing: 4,
            marginBottom: 15,
          }}
        >
          HEAVY DUTY
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 900,
            color: C.white,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          INDUSTRIAL
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 16,
            color: C.gray[400],
            marginTop: 20,
            letterSpacing: 2,
          }}
        >
          BUILT TO LAST — SINCE 1892
        </div>
      </div>

      {/* ボルト装飾 */}
      {[
        { x: 40, y: 40 },
        { x: 1200, y: 40 },
        { x: 40, y: 640 },
        { x: 1200, y: 640 },
      ].map((pos) => (
        <div
          key={`bolt-${pos.x}-${pos.y}`}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#444444",
            border: "2px solid #555555",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
            opacity: textOpacity,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
