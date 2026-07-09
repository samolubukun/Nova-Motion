/**
 * UITabs - タブアニメーション
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const UITabs = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tabs = ["Overview", "Analytics", "Reports", "Settings"];
  const activeTab = Math.floor((frame - startDelay) / 30) % tabs.length;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          right: 60,
        }}
      >
        {/* タブヘッダー */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: `1px solid ${C.gray[800]}`,
            marginBottom: 40,
          }}
        >
          {tabs.map((tab, i) => {
            const isActive = i === activeTab;
            const indicatorWidth = spring({
              frame: isActive ? frame - startDelay - i * 30 : 0,
              fps,
              config: { damping: 15, stiffness: 200 },
            });

            return (
              <div
                key={`tab-${tab}`}
                style={{
                  padding: "16px 32px",
                  fontFamily: font,
                  fontSize: 16,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.white : C.gray[500],
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                {tab}
                <div
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    width: `${indicatorWidth * 100}%`,
                    height: 2,
                    background: C.accent,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* タブコンテンツ */}
        <div
          style={{
            background: C.gray[900],
            borderRadius: 12,
            padding: 30,
            opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 24,
              fontWeight: 600,
              color: C.white,
              marginBottom: 15,
            }}
          >
            {tabs[activeTab]}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 16,
              color: C.gray[400],
            }}
          >
            Content for {tabs[activeTab].toLowerCase()} tab goes here.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
