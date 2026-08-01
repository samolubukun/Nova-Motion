import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { generateSpeechWithTimestamps, AURA_VOICES } from "./deepgram";
import { DEFAULT_ELEVENLABS_VOICE_ID } from "./elevenlabs";
import { findStockVideo } from "./pexels";
import { WavespeedClient } from "./wavespeed";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

let s3Client: S3Client | null = null;
if (SPACES_ENABLED) {
  s3Client = new S3Client({
    endpoint: process.env.SPACES_ENDPOINT,
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.SPACES_KEY!,
      secretAccessKey: process.env.SPACES_SECRET!,
    },
  });
} else if (R2_ENABLED) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Upload an asset buffer to cloud storage and return its public URL.
 */
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
    } catch (s3Err) {
      console.warn("[S3/Spaces Upload] Failed uploading to cloud, relying on local copy:", s3Err);
    }
  }

  return `/assets-temp/${filename}`;
}

interface OpenAICompletion {
  choices: Array<{ message: { content: string } }>;
}

/**
 * Call OpenAI chat completions using simple fetch.
 */
async function callOpenAI(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<OpenAICompletion> {
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

  return res.json() as Promise<OpenAICompletion>;
}

export interface WavespeedTimelineAsset {
  shortTitle: string;
  elements: Array<{
    videoUrl: string;
    startMs: number;
    endMs: number;
  }>;
  text: Array<{
    startMs: number;
    endMs: number;
    text: string;
    position: string;
  }>;
  audio: Array<{
    startMs: number;
    endMs: number;
    audioUrl: string;
  }>;
  music?: Array<{
    audioUrl: string;
    volume: number;
  }>;
  words?: Array<{
    word: string;
    startMs: number;
    endMs: number;
  }>;
}

export interface TimedSearchSegment {
  startMs: number;
  endMs: number;
  /** Short visual keywords for stock-footage search fallback (Pexels). */
  keywords: string[];
  /** Detailed, visually concrete prompt for AI clip generation (WaveSpeed). */
  prompt: string;
}

export interface WavespeedPipelineOptions {
  /** Progress callback, 0-1 across the whole pipeline. */
  onProgress?: (progress: number) => void;
  /** Base URL used to absolutize relative asset paths (e.g. the gateway origin). */
  assetBaseUrl?: string;
  /** Length of each generated AI clip in seconds (3-10). Segments are sized to match. Defaults to WAVESPEED_VIDEO_DURATION or 5. */
  clipDurationSec?: number;
}

const absolutize = (url: string, baseUrl: string): string =>
  url.startsWith("/") ? `${baseUrl}${url}` : url;

/**
 * Generate a short engaging facts-style script for a topic (mirrors the
 * Text-To-Video-AI `script_generator` prompt).
 */
async function generateScript(prompt: string, topic: string): Promise<string> {
  const systemPrompt = `You are a seasoned content writer for a YouTube Shorts channel, specializing in facts videos.
Your facts shorts are concise, each lasting less than 50 seconds (approximately 140 words).
They are incredibly engaging and original.
Keep the script brief, highly interesting, and unique.
The script must be a single continuous paragraph of plain text without formatting, titles, or bullet points.
Use exactly 4-7 sentences.`;

  const response = await callOpenAI("chat/completions", {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Topic: ${prompt} (context: ${topic}). Write the script.` },
    ],
    temperature: 0.7,
  });

  const script = (response.choices[0].message.content as string).trim();
  console.log(`[Wavespeed Pipeline] Generated script: "${script}"`);
  return script;
}

/**
 * Deterministically chunk the narration into ~clipDurationSec segments using
 * the TTS word timestamps. Never fails — timing always covers the narration.
 */
function chunkNarrationByDuration(
  wordTimestamps: Array<{ word: string; start: number; end: number }>,
  clipDurationSec: number
): Array<{ startMs: number; endMs: number; text: string }> {
  const chunks: Array<{ startMs: number; endMs: number; text: string }> = [];
  let segStartSec = 0;
  let lastEndSec = 0;
  let words: string[] = [];

  const push = () => {
    chunks.push({
      startMs: Math.round(segStartSec * 1000),
      endMs: Math.round(Math.max(lastEndSec, segStartSec + 1) * 1000),
      text: words.join(" "),
    });
  };

  for (const w of wordTimestamps) {
    words.push(w.word);
    lastEndSec = w.end;
    if (lastEndSec - segStartSec >= clipDurationSec) {
      push();
      segStartSec = lastEndSec;
      words = [];
    }
  }
  if (words.length > 0 && lastEndSec > segStartSec) {
    push();
  }

  return chunks;
}

/** Build a relevant-but-simple visual prompt without the LLM. */
function fallbackClipPrompt(topic: string, text: string): string {
  const clean = text.replace(/[^\w\s]/g, "").trim();
  return `Cinematic b-roll related to ${topic}: ${clean}`;
}

/** Short stock-search keywords without the LLM. */
function fallbackKeywords(text: string): string[] {
  const words = text.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return [words.slice(0, 4).join(" ") || "nature"];
}

const CLIP_PROMPT_SPEC = `You are a video director writing detailed visual prompts for AI text-to-video clips. Each clip is a B-roll shot shown during one segment of a narrated script.

For every segment below (index, time range, spoken text) provide:
- "prompt": a single detailed English prompt for an AI video generator. It must be visually concrete and RELEVANT to what the narrator is saying at that moment. Describe the subject, environment, camera movement, lighting and mood. 30-80 words. Never mention that it is B-roll or stock footage, never show people speaking, never include readable text.
- "search_terms": 2-3 short visual keywords (2-4 words each) for searching stock footage.

Return only JSON: {"clips":[{"index":0,"prompt":"...","search_terms":["...","..."]}]}`;

/**
 * Generate a detailed, topic-relevant visual prompt (plus stock-search keywords)
 * for each narration segment. Uses a single batched LLM call so it is fast and
 * cheap; falls back to a topic-templated prompt if the LLM is unavailable.
 */
async function generateClipPrompts(
  chunks: Array<{ startMs: number; endMs: number; text: string }>,
  script: string,
  topic: string
): Promise<Map<number, { prompt: string; keywords: string[] }>> {
  const spec = chunks
    .map(
      (c, i) =>
        `[${i}] (${(c.startMs / 1000).toFixed(1)}s-${(c.endMs / 1000).toFixed(1)}s): "${c.text}"`
    )
    .join("\n");

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await callOpenAI("chat/completions", {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: CLIP_PROMPT_SPEC,
          },
          {
            role: "user",
            content: `Overall topic: ${topic}\n\nFull script: ${script}\n\nSegments:\n${spec}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      const raw: unknown = JSON.parse(response.choices[0].message.content);
      const clips =
        raw && typeof raw === "object"
          ? ((raw as Record<string, unknown>).clips as unknown[] | undefined)
          : undefined;

      if (Array.isArray(clips) && clips.length > 0) {
        const map = new Map<number, { prompt: string; keywords: string[] }>();
        for (const clip of clips) {
          if (!clip || typeof clip !== "object") continue;
          const c = clip as Record<string, unknown>;
          const index = Number(c.index);
          const prompt = typeof c.prompt === "string" ? c.prompt.trim() : "";
          const keywords = Array.isArray(c.search_terms)
            ? c.search_terms.map(String)
            : [];
          if (Number.isFinite(index) && prompt) {
            map.set(index, { prompt, keywords });
          }
        }
        if (map.size >= Math.ceil(chunks.length * 0.6)) {
          return map;
        }
      }
      console.warn("[Wavespeed Pipeline] LLM clip prompts incomplete. Retrying.");
    } catch (err) {
      console.warn(`[Wavespeed Pipeline] LLM clip prompt generation failed (attempt ${attempt + 1}):`, err);
    }
  }

  return new Map();
}

/**
 * Build timed B-roll segments for the narration.
 * Timing comes from the TTS word timestamps (deterministic), and each segment
 * gets a detailed, topic-relevant AI prompt via a batched LLM call (with a
 * topic-templated fallback). Segments match the clip duration so every clip
 * plays in full without running out of footage.
 */
async function generateTimedSearchSegments(
  script: string,
  wordTimestamps: Array<{ word: string; start: number; end: number }>,
  clipDurationSec = 5,
  topic = "the video topic"
): Promise<TimedSearchSegment[]> {
  const end = wordTimestamps.length
    ? wordTimestamps[wordTimestamps.length - 1].end
    : 30;

  const chunks = chunkNarrationByDuration(wordTimestamps, clipDurationSec);
  console.log(`[Wavespeed Pipeline] Chunked narration into ${chunks.length} segments (${clipDurationSec}s each).`);

  if (chunks.length === 0) {
    chunks.push({ startMs: 0, endMs: Math.round(end * 1000), text: script });
  }

  const promptMap = await generateClipPrompts(chunks, script, topic);

  return chunks.map((c, index) => {
    const generated = promptMap.get(index);
    return {
      startMs: c.startMs,
      endMs: c.endMs,
      keywords:
        generated && generated.keywords.length > 0
          ? generated.keywords
          : fallbackKeywords(c.text),
      prompt: generated ? generated.prompt : fallbackClipPrompt(topic, c.text),
    };
  });
}

/**
 * Group word timestamps into <=18-char caption chunks for the caption overlay.
 */
function buildCaptionChunks(
  wordTimestamps: Array<{ word: string; start: number; end: number }>,
  maxChars = 18
): Array<{ startMs: number; endMs: number; text: string; position: string }> {
  const chunks: Array<{ startMs: number; endMs: number; text: string; position: string }> = [];
  let currentText = "";
  let currentStartMs = wordTimestamps[0] ? wordTimestamps[0].start * 1000 : 0;
  let currentEndMs = currentStartMs;

  for (const w of wordTimestamps) {
    if ((currentText + w.word).length > maxChars && currentText.trim()) {
      chunks.push({
        startMs: currentStartMs,
        endMs: currentEndMs,
        text: currentText.trim(),
        position: "center",
      });
      currentText = "";
      currentStartMs = w.start * 1000;
    }
    currentText += `${w.word} `;
    currentEndMs = w.end * 1000;
  }

  if (currentText.trim()) {
    chunks.push({
      startMs: currentStartMs,
      endMs: currentEndMs,
      text: currentText.trim(),
      position: "center",
    });
  }

  return chunks;
}

/**
 * Run an async fn over items with limited concurrency.
 */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;

  const worker = async () => {
    while (idx < items.length) {
      const current = idx++;
      results[current] = await fn(items[current]);
    }
  };

  await Promise.all(new Array(Math.min(limit, items.length)).fill(0).map(worker));
  return results;
}

/**
 * Generate background music via WaveSpeed Lyria. Downloads the result locally
 * to bypass CORS. Falls back to a SoundHelix track if Lyria is unavailable.
 */
async function generateBackgroundMusic(
  topic: string,
  tempDir: string,
  client: WavespeedClient
): Promise<Array<{ audioUrl: string; volume: number }>> {
  try {
    const { resultUrl } = await client.triggerMusic(
      `instrumental cinematic background music inspired by ${topic}`
    );
    const outputs = await client.pollPrediction(resultUrl);
    const musicUrl = outputs[0];
    console.log(`[Wavespeed Pipeline] Lyria music ready: ${musicUrl}`);

    const musicFilename = `music-wavespeed-${Math.floor(Math.random() * 1000000)}.mp3`;
    const musicLocalPath = path.join(tempDir, musicFilename);
    const res = await fetch(musicUrl, { signal: AbortSignal.timeout(20000) });
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(musicLocalPath, buffer);
    return [{ audioUrl: `/assets-temp/${musicFilename}`, volume: 0.12 }];
  } catch (err) {
    console.warn(`[Wavespeed Pipeline] Lyria music generation failed: ${err}. Falling back to SoundHelix.`);
    const backgroundTracks = [
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    ];
    const selectedTrack = backgroundTracks[Math.floor(Math.random() * backgroundTracks.length)];

    try {
      const musicRes = await fetch(selectedTrack, { signal: AbortSignal.timeout(10000) });
      const musicBuffer = Buffer.from(await musicRes.arrayBuffer());
      const musicFilename = `music-fallback-${Math.floor(Math.random() * 1000000)}.mp3`;
      fs.writeFileSync(path.join(tempDir, musicFilename), musicBuffer);
      return [{ audioUrl: `/assets-temp/${musicFilename}`, volume: 0.08 }];
    } catch (downloadErr) {
      console.warn("[Wavespeed Pipeline] Failed to download fallback music track locally:", downloadErr);
      return [{ audioUrl: selectedTrack, volume: 0.08 }];
    }
  }
}

/**
 * TextToVideo Pipeline: Prompt -> Script -> TTS (word timestamps) -> Timed
 * B-roll segments -> WaveSpeed Seedance AI clips (Pexels fallback) ->
 * WaveSpeed Lyria music (SoundHelix fallback) -> Timeline.
 *
 * Replicates the Text-To-Video-AI pipeline using the WaveSpeed API key and
 * model configured in this project.
 */
export async function generateWavespeedVideoTimeline(
  prompt: string,
  topic: string,
  voice?: string,
  aspectRatio = "9:16",
  options: WavespeedPipelineOptions = {}
): Promise<WavespeedTimelineAsset> {
  const jobId = uuidv4();
  const { onProgress, assetBaseUrl, clipDurationSec: clipDurationSecOption } = options;
  const clipDurationSec = Math.min(
    10,
    Math.max(3, clipDurationSecOption || Number(process.env.WAVESPEED_VIDEO_DURATION) || 5)
  );
  const client = new WavespeedClient();

  const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY);
  let defaultVoice = AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  if (hasElevenLabs) {
    defaultVoice = DEFAULT_ELEVENLABS_VOICE_ID;
  }
  const selectedVoice = voice || defaultVoice;
  console.log(
    `[Wavespeed Pipeline] Starting TextToVideo for topic [${topic}] using voice [${selectedVoice}] with prompt [${prompt}]`
  );

  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // 1. Generate script
  const script = await generateScript(prompt, topic);
  onProgress?.(0.15);

  // 2. TTS with native word timestamps
  const narrationId = `${jobId}-narration`;
  const localAudioPath = path.join(tempDir, `${narrationId}.mp3`);
  const wordTimestamps = await generateSpeechWithTimestamps(script, localAudioPath, selectedVoice);
  const audioUrl = await uploadAsset(fs.readFileSync(localAudioPath), `${narrationId}.mp3`, "audio/mpeg");
  console.log(`[Wavespeed Pipeline] Voiceover generated (${wordTimestamps.length} word timestamps).`);
  onProgress?.(0.3);

  const lastWord = wordTimestamps[wordTimestamps.length - 1];
  const totalDurationMs = Math.max(1000, Math.ceil((lastWord ? lastWord.end : 6) * 1000) + 500);

  // 3. Timed B-roll segments with visual prompts (sized to clip duration)
  const segments = await generateTimedSearchSegments(script, wordTimestamps, clipDurationSec, topic);
  console.log(`[Wavespeed Pipeline] Generated ${segments.length} timed B-roll segments (${clipDurationSec}s each).`);
  onProgress?.(0.35);

  // 4. Generate AI B-roll clips (WaveSpeed Seedance, Pexels fallback) in parallel
  const excludeVideoIds: string[] = [];
  const clipResults = await mapWithConcurrency(segments, 3, async (segment) => {
    const { startMs, endMs, keywords, prompt: clipPrompt } = segment;
    const stockDurationSec = Math.max(2, (endMs - startMs) / 1000);

    try {
      console.log(`[Wavespeed Pipeline] Generating clip for [${startMs}-${endMs}ms] with prompt '${clipPrompt}'`);
      const { resultUrl } = await client.triggerVideo(clipPrompt, aspectRatio, clipDurationSec);
      const outputs = await client.pollPrediction(resultUrl);
      const videoUrl = outputs[0];
      console.log(`[Wavespeed Pipeline] Clip ready for [${startMs}-${endMs}ms]: ${videoUrl}`);
      return { startMs, endMs, videoUrl };
    } catch (err) {
      console.warn(`[Wavespeed Pipeline] Clip generation failed for [${startMs}-${endMs}ms]: ${err}. Falling back to Pexels.`);
      try {
        const stockAsset = await findStockVideo(keywords, stockDurationSec, excludeVideoIds, aspectRatio);
        excludeVideoIds.push(stockAsset.id);
        return { startMs, endMs, videoUrl: stockAsset.url };
      } catch (stockErr) {
        console.warn(`[Wavespeed Pipeline] Pexels fallback also failed for [${startMs}-${endMs}ms]: ${stockErr}`);
        return null;
      }
    }
  }).then((results) => {
    // Report per-clip progress (0.35 -> 0.85)
    onProgress?.(0.35 + (results.filter((r) => r !== null).length / Math.max(1, segments.length)) * 0.5);
    return results;
  });

  const elements = clipResults.filter((r): r is { startMs: number; endMs: number; videoUrl: string } => r !== null);
  if (elements.length === 0) {
    throw new Error("No B-roll clips could be generated for the TextToVideo timeline.");
  }

  // 5. Caption chunks from word timestamps
  const text = buildCaptionChunks(wordTimestamps);

  // 6. Background music (WaveSpeed Lyria, SoundHelix fallback)
  const music = await generateBackgroundMusic(topic, tempDir, client);
  onProgress?.(1);

  const timeline: WavespeedTimelineAsset = {
    shortTitle: prompt.substring(0, 30),
    elements,
    text,
    audio: [{ startMs: 0, endMs: totalDurationMs, audioUrl }],
    music,
    // Normalize TTS timestamps ({word,start,end} in seconds) to the caption
    // component's expected shape ({word,startMs,endMs} in ms).
    words: wordTimestamps.map((w) => ({
      word: w.word,
      startMs: Math.round(w.start * 1000),
      endMs: Math.round(w.end * 1000),
    })),
  };

  if (assetBaseUrl) {
    timeline.audio = timeline.audio.map((a) => ({
      ...a,
      audioUrl: absolutize(a.audioUrl, assetBaseUrl),
    }));
    if (timeline.music) {
      timeline.music = timeline.music.map((m) => ({
        ...m,
        audioUrl: absolutize(m.audioUrl, assetBaseUrl),
      }));
    }
    timeline.elements = timeline.elements.map((el) => ({
      ...el,
      videoUrl: absolutize(el.videoUrl, assetBaseUrl),
    }));
  }

  return timeline;
}
