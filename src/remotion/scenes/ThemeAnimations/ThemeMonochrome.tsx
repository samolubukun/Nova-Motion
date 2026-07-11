/**
 * ThemeMonochrome - モノクローム - 白黒の美学
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const ThemeMonochrome = ({ title = "MONOCHROME", subtitle = "BLACK / WHITE", startDelay = 0 }: {
  title?: string;
  subtitle?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const blockProgress = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* Black Block */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${blockProgress * 60}%`,
          height: "100%",
          background: C.black,
        }}
      />

      {/* White Text (on Black Background) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: lerp(frame, [startDelay + 15, startDelay + 35], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 700,
            color: C.white,
            lineHeight: 0.9,
          }}
        >
          {title}
        </div>
      </div>

      {/* Black Text (on White Background) */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 25, startDelay + 45], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 80,
            fontWeight: 700,
            color: C.black,
            lineHeight: 0.9,
          }}
        >
          WHITE
        </div>
      </div>

      {/* Center Border */}
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: 100,
          width: 1,
          height: lerp(frame, [startDelay + 20, startDelay + 50], [0, 520], EASE.out),
          background: C.gray[400],
        }}
      />
    </AbsoluteFill>
  );
};
