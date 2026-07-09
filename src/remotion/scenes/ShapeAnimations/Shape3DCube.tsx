/**
 * Shape3DCube - 3D回転キューブ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const Shape3DCube = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const rotateX = (frame - startDelay) * 0.8;
  const rotateY = (frame - startDelay) * 1.2;

  const cubeSize = 200;

  const faces = [
    { transform: `translateZ(${cubeSize / 2}px)`, bg: C.accent },
    { transform: `rotateY(180deg) translateZ(${cubeSize / 2}px)`, bg: C.secondary },
    { transform: `rotateY(-90deg) translateZ(${cubeSize / 2}px)`, bg: C.tertiary },
    { transform: `rotateY(90deg) translateZ(${cubeSize / 2}px)`, bg: C.orange },
    { transform: `rotateX(90deg) translateZ(${cubeSize / 2}px)`, bg: C.yellow },
    { transform: `rotateX(-90deg) translateZ(${cubeSize / 2}px)`, bg: C.gray[500] },
  ];

  return (
    <AbsoluteFill
      style={{
        background: C.gray[950],
        perspective: 1000,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: cubeSize,
          height: cubeSize,
          transformStyle: "preserve-3d",
          transform: `
            translate(-50%, -50%)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(${entryProgress})
          `,
        }}
      >
        {faces.map((face, i) => (
          <div
            key={`cube-face-${i}`}
            style={{
              position: "absolute",
              width: cubeSize,
              height: cubeSize,
              background: face.bg,
              opacity: 0.9,
              transform: face.transform,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font,
              fontSize: 40,
              fontWeight: 700,
              color: C.white,
              border: `2px solid ${C.white}20`,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* ラベル */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          fontFamily: font,
          fontSize: 16,
          color: C.gray[500],
          letterSpacing: 4,
          opacity: entryProgress,
        }}
      >
        3D TRANSFORM
      </div>
    </AbsoluteFill>
  );
};
