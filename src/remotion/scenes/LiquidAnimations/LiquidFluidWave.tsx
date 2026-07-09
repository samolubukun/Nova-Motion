/**
 * LiquidFluidWave - 流体ウェーブ - 画面を覆う巨大な波
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LiquidFluidWave = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const waveOffset = (frame - startDelay) * 4;

  // 複雑な波パス生成
  const generateComplexWave = (
    yBase: number,
    amplitude: number,
    frequency: number,
    phase: number,
    noiseStrength: number = 0.3
  ) => {
    const points: string[] = [];
    const steps = 80;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const t = (waveOffset + phase) * 0.05;
      const y =
        yBase +
        Math.sin((x * frequency) / 100 + t) * amplitude +
        Math.sin((x * frequency * 1.5) / 100 + t * 1.3) * (amplitude * 0.4) +
        Math.cos((x * frequency * 0.7) / 100 + t * 0.8) * (amplitude * noiseStrength);
      points.push(`${x},${y}`);
    }

    return `M 0 ${height} L ${points.join(" L ")} L ${width} ${height} Z`;
  };

  // 波レイヤー
  const waveLayers = [
    { yBase: 0.4, amp: 150, freq: 1.5, phase: 0, color: C.accent, opacity: 0.15, delay: 0 },
    { yBase: 0.45, amp: 120, freq: 2, phase: 50, color: C.secondary, opacity: 0.2, delay: 3 },
    { yBase: 0.5, amp: 100, freq: 2.5, phase: 100, color: C.tertiary, opacity: 0.3, delay: 6 },
    { yBase: 0.55, amp: 80, freq: 3, phase: 150, color: C.accent, opacity: 0.4, delay: 9 },
    { yBase: 0.6, amp: 60, freq: 3.5, phase: 200, color: C.secondary, opacity: 0.5, delay: 12 },
    { yBase: 0.65, amp: 50, freq: 4, phase: 250, color: C.white, opacity: 0.6, delay: 15 },
    { yBase: 0.7, amp: 40, freq: 4.5, phase: 300, color: C.cyan, opacity: 0.8, delay: 18 },
  ];

  // 飛沫
  const splashes = React.useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: `wave-splash-${i}`,
      x: random(`ws-x-${i}`) * width,
      baseY: height * (0.5 + random(`ws-y-${i}`) * 0.3),
      size: random(`ws-sz-${i}`) * 40 + 15,
      speed: random(`ws-sp-${i}`) * 2 + 1,
      delay: random(`ws-del-${i}`) * 20,
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%)` }}>
      {/* 背景グロー */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: width * 2,
          height: height,
          background: `radial-gradient(ellipse at 50% 100%, ${C.accent}40 0%, transparent 60%)`,
          transform: "translateX(-50%)",
        }}
      />

      {/* 波レイヤー */}
      {waveLayers.map((wave, idx) => {
        const waveProgress = spring({
          frame: frame - startDelay - wave.delay,
          fps,
          config: { damping: 15, stiffness: 40 },
        });

        return (
          <svg
            key={`wave-${idx}-${wave.color}`}
            width={width}
            height={height}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translateY(${(1 - waveProgress) * 200}px)`,
            }}
            aria-hidden="true"
          >
            <path
              d={generateComplexWave(height * wave.yBase, wave.amp, wave.freq, wave.phase)}
              fill={wave.color}
              opacity={wave.opacity * waveProgress}
            />
          </svg>
        );
      })}

      {/* 飛沫 */}
      {splashes.map((splash) => {
        const splashProgress = spring({
          frame: frame - startDelay - splash.delay,
          fps,
          config: { damping: 12, stiffness: 80 },
        });

        const floatY = Math.sin((frame - startDelay) * 0.1 * splash.speed) * 30;

        return (
          <div
            key={splash.id}
            style={{
              position: "absolute",
              left: splash.x,
              top: splash.baseY + floatY,
              width: splash.size,
              height: splash.size,
              background: C.white,
              borderRadius: "50%",
              opacity: splashProgress * 0.6,
              boxShadow: `0 0 20px ${C.cyan}`,
              transform: `scale(${splashProgress})`,
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "20%",
          transform: `translate(-50%, -50%) scale(${lerp(frame, [startDelay + 20, startDelay + 40], [0, 1], EASE.overshoot)})`,
          fontFamily: font,
          fontSize: 120,
          fontWeight: 900,
          color: C.white,
          textShadow: `0 0 60px ${C.accent}, 0 0 120px ${C.secondary}`,
        }}
      >
        WAVE
      </div>
    </AbsoluteFill>
  );
};
