/**
 * ListUnevenGrid - 非均等グリッド（1大+2小）
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, font } from "../../common";

const defaultItems = [
  { badge: "FEATURED", title: "Content Nova", description: "A unified creative workspace designed for modern creators, teams, and content brands." },
  { badge: "OPTION 02", title: "Ideate", description: "AI-assisted niche brainstorming" },
  { badge: "OPTION 03", title: "Individual", description: "For solo professionals" },
];

export const ListUnevenGrid = ({ title = "Content Nova", items = defaultItems, startDelay = 0 }: {
  title?: string;
  items?: Array<{ badge: string; title: string; description: string }>;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const sub1Progress = spring({
    frame: frame - startDelay - 15,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const sub2Progress = spring({
    frame: frame - startDelay - 25,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          right: 60,
          bottom: 60,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* メインカード（2行占有） */}
        <div
          style={{
            gridRow: "1 / 3",
            background: C.gray[900],
            borderRadius: 12,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: `scale(${mainProgress})`,
            opacity: mainProgress,
            transformOrigin: "left center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: font,
                fontSize: 12,
                color: C.accent,
                letterSpacing: 3,
                marginBottom: 20,
              }}
            >
               {items[0].badge}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: 48,
                fontWeight: 700,
                color: C.white,
                lineHeight: 1.1,
              }}
            >
               {items[0].title}
            </div>
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 16,
              color: C.gray[400],
              maxWidth: 400,
              lineHeight: 1.7,
            }}
          >
            {items[0].description}
          </div>
        </div>

        {/* サブカード1 */}
        <div
          style={{
            background: C.gray[900],
            borderRadius: 12,
            padding: 30,
            transform: `translateY(${(1 - sub1Progress) * 30}px)`,
            opacity: sub1Progress,
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 11,
              color: C.gray[600],
              letterSpacing: 2,
              marginBottom: 15,
            }}
          >
             {items[1].badge}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 24,
              fontWeight: 600,
              color: C.white,
              marginBottom: 10,
            }}
          >
             {items[1].title}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[500],
            }}
          >
             {items[1].description}
          </div>
        </div>

        {/* サブカード2 */}
        <div
          style={{
            background: C.gray[900],
            borderRadius: 12,
            padding: 30,
            transform: `translateY(${(1 - sub2Progress) * 30}px)`,
            opacity: sub2Progress,
          }}
        >
          <div
            style={{
              fontFamily: font,
              fontSize: 11,
              color: C.gray[600],
              letterSpacing: 2,
              marginBottom: 15,
            }}
          >
             {items[2].badge}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 24,
              fontWeight: 600,
              color: C.white,
              marginBottom: 10,
            }}
          >
             {items[2].title}
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 14,
              color: C.gray[500],
            }}
          >
             {items[2].description}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
