/**
 * LiquidPaintDrip - ペイントドリップ - 画面を覆うカラフルなペイント
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LiquidPaintDrip = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 大きなドリップ（画面全体をカバー）
  const drips = React.useMemo(() => {
    const colors = [C.accent, C.secondary, C.tertiary, C.orange, C.cyan, C.spotify];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `drip-${i}`,
      x: (i / 14) * width,
      width: 80 + random(`drip-w-${i}`) * 100,
      delay: random(`drip-delay-${i}`) * 25,
      color: colors[i % colors.length],
      wobbleSpeed: random(`drip-wobble-${i}`) * 2 + 1,
      wobbleAmp: random(`drip-wobble-amp-${i}`) * 20 + 10,
    }));
  }, [width]);

  // スプラッシュ（下に落ちた時）
  const splashes = React.useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: `splash-${i}`,
      x: random(`splash-x-${i}`) * width,
      size: random(`splash-sz-${i}`) * 60 + 30,
      delay: 30 + random(`splash-del-${i}`) * 40,
      color: [C.accent, C.secondary, C.tertiary, C.orange, C.cyan][i % 5],
    }));
  }, [width]);

  // 上部のペイント溜まり
  const paintPools = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `pool-${i}`,
      x: (i / 7) * width,
      width: 150 + random(`pool-w-${i}`) * 100,
      color: [C.accent, C.secondary, C.tertiary, C.orange][i % 4],
      delay: random(`pool-del-${i}`) * 10,
    }));
  }, [width]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 上部のペイント溜まり */}
      {paintPools.map((pool) => {
        const poolProgress = spring({
          frame: frame - startDelay - pool.delay,
          fps,
          config: { damping: 15, stiffness: 60 },
        });

        return (
          <div
            key={pool.id}
            style={{
              position: "absolute",
              left: pool.x - pool.width / 2,
              top: -40,
              width: pool.width,
              height: 120 * poolProgress,
              background: pool.color,
              borderRadius: "0 0 50% 50%",
              opacity: poolProgress,
            }}
          />
        );
      })}

      {/* メインドリップ */}
      {drips.map((drip) => {
        const dripProgress = spring({
          frame: frame - startDelay - drip.delay,
          fps,
          config: { damping: 8, stiffness: 30 },
        });

        const wobble = Math.sin((frame - startDelay) * 0.1 * drip.wobbleSpeed) * drip.wobbleAmp;
        const dripLength = dripProgress * height * 1.2;
        const bulgeSize = drip.width * 1.5;

        return (
          <React.Fragment key={drip.id}>
            {/* メインドリップ */}
            <div
              style={{
                position: "absolute",
                left: drip.x - drip.width / 2 + wobble,
                top: 0,
                width: drip.width,
                height: Math.min(dripLength, height + 100),
                background: `linear-gradient(180deg, ${drip.color} 0%, ${drip.color}dd 100%)`,
                borderRadius: `0 0 ${drip.width / 2}px ${drip.width / 2}px`,
                boxShadow: `0 0 30px ${drip.color}60`,
              }}
            />

            {/* 先端の膨らみ */}
            {dripProgress > 0.2 && dripLength < height && (
              <div
                style={{
                  position: "absolute",
                  left: drip.x - bulgeSize / 2 + wobble,
                  top: Math.min(dripLength - bulgeSize / 2, height - bulgeSize),
                  width: bulgeSize,
                  height: bulgeSize * 1.3,
                  background: drip.color,
                  borderRadius: "50%",
                  boxShadow: `0 10px 40px ${drip.color}80`,
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* 下部のスプラッシュ */}
      {splashes.map((splash) => {
        const splashProgress = spring({
          frame: frame - startDelay - splash.delay,
          fps,
          config: { damping: 12, stiffness: 80 },
        });

        return (
          <div
            key={splash.id}
            style={{
              position: "absolute",
              left: splash.x - splash.size / 2,
              bottom: 0,
              width: splash.size,
              height: splash.size * 0.6 * splashProgress,
              background: splash.color,
              borderRadius: "50% 50% 0 0",
              opacity: splashProgress * 0.8,
            }}
          />
        );
      })}

      {/* 下部のペイント溜まり */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: lerp(frame, [startDelay + 40, startDelay + 70], [0, 150]),
          background: `linear-gradient(90deg, ${C.accent}, ${C.secondary}, ${C.tertiary}, ${C.orange}, ${C.cyan}, ${C.accent})`,
          opacity: 0.9,
        }}
      />

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${lerp(frame, [startDelay + 30, startDelay + 50], [0, 1], EASE.overshoot)})`,
          fontFamily: font,
          fontSize: 150,
          fontWeight: 900,
          color: C.white,
          textShadow: `0 0 60px ${C.accent}, 0 0 120px ${C.secondary}`,
          mixBlendMode: "difference",
        }}
      >
        DRIP
      </div>
    </AbsoluteFill>
  );
};
