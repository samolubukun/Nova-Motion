/**
 * List Animations - Individual Component Exports
 * 
 * Re-exports all list animation components
 */

import { ListAsymmetric3 } from "./ListAsymmetric3";
import { ListNumberedVertical } from "./ListNumberedVertical";
import { ListStaggered } from "./ListStaggered";
import { ListFullscreenSequence } from "./ListFullscreenSequence";
import { ListMinimalLeft } from "./ListMinimalLeft";
import { ListStatsFocused } from "./ListStatsFocused";
import { ListTimeline } from "./ListTimeline";
import { ListUnevenGrid } from "./ListUnevenGrid";
import { ListTwoColumnCompare } from "./ListTwoColumnCompare";
import { ListSimpleText } from "./ListSimpleText";
import { ListHorizontalPeek } from "./ListHorizontalPeek";
import { ListHeroWithList } from "./ListHeroWithList";

export {
  ListAsymmetric3,
  ListNumberedVertical,
  ListStaggered,
  ListFullscreenSequence,
  ListMinimalLeft,
  ListStatsFocused,
  ListTimeline,
  ListUnevenGrid,
  ListTwoColumnCompare,
  ListSimpleText,
  ListHorizontalPeek,
  ListHeroWithList,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "asymmetric3", Component: ListAsymmetric3 },
  { id: "numberedVertical", Component: ListNumberedVertical },
  { id: "staggered", Component: ListStaggered },
  { id: "fullscreenSequence", Component: ListFullscreenSequence },
  { id: "minimalLeft", Component: ListMinimalLeft },
  { id: "statsFocused", Component: ListStatsFocused },
  { id: "timeline", Component: ListTimeline },
  { id: "unevenGrid", Component: ListUnevenGrid },
  { id: "twoColumnCompare", Component: ListTwoColumnCompare },
  { id: "simpleText", Component: ListSimpleText },
  { id: "horizontalPeek", Component: ListHorizontalPeek },
  { id: "heroWithList", Component: ListHeroWithList },
];

export const ListShowcase = () => (
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

export const LIST_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
