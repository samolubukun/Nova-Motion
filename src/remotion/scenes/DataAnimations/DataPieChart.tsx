/**
 * DataPieChart - パイチャート - 円グラフ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const DataPieChart = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = [
    { label: "Product A", value: 35, color: C.accent },
    { label: "Product B", value: 25, color: C.secondary },
    { label: "Product C", value: 20, color: C.tertiary },
    { label: "Others", value: 20, color: C.gray[600] },
  ];

  const radius = 140;
  const cx = 200;
  const cy = 200;

  const entryProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  let currentAngle = -90;

  return (
    <AbsoluteFill style={{ background: C.gray[950], padding: 60 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
        {/* パイチャート */}
        <svg width={400} height={400} aria-hidden="true">
          {data.map((item) => {
            const angle = (item.value / 100) * 360 * entryProgress;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = cx + radius * Math.cos(startRad);
            const y1 = cy + radius * Math.sin(startRad);
            const x2 = cx + radius * Math.cos(endRad);
            const y2 = cy + radius * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            const path = `
              M ${cx} ${cy}
              L ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
              Z
            `;

            return (
              <path
                key={`pie-${item.label}`}
                d={path}
                fill={item.color}
                stroke={C.gray[950]}
                strokeWidth={3}
              />
            );
          })}

          {/* 中央の穴（ドーナツ風） */}
          <circle cx={cx} cy={cy} r={70} fill={C.gray[950]} />

          {/* 中央テキスト */}
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fill={C.white}
            fontSize={28}
            fontWeight="bold"
            fontFamily={font}
          >
            100%
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            fill={C.gray[500]}
            fontSize={14}
            fontFamily={font}
          >
            Total
          </text>
        </svg>

        {/* 凡例 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: font,
              fontSize: 32,
              fontWeight: 700,
              color: C.white,
              marginBottom: 30,
              opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
            }}
          >
            Market Share
          </div>

          {data.map((item, i) => {
            const delay = startDelay + 20 + i * 8;
            const opacity = lerp(frame, [delay, delay + 15], [0, 1]);

            return (
              <div
                key={`legend-${item.label}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                  opacity,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    background: item.color,
                    borderRadius: 4,
                    marginRight: 15,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: font,
                      fontSize: 18,
                      color: C.white,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.white,
                  }}
                >
                  {Math.round(item.value * entryProgress)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
