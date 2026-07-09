/**
 * LayoutGridBreak - グリッドブレイク - 規則性を崩す
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const LayoutGridBreak = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { x: 10, y: 15, w: 25, h: 35, color: C.accent, delay: 0 },
    { x: 40, y: 10, w: 20, h: 25, color: C.secondary, delay: 5 },
    { x: 65, y: 20, w: 30, h: 40, color: C.gray[800], delay: 10 },
    { x: 15, y: 55, w: 35, h: 30, color: C.tertiary, delay: 15 },
    { x: 55, y: 65, w: 25, h: 25, color: C.gray[700], delay: 20 },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* グリッドライン（かすかに見える） */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${C.gray[900]} 1px, transparent 1px),
            linear-gradient(90deg, ${C.gray[900]} 1px, transparent 1px)
          `,
          backgroundSize: "10% 10%",
          opacity: 0.3,
        }}
      />

      {/* ブロック要素 */}
      {items.map((item, i) => {
        const progress = spring({
          frame: frame - startDelay - item.delay,
          fps,
          config: { damping: 15, stiffness: 150 },
        });

        return (
          <div
            key={`grid-block-${i}`}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.w}%`,
              height: `${item.h}%`,
              background: item.color,
              transform: `scale(${progress})`,
              opacity: progress * 0.9,
            }}
          />
        );
      })}

      {/* オーバーレイテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 900,
          color: C.white,
          mixBlendMode: "difference",
          opacity: lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]),
        }}
      >
        BREAK
      </div>
    </AbsoluteFill>
  );
};
