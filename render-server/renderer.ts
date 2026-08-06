import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import * as path from "path";
import * as fs from "fs";
import { RenderJob, updateJobStatus } from "./queue";
import { getVideoPath, generateVideoFilename, getVideoUrlWithR2Fallback } from "./storage";
import { generateWavespeedVideoTimeline } from "../src/lib/wavespeed-timeline";
import { generateMicroDramaTimeline } from "../src/lib/micro-drama-timeline";
import { generateUGCVideo } from "../src/lib/ugc-pipeline";
import { generateUGCMultiSceneTimeline } from "../src/lib/ugc-multi-scene";
import { generateAgenticVideoTimeline } from "../src/lib/agentic-video-pipeline";
import type { AgenticVideoInput } from "../src/lib/agentic-video-pipeline";
import type { AgenticStage } from "../src/lib/agentic-checkpoints";
import { loadAgenticCheckpoint, saveAgenticCheckpoint } from "../src/lib/agentic-checkpoints";
import { generateLumaVideoTimeline } from "../src/lib/luma-pipeline";
import type { LumaVideoInput } from "../src/lib/luma-pipeline";
import { generateVoxVideoTimeline } from "../src/lib/vox-pipeline";
import type { VoxVideoInput } from "../src/lib/vox-pipeline";

// Cache the bundle URL to avoid rebundling on every render
let cachedBundleUrl: string | null = null;
let bundlePromise: Promise<string> | null = null;

/**
 * Get or create the Remotion bundle
 */
async function getBundleUrl(): Promise<string> {
  if (cachedBundleUrl) {
    return cachedBundleUrl;
  }

  // If bundle is already in progress, wait for it
  if (bundlePromise) {
    return bundlePromise;
  }

  // Start bundling
  bundlePromise = (async () => {
    console.log("Bundling Remotion project...");
    const startTime = Date.now();

    const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");

    const bundleUrl = await bundle({
      entryPoint,
      // Enable caching for faster subsequent bundles
      webpackOverride: (config) => config,
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`Bundle complete in ${duration}s: ${bundleUrl}`);

    cachedBundleUrl = bundleUrl;
    return bundleUrl;
  })();

  return bundlePromise;
}

/**
 * Invalidate the bundle cache (call when source code changes)
 */
export function invalidateBundleCache() {
  cachedBundleUrl = null;
  bundlePromise = null;
}

/**
 * Download a file (e.g. a generated video clip) into the videos directory.
 */
async function downloadToVideosDir(url: string, filename: string): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(180000),
  });
  if (!response.ok) {
    throw new Error(`Failed to download generated video: ${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const outputPath = getVideoPath(filename);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

/**
 * Render a video from a job
 */
export async function renderVideo(job: RenderJob, baseUrl: string): Promise<void> {
  const startTime = Date.now();
  console.log(`Starting render for job ${job.id} (${job.videoType})`);

  try {
    // For UGC pipeline jobs, the finished video is generated externally by
    // WaveSpeed (no Remotion render needed). Download it into the videos dir,
    // persist to storage, and mark the job complete.
    if (job.videoType === "UGC" && job.pipeline && !job.pipeline.multiScene) {
      const { prompt, images, model, aspectRatio, duration, resolution, mode } = job.pipeline;
      console.log(`[UGC] Generating video for job ${job.id}...`);

      const result = await generateUGCVideo(
        {
          prompt: prompt || "",
          images,
          model,
          aspectRatio,
          duration,
          resolution,
          mode,
        },
        {
          onProgress: (progress) => {
            const mapped = Math.round(progress * 90);
            updateJobStatus(job.id, { progress: Math.max(0, Math.min(90, mapped)) });
          },
        }
      );

      const filename = generateVideoFilename(job.id);
      await downloadToVideosDir(result.videoUrl, filename);
      console.log(`[UGC] Downloaded clip for job ${job.id} to ${filename}.`);

      updateJobStatus(job.id, { progress: 95 });

      const videoUrl = await getVideoUrlWithR2Fallback(filename, baseUrl);
      updateJobStatus(job.id, {
        status: "completed",
        progress: 100,
        videoUrl,
        completedAt: new Date(),
      });
      console.log(`[UGC] Job ${job.id} completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s.`);
      return;
    }

    // For multi-scene UGC pipeline jobs, build the scene-by-scene timeline
    // (LLM scene breakdown → TTS voiceover → per-scene clips) inside the job,
    // then render it with the `UGC` Remotion composition below (reports 0-35%).
    if (job.videoType === "UGC" && job.pipeline && job.pipeline.multiScene) {
      const { prompt, images, model, aspectRatio, resolution, voice, targetDurationSec, lipSync } = job.pipeline;
      console.log(`[UGC Multi-Scene] Building timeline for job ${job.id}...`);
      job.timeline = await generateUGCMultiSceneTimeline(
        {
          prompt: prompt || "",
          images,
          model,
          aspectRatio,
          resolution,
          voice,
          targetDurationSec,
          lipSync,
        },
        {
          onProgress: (progress) => {
            const mapped = Math.round(progress * 35);
            updateJobStatus(job.id, { progress: Math.max(0, Math.min(35, mapped)) });
          },
          assetBaseUrl: baseUrl,
        }
      );
      console.log(`[UGC Multi-Scene] Timeline ready for job ${job.id}.`);
    }

    // For TextToVideo pipeline jobs, generate the timeline first (reports 0-20%)
    if (job.videoType === "TextToVideo" && job.pipeline) {
      const { prompt, topic, voice, aspectRatio } = job.pipeline;
      console.log(`[TextToVideo] Generating timeline for job ${job.id}...`);
      job.timeline = await generateWavespeedVideoTimeline(
        prompt || "",
        topic || prompt || "",
        voice,
        aspectRatio || "9:16",
        {
          onProgress: (progress) => {
            const mapped = Math.round(progress * 20);
            updateJobStatus(job.id, { progress: Math.max(0, Math.min(20, mapped)) });
          },
          assetBaseUrl: baseUrl,
        }
      );
      console.log(`[TextToVideo] Timeline ready for job ${job.id}.`);
    }

    // For MicroDrama pipeline jobs, generate the story → clips timeline first
    // (reports 0-25%)
    if (job.videoType === "MicroDrama" && job.pipeline) {
      const { idea, script, style, requirement, aspectRatio } = job.pipeline;
      console.log(`[MicroDrama] Generating timeline for job ${job.id}...`);
      job.timeline = await generateMicroDramaTimeline(
        { idea: idea!, script, style, requirement },
        {
          aspectRatio: aspectRatio || "16:9",
          onProgress: (progress) => {
            const mapped = Math.round(progress * 25);
            updateJobStatus(job.id, { progress: Math.max(0, Math.min(25, mapped)) });
          },
          assetBaseUrl: baseUrl,
        }
      );
      console.log(`[MicroDrama] Timeline ready for job ${job.id}.`);
    }

if (job.videoType === "AgenticVideoGenerator" && job.pipeline) {
      console.log(`[AgenticVideoGenerator] Running concept-to-video pipeline for job ${job.id}...`);
      const pipeline = job.pipeline;
      const input: AgenticVideoInput = {
        title: pipeline.title || pipeline.prompt || "Untitled video",
        brief: pipeline.brief || pipeline.prompt || "",
        targetAudience: pipeline.targetAudience || "General audience",
        durationSeconds: pipeline.durationSeconds || 60,
        language: pipeline.language || "English",
        tone: pipeline.tone || "professional",
        keyMessages: pipeline.keyMessages,
        callToAction: pipeline.callToAction,
        platform: pipeline.platform || "standard",
        aspectRatio: pipeline.aspectRatio,
        voice: pipeline.voice,
        style: pipeline.style,
        videoModel: pipeline.videoModel,
        videoResolution: pipeline.videoResolution,
        characterDescription: pipeline.characterDescription,
        referenceImages: pipeline.referenceImages,
        lipSync: pipeline.lipSync,
      };
      job.timeline = await generateAgenticVideoTimeline(input, {
        jobId: job.id,
        assetBaseUrl: baseUrl,
        onProgress: (progress) => updateJobStatus(job.id, { progress: Math.round(progress * 25) }),
        onStage: (stage: AgenticStage) => {
          updateJobStatus(job.id, { currentStage: stage });
        },
      });
      console.log(`[AgenticVideoGenerator] Timeline ready for job ${job.id}.`);
    }

    if (job.videoType === "Luma" && job.pipeline) {
      console.log(`[Luma] Running Ray 3.2 pipeline for job ${job.id}...`);
      const pipeline = job.pipeline;
      const input: LumaVideoInput = {
        prompt: pipeline.prompt || "",
        title: pipeline.title,
        useCase: pipeline.useCase as LumaVideoInput["useCase"],
        targetAudience: pipeline.targetAudience,
        targetDurationSeconds: pipeline.targetDurationSeconds,
        language: pipeline.language,
        tone: pipeline.tone,
        style: pipeline.style,
        referenceImages: pipeline.referenceImages,
        sourceVideoUrl: pipeline.sourceVideoUrl,
        sourceVideoFileId: pipeline.sourceVideoFileId,
        explicitOperation: pipeline.explicitOperation as LumaVideoInput["explicitOperation"],
        aspectRatio: pipeline.aspectRatio,
        resolution: pipeline.resolution,
        duration: (pipeline.videoDuration || (pipeline.duration ? `${pipeline.duration}s` : undefined)) as LumaVideoInput["duration"],
        hdr: pipeline.hdr,
        loop: pipeline.loop,
        editStrength: pipeline.editStrength,
        multiKeyframes: pipeline.multiKeyframes,
        voice: pipeline.voice,
        generateAudio: pipeline.generateAudio,
        sceneCount: pipeline.sceneCount,
      };
      job.timeline = await generateLumaVideoTimeline(input, {
        assetBaseUrl: baseUrl,
        onProgress: (progress) => updateJobStatus(job.id, { progress: Math.round(progress * 25) }),
        onStage: (stage: string) => updateJobStatus(job.id, { currentStage: stage }),
      });
      console.log(`[Luma] Timeline ready for job ${job.id}.`);
    }

    if (job.videoType === "VoxVideo" && job.pipeline) {
      console.log(`[VoxVideo] Running paper-collage pipeline for job ${job.id}...`);
      const pipeline = job.pipeline;
      const input: VoxVideoInput = {
        prompt: pipeline.prompt || "",
        title: pipeline.title,
        theme: pipeline.theme,
        arc: pipeline.arc,
        targetDurationSeconds: pipeline.targetDurationSeconds,
        language: pipeline.language,
        tone: pipeline.tone,
        aspectRatio: pipeline.aspectRatio,
        voice: pipeline.voice,
        generateAudio: pipeline.generateAudio,
        music: pipeline.music,
        sceneCount: pipeline.sceneCount,
      };
      job.timeline = await generateVoxVideoTimeline(input, {
        jobId: job.id,
        assetBaseUrl: baseUrl,
        onProgress: (progress) => updateJobStatus(job.id, { progress: Math.round(progress * 25) }),
        onStage: (stage: string) => updateJobStatus(job.id, { currentStage: stage }),
      });
      console.log(`[VoxVideo] Timeline ready for job ${job.id}.`);
    }

    // Get the bundle URL (cached or create new)
    const bundleUrl = await getBundleUrl();

    // Update progress - bundling complete (never go backwards: TextToVideo
    // pipeline may already have reported up to 20%)
    updateJobStatus(job.id, { progress: Math.max(job.progress, 10) });

    // Prepare input props
    let inputProps: any = {};
    if (job.videoType === "AIStoryboardVideo" || job.videoType === "StockVideo" || job.videoType === "StockImage" || job.videoType === "TextToVideo" || job.videoType === "MicroDrama" || job.videoType === "UGC" || job.videoType === "AgenticVideoGenerator" || job.videoType === "Luma" || job.videoType === "VoxVideo") {
      inputProps = { timeline: job.timeline };
    } else if (job.videoType === "MotionGraphics") {
      inputProps = { storyboard: job.timeline };
    } else {
      inputProps = { script: job.script };
    }

    // Select the composition
    console.log(`Selecting composition: ${job.videoType}`);
    const composition = await selectComposition({
      serveUrl: bundleUrl,
      id: job.videoType,
      inputProps,
    });

    updateJobStatus(job.id, { progress: Math.max(job.progress, 20) });

    // Generate output path
    const filename = generateVideoFilename(job.id);
    const outputPath = getVideoPath(filename);

    console.log(`Rendering to: ${outputPath}`);
    console.log(`Duration: ${composition.durationInFrames} frames @ ${composition.fps} fps`);

    // Render the video
    await renderMedia({
      composition,
      serveUrl: bundleUrl,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
      // Progress callback
      onProgress: ({ progress }) => {
        // Map progress (0-1) to 20-95 range
        const mappedProgress = Math.round(20 + progress * 75);
        updateJobStatus(job.id, { progress: mappedProgress });
      },
      // Optimize for quality/speed balance
      crf: 23,
      // Use a limited concurrency so the render doesn't starve the event
      // loop and drop status-poll connections (override with RENDER_CONCURRENCY)
      concurrency: Math.max(1, Number(process.env.RENDER_CONCURRENCY) || 2),
      // Increase timeout for fetching heavy Pexels video clips and extracting frames
      timeoutInMilliseconds: 120000,
    });

    // Calculate render time
    const renderTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`Render complete for job ${job.id} in ${renderTime}s`);

    // Get video URL (tries R2 first if configured, falls back to local)
    const videoUrl = await getVideoUrlWithR2Fallback(filename, baseUrl);
    
    // Update job with success
    updateJobStatus(job.id, {
      status: "completed",
      progress: 100,
      videoUrl,
      completedAt: new Date(),
      currentStage: job.videoType === "AgenticVideoGenerator" ? "complete" : job.currentStage,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown render error";
    console.error(`Render failed for job ${job.id}:`, errorMessage);

    updateJobStatus(job.id, {
      status: "failed",
      error: errorMessage,
      completedAt: new Date(),
    });
    if (job.videoType === "AgenticVideoGenerator") {
      const existing = loadAgenticCheckpoint(job.id);
      saveAgenticCheckpoint({
        jobId: job.id,
        input: job.pipeline,
        currentStage: (job.currentStage || "planning") as AgenticStage,
        completedStages: existing?.completedStages || [],
        progress: job.progress,
        artifacts: existing?.artifacts || { timeline: job.timeline },
        providerTasks: existing?.providerTasks || {},
        updatedAt: new Date().toISOString(),
        error: errorMessage,
      });
    }
  }
}
