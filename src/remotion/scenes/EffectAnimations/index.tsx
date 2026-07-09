/**
 * Effect Animations - Individual Component Exports
 * 
 * Re-exports all effect animation components
 */

import { EffectFilmGrain } from "./EffectFilmGrain";
import { EffectLightLeak } from "./EffectLightLeak";
import { EffectChromaticAberration } from "./EffectChromaticAberration";
import { EffectGlow } from "./EffectGlow";
import { EffectDepthOfField } from "./EffectDepthOfField";
import { EffectNoise } from "./EffectNoise";
import { EffectVHS } from "./EffectVHS";
import { EffectMatrix } from "./EffectMatrix";
import { EffectKaleidoscope } from "./EffectKaleidoscope";
import { EffectDuotone } from "./EffectDuotone";

export {
  EffectFilmGrain,
  EffectLightLeak,
  EffectChromaticAberration,
  EffectGlow,
  EffectDepthOfField,
  EffectNoise,
  EffectVHS,
  EffectMatrix,
  EffectKaleidoscope,
  EffectDuotone,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "filmGrain", Component: EffectFilmGrain },
  { id: "lightLeak", Component: EffectLightLeak },
  { id: "chromaticAberration", Component: EffectChromaticAberration },
  { id: "glow", Component: EffectGlow },
  { id: "depthOfField", Component: EffectDepthOfField },
  { id: "noise", Component: EffectNoise },
  { id: "vhs", Component: EffectVHS },
  { id: "matrix", Component: EffectMatrix },
  { id: "kaleidoscope", Component: EffectKaleidoscope },
  { id: "duotone", Component: EffectDuotone },
];

export const EffectShowcase = () => (
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

export const EFFECT_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
