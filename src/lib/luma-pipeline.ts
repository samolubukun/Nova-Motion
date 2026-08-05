/**
 * Luma mode pipeline — drives every Ray 3.2 use-case from one user request.
 *
 * Mirrors the existing agentic pipeline's shape (screenplay -> scenes -> TTS ->
 * per-scene video -> timeline) but dispatches generation through the Luma
 * capability resolver so a single mode can run text-to-video, image-to-video,
 * multi-keyframe, forward-extend chaining, video edit, and video reframe.
 *
 * Reuses the shared WavespeedTimelineAsset shape so the existing Remotion
 * composition renders the finished video, and ElevenLabs for TTS (Ray produces
 * silent video; voiceover + word captions are layered on top).
 */
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { LumaClient } from "./luma";
import {
  LumaGenerationInput,
  LumaMediaRef,
  resolveLumaGenerationRequest,
  LUMA_VIDEO_RATIOS,
} from "./luma-models";
import { generateSpeechWithElevenLabs } from "./elevenlabs";
import { uploadAsset, WavespeedTimelineAsset } from "./wavespeed-timeline";
import { getAspectRatioDimensions } from "../../shared/video-schema";

const LLM_URL = process.env.LUMA_LLM_URL || "https://llm.wavespeed.ai/v1/chat/completions";

export type LumaUseCase =
  | "ugc_post"
  | "product_ad"
  | "product_launch"
  | "real_estate"
  | "event_promo"
  | "education"
  | "nonprofit"
  | "social_generic"
  | "custom";

export interface LumaVideoInput {
  prompt: string;
  title?: string;
  useCase?: LumaUseCase;
  targetAudience?: string;
  targetDurationSeconds?: number;
  language?: string;
  tone?: string;
  style?: string;
  // Media supplied by the user (edit / reframe / image-to-video sources)
  referenceImages?: string[];
  sourceVideoUrl?: string;
  sourceVideoFileId?: string;
  // Caps the operation when a user supplies their own footage.
  explicitOperation?: "edit" | "reframe" | "image_to_video";
  // Video formatting
  aspectRatio?: string;
  resolution?: string;
  duration?: "5s" | "10s";
  hdr?: boolean;
  loop?: boolean;
  editStrength?: string;
  multiKeyframes?: boolean;
  // Voiceover / captions
  voice?: string;
  generateAudio?: boolean;
  // Multi-shot control
  sceneCount?: number;
}

export interface LumaPipelineOptions {
  onProgress?: (progress: number) => void;
  onStage?: (stage: string) => void;
  assetBaseUrl?: string;
  jobId?: string;
}

interface LumaScene {
  title: string;
  script: string;
  visual: string;
  camera: string;
  /** How this shot connects to the previous one: extend / cut. */
  transition: "extend" | "cut";
}

interface LumaScreenplay {
  title: string;
  story: string;
  visualStyle: string;
  scenes: LumaScene[];
}

interface SceneArtifact {
  generationId: string;
  videoUrl: string;
  durationMs: number;
}

type LumaTimelineAsset = WavespeedTimelineAsset;

function ratioForAspect(aspectRatio?: string): string {
  if (aspectRatio && LUMA_VIDEO_RATIOS.includes(aspectRatio as never)) return aspectRatio;
  return "16:9";
}

function extractJson(text: string): string {
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) return block[1].trim();
  const object = text.match(/\{[\s\S]*\}/);
  return object ? object[0] : text.trim();
}

async function callScreenplayLLM(input: LumaVideoInput): Promise<LumaScreenplay> {
  const apiKey = process.env.WAVESPEED_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("A WAVESPEED_API_KEY or OPENAI_API_KEY is required");

  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.LUMA_LLM_MODEL || "deepseek/deepseek-v4-flash",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a film director and prompt engineer specializing in short-form AI video (Ray 3.2: text-to-video, image-to-video, extend-chaining). Write a production plan in JSON. Use ${input.language || "English"}, ${input.tone || "natural"} tone. Return ${input.sceneCount || "1-6"} scenes. Each scene needs: title, script (exact spoken words, empty string for silent shots), a detailed visual description, camera language (framing/movement), and transition ("extend" when it is the same continuous take continuing the prior scene, "cut" when it is a new independent shot). Keep the subject/style consistent across scenes. Return only JSON.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            useCase: input.useCase || "custom",
            prompt: input.prompt,
            title: input.title || "",
            targetAudience: input.targetAudience || "",
            targetDurationSeconds: input.targetDurationSeconds || 30,
            style: input.style || "cinematic polished lighting",
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) throw new Error(`LLM error ${response.status}: ${await response.text()}`);
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM returned an empty screenplay");
  const parsed = JSON.parse(extractJson(content)) as LumaScreenplay;
  if (!parsed.title || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error("LLM returned an invalid screenplay");
  }
  return parsed;
}

function toMediaRef(url?: string, fileId?: string, generationId?: string): LumaMediaRef | undefined {
  if (fileId) return { file_id: fileId };
  if (url) return { url };
  if (generationId) return { generation_id: generationId };
  return undefined;
}

const ABSOLUTIZE = (url: string, baseUrl: string): string =>
  url.startsWith("/") ? `${baseUrl}${url}` : url;

function absolutizeTimeline(
  timeline: LumaTimelineAsset,
  baseUrl?: string
): LumaTimelineAsset {
  if (!baseUrl) return timeline;
  return {
    ...timeline,
    elements: timeline.elements.map((e) => ({ ...e, videoUrl: ABSOLUTIZE(e.videoUrl, baseUrl) })),
    audio: timeline.audio.map((a) => ({ ...a, audioUrl: ABSOLUTIZE(a.audioUrl, baseUrl) })),
    text: timeline.text.map((t) => ({ ...t })),
  };
}

/**
 * Run a single Luma generation to completion, download its MP4 to the temp
 * dir, persist to shared storage, and return the artifact.
 */
async function runLumaVideo(
  client: LumaClient,
  input: LumaGenerationInput,
  tempDir: string,
  id: string
): Promise<SceneArtifact> {
  const resolved = resolveLumaGenerationRequest(input);
  const generation = await client.createGeneration(resolved.payload);
  const done = await client.pollGeneration(generation.id);
  if (done.state !== "completed" || !done.output.length) {
    throw new Error(`Luma generation failed: ${done.failure_reason || done.failure_code || "no output"}`);
  }
  const localPath = path.join(tempDir, `${id}.mp4`);
  await client.downloadOutput(done.output[0].url, localPath);
  const videoUrl = await uploadAsset(fs.readFileSync(localPath), `${id}.mp4`, "video/mp4");
  return { generationId: generation.id, videoUrl, durationMs: input.duration === "10s" ? 10000 : 5000 };
}

/**
 * Generate a single-shot Luma video from user-supplied media. Used when the
 * user brings their own video/image and expects one operation (edit, reframe,
 * or image-to-video) rather than a screenplay.
 */
async function generateSingleShot(
  client: LumaClient,
  input: LumaVideoInput,
  tempDir: string
): Promise<LumaTimelineAsset> {
  const operation =
    input.explicitOperation ||
    (input.sourceVideoUrl || input.sourceVideoFileId
      ? "edit"
      : input.referenceImages?.length
        ? "image_to_video"
        : "text_to_video");

  const genInput: LumaGenerationInput = {
    prompt: input.prompt,
    operation,
    aspectRatio: ratioForAspect(input.aspectRatio),
    resolution: input.resolution,
    duration: input.duration,
    hdr: input.hdr,
    loop: input.loop,
    editStrength: input.editStrength as LumaGenerationInput["editStrength"],
    source: toMediaRef(input.sourceVideoUrl, input.sourceVideoFileId),
    startFrame: toMediaRef(input.referenceImages?.[0]),
  };
  if (input.multiKeyframes !== undefined) {
    genInput.keyframes = (input.referenceImages || []).slice(0, 10).map((url) => ({ url }));
  }

  const artifact = await runLumaVideo(client, genInput, tempDir, uuidv4());
  const durationMs = input.duration === "10s" ? 10000 : 5000;
  const { width, height } = getAspectRatioDimensions(ratioForAspect(input.aspectRatio));

  return {
    shortTitle: (input.title || input.prompt).slice(0, 60),
    elements: [{ videoUrl: artifact.videoUrl, startMs: 0, endMs: durationMs }],
    text: [],
    audio: [],
    words: [],
    width,
    height,
  };
}

/**
 * Generate the full Luma timeline. If the user supplied their own video it runs
 * a single edit/reframe/i2v operation; otherwise it drives a screenplay with
 * per-scene TTS and stitches scenes via Ray forward-extend / independent clips.
 */
export async function generateLumaVideoTimeline(
  input: LumaVideoInput,
  options: LumaPipelineOptions = {}
): Promise<WavespeedTimelineAsset> {
  const { assetBaseUrl, onProgress, onStage } = options;
  const client = new LumaClient();
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  fs.mkdirSync(tempDir, { recursive: true });

  // Single-shot mode when the user brings their own source footage.
  if (input.explicitOperation || input.sourceVideoUrl || input.sourceVideoFileId) {
    onStage?.("planning");
    onProgress?.(0.1);
    const timeline = await generateSingleShot(client, input, tempDir);
    onProgress?.(1);
    return absolutizeTimeline(timeline, assetBaseUrl);
  }

  // Screenplay mode (auto multi-scene unless the user forces a count).
  onStage?.("planning");
  onProgress?.(0.05);
  const screenplay = await callScreenplayLLM(input);
  onProgress?.(0.2);

  const elements: WavespeedTimelineAsset["elements"] = [];
  const audio: WavespeedTimelineAsset["audio"] = [];
  const text: WavespeedTimelineAsset["text"] = [];
  const words: NonNullable<WavespeedTimelineAsset["words"]> = [];
  let offsetMs = 0;
  let previousId: string | undefined;

  for (let index = 0; index < screenplay.scenes.length; index++) {
    const scene = screenplay.scenes[index];
    onStage?.("keyframes");

    const speech = scene.script.trim();
    let audioUrl: string | undefined;
    let spokenEndMs = 0;
    if (speech && input.generateAudio) {
      onStage?.("voice");
      const localAudioPath = path.join(tempDir, `${uuidv4()}-scene-${index}.mp3`);
      const sceneWords = await generateSpeechWithElevenLabs(speech, localAudioPath, input.voice);
      const publicAudio = await uploadAsset(fs.readFileSync(localAudioPath), `${uuidv4()}-scene-${index}.mp3`, "audio/mpeg");
      audioUrl = publicAudio;
      const lastWord = sceneWords[sceneWords.length - 1];
      spokenEndMs = Math.round((lastWord?.end ?? 4) * 1000);
      for (const w of sceneWords) {
        words.push({
          word: w.word,
          startMs: offsetMs + Math.round(w.start * 1000),
          endMs: offsetMs + Math.round(w.end * 1000),
        });
      }
    }

    // Continuous same take with earlier clips -> forward extend from prior clip.
    const shouldExtend = index > 0 && scene.transition === "extend";
    onStage?.("video_generation");
    const genInput: LumaGenerationInput = {
      prompt: `${scene.visual}. Camera: ${scene.camera}. Style: ${screenplay.visualStyle}.`,
      operation: shouldExtend ? "extend" : "text_to_video",
      aspectRatio: ratioForAspect(input.aspectRatio),
      resolution: input.resolution,
      duration: "10s",
      hdr: input.hdr,
      startFrame: shouldExtend && previousId
        ? { generation_id: previousId }
        : toMediaRef(input.referenceImages?.[0]),
    };

    const artifact = await runLumaVideo(client, genInput, tempDir, `${uuidv4()}-${index}`);
    previousId = artifact.generationId;

    const startMs = offsetMs;
    const endMs = startMs + artifact.durationMs;
    elements.push({ videoUrl: artifact.videoUrl, startMs, endMs });
    if (audioUrl && spokenEndMs > 0) {
      audio.push({ startMs, endMs: Math.min(endMs, startMs + spokenEndMs), audioUrl });
    }
    text.push({ startMs, endMs: Math.min(endMs, startMs + 2500), text: scene.title, position: "center" });
    offsetMs = endMs;
    onProgress?.(0.2 + ((index + 1) / screenplay.scenes.length) * 0.75);
  }

  const { width, height } = getAspectRatioDimensions(ratioForAspect(input.aspectRatio));
  const timeline: LumaTimelineAsset = {
    shortTitle: screenplay.title.slice(0, 60),
    elements,
    text,
    audio,
    words,
    width,
    height,
  };
  onProgress?.(1);
  return absolutizeTimeline(timeline, assetBaseUrl);
}
