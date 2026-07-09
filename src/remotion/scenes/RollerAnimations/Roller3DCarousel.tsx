/**
 * Roller3DCarousel - 3Dカルーセル - 円筒状に回転するテキスト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { C, font } from "../../common";

export const Roller3DCarousel = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Innovation", "Creation", "Evolution", "Revolution", "Transformation", "INSPIRATION"];
  const t = frame - startDelay;
  const finalIndex = words.length - 1;

  // 回転角度の計算
  const anglePerItem = 360 / words.length;
  const duration = 90;
  const progress = Math.min(t / duration, 1);

  // カスタムイージング：ゆっくり→高速→最後はゆっくり
  const carouselEasing = (x: number): number => {
    if (x < 0.2) {
      return 0.1 * Easing.in(Easing.quad)(x / 0.2);
    } else if (x < 0.7) {
      return 0.1 + 0.7 * ((x - 0.2) / 0.5);
    } else {
      return 0.8 + 0.2 * Easing.out(Easing.cubic)((x - 0.7) / 0.3);
    }
  };

  const easedProgress = carouselEasing(progress);
  const totalRotation = finalIndex * anglePerItem;
  let rotation = easedProgress * totalRotation;

  // 最終停止のバウンス
  const isStopping = t >= duration - 10;
  if (isStopping) {
    const bounceSpring = spring({
      frame: t - (duration - 10),
      fps,
      config: { damping: 12, stiffness: 200 },
    });
    rotation = totalRotation - (totalRotation - rotation) * (1 - bounceSpring);
  }

  const radius = 250;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          perspective: "1000px",
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${-rotation}deg)`,
            width: 600,
            height: 100,
            position: "relative",
          }}
        >
          {words.map((word, i) => {
            const itemAngle = i * anglePerItem;
            const isActive = Math.abs((rotation % 360) - itemAngle) < anglePerItem / 2 ||
                           Math.abs((rotation % 360) - itemAngle - 360) < anglePerItem / 2;
            const isFinal = i === finalIndex && t >= duration;

            return (
              <div
                key={`carousel-${word}`}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: font,
                  fontSize: isFinal ? 72 : 56,
                  fontWeight: isFinal ? 900 : 600,
                  color: isFinal ? C.warning : isActive ? C.white : C.gray[600],
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  textShadow: isFinal ? `0 0 30px ${C.warning}99` : "none",
                }}
              >
                {word}
              </div>
            );
          })}
        </div>
      </div>

      {/* ラベル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 80,
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 14,
          color: C.gray[600],
          letterSpacing: 3,
        }}
      >
        3D CAROUSEL
      </div>
    </AbsoluteFill>
  );
};
