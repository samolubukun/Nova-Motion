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
  scenes: Array<{
    type: "TextGlitch" | "TextKinetic" | "TextTypewriter" | "DataBarChart";
    durationFrames: number;
    props: any;
    narration?: string; // Optional voiceover text for this specific scene
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
You have access to the following 25 scene components. DO NOT repeat the same component consecutively. Vary your selections to make the video feel active and professional.

Supported Scene Components:
1. "TextGlitch": Glitchy cyber reveal text. Props: { "text": string }
2. "TextKinetic": Fast kinetic word-by-word typography. Props: { "text": string }
3. "TextTypewriter": Monospace typing terminal simulation. Props: { "text": string }
4. "TextNeon": Glowing neon text against dark background. Props: { "text": string }
5. "TextWave": Bouncing sine-wave text. Props: { "text": string }
6. "TextGradient": Gradient colored stylish layout. Props: { "text": string }
7. "TextScramble": Scrambling matrix/hacker text. Props: { "text": string }
8. "DataBarChart": Animated comparison bar chart. Props: { "title": string, "subtitle": string, "data": Array<{ "label": string, "value": number, "color": string }> }
9. "DataPieChart": Dynamic pie/donut visualization. Props: { "title": string, "subtitle": string, "data": Array<{ "label": string, "value": number, "color": string }> }
10. "DataLineChart": Growth line chart. Props: { "title": string, "subtitle": string, "data": Array<{ "label": string, "value": number, "color": string }> }
11. "DataStatsCards": Multiple key-value stats counters grid. Props: { "title": string, "subtitle": string }
12. "DataProgressBars": Side-by-side horizontal loader bars. Props: { "title": string }
13. "DataTimeline": Animated process timeline milestone list. Props: { "title": string }
14. "DataRanking": High-to-low ranked list of items. Props: { "title": string }
15. "DataGauge": Radial/speedometer visualizer. Props: { "title": string }
16. "UIButton": Dynamic glassmorphic button click simulation. Props: {}
17. "UICard": Sliding product card details. Props: {}
18. "UIModal": Pop-up overlay card. Props: {}
19. "UIToast": Slide-in alert toast notification. Props: {}
20. "UINavigation": Topbar navigation sliding links animation. Props: {}
21. "UIDropdown": Interactive list dropdown expansion. Props: {}
22. "UIToggle": Modern switcher toggle animation. Props: {}
23. "UILoading": High-tech dashboard loader spinner. Props: {}
24. "UITabs": Switching tabs animation with layout change. Props: {}
25. "UIForm": Modern input fields autocomplete simulation. Props: {}

Guidelines:
- Choose the best components matching the prompt context. Vary your choices! Do not repeat the same component twice in a row.
- Total scenes: between 5 to 10 scenes. Make the storyboard complete and narrative-driven.
- Keep the visual tone premium (use colors like cyan "#00ffd2", magenta "#ff007f", electric blue, purple, dark gray background).
- Generate optional narration scripts for each scene if the user wants voiceover.

Give output in strict JSON format:
{
  "shortTitle": "Title",
  "voiceoverEnabled": true,
  "scenes": [
    {
      "type": "TextGlitch",
      "durationFrames": 90,
      "props": { "text": "GO BIG" },
      "narration": "Narration text for this scene."
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
    scenes: parsed.scenes || [],
    audio: [],
  };

  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let durationMs = 0;

  // Process scenes sequentially
  for (let i = 0; i < storyboard.scenes.length; i++) {
    const scene = storyboard.scenes[i];
    const sceneId = `${jobId}-mg-scene-${i}`;

    // Default duration if there is no voiceover
    let sceneDurationMs = Math.round((scene.durationFrames / 30) * 1000);

    // If voiceover is enabled and narration is present
    if (parsed.voiceoverEnabled && scene.narration) {
      const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);
      try {
        const wordTimestamps = await generateSpeechWithTimestamps(scene.narration, localAudioPath, selectedVoice);
        const audioBuffer = fs.readFileSync(localAudioPath);
        const audioUrl = await uploadAsset(audioBuffer, `${sceneId}.mp3`, "audio/mpeg");

        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        sceneDurationMs = Math.ceil((lastWord ? lastWord.end : 3) * 1000);

        // Adjust durationFrames to match voiceover duration exactly
        scene.durationFrames = Math.ceil((sceneDurationMs * 30) / 1000);

        storyboard.audio!.push({
          startMs: durationMs,
          endMs: durationMs + sceneDurationMs,
          audioUrl,
        });
      } catch (err) {
        console.warn(`[MotionGraphics Pipeline] Failed to generate TTS for scene ${i}:`, err);
      }
    }

    durationMs += sceneDurationMs;
  }

  // 4. Download and overlay background music track
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
