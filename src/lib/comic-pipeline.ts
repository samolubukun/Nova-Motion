/**
 * ComicDrama mode pipeline — AI comic / anime drama episodes, replicated from
 * the reference AIComicBuilder project and re-hosted entirely on the WaveSpeed
 * stack this project already uses:
 *
 *   script ─► LLM story plan (characters + continuity-chained shot list)
 *              └─► 4-view character sheets (Seedream)
 *              └─► per shot: FIRST keyframe + LAST keyframe (Seedream v4
 *                             EDIT with the sheets attached as real reference
 *                             images; the LAST frame also receives the FIRST
 *                             frame itself as its primary visual reference)
 *                              └─► start/end-frame interpolated clip (Wan
 *                                  2.2 i2v `last_image`, or wan-flf2v)
 *              └─► dialogue TTS (ElevenLabs / Deepgram fallback)
 *              └─► optional Lyria background music
 *   ──► ComicDramaTimelineAsset rendered by the ComicDramaVideo composition
 *       (hard cuts with white flash frames + comic subtitle strip).
 *
 * The signature tricks ported from AIComicBuilder are (1) the first/last
 * frame pair per shot — the I2V model interpolates between two locked
 * keyframes and shot N's last frame anchors shot N+1's first-frame prompt —
 * and (2) passing the actual character-sheet images into keyframe generation
 * as reference inputs instead of relying on text descriptions alone.
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
  buildComicFirstFramePrompt,
  buildComicLastFramePrompt,
  buildComicMotionPrompt,
  buildComicSheetPrompt,
  buildComicSystemPrompt,
  COMIC_STYLE_PRESETS,
  DEFAULT_COMIC_MUSIC,
  ComicCharacter,
  ComicShotPlan,
  ComicStoryPlan,
} from "./comic-prompts";

const LLM_URL = process.env.COMIC_LLM_URL || process.env.ZACK_D_LLM_URL || "https://llm.wavespeed.ai/v1/chat/completions";
const LLM_MODEL = () =>
  process.env.COMIC_LLM_MODEL || process.env.WAVESPEED_LLM_MODEL || "deepseek/deepseek-v4-flash";

// Start/end-frame interpolation model. Defaults to Wan 2.2 i2v ultra-fast
// ($0.10/5s) which accepts an optional `last_image` for start-to-end
// interpolation. Override with COMIC_I2V_MODEL — e.g.
// "wavespeed-ai/wan-flf2v" (dedicated FLF2V model; payload uses first_image).
const I2V_MODEL = () =>
  process.env.COMIC_I2V_MODEL || "wavespeed-ai/wan-2.2/i2v-720p-ultra-fast";

// Image-edit model used for reference-locked keyframes. Accepts up to 10
// `images` URLs plus an (undocumented but honored) `size` in "W*H" format.
// Override with COMIC_KEYFRAME_EDIT_MODEL.
const KEYFRAME_EDIT_MODEL = () =>
  process.env.COMIC_KEYFRAME_EDIT_MODEL || "bytedance/seedream-v4/edit";

export interface ComicDramaVideoInput {
  prompt: string;
  title?: string;
  targetDurationSeconds?: number;
  language?: string;
  tone?: string;
  artStyle?: string;
  aspectRatio?: string;
  voice?: string;
  generateAudio?: boolean;
  music?: boolean;
  sceneCount?: number;
}

export interface ComicPipelineOptions {
  onProgress?: (progress: number) => void;
  onStage?: (stage: string) => void;
  assetBaseUrl?: string;
  jobId?: string;
}

export interface ComicDramaTimelineElement {
  videoUrl: string;
  startMs: number;
  endMs: number;
}

export type ComicDramaTimelineAsset = Omit<WavespeedTimelineAsset, "elements"> & {
  elements: ComicDramaTimelineElement[];
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
const SHEET_SIZE = "1920*1080"; // character sheets are landscape boards

const ABSOLUTIZE = (url: string, baseUrl: string): string =>
  url.startsWith("/") ? `${baseUrl}${url}` : url;

function extractJson(text: string): string {
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) return block[1].trim();
  const object = text.match(/\{[\s\S]*\}/);
  return object ? object[0] : text.trim();
}

/** Resolve the style block for a plan, honoring the requested artStyle. */
function resolveStyleBlock(plan: ComicStoryPlan, requested?: string): string {
  const key =
    requested && requested !== "auto" && COMIC_STYLE_PRESETS[requested]
      ? requested
      : plan.style && COMIC_STYLE_PRESETS[plan.style]
        ? plan.style
        : "anime";
  return `${COMIC_STYLE_PRESETS[key].imageStyleBlock} (${COMIC_STYLE_PRESETS[key].label} style — every image must match this exactly)`;
}

// === 1. Story plan (script parse → characters → shot list) ===
async function callStoryPlanLLM(input: ComicDramaVideoInput): Promise<ComicStoryPlan> {
  const apiKey = process.env.WAVESPEED_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("A WAVESPEED_API_KEY or OPENAI_API_KEY is required");

  const targetDurationSeconds = input.targetDurationSeconds || 30;
  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LLM_MODEL(),
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: buildComicSystemPrompt(
            targetDurationSeconds,
            input.language || "English",
            input.tone || "dramatic",
            input.artStyle || "auto",
            input.sceneCount
          ),
        },
        {
          role: "user",
          content: JSON.stringify({
            story: input.prompt,
            title: input.title || "",
            shotCount: input.sceneCount,
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) throw new Error(`LLM error ${response.status}: ${await response.text()}`);
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM returned an empty story plan");
  const parsed = JSON.parse(extractJson(content)) as ComicStoryPlan;
  if (!Array.isArray(parsed.shots) || parsed.shots.length === 0) {
    throw new Error("LLM returned an invalid story plan");
  }
  // Sanitize: every shot needs frame descriptions; keep at most 10 shots.
  parsed.shots = parsed.shots.slice(0, 10).map((shot) => ({
    ...shot,
    first_frame_description: shot.first_frame_description || shot.scene_description,
    last_frame_description: shot.last_frame_description || shot.first_frame_description || shot.scene_description,
    camera_direction: shot.camera_direction || "static",
    dialogue: Array.isArray(shot.dialogue) ? shot.dialogue.slice(0, 2) : [],
  }));
  if (!Array.isArray(parsed.characters)) parsed.characters = [];
  parsed.characters = parsed.characters.slice(0, 4);
  return parsed;
}

// Deterministic fallback if the LLM is unreachable — a compact 3-shot
// revenge-of-the-underdog beat so the pipeline still produces valid output.
function fallbackStoryPlan(topic: string): ComicStoryPlan {
  const hero: ComicCharacter = {
    name: "hero",
    description: "determined young protagonist with messy dark hair wearing a worn orange jacket and fingerless gloves",
  };
  const rival: ComicCharacter = {
    name: "rival",
    description: "cold-eyed tall antagonist in a black long coat with silver hair swept back",
  };
  const shot = (
    scene: string,
    first: string,
    last: string,
    camera: string,
    dialogue: Array<{ character: string; line: string }>
  ) => ({
    scene_description: scene,
    first_frame_description: first,
    last_frame_description: last,
    camera_direction: camera,
    dialogue,
    character_refs: ["hero", "rival"],
  });
  return {
    title: topic.slice(0, 60),
    style: "anime",
    music: DEFAULT_COMIC_MUSIC,
    characters: [hero, rival],
    shots: [
      shot(
        `a rain-slicked rooftop arena at dusk where ${topic} comes to a head`,
        `${hero.name} stands at the near edge fists clenched, ${rival.name} waiting across the rooftop, rain falling`,
        `${hero.name} steps forward into a fighting stance, rain streaking past both of them`,
        "static",
        [{ character: "rival", line: "You really came alone?" }]
      ),
      shot(
        `the same rooftop mid-confrontation, wind picking up`,
        `${hero.name} mid-stance glaring across the rooftop`,
        `${hero.name} lunges forward with a raised fist while ${rival.name} narrows their eyes`,
        "zoom_in",
        [
          { character: "hero", line: "I came to finish this." },
          { character: "rival", line: "Then don't hold back." },
        ]
      ),
      shot(
        `the rooftop clash moment, debris suspended in air`,
        `${hero.name}'s fist colliding toward ${rival.name}'s guard, shockwave rippling`,
        `both fighters locked in struggle silhouetted against the breaking dawn sky`,
        "zoom_out",
        [],
      ),
    ],
  };
}

// === 2. Character consistency sheets ===
type ComicAnchor = ComicCharacter & { sheetUrl?: string };

async function generateSheet(
  client: WavespeedClient,
  character: ComicCharacter,
  styleBlock: string,
  jobId: string,
  index: number
): Promise<ComicAnchor | null> {
  try {
    const prompt = buildComicSheetPrompt(character, styleBlock);
    const { resultUrl } = await client.triggerImage(prompt, SHEET_SIZE);
    const [sheetUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
    if (!sheetUrl) throw new Error("no output");
    // Persist so the asset survives provider cleanup and is inspectable.
    const buffer = await (await fetch(sheetUrl)).arrayBuffer();
    await uploadAsset(Buffer.from(buffer), `${jobId}-comic-sheet-${index}-${character.name}.jpg`, "image/jpeg");
    console.log(`[ComicDrama] Character sheet "${character.name}" ready.`);
    // Keep the provider CDN URL — it doubles as a keyframe reference image.
    return { ...character, sheetUrl };
  } catch (err) {
    console.warn(`[ComicDrama] Sheet generation failed for "${character.name}": ${err}`);
    return null;
  }
}

// === 3. First/last keyframes + interpolated clip for one shot ===
async function triggerFlfClip(
  client: WavespeedClient,
  motionPrompt: string,
  firstFrameUrl: string,
  lastFrameUrl: string,
  durationSec: number
): Promise<{ resultUrl: string }> {
  const model = I2V_MODEL();
  if (model.includes("flf2v")) {
    // Dedicated first-last-frame model payload (wan-flf2v).
    return client.triggerModel(model, {
      first_image: firstFrameUrl,
      last_image: lastFrameUrl,
      prompt: motionPrompt,
      duration: durationSec === 10 ? 10 : 5,
      size: "720*1280",
    });
  }
  // Wan 2.2 i2v ultra-fast payload: base image + optional last_image for
  // start-to-end interpolation. Duration must be 5 or 8 seconds.
  return client.triggerModel(model, {
    prompt: motionPrompt,
    image: firstFrameUrl,
    last_image: lastFrameUrl,
    duration: durationSec > 5.5 ? 8 : 5,
    enable_safety_checker: true,
  });
}

interface ShotKeyframeContext {
  shotIndex: number;
  shot: ComicShotPlan;
  anchors: ComicAnchor[];
  sheetUrls: string[];
  styleBlock: string;
  previousLastFrame?: string;
}

/**
 * Keyframe generation with real reference images (the AIComicBuilder trick):
 * Seedream v4 Edit receives the character sheets — and for the LAST frame the
 * shot's own FIRST frame is prepended as the primary visual reference — so
 * identity, outfit and environment are visually locked instead of merely
 * described. Falls back to plain text-to-image when no references exist or
 * the edit model fails.
 */
async function generateKeyframe(
  client: WavespeedClient,
  prompt: string,
  size: string,
  refImages: string[]
): Promise<string> {
  const refs = refImages.filter(Boolean).slice(0, 10);
  if (refs.length) {
    try {
      const { resultUrl } = await client.triggerModel(KEYFRAME_EDIT_MODEL(), {
        prompt,
        images: refs,
        size,
      });
      const [url] = await client.pollPrediction(resultUrl, 5000, 300000);
      if (url) return url;
      console.warn("[ComicDrama] Reference keyframe returned no output, falling back to text-to-image.");
    } catch (err) {
      console.warn(`[ComicDrama] Reference keyframe failed, falling back to text-to-image: ${err}`);
    }
  }
  const { resultUrl } = await client.triggerImage(prompt, size);
  const [url] = await client.pollPrediction(resultUrl, 5000, 300000);
  if (!url) throw new Error("keyframe generation returned no output");
  return url;
}

async function generateShotClip(
  client: WavespeedClient,
  ctx: ShotKeyframeContext,
  audioEndSec: number | null,
  aspectRatio: string,
  jobId: string,
  base: string
): Promise<{ clipUrl: string; clipDurationSec: number }> {
  const size = IMAGE_SIZES[aspectRatio] || IMAGE_SIZES["9:16"];

  // First keyframe (anchored on sheets + previous shot's end state).
  const firstPrompt = buildComicFirstFramePrompt(ctx.shot, ctx.anchors, ctx.styleBlock, ctx.previousLastFrame);
  const firstFrameUrl = await generateKeyframe(client, firstPrompt, size, ctx.sheetUrls);

  const firstBuffer = await (await fetch(firstFrameUrl)).arrayBuffer();
  const persistedFirstFrame = await uploadAsset(
    Buffer.from(firstBuffer),
    `${jobId}-comic-first-${ctx.shotIndex}.jpg`,
    "image/jpeg"
  );

  // Last keyframe — the first frame itself is prepended as reference #1 so
  // the closing frame literally sees its opening counterpart (AIComicBuilder
  // trick), with the character sheets backing it up.
  const lastPrompt = buildComicLastFramePrompt(ctx.shot, ctx.anchors, ctx.styleBlock, ctx.shot.first_frame_description);
  const lastFrameUrl = await generateKeyframe(client, lastPrompt, size, [firstFrameUrl, ...ctx.sheetUrls]);

  const lastBuffer = await (await fetch(lastFrameUrl)).arrayBuffer();
  const persistedLastFrame = await uploadAsset(
    Buffer.from(lastBuffer),
    `${jobId}-comic-last-${ctx.shotIndex}.jpg`,
    "image/jpeg"
  );

  // Interpolated clip between the two keyframes. Wan 2.2 supports 5s/8s;
  // pick 8 when the dialogue needs the room.
  const motionPrompt = buildComicMotionPrompt(ctx.shot);
  const targetDuration = audioEndSec && audioEndSec > 5.6 ? 8 : 5;
  const { resultUrl: clipResultUrl } = await triggerFlfClip(
    client,
    motionPrompt,
    ABSOLUTIZE(persistedFirstFrame, base),
    ABSOLUTIZE(persistedLastFrame, base),
    targetDuration
  );
  const [clipUrl] = await client.pollPrediction(clipResultUrl, 5000, 600000);
  if (!clipUrl) throw new Error(`Clip generation returned no output for shot ${ctx.shotIndex}`);
  return { clipUrl, clipDurationSec: targetDuration };
}

// === 4. Assemble the final timeline ===
export async function generateComicDramaVideoTimeline(
  input: ComicDramaVideoInput,
  options: ComicPipelineOptions = {}
): Promise<ComicDramaTimelineAsset> {
  const { assetBaseUrl, onProgress, onStage } = options;
  const base = assetBaseUrl || process.env.RENDER_SERVER_BASE_URL || "http://localhost:3001";
  const aspectRatio = input.aspectRatio || "9:16";
  const jobId = options.jobId || uuidv4();

  const client = new WavespeedClient();
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  fs.mkdirSync(tempDir, { recursive: true });

  onStage?.("planning");
  onProgress?.(0.02);

  // 1. Story plan
  let plan: ComicStoryPlan;
  try {
    plan = await callStoryPlanLLM(input);
  } catch (err) {
    console.warn("[ComicDrama] Story plan LLM failed, using fallback structure:", err);
    plan = fallbackStoryPlan(input.prompt.slice(0, 120));
  }
  const styleBlock = resolveStyleBlock(plan, input.artStyle);
  console.log(
    `[ComicDrama] Story plan ready: ${plan.shots.length} shots, ${plan.characters.length} characters, style="${plan.style}", title="${plan.title}"`
  );
  onProgress?.(0.06);

  // 2. Character sheets (parallel, non-fatal)
  onStage?.("character_sheets");
  const sheetResults = await Promise.all(
    plan.characters.map((character, i) => generateSheet(client, character, styleBlock, jobId, i))
  );
  onProgress?.(0.14);

  // 3. Dialogue voiceover per shot (sequential, one voice)
  const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY);
  let defaultVoice = AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  if (hasElevenLabs) defaultVoice = DEFAULT_ELEVENLABS_VOICE_ID;
  const selectedVoice = input.voice || defaultVoice;

  interface ShotVoice {
    audioUrl: string;
    words: Array<{ word: string; start: number; end: number }>;
    audioEndSec: number;
  }
  const shotVoices: ShotVoice[] = [];
  for (let i = 0; i < plan.shots.length; i++) {
    const shot = plan.shots[i];
    const spokenLines = shot.dialogue.map((d) => d.line).join(" ").trim();
    const localAudioPath = path.join(tempDir, `${jobId}-comic-shot-${i}.mp3`);
    try {
      if (input.generateAudio !== false && spokenLines) {
        const wordTimestamps = await generateSpeechWithTimestamps(spokenLines, localAudioPath, selectedVoice);
        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        const audioEndSec = Math.max(
          1.5,
          lastWord ? lastWord.end + 0.35 : spokenLines.split(/\s+/).length / 2.5 + 0.35
        );
        const audioUrl = await uploadAsset(fs.readFileSync(localAudioPath), `${jobId}-comic-shot-${i}.mp3`, "audio/mpeg");
        shotVoices.push({ audioUrl, words: wordTimestamps, audioEndSec });
        console.log(`[ComicDrama] Shot ${i + 1} dialogue: ${audioEndSec.toFixed(1)}s`);
      } else {
        shotVoices.push({ audioUrl: "", words: [], audioEndSec: 0 });
      }
    } catch (err) {
      console.warn(`[ComicDrama] TTS failed for shot ${i + 1}: ${err}`);
      shotVoices.push({ audioUrl: "", words: [], audioEndSec: 0 });
    }
    onProgress?.(0.14 + ((i + 1) / Math.max(1, plan.shots.length)) * 0.12);
  }

  // 4. Per-shot keyframe pairs + interpolated clips (workers, non-fatal)
  //    Keyframes are generated SEQUENTIALLY in shot order so each shot's
  //    first-frame prompt can chain from the previous shot's end state.
  onStage?.("keyframes");
  const clipResults: Array<{ clipUrl: string; clipDurationSec: number } | null> = new Array(
    plan.shots.length
  ).fill(null);

  for (let i = 0; i < plan.shots.length; i++) {
    const shot = plan.shots[i];
    const anchorNames = (shot.character_refs || []).filter((name) =>
      sheetResults.some((s) => s && s.name === name)
    );
    const anchors = (
      anchorNames.length ? sheetResults.filter((s) => s && anchorNames.includes(s.name)) : sheetResults
    ).slice(0, 3).filter(Boolean) as ComicAnchor[];
    const sheetUrls = anchors.map((a) => a.sheetUrl).filter((u): u is string => Boolean(u));
    const previousLastFrame = i > 0 ? plan.shots[i - 1].last_frame_description : undefined;
    try {
      onStage?.("video_generation");
      clipResults[i] = await generateShotClip(
        client,
        { shotIndex: i, shot, anchors, sheetUrls, styleBlock, previousLastFrame },
        shotVoices[i].audioEndSec || null,
        aspectRatio,
        jobId,
        base
      );
      console.log(`[ComicDrama] Shot ${i + 1}/${plan.shots.length} clip ready.`);
    } catch (err) {
      console.warn(`[ComicDrama] Clip generation failed for shot ${i + 1}: ${err}`);
    }
    onProgress?.(0.26 + ((i + 1) / Math.max(1, plan.shots.length)) * 0.62);
  }

  // 5. Optional background music (Lyria) — non-fatal
  let musicTrack: { audioUrl: string; volume: number } | undefined;
  if (input.music) {
    try {
      onStage?.("music");
      const musicPrompt = plan.music || DEFAULT_COMIC_MUSIC;
      const { resultUrl } = await client.triggerMusic(musicPrompt);
      const [musicUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
      if (musicUrl) {
        musicTrack = { audioUrl: musicUrl, volume: 0.15 };
        console.log(`[ComicDrama] Background music ready.`);
      }
    } catch (err) {
      console.warn(`[ComicDrama] Music generation failed (continuing without): ${err}`);
    }
    onProgress?.(0.95);
  }

  // 6. Assemble the timeline (hard cuts — clips butt-jointed back to back)
  const elements: ComicDramaTimelineElement[] = [];
  const audio: WavespeedTimelineAsset["audio"] = [];
  const words: TimelineWord[] = [];
  let offsetMs = 0;
  let anyClip = false;

  for (let i = 0; i < plan.shots.length; i++) {
    const clip = clipResults[i];
    const voice = shotVoices[i];
    const startMs = offsetMs;
    const clipDurationSec = clip?.clipDurationSec ?? Math.max(3, Math.min(8, voice.audioEndSec || 5));
    const endMs = startMs + Math.round(clipDurationSec * 1000);

    if (clip) {
      anyClip = true;
      elements.push({ videoUrl: clip.clipUrl, startMs, endMs });
    }

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

  if (!anyClip) {
    throw new Error("ComicDrama pipeline failed: no clips were generated for any shot.");
  }

  const { width, height } = getAspectRatioDimensions(aspectRatio);
  const timeline: ComicDramaTimelineAsset = {
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
  timeline.elements = timeline.elements.map((e) => ({ ...e, videoUrl: ABSOLUTIZE(e.videoUrl, base) }));
  timeline.audio = timeline.audio.map((a) => ({ ...a, audioUrl: ABSOLUTIZE(a.audioUrl, base) }));
  if (timeline.music) {
    timeline.music = timeline.music.map((m) => ({ ...m, audioUrl: ABSOLUTIZE(m.audioUrl, base) }));
  }

  onProgress?.(1);
  console.log(`[ComicDrama] Timeline ready: ${elements.length} clips, ${audio.length} dialogue tracks.`);
  return timeline;
}
