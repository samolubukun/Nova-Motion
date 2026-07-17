import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { generateSpeechWithTimestamps, AURA_VOICES } from "./deepgram";

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

let s3Client: any = null;
if (SPACES_ENABLED || R2_ENABLED) {
  const { S3Client } = require("@aws-sdk/client-s3");
  if (SPACES_ENABLED) {
    s3Client = new S3Client({
      endpoint: process.env.SPACES_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SPACES_KEY!,
        secretAccessKey: process.env.SPACES_SECRET!,
      },
    });
  } else {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
}

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
    const { PutObjectCommand } = require("@aws-sdk/client-s3");
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
      return SPACES_ENABLED 
        ? `${process.env.SPACES_PUBLIC_URL}/assets/${filename}`
        : `/assets-temp/${filename}`;
    } catch (s3Err) {
      console.warn("[S3/Spaces Upload] Failed uploading to cloud, relying on local copy:", s3Err);
    }
  }

  return `/assets-temp/${filename}`;
}

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

export interface MotionGraphicsStoryboard {
  shortTitle: string;
  slides: Array<{
    durationFrames: number;
    narration?: string;
    background?: any;
    elements?: any[];
  }>;
  audio?: Array<{
    startMs: number;
    endMs: number;
    audioUrl: string;
  }>;
  music?: Array<{
    audioUrl: string;
    volume: number;
  }>;
  width?: number;
  height?: number;
}

export async function generateMotionGraphicsTimeline(
  prompt: string,
  topic: string,
  voice?: string,
  aspectRatio = "9:16"
): Promise<MotionGraphicsStoryboard> {
  const jobId = uuidv4();
  const selectedVoice = voice || AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  console.log(`[MotionGraphics Pipeline] Starting generation for topic [${topic}]`);

  const systemPrompt = `You are an expert motion graphics director.
Generate a dynamic, premium, highly engaging storyboard in JSON format based on the user's prompt.
You must construct a timeline using a simple, universal array of "slides".

For each slide, you define the background and an array of elements (text, charts, lists, stats, etc.).
The rendering engine will automatically animate these elements based on the types and properties you provide.

AVAILABLE BACKGROUND TYPES:
- "solid": solid color (uses 'from' color)
- "gradient": linear gradient (uses 'from', 'to', 'angle')
- "grid": subtle tech grid
- "mesh": smooth organic mesh gradient
- "radial": glowing radial gradient
- "noise": grainy texture overlay

AVAILABLE ELEMENT TYPES & SCHEMA:
All elements support: { "type": "...", "delay": 0 (frames relative to slide start) }

1. "title": Main headline
   - text: string
   - animation: "fadeIn" | "slideUp" | "slideLeft" | "glitch" | "typewriter" | "scale"
   - color: string (hex)

2. "subtitle" / "body": Supporting text
   - text: string
   - color: string (hex)

3. "badge" / "label": Small accented label
   - text: string
   - color: string (hex)

4. "list": Bulleted list
   - items: string[]
   - color: string (hex) (bullet color)

5. "barChart" / "pieChart": Data visualization
   - title: string
   - data: [ { "label": "A", "value": 85, "color": "#ff0000" } ]

6. "stat" / "counter": Big numbers
   - stat uses "value", counter animates up to "targetNumber"
   - label: string
   - prefix / suffix: string (e.g., "$", "%")

7. "divider": Animated line separator
   - color: string (hex)

Guidelines:
- Keep the visual tone premium. Use harmonious colors (e.g., dark backgrounds like #0a0a0a or #1a1a2e, with vibrant accents like #6366f1, #00ffd2, #ff007f).
- Total slides: between 5 to 15 slides. Make the storyboard complete and narrative-driven.
- Generate optional narration scripts for each slide if the user wants voiceover.
- Keep durationFrames between 60 to 150 per slide depending on content length.

Give output in strict JSON format:
{
  "shortTitle": "Title",
  "voiceoverEnabled": true,
  "slides": [
    {
      "durationFrames": 120,
      "narration": "AI is changing the world.",
      "background": { "type": "mesh", "from": "#0a0a0a", "to": "#1a1a2e" },
      "elements": [
        { "type": "badge", "text": "INTRODUCTION", "color": "#00ffd2", "delay": 0 },
        { "type": "title", "text": "AI Revolution", "animation": "slideUp", "color": "#ffffff", "delay": 15 },
        { "type": "subtitle", "text": "Changing the world", "color": "#a1a1aa", "delay": 30 }
      ]
    }
  ]
}`;

  const response = await callOpenAI("chat/completions", {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  const storyboard: MotionGraphicsStoryboard = {
    shortTitle: parsed.shortTitle || topic.substring(0, 30),
    slides: parsed.slides || [],
    audio: [],
  };

  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let durationMs = 0;

  // Process slides sequentially
  for (let i = 0; i < storyboard.slides.length; i++) {
    const slide = storyboard.slides[i];
    const slideId = `${jobId}-mg-slide-${i}`;

    // Calculate minimum frames needed for all elements to finish animating
    let maxDelayFrames = 0;
    if (slide.elements) {
      for (const el of slide.elements) {
        if (el.delay && el.delay > maxDelayFrames) {
          maxDelayFrames = el.delay;
        }
      }
    }
    // Give at least 60 frames (2 seconds) after the last element starts animating
    const minVisualFrames = maxDelayFrames + 60;

    // Default duration if there is no voiceover
    let slideDurationMs = Math.round((slide.durationFrames / 30) * 1000);

    // If voiceover is enabled and narration is present
    if (parsed.voiceoverEnabled && slide.narration) {
      const localAudioPath = path.join(tempDir, `${slideId}.mp3`);
      try {
        const wordTimestamps = await generateSpeechWithTimestamps(slide.narration, localAudioPath, selectedVoice);
        const audioBuffer = fs.readFileSync(localAudioPath);
        const audioUrl = await uploadAsset(audioBuffer, `${slideId}.mp3`, "audio/mpeg");

        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        // Base voiceover length + 800ms padding
        const voiceoverDurationMs = Math.ceil((lastWord ? lastWord.end : 3) * 1000) + 800;
        
        // Final frame count is whichever is longer: the voiceover, or the minimum visual time
        slide.durationFrames = Math.max(Math.ceil((voiceoverDurationMs * 30) / 1000), minVisualFrames);
        slideDurationMs = Math.ceil((slide.durationFrames / 30) * 1000);

        storyboard.audio!.push({
          startMs: durationMs,
          endMs: durationMs + Math.ceil((lastWord ? lastWord.end : 3) * 1000), // Original voice length
          audioUrl,
        });
      } catch (err) {
        console.warn(`[MotionGraphics Pipeline] Failed to generate TTS for slide ${i}:`, err);
        slide.durationFrames = Math.max(slide.durationFrames, minVisualFrames);
        slideDurationMs = Math.ceil((slide.durationFrames / 30) * 1000);
      }
    } else {
      slide.durationFrames = Math.max(slide.durationFrames, minVisualFrames);
      slideDurationMs = Math.ceil((slide.durationFrames / 30) * 1000);
    }

    durationMs += slideDurationMs;
  }

  // 4. Download and overlay background music track
  const backgroundTracks = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  ];
  const selectedTrack = backgroundTracks[Math.floor(Math.random() * backgroundTracks.length)];

  // Download selected music track locally
  const musicFilename = `music-${Math.floor(Math.random() * 1000000)}.mp3`;
  const musicLocalPath = path.join(tempDir, musicFilename);
  try {
    console.log(`[MotionGraphics Pipeline] Downloading background track: ${selectedTrack}`);
    const musicRes = await fetch(selectedTrack, { signal: AbortSignal.timeout(10000) });
    const musicBuffer = Buffer.from(await musicRes.arrayBuffer());
    fs.writeFileSync(musicLocalPath, musicBuffer);
    
    storyboard.music = [
      {
        audioUrl: `/assets-temp/${musicFilename}`,
        volume: 0.08,
      },
    ];
  } catch (err) {
    console.warn(`[MotionGraphics Pipeline] Failed to download music track locally:`, err);
    storyboard.music = [
      {
        audioUrl: selectedTrack,
        volume: 0.08,
      },
    ];
  }

  return storyboard;
}
