/**
 * Easing functions for remotion-scenes
 */

import { Easing } from "remotion";

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.87, 0, 0.13, 1),
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
  elastic: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  snap: Easing.bezier(0.075, 0.82, 0.165, 1),
  dramatic: Easing.bezier(0.6, 0.01, 0.05, 0.95),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
};
