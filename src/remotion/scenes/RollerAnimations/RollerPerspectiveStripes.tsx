/**
 * RollerPerspectiveStripes - パースペクティブストライプ - 斜めに流れるテキスト帯
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const RollerPerspectiveStripes = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const phrases = [
    { text: "Create your", color: C.white },
    { text: "own video", color: C.success },
  ];

  const t = frame - startDelay;
  const stripeCount = 9;
  const stripeHeight = 80;

  // 全体の流れる速度
  const scrollSpeed = 3;
  const scrollOffset = t * scrollSpeed;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* パースペクティブコンテナ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "200%",
          height: "150%",
          transform: "translate(-50%, -50%) perspective(800px) rotateX(45deg) rotateZ(-15deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].slice(0, stripeCount).map((stripeIdx) => {
          // 各ストライプの位置（無限ループ）
          const baseY = stripeIdx * stripeHeight * 2 - scrollOffset;
          const wrappedY = ((baseY % (stripeCount * stripeHeight * 2)) + stripeCount * stripeHeight * 2) % (stripeCount * stripeHeight * 2);
          const y = wrappedY - stripeHeight * 2;

          // 交互にフレーズを切り替え
          const phraseIndex = stripeIdx % 2;
          const phrase = phrases[phraseIndex];

          // 横スクロール（各行で異なる速度）
          const xSpeed = 2 + (stripeIdx % 3);
          const xOffset = (t * xSpeed + stripeIdx * 100) % 2000 - 1000;

          // 奥行きに応じた不透明度
          const depthOpacity = lerp(wrappedY, [0, stripeCount * stripeHeight], [0.3, 1]);

          return (
            <div
              key={`stripe-row-${stripeIdx}`}
              style={{
                position: "absolute",
                top: y,
                left: 0,
                right: 0,
                height: stripeHeight,
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                transform: `translateX(${xOffset}px)`,
                opacity: depthOpacity,
              }}
            >
              {/* テキストを繰り返し表示 */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((repeatIdx) => (
                <span
                  key={`text-${stripeIdx}-repeat-${repeatIdx}`}
                  style={{
                    fontFamily: font,
                    fontSize: 36,
                    fontWeight: 700,
                    color: phrase.color,
                    marginRight: 60,
                  }}
                >
                  {phrase.text}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* 中央のハイライト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 64,
            fontWeight: 800,
            color: C.white,
            textShadow: "0 0 40px rgba(0,0,0,0.8)",
            opacity: lerp(t, [20, 40], [0, 1]),
          }}
        >
          Create your
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 64,
            fontWeight: 800,
            color: C.success,
            textShadow: "0 0 40px rgba(0,0,0,0.8)",
            opacity: lerp(t, [30, 50], [0, 1]),
          }}
        >
          own video
        </div>
      </div>
    </AbsoluteFill>
  );
};
