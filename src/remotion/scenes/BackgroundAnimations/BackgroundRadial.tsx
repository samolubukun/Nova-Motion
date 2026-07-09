/**
 * BackgroundRadial - 放射状パターン
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundRadial = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const rayCount = 24;
  const rotation = (frame - startDelay) * 0.5;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 放射状の光線 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        }}
      >
        {Array.from({ length: rayCount }).map((_, i) => {
          const angle = (i / rayCount) * 360;
          const opacity = lerp(frame, [startDelay, startDelay + 30], [0, 0.3]);

          return (
            <div
              key={`ray-${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 1000,
                height: 4,
                background: `linear-gradient(90deg, ${i % 2 === 0 ? C.accent : C.secondary}, transparent)`,
                transformOrigin: "left center",
                transform: `rotate(${angle}deg)`,
                opacity: opacity,
              }}
            />
          );
        })}
      </div>

      {/* 中央の円 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 200,
          height: 200,
          background: C.gray[950],
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 40,
            fontWeight: 800,
            color: C.white,
          }}
        >
          RADIAL
        </div>
      </div>
    </AbsoluteFill>
  );
};
