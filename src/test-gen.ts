import * as dotenv from "dotenv";
import * as path from "path";
import { generateSpeechWithTimestamps } from "./lib/deepgram";
import { generateStockVideoTimeline } from "./lib/stock-timeline";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Load dotenv configuration from project
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const RENDER_SERVER_URL = "http://localhost:3001";
const RENDER_SERVER_SECRET = process.env.RENDER_SERVER_SECRET || "your-secret-key-here";

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

async function uploadAsset(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Write file locally to be served by local render server
  fs.writeFileSync(path.join(tempDir, filename), buffer);
  console.log(`[Asset Uploader] Saved asset locally to: public/assets-temp/${filename}`);

  return `/assets-temp/${filename}`;
}

async function callOpenAI(endpoint: string, payload: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  // Uses fetch with retry for safety
  let res;
  for (let i = 0; i < 3; i++) {
    try {
      res = await fetch(`https://api.openai.com/v1/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) break;
    } catch (err) {
      if (i === 2) throw err;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (!res || !res.ok) {
    const errText = await res?.text();
    throw new Error(`OpenAI error: ${res?.status} - ${errText}`);
  }

  return res.json();
}

/**
 * Generation of DALL-E 3 image with Picsum mockup fallback on credential restrictions
 */
async function generateDalleImage(prompt: string, filename: string): Promise<string> {
  let response;
  try {
    console.log(`[DALL-E] Generating vertical image for: "${prompt.substring(0, 50)}..."`);
    response = await callOpenAI("images/generations", {
      model: "gpt-image-2",
      prompt: `${prompt}, 3d animation style, vertical aspect ratio 9:16, high quality, vibrant colors`,
      n: 1,
      size: "1024x1792", // Vertical format
    });
    console.log(`[DALL-E] Image generated as base64. Uploading...`);
    const b64Data = response.data[0].b64_json;
    const buffer = Buffer.from(b64Data, "base64");
    return uploadAsset(buffer, filename, "image/png");
  } catch (err) {
    console.warn(`[DALL-E] DALL-E failed. Error detail:`, err);
    console.warn(`[DALL-E] Falling back to Picsum mockup image...`);
    return `https://picsum.photos/seed/${encodeURIComponent(prompt.substring(0,10))}/1080/1920`;
  }
}

async function submitJob(videoType: string, payload: any) {
  console.log(`[Test Client] Submitting job to Render Server: ${videoType}...`);
  const response = await fetch(`${RENDER_SERVER_URL}/render`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Render-Secret": RENDER_SERVER_SECRET,
    },
    body: JSON.stringify({
      videoType,
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server returned error: ${response.status} - ${await response.text()}`);
  }

  const result = await response.json();
  console.log(`[Test Client] Job submitted successfully. Job ID: ${result.jobId}`);
  return result.jobId;
}

async function pollJobStatus(jobId: string) {
  console.log(`[Test Client] Polling status for Job: ${jobId}...`);
  const interval = setInterval(async () => {
    const response = await fetch(`${RENDER_SERVER_URL}/render/${jobId}`, {
      headers: {
        "X-Render-Secret": RENDER_SERVER_SECRET,
      },
    });

    if (!response.ok) {
      console.error(`Error polling status: ${response.status}`);
      clearInterval(interval);
      return;
    }

    const job = await response.json();
    console.log(`[Test Client] Status: ${job.status} | Progress: ${job.progress}%`);

    if (job.status === "completed") {
      console.log(`\n🎉 SUCCESS! Video rendered completely!`);
      console.log(`🔗 Video URL: ${job.videoUrl}\n`);
      clearInterval(interval);
    } else if (job.status === "failed") {
      console.error(`\n❌ FAILED: Render job failed. Error: ${job.error}\n`);
      clearInterval(interval);
    }
  }, 3000);
}

// ----------------------------------------------------
// Mock Scripts to save OpenAI Chat credits
// ----------------------------------------------------
const mockSocialMediaScript = {
  title: "Mock Typography Quote",
  durationSec: 10,
  fps: 30,
  width: 1920,
  height: 1080,
  scenes: [
    {
      text: "Design is not just what it looks like.",
      startSec: 0,
      durationSec: 3.5,
      bgColor: "#1e1b4b",
      textColor: "#facc15",
      animation: "fadeIn",
    },
    {
      text: "Design is how it works.",
      startSec: 3.5,
      durationSec: 3.5,
      bgColor: "#0f172a",
      textColor: "#38bdf8",
      animation: "fadeIn",
    },
    {
      text: "- Steve Jobs",
      startSec: 7.0,
      durationSec: 3.0,
      bgColor: "#020617",
      textColor: "#f8fafc",
      animation: "fadeIn",
    },
  ],
};

const mockAIScenes = [
  {
    text: "Deep in the dark, mysterious forest, a legendary gold treasure chest lay untouched for centuries.",
    imagePrompt: "A glowing golden treasure chest buried under moss in a dark, ancient fantasy forest",
  },
  {
    text: "According to ancient scrolls, it holds a magical artifact capable of granting absolute wisdom.",
    imagePrompt: "An old wizard holding an open glowing scroll with magical runes reflecting on his face",
  }
];

async function run() {
  const mode = process.argv[2] || "SocialMedia"; // Default to fast typography test
  console.log(`\n🚀 Starting test runner in mode: [${mode}] (Mock Scripts enabled to save credits)`);

  try {
    if (mode === "AIVideo") {
      // 1. Test Endpoint A: AIVideo (DALL-E 3 image generation + Deepgram TTS/STT)
      const jobId = uuidv4();
      const timeline: any = {
        shortTitle: "Legend of Wisdom",
        elements: [],
        text: [],
        audio: [],
      };

      const tempDir = path.join(process.cwd(), "public", "assets-temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      let durationMs = 0;

      for (let i = 0; i < mockAIScenes.length; i++) {
        const scene = mockAIScenes[i];
        const sceneId = `${jobId}-ai-scene-${i}`;

        // A. Generate Deepgram TTS voiceover and get timestamps
        const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);
        const wordTimestamps = await generateSpeechWithTimestamps(scene.text, localAudioPath);

        const audioBuffer = fs.readFileSync(localAudioPath);
        const audioUrl = await uploadAsset(audioBuffer, `${sceneId}.mp3`, "audio/mpeg");

        const lastWord = wordTimestamps[wordTimestamps.length - 1];
        const sceneDurationMs = Math.ceil((lastWord ? lastWord.end : 6) * 1000);

        // B. Generate Image via DALL-E 3 (Credits only spent on images as requested!)
        const imageUrl = await generateDalleImage(scene.imagePrompt, `${sceneId}.png`);

        timeline.elements.push({
          imageUrl,
          startMs: durationMs,
          endMs: durationMs + sceneDurationMs,
        });

        timeline.audio.push({
          startMs: durationMs,
          endMs: durationMs + sceneDurationMs,
          audioUrl,
        });

        // Assemble kinetic captions
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

      console.log(`[Test Client] Submitted AIVideo job...`);
      const serverJobId = await submitJob("AIVideo", { timeline });
      await pollJobStatus(serverJobId);

    } else if (mode === "StockVideo") {
      // 2. Test Endpoint C: Stock Video (Pexels videos + Deepgram TTS)
      const prompt = process.argv[3] || "Calm Ocean Sunset";
      const topic = process.argv[4] || "Ocean Sunset";
      console.log(`[Test Client] Generating StockVideo timeline for prompt: [${prompt}]...`);
      const timeline = await generateStockVideoTimeline(prompt, topic);
      const serverJobId = await submitJob("StockVideo", { timeline });
      await pollJobStatus(serverJobId);

    } else {
      // 3. Test Endpoint B: Typography Slide Video (SocialMedia - totally bypasses OpenAI!)
      console.log("[Test Client] Generating audio/voiceover for typography slides...");
      const tempDir = path.join(process.cwd(), "public", "assets-temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const jobId = uuidv4();
      for (let i = 0; i < mockSocialMediaScript.scenes.length; i++) {
        const scene: any = mockSocialMediaScript.scenes[i];
        const sceneId = `${jobId}-social-scene-${i}`;

        // Generate Deepgram TTS voiceover
        const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);
        await generateSpeechWithTimestamps(scene.text, localAudioPath);

        const audioBuffer = fs.readFileSync(localAudioPath);
        const audioUrl = await uploadAsset(audioBuffer, `${sceneId}.mp3`, "audio/mpeg");

        // Attach audioUrl to scene
        scene.audioUrl = audioUrl;
      }

      console.log("[Test Client] Submitting typography slide job (no OpenAI calls used)...");
      const serverJobId = await submitJob("SocialMedia", { script: mockSocialMediaScript });
      await pollJobStatus(serverJobId);
    }
  } catch (err) {
    console.error("Test runner error:", err);
  }
}

run();
