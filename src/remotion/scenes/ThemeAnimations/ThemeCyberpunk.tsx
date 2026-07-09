/**
 * ThemeCyberpunk - サイバーパンク - ネオン、グリッチ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, font } from "../../common";

export const ThemeCyberpunk = ({ startDelay: _startDelay = 0 }: {
  startDelay?: number;
}) => {
  void _startDelay; // 未使用警告を抑制
  const frame = useCurrentFrame();

  const glitchOffset = Math.sin(frame * 0.5) * 3;
  const neonPulse = 0.8 + Math.sin(frame * 0.2) * 0.2;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* グリッドライン */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(#ff00ff10 1px, transparent 1px),
            linear-gradient(90deg, #00ffff10 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          perspective: "500px",
          transform: "rotateX(60deg)",
          transformOrigin: "center 200%",
        }}
      />

      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "40%",
          transform: "translateY(-50%)",
        }}
      >
        {/* グリッチレイヤー */}
        <div
          style={{
            position: "absolute",
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: "#00ffff",
            opacity: 0.7,
            transform: `translateX(${glitchOffset}px)`,
            clipPath: "inset(0 0 50% 0)",
          }}
        >
          CYBER
        </div>
        <div
          style={{
            position: "absolute",
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: "#ff00ff",
            opacity: 0.7,
            transform: `translateX(${-glitchOffset}px)`,
            clipPath: "inset(50% 0 0 0)",
          }}
        >
          CYBER
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: C.white,
            textShadow: `
              0 0 10px #ff00ff,
              0 0 20px #ff00ff,
              0 0 40px #ff00ff
            `,
            opacity: neonPulse,
          }}
        >
          CYBER
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 100,
            fontWeight: 900,
            color: "#00ffff",
            textShadow: `
              0 0 10px #00ffff,
              0 0 20px #00ffff,
              0 0 40px #00ffff
            `,
            marginTop: -20,
            opacity: neonPulse,
          }}
        >
          PUNK
        </div>
      </div>

      {/* スキャンライン */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          )`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
