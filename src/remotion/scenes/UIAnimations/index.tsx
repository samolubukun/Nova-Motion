/**
 * UI Animations - Individual Component Exports
 * 
 * Re-exports all UI animation components
 */

import { UIButton } from "./UIButton";
import { UICard } from "./UICard";
import { UIModal } from "./UIModal";
import { UIToast } from "./UIToast";
import { UINavigation } from "./UINavigation";
import { UIDropdown } from "./UIDropdown";
import { UIToggle } from "./UIToggle";
import { UILoading } from "./UILoading";
import { UITabs } from "./UITabs";
import { UIForm } from "./UIForm";

export {
  UIButton,
  UICard,
  UIModal,
  UIToast,
  UINavigation,
  UIDropdown,
  UIToggle,
  UILoading,
  UITabs,
  UIForm,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "button", Component: UIButton },
  { id: "card", Component: UICard },
  { id: "modal", Component: UIModal },
  { id: "toast", Component: UIToast },
  { id: "navigation", Component: UINavigation },
  { id: "dropdown", Component: UIDropdown },
  { id: "toggle", Component: UIToggle },
  { id: "loading", Component: UILoading },
  { id: "tabs", Component: UITabs },
  { id: "form", Component: UIForm },
];

export const UIShowcase = () => (
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

export const UI_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
