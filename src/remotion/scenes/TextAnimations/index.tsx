/**
 * Text Animations - テキストアニメーション集
 * 
 * After Effects/Motion Graphicsで頻繁に使用されるテキストアニメーション
 */

// Individual components
export { TextKinetic } from "./TextKinetic";
export { TextScramble } from "./TextScramble";
export { TextWave } from "./TextWave";
export { TextSplit } from "./TextSplit";
export { TextMaskReveal } from "./TextMaskReveal";
export { TextGlitch } from "./TextGlitch";
export { TextNeon } from "./TextNeon";
export { Text3DFlip } from "./Text3DFlip";
export { TextTypewriter } from "./TextTypewriter";
export { TextCounter } from "./TextCounter";
export { TextGradient } from "./TextGradient";
export { TextExplode } from "./TextExplode";

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../../common";
import { TextKinetic } from "./TextKinetic";
import { TextScramble } from "./TextScramble";
import { TextWave } from "./TextWave";
import { TextSplit } from "./TextSplit";
import { TextMaskReveal } from "./TextMaskReveal";
import { TextGlitch } from "./TextGlitch";
import { TextNeon } from "./TextNeon";
import { Text3DFlip } from "./Text3DFlip";
import { TextTypewriter } from "./TextTypewriter";
import { TextCounter } from "./TextCounter";
import { TextGradient } from "./TextGradient";
import { TextExplode } from "./TextExplode";

const SCENE_DURATION = 90; // 3 seconds at 30fps

const scenes = [
  { id: "kinetic", Component: TextKinetic },
  { id: "scramble", Component: TextScramble },
  { id: "wave", Component: TextWave },
  { id: "split", Component: TextSplit },
  { id: "maskReveal", Component: TextMaskReveal },
  { id: "glitch", Component: TextGlitch },
  { id: "neon", Component: TextNeon },
  { id: "3dFlip", Component: Text3DFlip },
  { id: "typewriter", Component: TextTypewriter },
  { id: "counter", Component: TextCounter },
  { id: "gradient", Component: TextGradient },
  { id: "explode", Component: TextExplode },
];

export const TextShowcase = () => (
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

export const TEXT_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
