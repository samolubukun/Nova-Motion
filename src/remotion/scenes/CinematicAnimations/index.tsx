/**
 * Cinematic Animations - Individual Component Exports
 * 
 * Re-exports all cinematic animation components
 */

import { CinematicEpic } from "./CinematicEpic";
import { CinematicHorror } from "./CinematicHorror";
import { CinematicRomance } from "./CinematicRomance";
import { CinematicAction } from "./CinematicAction";
import { CinematicDocumentary } from "./CinematicDocumentary";
import { CinematicSciFi } from "./CinematicSciFi";
import { CinematicNoir } from "./CinematicNoir";
import { CinematicAnime } from "./CinematicAnime";
import { CinematicVintage } from "./CinematicVintage";
import { CinematicMinimalEnd } from "./CinematicMinimalEnd";

export {
  CinematicEpic,
  CinematicHorror,
  CinematicRomance,
  CinematicAction,
  CinematicDocumentary,
  CinematicSciFi,
  CinematicNoir,
  CinematicAnime,
  CinematicVintage,
  CinematicMinimalEnd,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "epic", Component: CinematicEpic },
  { id: "horror", Component: CinematicHorror },
  { id: "romance", Component: CinematicRomance },
  { id: "action", Component: CinematicAction },
  { id: "documentary", Component: CinematicDocumentary },
  { id: "sciFi", Component: CinematicSciFi },
  { id: "noir", Component: CinematicNoir },
  { id: "anime", Component: CinematicAnime },
  { id: "vintage", Component: CinematicVintage },
  { id: "minimalEnd", Component: CinematicMinimalEnd },
];

export const CinematicShowcase = () => (
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

export const CINEMATIC_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
