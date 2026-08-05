import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

// Force IPv4 preference and use public DNS resolvers to avoid getaddrinfo lookup failures on Windows
dns.setDefaultResultOrder("ipv4first");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e);
}

import { generateVideoScript } from "@/lib/openai";
import {
  GenerateRequestSchema,
  RenderRequestSchema,
  VideoScript,
  VideoType,
  getAspectRatioDimensions,
  MicroDramaRequestSchema,
  UGCRequestSchema,
  AgenticVideoRequestSchema,
  LumaRequestSchema,
} from "../../../../shared/video-schema";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { generateSpeechWithTimestamps, AURA_VOICES, ELEVENLABS_VOICES } from "@/lib/deepgram";

export const runtime = "nodejs";
export const maxDuration = 900; // Allow up to 15 minutes for script/voiceover/WaveSpeed AI clip generation

import { generateAIVideoTimeline } from "@/lib/ai-timeline";
import { generateStockVideoTimeline } from "@/lib/stock-timeline";
import { generateStockImageTimeline } from "@/lib/stock-image-timeline";
import { generateMotionGraphicsTimeline } from "@/lib/motion-graphics-timeline";

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

// Submit a TextToVideo pipeline job (timeline is generated inside the render job)
async function submitTextToVideoToRenderServer(
  prompt: string,
  topic: string,
  voice?: string,
  aspectRatio?: string,
  webhookUrl?: string
): Promise<{ jobId: string; status: string; createdAt: string }> {
  const { url, secret } = getRenderServerConfig();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (secret) {
    headers["X-Render-Secret"] = secret;
  }

  const response = await fetch(`${url}/render/text-to-video`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt, topic, voice, aspectRatio, webhookUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Render server returned ${response.status}`);
  }

  return response.json();
}

// Submit a UGC pipeline job (the WaveSpeed clip is generated inside the render job)
async function submitUGCToRenderServer(
  options: {
    prompt: string;
    model?: string;
    images?: string[];
    aspectRatio?: string;
    duration?: number;
    resolution?: string;
    mode?: string;
    multiScene?: boolean;
    voice?: string;
    targetDurationSec?: number;
    lipSync?: boolean;
  },
  webhookUrl?: string
): Promise<{ jobId: string; status: string; createdAt: string }> {
  const { url, secret } = getRenderServerConfig();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (secret) {
    headers["X-Render-Secret"] = secret;
  }

  const response = await fetch(`${url}/render/ugc`, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...options, webhookUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Render server returned ${response.status}`);
  }

  return response.json();
}

// Submit a MicroDrama pipeline job (timeline is generated inside the render job)
async function submitMicroDramaToRenderServer(
  idea: string,
  options: { script?: string; style?: string; requirement?: string; aspectRatio?: string },
  webhookUrl?: string
): Promise<{ jobId: string; status: string; createdAt: string }> {
  const { url, secret } = getRenderServerConfig();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (secret) {
    headers["X-Render-Secret"] = secret;
  }

  const response = await fetch(`${url}/render/micro-drama`, {
    method: "POST",
    headers,
    body: JSON.stringify({ idea, ...options, webhookUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Render server returned ${response.status}`);
  }

  return response.json();
}

async function submitAgenticVideoToRenderServer(
  payload: Record<string, unknown>
): Promise<{ jobId: string; status: string; createdAt: string }> {
  const { url, secret } = getRenderServerConfig();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) headers["X-Render-Secret"] = secret;

  const response = await fetch(`${url}/render/agentic-video`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Render server returned ${response.status}`);
  }
  return response.json();
}

async function submitLumaToRenderServer(
  payload: Record<string, unknown>
): Promise<{ jobId: string; status: string; createdAt: string }> {
  const { url, secret } = getRenderServerConfig();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) headers["X-Render-Secret"] = secret;

  const response = await fetch(`${url}/render/luma`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
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

    if (body?.videoType === "AgenticVideoGenerator") {
      const candidate = {
        title: body.title ?? body.prompt,
        brief: body.brief ?? body.prompt,
        targetAudience: body.targetAudience ?? "General audience",
        durationSeconds: body.durationSeconds ?? body.durationSec,
        language: body.language,
        tone: body.tone,
        keyMessages: body.keyMessages,
        callToAction: body.callToAction,
        platform: body.platform,
        aspectRatio: body.aspectRatio,
        voice: body.voice,
        style: typeof body.style === "string" ? body.style : undefined,
        videoModel: body.videoModel,
        videoResolution: body.videoResolution,
        characterDescription: body.characterDescription,
        referenceImages: body.referenceImages,
        lipSync: body.lipSync,
        webhookUrl: body.webhookUrl,
      };
      const validation = AgenticVideoRequestSchema.safeParse(candidate);
      if (!validation.success) {
        return NextResponse.json({
          success: false,
          error: "Invalid AgenticVideoGenerator request",
          details: validation.error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        }, { status: 400 });
      }

      try {
        const renderResult = await submitAgenticVideoToRenderServer(validation.data);
        return NextResponse.json({ success: true, ...renderResult });
      } catch (renderErr) {
        console.error("[API Gateway] Agentic render submission failed:", renderErr);
        return NextResponse.json({
          success: false,
          error: "Unable to connect to render server. Please try again later.",
        }, { status: 503 });
      }
    }

    // Luma (Ray 3.2) mode submission — one mode, every Ray use-case. The
    // pipeline (single-shot edit/reframe/i2v, or screenplay -> scenes with
    // extend chaining + optional TTS/captions) runs inside the render job.
    if (body?.videoType === "Luma" && typeof body.prompt === "string") {
      const candidate: Record<string, unknown> = {
        prompt: body.prompt,
      };
      const lumaFields = [
        "title", "useCase", "targetAudience", "targetDurationSeconds", "language",
        "tone", "style", "referenceImages", "sourceVideoUrl", "sourceVideoFileId",
        "explicitOperation", "aspectRatio", "resolution", "duration", "hdr",
        "loop", "editStrength", "multiKeyframes", "voice", "generateAudio",
        "sceneCount", "webhookUrl",
      ] as const;
      for (const field of lumaFields) {
        if (body[field] !== undefined) candidate[field] = body[field];
      }

      const validation = LumaRequestSchema.safeParse(candidate);
      if (!validation.success) {
        return NextResponse.json({
          success: false,
          error: "Invalid Luma request",
          details: validation.error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        }, { status: 400 });
      }

      try {
        const renderResult = await submitLumaToRenderServer(validation.data);
        return NextResponse.json({ success: true, ...renderResult });
      } catch (renderErr) {
        console.error("[API Gateway] Luma render submission failed:", renderErr);
        return NextResponse.json({
          success: false,
          error: "Unable to connect to render server. Please try again later.",
        }, { status: 503 });
      }
    }

    // MicroDrama async pipeline submission (idea → story → scenes → I2V clips,
    // all generated inside the render job, then rendered).
    // Accepts either `idea` (preferred) or `prompt` (used by the web UI).
    if (body && body.videoType === "MicroDrama" && ("idea" in body || "prompt" in body)) {
      const candidate: Record<string, unknown> = {
        idea: body.idea ?? body.prompt,
      };
      if (typeof body.script === "string") candidate.script = body.script;
      if (typeof body.style === "string") candidate.style = body.style;
      if (typeof body.requirement === "string") candidate.requirement = body.requirement;
      if (typeof body.aspectRatio === "string") candidate.aspectRatio = body.aspectRatio;
      if (typeof body.webhookUrl === "string") candidate.webhookUrl = body.webhookUrl;

      const validation = MicroDramaRequestSchema.safeParse(candidate);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid MicroDrama request",
            details: validation.error.issues.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      const { idea, script, style, requirement, aspectRatio, webhookUrl } = validation.data;

      let renderResult;
      try {
        renderResult = await submitMicroDramaToRenderServer(
          idea,
          { script, style, requirement, aspectRatio },
          webhookUrl
        );
      } catch (renderErr: unknown) {
        console.error("[API Gateway] Render server connection failed:", renderErr);
        return NextResponse.json(
          {
            success: false,
            error: "Unable to connect to render server. Please try again later.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json({
        success: true,
        jobId: renderResult.jobId,
        status: renderResult.status,
        createdAt: renderResult.createdAt,
      });
    }

    // UGC async pipeline submission (Open-AI-UGC replication via WaveSpeed).
    // `prompt` is the UGC script; optional `images`, `model`, `aspectRatio`,
    // `duration`, `resolution`, and `mode` mirror the UGC studio's controls.
    if (body && body.videoType === "UGC" && typeof body.prompt === "string") {
      const candidate: Record<string, unknown> = {
        prompt: body.prompt,
      };
      if (typeof body.model === "string") candidate.model = body.model;
      if (Array.isArray(body.images)) candidate.images = body.images;
      if (typeof body.aspectRatio === "string") candidate.aspectRatio = body.aspectRatio;
      if (typeof body.duration === "number") candidate.duration = body.duration;
      else if (typeof body.durationSec === "number") candidate.duration = body.durationSec;
      if (typeof body.resolution === "string") candidate.resolution = body.resolution;
      if (typeof body.mode === "string") candidate.mode = body.mode;
      if (typeof body.multiScene === "boolean") candidate.multiScene = body.multiScene;
      if (typeof body.voice === "string") candidate.voice = body.voice;
      if (typeof body.targetDurationSec === "number") candidate.targetDurationSec = body.targetDurationSec;
      if (typeof body.lipSync === "boolean") candidate.lipSync = body.lipSync;
      if (typeof body.webhookUrl === "string") candidate.webhookUrl = body.webhookUrl;

      const validation = UGCRequestSchema.safeParse(candidate);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid UGC request",
            details: validation.error.issues.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      const { prompt, model, images, aspectRatio, duration, resolution, mode, multiScene, voice, targetDurationSec, lipSync, webhookUrl } = validation.data;

      let renderResult;
      try {
        renderResult = await submitUGCToRenderServer(
          { prompt, model, images, aspectRatio, duration, resolution, mode, multiScene, voice, targetDurationSec, lipSync },
          webhookUrl
        );
      } catch (renderErr: unknown) {
        console.error("[API Gateway] Render server connection failed:", renderErr);
        return NextResponse.json(
          {
            success: false,
            error: "Unable to connect to render server. Please try again later.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json({
        success: true,
        jobId: renderResult.jobId,
        status: renderResult.status,
        createdAt: renderResult.createdAt,
      });
    }

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
      const { width, height } = getAspectRatioDimensions(aspectRatio || "9:16");

      // Enforce a single voice for the entire video (either request specific or chosen randomly)
      const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY);
      let defaultVoice = AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
      if (hasElevenLabs) {
        defaultVoice = ELEVENLABS_VOICES[Math.floor(Math.random() * ELEVENLABS_VOICES.length)].id;
      }
      const selectedVoice = voice || defaultVoice;
      console.log(`[API Gateway] Selected voice [${selectedVoice}] for the render job`);

      if (videoType === "AIVideo") {
        // Generate AI Storyboard Video Timeline using OpenAI and Deepgram
        timeline = await generateAIVideoTimeline(prompt, topic || "Interesting Facts", selectedVoice, aspectRatio);
        timeline.width = width;
        timeline.height = height;

        // Convert relative URLs to absolute URLs
        if (timeline.audio) {
          timeline.audio = timeline.audio.map((a: any) => ({
            ...a,
            audioUrl: a.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${a.audioUrl}` : a.audioUrl,
          }));
        }
        if (timeline.music) {
          timeline.music = timeline.music.map((m: any) => ({
            ...m,
            audioUrl: m.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${m.audioUrl}` : m.audioUrl,
          }));
        }
        if (timeline.elements) {
          timeline.elements = timeline.elements.map((el: any) => ({
            ...el,
            imageUrl: el.imageUrl && el.imageUrl.startsWith("/") ? `${req.nextUrl.origin}${el.imageUrl}` : el.imageUrl,
            videoUrl: el.videoUrl && el.videoUrl.startsWith("/") ? `${req.nextUrl.origin}${el.videoUrl}` : el.videoUrl,
          }));
        }
      } else if (videoType === "StockVideo") {
        // Generate AI Stock Video Timeline using Pexels and Deepgram
        timeline = await generateStockVideoTimeline(prompt, topic || "Interesting Facts", selectedVoice, aspectRatio);
        timeline.width = width;
        timeline.height = height;

        // Convert relative URLs to absolute URLs
        if (timeline.audio) {
          timeline.audio = timeline.audio.map((a: any) => ({
            ...a,
            audioUrl: a.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${a.audioUrl}` : a.audioUrl,
          }));
        }
        if (timeline.music) {
          timeline.music = timeline.music.map((m: any) => ({
            ...m,
            audioUrl: m.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${m.audioUrl}` : m.audioUrl,
          }));
        }
        if (timeline.elements) {
          timeline.elements = timeline.elements.map((el: any) => ({
            ...el,
            imageUrl: el.imageUrl && el.imageUrl.startsWith("/") ? `${req.nextUrl.origin}${el.imageUrl}` : el.imageUrl,
            videoUrl: el.videoUrl && el.videoUrl.startsWith("/") ? `${req.nextUrl.origin}${el.videoUrl}` : el.videoUrl,
          }));
        }
      } else if (videoType === "StockImage") {
        // Generate Stock Image Timeline using Pixabay and Deepgram
        timeline = await generateStockImageTimeline(prompt, topic || "Interesting Facts", selectedVoice, aspectRatio);
        timeline.width = width;
        timeline.height = height;

        // Convert relative URLs to absolute URLs
        if (timeline.audio) {
          timeline.audio = timeline.audio.map((a: any) => ({
            ...a,
            audioUrl: a.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${a.audioUrl}` : a.audioUrl,
          }));
        }
        if (timeline.music) {
          timeline.music = timeline.music.map((m: any) => ({
            ...m,
            audioUrl: m.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${m.audioUrl}` : m.audioUrl,
          }));
        }
        if (timeline.elements) {
          timeline.elements = timeline.elements.map((el: any) => ({
            ...el,
            imageUrl: el.imageUrl && el.imageUrl.startsWith("/") ? `${req.nextUrl.origin}${el.imageUrl}` : el.imageUrl,
            videoUrl: el.videoUrl && el.videoUrl.startsWith("/") ? `${req.nextUrl.origin}${el.videoUrl}` : el.videoUrl,
          }));
        }
      } else if (videoType === "TextToVideo") {
        // Async pipeline: submit the job to the render server, which generates
        // the WaveSpeed timeline (script -> TTS -> Seedance clips -> Lyria music)
        // inside the job and then renders. Returns immediately with a jobId.
        let renderResult;
        try {
          renderResult = await submitTextToVideoToRenderServer(
            prompt,
            topic || "Interesting Facts",
            selectedVoice,
            aspectRatio,
            body.webhookUrl
          );
        } catch (renderErr: unknown) {
          console.error("[API Gateway] Render server connection failed:", renderErr);
          return NextResponse.json(
            {
              success: false,
              error: "Unable to connect to render server. Please try again later.",
            },
            { status: 503 }
          );
        }

        return NextResponse.json({
          success: true,
          jobId: renderResult.jobId,
          status: renderResult.status,
          createdAt: renderResult.createdAt,
        });
      } else if (videoType === "MotionGraphics") {
        // Generate Motion Graphics Timeline using OpenAI and Deepgram
        timeline = await generateMotionGraphicsTimeline(prompt, topic || "Interesting Facts", selectedVoice, aspectRatio);
        timeline.width = width;
        timeline.height = height;

        // Convert relative URLs to absolute URLs
        if (timeline.audio) {
          timeline.audio = timeline.audio.map((a: any) => ({
            ...a,
            audioUrl: a.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${a.audioUrl}` : a.audioUrl,
          }));
        }
        if (timeline.music) {
          timeline.music = timeline.music.map((m: any) => ({
            ...m,
            audioUrl: m.audioUrl.startsWith("/") ? `${req.nextUrl.origin}${m.audioUrl}` : m.audioUrl,
          }));
        }
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
        let currentStartSec = 0;
        for (let i = 0; i < script.scenes.length; i++) {
          const scene = script.scenes[i];
          const sceneId = `${jobId}-slide-scene-${i}`;
          const localAudioPath = path.join(tempDir, `${sceneId}.mp3`);

          try {
            const wordTimestamps = await generateSpeechWithTimestamps(scene.text, localAudioPath, selectedVoice);
            scene.audioUrl = `${req.nextUrl.origin}/assets-temp/${sceneId}.mp3`;
            scene.words = wordTimestamps; // Inject word-level captions

            // Calculate actual duration from audio timestamps + minor buffer for natural flow
            const lastWord = wordTimestamps[wordTimestamps.length - 1];
            const audioDuration = lastWord ? lastWord.end : 3;
            const actualDurationSec = parseFloat((audioDuration + 0.5).toFixed(2));

            scene.startSec = currentStartSec;
            scene.durationSec = actualDurationSec;
            currentStartSec += actualDurationSec;
          } catch (audioErr) {
            console.error(`[API Gateway] Failed to generate voiceover for slide scene ${i}:`, audioErr);
            scene.startSec = currentStartSec;
            currentStartSec += scene.durationSec;
          }
        }
        // Update the script duration to match the adjusted scenes duration sum
        script.durationSec = parseFloat(currentStartSec.toFixed(2));
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
    let renderResult;
    try {
      renderResult = await submitToRenderServer(videoType, script, timeline, body.webhookUrl);
    } catch (renderErr: any) {
      console.error("[API Gateway] Render server connection failed:", renderErr);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to connect to render server. Please try again later.",
        },
        { status: 503 }
      );
    }

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

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
