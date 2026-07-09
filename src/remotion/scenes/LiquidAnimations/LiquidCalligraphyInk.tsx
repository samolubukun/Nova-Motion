/**
 * LiquidCalligraphyInk - 墨/書道風インク - ダイナミックな筆致と飛沫
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { EASE, lerp, font } from "../../common";
import { generateBlobPath } from "./shared/blobUtils";

export const LiquidCalligraphyInk = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 複数の筆致レイヤー
  const brushStrokes = [
    { scale: 4, rotation: -15, delay: 0, thickness: 1.5 },
    { scale: 3.5, rotation: 25, delay: 5, thickness: 1.2 },
    { scale: 3, rotation: -35, delay: 10, thickness: 1 },
    { scale: 2.5, rotation: 45, delay: 15, thickness: 0.8 },
  ];

  // ダイナミックな筆致パス生成
  const generateBrushStroke = (seed: number, progress: number) => {
    const points: string[] = [];
    const segments = 20;

    for (let i = 0; i <= segments * progress; i++) {
      const t = i / segments;
      const x = -200 + t * 400;
      // 有機的な揺れ
      const wave1 = Math.sin(t * 8 + seed) * 40;
      const wave2 = Math.cos(t * 5 + seed * 2) * 25;
      const y = wave1 + wave2;
      points.push(`${x},${y}`);
    }

    if (points.length < 2) return "";
    return `M ${points.join(" L ")}`;
  };

  // 飛沫
  const splatters = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: `ink-splat-${i}`,
      x: (random(`ink-x-${i}`) - 0.5) * width * 1.2,
      y: (random(`ink-y-${i}`) - 0.5) * height,
      size: random(`ink-sz-${i}`) * 60 + 10,
      delay: random(`ink-del-${i}`) * 40,
      rotation: random(`ink-rot-${i}`) * 360,
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ background: "#f5f0e8" }}>
      {/* 和紙テクスチャ */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.1,
        }}
      />

      {/* 背景の滲み */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: width * 1.5,
          height: height,
          background: `radial-gradient(ellipse, rgba(26,26,26,0.15) 0%, transparent 60%)`,
          transform: `translate(-50%, -50%) scale(${lerp(frame, [startDelay + 20, startDelay + 60], [0, 1])})`,
        }}
      />

      {/* 筆致レイヤー */}
      {brushStrokes.map((stroke, idx) => {
        const strokeProgress = spring({
          frame: frame - startDelay - stroke.delay,
          fps,
          config: { damping: 20, stiffness: 40 },
        });

        return (
          <div
            key={`brush-${idx}-${stroke.scale}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${stroke.rotation}deg) scale(${stroke.scale})`,
            }}
          >
            <svg width="600" height="200" viewBox="-300 -100 600 200" aria-hidden="true">
              <path
                d={generateBrushStroke(idx * 10, strokeProgress)}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth={60 * stroke.thickness}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.85}
              />
            </svg>
          </div>
        );
      })}

      {/* 飛沫 */}
      {splatters.map((splat) => {
        const splatProgress = spring({
          frame: frame - startDelay - splat.delay,
          fps,
          config: { damping: 15, stiffness: 100 },
        });

        return (
          <div
            key={splat.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${splat.x}px, ${splat.y}px) rotate(${splat.rotation}deg) scale(${splatProgress})`,
            }}
          >
            <svg width={splat.size * 3} height={splat.size * 3} viewBox="-50 -50 100 100" aria-hidden="true">
              <path
                d={generateBlobPath(`ink-blob-${splat.id}`, 6, 0.6, 30)}
                fill="#1a1a1a"
                opacity={splatProgress * 0.8}
              />
            </svg>
          </div>
        );
      })}

      {/* 中央の漢字 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${lerp(frame, [startDelay + 35, startDelay + 55], [0.5, 1], EASE.overshoot)})`,
          fontFamily: "serif",
          fontSize: 300,
          fontWeight: 900,
          color: "#1a1a1a",
          opacity: lerp(frame, [startDelay + 35, startDelay + 50], [0, 1]),
          textShadow: "0 0 60px rgba(26,26,26,0.3)",
        }}
      >
        墨
      </div>

      {/* 署名 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily: font,
          fontSize: 16,
          color: "#c41e3a",
          letterSpacing: 4,
          opacity: lerp(frame, [startDelay + 60, startDelay + 75], [0, 1]),
          padding: "8px 16px",
          border: "2px solid #c41e3a",
        }}
      >
        書道
      </div>
    </AbsoluteFill>
  );
};
