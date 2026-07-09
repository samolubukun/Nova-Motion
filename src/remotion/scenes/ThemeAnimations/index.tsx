/**
 * Theme Animations - Individual Component Exports
 * 
 * Re-exports all design theme animation components
 */

import { ThemeMinimalist } from "./ThemeMinimalist";
import { ThemeNeobrutalism } from "./ThemeNeobrutalism";
import { ThemeGlassmorphism } from "./ThemeGlassmorphism";
import { ThemeCyberpunk } from "./ThemeCyberpunk";
import { ThemeJapanese } from "./ThemeJapanese";
import { ThemeRetro } from "./ThemeRetro";
import { ThemeLuxury } from "./ThemeLuxury";
import { ThemePop } from "./ThemePop";
import { ThemeDarkMode } from "./ThemeDarkMode";
import { ThemeGradient } from "./ThemeGradient";
import { ThemeTech } from "./ThemeTech";
import { ThemeIsometric } from "./ThemeIsometric";
import { ThemeNatural } from "./ThemeNatural";
import { ThemeMonochrome } from "./ThemeMonochrome";
import { ThemeNeumorphism } from "./ThemeNeumorphism";
import { ThemeBoho } from "./ThemeBoho";
import { Theme3DGlass } from "./Theme3DGlass";
import { ThemeY2K } from "./ThemeY2K";
import { ThemeArtDeco } from "./ThemeArtDeco";
import { ThemeMemphis } from "./ThemeMemphis";
import { ThemeSwiss } from "./ThemeSwiss";
import { ThemeNeon } from "./ThemeNeon";
import { ThemeHolographic } from "./ThemeHolographic";
import { ThemePaperCut } from "./ThemePaperCut";
import { ThemeCosmic } from "./ThemeCosmic";
import { ThemeIndustrial } from "./ThemeIndustrial";
import { ThemeWatercolor } from "./ThemeWatercolor";
import { ThemeDuotone } from "./ThemeDuotone";
import { ThemeBauhaus } from "./ThemeBauhaus";
import { ThemeOrganic } from "./ThemeOrganic";
import { ThemeBrutalistWeb } from "./ThemeBrutalistWeb";
import { ThemeGeometricAbstract } from "./ThemeGeometricAbstract";

export {
  ThemeMinimalist,
  ThemeNeobrutalism,
  ThemeGlassmorphism,
  ThemeCyberpunk,
  ThemeJapanese,
  ThemeRetro,
  ThemeLuxury,
  ThemePop,
  ThemeDarkMode,
  ThemeGradient,
  ThemeTech,
  ThemeIsometric,
  ThemeNatural,
  ThemeMonochrome,
  ThemeNeumorphism,
  ThemeBoho,
  Theme3DGlass,
  ThemeY2K,
  ThemeArtDeco,
  ThemeMemphis,
  ThemeSwiss,
  ThemeNeon,
  ThemeHolographic,
  ThemePaperCut,
  ThemeCosmic,
  ThemeIndustrial,
  ThemeWatercolor,
  ThemeDuotone,
  ThemeBauhaus,
  ThemeOrganic,
  ThemeBrutalistWeb,
  ThemeGeometricAbstract,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "minimalist", Component: ThemeMinimalist },
  { id: "neobrutalism", Component: ThemeNeobrutalism },
  { id: "glassmorphism", Component: ThemeGlassmorphism },
  { id: "cyberpunk", Component: ThemeCyberpunk },
  { id: "japanese", Component: ThemeJapanese },
  { id: "retro", Component: ThemeRetro },
  { id: "luxury", Component: ThemeLuxury },
  { id: "pop", Component: ThemePop },
  { id: "darkMode", Component: ThemeDarkMode },
  { id: "gradient", Component: ThemeGradient },
  { id: "tech", Component: ThemeTech },
  { id: "isometric", Component: ThemeIsometric },
  { id: "natural", Component: ThemeNatural },
  { id: "monochrome", Component: ThemeMonochrome },
  { id: "neumorphism", Component: ThemeNeumorphism },
  { id: "boho", Component: ThemeBoho },
  { id: "3dGlass", Component: Theme3DGlass },
  { id: "y2k", Component: ThemeY2K },
  { id: "artDeco", Component: ThemeArtDeco },
  { id: "memphis", Component: ThemeMemphis },
  { id: "swiss", Component: ThemeSwiss },
  { id: "neon", Component: ThemeNeon },
  { id: "holographic", Component: ThemeHolographic },
  { id: "paperCut", Component: ThemePaperCut },
  { id: "cosmic", Component: ThemeCosmic },
  { id: "industrial", Component: ThemeIndustrial },
  { id: "watercolor", Component: ThemeWatercolor },
  { id: "duotone", Component: ThemeDuotone },
  { id: "bauhaus", Component: ThemeBauhaus },
  { id: "organic", Component: ThemeOrganic },
  { id: "brutalistWeb", Component: ThemeBrutalistWeb },
  { id: "geometricAbstract", Component: ThemeGeometricAbstract },
];

export const ThemeShowcase = () => (
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

export const THEME_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
