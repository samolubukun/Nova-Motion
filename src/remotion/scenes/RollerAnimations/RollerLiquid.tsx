/**
 * RollerLiquid - 流体モーフィング
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const RollerLiquid = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const words = ["FLOW", "FORM", "FLUX", "FUSE"];
  const cycleDuration = 32;
  const finalIndex = words.length - 1;

  const t = frame - startDelay;
  const currentIndex = Math.min(Math.floor(t / cycleDuration), finalIndex);
  const nextIndex = Math.min(currentIndex + 1, finalIndex);
  const cycleT = currentIndex >= finalIndex ? 0 : t % cycleDuration;

  const morphStart = cycleDuration - 12;
  const isMorphing = currentIndex < finalIndex && cycleT >= morphStart;

  const morphProgress = isMorphing
    ? lerp(cycleT, [morphStart, cycleDuration], [0, 1], EASE.smooth)
    : 0;

  // SVGフィルター用の乱れ
  const turbulence = isMorphing ? 0.02 + morphProgress * 0.05 : 0;
  const filterId = `liquidFilter-${startDelay}`;

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* SVGフィルター定義 */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={turbulence}
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isMorphing ? 30 * morphProgress : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

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
            fontSize: 18,
            fontWeight: 500,
            color: C.gray[400],
            letterSpacing: 6,
            marginBottom: 20,
          }}
        >
          IN CONSTANT
        </div>

        {/* 流体テキスト */}
        <div
          style={{
            fontFamily: font,
            fontSize: 120,
            fontWeight: 900,
            color: C.gray[900],
            filter: isMorphing ? `url(#${filterId})` : "none",
            opacity: 1 - morphProgress * 0.5,
          }}
        >
          {words[currentIndex]}
        </div>

        {/* 次のテキスト（フェードイン） */}
        {isMorphing && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: font,
              fontSize: 120,
              fontWeight: 900,
              color: C.gray[900],
              opacity: morphProgress,
            }}
          >
            {words[nextIndex]}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
