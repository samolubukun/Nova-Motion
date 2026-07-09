/**
 * Logo3DRotate - ロゴ3D回転
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C, font } from "../../common";

export const Logo3DRotate = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotateProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const rotateY = interpolate(rotateProgress, [0, 1], [90, 0]);
  const scale = interpolate(rotateProgress, [0, 0.5, 1], [0.5, 1.1, 1]);

  return (
    <AbsoluteFill style={{ background: C.gray[950], perspective: 1000 }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: C.white,
            textShadow: `0 0 60px ${C.accent}`,
          }}
        >
          BRAND
        </div>
      </div>

      {/* 反射 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          transform: `translate(-50%, 0) rotateX(180deg) rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          opacity: 0.2,
          filter: "blur(4px)",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: C.white,
          }}
        >
          BRAND
        </div>
      </div>
    </AbsoluteFill>
  );
};
