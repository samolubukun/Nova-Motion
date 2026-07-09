/**
 * ShapeHelix - DNA風らせん構造
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ShapeHelix = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const entryProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);
  const rotation = (frame - startDelay) * 0.03;

  const points = 20;
  const helixHeight = 500;

  return (
    <AbsoluteFill style={{ background: C.black, perspective: 800 }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotateY(${rotation * 57}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {Array.from({ length: points }).map((_, i) => {
          const progress = i / points;
          const y = (progress - 0.5) * helixHeight;
          const angle = progress * Math.PI * 4 + rotation;
          const x1 = Math.cos(angle) * 80;
          const z1 = Math.sin(angle) * 80;
          const x2 = Math.cos(angle + Math.PI) * 80;
          const z2 = Math.sin(angle + Math.PI) * 80;

          const delay = i * 2;
          const pointProgress = lerp(frame, [startDelay + delay, startDelay + delay + 15], [0, 1], EASE.out);

          return (
            <React.Fragment key={`helix-${i}`}>
              {/* 点1 */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 16,
                  height: 16,
                  background: C.accent,
                  borderRadius: "50%",
                  transform: `translate(-50%, -50%) translate3d(${x1}px, ${y}px, ${z1}px) scale(${pointProgress * entryProgress})`,
                  boxShadow: `0 0 20px ${C.accent}`,
                }}
              />
              {/* 点2 */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 16,
                  height: 16,
                  background: C.secondary,
                  borderRadius: "50%",
                  transform: `translate(-50%, -50%) translate3d(${x2}px, ${y}px, ${z2}px) scale(${pointProgress * entryProgress})`,
                  boxShadow: `0 0 20px ${C.secondary}`,
                }}
              />
              {/* 接続線（簡略化） */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 160,
                  height: 2,
                  background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})`,
                  transform: `translate(-50%, -50%) translate3d(0, ${y}px, 0) rotateY(${angle * 57}deg) scaleX(${pointProgress * entryProgress})`,
                  opacity: 0.4,
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* ラベル */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 60,
          fontWeight: 700,
          color: C.white,
          opacity: entryProgress,
        }}
      >
        HELIX
      </div>
    </AbsoluteFill>
  );
};
