/**
 * Vox mode pipeline — Vox-style paper-collage explainer video, replicated from
 * the reference Vox AI Motion Graphics Generator and adapted to the APIs this
 * project already uses:
 *
 *   topic ─► LLM narrative beat map (Vox arcs + collage prompt guide)
 *             └─► per beat: Seedream collage poster (5-part Vox prompt formula)
 *                             └─► Seedance I2V animates the poster into a clip
 *             └─► TTS narration (ElevenLabs preferred, Deepgram fallback)
 *             └─► optional Lyria background music
 *   ──► WavespeedTimelineAsset assembled by the WavespeedVideo composition
 *
 * Mirrors the Luma/UGC pipeline shape so the same Remotion composition renders
 * the finished video (clips + kinetic captions + voiceover + music).
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
  VoxBeat,
  VoxBeatMap,
  buildVoxImagePrompt,
  buildVoxMotionPrompt,
  buildVoxSystemPrompt,
  DEFAULT_VOX_THEME,
} from "./vox-prompts";

const LLM_URL = process.env.VOX_LLM_URL || "https://llm.wavespeed.ai/v1/chat/completions";
const LLM_MODEL = () =>
  process.env.VOX_LLM_MODEL || process.env.WAVESPEED_LLM_MODEL || "deepseek/deepseek-v4-flash";

export interface VoxVideoInput {
  prompt: string;
  title?: string;
  theme?: string;
  arc?: string;
  targetDurationSeconds?: number;
  language?: string;
  tone?: string;
  aspectRatio?: string;
  voice?: string;
  generateAudio?: boolean;
  music?: boolean;
  sceneCount?: number;
}

export interface VoxPipelineOptions {
  onProgress?: (progress: number) => void;
  onStage?: (stage: string) => void;
  assetBaseUrl?: string;
  jobId?: string;
}

type VoxTimelineAsset = WavespeedTimelineAsset;

// Poster image sizes per aspect ratio (Seedream "WIDTH*HEIGHT" format).
const VOX_IMAGE_SIZES: Record<string, string> = {
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

// === 1. LLM narrative beat map ===
async function callBeatMapLLM(input: VoxVideoInput): Promise<VoxBeatMap> {
  const apiKey = process.env.WAVESPEED_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("A WAVESPEED_API_KEY or OPENAI_API_KEY is required");

  const targetDurationSeconds = input.targetDurationSeconds || 30;
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
          content: buildVoxSystemPrompt(
            targetDurationSeconds,
            input.arc,
            input.theme,
            input.language || "English",
            input.tone || "natural"
          ),
        },
        {
          role: "user",
          content: JSON.stringify({
            topic: input.prompt,
            title: input.title || "",
            theme: input.theme || DEFAULT_VOX_THEME,
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
  if (!content) throw new Error("LLM returned an empty beat map");
  const parsed = JSON.parse(extractJson(content)) as VoxBeatMap;
  if (!Array.isArray(parsed.beats) || parsed.beats.length === 0) {
    throw new Error("LLM returned an invalid beat map");
  }
  if (input.sceneCount && parsed.beats.length > input.sceneCount) {
    parsed.beats = parsed.beats.slice(0, input.sceneCount);
  }
  return parsed;
}

// Deterministic fallback if the LLM is unreachable — splits the topic into a
// simple 3-beat hook/context/payoff structure so the pipeline still works.
function fallbackBeatMap(topic: string): VoxBeatMap {
  const fallbackBeat = (headline: string, narration: string, scene: string, bg: string): VoxBeat => ({
    headline,
    narration,
    scene,
    element_motion: "paper elements drift gently, halftone dots pulse slowly",
    bg,
    shot_size: "WIDE",
    camera_move: "push_in",
  });
  return {
    title: topic.slice(0, 60),
    theme: DEFAULT_VOX_THEME,
    music: "light upbeat editorial soundtrack, acoustic, instrumental",
    beats: [
      fallbackBeat(
        topic.toUpperCase().slice(0, 30),
        `Let's look at ${topic}.`,
        `bold paper cut-outs illustrating ${topic}, layered collage elements`,
        "bold amber"
      ),
      fallbackBeat(
        "WHY IT MATTERS",
        `Here is why ${topic} matters today.`,
        `paper collage figures pointing at a cut-out chart, halftone background`,
        "mustard yellow"
      ),
      fallbackBeat(
        "THE TAKEAWAY",
        `Now you know the essentials of ${topic}.`,
        `a torn paper banner with a big checkmark and radiating sunburst lines`,
        "teal blue"
      ),
    ],
  };
}

// === 2. Generate + persist one collage poster image ===
async function generatePoster(
  client: WavespeedClient,
  beat: VoxBeat,
  theme: string | undefined,
  aspectRatio: string,
  jobId: string,
  index: number
): Promise<string> {
  const size = VOX_IMAGE_SIZES[aspectRatio] || VOX_IMAGE_SIZES["9:16"];
  const prompt = buildVoxImagePrompt(beat, theme, aspectRatio);
  const { resultUrl } = await client.triggerImage(prompt, size);
  const [posterUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
  if (!posterUrl) throw new Error(`Poster generation returned no output for beat ${index + 1}`);

  // Persist the poster to shared storage so the I2V endpoint can fetch it.
  const imageBuffer = await (await fetch(posterUrl)).arrayBuffer();
  const filename = `${jobId}-poster-${index}.jpg`;
  return uploadAsset(Buffer.from(imageBuffer), filename, "image/jpeg");
}

// === 3. Assemble the final timeline ===
export async function generateVoxVideoTimeline(
  input: VoxVideoInput,
  options: VoxPipelineOptions = {}
): Promise<VoxTimelineAsset> {
  const { assetBaseUrl, onProgress, onStage } = options;
  const base = assetBaseUrl || process.env.RENDER_SERVER_BASE_URL || "http://localhost:3001";
  const aspectRatio = input.aspectRatio || "9:16";
  const targetDurationSeconds = input.targetDurationSeconds || 30;
  const jobId = options.jobId || uuidv4();

  const client = new WavespeedClient();
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  fs.mkdirSync(tempDir, { recursive: true });

  onStage?.("planning");
  onProgress?.(0.02);

  // 1. Beat map
  let beatMap: VoxBeatMap;
  try {
    beatMap = await callBeatMapLLM(input);
  } catch (err) {
    console.warn("[Vox] Beat map LLM failed, using fallback structure:", err);
    beatMap = fallbackBeatMap(input.prompt);
  }
  const beats = beatMap.beats;
  console.log(`[Vox] Beat map ready: ${beats.length} beats, theme=${beatMap.theme}`);
  onProgress?.(0.1);

  // 2. One voice across all beats (ElevenLabs preferred, Deepgram fallback)
  const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY);
  let defaultVoice = AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  if (hasElevenLabs) defaultVoice = DEFAULT_ELEVENLABS_VOICE_ID;
  const selectedVoice = input.voice || defaultVoice;

  // 3. Per-beat voiceover (sequential, one voice)
  const sceneVoices: Array<{
    audioUrl: string;
    words: Array<{ word: string; start: number; end: number }>;
    audioEndSec: number;
    clipDurationSec: number;
  }> = [];
  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    const localAudioPath = path.join(tempDir, `${jobId}-vox-scene-${i}.mp3`);
    try {
      if (input.generateAudio !== false && beat.narration.trim()) {
        const wordTimestamps = await generateSpeechWithTimestamps(beat.narration, localAudioPath, selectedVoice);
        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        const audioEndSec = Math.max(1.5, lastWord ? lastWord.end + 0.35 : beat.narration.split(/\s+/).length / 2.5 + 0.35);
        const audioUrl = await uploadAsset(fs.readFileSync(localAudioPath), `${jobId}-vox-scene-${i}.mp3`, "audio/mpeg");
        const clipDurationSec = Math.min(10, Math.max(4, Math.ceil(audioEndSec)));
        sceneVoices.push({ audioUrl, words: wordTimestamps, audioEndSec, clipDurationSec });
        console.log(`[Vox] Beat ${i + 1} voiceover: ${audioEndSec.toFixed(1)}s (clip ${clipDurationSec}s)`);
      } else {
        sceneVoices.push({ audioUrl: "", words: [], audioEndSec: 5, clipDurationSec: 5 });
      }
    } catch (err) {
      console.warn(`[Vox] TTS failed for beat ${i + 1}: ${err}`);
      sceneVoices.push({ audioUrl: "", words: [], audioEndSec: 5, clipDurationSec: 5 });
    }
    onProgress?.(0.1 + ((i + 1) / Math.max(1, beats.length)) * 0.15);
  }

  // 4. Per-beat poster + animated clip (parallel, non-fatal per beat)
  const clipResults: Array<{ videoUrl: string } | null> = new Array(beats.length).fill(null);
  const concurrency = 2;
  let cursor = 0;
  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= beats.length) return;
      const beat = beats[i];
      const voice = sceneVoices[i];
      try {
        onStage?.("keyframes");
        const posterUrl = await generatePoster(client, beat, input.theme || beatMap.theme, aspectRatio, jobId, i);
        console.log(`[Vox] Beat ${i + 1} poster ready -> ${posterUrl}`);

        onStage?.("video_generation");
        const motionPrompt = buildVoxMotionPrompt(beat, beat.camera_move, beat.element_motion);
        const { resultUrl } = await client.triggerImageToVideo(
          motionPrompt,
          ABSOLUTIZE(posterUrl, base),
          voice.clipDurationSec,
          "720p"
        );
        const [clipUrl] = await client.pollPrediction(resultUrl, 5000, 600000);
        if (!clipUrl) throw new Error(`Clip generation returned no output for beat ${i + 1}`);
        clipResults[i] = { videoUrl: clipUrl };
        console.log(`[Vox] Beat ${i + 1} clip ready.`);
      } catch (err) {
        console.warn(`[Vox] Clip generation failed for beat ${i + 1}: ${err}`);
      }
      onProgress?.(0.25 + ((i + 1) / Math.max(1, beats.length)) * 0.6);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, beats.length) }, () => worker())
  );

  // 5. Optional background music (Lyria) — non-fatal
  let musicTrack: { audioUrl: string; volume: number } | undefined;
  if (input.music) {
    try {
      onStage?.("music");
      const musicPrompt = beatMap.music || "light upbeat editorial soundtrack, acoustic, instrumental";
      const { resultUrl } = await client.triggerMusic(musicPrompt);
      const [musicUrl] = await client.pollPrediction(resultUrl, 5000, 300000);
      if (musicUrl) {
        musicTrack = { audioUrl: musicUrl, volume: 0.15 };
        console.log(`[Vox] Background music ready.`);
      }
    } catch (err) {
      console.warn(`[Vox] Music generation failed (continuing without): ${err}`);
    }
    onProgress?.(0.95);
  }

  // 6. Assemble the timeline
  const elements: VoxTimelineAsset["elements"] = [];
  const audio: VoxTimelineAsset["audio"] = [];
  const text: VoxTimelineAsset["text"] = [];
  const words: NonNullable<VoxTimelineAsset["words"]> = [];
  let offsetMs = 0;
  let anyClip = false;

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    const clip = clipResults[i];
    const voice = sceneVoices[i];
    const startMs = offsetMs;
    const endMs = startMs + voice.clipDurationSec * 1000;

    if (clip) {
      anyClip = true;
      elements.push({ videoUrl: clip.videoUrl, startMs, endMs });
    }
    if (voice.audioUrl) {
      const audioEndMs = Math.min(endMs, startMs + Math.round(voice.audioEndSec * 1000));
      audio.push({ startMs, endMs: audioEndMs, audioUrl: voice.audioUrl });
    }
    text.push({ startMs, endMs: Math.min(endMs, startMs + 2500), text: beat.headline, position: "center" });
    for (const w of voice.words) {
      words.push({ word: w.word, startMs: startMs + Math.round(w.start * 1000), endMs: startMs + Math.round(w.end * 1000) });
    }
    offsetMs = endMs;
  }

  if (!anyClip) {
    throw new Error("Vox pipeline failed: no clips were generated for any beat.");
  }

  const { width, height } = getAspectRatioDimensions(aspectRatio);
  const timeline: VoxTimelineAsset = {
    shortTitle: (beatMap.title || input.title || input.prompt).slice(0, 60),
    elements,
    text,
    audio,
    words,
    music: musicTrack ? [musicTrack] : undefined,
    width,
    height,
  };

  // Absolutize local asset URLs so the Remotion composition (running in the
  // render server) can fetch them.
  timeline.elements = timeline.elements.map((e) => ({ ...e, videoUrl: ABSOLUTIZE(e.videoUrl, base) }));
  timeline.audio = timeline.audio.map((a) => ({ ...a, audioUrl: ABSOLUTIZE(a.audioUrl, base) }));
  if (timeline.music) {
    timeline.music = timeline.music.map((m) => ({ ...m, audioUrl: ABSOLUTIZE(m.audioUrl, base) }));
  }

  onProgress?.(1);
  console.log(`[Vox] Timeline ready: ${elements.length} clips, ${audio.length} audio tracks.`);
  return timeline;
}
