/**
 * ClickRipple - クリックリップルエフェクト
 */

import { C } from "../../../common";

export const ClickRipple = ({ x, y, progress }: {
  x: number;
  y: number;
  progress: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      width: progress * 100,
      height: progress * 100,
      borderRadius: "50%",
      border: `2px solid ${C.accent}`,
      opacity: 1 - progress,
    }}
  />
);
