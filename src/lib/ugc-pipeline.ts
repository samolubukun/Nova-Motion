/**
 * UGC pipeline — replicates the Open-AI-UGC studio (an Arcads / MakeUGC
 * alternative) using WaveSpeed as the video provider.
 *
 *   script (+ optional reference images) ─► WaveSpeed video model ─► finished mp4
 *
 * - No reference images  → the model's text-to-video endpoint (T2V).
 * - Reference image(s)   → the model's image-to-video endpoint (I2V), using the
 *   first image as the primary reference. `@image1`..`@imageN` tokens in the
 *   script are replaced with the image URLs inline so extra references still
 *   reach models that can consume image URLs from the prompt.
 *
 * The returned video is a WaveSpeed CDN URL; the caller (render server) is
 * responsible for persisting it into the project's storage and returning a
 * stable public URL.
 */

import { WavespeedClient } from "./wavespeed";
import { getUGCModel } from "./ugc-models";

export interface UGCPipelineInput {
  prompt: string;
  images?: string[];
  model?: string;
  aspectRatio?: string;
  duration?: number;
  resolution?: string;
  mode?: string;
}

export interface UGCPipelineOptions {
  /** Progress callback, 0-1 across the whole generation. */
  onProgress?: (progress: number) => void;
}

export interface UGCVideoResult {
  videoUrl: string;
  modelId: string;
  prompt: string;
  usedImages: boolean;
}

/**
 * Replace `@image1`, `@image2`, ... tokens with the matching reference image URL.
 * Unknown indexes are left untouched.
 */
export function buildUGCPrompt(raw: string, images: string[]): string {
  const prompt = raw.replace(/@image(\d+)/g, (match, n: string) => {
    const idx = parseInt(n, 10) - 1;
    if (idx >= 0 && idx < images.length) return images[idx];
    return match;
  });
  return prompt.trim();
}

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 600000;

/**
 * Submit to a model endpoint, retrying with a minimal known-good payload when
 * the model rejects optional params (e.g. `generate_audio` or Grok's `mode`).
 */
async function submitWithFallback(
  client: WavespeedClient,
  endpoint: string,
  payload: Record<string, unknown>
): Promise<{ predictionId: string; resultUrl: string }> {
  try {
    return await client.triggerModel(endpoint, payload);
  } catch (err) {
    if (err instanceof Error && /WaveSpeed API error 4/.test(err.message)) {
      console.warn(`[UGC] Model rejected optional params, retrying with minimal payload: ${err.message}`);
      return await client.triggerModel(endpoint, {
        prompt: payload.prompt,
        aspect_ratio: payload.aspect_ratio,
        duration: payload.duration,
        resolution: payload.resolution,
      });
    }
    throw err;
  }
}

/**
 * UGC Pipeline: script (+ optional reference images) → WaveSpeed video clip.
 */
export async function generateUGCVideo(
  input: UGCPipelineInput,
  options: UGCPipelineOptions = {}
): Promise<UGCVideoResult> {
  const { onProgress } = options;
  const model = getUGCModel(input.model);
  const client = new WavespeedClient();

  const images = (input.images || []).filter(Boolean);
  const aspectRatio = input.aspectRatio || model.defaultAspectRatio;
  const resolution = input.resolution || model.defaultResolution;
  const requestedDuration = input.duration ?? model.defaultDuration;
  const duration = Math.min(model.durationMax, Math.max(model.durationMin, requestedDuration));

  const prompt = buildUGCPrompt(input.prompt, images);

  console.log(
    `[UGC] Starting generation: model=${model.id} ` +
      `mode=${images.length > 0 ? "image-to-video" : "text-to-video"} ` +
      `ratio=${aspectRatio} duration=${duration}s resolution=${resolution}`
  );
  onProgress?.(0.05);

  const payload: Record<string, unknown> = {
    prompt,
    aspect_ratio: aspectRatio,
    duration,
    resolution,
    generate_audio: true,
  };
  if (model.modes && input.mode) {
    payload.mode = input.mode;
  }

  const endpoint = images.length > 0 ? model.i2vEndpoint : model.t2vEndpoint;
  if (images.length > 0) {
    payload.image = images[0];
  }

  onProgress?.(0.1);
  const { resultUrl } = await submitWithFallback(client, endpoint, payload);

  // Report progress while polling: creep from 10% toward 85% over ~5 minutes.
  const startedAt = Date.now();
  const progressTimer = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    const frac = Math.min(1, elapsed / POLL_TIMEOUT_MS);
    onProgress?.(0.1 + frac * 0.75);
  }, POLL_INTERVAL_MS);

  let outputs: string[];
  try {
    outputs = await client.pollPrediction(resultUrl, POLL_INTERVAL_MS, POLL_TIMEOUT_MS);
  } finally {
    clearInterval(progressTimer);
  }

  const videoUrl = outputs[0];
  onProgress?.(0.95);
  console.log(`[UGC] Video ready for ${model.id}: ${videoUrl}`);

  return {
    videoUrl,
    modelId: model.id,
    prompt,
    usedImages: images.length > 0,
  };
}
