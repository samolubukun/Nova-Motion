import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";

// BackgroundAnimations
import { BackgroundAurora } from "../scenes/BackgroundAnimations/BackgroundAurora";
import { BackgroundBokeh } from "../scenes/BackgroundAnimations/BackgroundBokeh";
import { BackgroundFlowingGradient } from "../scenes/BackgroundAnimations/BackgroundFlowingGradient";
import { BackgroundGeometric } from "../scenes/BackgroundAnimations/BackgroundGeometric";
import { BackgroundGrid } from "../scenes/BackgroundAnimations/BackgroundGrid";
import { BackgroundMeshGradient } from "../scenes/BackgroundAnimations/BackgroundMeshGradient";
import { BackgroundNoiseTexture } from "../scenes/BackgroundAnimations/BackgroundNoiseTexture";
import { BackgroundPerspectiveGrid } from "../scenes/BackgroundAnimations/BackgroundPerspectiveGrid";
import { BackgroundRadial } from "../scenes/BackgroundAnimations/BackgroundRadial";
import { BackgroundWaves } from "../scenes/BackgroundAnimations/BackgroundWaves";

// CinematicAnimations
import { CinematicAction } from "../scenes/CinematicAnimations/CinematicAction";
import { CinematicAnime } from "../scenes/CinematicAnimations/CinematicAnime";
import { CinematicDocumentary } from "../scenes/CinematicAnimations/CinematicDocumentary";
import { CinematicEpic } from "../scenes/CinematicAnimations/CinematicEpic";
import { CinematicHorror } from "../scenes/CinematicAnimations/CinematicHorror";
import { CinematicMinimalEnd } from "../scenes/CinematicAnimations/CinematicMinimalEnd";
import { CinematicNoir } from "../scenes/CinematicAnimations/CinematicNoir";
import { CinematicRomance } from "../scenes/CinematicAnimations/CinematicRomance";
import { CinematicSciFi } from "../scenes/CinematicAnimations/CinematicSciFi";
import { CinematicVintage } from "../scenes/CinematicAnimations/CinematicVintage";

// DataAnimations
import { DataBarChart } from "../scenes/DataAnimations/DataBarChart";
import { DataGauge } from "../scenes/DataAnimations/DataGauge";
import { DataLineChart } from "../scenes/DataAnimations/DataLineChart";
import { DataPieChart } from "../scenes/DataAnimations/DataPieChart";
import { DataProgressBars } from "../scenes/DataAnimations/DataProgressBars";
import { DataRanking } from "../scenes/DataAnimations/DataRanking";
import { DataStatsCards } from "../scenes/DataAnimations/DataStatsCards";
import { DataTimeline } from "../scenes/DataAnimations/DataTimeline";

// DemoAnimations
import { DemoAddressBar } from "../scenes/DemoAnimations/DemoAddressBar";
import { DemoCursorClick } from "../scenes/DemoAnimations/DemoCursorClick";
import { DemoDragDrop } from "../scenes/DemoAnimations/DemoDragDrop";
import { DemoMenuExpand } from "../scenes/DemoAnimations/DemoMenuExpand";
import { DemoModal } from "../scenes/DemoAnimations/DemoModal";
import { DemoPageTransition } from "../scenes/DemoAnimations/DemoPageTransition";
import { DemoScroll } from "../scenes/DemoAnimations/DemoScroll";
import { DemoSearchFilter } from "../scenes/DemoAnimations/DemoSearchFilter";
import { DemoTextInput } from "../scenes/DemoAnimations/DemoTextInput";
import { DemoTooltip } from "../scenes/DemoAnimations/DemoTooltip";
import { DemoWizard } from "../scenes/DemoAnimations/DemoWizard";
import { DemoZoomFocus } from "../scenes/DemoAnimations/DemoZoomFocus";

// DemoAnimations\shared
import { ClickRipple } from "../scenes/DemoAnimations/shared/ClickRipple";
import { Cursor } from "../scenes/DemoAnimations/shared/Cursor";
import { Highlight } from "../scenes/DemoAnimations/shared/Highlight";

// EffectAnimations
import { EffectChromaticAberration } from "../scenes/EffectAnimations/EffectChromaticAberration";
import { EffectDepthOfField } from "../scenes/EffectAnimations/EffectDepthOfField";
import { EffectDuotone } from "../scenes/EffectAnimations/EffectDuotone";
import { EffectFilmGrain } from "../scenes/EffectAnimations/EffectFilmGrain";
import { EffectGlow } from "../scenes/EffectAnimations/EffectGlow";
import { EffectKaleidoscope } from "../scenes/EffectAnimations/EffectKaleidoscope";
import { EffectLightLeak } from "../scenes/EffectAnimations/EffectLightLeak";
import { EffectMatrix } from "../scenes/EffectAnimations/EffectMatrix";
import { EffectNoise } from "../scenes/EffectAnimations/EffectNoise";
import { EffectVHS } from "../scenes/EffectAnimations/EffectVHS";

// LayoutAnimations
import { LayoutAsymmetric } from "../scenes/LayoutAnimations/LayoutAsymmetric";
import { LayoutDiagonal } from "../scenes/LayoutAnimations/LayoutDiagonal";
import { LayoutFrameInFrame } from "../scenes/LayoutAnimations/LayoutFrameInFrame";
import { LayoutFullscreenType } from "../scenes/LayoutAnimations/LayoutFullscreenType";
import { LayoutGiantNumber } from "../scenes/LayoutAnimations/LayoutGiantNumber";
import { LayoutGridBreak } from "../scenes/LayoutAnimations/LayoutGridBreak";
import { LayoutLayered } from "../scenes/LayoutAnimations/LayoutLayered";
import { LayoutMultiColumn } from "../scenes/LayoutAnimations/LayoutMultiColumn";
import { LayoutOffGrid } from "../scenes/LayoutAnimations/LayoutOffGrid";
import { LayoutSplitContrast } from "../scenes/LayoutAnimations/LayoutSplitContrast";
import { LayoutVerticalMix } from "../scenes/LayoutAnimations/LayoutVerticalMix";
import { LayoutWhitespace } from "../scenes/LayoutAnimations/LayoutWhitespace";

// LiquidAnimations
import { LiquidBlob } from "../scenes/LiquidAnimations/LiquidBlob";
import { LiquidCalligraphyInk } from "../scenes/LiquidAnimations/LiquidCalligraphyInk";
import { LiquidFluidWave } from "../scenes/LiquidAnimations/LiquidFluidWave";
import { LiquidInkSplash } from "../scenes/LiquidAnimations/LiquidInkSplash";
import { LiquidMorphBlob } from "../scenes/LiquidAnimations/LiquidMorphBlob";
import { LiquidOilSpill } from "../scenes/LiquidAnimations/LiquidOilSpill";
import { LiquidPaintDrip } from "../scenes/LiquidAnimations/LiquidPaintDrip";
import { LiquidSplatter } from "../scenes/LiquidAnimations/LiquidSplatter";
import { LiquidSwirl } from "../scenes/LiquidAnimations/LiquidSwirl";
import { LiquidWaterDrop } from "../scenes/LiquidAnimations/LiquidWaterDrop";

// LiquidAnimations\shared
import { generateBlobPath } from "../scenes/LiquidAnimations/shared/blobUtils";

// ListAnimations
import { ListAsymmetric3 } from "../scenes/ListAnimations/ListAsymmetric3";
import { ListFullscreenSequence } from "../scenes/ListAnimations/ListFullscreenSequence";
import { ListHeroWithList } from "../scenes/ListAnimations/ListHeroWithList";
import { ListHorizontalPeek } from "../scenes/ListAnimations/ListHorizontalPeek";
import { ListMinimalLeft } from "../scenes/ListAnimations/ListMinimalLeft";
import { ListNumberedVertical } from "../scenes/ListAnimations/ListNumberedVertical";
import { ListSimpleText } from "../scenes/ListAnimations/ListSimpleText";
import { ListStaggered } from "../scenes/ListAnimations/ListStaggered";
import { ListStatsFocused } from "../scenes/ListAnimations/ListStatsFocused";
import { ListTimeline } from "../scenes/ListAnimations/ListTimeline";
import { ListTwoColumnCompare } from "../scenes/ListAnimations/ListTwoColumnCompare";
import { ListUnevenGrid } from "../scenes/ListAnimations/ListUnevenGrid";

// LogoAnimations
import { Logo3DRotate } from "../scenes/LogoAnimations/Logo3DRotate";
import { LogoGlitch } from "../scenes/LogoAnimations/LogoGlitch";
import { LogoLightTrail } from "../scenes/LogoAnimations/LogoLightTrail";
import { LogoMaskReveal } from "../scenes/LogoAnimations/LogoMaskReveal";
import { LogoMorph } from "../scenes/LogoAnimations/LogoMorph";
import { LogoNeonSign } from "../scenes/LogoAnimations/LogoNeonSign";
import { LogoParticles } from "../scenes/LogoAnimations/LogoParticles";
import { LogoSplitScreen } from "../scenes/LogoAnimations/LogoSplitScreen";
import { LogoStamp } from "../scenes/LogoAnimations/LogoStamp";
import { LogoStroke } from "../scenes/LogoAnimations/LogoStroke";

// ParticleAnimations
import { ParticleBubbles } from "../scenes/ParticleAnimations/ParticleBubbles";
import { ParticleConfetti } from "../scenes/ParticleAnimations/ParticleConfetti";
import { ParticleFireworks } from "../scenes/ParticleAnimations/ParticleFireworks";
import { ParticleLightning } from "../scenes/ParticleAnimations/ParticleLightning";
import { ParticleMagneticField } from "../scenes/ParticleAnimations/ParticleMagneticField";
import { ParticleSakura } from "../scenes/ParticleAnimations/ParticleSakura";
import { ParticleShootingStars } from "../scenes/ParticleAnimations/ParticleShootingStars";
import { ParticleSmoke } from "../scenes/ParticleAnimations/ParticleSmoke";
import { ParticleSnow } from "../scenes/ParticleAnimations/ParticleSnow";
import { ParticleSparks } from "../scenes/ParticleAnimations/ParticleSparks";

// RollerAnimations
import { Roller3DCarousel } from "../scenes/RollerAnimations/Roller3DCarousel";
import { RollerBlur } from "../scenes/RollerAnimations/RollerBlur";
import { RollerCountdown } from "../scenes/RollerAnimations/RollerCountdown";
import { RollerDramaticStop } from "../scenes/RollerAnimations/RollerDramaticStop";
import { RollerDrum } from "../scenes/RollerAnimations/RollerDrum";
import { RollerFadeSlide } from "../scenes/RollerAnimations/RollerFadeSlide";
import { RollerFlip } from "../scenes/RollerAnimations/RollerFlip";
import { RollerGlitch } from "../scenes/RollerAnimations/RollerGlitch";
import { RollerGradientWave } from "../scenes/RollerAnimations/RollerGradientWave";
import { RollerLiquid } from "../scenes/RollerAnimations/RollerLiquid";
import { RollerMaskSlide } from "../scenes/RollerAnimations/RollerMaskSlide";
import { RollerMultiSlot } from "../scenes/RollerAnimations/RollerMultiSlot";
import { RollerOutlineHighlight } from "../scenes/RollerAnimations/RollerOutlineHighlight";
import { RollerPerspectiveStripes } from "../scenes/RollerAnimations/RollerPerspectiveStripes";
import { RollerScaleBounce } from "../scenes/RollerAnimations/RollerScaleBounce";
import { RollerShuffle } from "../scenes/RollerAnimations/RollerShuffle";
import { RollerSlotMachine } from "../scenes/RollerAnimations/RollerSlotMachine";
import { RollerSlotReveal } from "../scenes/RollerAnimations/RollerSlotReveal";
import { RollerSplitFlap } from "../scenes/RollerAnimations/RollerSplitFlap";
import { RollerTypewriter } from "../scenes/RollerAnimations/RollerTypewriter";
import { RollerVerticalList } from "../scenes/RollerAnimations/RollerVerticalList";
import { RollerWave } from "../scenes/RollerAnimations/RollerWave";

// ShapeAnimations
import { Shape3DCube } from "../scenes/ShapeAnimations/Shape3DCube";
import { ShapeCircularProgress } from "../scenes/ShapeAnimations/ShapeCircularProgress";
import { ShapeExplosion } from "../scenes/ShapeAnimations/ShapeExplosion";
import { ShapeHelix } from "../scenes/ShapeAnimations/ShapeHelix";
import { ShapeHexGrid } from "../scenes/ShapeAnimations/ShapeHexGrid";
import { ShapeMandala } from "../scenes/ShapeAnimations/ShapeMandala";
import { ShapeMorphing } from "../scenes/ShapeAnimations/ShapeMorphing";
import { ShapeParticleField } from "../scenes/ShapeAnimations/ShapeParticleField";
import { ShapeRipples } from "../scenes/ShapeAnimations/ShapeRipples";
import { ShapeSpinningRings } from "../scenes/ShapeAnimations/ShapeSpinningRings";

// TextAnimations
import { Text3DFlip } from "../scenes/TextAnimations/Text3DFlip";
import { TextCounter } from "../scenes/TextAnimations/TextCounter";
import { TextExplode } from "../scenes/TextAnimations/TextExplode";
import { TextGlitch } from "../scenes/TextAnimations/TextGlitch";
import { TextGradient } from "../scenes/TextAnimations/TextGradient";
import { TextKinetic } from "../scenes/TextAnimations/TextKinetic";
import { TextMaskReveal } from "../scenes/TextAnimations/TextMaskReveal";
import { TextNeon } from "../scenes/TextAnimations/TextNeon";
import { TextScramble } from "../scenes/TextAnimations/TextScramble";
import { TextSplit } from "../scenes/TextAnimations/TextSplit";
import { TextTypewriter } from "../scenes/TextAnimations/TextTypewriter";
import { TextWave } from "../scenes/TextAnimations/TextWave";

// ThemeAnimations
import { Theme3DGlass } from "../scenes/ThemeAnimations/Theme3DGlass";
import { ThemeArtDeco } from "../scenes/ThemeAnimations/ThemeArtDeco";
import { ThemeBauhaus } from "../scenes/ThemeAnimations/ThemeBauhaus";
import { ThemeBoho } from "../scenes/ThemeAnimations/ThemeBoho";
import { ThemeBrutalistWeb } from "../scenes/ThemeAnimations/ThemeBrutalistWeb";
import { ThemeCosmic } from "../scenes/ThemeAnimations/ThemeCosmic";
import { ThemeCyberpunk } from "../scenes/ThemeAnimations/ThemeCyberpunk";
import { ThemeDarkMode } from "../scenes/ThemeAnimations/ThemeDarkMode";
import { ThemeDuotone } from "../scenes/ThemeAnimations/ThemeDuotone";
import { ThemeGeometricAbstract } from "../scenes/ThemeAnimations/ThemeGeometricAbstract";
import { ThemeGlassmorphism } from "../scenes/ThemeAnimations/ThemeGlassmorphism";
import { ThemeGradient } from "../scenes/ThemeAnimations/ThemeGradient";
import { ThemeHolographic } from "../scenes/ThemeAnimations/ThemeHolographic";
import { ThemeIndustrial } from "../scenes/ThemeAnimations/ThemeIndustrial";
import { ThemeIsometric } from "../scenes/ThemeAnimations/ThemeIsometric";
import { ThemeJapanese } from "../scenes/ThemeAnimations/ThemeJapanese";
import { ThemeLuxury } from "../scenes/ThemeAnimations/ThemeLuxury";
import { ThemeMemphis } from "../scenes/ThemeAnimations/ThemeMemphis";
import { ThemeMinimalist } from "../scenes/ThemeAnimations/ThemeMinimalist";
import { ThemeMonochrome } from "../scenes/ThemeAnimations/ThemeMonochrome";
import { ThemeNatural } from "../scenes/ThemeAnimations/ThemeNatural";
import { ThemeNeobrutalism } from "../scenes/ThemeAnimations/ThemeNeobrutalism";
import { ThemeNeon } from "../scenes/ThemeAnimations/ThemeNeon";
import { ThemeNeumorphism } from "../scenes/ThemeAnimations/ThemeNeumorphism";
import { ThemeOrganic } from "../scenes/ThemeAnimations/ThemeOrganic";
import { ThemePaperCut } from "../scenes/ThemeAnimations/ThemePaperCut";
import { ThemePop } from "../scenes/ThemeAnimations/ThemePop";
import { ThemeRetro } from "../scenes/ThemeAnimations/ThemeRetro";
import { ThemeSwiss } from "../scenes/ThemeAnimations/ThemeSwiss";
import { ThemeTech } from "../scenes/ThemeAnimations/ThemeTech";
import { ThemeWatercolor } from "../scenes/ThemeAnimations/ThemeWatercolor";
import { ThemeY2K } from "../scenes/ThemeAnimations/ThemeY2K";

// TransitionAnimations
import { TransitionBlinds } from "../scenes/TransitionAnimations/TransitionBlinds";
import { TransitionBoxReveal } from "../scenes/TransitionAnimations/TransitionBoxReveal";
import { TransitionCircleWipe } from "../scenes/TransitionAnimations/TransitionCircleWipe";
import { TransitionDiagonalSlice } from "../scenes/TransitionAnimations/TransitionDiagonalSlice";
import { TransitionFlash } from "../scenes/TransitionAnimations/TransitionFlash";
import { TransitionGlitch } from "../scenes/TransitionAnimations/TransitionGlitch";
import { TransitionLineSweep } from "../scenes/TransitionAnimations/TransitionLineSweep";
import { TransitionLiquidMorph } from "../scenes/TransitionAnimations/TransitionLiquidMorph";
import { TransitionShutter } from "../scenes/TransitionAnimations/TransitionShutter";
import { TransitionZoomBlur } from "../scenes/TransitionAnimations/TransitionZoomBlur";

// UIAnimations
import { UIButton } from "../scenes/UIAnimations/UIButton";
import { UICard } from "../scenes/UIAnimations/UICard";
import { UIDropdown } from "../scenes/UIAnimations/UIDropdown";
import { UIForm } from "../scenes/UIAnimations/UIForm";
import { UILoading } from "../scenes/UIAnimations/UILoading";
import { UIModal } from "../scenes/UIAnimations/UIModal";
import { UINavigation } from "../scenes/UIAnimations/UINavigation";
import { UITabs } from "../scenes/UIAnimations/UITabs";
import { UIToast } from "../scenes/UIAnimations/UIToast";
import { UIToggle } from "../scenes/UIAnimations/UIToggle";


export interface MotionGraphicsScene {
  type: string;
  durationFrames: number;
  props: any;
}

export interface MotionGraphicsStoryboard {
  shortTitle: string;
  scenes: Array<MotionGraphicsScene>;
  audio?: Array<{
    startMs: number;
    endMs: number;
    audioUrl: string;
  }>;
  music?: Array<{
    audioUrl: string;
    volume?: number;
  }>;
}

const componentsRegistry: Record<string, React.ComponentType<any>> = {
  BackgroundAurora,
  BackgroundBokeh,
  BackgroundFlowingGradient,
  BackgroundGeometric,
  BackgroundGrid,
  BackgroundMeshGradient,
  BackgroundNoiseTexture,
  BackgroundPerspectiveGrid,
  BackgroundRadial,
  BackgroundWaves,
  CinematicAction,
  CinematicAnime,
  CinematicDocumentary,
  CinematicEpic,
  CinematicHorror,
  CinematicMinimalEnd,
  CinematicNoir,
  CinematicRomance,
  CinematicSciFi,
  CinematicVintage,
  DataBarChart,
  DataGauge,
  DataLineChart,
  DataPieChart,
  DataProgressBars,
  DataRanking,
  DataStatsCards,
  DataTimeline,
  DemoAddressBar,
  DemoCursorClick,
  DemoDragDrop,
  DemoMenuExpand,
  DemoModal,
  DemoPageTransition,
  DemoScroll,
  DemoSearchFilter,
  DemoTextInput,
  DemoTooltip,
  DemoWizard,
  DemoZoomFocus,
  ClickRipple,
  Cursor,
  Highlight,
  EffectChromaticAberration,
  EffectDepthOfField,
  EffectDuotone,
  EffectFilmGrain,
  EffectGlow,
  EffectKaleidoscope,
  EffectLightLeak,
  EffectMatrix,
  EffectNoise,
  EffectVHS,
  LayoutAsymmetric,
  LayoutDiagonal,
  LayoutFrameInFrame,
  LayoutFullscreenType,
  LayoutGiantNumber,
  LayoutGridBreak,
  LayoutLayered,
  LayoutMultiColumn,
  LayoutOffGrid,
  LayoutSplitContrast,
  LayoutVerticalMix,
  LayoutWhitespace,
  LiquidBlob,
  LiquidCalligraphyInk,
  LiquidFluidWave,
  LiquidInkSplash,
  LiquidMorphBlob,
  LiquidOilSpill,
  LiquidPaintDrip,
  LiquidSplatter,
  LiquidSwirl,
  LiquidWaterDrop,
  generateBlobPath,
  ListAsymmetric3,
  ListFullscreenSequence,
  ListHeroWithList,
  ListHorizontalPeek,
  ListMinimalLeft,
  ListNumberedVertical,
  ListSimpleText,
  ListStaggered,
  ListStatsFocused,
  ListTimeline,
  ListTwoColumnCompare,
  ListUnevenGrid,
  Logo3DRotate,
  LogoGlitch,
  LogoLightTrail,
  LogoMaskReveal,
  LogoMorph,
  LogoNeonSign,
  LogoParticles,
  LogoSplitScreen,
  LogoStamp,
  LogoStroke,
  ParticleBubbles,
  ParticleConfetti,
  ParticleFireworks,
  ParticleLightning,
  ParticleMagneticField,
  ParticleSakura,
  ParticleShootingStars,
  ParticleSmoke,
  ParticleSnow,
  ParticleSparks,
  Roller3DCarousel,
  RollerBlur,
  RollerCountdown,
  RollerDramaticStop,
  RollerDrum,
  RollerFadeSlide,
  RollerFlip,
  RollerGlitch,
  RollerGradientWave,
  RollerLiquid,
  RollerMaskSlide,
  RollerMultiSlot,
  RollerOutlineHighlight,
  RollerPerspectiveStripes,
  RollerScaleBounce,
  RollerShuffle,
  RollerSlotMachine,
  RollerSlotReveal,
  RollerSplitFlap,
  RollerTypewriter,
  RollerVerticalList,
  RollerWave,
  Shape3DCube,
  ShapeCircularProgress,
  ShapeExplosion,
  ShapeHelix,
  ShapeHexGrid,
  ShapeMandala,
  ShapeMorphing,
  ShapeParticleField,
  ShapeRipples,
  ShapeSpinningRings,
  Text3DFlip,
  TextCounter,
  TextExplode,
  TextGlitch,
  TextGradient,
  TextKinetic,
  TextMaskReveal,
  TextNeon,
  TextScramble,
  TextSplit,
  TextTypewriter,
  TextWave,
  Theme3DGlass,
  ThemeArtDeco,
  ThemeBauhaus,
  ThemeBoho,
  ThemeBrutalistWeb,
  ThemeCosmic,
  ThemeCyberpunk,
  ThemeDarkMode,
  ThemeDuotone,
  ThemeGeometricAbstract,
  ThemeGlassmorphism,
  ThemeGradient,
  ThemeHolographic,
  ThemeIndustrial,
  ThemeIsometric,
  ThemeJapanese,
  ThemeLuxury,
  ThemeMemphis,
  ThemeMinimalist,
  ThemeMonochrome,
  ThemeNatural,
  ThemeNeobrutalism,
  ThemeNeon,
  ThemeNeumorphism,
  ThemeOrganic,
  ThemePaperCut,
  ThemePop,
  ThemeRetro,
  ThemeSwiss,
  ThemeTech,
  ThemeWatercolor,
  ThemeY2K,
  TransitionBlinds,
  TransitionBoxReveal,
  TransitionCircleWipe,
  TransitionDiagonalSlice,
  TransitionFlash,
  TransitionGlitch,
  TransitionLineSweep,
  TransitionLiquidMorph,
  TransitionShutter,
  TransitionZoomBlur,
  UIButton,
  UICard,
  UIDropdown,
  UIForm,
  UILoading,
  UIModal,
  UINavigation,
  UITabs,
  UIToast,
  UIToggle
};


// Map scene type string to the actual React component
const SceneResolver: React.FC<{ type: string; props: any; durationFrames: number }> = ({ type, props, durationFrames }) => {
  const Component = componentsRegistry[type];
  if (!Component) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#09090b", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ color: "white", fontSize: 32, fontFamily: "sans-serif" }}>
          Scene: {type}
        </div>
      </AbsoluteFill>
    );
  }
  return <Component {...props} durationFrames={durationFrames} />;
};

export const MotionGraphics: React.FC<{ storyboard: MotionGraphicsStoryboard }> = ({ storyboard }) => {
  if (!storyboard || !storyboard.scenes) {
    return <AbsoluteFill style={{ backgroundColor: "black" }} />;
  }

  let cumulativeFrames = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#09090b" }}>
      {/* 1. Sequence the Motion Graphic Scenes */}
      {storyboard.scenes.map((scene, index) => {
        const startFrame = cumulativeFrames;
        cumulativeFrames += scene.durationFrames;

        return (
          <Sequence
            key={`scene-${index}`}
            from={startFrame}
            durationInFrames={scene.durationFrames}
          >
            <SceneResolver type={scene.type} props={scene.props} durationFrames={scene.durationFrames} />
          </Sequence>
        );
      })}

      {/* 2. Voiceover narration tracks */}
      {storyboard.audio &&
        storyboard.audio.map((clip, index) => {
          const startFrame = Math.floor((clip.startMs * 30) / 1000);
          const duration = Math.ceil(((clip.endMs - clip.startMs) * 30) / 1000);
          
          const resolvedAudioSrc =
            clip.audioUrl.startsWith("http://") || clip.audioUrl.startsWith("https://")
              ? clip.audioUrl
              : staticFile(clip.audioUrl);

          return (
            <Sequence
              key={`vo-${index}`}
              from={startFrame}
              durationInFrames={Math.max(1, duration)}
            >
              <Audio src={resolvedAudioSrc} />
            </Sequence>
          );
        })}

      {/* 3. Background Music tracks */}
      {storyboard.music &&
        storyboard.music.map((track, index) => {
          const resolvedMusicSrc =
            track.audioUrl.startsWith("http://") || track.audioUrl.startsWith("https://")
              ? track.audioUrl
              : staticFile(track.audioUrl);

          return (
            <Audio
              key={`bgm-${index}`}
              src={resolvedMusicSrc}
              volume={track.volume || 0.08}
            />
          );
        })}
    </AbsoluteFill>
  );
};