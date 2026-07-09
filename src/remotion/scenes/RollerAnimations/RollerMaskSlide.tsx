/**
 * RollerMaskSlide - マスクスライド
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerMaskSlide = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const words = ["INSPIRE", "IMAGINE", "INNOVATE", "IMPACT"];
  const cycleDuration = 30;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const nextIndex = Math.min(currentIndex + 1, finalIndex);
  const cycleT = currentIndex >= finalIndex ? 0 : t % cycleDuration;

  const maskProgress = currentIndex >= finalIndex ? 0 : lerp(cycleT, [cycleDuration - 15, cycleDuration], [0, 100], EASE.smooth);
  const isTransitioning = currentIndex < finalIndex && cycleT >= cycleDuration - 15;

  return (
    <AbsoluteFill style={{ background: C.black }}>
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
            fontSize: 16,
            fontWeight: 500,
            color: C.gray[600],
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          TIME TO
        </div>

        {/* マスクスライドコンテナ */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* 現在のテキスト */}
          <div
            style={{
              fontFamily: font,
              fontSize: 100,
              fontWeight: 900,
              color: C.white,
              clipPath: isTransitioning
                ? `inset(0 ${maskProgress}% 0 0)`
                : "none",
            }}
          >
            {words[currentIndex]}
          </div>

          {/* 次のテキスト（マスクで徐々に表示） */}
          {isTransitioning && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                fontFamily: font,
                fontSize: 100,
                fontWeight: 900,
                color: C.accent,
                clipPath: `inset(0 0 0 ${100 - maskProgress}%)`,
              }}
            >
              {words[nextIndex]}
            </div>
          )}
        </div>

        {/* プログレスバー */}
        <div
          style={{
            width: 200,
            height: 2,
            background: C.gray[800],
            margin: "30px auto 0",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(cycleT / cycleDuration) * 100}%`,
              height: "100%",
              background: C.accent,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
