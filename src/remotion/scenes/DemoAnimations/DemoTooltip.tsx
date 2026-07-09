/**
 * DemoTooltip - ツールチップ/ポップオーバーデモ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";

export const DemoTooltip = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // カーソル移動
  const hoverStart = startDelay + 30;
  const cursorX = lerp(frame, [startDelay, hoverStart], [300, 640], EASE.smooth);
  const cursorY = lerp(frame, [startDelay, hoverStart], [400, 280], EASE.smooth);

  // ツールチップ表示
  const tooltipProgress = spring({
    frame: frame - hoverStart - 5,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  const isHovering = frame >= hoverStart;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* UIコンテンツ */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 150,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            fontWeight: 600,
            color: C.white,
            marginBottom: 30,
          }}
        >
          User Profile
        </div>

        {/* ステータスバッジ（ツールチップ対象） */}
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: C.gray[800],
            }}
          />
          <div>
            <div style={{ fontFamily: font, fontSize: 16, color: C.white }}>
              John Doe
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  background: `${C.success}20`,
                  borderRadius: 20,
                  border: isHovering ? `1px solid ${C.success}` : "1px solid transparent",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.success,
                  }}
                />
                <span style={{ fontFamily: font, fontSize: 12, color: C.success }}>
                  Active
                </span>

                {/* ツールチップ */}
                {isHovering && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "100%",
                      transform: `translateX(-50%) translateY(-8px) scale(${tooltipProgress})`,
                      background: C.gray[800],
                      borderRadius: 8,
                      padding: "10px 14px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                      opacity: tooltipProgress,
                      transformOrigin: "bottom center",
                    }}
                  >
                    <div style={{ fontFamily: font, fontSize: 13, color: C.white }}>
                      Online since 2:30 PM
                    </div>
                    <div style={{ fontFamily: font, fontSize: 11, color: C.gray[400], marginTop: 4 }}>
                      Last activity: 5 min ago
                    </div>
                    {/* 矢印 */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: -6,
                        transform: "translateX(-50%) rotate(45deg)",
                        width: 12,
                        height: 12,
                        background: C.gray[800],
                      }}
                    />
                  </div>
                )}
              </div>
              <span style={{ fontFamily: font, fontSize: 13, color: C.gray[500] }}>
                Premium Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* カーソル */}
      <Cursor x={cursorX} y={cursorY} />

      {/* 説明 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          textAlign: "right",
          opacity: lerp(frame, [hoverStart + 10, hoverStart + 25], [0, 1]),
        }}
      >
        <div style={{ fontFamily: font, fontSize: 11, color: C.gray[600], letterSpacing: 2 }}>
          TOOLTIP ON HOVER
        </div>
      </div>
    </AbsoluteFill>
  );
};
