/**
 * EffectDuotone - デュオトーン効果
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const EffectDuotone = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const hueShift = (frame - startDelay) * 2;
  const textOpacity = lerp(frame, [startDelay, startDelay + 30], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, 
          hsl(${hueShift % 360}, 70%, 30%),
          hsl(${(hueShift + 60) % 360}, 70%, 50%)
        )`,
      }}
    >
      {/* パターン */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 40%)
          `,
        }}
      />

      {/* グリッドオーバーレイ */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* テキスト */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: C.white,
            opacity: textOpacity,
            mixBlendMode: "overlay",
          }}
        >
          DUOTONE
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            color: C.white,
            letterSpacing: 8,
            marginTop: 20,
            opacity: textOpacity * 0.7,
          }}
        >
          COLOR EFFECT
        </div>
      </AbsoluteFill>

      {/* コーナーデコレーション */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 60,
          height: 60,
          borderLeft: `3px solid ${C.white}50`,
          borderTop: `3px solid ${C.white}50`,
          opacity: textOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 40,
          width: 60,
          height: 60,
          borderRight: `3px solid ${C.white}50`,
          borderBottom: `3px solid ${C.white}50`,
          opacity: textOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
