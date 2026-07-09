/**
 * ThemeCosmic - Cosmic/Space - 宇宙
 */

import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const ThemeCosmic = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const textOpacity = lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]);

  // 星を生成
  const stars = Array.from({ length: 100 }, (_, i) => ({
    x: random(`star-x-${i}`) * 100,
    y: random(`star-y-${i}`) * 100,
    size: 1 + random(`star-s-${i}`) * 2,
    twinkle: random(`star-t-${i}`) * Math.PI * 2,
  }));

  return (
    <AbsoluteFill style={{ background: "#0a0a1a" }}>
      {/* 星空 */}
      {stars.map((star, i) => {
        const twinkle = Math.sin((frame - startDelay) * 0.1 + star.twinkle) * 0.5 + 0.5;
        return (
          <div
            key={`cosmic-star-${i}-${star.x.toFixed(2)}`}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              background: C.white,
              opacity: twinkle * lerp(frame, [startDelay, startDelay + 30], [0, 1]),
            }}
          />
        );
      })}

      {/* 惑星 */}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 150,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: `
            inset -30px -30px 60px rgba(0,0,0,0.5),
            0 0 60px rgba(102, 126, 234, 0.5)
          `,
          opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
        }}
      />

      {/* リング */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 220,
          width: 340,
          height: 60,
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "50%",
          transform: "rotateX(70deg)",
          opacity: lerp(frame, [startDelay + 15, startDelay + 35], [0, 1]),
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
            color: "#667eea",
            letterSpacing: 4,
            marginBottom: 15,
          }}
        >
          EXPLORE THE
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 200,
            color: C.white,
            lineHeight: 1,
          }}
        >
          COSMOS
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 18,
            color: C.gray[400],
            marginTop: 20,
          }}
        >
          Beyond infinity
        </div>
      </div>

      {/* 流れ星 */}
      <div
        style={{
          position: "absolute",
          left: `${50 + (frame - startDelay) * 2}%`,
          top: `${20 - (frame - startDelay) * 0.5}%`,
          width: 100,
          height: 2,
          background: "linear-gradient(90deg, #ffffff, transparent)",
          transform: "rotate(-30deg)",
          opacity: Math.sin((frame - startDelay) * 0.1) > 0.8 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};
