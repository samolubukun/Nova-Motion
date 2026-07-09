/**
 * LayoutLayered - レイヤード構成 - 奥行き感
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";

export const LayoutLayered = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  const layer1 = lerp(frame, [startDelay, startDelay + 30], [0, 1], EASE.out);
  const layer2 = lerp(frame, [startDelay + 10, startDelay + 40], [0, 1], EASE.out);
  const layer3 = lerp(frame, [startDelay + 20, startDelay + 50], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* 最背面レイヤー */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 100,
          width: 800,
          height: 400,
          background: C.gray[900],
          transform: `translateX(${(1 - layer1) * -100}px)`,
          opacity: layer1 * 0.5,
        }}
      />

      {/* 中間レイヤー */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 150,
          width: 700,
          height: 350,
          background: C.gray[800],
          transform: `translateX(${(1 - layer2) * -80}px)`,
          opacity: layer2 * 0.7,
        }}
      />

      {/* 前面レイヤー（コンテンツ） */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 200,
          width: 600,
          height: 300,
          background: C.accent,
          transform: `translateX(${(1 - layer3) * -60}px)`,
          opacity: layer3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 60,
            fontWeight: 700,
            color: C.white,
          }}
        >
          DEPTH
        </div>
      </div>

      {/* 右側の情報 */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
          opacity: lerp(frame, [startDelay + 40, startDelay + 60], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[500],
            letterSpacing: 3,
          }}
        >
          LAYERED
          <br />
          COMPOSITION
        </div>
      </div>
    </AbsoluteFill>
  );
};
