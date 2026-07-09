/**
 * Layout Animations - Individual Component Exports
 * 
 * Re-exports all layout animation components
 */

import { LayoutAsymmetric } from "./LayoutAsymmetric";
import { LayoutGiantNumber } from "./LayoutGiantNumber";
import { LayoutSplitContrast } from "./LayoutSplitContrast";
import { LayoutOffGrid } from "./LayoutOffGrid";
import { LayoutFullscreenType } from "./LayoutFullscreenType";
import { LayoutMultiColumn } from "./LayoutMultiColumn";
import { LayoutVerticalMix } from "./LayoutVerticalMix";
import { LayoutFrameInFrame } from "./LayoutFrameInFrame";
import { LayoutDiagonal } from "./LayoutDiagonal";
import { LayoutWhitespace } from "./LayoutWhitespace";
import { LayoutGridBreak } from "./LayoutGridBreak";
import { LayoutLayered } from "./LayoutLayered";

export {
  LayoutAsymmetric,
  LayoutGiantNumber,
  LayoutSplitContrast,
  LayoutOffGrid,
  LayoutFullscreenType,
  LayoutMultiColumn,
  LayoutVerticalMix,
  LayoutFrameInFrame,
  LayoutDiagonal,
  LayoutWhitespace,
  LayoutGridBreak,
  LayoutLayered,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "asymmetric", Component: LayoutAsymmetric },
  { id: "giantNumber", Component: LayoutGiantNumber },
  { id: "splitContrast", Component: LayoutSplitContrast },
  { id: "offGrid", Component: LayoutOffGrid },
  { id: "fullscreenType", Component: LayoutFullscreenType },
  { id: "multiColumn", Component: LayoutMultiColumn },
  { id: "verticalMix", Component: LayoutVerticalMix },
  { id: "frameInFrame", Component: LayoutFrameInFrame },
  { id: "diagonal", Component: LayoutDiagonal },
  { id: "whitespace", Component: LayoutWhitespace },
  { id: "gridBreak", Component: LayoutGridBreak },
  { id: "layered", Component: LayoutLayered },
];

export const LayoutShowcase = () => (
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

export const LAYOUT_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
