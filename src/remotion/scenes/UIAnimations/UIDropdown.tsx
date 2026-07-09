/**
 * UIDropdown - ドロップダウンメニュー
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

export const UIDropdown = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const openFrame = startDelay + 20;
  const isOpen = frame >= openFrame;

  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translateX(-50%)",
        }}
      >
        {/* トリガー */}
        <div
          style={{
            width: 300,
            padding: "14px 20px",
            background: C.gray[900],
            borderRadius: 10,
            border: `1px solid ${isOpen ? C.accent : C.gray[700]}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <span style={{ fontFamily: font, fontSize: 16, color: C.white }}>
            Select option
          </span>
          <span
            style={{
              color: C.gray[500],
              transform: `rotate(${isOpen ? 180 : 0}deg)`,
              transition: "transform 0.3s",
            }}
          >
            ▼
          </span>
        </div>

        {/* ドロップダウンメニュー */}
        {isOpen && (
          <div
            style={{
              marginTop: 8,
              background: C.gray[900],
              borderRadius: 10,
              border: `1px solid ${C.gray[700]}`,
              overflow: "hidden",
            }}
          >
            {options.map((option, i) => {
              const itemProgress = spring({
                frame: frame - openFrame - i * 3,
                fps,
                config: { damping: 15, stiffness: 200 },
              });

              const isHovered = Math.floor((frame - openFrame - 20) / 15) === i;

              return (
                <div
                  key={`dropdown-${option}`}
                  style={{
                    padding: "14px 20px",
                    fontFamily: font,
                    fontSize: 16,
                    color: C.white,
                    background: isHovered ? C.gray[800] : "transparent",
                    transform: `translateX(${(1 - itemProgress) * 20}px)`,
                    opacity: itemProgress,
                    cursor: "pointer",
                  }}
                >
                  {option}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: font,
          fontSize: 14,
          color: C.gray[600],
          letterSpacing: 2,
        }}
      >
        DROPDOWN MENU
      </div>
    </AbsoluteFill>
  );
};
