/**
 * DataGauge - ゲージメーター - スピードメーター風
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const DataGauge = ({ value = 78, maxValue = 100, startDelay = 0 }: {
  value?: number;
  maxValue?: number;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const progress = lerp(frame, [startDelay, startDelay + 50], [0, value / maxValue], EASE.out);
  const angle = -135 + progress * 270; // -135度から+135度

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* 背景アーク */}
        <svg width={400} height={300} style={{ overflow: "visible" }} aria-hidden="true">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.success} />
              <stop offset="50%" stopColor={C.warning} />
              <stop offset="100%" stopColor={C.danger} />
            </linearGradient>
          </defs>

          {/* 背景トラック */}
          <path
            d="M 50 250 A 150 150 0 1 1 350 250"
            fill="none"
            stroke={C.gray[800]}
            strokeWidth={20}
            strokeLinecap="round"
          />

          {/* 進捗アーク */}
          <path
            d="M 50 250 A 150 150 0 1 1 350 250"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={20}
            strokeLinecap="round"
            strokeDasharray={`${progress * 471} 471`}
          />

          {/* 目盛り */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = -135 + (tick / 100) * 270;
            const rad = (tickAngle * Math.PI) / 180;
            const x1 = 200 + 130 * Math.cos(rad);
            const y1 = 250 + 130 * Math.sin(rad);
            const x2 = 200 + 160 * Math.cos(rad);
            const y2 = 250 + 160 * Math.sin(rad);

            return (
              <g key={`tick-${tick}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gray[600]} strokeWidth={2} />
                <text
                  x={200 + 180 * Math.cos(rad)}
                  y={250 + 180 * Math.sin(rad)}
                  textAnchor="middle"
                  fill={C.gray[500]}
                  fontSize={14}
                  fontFamily={font}
                >
                  {tick}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 針 */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 250,
            width: 4,
            height: 120,
            background: C.white,
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${angle}deg)`,
            borderRadius: 2,
          }}
        />

        {/* 中央ドット */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 250,
            width: 20,
            height: 20,
            background: C.white,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* 値表示 */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 320,
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 64,
              fontWeight: 800,
              color: C.white,
            }}
          >
            {Math.round(progress * maxValue)}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 18,
              color: C.gray[500],
            }}
          >
            Performance Score
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
