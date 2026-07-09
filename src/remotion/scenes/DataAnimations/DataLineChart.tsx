/**
 * DataLineChart - ラインチャート - 折れ線グラフ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const DataLineChart = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const dataPoints = [20, 45, 35, 60, 55, 80, 70, 95, 85, 100];
  const chartWidth = 900;
  const chartHeight = 300;

  const drawProgress = lerp(frame, [startDelay, startDelay + 60], [0, 1], EASE.out);

  const pointsToShow = Math.floor(dataPoints.length * drawProgress);

  const getX = (index: number) => (index / (dataPoints.length - 1)) * chartWidth;
  const getY = (value: number) => chartHeight - (value / 100) * chartHeight;

  // パス生成
  const linePath = dataPoints
    .slice(0, pointsToShow + 1)
    .map((value, i) => {
      const x = getX(i);
      const y = getY(value);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  // エリアパス
  const areaPath =
    linePath +
    ` L ${getX(pointsToShow)} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <AbsoluteFill style={{ background: C.black, padding: 60 }}>
      {/* タイトル */}
      <div
        style={{
          fontFamily: font,
          fontSize: 40,
          fontWeight: 700,
          color: C.white,
          marginBottom: 10,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        Growth Trend
      </div>
      <div
        style={{
          fontFamily: font,
          fontSize: 16,
          color: C.gray[500],
          marginBottom: 40,
          opacity: lerp(frame, [startDelay + 10, startDelay + 30], [0, 1]),
        }}
      >
        Performance over time
      </div>

      {/* チャート */}
      <div style={{ position: "relative", marginLeft: 50 }}>
        {/* グリッド */}
        <svg
          width={chartWidth}
          height={chartHeight}
          style={{ position: "absolute" }}
          aria-hidden="true"
        >
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={`grid-${value}`}>
              <line
                x1={0}
                y1={getY(value)}
                x2={chartWidth}
                y2={getY(value)}
                stroke={C.gray[800]}
                strokeDasharray="4 4"
              />
              <text
                x={-40}
                y={getY(value) + 5}
                fill={C.gray[500]}
                fontSize={12}
                fontFamily={font}
              >
                {value}
              </text>
            </g>
          ))}
        </svg>

        {/* ライン */}
        <svg
          width={chartWidth}
          height={chartHeight}
          style={{ position: "relative", zIndex: 1 }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.accent} />
              <stop offset="100%" stopColor={C.secondary} />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={C.accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* エリア */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* ライン */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ポイント */}
          {dataPoints.slice(0, pointsToShow + 1).map((value, i) => (
            <circle
              key={`point-${i}`}
              cx={getX(i)}
              cy={getY(value)}
              r={6}
              fill={C.accent}
              stroke={C.white}
              strokeWidth={2}
            />
          ))}
        </svg>

        {/* 現在値表示 */}
        {pointsToShow > 0 && (
          <div
            style={{
              position: "absolute",
              left: getX(pointsToShow) + 15,
              top: getY(dataPoints[pointsToShow]) - 30,
              fontFamily: font,
              fontSize: 24,
              fontWeight: 700,
              color: C.white,
              background: C.accent,
              padding: "4px 12px",
              borderRadius: 6,
            }}
          >
            {dataPoints[pointsToShow]}%
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
