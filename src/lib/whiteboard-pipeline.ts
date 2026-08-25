/**
 * WhiteboardVideo mode pipeline — ported from the reference Storyboard-AI
 * project (genai-pipeline/pipeline.py + tools/*) and re-hosted entirely
 * on the WaveSpeed stack this project already uses:
 *
 *   topic ─► LLM scene breakdown (Director Agent → narration + visual description)
 *           ─► per scene: whiteboard line-art image (Seedream T2I)
 *           ─► optional: SAM3 Video segmentation for animated mask effects
 *           ─► narrator TTS with word timestamps (ElevenLabs / Deepgram)
 *           ─► optional Lyria background music
 *   ──► WavespeedTimelineAsset rendered by the WavespeedVideo composition
 *       (Ken Burns stills + lower-third kinetic captions).
 */
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { WavespeedClient } from "./wavespeed";
import { generateSpeechWithTimestamps, AURA_VOICES } from "./deepgram";
import { DEFAULT_ELEVENLABS_VOICE_ID } from "./elevenlabs";
import { uploadAsset, WavespeedTimelineAsset } from "./wavespeed-timeline";
import { getAspectRatioDimensions } from "../../shared/video-schema";
import {
  buildWhiteboardDirectorSystemPrompt,
  buildWhiteboardImagePrompt,
  DEFAULT_WHITEBOARD_MUSIC,
  WHITEBOARD_STYLE_BLOCK,
  WhiteboardScenePlan,
  WhiteboardStoryPlan,
} from "./whiteboard-prompts";

const LLM_URL =
  process.env.WHITEBOARD_LLM_URL ||
  process.env.COMIC_LLM_URL ||
  process.env.ZACK_D_LLM_URL ||
  "https://llm.wavespeed.ai/v1/chat/completions";
const LLM_MODEL = () =>
  process.env.WHITEBOARD_LLM_MODEL ||
  process.env.COMIC_LLM_MODEL ||
  process.env.WAVESPEED_LLM_MODEL ||
  "deepseek/deepseek-v4-flash";

// Image model for whiteboard line-art generation.
const WHITEBOARD_IMAGE_MODEL = () =>
  process.env.WHITEBOARD_IMAGE_MODEL || "bytedance/seedream-v5.0-pro";

// SAM3 Video model for optional mask-guided segmentation.
const SAM3_VIDEO_MODEL = "wavespeed-ai/sam3-video";

// Seedream "WIDTH*HEIGHT" sizes per aspect ratio.
const IMAGE_SIZES: Record<string, string> = {
  "9:16": "1080*1920",
  "16:9": "1920*1080",
  "1:1": "1024*1024",
  "4:3": "1440*1080",
  "3:4": "1080*1440",
  "21:9": "2240*1080",
};

const ABSOLUTIZE = (url: string, baseUrl: string): string =>
  url.startsWith("/") ? `${baseUrl}${url}` : url;

function extractJson(text: string): string {
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) return block[1].trim();
  const object = text.match(/\{[\s\S]*\}/);
  return object ? object[0] : text.trim();
}

// === 1. Storyboard plan (Director Agent) ===
async function callWhiteboardPlanLLM(input: WhiteboardVideoInput): Promise<WhiteboardStoryPlan> {
  const apiKey = process.env.WAVESPEED_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("A WAVESPEED_API_KEY or OPENAI_API_KEY is required");

  const targetDurationSeconds = input.targetDurationSeconds || 40;
  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LLM_MODEL(),
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: buildWhiteboardDirectorSystemPrompt(
            targetDurationSeconds,
            input.language || "English",
            input.tone || "informative",
            input.sceneCount
          ),
        },
        {
          role: "user",
          content: JSON.stringify({
            topic: input.prompt,
            title: input.title || "",
            sceneCount: input.sceneCount,
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) throw new Error(`LLM error ${response.status}: ${await response.text()}`);
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM returned an empty storyboard");
  const parsed = JSON.parse(extractJson(content)) as WhiteboardStoryPlan;
  if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error("LLM returned an invalid storyboard");
  }
  parsed.scenes = parsed.scenes.slice(0, 10).map((scene, i) => ({
    index: i,
    summary: scene.summary || `Scene ${i + 1}`,
    narration: scene.narration || "",
    description: scene.description || scene.summary || "",
    visual_setup: scene.visual_setup || "",
    search_query: scene.search_query,
    text_overlay: scene.text_overlay,
    key_information: scene.key_information,
    emotional_beat: scene.emotional_beat,
  }));
  return parsed;
}

// Deterministic fallback if the LLM is unreachable — a compact 3-scene
// whiteboard explainer so the pipeline still produces valid output.
function fallbackStoryPlan(topic: string): WhiteboardStoryPlan {
  const t = topic.slice(0, 60);
  const scene = (summary: string, narration: string, description: string, visual_setup: string): WhiteboardScenePlan => ({
    index: 0,
    summary,
    narration,
    description,
    visual_setup,
  });
  return {
    title: t,
    tone: "informative",
    narrative_persona: "Professional Explainer",
    visual_style: "Clean Whiteboard Animation",
    pacing: "steady",
    narrative_arc: "Linear exploration of the topic",
    target_audience: "general public",
    music: DEFAULT_WHITEBOARD_MUSIC,
    scenes: [
      scene(
        "The Hook",
        "Every great discovery starts with a simple question. Let's explore how this idea changed everything.",
        "A large question mark drawn in black marker on a white whiteboard, with small decorative elements around it",
        "Central question mark, clean composition, whiteboard style"
      ),
      scene(
        "The Discovery",
        "Scientists and thinkers throughout history have pushed the boundaries of what we know, revealing insights that transformed our understanding.",
        "A lightbulb drawn in black marker with radiating lines, a small figure standing beneath it looking up in wonder",
        "Lightbulb as focal point with selective yellow color, figure in bottom third"
      ),
      scene(
        "The Payoff",
        "And that's how a single idea can ripple through time, changing the world one discovery at a time.",
        "A chain of connected circles drawn on whiteboard, each containing a simple icon representing progress",
        "Flowing chain of circles from left to right, selective blue color on key icons"
      ),
    ],
  };
}

// === 2. Whiteboard scene image generation ===
async function generateSceneImage(
  client: WavespeedClient,
  scene: WhiteboardScenePlan,
  size: string,
  jobId: string,
  index: number,
  tone?: string
): Promise<string> {
  const prompt = buildWhiteboardImagePrompt(
    scene.description,
    scene.visual_setup,
    scene.text_overlay,
    tone
  );

  const { resultUrl } = await client.triggerImage(prompt, size, WHITEBOARD_IMAGE_MODEL());
  const outputs = await client.pollPrediction(resultUrl, 5000, 300000);
  const imageUrl = outputs[0];
  if (!imageUrl) throw new Error(`Scene image returned no output for scene ${index + 1}`);

  const buffer = await (await fetch(imageUrl)).arrayBuffer();
  await uploadAsset(Buffer.from(buffer), `${jobId}-whiteboard-scene-${index}.jpg`, "image/jpeg");
  console.log(`[Whiteboard] Scene ${index + 1} image ready.`);
  return imageUrl;
}

// === 3. Optional SAM3 Video segmentation ===
// After generating whiteboard images, optionally run SAM3 Video on the
// assembled clip to create mask-guided effects (e.g., isolating objects
// for multi-pass drawing animations). Uses the WaveSpeed SAM3 Video API:
// POST https://api.wavespeed.ai/api/v3/wavespeed-ai/sam3-video
async function segmentWithSAM3Video(
  client: WavespeedClient,
  videoUrl: string,
  prompt: string,
  applyMask: boolean
): Promise<string | null> {
  try {
    const { resultUrl } = await client.triggerModel(SAM3_VIDEO_MODEL, {
      prompt,
      video: videoUrl,
      apply_mask: applyMask,
    });
    const outputs = await client.pollPrediction(resultUrl, 5000, 600000);
    return outputs[0] || null;
  } catch (err) {
    console.warn(`[Whiteboard] SAM3 Video segmentation failed (continuing without): ${err}`);
    return null;
  }
}

// === 4. Assemble the final timeline ===
export interface WhiteboardVideoInput {
  prompt: string;
  title?: string;
  targetDurationSeconds?: number;
  language?: string;
  tone?: string;
  animationStyle?: string;
  aspectRatio?: string;
  voice?: string;
  generateAudio?: boolean;
  music?: boolean;
  sceneCount?: number;
}

export interface WhiteboardPipelineOptions {
  onProgress?: (progress: number) => void;
  onStage?: (stage: string) => void;
  assetBaseUrl?: string;
  jobId?: string;
}

export interface WhiteboardTimelineElement {
  imageUrl?: string;
  videoUrl?: string;
  startMs: number;
  endMs: number;
}

export type WhiteboardTimelineAsset = Omit<WavespeedTimelineAsset, "elements"> & {
  elements: WhiteboardTimelineElement[];
};

type TimelineWord = NonNullable<WavespeedTimelineAsset["words"]>[number];

export async function generateWhiteboardVideoTimeline(
  input: WhiteboardVideoInput,
  options: WhiteboardPipelineOptions = {}
): Promise<WhiteboardTimelineAsset> {
  const { assetBaseUrl, onProgress, onStage } = options;
  const base = assetBaseUrl || process.env.RENDER_SERVER_BASE_URL || "http://localhost:3001";
  const aspectRatio = input.aspectRatio || "16:9";
  const jobId = options.jobId || uuidv4();

  const client = new WavespeedClient();
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  fs.mkdirSync(tempDir, { recursive: true });

  onStage?.("planning");
  onProgress?.(0.02);

  // 1. Storyboard plan (Director Agent)
  let plan: WhiteboardStoryPlan;
  try {
    plan = await callWhiteboardPlanLLM(input);
  } catch (err) {
    console.warn("[Whiteboard] Storyboard LLM failed, using fallback structure:", err);
    plan = fallbackStoryPlan(input.prompt.slice(0, 120));
  }
  console.log(
    `[Whiteboard] Storyboard ready: ${plan.scenes.length} scenes, tone="${plan.tone}", title="${plan.title}"`
  );
  onProgress?.(0.06);

  // 2. Narrator voiceover per scene (sequential, one voice)
  const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY);
  let defaultVoice = AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  if (hasElevenLabs) defaultVoice = DEFAULT_ELEVENLABS_VOICE_ID;
  const selectedVoice = input.voice || defaultVoice;

  interface SceneVoice {
    audioUrl: string;
    words: Array<{ word: string; start: number; end: number }>;
    audioEndSec: number;
  }
  const sceneVoices: SceneVoice[] = [];
  for (let i = 0; i < plan.scenes.length; i++) {
    const narration = plan.scenes[i].narration.trim();
    const localAudioPath = path.join(tempDir, `${jobId}-whiteboard-narration-${i}.mp3`);
    try {
      if (input.generateAudio !== false && narration) {
        const wordTimestamps = await generateSpeechWithTimestamps(narration, localAudioPath, selectedVoice);
        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        const audioEndSec = Math.max(
          1.5,
          lastWord ? lastWord.end + 0.35 : narration.split(/\s+/).length / 2.5 + 0.35
        );
        const audioUrl = await uploadAsset(fs.readFileSync(localAudioPath), `${jobId}-whiteboard-narration-${i}.mp3`, "audio/mpeg");
        sceneVoices.push({ audioUrl, words: wordTimestamps, audioEndSec });
        console.log(`[Whiteboard] Scene ${i + 1} narration: ${audioEndSec.toFixed(1)}s`);
      } else {
        sceneVoices.push({ audioUrl: "", words: [], audioEndSec: 0 });
      }
    } catch (err) {
      console.warn(`[Whiteboard] TTS failed for scene ${i + 1}: ${err}`);
      sceneVoices.push({ audioUrl: "", words: [], audioEndSec: 0 });
    }
    onProgress?.(0.06 + ((i + 1) / Math.max(1, plan.scenes.length)) * 0.14);
  }

  // 3. Scene images (parallel — each is an independent whiteboard drawing)
  onStage?.("scene_images");
  const size = IMAGE_SIZES[aspectRatio] || IMAGE_SIZES["16:9"];
  const sceneImageResults = await Promise.allSettled(
    plan.scenes.map((scene, i) =>
      generateSceneImage(client, scene, size, jobId, i, plan.tone)
    )
  );
  const sceneImages: Array<string | null> = sceneImageResults.map((r) =>
    r.status === "fulfilled" ? r.value : null
  );
  sceneImageResults.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn(`[Whiteboard] Scene image failed for scene ${i + 1}: ${r.reason}`);
    }
  });
  if (sceneImages.every((img) => !img)) {
    throw new Error("Whiteboard pipeline failed: no scene images were generated.");
  }
  onProgress?.(0.45);

  // 4. Optional SAM3 Video segmentation pass
  // If animationStyle is "animated", we generate short I2V clips from each
  // whiteboard image and then optionally run SAM3 Video to create mask-guided
  // drawing effects. This replicates the multi-pass object-by-object drawing
  // from the original storyboard-ai pipeline.
  const sceneClips: Array<string | null> = new Array(plan.scenes.length).fill(null);
  if (input.animationStyle === "animated") {
    onStage?.("video_generation");
    await Promise.allSettled(
      plan.scenes.map(async (scene, i) => {
        const img = sceneImages[i];
        if (!img) return;
        try {
          // Generate a short I2V clip from the whiteboard image
          const duration = Math.min(8, Math.max(5, Math.round(sceneVoices[i].audioEndSec || 5)));
          const { resultUrl } = await client.triggerImageToVideo(
            `whiteboard drawing animation, marker strokes appearing on white surface, simple line art being drawn`,
            img,
            duration,
            "720p",
            "bytedance/seedance-2.0/image-to-video"
          );
          const [clipUrl] = await client.pollPrediction(resultUrl, 5000, 600000);
          if (clipUrl) {
            // Optionally run SAM3 Video for mask-guided effects
            const sam3Result = await segmentWithSAM3Video(
              client,
              clipUrl,
              `${scene.description}, whiteboard drawing, key objects`,
              true
            );
            sceneClips[i] = sam3Result || clipUrl;
            console.log(`[Whiteboard] Scene ${i + 1}/${plan.scenes.length} clip ready${sam3Result ? " (SAM3 masked)" : ""}.`);
          }
        } catch (err) {
          console.warn(`[Whiteboard] Clip generation failed for scene ${i + 1}: ${err}`);
        }
      })
    );
  }
  onProgress?.(input.animationStyle === "animated" ? 0.85 : 0.55);

  // 5. Optional background music (Lyria) — non-fatal
  let musicTrack: { audioUrl: string; volume: number } | undefined;
  if (input.music) {
    try {
      onStage?.("music");
      const musicPrompt = plan.music || DEFAULT_WHITEBOARD_MUSIC;
      const { resultUrl } = await client.triggerMusic(musicPrompt);
      const [musicUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
      if (musicUrl) {
        musicTrack = { audioUrl: musicUrl, volume: 0.15 };
        console.log("[Whiteboard] Background music ready.");
      }
    } catch (err) {
      console.warn(`[Whiteboard] Music generation failed (continuing without): ${err}`);
    }
    onProgress?.(input.animationStyle === "animated" ? 0.9 : 0.6);
  }

  // 6. Assemble the timeline (butt-joined scenes; slideshow durations follow
  //    the narration length, animated durations follow the clip length).
  const elements: WhiteboardTimelineElement[] = [];
  const audio: WavespeedTimelineAsset["audio"] = [];
  const words: TimelineWord[] = [];
  let offsetMs = 0;

  for (let i = 0; i < plan.scenes.length; i++) {
    const voice = sceneVoices[i];
    const clipUrl = sceneClips[i];
    const imageUrl = sceneImages[i];
    const startMs = offsetMs;

    let sceneDurationMs: number;
    if (clipUrl) {
      sceneDurationMs = Math.round(Math.min(8, Math.max(5, voice.audioEndSec || 5)) * 1000);
    } else if (imageUrl) {
      // Slideshow: hold the still for the narration plus breathing room.
      sceneDurationMs = Math.round(Math.max(2500, (voice.audioEndSec || 4) * 1000 + 800));
    } else {
      continue;
    }
    const endMs = startMs + sceneDurationMs;

    elements.push({
      ...(clipUrl ? { videoUrl: clipUrl } : {}),
      ...(imageUrl && !clipUrl ? { imageUrl: ABSOLUTIZE(imageUrl, base) } : {}),
      startMs,
      endMs,
    });

    if (voice.audioUrl) {
      const voiceEndMs = Math.min(endMs, startMs + Math.round(voice.audioEndSec * 1000));
      audio.push({ startMs, endMs: voiceEndMs, audioUrl: voice.audioUrl });
      for (const w of voice.words) {
        words.push({
          word: w.word,
          startMs: startMs + Math.round(w.start * 1000),
          endMs: startMs + Math.round(w.end * 1000),
        });
      }
    }

    offsetMs = endMs;
  }

  const { width, height } = getAspectRatioDimensions(aspectRatio);
  const timeline: WhiteboardTimelineAsset = {
    shortTitle: (plan.title || input.title || input.prompt).slice(0, 60),
    elements,
    text: [],
    audio,
    words,
    music: musicTrack ? [musicTrack] : undefined,
    width,
    height,
  };

  // Absolutize local asset URLs so the Remotion composition can fetch them.
  timeline.elements = timeline.elements.map((e) => ({
    ...e,
    ...(e.videoUrl ? { videoUrl: ABSOLUTIZE(e.videoUrl, base) } : {}),
    ...(e.imageUrl ? { imageUrl: ABSOLUTIZE(e.imageUrl, base) } : {}),
  }));
  timeline.audio = timeline.audio.map((a) => ({ ...a, audioUrl: ABSOLUTIZE(a.audioUrl, base) }));
  if (timeline.music) {
    timeline.music = timeline.music.map((m) => ({ ...m, audioUrl: ABSOLUTIZE(m.audioUrl, base) }));
  }

  onProgress?.(1);
  console.log(`[Whiteboard] Timeline ready: ${elements.length} scenes (${input.animationStyle === "animated" ? "animated" : "slideshow"}), ${audio.length} narration tracks.`);
  return timeline;
}
