/**
 * Particle Animations - Individual Component Exports
 * 
 * Re-exports all particle animation components
 */

import { ParticleConfetti } from "./ParticleConfetti";
import { ParticleSnow } from "./ParticleSnow";
import { ParticleSparks } from "./ParticleSparks";
import { ParticleBubbles } from "./ParticleBubbles";
import { ParticleShootingStars } from "./ParticleShootingStars";
import { ParticleSmoke } from "./ParticleSmoke";
import { ParticleLightning } from "./ParticleLightning";
import { ParticleSakura } from "./ParticleSakura";
import { ParticleFireworks } from "./ParticleFireworks";
import { ParticleMagneticField } from "./ParticleMagneticField";

export {
  ParticleConfetti,
  ParticleSnow,
  ParticleSparks,
  ParticleBubbles,
  ParticleShootingStars,
  ParticleSmoke,
  ParticleLightning,
  ParticleSakura,
  ParticleFireworks,
  ParticleMagneticField,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "confetti", Component: ParticleConfetti },
  { id: "snow", Component: ParticleSnow },
  { id: "sparks", Component: ParticleSparks },
  { id: "bubbles", Component: ParticleBubbles },
  { id: "shootingStars", Component: ParticleShootingStars },
  { id: "smoke", Component: ParticleSmoke },
  { id: "lightning", Component: ParticleLightning },
  { id: "sakura", Component: ParticleSakura },
  { id: "fireworks", Component: ParticleFireworks },
  { id: "magneticField", Component: ParticleMagneticField },
];

export const ParticleShowcase = () => (
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

export const PARTICLE_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
