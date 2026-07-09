/**
 * BackgroundBokeh - ボケ効果
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { C, lerp, font } from "../../common";

export const BackgroundBokeh = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const bokehCount = 20;
  const bokehs = React.useMemo(() => {
    return Array.from({ length: bokehCount }).map((_, i) => ({
      id: `bokeh-${i}`,
      x: random(`bokeh-x-${i}`) * 100,
      y: random(`bokeh-y-${i}`) * 100,
      size: random(`bokeh-s-${i}`) * 150 + 50,
      color: [C.accent, C.secondary, C.tertiary, C.orange][i % 4],
      speedX: (random(`bokeh-sx-${i}`) - 0.5) * 0.3,
      speedY: (random(`bokeh-sy-${i}`) - 0.5) * 0.3,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {bokehs.map((bokeh) => {
        const x = (bokeh.x + (frame - startDelay) * bokeh.speedX) % 120 - 10;
        const y = (bokeh.y + (frame - startDelay) * bokeh.speedY) % 120 - 10;
        const pulse = 0.8 + Math.sin((frame - startDelay) * 0.05 + bokeh.x) * 0.2;

        return (
          <div
            key={bokeh.id}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: bokeh.size * pulse,
              height: bokeh.size * pulse,
              background: `radial-gradient(circle, ${bokeh.color}60 0%, transparent 70%)`,
              borderRadius: "50%",
              filter: "blur(30px)",
              opacity: lerp(frame, [startDelay, startDelay + 30], [0, 0.6]),
            }}
          />
        );
      })}

      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: font,
          fontSize: 80,
          fontWeight: 700,
          color: C.white,
          opacity: lerp(frame, [startDelay + 20, startDelay + 50], [0, 1]),
        }}
      >
        BOKEH
      </div>
    </AbsoluteFill>
  );
};
