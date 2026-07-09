/**
 * Transition Animations - トランジション&リビール集
 * 
 * プロのモーショングラフィックスで使用されるトランジション
 */

// Individual components
export { TransitionBlinds } from "./TransitionBlinds";
export { TransitionCircleWipe } from "./TransitionCircleWipe";
export { TransitionDiagonalSlice } from "./TransitionDiagonalSlice";
export { TransitionBoxReveal } from "./TransitionBoxReveal";
export { TransitionLineSweep } from "./TransitionLineSweep";
export { TransitionGlitch } from "./TransitionGlitch";
export { TransitionZoomBlur } from "./TransitionZoomBlur";
export { TransitionFlash } from "./TransitionFlash";
export { TransitionShutter } from "./TransitionShutter";
export { TransitionLiquidMorph } from "./TransitionLiquidMorph";

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../../common";
import { TransitionBlinds } from "./TransitionBlinds";
import { TransitionCircleWipe } from "./TransitionCircleWipe";
import { TransitionDiagonalSlice } from "./TransitionDiagonalSlice";
import { TransitionBoxReveal } from "./TransitionBoxReveal";
import { TransitionLineSweep } from "./TransitionLineSweep";
import { TransitionGlitch } from "./TransitionGlitch";
import { TransitionZoomBlur } from "./TransitionZoomBlur";
import { TransitionFlash } from "./TransitionFlash";
import { TransitionShutter } from "./TransitionShutter";
import { TransitionLiquidMorph } from "./TransitionLiquidMorph";

const SCENE_DURATION = 90;

const scenes = [
  { id: "blinds", Component: TransitionBlinds },
  { id: "circleWipe", Component: TransitionCircleWipe },
  { id: "diagonalSlice", Component: TransitionDiagonalSlice },
  { id: "boxReveal", Component: TransitionBoxReveal },
  { id: "lineSweep", Component: TransitionLineSweep },
  { id: "glitch", Component: TransitionGlitch },
  { id: "zoomBlur", Component: TransitionZoomBlur },
  { id: "flash", Component: TransitionFlash },
  { id: "shutter", Component: TransitionShutter },
  { id: "liquidMorph", Component: TransitionLiquidMorph },
];

export const TransitionShowcase = () => (
  <AbsoluteFill style={{ background: C.black }}>
    {scenes.map((scene, index) => (
      <Sequence
        key={scene.id}
        from={index * SCENE_DURATION}
        durationInFrames={SCENE_DURATION}
      >
        <scene.Component />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const TRANSITION_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
