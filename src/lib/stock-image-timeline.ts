import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { generateSpeechWithTimestamps, AURA_VOICES } from "./deepgram";
import { findStockImage } from "./pixabay";
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

/**
 * Robust fetch wrapper with exponential backoff retries.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 2000,
  timeoutMs = 25000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) return response;
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        console.warn(`[Network] Retryable status ${response.status} on ${url}. Retrying in ${delay}ms...`);
      } else {
        return response;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn(`[Network] Connection failed to ${url} (Attempt ${i + 1}/${retries}). Error: ${err.message || err}. Retrying in ${delay}ms...`);
      if (i === retries - 1) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

/**
 * Call OpenAI API using simple fetch.
 */
async function callOpenAI(endpoint: string, payload: any, retries = 3, timeoutMs = 25000): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const res = await fetchWithRetry(`https://api.openai.com/v1/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }, retries, 2000, timeoutMs);

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error: ${res.status} - ${errText}`);
  }

  return res.json();
}

export interface StockImageTimelineAsset {
  shortTitle: string;
  elements: Array<{
    imageUrl: string;
    startMs: number;
    endMs: number;
    enterTransition: string;
    exitTransition: string;
    animations: Array<any>;
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
}

/**
 * Stock Image Short Pipeline: Prompt -> Story -> Keywords -> Pixabay Images -> Deepgram TTS -> Timeline
 */
export async function generateStockImageTimeline(
  prompt: string,
  topic: string,
  voice?: string,
  aspectRatio = "9:16"
): Promise<StockImageTimelineAsset> {
  const jobId = uuidv4();
  const selectedVoice = voice || AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  console.log(`[Stock Image Pipeline] Starting generation for topic [${topic}] using voice [${selectedVoice}] with prompt [${prompt}]`);

  // 1. Generate Story
  const storyPrompt = `Write a short story with title [${prompt}] (its topic is [${topic}]).
You must follow best practices for great storytelling. 
The script must be 4-6 sentences long. 
Result result as one continuous text without formatting or title. 
Skip new lines.`;

  const storyResponse = await callOpenAI("chat/completions", {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: storyPrompt }],
    temperature: 0.7,
  });

  const storyText = storyResponse.choices[0].message.content.trim();
  console.log(`[Stock Image Pipeline] Story Text: "${storyText}"`);

  // 2. Generate Search Terms matching story scenes
  const keywordPrompt = `You are given a story text.
Generate 4-6 scenes for this story.
For each scene, extract the narration text and 2-3 specific search keywords that match the scene context (e.g. ["programming", "workspace"]).
Give output in strict JSON format under a "scenes" key:
{
  "scenes": [
    {
      "text": "....",
      "searchTerms": ["...", "..."]
    }
  ]
}

<story>
${storyText}
</story>`;

  const kwResponse = await callOpenAI("chat/completions", {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: keywordPrompt }],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const parsedKw = JSON.parse(kwResponse.choices[0].message.content);
  const scenes = Array.isArray(parsedKw) ? parsedKw : parsedKw.scenes || parsedKw.result || [];
  if (!scenes.length) {
    throw new Error("Failed to parse search keywords from OpenAI response");
  }

  console.log(`[Stock Image Pipeline] Generated search keywords for ${scenes.length} scenes.`);

  const timeline: StockImageTimelineAsset = {
    shortTitle: prompt.substring(0, 30),
    elements: [],
    text: [],
    audio: [],
  };

  let durationMs = 0;
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const excludeImageUrls: string[] = [];

  // 3. Process scenes (Pixabay Stock Image + Deepgram TTS/STT)
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneId = `${jobId}-stock-image-scene-${i}`;

    // A. Generate voice narration and timestamps
    const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);
    const wordTimestamps = await generateSpeechWithTimestamps(scene.text, localAudioPath, selectedVoice);

    // B. Upload audio to storage
    const audioBuffer = fs.readFileSync(localAudioPath);
    const audioUrl = await uploadAsset(audioBuffer, `${sceneId}.mp3`, "audio/mpeg");

    const lastWord = wordTimestamps[wordTimestamps.length - 1];
    const sceneDurationMs = Math.ceil((lastWord ? lastWord.end : 6) * 1000);

    // C. Search matching Stock Image from Pixabay
    const stockAsset = await findStockImage(
      scene.searchTerms || ["abstract"],
      excludeImageUrls,
      aspectRatio
    );
    excludeImageUrls.push(stockAsset.url);

    // D. Add element to timeline with Ken Burns style zoom animation
    const scaleFrom = i % 2 === 0 ? 1.3 : 1.0;
    const scaleTo = i % 2 === 0 ? 1.0 : 1.3;

    timeline.elements.push({
      imageUrl: stockAsset.url,
      startMs: durationMs,
      endMs: durationMs + sceneDurationMs,
      enterTransition: "blur",
      exitTransition: "blur",
      animations: [
        {
          type: "scale",
          from: scaleFrom,
          to: scaleTo,
          startMs: 0,
          endMs: sceneDurationMs,
        },
      ],
    });

    timeline.audio.push({
      startMs: durationMs,
      endMs: durationMs + sceneDurationMs,
      audioUrl,
    });

    // E. Synthesize captions
    const maxChars = 18;
    let currentText = "";
    let currentStartMs = wordTimestamps[0] ? wordTimestamps[0].start * 1000 + durationMs : durationMs;
    let currentEndMs = durationMs;

    for (let wIdx = 0; wIdx < wordTimestamps.length; wIdx++) {
      const w = wordTimestamps[wIdx];
      if ((currentText + w.word).length > maxChars && currentText.trim()) {
        timeline.text.push({
          startMs: currentStartMs,
          endMs: currentEndMs,
          text: currentText.trim(),
          position: "center",
        });
        currentText = "";
        currentStartMs = w.start * 1000 + durationMs;
      }
      currentText += `${w.word} `;
      currentEndMs = w.end * 1000 + durationMs;
    }

    if (currentText.trim()) {
      timeline.text.push({
        startMs: currentStartMs,
        endMs: currentEndMs,
        text: currentText.trim(),
        position: "center",
      });
    }

    durationMs += sceneDurationMs;
  }

  // 4. Overlay background music
  const backgroundTracks = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  ];
  const selectedTrack = backgroundTracks[Math.floor(Math.random() * backgroundTracks.length)];

  // Download selected music track locally
  const musicFilename = `music-${Math.floor(Math.random() * 1000000)}.mp3`;
  const musicLocalPath = path.join(tempDir, musicFilename);
  try {
    console.log(`[Stock Image Pipeline] Downloading background track: ${selectedTrack}`);
    const musicRes = await fetch(selectedTrack, { signal: AbortSignal.timeout(10000) });
    const musicBuffer = Buffer.from(await musicRes.arrayBuffer());
    fs.writeFileSync(musicLocalPath, musicBuffer);
    
    timeline.music = [
      {
        audioUrl: `/assets-temp/${musicFilename}`,
        volume: 0.08,
      },
    ];
  } catch (err) {
    console.warn(`[Stock Image Pipeline] Failed to download music track locally:`, err);
    timeline.music = [
      {
        audioUrl: selectedTrack,
        volume: 0.08,
      },
    ];
  }

  return timeline;
}
