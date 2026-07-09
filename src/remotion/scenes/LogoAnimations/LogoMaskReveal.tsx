/**
 * LogoMaskReveal - ロゴマスクリビール
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LogoMaskReveal = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const maskProgress = lerp(frame, [startDelay, startDelay + 40], [0, 100], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景パターン */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${C.gray[900]} 1px, transparent 1px),
            linear-gradient(90deg, ${C.gray[900]} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />

      {/* マスクされたロゴ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          clipPath: `inset(0 ${100 - maskProgress}% 0 0)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${C.accent}, ${C.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          BRAND
        </div>
      </div>

      {/* リビールライン */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% - 200px + ${maskProgress * 4}px)`,
          top: "50%",
          width: 4,
          height: 150,
          background: C.white,
          transform: "translateY(-50%)",
          opacity: maskProgress < 100 ? 1 : 0,
          boxShadow: `0 0 20px ${C.white}`,
        }}
      />
    </AbsoluteFill>
  );
};
