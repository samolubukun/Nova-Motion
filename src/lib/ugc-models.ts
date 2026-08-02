/**
 * UGC mode model registry — replicates the Open-AI-UGC studio's model picker
 * (Veo 3.1, Seedance 2, Grok Video, Happy Horse 1) but served through the
 * single WaveSpeed API key already configured in this project.
 *
 * Model IDs match WaveSpeed's `POST https://api.wavespeed.ai/api/v3/{model_id}`
 * contract. Each model has a text-to-video endpoint and an image-to-video
 * endpoint. Pure data — safe to import from client components.
 */

export interface UGCModel {
  id: string;
  label: string;
  provider: string;
  description: string;
  /** Full WaveSpeed model id used when no reference images are supplied. */
  t2vEndpoint: string;
  /** Full WaveSpeed model id used when reference image(s) are supplied. */
  i2vEndpoint: string;
  /** WaveSpeed model id used for multi-image reference-to-video (when available). */
  refEndpoint?: string;
  aspectRatios: string[];
  defaultAspectRatio: string;
  durationMin: number;
  durationMax: number;
  defaultDuration: number;
  resolutions: string[];
  defaultResolution: string;
  /** Optional "mode" presets (e.g. Grok's fun/normal/spicy). */
  modes?: string[];
  defaultMode?: string;
  notes?: string;
}

export const UGC_MODELS: UGCModel[] = [
  {
    id: "veo-3-1",
    label: "Veo 3.1",
    provider: "Google",
    description:
      "High-fidelity photorealistic motion with synchronized native audio at 1080p. Best for premium client ads.",
    t2vEndpoint: "google/veo3.1/text-to-video",
    i2vEndpoint: "google/veo3.1/image-to-video",
    refEndpoint: "google/veo3.1/reference-to-video",
    aspectRatios: ["16:9", "9:16"],
    defaultAspectRatio: "16:9",
    durationMin: 8,
    durationMax: 8,
    defaultDuration: 8,
    resolutions: ["720p", "1080p"],
    defaultResolution: "720p",
  },
  {
    id: "seedance-2",
    label: "Seedance 2",
    provider: "ByteDance",
    description:
      "Cinematic multi-shot storytelling, camera control and character consistency with native audio. Great value.",
    t2vEndpoint: "bytedance/seedance-2.0/text-to-video",
    i2vEndpoint: "bytedance/seedance-2.0/image-to-video",
    aspectRatios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
    defaultAspectRatio: "16:9",
    durationMin: 4,
    durationMax: 15,
    defaultDuration: 5,
    resolutions: ["480p", "720p"],
    defaultResolution: "480p",
  },
  {
    id: "grok-video",
    label: "Grok Video",
    provider: "xAI",
    description:
      "Fast, lifelike image-to-video with synchronized audio. Strong for high-CTR hooks. Modes: fun / normal / spicy.",
    t2vEndpoint: "x-ai/grok-imagine-video/text-to-video",
    i2vEndpoint: "x-ai/grok-imagine-video/image-to-video",
    refEndpoint: "x-ai/grok-imagine-video/reference-to-video",
    aspectRatios: ["9:16", "16:9", "2:3", "3:2", "1:1"],
    defaultAspectRatio: "9:16",
    durationMin: 6,
    durationMax: 15,
    defaultDuration: 6,
    resolutions: ["480p", "720p"],
    defaultResolution: "480p",
    modes: ["fun", "normal", "spicy"],
    defaultMode: "normal",
  },
  {
    id: "happy-horse",
    label: "Happy Horse 1",
    provider: "Alibaba",
    description:
      "Cinematic 720p/1080p video with smooth camera movement and strong prompt fidelity. Great for batch iteration.",
    t2vEndpoint: "alibaba/happyhorse-1.0/text-to-video",
    i2vEndpoint: "alibaba/happyhorse-1.0/image-to-video",
    refEndpoint: "alibaba/happyhorse-1.0/reference-to-video",
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    defaultAspectRatio: "16:9",
    durationMin: 3,
    durationMax: 15,
    defaultDuration: 5,
    resolutions: ["720p", "1080p"],
    defaultResolution: "720p",
  },
];

/**
 * Default model used when the API request omits `model`.
 */
export function getDefaultUGCModelId(): string {
  return process.env.UGC_DEFAULT_MODEL || "seedance-2";
}

/**
 * Resolve a model by id (falls back to the default model).
 */
export function getUGCModel(modelId?: string): UGCModel {
  const id = modelId || getDefaultUGCModelId();
  return UGC_MODELS.find((m) => m.id === id) || UGC_MODELS[1] || UGC_MODELS[0];
}
