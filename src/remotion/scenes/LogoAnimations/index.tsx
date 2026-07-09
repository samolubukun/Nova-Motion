/**
 * Logo Animations - Individual Component Exports
 * 
 * Re-exports all logo animation components
 */

import { LogoStroke } from "./LogoStroke";
import { Logo3DRotate } from "./Logo3DRotate";
import { LogoParticles } from "./LogoParticles";
import { LogoMaskReveal } from "./LogoMaskReveal";
import { LogoGlitch } from "./LogoGlitch";
import { LogoMorph } from "./LogoMorph";
import { LogoSplitScreen } from "./LogoSplitScreen";
import { LogoLightTrail } from "./LogoLightTrail";
import { LogoStamp } from "./LogoStamp";
import { LogoNeonSign } from "./LogoNeonSign";

export {
  LogoStroke,
  Logo3DRotate,
  LogoParticles,
  LogoMaskReveal,
  LogoGlitch,
  LogoMorph,
  LogoSplitScreen,
  LogoLightTrail,
  LogoStamp,
  LogoNeonSign,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "stroke", Component: LogoStroke },
  { id: "3dRotate", Component: Logo3DRotate },
  { id: "particles", Component: LogoParticles },
  { id: "maskReveal", Component: LogoMaskReveal },
  { id: "glitch", Component: LogoGlitch },
  { id: "morph", Component: LogoMorph },
  { id: "splitScreen", Component: LogoSplitScreen },
  { id: "lightTrail", Component: LogoLightTrail },
  { id: "stamp", Component: LogoStamp },
  { id: "neonSign", Component: LogoNeonSign },
];

export const LogoShowcase = () => (
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

export const LOGO_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
