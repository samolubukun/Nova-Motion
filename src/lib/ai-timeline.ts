import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { generateSpeechWithTimestamps, AURA_VOICES } from "./deepgram";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initializing S3/Spaces client for asset uploading (if configured)
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
  delay = 2000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        console.warn(`[Network] Retryable status ${response.status} on ${url}. Retrying in ${delay}ms...`);
      } else {
        return response;
      }
    } catch (err) {
      console.warn(`[Network] Connection failed to ${url} (Attempt ${i + 1}/${retries}). Error: ${err}. Retrying in ${delay}ms...`);
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
async function callOpenAI(endpoint: string, payload: any): Promise<any> {
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
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error: ${res.status} - ${errText}`);
  }

  return res.json();
}

/**
 * Generate gpt-image-2 image and upload it to S3/DO Spaces.
 */
async function generateAndUploadImage(prompt: string, assetName: string): Promise<string> {
  console.log(`[gpt-image-2] Generating image for: "${prompt.substring(0, 60)}..."`);
  const response = await callOpenAI("images/generations", {
    model: "gpt-image-2",
    prompt: `vertical 9:16 format, high resolution digital art: ${prompt}`,
    size: "1024x1792",
  });

  const b64Data = response.data[0].b64_json;
  const buffer = Buffer.from(b64Data, "base64");
  return uploadAsset(buffer, `${assetName}.png`, "image/png");
}

export interface TimelineAsset {
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
}

/**
 * Main AI Video Pipeline: Prompt -> Story -> Images -> TTS -> Timeline
 */
export async function generateAIVideoTimeline(
  prompt: string,
  topic: string,
  voice?: string
): Promise<TimelineAsset> {
  const jobId = uuidv4();
  const selectedVoice = voice || AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  console.log(`[AI Pipeline] Starting generation for topic [${topic}] using voice [${selectedVoice}] with prompt [${prompt}]`);

  // 1. Generate Story
  const storyPrompt = `Write a short story with title [${prompt}] (its topic is [${topic}]).
You must follow best practices for great storytelling. 
The script must be 5-8 sentences long. 
Result result as one continuous text without formatting or title. 
Skip new lines.`;

  const storyResponse = await callOpenAI("chat/completions", {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: storyPrompt }],
    temperature: 0.7,
  });

  const storyText = storyResponse.choices[0].message.content.trim();
  console.log(`[AI Pipeline] Story Text: "${storyText}"`);

  // 2. Generate Image Descriptions matching story scenes
  const descriptionsPrompt = `You are given a story text.
Generate 4-6 very detailed image descriptions for this story. 
Return their description as a JSON array with story sentences matched to images. 
Story sentences must be in the same order as in the story and their content must be preserved.
Each image must match 1-2 sentences from the story.
Images must show story content in a way that is visually appealing and engaging.
Give output in strict JSON format:
[
  {
    "text": "....",
    "imageDescription": "..."
  }
]

<story>
${storyText}
</story>`;

  const descResponse = await callOpenAI("chat/completions", {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: descriptionsPrompt }],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const parsedDesc = JSON.parse(descResponse.choices[0].message.content);
  const scenes = Array.isArray(parsedDesc) ? parsedDesc : parsedDesc.result || parsedDesc.scenes || [];
  if (!scenes.length) {
    throw new Error("Failed to parse image descriptions from OpenAI response");
  }

  console.log(`[AI Pipeline] Generated descriptions for ${scenes.length} scenes.`);

  const timeline: TimelineAsset = {
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

  // 3. Process scenes (Images + Audio + Timestamps)
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneId = `${jobId}-scene-${i}`;

    // A. Generate and upload image
    const imageUrl = await generateAndUploadImage(scene.imageDescription, sceneId);

    // B. Generate audio local temp path, run Deepgram TTS/STT
    const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);
    const wordTimestamps = await generateSpeechWithTimestamps(scene.text, localAudioPath, selectedVoice);

    // C. Upload audio to storage
    const audioBuffer = fs.readFileSync(localAudioPath);
    const audioUrl = await uploadAsset(audioBuffer, `${sceneId}.mp3`, "audio/mpeg");

    const lastWord = wordTimestamps[wordTimestamps.length - 1];
    const sceneDurationMs = Math.ceil((lastWord ? lastWord.end : 5) * 1000);

    // D. Add element to timeline
    const scaleFrom = i % 2 === 0 ? 1.3 : 1.0;
    const scaleTo = i % 2 === 0 ? 1.0 : 1.3;

    timeline.elements.push({
      imageUrl,
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

    // E. Synthesize sentences for text subtitle overlays
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

  return timeline;
}
