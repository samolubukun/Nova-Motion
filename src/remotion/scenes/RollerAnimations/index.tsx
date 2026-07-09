/**
 * Roller Animations - Individual Component Exports
 * 
 * Re-exports all text roller animation components
 */

import { RollerSlotMachine } from "./RollerSlotMachine";
import { RollerFlip } from "./RollerFlip";
import { RollerFadeSlide } from "./RollerFadeSlide";
import { RollerBlur } from "./RollerBlur";
import { RollerScaleBounce } from "./RollerScaleBounce";
import { RollerGlitch } from "./RollerGlitch";
import { RollerWave } from "./RollerWave";
import { RollerTypewriter } from "./RollerTypewriter";
import { RollerLiquid } from "./RollerLiquid";
import { RollerVerticalList } from "./RollerVerticalList";
import { RollerDrum } from "./RollerDrum";
import { RollerMaskSlide } from "./RollerMaskSlide";
import { RollerSlotReveal } from "./RollerSlotReveal";
import { RollerDramaticStop } from "./RollerDramaticStop";
import { RollerMultiSlot } from "./RollerMultiSlot";
import { RollerCountdown } from "./RollerCountdown";
import { RollerOutlineHighlight } from "./RollerOutlineHighlight";
import { RollerPerspectiveStripes } from "./RollerPerspectiveStripes";
import { RollerShuffle } from "./RollerShuffle";
import { Roller3DCarousel } from "./Roller3DCarousel";
import { RollerSplitFlap } from "./RollerSplitFlap";
import { RollerGradientWave } from "./RollerGradientWave";

export {
  RollerSlotMachine,
  RollerFlip,
  RollerFadeSlide,
  RollerBlur,
  RollerScaleBounce,
  RollerGlitch,
  RollerWave,
  RollerTypewriter,
  RollerLiquid,
  RollerVerticalList,
  RollerDrum,
  RollerMaskSlide,
  RollerSlotReveal,
  RollerDramaticStop,
  RollerMultiSlot,
  RollerCountdown,
  RollerOutlineHighlight,
  RollerPerspectiveStripes,
  RollerShuffle,
  Roller3DCarousel,
  RollerSplitFlap,
  RollerGradientWave,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 120; // Roller scenes need more time

const scenes = [
  { id: "slotMachine", Component: RollerSlotMachine },
  { id: "flip", Component: RollerFlip },
  { id: "fadeSlide", Component: RollerFadeSlide },
  { id: "blur", Component: RollerBlur },
  { id: "scaleBounce", Component: RollerScaleBounce },
  { id: "glitch", Component: RollerGlitch },
  { id: "wave", Component: RollerWave },
  { id: "typewriter", Component: RollerTypewriter },
  { id: "liquid", Component: RollerLiquid },
  { id: "verticalList", Component: RollerVerticalList },
  { id: "drum", Component: RollerDrum },
  { id: "maskSlide", Component: RollerMaskSlide },
  { id: "slotReveal", Component: RollerSlotReveal },
  { id: "dramaticStop", Component: RollerDramaticStop },
  { id: "multiSlot", Component: RollerMultiSlot },
  { id: "countdown", Component: RollerCountdown },
  { id: "outlineHighlight", Component: RollerOutlineHighlight },
  { id: "perspectiveStripes", Component: RollerPerspectiveStripes },
  { id: "shuffle", Component: RollerShuffle },
  { id: "3dCarousel", Component: Roller3DCarousel },
  { id: "splitFlap", Component: RollerSplitFlap },
  { id: "gradientWave", Component: RollerGradientWave },
];

export const RollerShowcase = () => (
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

export const ROLLER_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
