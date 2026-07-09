/**
 * Liquid Animations - Individual Component Exports
 * 
 * Re-exports all liquid animation components
 */

import { LiquidInkSplash } from "./LiquidInkSplash";
import { LiquidBlob } from "./LiquidBlob";
import { LiquidSwirl } from "./LiquidSwirl";
import { LiquidSplatter } from "./LiquidSplatter";
import { LiquidCalligraphyInk } from "./LiquidCalligraphyInk";
import { LiquidWaterDrop } from "./LiquidWaterDrop";
import { LiquidMorphBlob } from "./LiquidMorphBlob";
import { LiquidFluidWave } from "./LiquidFluidWave";
import { LiquidOilSpill } from "./LiquidOilSpill";
import { LiquidPaintDrip } from "./LiquidPaintDrip";

export {
  LiquidInkSplash,
  LiquidBlob,
  LiquidSwirl,
  LiquidSplatter,
  LiquidCalligraphyInk,
  LiquidWaterDrop,
  LiquidMorphBlob,
  LiquidFluidWave,
  LiquidOilSpill,
  LiquidPaintDrip,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "inkSplash", Component: LiquidInkSplash },
  { id: "blob", Component: LiquidBlob },
  { id: "swirl", Component: LiquidSwirl },
  { id: "splatter", Component: LiquidSplatter },
  { id: "calligraphyInk", Component: LiquidCalligraphyInk },
  { id: "waterDrop", Component: LiquidWaterDrop },
  { id: "morphBlob", Component: LiquidMorphBlob },
  { id: "fluidWave", Component: LiquidFluidWave },
  { id: "oilSpill", Component: LiquidOilSpill },
  { id: "paintDrip", Component: LiquidPaintDrip },
];

export const LiquidShowcase = () => (
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

export const LIQUID_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
