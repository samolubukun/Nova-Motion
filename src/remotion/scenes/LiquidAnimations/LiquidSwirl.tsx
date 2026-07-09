/**
 * LiquidSwirl - 渦巻きスワール - 巨大な液体渦巻き
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LiquidSwirl = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const rotation = (frame - startDelay) * 4;

  // 複数の渦巻きレイヤー
  const swirlLayers = [
    { scale: 5, rotMult: 1, color: C.white, thickness: 80, spirals: 2.5, delay: 0 },
    { scale: 4.5, rotMult: -0.7, color: C.spotify, thickness: 60, spirals: 3, delay: 5 },
    { scale: 4, rotMult: 0.9, color: C.black, thickness: 100, spirals: 2, delay: 8 },
    { scale: 3.5, rotMult: -1.1, color: C.white, thickness: 50, spirals: 3.5, delay: 12 },
    { scale: 3, rotMult: 0.8, color: C.spotify, thickness: 40, spirals: 4, delay: 15 },
  ];

  // 有機的な渦巻きパス生成
  const generateSwirlPath = (spirals: number, seed: number, f: number) => {
    const points: string[] = [];
    const totalPoints = 60;

    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const angle = t * Math.PI * 2 * spirals;
      const baseRadius = 20 + t * 150;
      // 有機的な揺らぎを追加
      const noise = Math.sin(f * 0.05 + t * 10 + seed) * 15 + Math.cos(f * 0.03 + t * 8) * 10;
      const radius = baseRadius + noise;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      points.push(`${x},${y}`);
    }

    return `M ${points.join(" L ")}`;
  };

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 背景グロー */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: width * 1.5,
          height: height * 1.5,
          background: `radial-gradient(circle, ${C.spotify}40 0%, transparent 60%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 渦巻きレイヤー */}
      {swirlLayers.map((layer, idx) => {
        const layerProgress = spring({
          frame: frame - startDelay - layer.delay,
          fps,
          config: { damping: 10, stiffness: 35 },
        });

        const rot = rotation * layer.rotMult;

        return (
          <div
            key={`swirl-layer-${layer.color}-${layer.scale}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${layerProgress * layer.scale})`,
            }}
          >
            <svg width="600" height="600" viewBox="-300 -300 600 600" aria-hidden="true">
              <path
                d={generateSwirlPath(layer.spirals, idx * 50, frame - startDelay)}
                fill="none"
                stroke={layer.color}
                strokeWidth={layer.thickness}
                strokeLinecap="round"
                opacity={0.9}
              />
            </svg>
          </div>
        );
      })}

      {/* 飛び散る液滴 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = random(`swirl-drop-angle-${i}`) * Math.PI * 2;
        const dist = 150 + random(`swirl-drop-dist-${i}`) * 400;
        const size = 20 + random(`swirl-drop-size-${i}`) * 50;
        const delay = 10 + random(`swirl-drop-delay-${i}`) * 25;

        const dropProgress = spring({
          frame: frame - startDelay - delay,
          fps,
          config: { damping: 12, stiffness: 80 },
        });

        const orbitSpeed = (i % 2 === 0 ? 1 : -1) * 2;
        const currentAngle = angle + (frame - startDelay) * 0.03 * orbitSpeed;
        const x = Math.cos(currentAngle) * dist * dropProgress;
        const y = Math.sin(currentAngle) * dist * dropProgress;

        return (
          <div
            key={`swirl-drop-${i}-${size.toFixed(0)}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size * (1.2 + random(`swirl-elong-${i}`) * 0.8),
              background: [C.white, C.spotify][i % 2],
              borderRadius: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${currentAngle * 57}deg)`,
              opacity: dropProgress * 0.85,
            }}
          />
        );
      })}

      {/* 中央コア */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${lerp(frame, [startDelay + 20, startDelay + 40], [0, 1], EASE.overshoot)})`,
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            background: C.spotify,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 80px ${C.spotify}, 0 0 160px ${C.spotify}60`,
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 80,
              fontWeight: 900,
              color: C.black,
            }}
          >
            S
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
