/**
 * WaveSpeed API client — AI text-to-video (Seedance) and music (Lyria) generation.
 * Ported from the Text-To-Video-AI project's `utility/wavespeed_client.py`.
 *
 * The video model is read from `WAVESPEED_VIDEO_MODEL` and defaults to
 * `bytedance/seedance-v1-pro-fast/text-to-video` ($0.06/run — the cheapest
 * Seedance variant on WaveSpeed, still decent quality).
 */

export const WAVESPEED_VIDEO_MODEL = () =>
  process.env.WAVESPEED_VIDEO_MODEL || "bytedance/seedance-v1-pro-fast/text-to-video";

export const WAVESPEED_BASE_URL = "https://api.wavespeed.ai";

interface WavespeedTask {
  id?: string;
  urls?: { get?: string };
  status?: string;
  outputs?: string[];
  error?: string;
}

type WavespeedResponse = WavespeedTask & { data?: WavespeedTask };

export class WavespeedClient {
  private apiKey: string;
  private headers: Record<string, string>;

  constructor() {
    const apiKey = process.env.WAVESPEED_API_KEY;
    if (!apiKey) {
      throw new Error(
        "WAVESPEED_API_KEY environment variable is not set in your .env.local file."
      );
    }
    this.apiKey = apiKey;
    this.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
  }

  private async requestJson(
    url: string,
    data?: unknown
  ): Promise<WavespeedResponse> {
    const response = await fetch(url, {
      method: data ? "POST" : "GET",
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`WaveSpeed API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<WavespeedResponse>;
  }

  /**
   * Submit a generation job and return the prediction id plus its result URL.
   */
  private async submit(
    endpoint: string,
    payload: Record<string, unknown>
  ): Promise<{ predictionId: string; resultUrl: string }> {
    const body = await this.requestJson(`${WAVESPEED_BASE_URL}${endpoint}`, payload);
    const task = body.data || body;
    const predictionId = task.id;
    if (!predictionId) {
      throw new Error(
        `WaveSpeed submission response did not contain a prediction id: ${JSON.stringify(body)}`
      );
    }
    const resultUrl =
      task.urls?.get ||
      `${WAVESPEED_BASE_URL}/api/v3/predictions/${predictionId}/result`;
    return { predictionId, resultUrl };
  }

  /**
   * Trigger a text-to-video generation (defaults to Seedance v1 Pro Fast).
   * Payload matches the WaveSpeed docs example for this model.
   * Duration is clamped to the model's supported 3-10s range.
   */
  async triggerVideo(prompt: string, aspectRatio = "16:9", durationSec = 5) {
    const model = WAVESPEED_VIDEO_MODEL();
    const resolution = process.env.WAVESPEED_VIDEO_RESOLUTION || "480p";
    const duration = Math.min(10, Math.max(3, durationSec));
    console.log(
      `[WaveSpeed] Requesting ${model} video: prompt='${prompt}', aspect_ratio='${aspectRatio}', resolution='${resolution}', duration=${duration}s`
    );
    return this.submit(`/api/v3/${model}`, {
      prompt,
      aspect_ratio: aspectRatio,
      resolution,
      duration,
    });
  }

  /**
   * Trigger WaveSpeed Lyria background music generation.
   */
  async triggerMusic(prompt: string) {
    console.log(`[WaveSpeed] Requesting Lyria music: prompt='${prompt}'`);
    return this.submit("/api/v3/google/lyria-3-clip/music", { prompt });
  }

  /**
   * Poll a prediction result URL until the job completes or fails.
   * Returns the output media URLs.
   */
  async pollPrediction(
    resultUrl: string,
    intervalMs = 5000,
    timeoutMs = 600000
  ): Promise<string[]> {
    const startTime = Date.now();
    console.log(`[WaveSpeed] Polling prediction result at ${resultUrl}...`);

    while (Date.now() - startTime < timeoutMs) {
      const body = await this.requestJson(resultUrl);
      const result = body.data || body;
      const status = result.status;

      if (status === "completed") {
        const outputs = result.outputs || [];
        if (!outputs.length) {
          throw new Error(
            `WaveSpeed prediction completed but returned no outputs: ${JSON.stringify(result)}`
          );
        }
        return outputs;
      } else if (status === "failed" || status === "cancelled" || status === "timeout") {
        throw new Error(
          `WaveSpeed prediction failed: ${result.error || "Unknown prediction error"} (status: ${status})`
        );
      } else if (status !== "created" && status !== "processing") {
        throw new Error(`Unexpected WaveSpeed status: ${status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`WaveSpeed prediction timed out after ${timeoutMs / 1000} seconds.`);
  }
}
