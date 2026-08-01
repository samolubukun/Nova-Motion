import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import * as path from "path";
import { RenderJob, updateJobStatus } from "./queue";
import { getVideoPath, generateVideoFilename, getVideoUrlWithR2Fallback } from "./storage";
import { generateWavespeedVideoTimeline } from "../src/lib/wavespeed-timeline";

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
 * Render a video from a job
 */
export async function renderVideo(job: RenderJob, baseUrl: string): Promise<void> {
  const startTime = Date.now();
  console.log(`Starting render for job ${job.id} (${job.videoType})`);

  try {
    // For TextToVideo pipeline jobs, generate the timeline first (reports 0-20%)
    if (job.videoType === "TextToVideo" && job.pipeline) {
      const { prompt, topic, voice, aspectRatio } = job.pipeline;
      console.log(`[TextToVideo] Generating timeline for job ${job.id}...`);
      job.timeline = await generateWavespeedVideoTimeline(
        prompt,
        topic || prompt,
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

    // Get the bundle URL (cached or create new)
    const bundleUrl = await getBundleUrl();

    // Update progress - bundling complete (never go backwards: TextToVideo
    // pipeline may already have reported up to 20%)
    updateJobStatus(job.id, { progress: Math.max(job.progress, 10) });

    // Prepare input props
    let inputProps: any = {};
    if (job.videoType === "AIVideo" || job.videoType === "StockVideo" || job.videoType === "StockImage" || job.videoType === "TextToVideo") {
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
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown render error";
    console.error(`Render failed for job ${job.id}:`, errorMessage);

    updateJobStatus(job.id, {
      status: "failed",
      error: errorMessage,
      completedAt: new Date(),
    });
  }
}
