/**
 * Background Animations - Individual Component Exports
 * 
 * Re-exports all background animation components
 */

import { BackgroundFlowingGradient } from "./BackgroundFlowingGradient";
import { BackgroundWaves } from "./BackgroundWaves";
import { BackgroundGeometric } from "./BackgroundGeometric";
import { BackgroundAurora } from "./BackgroundAurora";
import { BackgroundGrid } from "./BackgroundGrid";
import { BackgroundRadial } from "./BackgroundRadial";
import { BackgroundBokeh } from "./BackgroundBokeh";
import { BackgroundNoiseTexture } from "./BackgroundNoiseTexture";
import { BackgroundMeshGradient } from "./BackgroundMeshGradient";
import { BackgroundPerspectiveGrid } from "./BackgroundPerspectiveGrid";

export {
  BackgroundFlowingGradient,
  BackgroundWaves,
  BackgroundGeometric,
  BackgroundAurora,
  BackgroundGrid,
  BackgroundRadial,
  BackgroundBokeh,
  BackgroundNoiseTexture,
  BackgroundMeshGradient,
  BackgroundPerspectiveGrid,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "flowingGradient", Component: BackgroundFlowingGradient },
  { id: "waves", Component: BackgroundWaves },
  { id: "geometric", Component: BackgroundGeometric },
  { id: "aurora", Component: BackgroundAurora },
  { id: "grid", Component: BackgroundGrid },
  { id: "radial", Component: BackgroundRadial },
  { id: "bokeh", Component: BackgroundBokeh },
  { id: "noiseTexture", Component: BackgroundNoiseTexture },
  { id: "meshGradient", Component: BackgroundMeshGradient },
  { id: "perspectiveGrid", Component: BackgroundPerspectiveGrid },
];

export const BackgroundShowcase = () => (
  <AbsoluteFill style={{ background: "#0a0a0a" }}>
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

export const BACKGROUND_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
