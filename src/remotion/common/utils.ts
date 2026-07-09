/**
 * Utility functions for remotion-scenes
 */

import { interpolate } from "remotion";

/**
 * Interpolate with clamped extrapolation (shorthand for common pattern)
 */
export const lerp = (
  frame: number,
  range: [number, number],
  output: [number, number],
  easing?: (t: number) => number
) =>
  interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
