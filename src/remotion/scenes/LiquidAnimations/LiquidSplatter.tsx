/**
 * LiquidSplatter - スプラッターエフェクト - 画面を覆う大胆なスプラッシュ
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { generateBlobPath } from "./shared/blobUtils";

export const LiquidSplatter = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const impactFrame = startDelay + 10;

  // 大きなスプラッシュブロブ（画面を覆うサイズ）
  const mainSplashes = [
    { scale: 6, rotation: 0, color: C.secondary, delay: 0, points: 12 },
    { scale: 5.5, rotation: 45, color: C.accent, delay: 2, points: 10 },
    { scale: 5, rotation: -30, color: C.orange, delay: 4, points: 14 },
    { scale: 4.5, rotation: 60, color: C.tertiary, delay: 6, points: 8 },
    { scale: 4, rotation: -15, color: C.white, delay: 8, points: 11 },
  ];

  // 飛び散る小さなスプラッター
  const splatters = React.useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: `splat-${i}`,
      angle: random(`splat-angle-${i}`) * Math.PI * 2,
      distance: random(`splat-dist-${i}`) * 600 + 200,
      size: random(`splat-size-${i}`) * 80 + 30,
      delay: random(`splat-delay-${i}`) * 15,
      color: [C.accent, C.secondary, C.tertiary, C.orange, C.white][i % 5],
      elongation: random(`splat-elong-${i}`) * 3 + 1,
      rotSpeed: (random(`splat-rot-${i}`) - 0.5) * 10,
    }));
  }, []);

  // トレイル（飛沫の尾）
  const trails = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `trail-${i}`,
      startAngle: random(`trail-start-${i}`) * Math.PI * 2,
      length: random(`trail-len-${i}`) * 400 + 300,
      width: random(`trail-width-${i}`) * 40 + 20,
      color: [C.accent, C.secondary, C.orange][i % 3],
      delay: random(`trail-delay-${i}`) * 10,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 背景グラデーション */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${C.gray[900]} 0%, ${C.black} 70%)`,
        }}
      />

      {/* インパクトフラッシュ */}
      {frame >= impactFrame && frame < impactFrame + 8 && (
        <AbsoluteFill
          style={{
            background: C.white,
            opacity: lerp(frame, [impactFrame, impactFrame + 8], [1, 0]),
          }}
        />
      )}

      {/* トレイル（飛沫の筋） */}
      {trails.map((trail) => {
        const trailProgress = spring({
          frame: frame - impactFrame - trail.delay,
          fps,
          config: { damping: 20, stiffness: 100 },
        });

        const startX = width / 2;
        const startY = height / 2;

        return (
          <div
            key={trail.id}
            style={{
              position: "absolute",
              left: startX,
              top: startY,
              width: trail.length * trailProgress,
              height: trail.width,
              background: `linear-gradient(90deg, ${trail.color}, ${trail.color}00)`,
              transform: `rotate(${(trail.startAngle * 180) / Math.PI}deg)`,
              transformOrigin: "left center",
              borderRadius: trail.width / 2,
              opacity: trailProgress * 0.7,
            }}
          />
        );
      })}

      {/* メインスプラッシュブロブ */}
      {mainSplashes.map((splash, idx) => {
        const splashProgress = spring({
          frame: frame - impactFrame - splash.delay,
          fps,
          config: { damping: 12, stiffness: 60 },
        });

        return (
          <div
            key={`main-splash-${splash.color}-${splash.scale}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${splash.rotation}deg) scale(${splashProgress * splash.scale})`,
            }}
          >
            <svg width="300" height="300" viewBox="-150 -150 300 300" aria-hidden="true">
              <path
                d={generateBlobPath(`main-splat-${idx}`, splash.points, 0.5, 100)}
                fill={splash.color}
                opacity={0.85}
              />
            </svg>
          </div>
        );
      })}

      {/* 飛び散るスプラッター */}
      {splatters.map((splat) => {
        const splatProgress = spring({
          frame: frame - impactFrame - splat.delay,
          fps,
          config: { damping: 15, stiffness: 120 },
        });

        const x = Math.cos(splat.angle) * splat.distance * splatProgress;
        const y = Math.sin(splat.angle) * splat.distance * splatProgress;
        const rotation = (frame - impactFrame) * splat.rotSpeed;

        return (
          <div
            key={splat.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
            }}
          >
            <svg
              width={splat.size * 2}
              height={splat.size * splat.elongation * 2}
              viewBox={`-${splat.size} -${splat.size * splat.elongation} ${splat.size * 2} ${splat.size * splat.elongation * 2}`}
              aria-hidden="true"
            >
              <ellipse
                cx="0"
                cy="0"
                rx={splat.size * splatProgress}
                ry={splat.size * splat.elongation * splatProgress}
                fill={splat.color}
                opacity={splatProgress * 0.9}
              />
            </svg>
          </div>
        );
      })}

      {/* 中央テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${lerp(frame, [impactFrame + 15, impactFrame + 35], [0, 1], EASE.overshoot)})`,
          fontFamily: font,
          fontSize: 120,
          fontWeight: 900,
          color: C.white,
          textShadow: `0 0 40px ${C.accent}, 0 0 80px ${C.secondary}`,
        }}
      >
        SPLAT!
      </div>
    </AbsoluteFill>
  );
};
