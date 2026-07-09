/**
 * DemoSearchFilter - 検索フィルターデモ
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";

export const DemoSearchFilter = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 検索入力
  const searchText = "design";
  const typingStart = startDelay + 15;
  const typedChars = Math.floor(lerp(frame, [typingStart, typingStart + 30], [0, searchText.length]));

  // フィルター選択
  const filterFrame = startDelay + 60;
  const isFiltered = frame >= filterFrame;

  // 検索結果
  const allItems = [
    { id: "result-1", name: "Design System", tag: "design" },
    { id: "result-2", name: "Marketing Plan", tag: "marketing" },
    { id: "result-3", name: "Design Guidelines", tag: "design" },
    { id: "result-4", name: "Brand Assets", tag: "brand" },
    { id: "result-5", name: "UI Design Kit", tag: "design" },
  ];

  const filteredItems = isFiltered
    ? allItems.filter((item) => item.tag === "design")
    : typedChars > 0
    ? allItems.filter((item) => item.name.toLowerCase().includes(searchText.slice(0, typedChars).toLowerCase()))
    : allItems;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 80,
          right: 100,
        }}
      >
        {/* 検索バー */}
        <div
          style={{
            display: "flex",
            gap: 15,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: C.gray[900],
              borderRadius: 10,
              padding: "12px 18px",
              border: `2px solid ${typedChars > 0 ? C.accent : C.gray[700]}`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke={C.gray[500]} strokeWidth="2" />
              <path d="M14 14L18 18" stroke={C.gray[500]} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: font, fontSize: 15, color: C.white }}>
              {searchText.slice(0, typedChars)}
            </span>
            {typedChars < searchText.length && Math.floor(frame / 15) % 2 === 0 && (
              <span style={{ width: 2, height: 18, background: C.accent }} />
            )}
          </div>

          {/* フィルターボタン */}
          <button
            type="button"
            style={{
              fontFamily: font,
              fontSize: 14,
              color: isFiltered ? C.white : C.gray[400],
              background: isFiltered ? C.accent : C.gray[900],
              border: `1px solid ${isFiltered ? C.accent : C.gray[700]}`,
              borderRadius: 10,
              padding: "12px 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 4H14M4 8H12M6 12H10"
                stroke={isFiltered ? C.white : C.gray[500]}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Filter
          </button>
        </div>

        {/* 結果数 */}
        <div
          style={{
            fontFamily: font,
            fontSize: 14,
            color: C.gray[500],
            marginBottom: 20,
          }}
        >
          {filteredItems.length} results
        </div>

        {/* 結果リスト */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredItems.map((item) => {
            const itemProgress = spring({
              frame: frame - startDelay - 10,
              fps,
              config: { damping: 15, stiffness: 150 },
            });

            return (
              <div
                key={item.id}
                style={{
                  background: C.gray[900],
                  borderRadius: 10,
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transform: `translateY(${(1 - itemProgress) * 20}px)`,
                  opacity: itemProgress,
                }}
              >
                <span style={{ fontFamily: font, fontSize: 15, color: C.white }}>
                  {item.name}
                </span>
                <span
                  style={{
                    fontFamily: font,
                    fontSize: 12,
                    color: item.tag === "design" ? C.accent : C.gray[500],
                    padding: "4px 10px",
                    background: item.tag === "design" ? `${C.accent}20` : C.gray[800],
                    borderRadius: 4,
                  }}
                >
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* カーソル */}
      <Cursor
        x={lerp(frame, [startDelay, filterFrame - 5], [500, 980], EASE.smooth)}
        y={lerp(frame, [startDelay, filterFrame - 5], [300, 110], EASE.smooth)}
        clicking={frame >= filterFrame - 3 && frame < filterFrame + 2}
      />
    </AbsoluteFill>
  );
};
