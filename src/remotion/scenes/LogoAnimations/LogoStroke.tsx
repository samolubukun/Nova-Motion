/**
 * LogoStroke - ロゴストロークアニメーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LogoStroke = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const strokeProgress = lerp(frame, [startDelay, startDelay + 50], [0, 1], EASE.out);
  const fillProgress = lerp(frame, [startDelay + 40, startDelay + 60], [0, 1], EASE.out);

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
        <svg width="300" height="100" viewBox="0 0 300 100" aria-hidden="true">
          {/* ロゴパス */}
          <text
            x="150"
            y="70"
            textAnchor="middle"
            fontFamily={font}
            fontSize="72"
            fontWeight="800"
            fill="none"
            stroke={C.accent}
            strokeWidth="2"
            strokeDasharray="500"
            strokeDashoffset={500 - strokeProgress * 500}
          >
            LOGO
          </text>
          <text
            x="150"
            y="70"
            textAnchor="middle"
            fontFamily={font}
            fontSize="72"
            fontWeight="800"
            fill={C.white}
            opacity={fillProgress}
          >
            LOGO
          </text>
        </svg>

        {/* タグライン */}
        <div
          style={{
            textAlign: "center",
            fontFamily: font,
            fontSize: 16,
            color: C.gray[500],
            letterSpacing: 6,
            marginTop: 20,
            opacity: lerp(frame, [startDelay + 50, startDelay + 70], [0, 1]),
          }}
        >
          BRAND TAGLINE
        </div>
      </div>
    </AbsoluteFill>
  );
};
