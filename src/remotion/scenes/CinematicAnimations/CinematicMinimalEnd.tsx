/**
 * CinematicMinimalEnd - ミニマリストエンディング
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, lerp, font } from "../../common";

export const CinematicMinimalEnd = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const fadeInOut = (start: number, duration: number) => {
    const progress = frame - startDelay - start;
    if (progress < 0) return 0;
    if (progress < duration / 2) return progress / (duration / 2);
    if (progress < duration) return 1 - (progress - duration / 2) / (duration / 2);
    return 0;
  };

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* "Directed by" */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "35%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: fadeInOut(0, 50),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[500],
            letterSpacing: 4,
            marginBottom: 15,
          }}
        >
          Directed by
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 36,
            fontWeight: 300,
            color: C.white,
          }}
        >
          John Smith
        </div>
      </div>

      {/* "Written by" */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: fadeInOut(30, 50),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[500],
            letterSpacing: 4,
            marginBottom: 15,
          }}
        >
          Written by
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 36,
            fontWeight: 300,
            color: C.white,
          }}
        >
          Jane Doe
        </div>
      </div>

      {/* "The End" */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: lerp(frame, [startDelay + 70, startDelay + 90], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 48,
            fontWeight: 300,
            fontStyle: "italic",
            color: C.white,
          }}
        >
          The End
        </div>
      </div>
    </AbsoluteFill>
  );
};
