/**
 * DemoDragDrop - ドラッグ&ドロップデモ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";

export const DemoDragDrop = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // ドラッグアニメーション
  const dragStart = startDelay + 20;
  const dragEnd = startDelay + 70;
  const dropFrame = startDelay + 75;

  const isDragging = frame >= dragStart && frame < dropFrame;
  const isDropped = frame >= dropFrame;

  // アイテム位置
  const itemX = lerp(frame, [dragStart, dragEnd], [150, 700], EASE.smooth);
  const itemY = lerp(frame, [dragStart, dragEnd], [200, 350], EASE.smooth);

  // カーソル位置
  const cursorX = lerp(frame, [startDelay, dragStart], [300, 150], EASE.smooth);
  const cursorY = lerp(frame, [startDelay, dragStart], [400, 200], EASE.smooth);

  const dragCursorX = lerp(frame, [dragStart, dragEnd], [170, 720], EASE.smooth);
  const dragCursorY = lerp(frame, [dragStart, dragEnd], [220, 370], EASE.smooth);

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ソースエリア */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 150,
          width: 200,
          padding: 20,
          background: C.gray[900],
          borderRadius: 12,
          border: `2px dashed ${C.gray[700]}`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 12,
            color: C.gray[500],
            marginBottom: 15,
            letterSpacing: 1,
          }}
        >
          SOURCE
        </div>

        {/* ドラッグ対象アイテム（ドラッグ前） */}
        {!isDragging && !isDropped && (
          <div
            style={{
              background: C.accent,
              borderRadius: 8,
              padding: "12px 16px",
              fontFamily: font,
              fontSize: 14,
              fontWeight: 500,
              color: C.white,
            }}
          >
            Drag me
          </div>
        )}

        {/* プレースホルダー */}
        {(isDragging || isDropped) && (
          <div
            style={{
              border: `2px dashed ${C.gray[600]}`,
              borderRadius: 8,
              padding: "12px 16px",
              fontFamily: font,
              fontSize: 14,
              color: C.gray[600],
            }}
          >
            Empty
          </div>
        )}
      </div>

      {/* ターゲットエリア */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 150,
          width: 300,
          padding: 20,
          background: isDropped ? `${C.success}10` : C.gray[900],
          borderRadius: 12,
          border: `2px dashed ${isDragging ? C.accent : isDropped ? C.success : C.gray[700]}`,
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 12,
            color: isDropped ? C.success : C.gray[500],
            marginBottom: 15,
            letterSpacing: 1,
          }}
        >
          {isDropped ? "DROPPED!" : "DROP HERE"}
        </div>

        {/* ドロップされたアイテム */}
        {isDropped && (
          <div
            style={{
              background: C.accent,
              borderRadius: 8,
              padding: "12px 16px",
              fontFamily: font,
              fontSize: 14,
              fontWeight: 500,
              color: C.white,
            }}
          >
            Drag me
          </div>
        )}

        {!isDropped && (
          <div
            style={{
              height: 44,
              border: `2px dashed ${C.gray[700]}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: font, fontSize: 13, color: C.gray[600] }}>
              Drop zone
            </span>
          </div>
        )}
      </div>

      {/* ドラッグ中のアイテム */}
      {isDragging && (
        <div
          style={{
            position: "absolute",
            left: itemX,
            top: itemY,
            background: C.accent,
            borderRadius: 8,
            padding: "12px 16px",
            fontFamily: font,
            fontSize: 14,
            fontWeight: 500,
            color: C.white,
            boxShadow: `0 10px 40px ${C.accent}40`,
            transform: "rotate(-3deg) scale(1.05)",
            opacity: 0.95,
          }}
        >
          Drag me
        </div>
      )}

      {/* カーソル */}
      <Cursor
        x={isDragging ? dragCursorX : cursorX}
        y={isDragging ? dragCursorY : cursorY}
        clicking={isDragging}
      />

      {/* 矢印ガイド */}
      <svg
        style={{
          position: "absolute",
          left: 350,
          top: 280,
          opacity: lerp(frame, [startDelay, startDelay + 15], [0, 0.5]),
        }}
        width="200"
        height="60"
        viewBox="0 0 200 60"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 30 H170 L155 15 M170 30 L155 45"
          stroke={C.gray[600]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 4"
        />
      </svg>
    </AbsoluteFill>
  );
};
