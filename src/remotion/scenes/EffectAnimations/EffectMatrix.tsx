/**
 * EffectMatrix - マトリックス風
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { lerp, font } from "../../common";

export const EffectMatrix = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const columnCount = 30;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  const columns = React.useMemo(() => {
    return Array.from({ length: columnCount }).map((_, i) => ({
      x: (i / columnCount) * 100,
      speed: random(`matrix-speed-${i}`) * 3 + 2,
      offset: random(`matrix-offset-${i}`) * 100,
      chars: Array.from({ length: 20 }).map((_, j) => ({
        char: chars[Math.floor(random(`matrix-char-${i}-${j}`) * chars.length)],
        opacity: 1 - j * 0.05,
      })),
    }));
  }, []);

  const textOpacity = lerp(frame, [startDelay + 30, startDelay + 50], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "#001100" }}>
      {/* マトリックスレイン */}
      {columns.map((col, colIndex) => {
        const y = ((frame - startDelay) * col.speed + col.offset) % (height + 500) - 250;

        return (
          <div
            key={`matrix-col-${colIndex}`}
            style={{
              position: "absolute",
              left: `${col.x}%`,
              top: y,
            }}
          >
            {col.chars.map((c, charIndex) => (
              <div
                key={`matrix-char-${colIndex}-${charIndex}`}
                style={{
                  fontFamily: "monospace",
                  fontSize: 20,
                  color: charIndex === 0 ? "#ffffff" : "#00ff00",
                  opacity: c.opacity * lerp(frame, [startDelay, startDelay + 30], [0, 1]),
                  textShadow: charIndex === 0 ? "0 0 10px #00ff00" : "none",
                  height: 25,
                }}
              >
                {charIndex === 0 || random(`matrix-show-${frame}-${colIndex}-${charIndex}`) > 0.02
                  ? c.char
                  : chars[Math.floor(random(`matrix-change-${frame}-${colIndex}-${charIndex}`) * chars.length)]}
              </div>
            ))}
          </div>
        );
      })}

      {/* オーバーレイテキスト */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 700,
            color: "#00ff00",
            textShadow: "0 0 30px #00ff00",
            opacity: textOpacity,
          }}
        >
          THE MATRIX
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
