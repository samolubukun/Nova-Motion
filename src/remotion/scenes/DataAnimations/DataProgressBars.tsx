/**
 * DataProgressBars - プログレスバー - 複数のプログレス
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const DataProgressBars = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const items = [
    { label: "JavaScript", value: 92, color: C.warning },
    { label: "TypeScript", value: 85, color: C.accent },
    { label: "React", value: 88, color: C.secondary },
    { label: "Node.js", value: 75, color: C.success },
    { label: "Python", value: 65, color: C.tertiary },
  ];

  return (
    <AbsoluteFill style={{ background: C.gray[950], padding: 80 }}>
      {/* タイトル */}
      <div
        style={{
          fontFamily: font,
          fontSize: 48,
          fontWeight: 700,
          color: C.white,
          marginBottom: 60,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        Skills
      </div>

      {/* プログレスバー */}
      {items.map((item, i) => {
        const delay = startDelay + 20 + i * 10;
        const labelOpacity = lerp(frame, [delay, delay + 15], [0, 1]);
        const barProgress = lerp(frame, [delay + 5, delay + 45], [0, item.value], EASE.out);

        return (
          <div key={`progress-${item.label}`} style={{ marginBottom: 35 }}>
            {/* ラベル行 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                opacity: labelOpacity,
              }}
            >
              <div
                style={{
                  fontFamily: font,
                  fontSize: 20,
                  color: C.white,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: font,
                  fontSize: 20,
                  fontWeight: 600,
                  color: C.white,
                }}
              >
                {Math.round(barProgress)}%
              </div>
            </div>

            {/* バー */}
            <div
              style={{
                height: 12,
                background: C.gray[800],
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${barProgress}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`,
                  borderRadius: 6,
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
