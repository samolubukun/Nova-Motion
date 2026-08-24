/**
 * StickmanExplainer mode prompt library — ported from the reference
 * Stickman-Studio project (stickman_studio/phases/{phase1_script,
 * phase2_images,phase3_video}.py) and re-hosted on the WaveSpeed stack:
 *
 *   topic ─► LLM storyboard (hook scene + punchy narration per scene)
 *           └─► ONE stickman character reference (Seedream T2I)
 *           └─► per scene: reference-locked scene image (Seedream edit)
 *                           └─► Ken Burns zoom in Remotion (free) OR one Wan
 *                               I2V clip per scene ("animated" mode)
 *           └─► narrator TTS + lower-third captions
 *
 * The signature trick ported from Stickman Studio is the single canonical
 * character reference attached to every scene generation, so the same
 * stickman appears consistently across the whole explainer.
 */

/** Canonical stickman identity appended to every character prompt. */
export const STICKMAN_CHARACTER_CORE =
  "minimalist stickman figure with a simple round head, thin black line body and limbs, no color, no shading, no clothing details";

export const STICKMAN_STYLE_BLOCK =
  "clean black line art on a plain white background, simple flat vector style, lots of negative space, no shading, no gradients, no color";

export const STICKMAN_NEGATIVE_PROMPT =
  "color, photorealistic, 3d render, shadows, gradients, text, watermark, clutter, realistic human, detailed illustration, extra limbs, deformed hands, blurry, low resolution";

/** Default Lyria music direction when the story plan omits one. */
export const DEFAULT_STICKMAN_MUSIC =
  "light playful ukulele and pizzicato strings with a curious upbeat tempo, instrumental";

// === Story plan interfaces (the LLM contract) ===
export interface StickmanScenePlan {
  index: number;
  /** Short punchy scene label, e.g. "The Vacuum Problem" */
  title: string;
  /** Action + environment ONLY (character identity is managed globally) */
  action: string;
  /** Exact spoken narration for this scene (1-3 short sentences) */
  narration: string;
}

export interface StickmanStoryPlan {
  title: string;
  /** Canonical stickman description for the reference sheet */
  character_prompt: string;
  music: string;
  scenes: StickmanScenePlan[];
}

/**
 * Character reference prompt (phase2_images._make_reference): full body,
 * centered, T-pose-like neutral stance on plain white so it crops cleanly
 * into every downstream subject-reference call.
 */
export function buildStickmanCharRefPrompt(characterPrompt: string): string {
  return [
    `${characterPrompt}.`,
    `Full body, centered, T-pose-like neutral stance`,
    `Minimalist stickman, clean black line art on plain white background,`,
    `simple, no color, vector style, lots of negative space.`,
    `Avoid: ${STICKMAN_NEGATIVE_PROMPT}.`,
  ].join(" ");
}

/**
 * Scene image prompt (phase2_images._generate_scene_with_reference): ACTION +
 * CONSTRAINTS structure used with the character reference attached.
 */
export function buildStickmanScenePrompt(scene: StickmanScenePlan): string {
  return [
    `ACTION: The stickman figure ${scene.action}.`,
    `CONSTRAINTS: clean black line art, simple, no color, plain white background,`,
    `vector style, lots of negative space, no shading, no gradients.`,
    `Keep the stickman design identical to the attached reference.`,
    `Avoid: ${STICKMAN_NEGATIVE_PROMPT}.`,
  ].join(" ");
}

/**
 * Motion prompt for the animated path (Wan I2V from the still): describe the
 * scene's action playing out while keeping the flat white world intact.
 */
export function buildStickmanMotionPrompt(scene: StickmanScenePlan): string {
  return [
    `Animate this exact illustration: the stickman ${scene.action}`,
    `with smooth exaggerated cartoon motion, subtle slow camera push-in.`,
    `Preserve the clean white background, thin black line art style and the character's exact design throughout.`,
    `No flicker, no warping, no style change.`,
  ].join(" ");
}

/**
 * System prompt for the storyboard LLM (phase1_script._SYSTEM_INSTRUCTION):
 * viral educational-Shorts rules — hook first, punchy pacing, visual comedy —
 * plus the strict JSON contract.
 */
export function buildStickmanSystemPrompt(
  targetDurationSeconds: number,
  language = "English",
  tone = "curious and energetic",
  sceneCount?: number
): string {
  const scenes = Math.min(10, Math.max(2, sceneCount || Math.round(targetDurationSeconds / 8)));
  return [
    `You are the Storyboard Architect for 'Stickman Studio', specializing in viral educational Shorts.`,
    `Transform the user's topic into a highly engaging, fast-paced ~${targetDurationSeconds}-second JSON storyboard in ${language} with a ${tone} tone. Exactly ${scenes} scenes.`,
    `VIRAL RULES: (1) THE HOOK — scene 1 must open with a shocking fact, weird question or extreme visual scenario; never "Today we will learn about...". (2) PACING — narration sentences are short, punchy and conversational; high energy throughout. (3) VISUAL COMEDY — use the stickman for exaggerated physical situations (squished by a giant object, floating into space, running in panic); keep actions highly dynamic.`,
    `SCENES: each has "title" (2-6 words), "action" (visually concrete stickman action + environment only, 15-35 words — NEVER describe the character's identity, that is global), and "narration" (exact spoken words, 1-3 short sentences). The full narration across scenes must total roughly ${Math.max(60, Math.round(targetDurationSeconds * 2.6))} words.`,
    `CHARACTER: set "character_prompt" to a one-sentence canonical description of the stickman hero for this video (e.g. "a curious young stickman explorer with a signature backpack"). Keep it minimal.`,
    `MUSIC: set "music" to a short background-music description matching the topic.`,
    `Return ONLY JSON: { "title": string (short catchy title), "character_prompt": string, "music": string, "scenes": [ { "title": string, "action": string, "narration": string } ] }.`,
  ].join(" ");
}
