/**
 * ZackD mode prompt library — the "look layer" for Zack D Films-style 3D
 * curiosity shorts, ported from the reference zackd-director skill:
 *   - references/prompt-guide.md      (5-part 3D image formula + keyword roster)
 *   - references/beat-layer.md        (curiosity-loop narrative + shot cadence)
 *   - references/character-sheets.md  (orthographic turnaround consistency)
 *
 * Pipeline DNA: curiosity-loop script → character turnaround sheets (Seedream)
 * → keyframes anchored on sheet descriptions → I2V motion clips (Veo/Seedance).
 */

// === Signature style block (prefixes every image prompt) ===
export const ZACK_D_STYLE_BLOCK =
  "Stylized 3D render in the Zack D Films visual aesthetic, smooth glossy plasticine clay material with subtle subsurface scattering, crisp ambient occlusion";

// Keyword roster from prompt-guide.md §3 — sprinkled into every scene prompt.
export const ZACK_D_KEYWORDS = {
  style: "3d stylized animation, digital 3d sculpture, octane render aesthetic",
  shader:
    "glossy plasticine texture, clean polymer clay shader, smooth polished surface, semi-translucent organ tissue",
  lighting:
    "volumetric studio lighting, vibrant rim light, high contrast specularity, soft ambient occlusion, dramatic key light",
  camera:
    "macro cross-section cutaway view, extreme close-up 85mm lens, shallow depth of field, cinematic focus",
};

// Negative prompt blacklist from prompt-guide.md §4.
export const ZACK_D_NEGATIVE_PROMPT =
  "photorealistic human skin, realistic face photography, 2D illustration, flat vector art, sketch, anime, low resolution, grainy texture, blurry details";

// === Shot vocabulary (beat-layer.md) ===
export const ZACK_D_SHOT_TYPES = ["wide", "macro", "macro_cross_section", "detail"] as const;
export type ZackDShotType = (typeof ZACK_D_SHOT_TYPES)[number];

export const ZACK_D_CAMERA_MOVES = [
  "push_in",
  "pull_out",
  "pan_right",
  "pan_left",
  "tilt_up",
  "tilt_down",
  "static",
] as const;

/** Camera-move variance rotation across consecutive beats (beat-layer.md §2). */
const CAMERA_ROTATION: string[][] = [
  ["push_in", "tilt_down"],
  ["pan_right", "pan_left"],
  ["tilt_up", "push_in"],
  ["static", "pull_out"],
];

// === Beat map interfaces (the LLM contract) ===
export interface ZackDCharacterSheet {
  /** snake_case slug, e.g. "boy_turnaround" or "gut_cross_section_turnaround" */
  name: string;
  /** What recurring element this is, e.g. "curious young boy in a blue t-shirt" */
  description: string;
  /** "character" uses the turnaround template; "asset" uses the anatomical one */
  kind: "character" | "asset";
}

export interface ZackDShot {
  type: ZackDShotType | string;
  scene_description: string;
  camera_move: string;
  zoom_impact: boolean;
  /** Sheet names this shot must stay consistent with (exact character_sheets names). */
  character_refs?: string[];
}

export interface ZackDBeat {
  narration: string;
  hook?: boolean;
  shots: ZackDShot[];
}

export interface ZackDBeatMap {
  title: string;
  music: string;
  character_sheets: ZackDCharacterSheet[];
  beats: ZackDBeat[];
}

/**
 * Turnaround-sheet image prompt (character-sheets.md templates):
 * characters get front/side/¾ orthographic views; organs/assets get a
 * cross-section cutaway view instead.
 */
export function buildZackDSheetPrompt(sheet: ZackDCharacterSheet): string {
  if (sheet.kind === "asset") {
    return [
      `3D medical model turnaround sheet, front view and cross-section cutaway view of ${sheet.description}`,
      "semi-translucent glossy tissue, bright interior lighting, clean light grey background, high contrast specular highlights",
      `${ZACK_D_STYLE_BLOCK}, ${ZACK_D_KEYWORDS.style}, octane render, zero shadows.`,
    ].join(", ");
  }
  return [
    `Orthographic 3D character turnaround sheet, front view, side profile view, and 3/4 angle view of ${sheet.description}`,
    "stylized 3D digital art style, smooth plasticine shader",
    `clean light grey background, octane render, studio lighting, zero shadows`,
    `${ZACK_D_STYLE_BLOCK}, ${ZACK_D_KEYWORDS.style}.`,
  ].join(", ");
}

/**
 * Keyframe image prompt for one shot, following the mandatory 5-part template
 * (prompt-guide.md §2):
 * [SUBJECT & ACTION] + [CHARACTER / ASSET ANCHOR] + [3D ART STYLE & MATERIAL]
 * + [LIGHTING & CAMERA] + [BACKGROUND & ATMOSPHERE]
 */
export function buildZackDKeyframePrompt(
  shot: ZackDShot,
  anchors: ZackDCharacterSheet[]
): string {
  const anchorBlock = anchors.length
    ? `Rendered using character sheet refs: ${anchors
        .map((a) => `${a.name} (${a.description} — exact same hair, face, outfit, colors)`)
        .join("; ")}.`
    : "";
  const isCutaway = String(shot.type).includes("cross_section") || String(shot.type).includes("macro");
  const camera = isCutaway
    ? `Macro 85mm lens ${shot.camera_move.replace("_", " ")}, shallow depth of field, crisp focus on the internal anatomy`
    : `Cinematic medium lens ${shot.camera_move.replace("_", " ")}, cinematic depth of field`;

  return [
    `[SUBJECT & ACTION] ${shot.scene_description}.`,
    `[CHARACTER ANCHOR] ${anchorBlock}`,
    `[STYLE] ${ZACK_D_STYLE_BLOCK}, ${ZACK_D_KEYWORDS.shader}${isCutaway ? ", detailed cross-section cutaway view" : ""}.`,
    `[LIGHTING & CAMERA] ${camera}, ${ZACK_D_KEYWORDS.lighting}.`,
    `[BACKGROUND] Dark clean studio background, subtle ambient particles${isCutaway ? " in visceral fluid" : ""}. Avoid: ${ZACK_D_NEGATIVE_PROMPT}.`,
  ].join("\n");
}

/**
 * Motion prompt used to animate a finished keyframe via I2V. Mirrors the
 * skill's clips.py ("Smooth 3D motion, <scene>" + camera movement directive).
 */
export function buildZackDMotionPrompt(shot: ZackDShot): string {
  return [
    `Smooth stylized 3D motion: ${shot.scene_description}.`,
    `Camera movement ${shot.camera_move}.`,
    "Preserve the exact character design, clay plasticine materials and lighting. No text, no captions, no morphing.",
  ].join(" ");
}

/** Default Lyria music direction when the beat map omits one. */
export const DEFAULT_ZACK_D_MUSIC =
  "tense cinematic underscore with deep bass pulses and soft ticking percussion, instrumental";

/**
 * System prompt for the curiosity-loop beat-map LLM. Encodes beat-layer.md:
 * every line opens a question the brain needs closed, hook ≤3s, 2-4s shots,
 * two shots per beat (A wide establishing, B macro/cross-section cutaway),
 * alternating camera moves, zoom_impact on the B shots.
 */
export function buildZackDSystemPrompt(
  targetDurationSeconds: number,
  language = "English",
  tone = "energetic",
  beatCount?: number
): string {
  const beats = Math.min(8, Math.max(2, beatCount || Math.round(targetDurationSeconds / 6)));
  return [
    `You are a Zack D Films-style short-form video director and 3D animation prompt engineer.`,
    `Write a curiosity-loop beat map in JSON for a ~${targetDurationSeconds}-second vertical short about the user's topic.`,
    `Use ${language} with a ${tone} tone. Exactly ${beats} beats.`,
    `CURIOUSITY LOOP RULES: The first beat is the HOOK (opens the loop in under 3 seconds, ideally with a myth or scary "what if"). Every beat must OPEN a new question before the previous one closes; only the final beat resolves the loop with a punchline.`,
    `SHOT RULES: Each beat has EXACTLY 2 shots: shot A is a "wide" establishing view of the action, shot B is a "macro_cross_section", "macro" or "detail" cutaway that dives inside. Each shot runs 2-4 seconds.`,
    `CAMERA RULES: alternate camera_move across beats using this rotation: ${CAMERA_ROATION_HINT()}. Mark zoom_impact=true ONLY on the B shots.`,
    `CHARACTER SHEETS: List every recurring character, organ or object as a character_sheets entry (snake_case name, vivid physical description incl. clothing/colors, kind: "character" for people/creatures, "asset" for organs/objects).`,
    `SCENE DESCRIPTIONS: visually concrete 3D directions (20-40 words) describing subject, action and materials — never mention cameras, lenses or "3D render" (those are added automatically). Every shot sets "character_refs" to the exact character_sheets names appearing in it.`,
    `Return ONLY JSON: { "title": string (short catchy title), "music": string (background-music description), "character_sheets": [ { "name": string, "description": string, "kind": "character"|"asset" } ], "beats": [ { "narration": string (exact spoken words, 1-2 short punchy sentences), "hook": boolean (true only on beat 1), "shots": [ { "type": "wide"|"macro"|"macro_cross_section"|"detail", "scene_description": string, "camera_move": string, "zoom_impact": boolean, "character_refs": [string] } ] } ] }.`,
  ].join(" ");
}

function CAMERA_ROATION_HINT(): string {
  return CAMERA_ROTATION.map((pair, i) => `beat ${i + 1}: A=${pair[0]}, B=${pair[1]}`).join("; ");
}
