/**
 * Theme3DGlass - 3D Glass - 液体ガラス効果（透明感と流動性）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const Theme3DGlass = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ゆったりとした浮遊アニメーション
  const floatY = Math.sin((frame - startDelay) * 0.04) * 12;
  const floatX = Math.cos((frame - startDelay) * 0.03) * 5;

  const glassProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // よりゆるやかな回転
  const rotateX = 12 + Math.sin((frame - startDelay) * 0.025) * 4;
  const rotateY = -15 + Math.cos((frame - startDelay) * 0.02) * 6;

  // 液体的なうねり
  const wobble1 = Math.sin((frame - startDelay) * 0.06) * 3;
  const wobble2 = Math.cos((frame - startDelay) * 0.05) * 2;

  // カースティクス（水中の光）のアニメーション位置
  const causticOffset1 = ((frame - startDelay) * 0.8) % 400;
  const causticOffset2 = ((frame - startDelay) * 0.6 + 200) % 400;

  // ガラスのサイズ
  const cardWidth = 420;
  const cardHeight = 300;
  const borderRadius = 40; // より丸みを帯びた形状

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        overflow: "hidden",
      }}
    >
      {/* 背景のオーブ（ガラス越しに見える） */}
      <div
        style={{
          position: "absolute",
          left: "15%",
          top: "25%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "5%",
          bottom: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 150, 220, 0.5) 0%, rgba(255, 100, 200, 0.2) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* メインの液体ガラス */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          perspective: 1500,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            transform: `
              translate(-50%, -50%)
              translateY(${floatY}px)
              translateX(${floatX}px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              scale(${glassProgress})
            `,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ===== 液体ガラス本体 ===== */}
          <div
            style={{
              position: "relative",
              width: cardWidth,
              height: cardHeight,
              transformStyle: "preserve-3d",
            }}
          >
            {/* 影（地面に落ちる） */}
            <div
              style={{
                position: "absolute",
                width: cardWidth * 0.9,
                height: 40,
                left: "5%",
                bottom: -80,
                background: "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
                filter: "blur(20px)",
                transform: "rotateX(90deg)",
              }}
            />

            {/* 背面の屈折レイヤー（ガラスの奥行き感） */}
            <div
              style={{
                position: "absolute",
                width: cardWidth,
                height: cardHeight,
                borderRadius,
                background: `
                  linear-gradient(
                    ${135 + wobble1 * 3}deg,
                    rgba(255, 255, 255, 0.05) 0%,
                    rgba(200, 180, 255, 0.1) 50%,
                    rgba(255, 200, 230, 0.08) 100%
                  )
                `,
                transform: "translateZ(-20px)",
                filter: "blur(2px)",
              }}
            />

            {/* メインのガラス面 */}
            <div
              style={{
                position: "absolute",
                width: cardWidth,
                height: cardHeight,
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderRadius,
                border: "1.5px solid rgba(255, 255, 255, 0.25)",
                boxShadow: `
                  0 25px 50px rgba(0, 0, 0, 0.15),
                  0 10px 20px rgba(0, 0, 0, 0.1),
                  inset 0 1px 1px rgba(255, 255, 255, 0.4),
                  inset 0 -1px 1px rgba(255, 255, 255, 0.1)
                `,
                overflow: "hidden",
              }}
            >
              {/* 内部の屈折グラデーション（液体感） */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    linear-gradient(
                      ${160 + wobble2 * 5}deg,
                      transparent 0%,
                      rgba(255, 255, 255, 0.12) 30%,
                      rgba(200, 220, 255, 0.08) 50%,
                      rgba(255, 200, 255, 0.1) 70%,
                      transparent 100%
                    )
                  `,
                  borderRadius,
                }}
              />

              {/* カースティクス効果1（水中の光の揺らめき） */}
              <div
                style={{
                  position: "absolute",
                  top: causticOffset1 - 200,
                  left: causticOffset1 * 0.5 - 100,
                  width: 300,
                  height: 300,
                  background: `
                    radial-gradient(ellipse at center,
                      rgba(255, 255, 255, 0.15) 0%,
                      rgba(255, 255, 255, 0.08) 30%,
                      transparent 60%
                    )
                  `,
                  filter: "blur(20px)",
                  opacity: 0.7,
                  pointerEvents: "none",
                }}
              />

              {/* カースティクス効果2 */}
              <div
                style={{
                  position: "absolute",
                  top: causticOffset2 - 150,
                  right: causticOffset2 * 0.3 - 50,
                  width: 250,
                  height: 250,
                  background: `
                    radial-gradient(ellipse at center,
                      rgba(200, 230, 255, 0.12) 0%,
                      rgba(255, 200, 255, 0.06) 40%,
                      transparent 70%
                    )
                  `,
                  filter: "blur(25px)",
                  opacity: 0.6,
                  pointerEvents: "none",
                }}
              />

              {/* 上部のスペキュラーハイライト（曲面反射） */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "45%",
                  background: `
                    linear-gradient(
                      180deg,
                      rgba(255, 255, 255, 0.35) 0%,
                      rgba(255, 255, 255, 0.15) 30%,
                      rgba(255, 255, 255, 0.05) 60%,
                      transparent 100%
                    )
                  `,
                  borderRadius: `${borderRadius}px ${borderRadius}px 50% 50%`,
                  pointerEvents: "none",
                }}
              />

              {/* 虹色のエッジ（色収差/プリズム効果） */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius,
                  background: `
                    linear-gradient(
                      ${120 + wobble1 * 2}deg,
                      rgba(255, 100, 100, 0.08) 0%,
                      rgba(255, 200, 100, 0.06) 15%,
                      transparent 30%,
                      transparent 70%,
                      rgba(100, 200, 255, 0.08) 85%,
                      rgba(200, 100, 255, 0.06) 100%
                    )
                  `,
                  pointerEvents: "none",
                }}
              />

              {/* コンテンツ */}
              <div style={{ padding: 45, position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.75)",
                    letterSpacing: 4,
                    marginBottom: 18,
                    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  PREMIUM
                </div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 52,
                    fontWeight: 700,
                    color: C.white,
                    lineHeight: 1.15,
                    textShadow: `
                      0 4px 20px rgba(0,0,0,0.25),
                      0 2px 4px rgba(0,0,0,0.15)
                    `,
                  }}
                >
                  Glass
                  <br />
                  Morphism
                </div>
              </div>
            </div>

            {/* 前面のハイライトエッジ */}
            <div
              style={{
                position: "absolute",
                top: 2,
                left: borderRadius,
                right: borderRadius,
                height: 1,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 80%, transparent 100%)",
                borderRadius: 1,
                transform: "translateZ(1px)",
              }}
            />

            {/* 左エッジの虹色ハイライト */}
            <div
              style={{
                position: "absolute",
                top: borderRadius,
                left: 2,
                width: 2,
                height: cardHeight - borderRadius * 2,
                background: `
                  linear-gradient(
                    180deg,
                    rgba(255, 150, 150, 0.4) 0%,
                    rgba(255, 255, 150, 0.3) 25%,
                    rgba(150, 255, 200, 0.3) 50%,
                    rgba(150, 200, 255, 0.3) 75%,
                    rgba(200, 150, 255, 0.4) 100%
                  )
                `,
                filter: "blur(1px)",
                transform: "translateZ(1px)",
              }}
            />
          </div>
        </div>

        {/* 浮遊する液体ガラス球（大） */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -280,
            width: 90,
            height: 90,
            transformStyle: "preserve-3d",
            transform: `
              translateY(${floatY * 1.3 + wobble1 * 2}px)
              translateX(${wobble2 * 3}px)
              rotateX(${rotateX * 0.5}deg)
              rotateY(${rotateY * 0.5}deg)
              scale(${glassProgress})
            `,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `
                radial-gradient(
                  ellipse at 30% 25%,
                  rgba(255, 255, 255, 0.5) 0%,
                  rgba(255, 255, 255, 0.2) 20%,
                  rgba(200, 220, 255, 0.15) 40%,
                  rgba(255, 200, 255, 0.1) 60%,
                  rgba(150, 180, 220, 0.15) 100%
                )
              `,
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: `
                0 15px 35px rgba(0, 0, 0, 0.15),
                inset -15px -15px 30px rgba(0, 0, 0, 0.05),
                inset 8px 8px 20px rgba(255, 255, 255, 0.3)
              `,
            }}
          />
          {/* スペキュラー */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "18%",
              width: "35%",
              height: "25%",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.7)",
              filter: "blur(4px)",
            }}
          />
          {/* 底部の反射 */}
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "20%",
              width: "20%",
              height: "12%",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.25)",
              filter: "blur(3px)",
            }}
          />
        </div>

        {/* 浮遊する液体ガラス球（小） */}
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: -280,
            width: 55,
            height: 55,
            transformStyle: "preserve-3d",
            transform: `
              translateY(${floatY * -1.5 + wobble2 * 2}px)
              translateX(${wobble1 * -2}px)
              rotateX(${rotateX * 0.3}deg)
              rotateY(${rotateY * 0.3}deg)
              scale(${glassProgress})
            `,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `
                radial-gradient(
                  ellipse at 30% 25%,
                  rgba(255, 255, 255, 0.45) 0%,
                  rgba(255, 255, 255, 0.15) 25%,
                  rgba(220, 200, 255, 0.12) 50%,
                  rgba(180, 200, 240, 0.1) 100%
                )
              `,
              backdropFilter: "blur(10px) saturate(140%)",
              WebkitBackdropFilter: "blur(10px) saturate(140%)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: `
                0 10px 25px rgba(0, 0, 0, 0.12),
                inset -8px -8px 20px rgba(0, 0, 0, 0.04),
                inset 5px 5px 12px rgba(255, 255, 255, 0.25)
              `,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "20%",
              width: "30%",
              height: "20%",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.6)",
              filter: "blur(3px)",
            }}
          />
        </div>

        {/* 小さな気泡（浮遊） */}
        {[
          { id: "bubble-a", offset: 0, left: 50, sizeAdd: 0 },
          { id: "bubble-b", offset: 30, left: 120, sizeAdd: 3 },
          { id: "bubble-c", offset: 60, left: 190, sizeAdd: 6 },
          { id: "bubble-d", offset: 90, left: 260, sizeAdd: 9 },
          { id: "bubble-e", offset: 120, left: 330, sizeAdd: 12 },
        ].map((bubble) => {
          const bubbleFrame = (frame - startDelay + bubble.offset) % 150;
          const bubbleY = 150 - bubbleFrame * 1.5;
          const bubbleX = Math.sin(bubbleFrame * 0.1 + bubble.offset / 30) * 20;
          const bubbleSize = 8 + bubble.sizeAdd;
          const bubbleOpacity = Math.min(1, (150 - bubbleFrame) / 50) * glassProgress;

          return (
            <div
              key={bubble.id}
              style={{
                position: "absolute",
                left: bubble.left,
                top: bubbleY,
                width: bubbleSize,
                height: bubbleSize,
                borderRadius: "50%",
                background: `
                  radial-gradient(
                    ellipse at 30% 30%,
                    rgba(255, 255, 255, 0.6) 0%,
                    rgba(255, 255, 255, 0.2) 50%,
                    transparent 100%
                  )
                `,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                transform: `translateX(${bubbleX}px)`,
                opacity: bubbleOpacity,
              }}
            />
          );
        })}
      </div>

      {/* ラベル */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          fontFamily: font,
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.6)",
          letterSpacing: 2,
          opacity: glassProgress,
        }}
      >
        3D GLASS EFFECT
      </div>
    </AbsoluteFill>
  );
};
