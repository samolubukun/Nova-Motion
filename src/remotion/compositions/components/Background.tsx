import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import React from "react";

export interface BackgroundElement {
  imageUrl: string;
  startMs: number;
  endMs: number;
  enterTransition?: "fade" | "blur" | "none";
  exitTransition?: "fade" | "blur" | "none";
  animations?: Array<{
    type: "scale";
    from: number;
    to: number;
    startMs: number;
    endMs: number;
  }>;
}

const FPS = 30;

export const Background: React.FC<{
  item: BackgroundElement;
}> = ({ item }) => {
  const frame = useCurrentFrame();
  const localMs = (frame / FPS) * 1000;
  const durationMs = item.endMs - item.startMs;

  // Calculate local progress (0 to 1) for the animation
  const progress = Math.min(1, Math.max(0, localMs / durationMs));

  // Determine scale values (gentle Ken Burns effect)
  const scaleAnim = item.animations?.[0];
  const fromScale = scaleAnim ? scaleAnim.from : 1.0;
  const toScale = scaleAnim ? scaleAnim.to : 1.1;
  const currentScale = fromScale + progress * (toScale - fromScale);

  // Calculate blur progress
  let blur = 0;
  const fadeMs = 800; // Smooth 0.8s transition
  if (item.enterTransition === "blur" && localMs < fadeMs) {
    blur = 1 - localMs / fadeMs;
  } else if (item.exitTransition === "blur" && localMs > durationMs - fadeMs) {
    blur = 1 - (durationMs - localMs) / fadeMs;
  }
  const currentBlur = 20 * blur;

  const resolvedSrc =
    item.imageUrl.startsWith("http://") || item.imageUrl.startsWith("https://")
      ? item.imageUrl
      : staticFile(item.imageUrl);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={resolvedSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${currentScale})`,
          filter: `blur(${currentBlur}px)`,
          WebkitFilter: `blur(${currentBlur}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
