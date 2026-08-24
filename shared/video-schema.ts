import { z } from "zod";

// === Animation Types ===
export const AnimationType = z.enum([
  "fadeIn",
  "slideUp",
  "slideDown",
  "slideLeft",
  "slideRight",
  "scale",
  "bounce",
  "typewriter",
]);
export type AnimationType = z.infer<typeof AnimationType>;

// === Video Types ===
export const VideoType = z.enum([
  "General",
  "TextAnimation",
  "SocialMedia",
  "Explainer",
  "AIVideo", // legacy alias for AIStoryboardVideo
  "AIStoryboardVideo",
  "StockVideo",
  "StockImage",
  "MotionGraphics",
  "TextToVideo",
  "MicroDrama",
  "UGC",
  "AgenticVideoGenerator",
  "Luma",
  "VoxVideo",
  "ZackDVideo",
  "ComicDramaVideo",
  "StickmanExplainerVideo",
]);
export type VideoType = z.infer<typeof VideoType>;

// === Scene Schema ===
export const SceneSchema = z.object({
  startSec: z.number().min(0),
  durationSec: z.number().min(0.5).max(120),
  text: z.string().min(1).max(500),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#1a1a2e"),
  bgColorTo: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(), // For gradient background
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#ffffff"),
  animation: AnimationType.default("fadeIn"),
  transition: z.enum(["none", "fade", "slideUp", "slideDown", "crossfade", "wipe"]).default("none").optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().min(12).max(500).optional(),
  stepNumber: z.number().min(1).optional(), // For Explainer template
  audioUrl: z.string().optional(),
  words: z.array(z.object({
    word: z.string(),
    start: z.number(),
    end: z.number(),
  })).optional(), // For kinetic word alignments
});
export type Scene = z.infer<typeof SceneSchema>;

// === Video Script Schema (what Claude generates) ===
export const VideoScriptSchema = z.object({
  title: z.string().min(1).max(200),
  durationSec: z.number().min(1).max(300), // Max 5 minutes
  fps: z.number().min(24).max(60).default(30),
  width: z.number().min(320).max(3840).default(1920),
  height: z.number().min(240).max(2160).default(1080),
  scenes: z.array(SceneSchema).min(1).max(50),
});
export type VideoScript = z.infer<typeof VideoScriptSchema>;

// === Render Request Schema (what the frontend sends) ===
export const RenderRequestSchema = z.object({
  videoType: VideoType,
  script: VideoScriptSchema.optional(),
  timeline: z.any().optional(),
});
export type RenderRequest = z.infer<typeof RenderRequestSchema>;

// All aspect ratios supported by the WaveSpeed seedance text-to-video model.
export const ASPECT_RATIOS = ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

// === Generate Request Schema (what the frontend sends to generate endpoint) ===
export const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  videoType: VideoType,
  durationSec: z.number().min(5).max(120).default(30),
  topic: z.string().optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("9:16").optional(),
  webhookUrl: z.string().url().optional(),
  voice: z.string().optional(),
  style: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional(),
});
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

// === TextToVideo Pipeline Request Schema (async, render-server side) ===
export const TextToVideoRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  topic: z.string().optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("9:16").optional(),
  voice: z.string().optional(),
  webhookUrl: z.string().url().optional(),
});
export type TextToVideoRequest = z.infer<typeof TextToVideoRequestSchema>;

// === MicroDrama Pipeline Request Schema (async, render-server side) ===
// Replicates the Open-AI-Micro-Drama-Generator idea2video / script2video modes.
// `idea` is required; if `script` is provided, story development is skipped
// and the raw script is used directly (script2video mode).
export const MicroDramaRequestSchema = z.object({
  idea: z.string().min(1).max(2000),
  script: z.string().max(4000).optional(),
  style: z.string().max(200).optional(),
  requirement: z.string().max(1000).optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("16:9").optional(),
  webhookUrl: z.string().url().optional(),
});
export type MicroDramaRequest = z.infer<typeof MicroDramaRequestSchema>;

// === UGC Pipeline Request Schema (async, render-server side) ===
// Replicates the Open-AI-UGC studio (Arcads / MakeUGC alternative) using
// WaveSpeed as the video provider.
// `prompt` is the UGC script and may reference uploaded reference images with
// `@image1`, `@image2`, ... tokens. When `images` is provided, the chosen
// model's image-to-video endpoint is used (I2V); otherwise text-to-video (T2V).
export const UGCRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  model: z.string().max(100).optional(),
  images: z.array(z.string().url()).max(7).optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("9:16").optional(),
  duration: z.number().min(3).max(30).optional(),
  resolution: z.string().max(20).optional(),
  mode: z.string().max(20).optional(),
  // Multi-scene UGC (Arcads-style): script → LLM scene breakdown → one TTS
  // voiceover → per-scene clips → timeline. Requires a TTS provider
  // (ELEVENLABS_API_KEY or DEEPGRAM_API_KEY).
  multiScene: z.boolean().optional(),
  voice: z.string().max(100).optional(),
  targetDurationSec: z.number().min(10).max(60).optional(),
  // Lip-sync each scene's mouth to the TTS voiceover via WaveSpeed
  // `sync/lipsync-2` (default on; adds ~$0.05/run + ~2min per scene).
  lipSync: z.boolean().optional(),
  webhookUrl: z.string().url().optional(),
});
export type UGCRequest = z.infer<typeof UGCRequestSchema>;

export const AgenticPlatform = z.enum([
  "youtube",
  "instagram_reels",
  "linkedin",
  "tiktok",
  "standard",
]);
export type AgenticPlatform = z.infer<typeof AgenticPlatform>;
export const AgenticVideoModel = z.enum([
  "seedanceStandard",
  "seedanceFast",
  "veoFastReference",
  "minimaxImage",
  "minimaxReference",
]);
export type AgenticVideoModel = z.infer<typeof AgenticVideoModel>;

// End-to-end concept-to-video mode based on the feature set described by the
// AI Video Generation Pipeline reference project.
export const AgenticVideoRequestSchema = z.object({
  title: z.string().min(1).max(200),
  brief: z.string().min(10).max(5000),
  targetAudience: z.string().min(1).max(500),
  durationSeconds: z.number().min(10).max(180).default(60),
  language: z.string().min(1).max(80).default("English"),
  tone: z.string().min(1).max(100).default("professional"),
  keyMessages: z.array(z.string().min(1).max(500)).max(10).optional(),
  callToAction: z.string().max(500).optional(),
  platform: AgenticPlatform.default("standard"),
  aspectRatio: z.enum(ASPECT_RATIOS).optional(),
  voice: z.string().max(100).optional(),
  style: z.string().max(500).optional(),
  videoModel: AgenticVideoModel.default("seedanceStandard"),
  videoResolution: z.enum(["480p", "720p", "1080p", "2k", "4k"]).optional(),
  characterDescription: z.string().max(1000).optional(),
  referenceImages: z.array(z.string().url()).max(7).optional(),
  lipSync: z.boolean().default(false).optional(),
  webhookUrl: z.string().url().optional(),
});
export type AgenticVideoRequest = z.infer<typeof AgenticVideoRequestSchema>;

// === Luma (Ray 3.2) Pipeline Request Schema (async, render-server side) ===
// One mode that covers every Ray 3.2 use-case: text-to-video, image-to-video,
// multi-keyframe, loop, extend, video edit, and video reframe. Optionally adds
// ElevenLabs voiceover + word captions (Ray produces silent video).
export const LumaUseCase = z.enum([
  "ugc_post",
  "product_ad",
  "product_launch",
  "real_estate",
  "event_promo",
  "education",
  "nonprofit",
  "social_generic",
  "custom",
]);
export type LumaUseCase = z.infer<typeof LumaUseCase>;

export const LumaExplicitOperation = z.enum(["edit", "reframe", "image_to_video"]);
export type LumaExplicitOperation = z.infer<typeof LumaExplicitOperation>;

export const LumaVideoDuration = z.enum(["5s", "10s"]);
export type LumaVideoDuration = z.infer<typeof LumaVideoDuration>;

export const LumaResolution = z.enum(["360p", "540p", "720p", "1080p"]);
export type LumaResolution = z.infer<typeof LumaResolution>;

export const LumaEditStrength = z.enum([
  "adhere_1", "adhere_2", "adhere_3",
  "flex_1", "flex_2", "flex_3",
  "reimagine_1", "reimagine_2", "reimagine_3",
]);
export type LumaEditStrength = z.infer<typeof LumaEditStrength>;

export const LumaRequestSchema = z.object({
  prompt: z.string().min(1).max(6000),
  title: z.string().max(200).optional(),
  useCase: LumaUseCase.default("custom").optional(),
  targetAudience: z.string().max(500).optional(),
  targetDurationSeconds: z.number().min(5).max(180).optional(),
  language: z.string().max(80).optional(),
  tone: z.string().max(100).optional(),
  style: z.string().max(500).optional(),
  referenceImages: z.array(z.string().url()).max(10).optional(),
  sourceVideoUrl: z.string().url().optional(),
  sourceVideoFileId: z.string().max(100).optional(),
  explicitOperation: LumaExplicitOperation.optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).optional(),
  resolution: LumaResolution.default("720p").optional(),
  duration: LumaVideoDuration.default("5s").optional(),
  hdr: z.boolean().default(false).optional(),
  loop: z.boolean().default(false).optional(),
  editStrength: LumaEditStrength.optional(),
  multiKeyframes: z.boolean().default(false).optional(),
  voice: z.string().max(100).optional(),
  generateAudio: z.boolean().default(false).optional(),
  sceneCount: z.number().min(1).max(6).optional(),
  webhookUrl: z.string().url().optional(),
});
export type LumaRequest = z.infer<typeof LumaRequestSchema>;

// === Vox (Vox-style paper-collage explainer) Request Schema ===
export const VoxTheme = z.enum([
  "swiss-modern",
  "american-retro",
  "punk-zine",
  "chinese-ink",
]);
export type VoxTheme = z.infer<typeof VoxTheme>;

export const VoxArc = z.enum([
  "hook_payoff",
  "pas",
  "bab",
  "how_it_works",
  "timeline",
  "man_in_hole",
]);
export type VoxArc = z.infer<typeof VoxArc>;

export const VoxRequestSchema = z.object({
  prompt: z.string().min(1).max(6000),
  title: z.string().max(200).optional(),
  theme: VoxTheme.default("american-retro").optional(),
  arc: VoxArc.default("hook_payoff").optional(),
  targetDurationSeconds: z.number().min(10).max(120).optional(),
  language: z.string().max(80).optional(),
  tone: z.string().max(100).optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("9:16").optional(),
  voice: z.string().max(100).optional(),
  generateAudio: z.boolean().default(true).optional(),
  music: z.boolean().default(true).optional(),
  sceneCount: z.number().min(2).max(6).optional(),
  webhookUrl: z.string().url().optional(),
});
export type VoxRequest = z.infer<typeof VoxRequestSchema>;

// === ZackD (Zack D Films-style 3D curiosity short) Request Schema ===
// Replicates the zackd-director skill pipeline on the WaveSpeed stack:
// curiosity-loop beat map → character turnaround sheets → 3D keyframes →
// I2V motion clips → cloned-style voiceover → impact zooms + transitions.
export const ZackDRequestSchema = z.object({
  prompt: z.string().min(1).max(6000),
  title: z.string().max(200).optional(),
  targetDurationSeconds: z.number().min(10).max(120).optional(),
  language: z.string().max(80).optional(),
  tone: z.string().max(100).optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("9:16").optional(),
  voice: z.string().max(100).optional(),
  generateAudio: z.boolean().default(true).optional(),
  music: z.boolean().default(true).optional(),
  // Number of curiosity-loop beats (each beat ≈ one narration line + 2 shots)
  sceneCount: z.number().min(2).max(8).optional(),
  webhookUrl: z.string().url().optional(),
});
export type ZackDRequest = z.infer<typeof ZackDRequestSchema>;

// === ComicDrama (AI comic / anime drama episode) Request Schema ===
// Replicates the AIComicBuilder pipeline on the WaveSpeed stack:
// script → character extraction → 4-view character sheets → shot list with
// first/last keyframe pairs → start/end-frame interpolated I2V clips →
// voiced dialogue + burned-in comic subtitles → hard-cut assembly.
export const ComicArtStyle = z.enum([
  "auto",
  "anime",
  "manga",
  "comic_book",
  "3d_pixar",
  "realistic_cinematic",
]);
export type ComicArtStyle = z.infer<typeof ComicArtStyle>;

export const ComicDramaRequestSchema = z.object({
  // Story premise, synopsis, or a full raw script — the LLM structures it
  // into characters + a shot list either way.
  prompt: z.string().min(1).max(6000),
  title: z.string().max(200).optional(),
  targetDurationSeconds: z.number().min(10).max(120).optional(),
  language: z.string().max(80).optional(),
  tone: z.string().max(100).optional(),
  // Visual style; "auto" detects from the story (anime/manga/realistic...).
  artStyle: ComicArtStyle.default("auto").optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("9:16").optional(),
  voice: z.string().max(100).optional(),
  generateAudio: z.boolean().default(true).optional(),
  music: z.boolean().default(true).optional(),
  // Number of storyboard shots (each = one keyframe pair + one clip)
  sceneCount: z.number().min(2).max(10).optional(),
  webhookUrl: z.string().url().optional(),
});
export type ComicDramaRequest = z.infer<typeof ComicDramaRequestSchema>;

// === StickmanExplainer (Stickman-Studio-style educational short) Request
// Schema === Replicates the Stickman Studio pipeline on the WaveSpeed stack:
// topic → LLM storyboard (hook scene + punchy narration per scene) → one
// stickman character reference → reference-locked scene images → Ken Burns
// slideshow (free) or Wan I2V animated clips → narrated voiceover + captions.
export const StickmanAnimation = z.enum(["slideshow", "animated"]);
export type StickmanAnimation = z.infer<typeof StickmanAnimation>;

export const StickmanExplainerRequestSchema = z.object({
  // Topic, question, or raw explainer script — the LLM structures it either way.
  prompt: z.string().min(1).max(6000),
  title: z.string().max(200).optional(),
  targetDurationSeconds: z.number().min(10).max(120).optional(),
  language: z.string().max(80).optional(),
  tone: z.string().max(100).optional(),
  // "slideshow" animates stills with a Remotion Ken Burns zoom (no video-gen
  // cost); "animated" generates one Wan I2V clip per scene.
  animation: StickmanAnimation.default("slideshow").optional(),
  aspectRatio: z.enum(ASPECT_RATIOS).default("9:16").optional(),
  voice: z.string().max(100).optional(),
  generateAudio: z.boolean().default(true).optional(),
  music: z.boolean().default(true).optional(),
  // Number of scenes in the storyboard (scene 1 doubles as the hook)
  sceneCount: z.number().min(2).max(10).optional(),
  webhookUrl: z.string().url().optional(),
});
export type StickmanExplainerRequest = z.infer<typeof StickmanExplainerRequestSchema>;

// === Job Status Types ===
export const JobStatus = z.enum([
  "queued",
  "rendering",
  "completed",
  "failed",
]);
export type JobStatus = z.infer<typeof JobStatus>;

export const JobResponseSchema = z.object({
  jobId: z.string(),
  status: JobStatus,
  progress: z.number().min(0).max(100).optional(),
  videoUrl: z.string().url().optional(),
  error: z.string().optional(),
  currentStage: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});
export type JobResponse = z.infer<typeof JobResponseSchema>;

// === Normalization Functions ===

/**
 * Normalizes a VideoScript to ensure all values are within acceptable ranges
 * and scene timing is consistent.
 */
export function normalizeVideoScript(script: VideoScript): VideoScript {
  // Clamp duration
  const durationSec = Math.min(Math.max(script.durationSec, 1), 300);

  // Normalize scenes
  let currentTime = 0;
  const normalizedScenes: Scene[] = [];

  for (const scene of script.scenes) {
    // Ensure scene doesn't exceed video duration
    const maxSceneDuration = durationSec - currentTime;
    if (maxSceneDuration <= 0) break;

    const sceneDuration = Math.min(scene.durationSec, maxSceneDuration);

    normalizedScenes.push({
      ...scene,
      startSec: currentTime,
      durationSec: Math.max(sceneDuration, 0.5),
      bgColor: normalizeColor(scene.bgColor),
      bgColorTo: scene.bgColorTo ? normalizeColor(scene.bgColorTo) : undefined,
      textColor: normalizeColor(scene.textColor),
      text: scene.text.slice(0, 500),
      transition: scene.transition || "none",
      fontFamily: scene.fontFamily,
      words: scene.words,
    });

    currentTime += sceneDuration;
  }

  // If no scenes, add a default one
  if (normalizedScenes.length === 0) {
    normalizedScenes.push({
      startSec: 0,
      durationSec: durationSec,
      text: script.title || "Video",
      bgColor: "#1a1a2e",
      textColor: "#ffffff",
      animation: "fadeIn",
    });
  }

  // Recalculate actual duration from scenes
  const actualDuration = normalizedScenes.reduce(
    (sum, scene) => Math.max(sum, scene.startSec + scene.durationSec),
    0
  );

  return {
    ...script,
    durationSec: actualDuration,
    fps: Math.min(Math.max(script.fps, 24), 60),
    width: Math.min(Math.max(script.width, 320), 3840),
    height: Math.min(Math.max(script.height, 240), 2160),
    scenes: normalizedScenes,
  };
}

/**
 * Normalizes a hex color string
 */
function normalizeColor(color: string): string {
  // Remove any whitespace
  const cleaned = color.trim();

  // Check if it's a valid hex color
  if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return cleaned.toLowerCase();
  }

  // Try to fix common issues
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return `#${cleaned.toLowerCase()}`;
  }

  // Default to a safe color
  return "#1a1a2e";
}

/**
 * Get default dimensions for a video type
 */
export function getDefaultDimensions(videoType: VideoType): { width: number; height: number } {
  switch (videoType) {
    case "SocialMedia":
      return { width: 1080, height: 1920 }; // 9:16 vertical
    case "General":
    case "TextAnimation":
    case "Explainer":
    default:
      return { width: 1920, height: 1080 }; // 16:9 horizontal
  }
}

/**
 * Map an aspect ratio string to render dimensions (1080p-based grid).
 */
export function getAspectRatioDimensions(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "21:9":
      return { width: 2520, height: 1080 };
    case "16:9":
      return { width: 1920, height: 1080 };
    case "4:3":
      return { width: 1440, height: 1080 };
    case "3:4":
      return { width: 1080, height: 1440 };
    case "1:1":
      return { width: 1080, height: 1080 };
    case "9:16":
    default:
      return { width: 1080, height: 1920 };
  }
}

/**
 * Get default animation for a video type
 */
export function getDefaultAnimation(videoType: VideoType): AnimationType {
  switch (videoType) {
    case "TextAnimation":
      return "typewriter";
    case "SocialMedia":
      return "bounce";
    case "Explainer":
      return "fadeIn";
    case "General":
    default:
      return "fadeIn";
  }
}

/**
 * Get default colors for a video type
 */
export function getDefaultColors(videoType: VideoType): { bgColor: string; textColor: string } {
  switch (videoType) {
    case "TextAnimation":
      return { bgColor: "#0f0f23", textColor: "#00d4ff" };
    case "SocialMedia":
      return { bgColor: "#1a1a2e", textColor: "#ffffff" };
    case "Explainer":
      return { bgColor: "#f8f9fa", textColor: "#212529" };
    case "General":
    default:
      return { bgColor: "#1a1a2e", textColor: "#ffffff" };
  }
}

/**
 * Validates and parses a raw object as a VideoScript
 */
export function parseVideoScript(raw: unknown): { success: true; data: VideoScript } | { success: false; error: string } {
  try {
    const result = VideoScriptSchema.safeParse(raw);
    if (result.success) {
      return { success: true, data: normalizeVideoScript(result.data) };
    }
    return { success: false, error: formatZodError(result.error) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Format Zod errors into a readable string
 */
function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("; ");
}
