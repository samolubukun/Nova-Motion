import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { generateSpeechWithTimestamps, AURA_VOICES } from "./deepgram";

const SPACES_ENABLED = Boolean(
  process.env.SPACES_ENDPOINT &&
  process.env.SPACES_KEY &&
  process.env.SPACES_SECRET &&
  process.env.SPACES_BUCKET_NAME
);

const R2_ENABLED = Boolean(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

let s3Client: any = null;
if (SPACES_ENABLED || R2_ENABLED) {
  const { S3Client } = require("@aws-sdk/client-s3");
  if (SPACES_ENABLED) {
    s3Client = new S3Client({
      endpoint: process.env.SPACES_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SPACES_KEY!,
        secretAccessKey: process.env.SPACES_SECRET!,
      },
    });
  } else {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
}

async function uploadAsset(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const publicAssetDir = path.join(process.cwd(), "public", "assets-temp");
  if (!fs.existsSync(publicAssetDir)) {
    fs.mkdirSync(publicAssetDir, { recursive: true });
  }
  const localPath = path.join(publicAssetDir, filename);
  fs.writeFileSync(localPath, buffer);

  if (s3Client && (SPACES_ENABLED || R2_ENABLED)) {
    const { PutObjectCommand } = require("@aws-sdk/client-s3");
    const bucketName = SPACES_ENABLED ? process.env.SPACES_BUCKET_NAME! : process.env.R2_BUCKET_NAME!;
    const key = `assets/${filename}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: SPACES_ENABLED ? "public-read" : undefined,
        })
      );
      return SPACES_ENABLED 
        ? `${process.env.SPACES_PUBLIC_URL}/assets/${filename}`
        : `/assets-temp/${filename}`;
    } catch (s3Err) {
      console.warn("[S3/Spaces Upload] Failed uploading to cloud, relying on local copy:", s3Err);
    }
  }

  return `/assets-temp/${filename}`;
}

async function callOpenAI(endpoint: string, payload: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const res = await fetch(`https://api.openai.com/v1/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error: ${res.status} - ${errText}`);
  }

  return res.json();
}

export interface MotionGraphicsStoryboard {
  shortTitle: string;
  scenes: Array<{
    type: string;
    durationFrames: number;
    props: any;
    narration?: string; // Optional voiceover text for this specific scene
  }>;
  audio?: Array<{
    startMs: number;
    endMs: number;
    audioUrl: string;
  }>;
  music?: Array<{
    audioUrl: string;
    volume: number;
  }>;
  width?: number;
  height?: number;
}

export async function generateMotionGraphicsTimeline(
  prompt: string,
  topic: string,
  voice?: string,
  aspectRatio = "9:16"
): Promise<MotionGraphicsStoryboard> {
  const jobId = uuidv4();
  const selectedVoice = voice || AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  console.log(`[MotionGraphics Pipeline] Starting generation for topic [${topic}]`);

  const systemPrompt = `You are an expert motion graphics director.
Generate a dynamic, premium, highly engaging storyboard in JSON format based on the user's prompt.
You have access to the COMPLETE catalog of scene components (200+) across all categories below. Vary your selections to make the video feel active, professional, and visually engaging. DO NOT repeat the same component twice in a row.

CRITICAL: All scene components accept content props (text, title, subtitle, items, data, etc.). You MUST pass MEANINGFUL content from the user's prompt into these props — never use generic placeholder text. The content you pass will be displayed on screen.

Available Categories & Scene Components:

--- 1. LOGO ANIMATIONS (for intro/outro branding) ---
Components: Logo3DRotate, LogoGlitch, LogoLightTrail, LogoMaskReveal, LogoMorph, LogoNeonSign, LogoParticles, LogoSplitScreen, LogoStamp, LogoStroke.
Props: { text: string } — displays the brand/logo name.

--- 2. BACKGROUND ANIMATIONS (full-screen ambient backdrop) ---
Components: BackgroundAurora, BackgroundBokeh, BackgroundFlowingGradient, BackgroundGeometric, BackgroundGrid, BackgroundMeshGradient, BackgroundNoiseTexture, BackgroundPerspectiveGrid, BackgroundRadial, BackgroundWaves.
Props: { text: string } — a short tagline or brand name to overlay on the background.

--- 3. CINEMATIC TEXT TITLES (hero titles with dramatic styling) ---
Components: CinematicAction, CinematicAnime, CinematicDocumentary, CinematicEpic, CinematicHorror, CinematicMinimalEnd, CinematicNoir, CinematicRomance, CinematicSciFi, CinematicVintage.
Props: { title: string, subtitle: string } — main headline and supporting text.

--- 4. TYPOGRAPHY & TEXT ANIMATIONS ---
Components: Text3DFlip, TextExplode, TextGlitch, TextGradient, TextKinetic, TextMaskReveal, TextNeon, TextScramble, TextTypewriter, TextWave.
Props: { text: string } — a dynamic animated word or phrase.
Special: TextCounter — Props: { title?: string, unit?: string, targetNumber?: number, prefix?: string, suffix?: string }
Special: TextSplit — Props: { textTop: string, textBottom: string }

--- 5. DATA VISUALIZATION ---
Components: DataBarChart, DataGauge, DataLineChart, DataPieChart, DataProgressBars, DataRanking, DataStatsCards, DataTimeline.
Each has unique structured props — pass the data the user wants to visualize:
- DataBarChart: { title?: string, subtitle?: string, data?: Array<{ label: string, value: number, color?: string }> }
- DataGauge: { value?: number, maxValue?: number, title?: string }
- DataLineChart: { title?: string, subtitle?: string }
- DataPieChart: { title?: string, data?: Array<{ label: string, value: number, color?: string }> }
- DataProgressBars: { title?: string, data?: Array<{ label: string, value: number, color?: string }> }
- DataRanking: { title?: string, subtitle?: string, items?: Array<{ rank: number, name: string, value: string, change: "up"|"down"|"same" }> }
- DataStatsCards: { title?: string, subtitle?: string, mainValue?: number, mainChange?: string, mainPrefix?: string, data?: Array<{ label: string, value: string, color?: string }> }
- DataTimeline: { title?: string, events?: Array<{ year: string, title: string, desc: string }> }

--- 6. DEMO/UI INTERACTION ANIMATIONS (product or app mockups) ---
Components: DemoAddressBar, DemoCursorClick, DemoDragDrop, DemoMenuExpand, DemoModal, DemoPageTransition, DemoScroll, DemoSearchFilter, DemoTextInput, DemoTooltip, DemoWizard, DemoZoomFocus.
Props: { title?: string } — short label describing the interaction.

--- 7. POST-PRODUCTION EFFECTS ---
Components: EffectChromaticAberration, EffectDepthOfField, EffectDuotone, EffectFilmGrain, EffectGlow, EffectKaleidoscope, EffectLightLeak, EffectMatrix, EffectNoise, EffectVHS.
Props: { text?: string } — a word or phrase to display with the effect.

--- 8. LAYOUT & COMPOSITION (stylized page/panel layouts) ---
Components: LayoutAsymmetric, LayoutDiagonal, LayoutFrameInFrame, LayoutFullscreenType, LayoutGiantNumber, LayoutGridBreak, LayoutLayered, LayoutMultiColumn, LayoutOffGrid, LayoutSplitContrast, LayoutVerticalMix, LayoutWhitespace.
Props vary by component:
- LayoutAsymmetric: { title1?: string, title2?: string, badge?: string }
- LayoutDiagonal: { title?: string, subtitle1?: string, subtitle2?: string }
- LayoutFrameInFrame, LayoutFullscreenType, LayoutGridBreak, LayoutLayered, LayoutMultiColumn, LayoutOffGrid, LayoutVerticalMix, LayoutWhitespace: { title?: string }
- LayoutGiantNumber: { title?: string, number?: string }
- LayoutSplitContrast: { titleBefore?: string, titleAfter?: string }

--- 9. LIQUID/MORPHING ANIMATIONS (fluid organic motion) ---
Components: LiquidBlob, LiquidCalligraphyInk, LiquidFluidWave, LiquidInkSplash, LiquidMorphBlob, LiquidOilSpill, LiquidPaintDrip, LiquidSplatter, LiquidSwirl, LiquidWaterDrop.
Props: { text?: string } — a word to display with the liquid animation.

--- 10. LIST & GRID LAYOUTS ---
Components: ListAsymmetric3, ListFullscreenSequence, ListHeroWithList, ListHorizontalPeek, ListMinimalLeft, ListNumberedVertical, ListSimpleText, ListStaggered, ListStatsFocused, ListTimeline, ListTwoColumnCompare, ListUnevenGrid.
Props vary:
- ListAsymmetric3: { items?: Array<{ title: string, subtitle: string, description: string }> }
- ListFullscreenSequence: { items?: Array<{ num: string, text: string, color: string }> }
- ListHeroWithList: { title1?: string, title2?: string, items?: string[] }
- ListHorizontalPeek: { items?: Array<{ num: string, title: string, highlighted: boolean }> }
- ListMinimalLeft: { items?: string[] }
- ListNumberedVertical: { items?: Array<{ num: string, text: string }> }
- ListSimpleText: { items?: string[] }
- ListStaggered: { items?: Array<{ title: string, desc: string }> }
- ListStatsFocused: { stats?: Array<{ value: string, unit: string, label: string }> }
- ListTimeline: { title?: string, items?: Array<{ year: string, title: string, desc: string }> }
- ListTwoColumnCompare: { title?: string, leftItems?: string[], rightValues?: string[] }
- ListUnevenGrid: { title?: string, items?: Array<{ badge: string, title: string, description: string }> }

--- 11. PARTICLE SYSTEMS (ambient particle effects) ---
Components: ParticleBubbles, ParticleConfetti, ParticleFireworks, ParticleLightning, ParticleMagneticField, ParticleSakura, ParticleShootingStars, ParticleSmoke, ParticleSnow, ParticleSparks.
Props: { text?: string } — a word to display with the particle effect.

--- 12. ROLLER/TEXT CYCLING ANIMATIONS (animated rotating text) ---
Components: Roller3DCarousel, RollerBlur, RollerCountdown, RollerDramaticStop, RollerDrum, RollerFadeSlide, RollerFlip, RollerGlitch, RollerGradientWave, RollerLiquid, RollerMaskSlide, RollerMultiSlot, RollerOutlineHighlight, RollerPerspectiveStripes, RollerScaleBounce, RollerShuffle, RollerSlotMachine, RollerSlotReveal, RollerSplitFlap, RollerTypewriter, RollerVerticalList, RollerWave.
Common props: { title?: string, items?: string[] } — title is the heading, items are the cycling words/phrases.
Special variants:
- RollerCountdown, RollerSplitFlap, RollerShuffle: also accept { subtitle?: string }
- RollerFlip: also accepts { prefix?: string, suffix?: string }
- RollerMultiSlot: { slot1?: string[], slot2?: string[], slot3?: string[] } (3 independent cycling slots)
- RollerPerspectiveStripes: { items?: Array<{ text: string, color: string }> }
- RollerOutlineHighlight: { title?: string } (no items)

--- 13. GEOMETRIC SHAPES ---
Components: Shape3DCube, ShapeCircularProgress, ShapeExplosion, ShapeHelix, ShapeHexGrid, ShapeMandala, ShapeMorphing, ShapeParticleField, ShapeRipples, ShapeSpinningRings.
Props: { title?: string } — headline text for the shape animation.
Special: ShapeCircularProgress also accepts { percentage?: number }
Special: ShapeExplosion accepts { text?: string }
Special: ShapeParticleField also accepts { particleCount?: number }

--- 14. DESIGN THEMES (stylized design trend showcases) ---
Components: Theme3DGlass, ThemeArtDeco, ThemeBauhaus, ThemeBoho, ThemeBrutalistWeb, ThemeCosmic, ThemeCyberpunk, ThemeDarkMode, ThemeDuotone, ThemeGeometricAbstract, ThemeGlassmorphism, ThemeGradient, ThemeHolographic, ThemeIndustrial, ThemeIsometric, ThemeJapanese, ThemeLuxury, ThemeMemphis, ThemeMinimalist, ThemeMonochrome, ThemeNatural, ThemeNeobrutalism, ThemeNeon, ThemeNeumorphism, ThemeOrganic, ThemePaperCut, ThemePop, ThemeRetro, ThemeSwiss, ThemeTech, ThemeWatercolor, ThemeY2K.
Props: { title?: string, subtitle?: string } — headline and supporting text themed in the visual style.

--- 15. TRANSITIONS (between main chapters, duration: 20-30 frames) ---
Components: TransitionBlinds, TransitionBoxReveal, TransitionCircleWipe, TransitionDiagonalSlice, TransitionFlash, TransitionGlitch, TransitionLineSweep, TransitionLiquidMorph, TransitionShutter, TransitionZoomBlur.
Most accept: { labelA?: string, labelB?: string } — "before" and "after" labels.
Special: TransitionBoxReveal: { title?: string, gridSize?: number }
Note: Some transitions also accept visual-only props (direction, angle, flashColor, bladeCount, originX, originY, lineCount) for style control.

--- 16. UI COMPONENTS (interface element mockups) ---
Components: UIButton, UICard, UIDropdown, UIForm, UILoading, UIModal, UINavigation, UITabs, UIToast, UIToggle.
Props: { title?: string } — label text for the UI element.

Guidelines:
- Choose the best components matching the prompt context across ALL 16 categories above. Vary your choices! Do not repeat the same component twice in a row.
- Total scenes: between 5 to 20 scenes. Make the storyboard complete and narrative-driven.
- Keep the visual tone premium (use colors like cyan "#00ffd2", magenta "#ff007f", electric blue, purple, dark gray background).
- Generate optional narration scripts for each scene if the user wants voiceover.
- CRITICAL: Fill EVERY scene's props with real content from the user's prompt. The props are what gets displayed on screen.

Give output in strict JSON format:
{
  "shortTitle": "Title",
  "voiceoverEnabled": true,
  "scenes": [
    {
      "type": "TextGlitch",
      "durationFrames": 90,
      "props": { "text": "GO BIG" },
      "narration": "Narration text for this scene."
    }
  ]
}`;

  const response = await callOpenAI("chat/completions", {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  const storyboard: MotionGraphicsStoryboard = {
    shortTitle: parsed.shortTitle || topic.substring(0, 30),
    scenes: parsed.scenes || [],
    audio: [],
  };

  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let durationMs = 0;

  // Process scenes sequentially
  for (let i = 0; i < storyboard.scenes.length; i++) {
    const scene = storyboard.scenes[i];
    const sceneId = `${jobId}-mg-scene-${i}`;

    // Default duration if there is no voiceover
    let sceneDurationMs = Math.round((scene.durationFrames / 30) * 1000);

    // If voiceover is enabled and narration is present
    if (parsed.voiceoverEnabled && scene.narration) {
      const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);
      try {
        const wordTimestamps = await generateSpeechWithTimestamps(scene.narration, localAudioPath, selectedVoice);
        const audioBuffer = fs.readFileSync(localAudioPath);
        const audioUrl = await uploadAsset(audioBuffer, `${sceneId}.mp3`, "audio/mpeg");

        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        sceneDurationMs = Math.ceil((lastWord ? lastWord.end : 3) * 1000);

        // Adjust durationFrames to match voiceover duration exactly
        scene.durationFrames = Math.ceil((sceneDurationMs * 30) / 1000);

        storyboard.audio!.push({
          startMs: durationMs,
          endMs: durationMs + sceneDurationMs,
          audioUrl,
        });
      } catch (err) {
        console.warn(`[MotionGraphics Pipeline] Failed to generate TTS for scene ${i}:`, err);
      }
    }

    durationMs += sceneDurationMs;
  }

  // 4. Download and overlay background music track
  const backgroundTracks = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  ];
  const selectedTrack = backgroundTracks[Math.floor(Math.random() * backgroundTracks.length)];

  // Download selected music track locally
  const musicFilename = `music-${Math.floor(Math.random() * 1000000)}.mp3`;
  const musicLocalPath = path.join(tempDir, musicFilename);
  try {
    console.log(`[MotionGraphics Pipeline] Downloading background track: ${selectedTrack}`);
    const musicRes = await fetch(selectedTrack, { signal: AbortSignal.timeout(10000) });
    const musicBuffer = Buffer.from(await musicRes.arrayBuffer());
    fs.writeFileSync(musicLocalPath, musicBuffer);
    
    storyboard.music = [
      {
        audioUrl: `/assets-temp/${musicFilename}`,
        volume: 0.08,
      },
    ];
  } catch (err) {
    console.warn(`[MotionGraphics Pipeline] Failed to download music track locally:`, err);
    storyboard.music = [
      {
        audioUrl: selectedTrack,
        volume: 0.08,
      },
    ];
  }

  return storyboard;
}
