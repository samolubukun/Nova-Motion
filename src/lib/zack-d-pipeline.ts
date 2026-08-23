/**
 * ZackD mode pipeline — Zack D Films-style 3D curiosity shorts, replicated from
 * the reference zackd-director skill and re-hosted entirely on the WaveSpeed
 * stack this project already uses:
 *
 *   topic ─► LLM curiosity-loop beat map (hook → open loops → punchline)
 *             └─► character turnaround sheets (Seedream, orthographic views)
 *             └─► per beat: TTS narration (ElevenLabs / Deepgram fallback)
 *             └─► per shot: keyframe (Seedream, anchored on sheet refs)
 *                             └─► I2V motion clip (Seedance/Veo via WaveSpeed)
 *             └─► optional Lyria background music
 *   ──► ZackDTimelineAsset rendered by the ZackDVideo composition (impact
 *       zooms on "zoom_impact" shots + fade/wipe/slide/circle-open cuts).
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
  buildZackDKeyframePrompt,
  buildZackDMotionPrompt,
  buildZackDSheetPrompt,
  buildZackDSystemPrompt,
  DEFAULT_ZACK_D_MUSIC,
  ZackDBeat,
  ZackDBeatMap,
  ZackDCharacterSheet,
  ZackDShot,
} from "./zack-d-prompts";

const LLM_URL = process.env.ZACK_D_LLM_URL || "https://llm.wavespeed.ai/v1/chat/completions";
const LLM_MODEL = () =>
  process.env.ZACK_D_LLM_MODEL || process.env.WAVESPEED_LLM_MODEL || "deepseek/deepseek-v4-flash";

// Image-to-video model for animating keyframes. Defaults to Seedance 2.0
// (known-good payload contract with WavespeedClient); override with
// ZACK_D_I2V_MODEL (e.g. "google/veo3.1/image-to-video") if preferred.
const I2V_MODEL = () => process.env.ZACK_D_I2V_MODEL;

// Transition cycle ported from the skill's assemble.py.
const TRANSITIONS = ["fade", "wipeleft", "slideleft", "circleopen"] as const;

export interface ZackDVideoInput {
  prompt: string;
  title?: string;
  targetDurationSeconds?: number;
  language?: string;
  tone?: string;
  aspectRatio?: string;
  voice?: string;
  generateAudio?: boolean;
  music?: boolean;
  sceneCount?: number;
}

export interface ZackDPipelineOptions {
  onProgress?: (progress: number) => void;
  onStage?: (stage: string) => void;
  assetBaseUrl?: string;
  jobId?: string;
}

export interface ZackDTimelineElement {
  videoUrl: string;
  startMs: number;
  endMs: number;
  /** Slow push-in crop across the whole shot (the skill's impact zoom). */
  zoomImpact?: boolean;
  /** Transition used when this clip enters (skill's xfade cycle). */
  transition?: (typeof TRANSITIONS)[number];
}

export type ZackDTimelineAsset = Omit<WavespeedTimelineAsset, "elements"> & {
  elements: ZackDTimelineElement[];
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
const SHEET_SIZE = "1920*1080"; // turnaround sheets are landscape boards

const ABSOLUTIZE = (url: string, baseUrl: string): string =>
  url.startsWith("/") ? `${baseUrl}${url}` : url;

function extractJson(text: string): string {
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) return block[1].trim();
  const object = text.match(/\{[\s\S]*\}/);
  return object ? object[0] : text.trim();
}

// === 1. Curiosity-loop beat map ===
async function callBeatMapLLM(input: ZackDVideoInput): Promise<ZackDBeatMap> {
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
          content: buildZackDSystemPrompt(
            targetDurationSeconds,
            input.language || "English",
            input.tone || "energetic",
            input.sceneCount
          ),
        },
        {
          role: "user",
          content: JSON.stringify({
            topic: input.prompt,
            title: input.title || "",
            beatCount: input.sceneCount,
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) throw new Error(`LLM error ${response.status}: ${await response.text()}`);
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM returned an empty beat map");
  const parsed = JSON.parse(extractJson(content)) as ZackDBeatMap;
  if (!Array.isArray(parsed.beats) || parsed.beats.length === 0) {
    throw new Error("LLM returned an invalid beat map");
  }
  // Sanitize: every beat needs at least one shot; keep at most 2 shots per beat.
  parsed.beats = parsed.beats.map((beat) => ({
    ...beat,
    shots: (Array.isArray(beat.shots) && beat.shots.length ? beat.shots : [fallbackShot(beat.narration)]).slice(0, 2),
  }));
  if (input.sceneCount && parsed.beats.length > input.sceneCount) {
    parsed.beats = parsed.beats.slice(0, input.sceneCount);
  }
  if (!Array.isArray(parsed.character_sheets)) parsed.character_sheets = [];
  return parsed;
}

function fallbackShot(narration: string): ZackDShot {
  return {
    type: "wide",
    scene_description: `stylized 3D scene illustrating: ${narration}`,
    camera_move: "push_in",
    zoom_impact: false,
  };
}

// Deterministic fallback if the LLM is unreachable — a 3-beat myth-buster loop
// (beat-layer.md formula #1) so the pipeline still produces a valid structure.
function fallbackBeatMap(topic: string): ZackDBeatMap {
  const sheets: ZackDCharacterSheet[] = [
    {
      name: "main_character_turnaround",
      description: "curious young person with big expressive eyes wearing a simple blue t-shirt",
      kind: "character",
    },
    {
      name: "subject_cross_section_turnaround",
      description: `semi-translucent glossy cross-section model of the subject of ${topic}`,
      kind: "asset",
    },
  ];
  const beat = (
    narration: string,
    hook: boolean,
    typeA: string,
    typeB: string,
    camA: string,
    camB: string
  ): ZackDBeat => ({
    narration,
    hook,
    shots: [
      {
        type: typeA,
        scene_description: `${sheets[0].description} reacting to ${topic}, full body wide view`,
        camera_move: camA,
        zoom_impact: false,
        character_refs: [sheets[0].name],
      },
      {
        type: typeB,
        scene_description: `macro cross-section cutaway revealing what really happens inside during ${topic}`,
        camera_move: camB,
        zoom_impact: true,
        character_refs: [sheets[1].name],
      },
    ],
  });
  return {
    title: topic.slice(0, 60),
    music: DEFAULT_ZACK_D_MUSIC,
    character_sheets: sheets,
    beats: [
      beat(
        `You've probably heard a wild story about ${topic}... but is it actually true?`,
        true,
        "wide",
        "macro_cross_section",
        "push_in",
        "tilt_down"
      ),
      beat(
        `To find out, we have to look closer — because the real mechanism is stranger than the myth.`,
        false,
        "wide",
        "macro",
        "pan_right",
        "pan_left"
      ),
      beat(
        `And the answer changes everything you thought you knew about ${topic}!`,
        false,
        "wide",
        "detail",
        "static",
        "pull_out"
      ),
    ],
  };
}

// === 2. Character consistency sheets ===
async function generateSheet(
  client: WavespeedClient,
  sheet: ZackDCharacterSheet,
  jobId: string,
  index: number
): Promise<{ name: string; url: string } | null> {
  try {
    const prompt = buildZackDSheetPrompt(sheet);
    const { resultUrl } = await client.triggerImage(prompt, SHEET_SIZE);
    const [sheetUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
    if (!sheetUrl) throw new Error("no output");
    // Persist so the asset survives provider cleanup and is inspectable.
    const buffer = await (await fetch(sheetUrl)).arrayBuffer();
    await uploadAsset(Buffer.from(buffer), `${jobId}-sheet-${index}-${sheet.name}.jpg`, "image/jpeg");
    console.log(`[ZackD] Character sheet "${sheet.name}" ready.`);
    return { name: sheet.name, url: sheetUrl };
  } catch (err) {
    console.warn(`[ZackD] Sheet generation failed for "${sheet.name}": ${err}`);
    return null;
  }
}

// === 3. Keyframe + motion clip for one shot ===
async function generateShotClip(
  client: WavespeedClient,
  shotIndex: number,
  shot: ZackDShot,
  anchors: ZackDCharacterSheet[],
  durationSec: number,
  aspectRatio: string,
  jobId: string,
  base: string
): Promise<string> {
  const size = IMAGE_SIZES[aspectRatio] || IMAGE_SIZES["9:16"];
  const keyframePrompt = buildZackDKeyframePrompt(shot, anchors);
  const { resultUrl } = await client.triggerImage(keyframePrompt, size);
  const [keyframeUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
  if (!keyframeUrl) throw new Error(`Keyframe generation returned no output for shot ${shotIndex}`);

  const buffer = await (await fetch(keyframeUrl)).arrayBuffer();
  const persistedKeyframe = await uploadAsset(
    Buffer.from(buffer),
    `${jobId}-keyframe-${shotIndex}.jpg`,
    "image/jpeg"
  );

  const motionPrompt = buildZackDMotionPrompt(shot);
  const { resultUrl: clipResultUrl } = await client.triggerImageToVideo(
    motionPrompt,
    ABSOLUTIZE(persistedKeyframe, base),
    Math.min(10, Math.max(4, Math.ceil(durationSec))),
    "720p",
    I2V_MODEL()
  );
  const [clipUrl] = await client.pollPrediction(clipResultUrl, 5000, 600000);
  if (!clipUrl) throw new Error(`Clip generation returned no output for shot ${shotIndex}`);
  return clipUrl;
}

// === 4. Assemble the final timeline ===
export async function generateZackDVideoTimeline(
  input: ZackDVideoInput,
  options: ZackDPipelineOptions = {}
): Promise<ZackDTimelineAsset> {
  const { assetBaseUrl, onProgress, onStage } = options;
  const base = assetBaseUrl || process.env.RENDER_SERVER_BASE_URL || "http://localhost:3001";
  const aspectRatio = input.aspectRatio || "9:16";
  const jobId = options.jobId || uuidv4();

  const client = new WavespeedClient();
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  fs.mkdirSync(tempDir, { recursive: true });

  onStage?.("planning");
  onProgress?.(0.02);

  // 1. Curiosity-loop beat map
  let beatMap: ZackDBeatMap;
  try {
    beatMap = await callBeatMapLLM(input);
  } catch (err) {
    console.warn("[ZackD] Beat map LLM failed, using fallback myth-buster loop:", err);
    beatMap = fallbackBeatMap(input.prompt);
  }
  const beats = beatMap.beats;
  console.log(
    `[ZackD] Beat map ready: ${beats.length} beats, ${beatMap.character_sheets.length} character sheets, title="${beatMap.title}"`
  );
  onProgress?.(0.08);

  // 2. Character turnaround sheets (parallel, non-fatal)
  onStage?.("character_sheets");
  const sheets = beatMap.character_sheets.slice(0, 4);
  const sheetResults = await Promise.all(
    sheets.map((sheet, i) => generateSheet(client, sheet, jobId, i))
  );
  const sheetByName = new Map<string, string>();
  for (const s of sheetResults) if (s) sheetByName.set(s.name, s.url);
  onProgress?.(0.18);

  // 3. Voiceover per beat (sequential, one voice)
  const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY);
  let defaultVoice = AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  if (hasElevenLabs) defaultVoice = DEFAULT_ELEVENLABS_VOICE_ID;
  const selectedVoice = input.voice || defaultVoice;

  interface BeatVoice {
    audioUrl: string;
    words: Array<{ word: string; start: number; end: number }>;
    audioEndSec: number;
  }
  const beatVoices: BeatVoice[] = [];
  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    const localAudioPath = path.join(tempDir, `${jobId}-zackd-beat-${i}.mp3`);
    try {
      if (input.generateAudio !== false && beat.narration.trim()) {
        const wordTimestamps = await generateSpeechWithTimestamps(beat.narration, localAudioPath, selectedVoice);
        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        const audioEndSec = Math.max(
          1.5,
          lastWord ? lastWord.end + 0.35 : beat.narration.split(/\s+/).length / 2.5 + 0.35
        );
        const audioUrl = await uploadAsset(fs.readFileSync(localAudioPath), `${jobId}-zackd-beat-${i}.mp3`, "audio/mpeg");
        beatVoices.push({ audioUrl, words: wordTimestamps, audioEndSec });
        console.log(`[ZackD] Beat ${i + 1} voiceover: ${audioEndSec.toFixed(1)}s`);
      } else {
        beatVoices.push({ audioUrl: "", words: [], audioEndSec: 6 });
      }
    } catch (err) {
      console.warn(`[ZackD] TTS failed for beat ${i + 1}: ${err}`);
      beatVoices.push({ audioUrl: "", words: [], audioEndSec: 6 });
    }
    onProgress?.(0.18 + ((i + 1) / Math.max(1, beats.length)) * 0.12);
  }

  // 4. Per-shot keyframes + clips (parallel workers, non-fatal per shot)
  onStage?.("keyframes");
  interface PlannedShot {
    beatIndex: number;
    shotIndexInBeat: number;
    globalIndex: number;
    shot: ZackDShot;
    durationSec: number;
    transition: (typeof TRANSITIONS)[number];
  }
  const plannedShots: PlannedShot[] = [];
  let globalShotIndex = 0;
  beats.forEach((beat, beatIndex) => {
    const voice = beatVoices[beatIndex];
    const half = Math.min(5, Math.max(2, voice.audioEndSec / 2));
    const durations =
      beat.shots.length === 1
        ? [Math.max(3, voice.audioEndSec)]
        : beat.shots.map((_, idx) =>
            idx < beat.shots.length - 1 ? half : Math.max(half, voice.audioEndSec - half * (beat.shots.length - 1))
          );
    beat.shots.forEach((shot, shotIdx) => {
      plannedShots.push({
        beatIndex,
        shotIndexInBeat: shotIdx,
        globalIndex: globalShotIndex++,
        shot,
        durationSec: durations[Math.min(shotIdx, durations.length - 1)] || 3,
        // First clip enters clean; the rest ride the xfade-style cycle.
        transition:
          globalShotIndex === 0 ? "fade" : TRANSITIONS[globalShotIndex % TRANSITIONS.length],
      });
    });
  });

  const clipUrls: Array<string | null> = new Array(plannedShots.length).fill(null);
  const concurrency = 2;
  let cursor = 0;
  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= plannedShots.length) return;
      const plan = plannedShots[i];
      // Resolve this shot's anchors against successfully generated sheets.
      const anchorNames = (plan.shot.character_refs || []).filter((name) =>
        beatMap.character_sheets.some((s) => s.name === name)
      );
      const anchors = (
        anchorNames.length
          ? beatMap.character_sheets.filter((s) => anchorNames.includes(s.name))
          : beatMap.character_sheets
      ).slice(0, 2);
      try {
        onStage?.("video_generation");
        const clipUrl = await generateShotClip(
          client,
          plan.globalIndex,
          plan.shot,
          anchors,
          plan.durationSec,
          aspectRatio,
          jobId,
          base
        );
        clipUrls[i] = clipUrl;
        console.log(`[ZackD] Shot ${plan.globalIndex + 1}/${plannedShots.length} clip ready.`);
      } catch (err) {
        console.warn(`[ZackD] Clip generation failed for shot ${plan.globalIndex + 1}: ${err}`);
      }
      onProgress?.(0.3 + ((i + 1) / Math.max(1, plannedShots.length)) * 0.58);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, plannedShots.length) }, () => worker()));

  // 5. Optional background music (Lyria) — non-fatal
  let musicTrack: { audioUrl: string; volume: number } | undefined;
  if (input.music) {
    try {
      onStage?.("music");
      const musicPrompt = beatMap.music || DEFAULT_ZACK_D_MUSIC;
      const { resultUrl } = await client.triggerMusic(musicPrompt);
      const [musicUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
      if (musicUrl) {
        musicTrack = { audioUrl: musicUrl, volume: 0.15 };
        console.log(`[ZackD] Background music ready.`);
      }
    } catch (err) {
      console.warn(`[ZackD] Music generation failed (continuing without): ${err}`);
    }
    onProgress?.(0.95);
  }

  // 6. Assemble the timeline
  const elements: ZackDTimelineElement[] = [];
  const audio: WavespeedTimelineAsset["audio"] = [];
  const words: TimelineWord[] = [];
  let offsetMs = 0;
  let anyClip = false;

  for (let i = 0; i < plannedShots.length; i++) {
    const plan = plannedShots[i];
    const clipUrl = clipUrls[i];
    const startMs = offsetMs;
    const endMs = startMs + Math.round(plan.durationSec * 1000);

    if (clipUrl) {
      anyClip = true;
      elements.push({
        videoUrl: clipUrl,
        startMs,
        endMs,
        zoomImpact: plan.shot.zoom_impact,
        transition: plan.transition,
      });
    }

    const isFirstShotOfBeat = plan.shotIndexInBeat === 0;
    if (isFirstShotOfBeat) {
      const voice = beatVoices[plan.beatIndex];
      if (voice.audioUrl) {
        const beatAudioEndMs = Math.min(endMs, startMs + Math.round(voice.audioEndSec * 1000));
        audio.push({ startMs, endMs: beatAudioEndMs, audioUrl: voice.audioUrl });
      }
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
    throw new Error("ZackD pipeline failed: no clips were generated for any shot.");
  }

  const { width, height } = getAspectRatioDimensions(aspectRatio);
  const timeline: ZackDTimelineAsset = {
    shortTitle: (beatMap.title || input.title || input.prompt).slice(0, 60),
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
  console.log(`[ZackD] Timeline ready: ${elements.length} clips, ${audio.length} narration tracks.`);
  return timeline;
}
