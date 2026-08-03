/** WaveSpeed models verified against the live model documentation. */
export const AGENTIC_VIDEO_MODELS = {
  seedanceStandard: {
    id: "seedance-2-standard",
    label: "Seedance 2.0",
    t2v: "bytedance/seedance-2.0/text-to-video",
    i2v: "bytedance/seedance-2.0/image-to-video",
    ratios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
    resolutions: ["720p", "480p", "1080p", "4k"],
    minDuration: 4,
    maxDuration: 15,
  },
  seedanceFast: {
    id: "seedance-2-fast",
    label: "Seedance 2.0 Fast",
    t2v: "bytedance/seedance-2.0-fast/text-to-video",
    i2v: "bytedance/seedance-2.0-fast/image-to-video",
    ratios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
    resolutions: ["720p", "480p", "1080p", "4k"],
    minDuration: 4,
    maxDuration: 15,
  },
  veoFastReference: {
    id: "veo-3.1-fast-reference",
    label: "Veo 3.1 Fast Reference",
    reference: "google/veo3.1-fast/reference-to-video",
    ratios: ["16:9", "9:16"],
    resolutions: ["720p", "1080p"],
    minDuration: 8,
    maxDuration: 8,
    maxReferences: 3,
  },
  minimaxImage: {
    id: "minimax-h3-image",
    label: "MiniMax H3 Image-to-Video",
    i2v: "minimax/h3/image-to-video",
    ratios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
    resolutions: ["2k"],
    minDuration: 5,
    maxDuration: 15,
  },
  minimaxReference: {
    id: "minimax-h3-reference",
    label: "MiniMax H3 Reference-to-Video",
    reference: "minimax/h3/reference-to-video",
    ratios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
    resolutions: ["2k"],
    minDuration: 5,
    maxDuration: 15,
    maxReferences: 9,
  },
} as const;

export type AgenticVideoModelId = keyof typeof AGENTIC_VIDEO_MODELS;

export const AGENTIC_IMAGE_MODEL = "bytedance/seedream-v5.0-pro";
export const AGENTIC_IMAGE_EDIT_MODEL = "bytedance/seedream-v5.0-pro/edit";
export const AGENTIC_LIPSYNC_MODEL = "wavespeed-ai/infinitetalk";
export const AGENTIC_LLM_MODEL = "deepseek/deepseek-v4-flash";

export function getAgenticVideoModel(id?: string) {
  const modelId = (id || "seedanceStandard") as AgenticVideoModelId;
  const model = AGENTIC_VIDEO_MODELS[modelId];
  if (!model) throw new Error(`Unsupported AgenticVideoGenerator model: ${id}`);
  return model;
}

export interface AgenticVideoPayloadInput {
  modelId?: string;
  prompt: string;
  keyframeUrl: string;
  referenceImages?: string[];
  aspectRatio: string;
  resolution?: string;
  duration: number;
  generateAudio?: boolean;
}

export function buildAgenticVideoRequest(input: AgenticVideoPayloadInput): {
  endpoint: string;
  payload: Record<string, unknown>;
  duration: number;
} {
  const model = getAgenticVideoModel(input.modelId);
  if (!model.ratios.includes(input.aspectRatio as never)) {
    throw new Error(`${model.label} does not support aspect ratio ${input.aspectRatio}`);
  }
  const resolution = input.resolution || model.resolutions[0];
  if (!model.resolutions.includes(resolution as never)) {
    throw new Error(`${model.label} does not support resolution ${resolution}`);
  }
  const duration = Math.min(model.maxDuration, Math.max(model.minDuration, Math.round(input.duration)));

  if (model.id === "veo-3.1-fast-reference") {
    const images = [input.keyframeUrl, ...(input.referenceImages || [])].slice(0, model.maxReferences);
    if (images.length === 0) throw new Error(`${model.label} requires reference images`);
    return {
      endpoint: model.reference,
      duration: 8,
      payload: {
        prompt: input.prompt,
        images,
        aspect_ratio: input.aspectRatio,
        resolution,
        generate_audio: input.generateAudio ?? false,
        seed: -1,
      },
    };
  }

  if (model.id === "minimax-h3-reference") {
    const referenceImages = [input.keyframeUrl, ...(input.referenceImages || [])].slice(0, model.maxReferences);
    return {
      endpoint: model.reference,
      duration,
      payload: {
        prompt: input.prompt,
        reference_images: referenceImages,
        aspect_ratio: input.aspectRatio,
        resolution: "2k",
        duration,
      },
    };
  }

  if (model.id === "minimax-h3-image") {
    return {
      endpoint: model.i2v,
      duration,
      payload: { image: input.keyframeUrl, prompt: input.prompt, resolution: "2k", duration },
    };
  }

  return {
    endpoint: model.i2v,
    duration,
    payload: {
      prompt: input.prompt,
      image: input.keyframeUrl,
      aspect_ratio: input.aspectRatio,
      resolution,
      duration,
      enable_web_search: false,
      generate_audio: input.generateAudio ?? false,
    },
  };
}
