/**
 * ThemeY2K - Y2K / Millennium - 2000年代初頭のグロッシー&メタリック
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { font } from "../../common";

export const ThemeY2K = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // キラキラの回転
  const sparkleRotate = (frame - startDelay) * 2;
  // グラデーションのアニメーション
  const gradientShift = (frame - startDelay) * 3;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ee9ca7 100%)",
        overflow: "hidden",
      }}
    >
      {/* メタリックな背景オーブ */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 182, 193, 0.4) 50%, transparent 70%)",
          filter: "blur(60px)",
          opacity: mainProgress,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "15%",
          bottom: "25%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(173, 216, 230, 0.7) 0%, rgba(192, 192, 255, 0.3) 50%, transparent 70%)",
          filter: "blur(50px)",
          opacity: mainProgress,
        }}
      />

      {/* キラキラ星 */}
      {[
        { x: 15, y: 20, size: 30, delay: 0 },
        { x: 75, y: 15, size: 25, delay: 10 },
        { x: 85, y: 60, size: 35, delay: 5 },
        { x: 10, y: 70, size: 28, delay: 15 },
        { x: 50, y: 80, size: 22, delay: 8 },
        { x: 30, y: 40, size: 20, delay: 12 },
        { x: 70, y: 35, size: 24, delay: 3 },
      ].map((star, i) => {
        const starProgress = spring({
          frame: frame - startDelay - star.delay,
          fps,
          config: { damping: 12, stiffness: 150 },
        });
        const twinkle = 0.5 + Math.sin((frame - startDelay + i * 20) * 0.15) * 0.5;
        return (
          <div
            key={`y2k-star-${i}`}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              transform: `rotate(${sparkleRotate + i * 45}deg) scale(${starProgress})`,
              opacity: twinkle * starProgress,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id={`y2kStarGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#ffd1dc" />
                  <stop offset="100%" stopColor="#c0c0ff" />
                </linearGradient>
              </defs>
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill={`url(#y2kStarGrad-${i})`}
              />
            </svg>
          </div>
        );
      })}

      {/* メインのグロッシーカード */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${mainProgress})`,
          width: 500,
          height: 280,
          borderRadius: 40,
          background: `linear-gradient(${135 + gradientShift * 0.5}deg, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(255, 182, 193, 0.7) 25%,
            rgba(192, 192, 255, 0.7) 50%,
            rgba(173, 216, 230, 0.7) 75%,
            rgba(255, 255, 255, 0.9) 100%)`,
          boxShadow: `
            0 20px 60px rgba(255, 105, 180, 0.3),
            0 10px 30px rgba(192, 192, 255, 0.2),
            inset 0 2px 0 rgba(255, 255, 255, 0.8),
            inset 0 -2px 0 rgba(0, 0, 0, 0.05)
          `,
          border: "2px solid rgba(255, 255, 255, 0.6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }}
      >
        {/* グロッシーハイライト */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            borderRadius: "40px 40px 100px 100px",
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            fontFamily: font,
            fontSize: 56,
            fontWeight: 800,
            background: `linear-gradient(${90 + gradientShift}deg, #ff69b4, #9370db, #00bfff, #ff69b4)`,
            backgroundSize: "200% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 10px rgba(255, 105, 180, 0.3)",
            letterSpacing: -2,
          }}
        >
          Y2K VIBES
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 18,
            color: "#9370db",
            letterSpacing: 6,
            marginTop: 12,
            opacity: 0.8,
          }}
        >
          MILLENNIUM AESTHETIC
        </div>
      </div>

      {/* バブル装飾 */}
      {[
        { x: 8, y: 30, size: 80 },
        { x: 82, y: 25, size: 60 },
        { x: 5, y: 65, size: 50 },
        { x: 88, y: 70, size: 70 },
      ].map((bubble, i) => {
        const bubbleProgress = spring({
          frame: frame - startDelay - i * 8,
          fps,
          config: { damping: 20, stiffness: 80 },
        });
        const floatY = Math.sin((frame - startDelay + i * 30) * 0.05) * 10;
        return (
          <div
            key={`y2k-bubble-${i}`}
            style={{
              position: "absolute",
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(255, 182, 193, 0.4) 40%, 
                rgba(192, 192, 255, 0.2) 70%, 
                transparent 100%)`,
              border: "1px solid rgba(255, 255, 255, 0.5)",
              transform: `translateY(${floatY}px) scale(${bubbleProgress})`,
              opacity: bubbleProgress * 0.7,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
