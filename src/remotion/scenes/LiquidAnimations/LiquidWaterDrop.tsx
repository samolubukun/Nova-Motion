/**
 * LiquidWaterDrop - 水滴リップルエフェクト - 巨大な波紋と水柱
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LiquidWaterDrop = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const dropFrame = startDelay + 15;
  const impactProgress = spring({
    frame: frame - dropFrame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // 大きな波紋
  const rippleCount = 8;
  const ripples = Array.from({ length: rippleCount }).map((_, i) => {
    const delay = i * 8;
    const localFrame = frame - dropFrame - delay;
    if (localFrame < 0) return null;
    const size = localFrame * 30;
    const opacity = Math.max(0, 1 - localFrame / 80);
    const thickness = 8 - i * 0.5;
    return { size, opacity, delay, thickness };
  });

  // 水柱スプラッシュ
  const splashColumns = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      height: 100 + random(`col-h-${i}`) * 200,
      width: 30 + random(`col-w-${i}`) * 40,
      delay: random(`col-d-${i}`) * 10,
      curve: random(`col-c-${i}`) * 0.5 + 0.3,
    }));
  }, []);

  // 飛び散る水滴
  const droplets = React.useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: `droplet-${i}`,
      angle: random(`drop-a-${i}`) * Math.PI * 2,
      distance: random(`drop-dist-${i}`) * 400 + 100,
      size: random(`drop-sz-${i}`) * 30 + 10,
      delay: random(`drop-del-${i}`) * 15,
      arcHeight: random(`drop-arc-${i}`) * 200 + 100,
    }));
  }, []);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)`,
      }}
    >
      {/* 水面反射 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "45%",
          background: `linear-gradient(180deg, ${C.cyan}30 0%, ${C.accent}50 100%)`,
          opacity: 0.6,
        }}
      />

      {/* 波紋 */}
      {ripples.map(
        (ripple, i) =>
          ripple && (
            <div
              key={`ripple-${i}-${ripple.delay}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "55%",
                width: ripple.size,
                height: ripple.size * 0.25,
                border: `${ripple.thickness}px solid ${C.white}`,
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                opacity: ripple.opacity,
                boxShadow: `0 0 20px ${C.cyan}60`,
              }}
            />
          )
      )}

      {/* 水柱 */}
      {splashColumns.map((col, i) => {
        const colProgress = spring({
          frame: frame - dropFrame - col.delay,
          fps,
          config: { damping: 12, stiffness: 150 },
        });

        const x = Math.cos(col.angle) * 100;
        const baseY = height * 0.55;
        const colHeight = col.height * colProgress * (1 - (frame - dropFrame - col.delay) / 60);

        if (colHeight < 10) return null;

        return (
          <div
            key={`col-${i}-${col.angle.toFixed(2)}`}
            style={{
              position: "absolute",
              left: width / 2 + x - col.width / 2,
              top: baseY - colHeight,
              width: col.width,
              height: Math.max(0, colHeight),
              background: `linear-gradient(180deg, ${C.white}90 0%, ${C.cyan}80 100%)`,
              borderRadius: `${col.width / 2}px ${col.width / 2}px 0 0`,
              opacity: 0.7,
            }}
          />
        );
      })}

      {/* 飛び散る水滴 */}
      {droplets.map((drop) => {
        const dropProgress = lerp(
          frame,
          [dropFrame + drop.delay, dropFrame + drop.delay + 40],
          [0, 1],
          EASE.out
        );

        if (dropProgress <= 0) return null;

        const x = Math.cos(drop.angle) * drop.distance * dropProgress;
        const arcY = -drop.arcHeight * Math.sin(dropProgress * Math.PI);
        const y = drop.distance * 0.3 * dropProgress + arcY;

        return (
          <div
            key={drop.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "55%",
              width: drop.size,
              height: drop.size * 1.5,
              background: `radial-gradient(ellipse, ${C.white} 0%, ${C.cyan} 100%)`,
              borderRadius: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              opacity: (1 - dropProgress) * 0.9,
              boxShadow: `0 0 10px ${C.cyan}`,
            }}
          />
        );
      })}

      {/* 中央インパクト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          width: 200 * impactProgress,
          height: 200 * impactProgress,
          background: `radial-gradient(circle, ${C.white} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          opacity: (1 - impactProgress) * 0.8,
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "25%",
          transform: `translate(-50%, -50%) scale(${lerp(frame, [dropFrame + 20, dropFrame + 40], [0, 1], EASE.overshoot)})`,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 800,
          color: C.white,
          textShadow: `0 0 40px ${C.cyan}, 0 0 80px ${C.accent}`,
        }}
      >
        SPLASH
      </div>
    </AbsoluteFill>
  );
};
