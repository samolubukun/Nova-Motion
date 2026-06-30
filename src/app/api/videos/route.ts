import { NextRequest, NextResponse } from "next/server";
import { generateVideoScript } from "@/lib/openai";
import {
  GenerateRequestSchema,
  RenderRequestSchema,
  VideoScript,
  VideoType,
} from "../../../../shared/video-schema";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { generateSpeechWithTimestamps, AURA_VOICES } from "@/lib/deepgram";

export const runtime = "nodejs";
export const maxDuration = 180; // Allow up to 3 minutes for script generation + voiceovers + job submission

import { generateAIVideoTimeline } from "@/lib/ai-timeline";
import { generateStockVideoTimeline } from "@/lib/stock-timeline";

// Get render server configuration
function getRenderServerConfig() {
  const url = process.env.RENDER_SERVER_URL;
  const secret = process.env.RENDER_SERVER_SECRET;

  if (!url) {
    throw new Error("RENDER_SERVER_URL environment variable is not set");
  }

  return { url, secret };
}

// Submit job to render server
async function submitToRenderServer(
  videoType: VideoType,
  script?: VideoScript,
  timeline?: any,
  webhookUrl?: string
): Promise<{ jobId: string; status: string; createdAt: string }> {
  const { url, secret } = getRenderServerConfig();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (secret) {
    headers["X-Render-Secret"] = secret;
  }

  const response = await fetch(`${url}/render`, {
    method: "POST",
    headers,
    body: JSON.stringify({ videoType, script, timeline, webhookUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Render server returned ${response.status}`);
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a direct render request (with script/timeline) or a generate request (with prompt)
    const hasScript = ("script" in body && body.script) || ("timeline" in body && body.timeline);
    const hasPrompt = "prompt" in body && body.prompt;

    let videoType: VideoType;
    let script: VideoScript | undefined;
    let timeline: any;

    if (hasScript) {
      // Direct render request - validate the payload
      const validation = RenderRequestSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid render request",
            details: validation.error.issues.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      videoType = validation.data.videoType;
      script = validation.data.script;
      timeline = validation.data.timeline;
    } else if (hasPrompt) {
      // Generate request
      const validation = GenerateRequestSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid generate request",
            details: validation.error.issues.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      const { prompt, videoType: vt, durationSec, style, topic, aspectRatio, webhookUrl, voice } = validation.data;
      videoType = vt;

      // Compute aspect ratio dimensions
      let width = 1080;
      let height = 1920;
      if (aspectRatio === "16:9") {
        width = 1920;
        height = 1080;
      } else if (aspectRatio === "1:1") {
        width = 1080;
        height = 1080;
      }

      // Enforce a single voice for the entire video (either request specific or chosen randomly)
      const selectedVoice = voice || AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
      console.log(`[API Gateway] Selected voice [${selectedVoice}] for the render job`);

      if (videoType === "AIVideo") {
        // Generate AI Storyboard Video Timeline using OpenAI and Deepgram
        timeline = await generateAIVideoTimeline(prompt, topic || "Interesting Facts", selectedVoice);
        timeline.width = width;
        timeline.height = height;
      } else if (videoType === "StockVideo") {
        // Generate AI Stock Video Timeline using Pexels and Deepgram
        timeline = await generateStockVideoTimeline(prompt, topic || "Interesting Facts", selectedVoice);
        timeline.width = width;
        timeline.height = height;
      } else {
        // Generate script using Claude/OpenAI
        const result = await generateVideoScript(prompt, videoType, durationSec, style);

        if (!result.success) {
          return NextResponse.json(
            {
              success: false,
              error: `Failed to generate script: ${result.error}`,
            },
            { status: 500 }
          );
        }

        script = result.script;
        script.width = width;
        script.height = height;

        // Generate Deepgram TTS voiceover and kinetic word-level highlights for typography slides
        const tempDir = path.join(process.cwd(), "public", "assets-temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const jobId = uuidv4();
        for (let i = 0; i < script.scenes.length; i++) {
          const scene = script.scenes[i];
          const sceneId = `${jobId}-slide-scene-${i}`;
          const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);

          try {
            const wordTimestamps = await generateSpeechWithTimestamps(scene.text, localAudioPath, selectedVoice);
            scene.audioUrl = `/assets-temp/${sceneId}.mp3`;
            scene.words = wordTimestamps; // Inject word-level captions
          } catch (audioErr) {
            console.error(`[API Gateway] Failed to generate voiceover for slide scene ${i}:`, audioErr);
          }
        }
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Request must include either 'script/timeline' or 'prompt'",
        },
        { status: 400 }
      );
    }

    // Submit to render server
    const renderResult = await submitToRenderServer(videoType, script, timeline, body.webhookUrl);

    return NextResponse.json({
      success: true,
      jobId: renderResult.jobId,
      status: renderResult.status,
      script,
      timeline,
      createdAt: renderResult.createdAt,
    });
  } catch (err) {
    console.error("Videos API error:", err);

    // Check if it's a connection error to render server
    if (err instanceof Error && err.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to connect to render server. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
