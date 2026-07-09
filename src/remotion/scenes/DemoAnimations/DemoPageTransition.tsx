/**
 * DemoPageTransition - 画面遷移デモ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";
import { Highlight } from "./shared/Highlight";

export const DemoPageTransition = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 遷移タイミング
  const transitionStart = startDelay + 40;
  const transitionProgress = spring({
    frame: frame - transitionStart,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const page1Opacity = 1 - transitionProgress;
  const page2Opacity = transitionProgress;
  const slideX = transitionProgress * 100;

  return (
    <AbsoluteFill style={{ background: C.gray[950], overflow: "hidden" }}>
      {/* ページ1 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 80,
          right: 100,
          bottom: 80,
          opacity: page1Opacity,
          transform: `translateX(-${slideX}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 28,
            fontWeight: 700,
            color: C.white,
            marginBottom: 20,
          }}
        >
          Products
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {["Product A", "Product B", "Product C"].map((name) => (
            <div
              key={`product-${name}`}
              style={{
                background: C.gray[900],
                borderRadius: 12,
                padding: 20,
                height: 150,
              }}
            >
              <div style={{ fontFamily: font, fontSize: 16, color: C.white }}>{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ページ2 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 80,
          right: 100,
          bottom: 80,
          opacity: page2Opacity,
          transform: `translateX(${100 - slideX}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 20 }}>
          <div
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[500],
            }}
          >
            ← Back
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 28,
              fontWeight: 700,
              color: C.white,
            }}
          >
            Product A
          </div>
        </div>
        <div
          style={{
            background: C.gray[900],
            borderRadius: 12,
            padding: 30,
          }}
        >
          <div style={{ fontFamily: font, fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 15 }}>
            Product Details
          </div>
          <div style={{ fontFamily: font, fontSize: 14, color: C.gray[400], lineHeight: 1.7 }}>
            Detailed information about Product A would appear here. This demonstrates a smooth page transition animation.
          </div>
        </div>
      </div>

      {/* クリックターゲット */}
      {frame < transitionStart && (
        <>
          <Highlight
            x={200}
            y={260}
            width={280}
            height={120}
            progress={lerp(frame, [startDelay + 20, startDelay + 35], [0, 1])}
            label="Click to view"
          />
          <Cursor
            x={lerp(frame, [startDelay, startDelay + 35], [400, 340], EASE.smooth)}
            y={lerp(frame, [startDelay, startDelay + 35], [500, 320], EASE.smooth)}
            clicking={frame >= transitionStart - 5 && frame < transitionStart}
          />
        </>
      )}

      {/* 遷移インジケーター */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 4,
            borderRadius: 2,
            background: transitionProgress < 0.5 ? C.accent : C.gray[700],
          }}
        />
        <div
          style={{
            width: 30,
            height: 4,
            borderRadius: 2,
            background: transitionProgress >= 0.5 ? C.accent : C.gray[700],
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
