/**
 * ParticleMagneticField - 磁気フィールド
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const ParticleMagneticField = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const lineCount = 15;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }).map((_, i) => {
          const yOffset = (i - lineCount / 2) * 40;
          const animOffset = (frame - startDelay) * 0.02;

          // 磁力線のパス生成
          let path = `M 0 ${360 + yOffset}`;
          for (let x = 0; x <= 1280; x += 20) {
            const distFromCenter = Math.abs(x - 640) / 640;
            const curve = Math.sin((x * 0.01 + animOffset + i * 0.3)) * 50 * (1 - distFromCenter);
            const y = 360 + yOffset + curve;
            path += ` L ${x} ${y}`;
          }

          const opacity = lerp(frame, [startDelay, startDelay + 30], [0, 0.6]);

          return (
            <path
              key={`field-line-${i}`}
              d={path}
              stroke={i % 2 === 0 ? C.accent : C.secondary}
              strokeWidth={2}
              fill="none"
              opacity={opacity}
            />
          );
        })}
      </svg>

      {/* 中央の磁石 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 0,
        }}
      >
        <div
          style={{
            width: 60,
            height: 120,
            background: C.danger,
            borderRadius: "30px 0 0 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font,
            fontSize: 40,
            fontWeight: 800,
            color: C.white,
          }}
        >
          N
        </div>
        <div
          style={{
            width: 60,
            height: 120,
            background: C.accent,
            borderRadius: "0 30px 30px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font,
            fontSize: 40,
            fontWeight: 800,
            color: C.white,
          }}
        >
          S
        </div>
      </div>

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "15%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 24,
          color: C.gray[500],
          letterSpacing: 4,
          opacity: lerp(frame, [startDelay + 20, startDelay + 40], [0, 1]),
        }}
      >
        MAGNETIC FIELD
      </div>
    </AbsoluteFill>
  );
};
