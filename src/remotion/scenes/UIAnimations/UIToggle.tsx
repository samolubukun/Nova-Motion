/**
 * UIToggle - スイッチ/トグル
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C, lerp, font } from "../../common";

export const UIToggle = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const toggleFrame = startDelay + 30;
  const isOn = frame >= toggleFrame;

  const knobProgress = spring({
    frame: isOn ? frame - toggleFrame : toggleFrame - frame,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  const knobX = interpolate(knobProgress, [0, 1], [4, 36]);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* トグルスイッチ */}
        <div
          style={{
            width: 70,
            height: 38,
            background: isOn ? C.accent : C.gray[700],
            borderRadius: 19,
            position: "relative",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: knobX,
              top: 4,
              width: 30,
              height: 30,
              background: C.white,
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          />
        </div>

        {/* ステータス */}
        <div
          style={{
            fontFamily: font,
            fontSize: 24,
            fontWeight: 600,
            color: isOn ? C.success : C.gray[500],
          }}
        >
          {isOn ? "ON" : "OFF"}
        </div>

        {/* 設定項目 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginTop: 40,
          }}
        >
          {["Dark Mode", "Notifications", "Auto-save"].map((item, i) => (
            <div
              key={`setting-${item}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 300,
                padding: "12px 0",
                borderBottom: `1px solid ${C.gray[800]}`,
                opacity: lerp(frame, [startDelay + 10 + i * 8, startDelay + 25 + i * 8], [0, 1]),
              }}
            >
              <span style={{ fontFamily: font, fontSize: 16, color: C.white }}>
                {item}
              </span>
              <div
                style={{
                  width: 44,
                  height: 24,
                  background: i === 0 ? C.accent : C.gray[700],
                  borderRadius: 12,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
