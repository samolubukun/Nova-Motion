import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { generateSpeechWithTimestamps, AURA_VOICES } from "./deepgram";
import { findStockVideo } from "./pexels";
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
 * Call OpenAI API using simple fetch.
 */
async function callOpenAI(endpoint: string, payload: any): Promise<any> {
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

  return res.json();
}

export interface StockTimelineAsset {
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
}

/**
 * Stock Video Short Pipeline: Prompt -> Story -> Keywords -> Pexels Videos -> Deepgram TTS -> Timeline
 */
export async function generateStockVideoTimeline(
  prompt: string,
  topic: string,
  voice?: string,
  aspectRatio = "9:16"
): Promise<StockTimelineAsset> {
  const jobId = uuidv4();
  const selectedVoice = voice || AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  console.log(`[Stock Pipeline] Starting generation for topic [${topic}] using voice [${selectedVoice}] with prompt [${prompt}]`);

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
  console.log(`[Stock Pipeline] Story Text: "${storyText}"`);

  // 2. Generate Search Terms matching story scenes
  const keywordPrompt = `You are given a story text.
Generate 3-5 scenes for this story.
For each scene, extract the narration text and 2-3 specific Pexels search keywords that match the scene context (e.g. ["programming", "workspace"]).
Give output in strict JSON format:
[
  {
    "text": "....",
    "searchTerms": ["...", "..."]
  }
]

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
  const scenes = Array.isArray(parsedKw) ? parsedKw : parsedKw.result || parsedKw.scenes || [];
  if (!scenes.length) {
    throw new Error("Failed to parse search keywords from OpenAI response");
  }

  console.log(`[Stock Pipeline] Generated search keywords for ${scenes.length} scenes.`);

  const timeline: StockTimelineAsset = {
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

  const excludeVideoIds: string[] = [];

  // 3. Process scenes (Pexels Stock Video + Deepgram TTS/STT)
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneId = `${jobId}-stock-scene-${i}`;

    // A. Generate voice narration and timestamps
    const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);
    const wordTimestamps = await generateSpeechWithTimestamps(scene.text, localAudioPath, selectedVoice);

    // B. Upload audio to storage
    const audioBuffer = fs.readFileSync(localAudioPath);
    const audioUrl = await uploadAsset(audioBuffer, `${sceneId}.mp3`, "audio/mpeg");

    const lastWord = wordTimestamps[wordTimestamps.length - 1];
    const sceneDurationMs = Math.ceil((lastWord ? lastWord.end : 6) * 1000);
    const sceneDurationSec = sceneDurationMs / 1000;

    // C. Search matching Stock Video from Pexels
    const stockAsset = await findStockVideo(
      scene.searchTerms || ["abstract"],
      sceneDurationSec,
      excludeVideoIds,
      aspectRatio
    );
    excludeVideoIds.push(stockAsset.id);

    // D. Add element to timeline
    timeline.elements.push({
      videoUrl: stockAsset.url,
      startMs: durationMs,
      endMs: durationMs + sceneDurationMs,
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

  // 4. Optionally overlay background music if desired
  // Randomized selection from multiple public demo tracks
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

  // Download selected music track locally to bypass CORS on the browser
  const musicFilename = `music-${Math.floor(Math.random() * 1000000)}.mp3`;
  const musicLocalPath = path.join(tempDir, musicFilename);
  try {
    console.log(`[Stock Pipeline] Downloading background track: ${selectedTrack}`);
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
    console.warn(`[Stock Pipeline] Failed to download music track locally, falling back to URL:`, err);
    timeline.music = [
      {
        audioUrl: selectedTrack,
        volume: 0.08,
      },
    ];
  }

  return timeline;
}
