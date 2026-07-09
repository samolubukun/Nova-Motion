/**
 * Cursor - 共通マウスカーソルコンポーネント
 */

import { C } from "../../../common";

export const Cursor = ({ x, y, clicking = false, style }: {
  x: number;
  y: number;
  clicking?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      pointerEvents: "none",
      zIndex: 1000,
      ...style,
    }}
  >
    {/* カーソル本体 */}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        transform: clicking ? "scale(0.9)" : "scale(1)",
        transition: "transform 0.1s",
      }}
    >
      <path
        d="M5 3L19 12L12 13L9 20L5 3Z"
        fill={C.white}
        stroke={C.black}
        strokeWidth="1.5"
      />
    </svg>
    {/* クリックリップル */}
    {clicking && (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `2px solid ${C.accent}`,
          animation: "ripple 0.4s ease-out",
        }}
      />
    )}
  </div>
);
