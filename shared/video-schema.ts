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
  "AIVideo",
  "StockVideo",
  "StockImage",
  "MotionGraphics",
  "TextToVideo",
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
