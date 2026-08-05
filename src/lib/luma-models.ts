/**
 * Luma Ray 3.2 capability resolver — takes a single set of user inputs and
 * produces the exact Luma Agents generation payload for any of Ray's modes:
 * text-to-video, image-to-video (start/end/keyframes), loop, extend, video
 * edit, and video reframe. Also covers Uni-1 image create/edit.
 *
 * All request combinations are validated against the Ray 3.2 rules:
 *   - 10s conflicts with hdr / start_frame / end_frame
 *   - loop conflicts with 10s / hdr / end_frame / keyframes
 *   - hdr requires 720p/1080p, no 360p/540p
 *   - keyframes are mutually exclusive with start_frame / end_frame / loop
 *   - video_edit source <= 18s, video_reframe source <= 10s
 */
import { LUMA_VIDEO_MODEL, LUMA_IMAGE_MODEL, LUMA_IMAGE_MODEL_MAX } from "./luma";

export const LUMA_VIDEO_RATIOS = ["9:16", "3:4", "1:1", "4:3", "16:9", "21:9"] as const;
export const LUMA_RESOLUTIONS = ["360p", "540p", "720p", "1080p"] as const;
export const LUMA_DURATIONS = ["5s", "10s"] as const;
export const LUMA_IMAGE_RATIOS = ["3:1", "2:1", "16:9", "3:2", "1:1", "2:3", "9:16", "1:2", "1:3"] as const;
export const LUMA_EDIT_STRENGTHS = [
  "adhere_1", "adhere_2", "adhere_3",
  "flex_1", "flex_2", "flex_3",
  "reimagine_1", "reimagine_2", "reimagine_3",
] as const;
export type LumaEditStrength = (typeof LUMA_EDIT_STRENGTHS)[number];

/** One of the interchangeable media reference shapes Luma accepts. */
export interface LumaMediaRef {
  url?: string;
  data?: string;
  media_type?: string;
  file_id?: string;
  generation_id?: string;
}

export function isLumaMediaRef(value: unknown): value is LumaMediaRef {
  if (!value || typeof value !== "object") return false;
  const ref = value as LumaMediaRef;
  return Boolean(ref.url || ref.data || ref.file_id || ref.generation_id);
}

/** Pick exactly one reference shape; throws on an empty ref. */
export function lumaMediaRef(ref: LumaMediaRef | undefined, label: string): Record<string, string> {
  if (!ref || (!ref.url && !ref.data && !ref.file_id && !ref.generation_id)) {
    throw new Error(`Luma: ${label} is required`);
  }
  const out: Record<string, string> = {};
  if (ref.url) out.url = ref.url;
  if (ref.data) out.data = ref.data;
  if (ref.media_type) out.media_type = ref.media_type;
  if (ref.file_id) out.file_id = ref.file_id;
  if (ref.generation_id) out.generation_id = ref.generation_id;
  return out;
}

/** Resolve a source media ref and reject it if it is empty. */
export function lumaSourceRef(source: LumaMediaRef | undefined): Record<string, string> {
  if (!source || (!source.url && !source.data && !source.file_id && !source.generation_id)) {
    throw new Error("Luma: a source (image or video) is required for this operation");
  }
  return lumaMediaRef(source, "source");
}

export type LumaOperation =
  | "auto"
  | "text_to_video"
  | "image_to_video"
  | "loop"
  | "extend"
  | "edit"
  | "reframe"
  | "image"
  | "image_edit";

export interface LumaGenerationInput {
  /** Free-form prompt, 1-6000 chars. */
  prompt: string;
  /** Which Ray capability to use; defaults to auto-detection from media. */
  operation?: LumaOperation;
  aspectRatio?: string;
  resolution?: string;
  duration?: "5s" | "10s";
  loop?: boolean;
  hdr?: boolean;
  exrExport?: boolean;
  /** Anchor frames for image-to-video (mutually exclusive with keyframes). */
  startFrame?: LumaMediaRef;
  endFrame?: LumaMediaRef;
  /** Multi-keyframe image-to-video (up to 64 anchors). */
  keyframes?: LumaMediaRef[];
  keyframeIndexes?: number[];
  /** Video edit / reframe / image_edit source. */
  source?: LumaMediaRef;
  /** video_edit conditioning. */
  editStrength?: LumaEditStrength;
  autoControls?: boolean;
  /** video_reframe placement of the source in the output canvas. */
  sourcePosition?: { x_norm: number; y_norm: number; w_norm: number; h_norm: number };
  /** Image model for image modes (uni-1 | uni-1-max). */
  imageModel?: string;
  /** Image edit mode extra references. */
  imageRefs?: LumaMediaRef[];
  /** Enable web search grounding on image generation. */
  webSearch?: boolean;
  /** Image output format. */
  outputFormat?: "png" | "jpeg";
}

export interface ResolvedLumaRequest {
  type: string;
  payload: Record<string, unknown>;
}

function resolveVideoDefaults(input: LumaGenerationInput): {
  aspectRatio?: string;
  resolution?: string;
  duration?: "5s" | "10s";
} {
  return {
    aspectRatio: input.aspectRatio || undefined,
    resolution: input.resolution || "720p",
    duration: input.duration || "5s",
  };
}

function buildVideoPayload(input: LumaGenerationInput): Record<string, unknown> {
  const { aspectRatio, resolution, duration } = resolveVideoDefaults(input);
  const payload: Record<string, unknown> = {
    model: LUMA_VIDEO_MODEL,
    type: "video",
    prompt: input.prompt,
  };
  if (aspectRatio) payload.aspect_ratio = aspectRatio;

  const video: Record<string, unknown> = { resolution, duration };
  if (input.loop) video.loop = true;
  if (input.hdr) video.hdr = true;
  if (input.exrExport) video.exr_export = true;
  if (input.startFrame) video.start_frame = lumaMediaRef(input.startFrame, "start_frame");
  if (input.endFrame) video.end_frame = lumaMediaRef(input.endFrame, "end_frame");
  if (input.keyframes) {
    video.keyframes = input.keyframes.map((k) => lumaMediaRef(k, "keyframe"));
    if (input.keyframeIndexes) video.keyframe_indexes = input.keyframeIndexes;
  }
  payload.video = video;
  return payload;
}

/** Validate a resolved video request against Ray 3.2's constraint matrix. */
function validateVideoRequest(
  type: string,
  payload: Record<string, unknown>,
  input: LumaGenerationInput
): void {
  const video = (payload.video || {}) as Record<string, unknown>;
  const duration = video.duration as string | undefined;
  const is10s = duration === "10s";
  const hasHdr = Boolean(video.hdr);
  const hasLoop = Boolean(video.loop);
  const hasStartFrame = Boolean(video.start_frame);
  const hasEndFrame = Boolean(video.end_frame);
  const hasKeyframes = Array.isArray(video.keyframes) && video.keyframes.length > 0;
  const resolution = (video.resolution || "720p") as string;

  if (type === "video") {
    if (is10s && hasHdr) throw new Error("Luma: 10s is not supported with HDR");
    if (is10s && (hasStartFrame || hasEndFrame)) {
      throw new Error("Luma: 10s is not supported with start_frame/end_frame (use multi-keyframes for 10s)");
    }
    if (hasHdr && (resolution === "360p" || resolution === "540p")) {
      throw new Error("Luma: HDR requires 720p or 1080p");
    }
    if (hasLoop && (is10s || hasHdr || hasEndFrame || hasKeyframes)) {
      throw new Error("Luma: loop is not supported with 10s, HDR, end_frame, or keyframes");
    }
    if (hasKeyframes && (hasStartFrame || hasEndFrame)) {
      throw new Error("Luma: keyframes are mutually exclusive with start_frame/end_frame");
    }
    if (hasKeyframes && !Array.isArray(video.keyframe_indexes)) {
      throw new Error("Luma: keyframe_indexes must be provided alongside keyframes");
    }
    if (video.exr_export && !hasHdr) {
      throw new Error("Luma: exr_export requires hdr: true");
    }
  } else if (type === "video_edit") {
    if (input.loop) throw new Error("Luma: loop is create-only, rejected on video_edit");
    if (hasEndFrame) throw new Error("Luma: end_frame is generation-only");
    if (hasHdr && (resolution === "360p" || resolution === "540p")) {
      throw new Error("Luma: HDR requires 720p or 1080p");
    }
    if (video.exr_export && !hasHdr) throw new Error("Luma: exr_export requires hdr: true");
  } else if (type === "video_reframe") {
    if (!payload.aspect_ratio) throw new Error("Luma: reframe requires a target aspect_ratio");
    if (hasHdr || video.exr_export || input.loop || hasEndFrame || hasStartFrame || input.keyframes) {
      throw new Error("Luma: reframe rejects HDR, EXR, loop, and anchor frames");
    }
  }
}

/** Determine which Ray operation to use based on provided media. */
function detectOperation(input: LumaGenerationInput): LumaOperation {
  if (input.operation && input.operation !== "auto") return input.operation;
  if (input.source) return "edit";
  if (input.loop) return "loop";
  if (input.startFrame || input.endFrame || (input.keyframes && input.keyframes.length > 0)) {
    return "image_to_video";
  }
  return "text_to_video";
}

/**
 * Resolve a single generation request. This is the capability dispatcher used
 * by both the single-shot endpoint and the per-scene pipeline.
 */
export function resolveLumaGenerationRequest(input: LumaGenerationInput): ResolvedLumaRequest {
  if (!input.prompt || !input.prompt.trim()) throw new Error("Luma: prompt is required");

  const operation = detectOperation(input);

  if (operation === "image" || operation === "image_edit") {
    return resolveImageRequest(input, operation);
  }

  let type: string;
  let payload: Record<string, unknown>;

  switch (operation) {
    case "text_to_video":
    case "image_to_video":
    case "loop":
    case "extend":
      type = "video";
      payload = buildVideoPayload(input);
      break;
    case "edit":
      type = "video_edit";
      payload = {
        model: LUMA_VIDEO_MODEL,
        type: "video_edit",
        prompt: input.prompt,
        source: lumaSourceRef(input.source),
      };
      {
        const { resolution, duration } = resolveVideoDefaults(input);
        const video: Record<string, unknown> = { resolution, duration };
        if (input.autoControls) video.edit = { auto_controls: true };
        else if (input.editStrength) video.edit = { strength: input.editStrength };
        if (input.keyframes) {
          video.edit = {
            ...(video.edit as Record<string, unknown>),
            keyframes: input.keyframes.map((k) => lumaMediaRef(k, "edit keyframe")),
            keyframe_indexes: input.keyframeIndexes,
          };
        }
        if (input.hdr) video.hdr = true;
        if (input.exrExport) video.exr_export = true;
        payload.video = video;
      }
      break;
    case "reframe":
      type = "video_reframe";
      payload = {
        model: LUMA_VIDEO_MODEL,
        type: "video_reframe",
        prompt: input.prompt,
        aspect_ratio: input.aspectRatio || "16:9",
        source: lumaSourceRef(input.source),
      };
      {
        const { resolution, duration } = resolveVideoDefaults(input);
        const video: Record<string, unknown> = { resolution, duration };
        if (input.sourcePosition) video.source_position = input.sourcePosition;
        payload.video = video;
      }
      break;
    default:
      throw new Error(`Luma: unsupported operation ${operation}`);
  }

  validateVideoRequest(type, payload, input);
  return { type, payload };
}

function resolveImageRequest(
  input: LumaGenerationInput,
  operation: "image" | "image_edit"
): ResolvedLumaRequest {
  const imageModel = input.imageModel || LUMA_IMAGE_MODEL;
  if (imageModel !== LUMA_IMAGE_MODEL && imageModel !== LUMA_IMAGE_MODEL_MAX) {
    throw new Error(`Luma: unsupported image model ${imageModel}`);
  }
  const payload: Record<string, unknown> = {
    model: imageModel,
    type: operation,
    prompt: input.prompt,
  };
  if (operation === "image") {
    if (input.aspectRatio) payload.aspect_ratio = input.aspectRatio;
    if (input.outputFormat) payload.output_format = input.outputFormat;
    if (input.webSearch) payload.web_search = true;
    if (input.imageRefs && input.imageRefs.length > 0) {
      payload.image_ref = input.imageRefs.map((r) => lumaMediaRef(r, "image_ref"));
    }
  } else {
    payload.source = lumaSourceRef(input.source);
    if (input.imageRefs && input.imageRefs.length > 0) {
      payload.image_ref = input.imageRefs.map((r) => lumaMediaRef(r, "image_ref"));
    }
  }
  return { type: operation, payload };
}
