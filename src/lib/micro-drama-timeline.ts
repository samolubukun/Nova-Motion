/**
 * MicroDrama pipeline — replicates the Open-AI-Micro-Drama-Generator's
 * idea2video / script2video modes using WaveSpeed as the model provider:
 *
 *   idea ─► story (LLM) ─► characters (LLM) ─► scene scripts (LLM)
 *           └─► per scene: portraits (T2I) → storyboard (LLM) →
 *                         first frames (T2I) → shot clips (I2V)
 *   ──► timeline of video clips (reused by the WavespeedVideo composition)
 *
 * All AI calls go through WaveSpeed:
 *   - LLM (OpenAI-compatible): https://llm.wavespeed.ai/v1
 *   - Images + video:          https://api.wavespeed.ai/api/v3/{model}
 *
 * Falls back to a built-in story ("The Last Signal") so the pipeline always
 * produces output, mirroring the Python project's hard-coded fallbacks.
 */

import { WavespeedClient } from "./wavespeed";
import { getAspectRatioDimensions } from "../../shared/video-schema";
import type { WavespeedTimelineAsset } from "./wavespeed-timeline";

// === Model defaults (overridable via env) ===
export const WAVESPEED_LLM_MODEL = () =>
  process.env.WAVESPEED_LLM_MODEL || "deepseek/deepseek-v4-flash";

export const WAVESPEED_PORTRAIT_MODEL = () =>
  process.env.WAVESPEED_PORTRAIT_MODEL || "bytedance/seedream-v4.5";

export const WAVESPEED_FRAME_MODEL = () =>
  process.env.WAVESPEED_FRAME_MODEL || "bytedance/seedream-v4.5";

export const WAVESPEED_I2V_MODEL = () =>
  process.env.WAVESPEED_I2V_MODEL || "bytedance/seedance-2.0/image-to-video";

const WAVESPEED_LLM_BASE_URL = "https://llm.wavespeed.ai/v1";

interface MicroDramaCharacter {
  idx: number;
  name: string;
  static_features: string;
  dynamic_features: string;
  is_visible: boolean;
}

interface MicroDramaScene {
  title: string;
  script: string;
}

interface MicroDramaShot {
  idx: number;
  visual_desc: string;
  motion_desc: string;
  audio_desc: string;
}

// === Fallbacks (mirror the Python agents) ===
const FALLBACK_STORY = `Title: The Last Signal

A lone engineer named Maya, stationed at a remote arctic research base, intercepts a mysterious transmission.
The signal pulses with an unknown pattern — not noise, but intent. As a blizzard closes in and communication
with the outside world fails, Maya decodes the message piece by piece, racing against time and the elements.
The climax reveals the signal is a beacon left by an earlier expedition — a warning, and a map.
She follows it into the ice and uncovers a buried chamber, its contents changing everything she thought she knew.
`;

const FALLBACK_SCENES: MicroDramaScene[] = [
  {
    title: "The Transmission",
    script:
      "INT. ARCTIC RESEARCH BASE - COMMUNICATIONS ROOM - NIGHT\n" +
      "Maya sits at her console, surrounded by flickering monitors. Snow hammers the windows. " +
      "A burst of static, then a rhythmic pulse fills the speakers. " +
      "MAYA (leaning forward): That's not random noise. She grabs her headset and starts recording.\n" +
      "The pulse repeats — three long, two short. Her fingers fly across the keyboard.",
  },
  {
    title: "Into the Ice",
    script:
      "EXT. ARCTIC TUNDRA - DAWN\n" +
      "The blizzard has passed. Maya trudges through knee-deep snow, GPS in hand, following the decoded coordinates. " +
      "The landscape is vast and white. A faint rectangular outline breaks the snow ahead — " +
      "something buried, geometric. She kneels and brushes the surface. " +
      "MAYA (whispering): It's a door.",
  },
];

const FALLBACK_CHARACTERS: MicroDramaCharacter[] = [
  {
    idx: 0,
    name: "Maya",
    static_features:
      "Woman, early 30s, East Asian descent. Sharp dark eyes, straight black hair pulled back " +
      "in a practical ponytail, high cheekbones, lean and athletic build from years of field work.",
    dynamic_features:
      "Heavy insulated arctic parka in navy blue, thermal base layers, snow goggles pushed up " +
      "on her forehead, worn leather gloves, a satellite communicator clipped to her chest.",
    is_visible: true,
  },
];

const FALLBACK_SHOTS: MicroDramaShot[] = [
  {
    idx: 0,
    visual_desc:
      "Wide establishing shot of a remote arctic research base at night. " +
      "The base is a cluster of illuminated prefab modules half-buried in snow. " +
      "A fierce blizzard swirls around the structure. Warm amber light spills from porthole windows. " +
      "The sky above shows faint aurora borealis through breaks in the storm clouds. " +
      "Camera is positioned low, looking slightly upward at the base.",
    motion_desc:
      "Slow drone pull-back revealing the isolation of the base, snowflakes streaking past the lens.",
    audio_desc: "[Sound Effect] Howling arctic wind, distant electrical hum of generators.",
  },
  {
    idx: 1,
    visual_desc:
      "Medium close-up inside the communications room. Maya sits at a multi-screen console, " +
      "her face lit by cool blue monitor glow. Equipment racks fill the background. " +
      "On screen: waveform visualisers spike rhythmically. Her expression shifts from boredom to sharp focus. " +
      "She reaches for her headset slowly, eyes locked on the screen.",
    motion_desc: "Slow push-in toward Maya's face as she leans forward, shallow depth of field.",
    audio_desc:
      "[Sound Effect] Electronic beeping, rhythmic pulse signal. [Speaker] Maya (hushed): That's not random noise.",
  },
  {
    idx: 2,
    visual_desc:
      "Extreme wide shot of the arctic tundra at dawn after the storm. " +
      "The landscape is vast, flat, blinding white. A tiny figure — Maya — trudges through knee-deep snow " +
      "toward a faint rectangular outline partially buried ahead. " +
      "Long blue shadows stretch across the snow. The sky is pale gold and pink.",
    motion_desc:
      "Aerial wide shot slowly tilting down toward Maya as she approaches the buried structure.",
    audio_desc: "[Sound Effect] Soft wind, crunching snow footsteps, quiet orchestral swell.",
  },
];

// === WaveSpeed LLM (OpenAI-compatible Chat Completions) ===
async function llmCall(payload: Record<string, unknown>): Promise<string> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) {
    throw new Error("WAVESPEED_API_KEY environment variable is not set in your .env.local file.");
  }

  const res = await fetch(`${WAVESPEED_LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`WaveSpeed LLM error: ${res.status} - ${text}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: unknown } }> };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("WaveSpeed LLM returned empty content.");
  }
  return content;
}

async function wavespeedLLM(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.7,
  json = false
): Promise<string> {
  const base: Record<string, unknown> = {
    model: WAVESPEED_LLM_MODEL(),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
  };

  try {
    if (json) {
      return await llmCall({ ...base, response_format: { type: "json_object" } });
    }
    return await llmCall(base);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (json && status && status >= 400 && status < 500) {
      console.warn("[MicroDrama] LLM rejected JSON mode, retrying without response_format.");
      return await llmCall(base);
    }
    throw err;
  }
}

function extractJSON(text: string): string {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return text.trim();
}

async function llmJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  fallback: T
): Promise<T> {
  try {
    const raw = await wavespeedLLM(systemPrompt, userPrompt, 0.7, true);
    return JSON.parse(extractJSON(raw)) as T;
  } catch (err) {
    console.warn("[MicroDrama] LLM JSON call failed, using fallback:", err);
    return fallback;
  }
}

// === Agents ===
async function developStory(idea: string, requirement: string): Promise<string> {
  const systemPrompt =
    "You are a professional screenwriter and story developer. " +
    "Your task is to expand a brief idea into a compelling story outline. " +
    "Include premise, protagonist, conflict, rising action, climax, and resolution. " +
    "Keep it suitable for a short video (1-3 minutes). " +
    "Write in clear prose, focusing on visual storytelling.";

  const prompt = `Develop a story based on this idea:

Idea: ${idea}

Additional requirements: ${requirement || "None"}

Write a detailed story outline that can be translated into a short video. Include:
- Setting and atmosphere
- Main character(s) and their goal
- The conflict or journey
- Emotional arc
- Visual climax moment
- Resolution

Write the story outline as flowing prose.`;

  try {
    const text = await wavespeedLLM(systemPrompt, prompt, 0.7);
    return text.trim();
  } catch (err) {
    console.warn("[MicroDrama] Story development failed, using fallback:", err);
    return FALLBACK_STORY;
  }
}

async function extractCharacters(story: string): Promise<MicroDramaCharacter[]> {
  const systemPrompt =
    "You are a casting director and character designer. " +
    "Your task is to extract all visible characters from a script and provide detailed visual descriptions. " +
    "Focus on characteristics that remain consistent (static) and scene-specific details (dynamic). " +
    "Respond ONLY with valid JSON — no markdown, no explanation, just JSON.";

  const prompt = `Extract all characters from this script and provide visual descriptions for AI image generation.

Script:
${story}

Return a JSON object with this exact structure:
{
  "characters": [
    {
      "idx": 0,
      "name": "Character Name",
      "static_features": "Detailed physical description: age, gender, ethnicity, hair, eyes, build, distinctive features",
      "dynamic_features": "Exact outfit and accessories in this scene",
      "is_visible": true
    }
  ]
}

Rules:
- Only include characters who are visually present (not just mentioned)
- static_features must be detailed enough for consistent portrait generation
- If no appearance is described, invent plausible details`;

  const data = await llmJSON<{ characters?: MicroDramaCharacter[] }>(
    systemPrompt,
    prompt,
    { characters: FALLBACK_CHARACTERS }
  );
  return Array.isArray(data.characters) && data.characters.length > 0
    ? data.characters
    : FALLBACK_CHARACTERS;
}

async function writeSceneScripts(
  story: string,
  requirement: string
): Promise<MicroDramaScene[]> {
  const systemPrompt =
    "You are a professional screenwriter. " +
    "Your task is to break a story outline into individual scene scripts. " +
    "Each scene should be self-contained, visually rich, and suitable for video generation. " +
    "Write 2-4 scenes maximum. " +
    "Respond ONLY with valid JSON — no markdown, no explanation, just JSON.";

  const prompt = `Based on this story outline, write individual scene scripts for a short video.

Story Outline:
${story}

Additional requirements: ${requirement || "None"}

Return a JSON object with this exact structure:
{
  "scenes": [
    {
      "scene_number": 1,
      "title": "Scene title",
      "script": "Full scene script with action lines, dialogue, and scene description."
    }
  ]
}

Rules:
- Create 2-4 scenes that together tell the complete story
- Each scene script should be visually descriptive and filmable
- Include character actions, dialogue, and environmental details`;

  const data = await llmJSON<{ scenes?: Array<{ title?: string; script?: string }> }>(
    systemPrompt,
    prompt,
    { scenes: FALLBACK_SCENES }
  );
  const scenes = Array.isArray(data.scenes)
    ? data.scenes.filter((s) => s && typeof s.script === "string")
    : [];
  if (scenes.length === 0) return FALLBACK_SCENES;
  return scenes.map((s, i) => ({
    title: (s.title || `Scene ${i + 1}`).slice(0, 120),
    script: s.script as string,
  }));
}

async function designStoryboard(
  script: string,
  characters: MicroDramaCharacter[],
  requirement: string
): Promise<MicroDramaShot[]> {
  const systemPrompt =
    "You are a professional storyboard artist and cinematographer. " +
    "Your task is to break a scene script into individual shots suitable for AI video generation. " +
    "Each shot should have a clear visual description, camera movement, and audio description. " +
    "Keep shots between 3-6 seconds each (they will be 5-second video clips). " +
    "Respond ONLY with valid JSON — no markdown, no explanation, just JSON.";

  const characterDescriptions = characters
    .filter((c) => c.is_visible)
    .map((c) => `- ${c.name}: ${c.static_features} Wearing: ${c.dynamic_features}`)
    .join("\n");

  const prompt = `Design a storyboard for this scene script by breaking it into individual shots.

Scene Script:
${script}

Characters in this scene:
${characterDescriptions || "No named characters"}

Style requirement: ${requirement || "Cinematic, professional"}

Return a JSON object with this exact structure:
{
  "shots": [
    {
      "idx": 0,
      "visual_desc": "Detailed visual description of what is seen — location, lighting, characters, composition (100-150 words)",
      "motion_desc": "Camera movement and action for the video prompt (20-50 words)",
      "audio_desc": "Sound design: ambient sounds, music mood, dialogue if any"
    }
  ]
}

Rules:
- Create 3-5 shots per scene
- Start with an establishing shot, include action shots, end with a closing shot`;

  const data = await llmJSON<{ shots?: MicroDramaShot[] }>(systemPrompt, prompt, {
    shots: FALLBACK_SHOTS,
  });
  return Array.isArray(data.shots) && data.shots.length > 0 ? data.shots : FALLBACK_SHOTS;
}

// === Helpers ===
// Seedream v4.5 requires total pixels within 2560x1440 (3,686,400) and
// 8192x8192. All sizes below respect that constraint.
function seedreamSizeForAspectRatio(aspectRatio: string): string {
  switch (aspectRatio) {
    case "21:9":
      return "3024*1296";
    case "4:3":
      return "2688*2016";
    case "3:4":
      return "2016*2688";
    case "1:1":
      return "2048*2048";
    case "9:16":
      return "1440*2560";
    case "16:9":
    default:
      return "2560*1440";
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;

  const worker = async () => {
    while (idx < items.length) {
      const current = idx++;
      results[current] = await fn(items[current], current);
    }
  };

  await Promise.all(new Array(Math.min(limit, items.length)).fill(0).map(() => worker()));
  return results;
}

const absolutize = (url: string, baseUrl: string): string =>
  url.startsWith("/") ? `${baseUrl}${url}` : url;

// === Public pipeline ===
export interface MicroDramaPipelineInput {
  idea: string;
  /** Optional raw scene script — when provided, story development is skipped (script2video mode). */
  script?: string;
  style?: string;
  requirement?: string;
}

export interface MicroDramaPipelineOptions {
  /** Progress callback, 0-1 across the whole pipeline. */
  onProgress?: (progress: number) => void;
  /** Base URL used to absolutize relative asset paths. */
  assetBaseUrl?: string;
  aspectRatio?: string;
  /** Length of each I2V shot clip in seconds (3-10). Defaults to 5. */
  clipDurationSec?: number;
}

/**
 * MicroDrama Pipeline: idea → story → characters → scene scripts → per-scene
 * portraits → storyboard → first frames → I2V clips → timeline.
 *
 * Returns a `WavespeedTimelineAsset` playable by the `WavespeedVideo` / new
 * `MicroDrama` Remotion composition.
 */
export async function generateMicroDramaTimeline(
  input: MicroDramaPipelineInput,
  options: MicroDramaPipelineOptions = {}
): Promise<WavespeedTimelineAsset> {
  const { onProgress, assetBaseUrl } = options;
  const aspectRatio = options.aspectRatio || "16:9";
  const clipDurationSec = Math.min(15, Math.max(4, options.clipDurationSec || 5));
  const style = input.style || "Cinematic";
  const requirement = input.requirement || "";
  const client = new WavespeedClient();

  console.log(
    `[MicroDrama] Starting pipeline for idea [${input.idea}] style [${style}] ratio [${aspectRatio}]`
  );
  onProgress?.(0.02);

  // 1. Story (skipped when a raw script is provided — script2video mode)
  let story: string;
  if (input.script && input.script.trim()) {
    story = input.script.trim();
    console.log("[MicroDrama] Using user-provided script (script2video mode).");
  } else {
    onProgress?.(0.05);
    story = await developStory(input.idea, requirement);
    onProgress?.(0.1);
  }

  // 2. Characters
  const characters = await extractCharacters(story);
  console.log(`[MicroDrama] Extracted ${characters.length} characters.`);
  onProgress?.(0.15);

  // 3. Scene scripts
  let scenes: MicroDramaScene[];
  if (input.script && input.script.trim()) {
    scenes = [{ title: "Scene 1", script: story }];
  } else {
    scenes = await writeSceneScripts(story, requirement);
    console.log(`[MicroDrama] Wrote ${scenes.length} scene scripts.`);
  }
  onProgress?.(0.2);

  if (scenes.length === 0) {
    throw new Error("Screenwriter produced no scene scripts.");
  }

  // 4. For each scene: portraits -> storyboard -> frames -> clips
  const elements: Array<{ videoUrl: string; startMs: number; endMs: number }> = [];
  const text: Array<{ startMs: number; endMs: number; text: string; position: string }> = [];
  const audio: Array<{ startMs: number; endMs: number; audioUrl: string }> = [];
  let globalOffsetMs = 0;
  const portraitSize = "2048*3072"; // 2:3 portrait (6.29M px, within Seedream v4.5 range)
  const frameSize = seedreamSizeForAspectRatio(aspectRatio);
  const clipDurationMs = clipDurationSec * 1000;
  const sceneProgressSpan = 0.75 / scenes.length;
  let anyClip = false;

  for (let sceneIdx = 0; sceneIdx < scenes.length; sceneIdx++) {
    const scene = scenes[sceneIdx];
    const sceneStart = 0.2 + sceneIdx * sceneProgressSpan;
    console.log(`[MicroDrama] Scene ${sceneIdx + 1}/${scenes.length}: ${scene.title}`);

    // 4a. Character portraits (parallel, non-fatal)
    const visibleChars = characters.filter((c) => c.is_visible);
    const portraitUrls: Record<string, string> = {};
    if (visibleChars.length > 0) {
      const portraitResults = await mapWithConcurrency(visibleChars, 2, async (c) => {
        const prompt =
          `Professional portrait photo of ${c.name}. ${c.static_features}. ` +
          `Wearing ${c.dynamic_features}. Style: ${style}. ` +
          "High quality, detailed face, neutral background, studio lighting, character reference sheet, full face visible.";
        try {
          const { resultUrl } = await client.triggerImage(prompt, portraitSize, WAVESPEED_PORTRAIT_MODEL());
          const outputs = await client.pollPrediction(resultUrl);
          return { name: c.name, url: outputs[0] };
        } catch (err) {
          console.warn(`[MicroDrama] Portrait generation failed for ${c.name}: ${err}`);
          return null;
        }
      });
      for (const r of portraitResults) {
        if (r) portraitUrls[r.name] = r.url;
      }
    }
    onProgress?.(sceneStart + 0.08 * sceneProgressSpan);

    // 4b. Storyboard
    const shots = await designStoryboard(
      scene.script,
      characters,
      `${requirement}. Style: ${style}`
    );
    console.log(`[MicroDrama] Storyboarded ${shots.length} shots for scene ${sceneIdx + 1}.`);
    onProgress?.(sceneStart + 0.15 * sceneProgressSpan);

    // 4c. First frames (sequential to keep shot order)
    const frameUrls: Array<string | null> = new Array(shots.length).fill(null);
    for (let i = 0; i < shots.length; i++) {
      const shot = shots[i];
      const mentioned = characters.filter(
        (c) => c.name && shot.visual_desc.toLowerCase().includes(c.name.toLowerCase())
      );
      const charDesc = mentioned.map((c) => `${c.name} (${c.dynamic_features})`).join(", ");
      const fullPrompt =
        `${shot.visual_desc}. ${charDesc}. Style: ${style}. ` +
        `Cinematic composition, ${aspectRatio} aspect ratio, high quality, detailed.`;
      try {
        const { resultUrl } = await client.triggerImage(fullPrompt, frameSize, WAVESPEED_FRAME_MODEL());
        const outputs = await client.pollPrediction(resultUrl);
        frameUrls[i] = outputs[0];
      } catch (err) {
        console.warn(`[MicroDrama] Frame generation failed for shot ${i}: ${err}`);
      }
      onProgress?.(sceneStart + (0.15 + 0.4 * ((i + 1) / Math.max(shots.length, 1))) * sceneProgressSpan);
    }

    // 4d. Shot clips (parallel, non-fatal per shot)
    const shotClips = await mapWithConcurrency(shots, 2, async (shot, i) => {
      const frameUrl = frameUrls[i];
      if (!frameUrl) return null;
      const videoPrompt = `${shot.motion_desc}. ${shot.audio_desc}`;
      try {
        const { resultUrl } = await client.triggerImageToVideo(
          videoPrompt,
          frameUrl,
          clipDurationSec,
          "720p",
          WAVESPEED_I2V_MODEL()
        );
        const outputs = await client.pollPrediction(resultUrl);
        return { videoUrl: outputs[0] };
      } catch (err) {
        console.warn(`[MicroDrama] Clip generation failed for shot ${i}: ${err}`);
        return null;
      }
    });

    // 4e. Append scene clips + native audio to the timeline
    let sceneEndMs = globalOffsetMs;
    for (let i = 0; i < shotClips.length; i++) {
      const clip = shotClips[i];
      if (!clip) continue;
      anyClip = true;
      const startMs = sceneEndMs;
      const endMs = startMs + clipDurationMs;
      elements.push({ videoUrl: clip.videoUrl, startMs, endMs });
      audio.push({ startMs, endMs, audioUrl: clip.videoUrl });
      sceneEndMs = endMs;
    }

    // Scene title overlay
    if (scene.title) {
      text.push({
        startMs: globalOffsetMs,
        endMs: globalOffsetMs + Math.min(2500, clipDurationMs),
        text: scene.title,
        position: "center",
      });
    }

    globalOffsetMs = sceneEndMs;
    onProgress?.(sceneStart + sceneProgressSpan);
  }

  if (!anyClip) {
    throw new Error("All scenes failed to generate any video clips.");
  }

  const { width, height } = getAspectRatioDimensions(aspectRatio);
  const totalDurationMs = Math.max(globalOffsetMs, 1000);

  const timeline: WavespeedTimelineAsset = {
    shortTitle: (input.idea || "Micro Drama").substring(0, 60),
    elements,
    text,
    audio,
    width,
    height,
  };

  if (assetBaseUrl) {
    timeline.elements = timeline.elements.map((el) => ({
      ...el,
      videoUrl: absolutize(el.videoUrl, assetBaseUrl),
    }));
    timeline.audio = timeline.audio.map((a) => ({
      ...a,
      audioUrl: absolutize(a.audioUrl, assetBaseUrl),
    }));
  }

  onProgress?.(1);
  console.log(`[MicroDrama] Timeline ready: ${elements.length} clips over ${totalDurationMs}ms.`);
  return timeline;
}
