/**
 * StickmanExplainer mode pipeline — ported from the reference Stickman-Studio
 * project (orchestrator.py + stickman_studio/phases/*) and re-hosted entirely
 * on the WaveSpeed stack this project already uses:
 *
 *   topic ─► LLM storyboard (hook scene + punchy narration per scene)
 *           └─► ONE stickman character reference (Seedream T2I)
 *           └─► per scene: reference-locked scene image (Seedream v4 EDIT
 *                           with the char ref attached — the Stickman Studio
 *                           "subject reference" trick)
 *                           └─► animation: "slideshow" = free Ken Burns zoom
 *                               rendered natively in Remotion, or "animated"
 *                               = one Wan I2V clip per scene
 *           └─► narrator TTS with word timestamps (ElevenLabs / Deepgram)
 *           └─► optional Lyria background music
 *   ──► StickmanTimelineAsset rendered by the StickmanExplainerVideo
 *       composition (Ken Burns stills or clips + lower-third captions).
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
  buildStickmanCharRefPrompt,
  buildStickmanMotionPrompt,
  buildStickmanScenePrompt,
  buildStickmanSystemPrompt,
  DEFAULT_STICKMAN_MUSIC,
  STICKMAN_CHARACTER_CORE,
  StickmanScenePlan,
  StickmanStoryPlan,
} from "./stickman-prompts";

const LLM_URL =
  process.env.STICKMAN_LLM_URL ||
  process.env.COMIC_LLM_URL ||
  process.env.ZACK_D_LLM_URL ||
  "https://llm.wavespeed.ai/v1/chat/completions";
const LLM_MODEL = () =>
  process.env.STICKMAN_LLM_MODEL ||
  process.env.COMIC_LLM_MODEL ||
  process.env.WAVESPEED_LLM_MODEL ||
  "deepseek/deepseek-v4-flash";

// Animated mode I2V model (image → moving clip; no end frame needed here).
const STICKMAN_I2V_MODEL = () =>
  process.env.STICKMAN_I2V_MODEL || process.env.COMIC_I2V_MODEL || "wavespeed-ai/wan-2.2/i2v-720p-ultra-fast";

// Image-edit model used for reference-locked scene images.
const SCENE_EDIT_MODEL = () =>
  process.env.STICKMAN_IMAGE_EDIT_MODEL || process.env.COMIC_KEYFRAME_EDIT_MODEL || "bytedance/seedream-v4/edit";

export interface StickmanExplainerVideoInput {
  prompt: string;
  title?: string;
  targetDurationSeconds?: number;
  language?: string;
  tone?: string;
  animation?: string;
  aspectRatio?: string;
  voice?: string;
  generateAudio?: boolean;
  music?: boolean;
  sceneCount?: number;
}

export interface StickmanPipelineOptions {
  onProgress?: (progress: number) => void;
  onStage?: (stage: string) => void;
  assetBaseUrl?: string;
  jobId?: string;
}

export interface StickmanTimelineElement {
  /** Scene illustration (slideshow mode) — zoomed Ken Burns style. */
  imageUrl?: string;
  /** Rendered clip (animated mode). */
  videoUrl?: string;
  startMs: number;
  endMs: number;
}

export type StickmanTimelineAsset = Omit<WavespeedTimelineAsset, "elements"> & {
  elements: StickmanTimelineElement[];
};

type TimelineWord = NonNullable<WavespeedTimelineAsset["words"]>[number];

// Seedream "WIDTH*HEIGHT" sizes per aspect ratio.
const IMAGE_SIZES: Record<string, string> = {
  "9:16": "1080*1920",
  "16:9": "1920*1080",
  "1:1": "1024*1024",
  "4:3": "1440*1080",
  "3:4": "1080*1440",
  "21:9": "2240*1080",
};
const CHAR_REF_SIZE = "1024*1024";

const ABSOLUTIZE = (url: string, baseUrl: string): string =>
  url.startsWith("/") ? `${baseUrl}${url}` : url;

function extractJson(text: string): string {
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) return block[1].trim();
  const object = text.match(/\{[\s\S]*\}/);
  return object ? object[0] : text.trim();
}

// === 1. Storyboard plan ===
async function callStickmanPlanLLM(input: StickmanExplainerVideoInput): Promise<StickmanStoryPlan> {
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
          content: buildStickmanSystemPrompt(
            targetDurationSeconds,
            input.language || "English",
            input.tone || "curious and energetic",
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
  const parsed = JSON.parse(extractJson(content)) as StickmanStoryPlan;
  if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error("LLM returned an invalid storyboard");
  }
  // Sanitize: every scene needs action + narration; keep at most 10 scenes.
  parsed.scenes = parsed.scenes.slice(0, 10).map((scene, i) => ({
    index: i,
    title: scene.title || `Scene ${i + 1}`,
    action: scene.action,
    narration: scene.narration || "",
  }));
  if (!parsed.character_prompt) parsed.character_prompt = `a friendly expressive ${STICKMAN_CHARACTER_CORE}`;
  return parsed;
}

// Deterministic fallback if the LLM is unreachable — a compact 3-scene
// gravity explainer so the pipeline still produces valid output.
function fallbackStoryPlan(topic: string): StickmanStoryPlan {
  const t = topic.slice(0, 60);
  const scene = (title: string, action: string, narration: string): StickmanScenePlan => ({
    index: 0,
    title,
    action,
    narration,
  });
  return {
    title: t,
    character_prompt: `a curious young ${STICKMAN_CHARACTER_CORE}`,
    music: DEFAULT_STICKMAN_MUSIC,
    scenes: [
      scene(
        "The Hook",
        `stands on flat ground when a giant apple falls from above and lands beside him, shaking the whole frame`,
        `What goes up... must come down. But why? That single question broke the universe wide open.`
      ),
      scene(
        "The Discovery",
        `sits under a tree as an apple bonks his head, stars circling above his round head`,
        `When an apple hit Newton's head, he realized something invisible was pulling it down.`
      ),
      scene(
        "The Payoff",
        `jogs off the right edge of the frame while a small planet curves away behind him`,
        `We call that invisible pull gravity — and it holds everything, from apples to planets, exactly in place.`,
      ),
    ],
  };
}

// === 2. Character reference sheet ===
async function generateCharacterRef(
  client: WavespeedClient,
  plan: StickmanStoryPlan,
  jobId: string
): Promise<string> {
  const prompt = buildStickmanCharRefPrompt(plan.character_prompt);
  const { resultUrl } = await client.triggerImage(prompt, CHAR_REF_SIZE);
  const [refUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
  if (!refUrl) throw new Error("character reference returned no output");
  const buffer = await (await fetch(refUrl)).arrayBuffer();
  await uploadAsset(Buffer.from(buffer), `${jobId}-stickman-char-ref.jpg`, "image/jpeg");
  console.log("[StickmanExplainer] Character reference ready.");
  return refUrl;
}

// === 3. Scene images (reference-locked via the edit model) ===
async function generateSceneImage(
  client: WavespeedClient,
  scene: StickmanScenePlan,
  charRefUrl: string,
  size: string,
  jobId: string,
  index: number
): Promise<string> {
  const prompt = buildStickmanScenePrompt(scene);
  let imageUrl: string | undefined;
  try {
    const { resultUrl } = await client.triggerModel(SCENE_EDIT_MODEL(), {
      prompt,
      images: [charRefUrl],
      size,
    });
    const outputs = await client.pollPrediction(resultUrl, 5000, 300000);
    imageUrl = outputs[0];
  } catch (err) {
    console.warn(`[StickmanExplainer] Reference-locked scene image failed for scene ${index + 1}, falling back to text-to-image: ${err}`);
  }
  if (!imageUrl) {
    const { resultUrl } = await client.triggerImage(prompt, size);
    const outputs = await client.pollPrediction(resultUrl, 5000, 300000);
    imageUrl = outputs[0];
  }
  if (!imageUrl) throw new Error(`Scene image returned no output for scene ${index + 1}`);

  const buffer = await (await fetch(imageUrl)).arrayBuffer();
  await uploadAsset(Buffer.from(buffer), `${jobId}-stickman-scene-${index}.jpg`, "image/jpeg");
  console.log(`[StickmanExplainer] Scene ${index + 1} image ready.`);
  // Provider CDN URL — reusable both by downstream WaveSpeed calls and by
  // the Remotion composition (the timeline absolutizes local paths anyway).
  return imageUrl;
}

// === 4. Animated mode: one I2V clip per scene image ===
async function generateAnimatedClip(
  client: WavespeedClient,
  scene: StickmanScenePlan,
  imageUrl: string,
  durationSec: number
): Promise<string> {
  const motionPrompt = buildStickmanMotionPrompt(scene);
  const duration = Math.min(8, Math.max(5, Math.round(durationSec)));
  const { resultUrl } = await client.triggerModel(STICKMAN_I2V_MODEL(), {
    prompt: motionPrompt,
    image: imageUrl,
    duration,
    enable_safety_checker: true,
  });
  const [clipUrl] = await client.pollPrediction(resultUrl, 5000, 600000);
  if (!clipUrl) throw new Error(`Clip generation returned no output for scene "${scene.title}"`);
  return clipUrl;
}

// === 5. Assemble the final timeline ===
export async function generateStickmanExplainerTimeline(
  input: StickmanExplainerVideoInput,
  options: StickmanPipelineOptions = {}
): Promise<StickmanTimelineAsset> {
  const { assetBaseUrl, onProgress, onStage } = options;
  const base = assetBaseUrl || process.env.RENDER_SERVER_BASE_URL || "http://localhost:3001";
  const aspectRatio = input.aspectRatio || "9:16";
  const animated = input.animation === "animated";
  const jobId = options.jobId || uuidv4();

  const client = new WavespeedClient();
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  fs.mkdirSync(tempDir, { recursive: true });

  onStage?.("planning");
  onProgress?.(0.02);

  // 1. Storyboard plan
  let plan: StickmanStoryPlan;
  try {
    plan = await callStickmanPlanLLM(input);
  } catch (err) {
    console.warn("[StickmanExplainer] Storyboard LLM failed, using fallback structure:", err);
    plan = fallbackStoryPlan(input.prompt.slice(0, 120));
  }
  console.log(
    `[StickmanExplainer] Storyboard ready: ${plan.scenes.length} scenes, animation="${input.animation || "slideshow"}", title="${plan.title}"`
  );
  onProgress?.(0.06);

  // 2. Character reference
  onStage?.("character_reference");
  const charRefUrl = await generateCharacterRef(client, plan, jobId);
  onProgress?.(0.12);

  // 3. Narrator voiceover per scene (sequential, one voice)
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
    const localAudioPath = path.join(tempDir, `${jobId}-stickman-narration-${i}.mp3`);
    try {
      if (input.generateAudio !== false && narration) {
        const wordTimestamps = await generateSpeechWithTimestamps(narration, localAudioPath, selectedVoice);
        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        const audioEndSec = Math.max(
          1.5,
          lastWord ? lastWord.end + 0.35 : narration.split(/\s+/).length / 2.5 + 0.35
        );
        const audioUrl = await uploadAsset(fs.readFileSync(localAudioPath), `${jobId}-stickman-narration-${i}.mp3`, "audio/mpeg");
        sceneVoices.push({ audioUrl, words: wordTimestamps, audioEndSec });
        console.log(`[StickmanExplainer] Scene ${i + 1} narration: ${audioEndSec.toFixed(1)}s`);
      } else {
        sceneVoices.push({ audioUrl: "", words: [], audioEndSec: 0 });
      }
    } catch (err) {
      console.warn(`[StickmanExplainer] TTS failed for scene ${i + 1}: ${err}`);
      sceneVoices.push({ audioUrl: "", words: [], audioEndSec: 0 });
    }
    onProgress?.(0.12 + ((i + 1) / Math.max(1, plan.scenes.length)) * 0.14);
  }

  // 4. Scene images (parallel — each is independently locked to the char ref)
  onStage?.("scene_images");
  const size = IMAGE_SIZES[aspectRatio] || IMAGE_SIZES["9:16"];
  const sceneImageResults = await Promise.allSettled(
    plan.scenes.map((scene, i) => generateSceneImage(client, scene, charRefUrl, size, jobId, i))
  );
  const sceneImages: Array<string | null> = sceneImageResults.map((r) =>
    r.status === "fulfilled" ? r.value : null
  );
  sceneImageResults.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn(`[StickmanExplainer] Scene image failed for scene ${i + 1}: ${r.reason}`);
    }
  });
  if (sceneImages.every((img) => !img)) {
    throw new Error("StickmanExplainer pipeline failed: no scene images were generated.");
  }
  onProgress?.(0.35);

  // 5. Animation pass
  const sceneClips: Array<string | null> = new Array(plan.scenes.length).fill(null);
  if (animated) {
    onStage?.("video_generation");
    await Promise.allSettled(
      plan.scenes.map(async (scene, i) => {
        const img = sceneImages[i];
        if (!img) return;
        try {
          sceneClips[i] = await generateAnimatedClip(client, scene, img, sceneVoices[i].audioEndSec || 5);
          console.log(`[StickmanExplainer] Scene ${i + 1}/${plan.scenes.length} clip ready.`);
        } catch (err) {
          console.warn(`[StickmanExplainer] Clip generation failed for scene ${i + 1}: ${err}`);
        }
      })
    );
  }
  onProgress?.(animated ? 0.9 : 0.55);

  // 6. Optional background music (Lyria) — non-fatal
  let musicTrack: { audioUrl: string; volume: number } | undefined;
  if (input.music) {
    try {
      onStage?.("music");
      const musicPrompt = plan.music || DEFAULT_STICKMAN_MUSIC;
      const { resultUrl } = await client.triggerMusic(musicPrompt);
      const [musicUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
      if (musicUrl) {
        musicTrack = { audioUrl: musicUrl, volume: 0.15 };
        console.log("[StickmanExplainer] Background music ready.");
      }
    } catch (err) {
      console.warn(`[StickmanExplainer] Music generation failed (continuing without): ${err}`);
    }
    onProgress?.(animated ? 0.95 : 0.6);
  }

  // 7. Assemble the timeline (butt-joined scenes; slideshow durations follow
  //    the narration length, animated durations follow the clip length).
  const elements: StickmanTimelineElement[] = [];
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
  const timeline: StickmanTimelineAsset = {
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
  console.log(`[StickmanExplainer] Timeline ready: ${elements.length} scenes (${animated ? "animated" : "slideshow"}), ${audio.length} narration tracks.`);
  return timeline;
}
