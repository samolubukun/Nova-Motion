/**
 * Demo Animations - Individual Component Exports
 * 
 * Re-exports all demo/UI interaction animation components
 */

import { DemoCursorClick } from "./DemoCursorClick";
import { DemoScroll } from "./DemoScroll";
import { DemoZoomFocus } from "./DemoZoomFocus";
import { DemoTextInput } from "./DemoTextInput";
import { DemoDragDrop } from "./DemoDragDrop";
import { DemoTooltip } from "./DemoTooltip";
import { DemoPageTransition } from "./DemoPageTransition";
import { DemoMenuExpand } from "./DemoMenuExpand";
import { DemoModal } from "./DemoModal";
import { DemoWizard } from "./DemoWizard";
import { DemoSearchFilter } from "./DemoSearchFilter";
import { DemoAddressBar } from "./DemoAddressBar";

export {
  DemoCursorClick,
  DemoScroll,
  DemoZoomFocus,
  DemoTextInput,
  DemoDragDrop,
  DemoTooltip,
  DemoPageTransition,
  DemoMenuExpand,
  DemoModal,
  DemoWizard,
  DemoSearchFilter,
  DemoAddressBar,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "cursorClick", Component: DemoCursorClick },
  { id: "scroll", Component: DemoScroll },
  { id: "zoomFocus", Component: DemoZoomFocus },
  { id: "textInput", Component: DemoTextInput },
  { id: "dragDrop", Component: DemoDragDrop },
  { id: "tooltip", Component: DemoTooltip },
  { id: "pageTransition", Component: DemoPageTransition },
  { id: "menuExpand", Component: DemoMenuExpand },
  { id: "modal", Component: DemoModal },
  { id: "wizard", Component: DemoWizard },
  { id: "searchFilter", Component: DemoSearchFilter },
  { id: "addressBar", Component: DemoAddressBar },
];

export const DemoShowcase = () => (
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

export const DEMO_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
