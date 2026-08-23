/**
 * ComicDrama mode prompt library — ported from the reference AIComicBuilder
 * project (src/lib/ai/prompts/{character-image,frame-generate,shot-split,
 * video-generate}.ts) and re-hosted on the WaveSpeed stack:
 *
 *   script ─► LLM story plan (characters + shot list w/ first/last frames)
 *              └─► 4-view character sheets (Seedream, name printed on sheet)
 *              └─► per shot: FIRST keyframe + LAST keyframe (Seedream)
 *                              └─► start/end-frame interpolated clip (Wan)
 *              └─► dialogue TTS + comic subtitle strip
 *
 * The signature trick is the FIRST/LAST keyframe pair: shot N's last frame
 * continues into shot N+1's first frame, giving storyboard-grade continuity.
 */

// === Style presets (AIComicBuilder's style-adaptive blocks) ===
export interface ComicStylePreset {
  label: string;
  imageStyleBlock: string;
}

export const COMIC_STYLE_PRESETS: Record<string, ComicStylePreset> = {
  anime: {
    label: "Anime",
    imageStyleBlock:
      "modern anime illustration style, clean cel shading, expressive large eyes, vibrant saturated colors, crisp linework, studio-quality key animation art",
  },
  manga: {
    label: "Manga",
    imageStyleBlock:
      "black-and-white manga panel style, bold ink linework, screentone shading, dramatic hatching, high contrast monochrome",
  },
  comic_book: {
    label: "Comic Book",
    imageStyleBlock:
      "western comic book style, bold outlines, halftone dot shading, dynamic action poses, saturated flat colors, graphic novel ink work",
  },
  "3d_pixar": {
    label: "3D Animated",
    imageStyleBlock:
      "stylized 3D animated feature film style, soft rounded character design, subsurface scattering skin, cinematic global illumination, Pixar-like rendering",
  },
  realistic_cinematic: {
    label: "Realistic Cinematic",
    imageStyleBlock:
      "photorealistic cinematic style, film grain, anamorphic lens rendering, natural skin texture, moody color grading",
  },
};

export const COMIC_NEGATIVE_PROMPT =
  "text overlays, watermarks, speech bubbles with gibberish letters, extra fingers, deformed hands, inconsistent character design, style mixing, blurry, low resolution";

/** Default Lyria music direction when the story plan omits one. */
export const DEFAULT_COMIC_MUSIC =
  "dramatic anime soundtrack with orchestral strings, taiko percussion swells and emotional piano motifs, instrumental";

// === Story plan interfaces (the LLM contract) ===
export interface ComicCharacter {
  /** snake_case slug or proper name, e.g. "kaito" — printed on the sheet */
  name: string;
  /** Vivid physical description incl. clothing/colors for consistency anchoring */
  description: string;
}

export interface ComicDialogueLine {
  character: string;
  line: string;
}

export interface ComicShotPlan {
  scene_description: string;
  /** Visual state at the START of the shot (composition, pose, expression) */
  first_frame_description: string;
  /** Visual state at the END of the shot; only pose/expression/position differs */
  last_frame_description: string;
  camera_direction: string;
  /** 0-2 short spoken lines performed by named characters */
  dialogue: ComicDialogueLine[];
  /** Exact character names appearing in this shot */
  character_refs?: string[];
}

export interface ComicStoryPlan {
  title: string;
  /** One of the COMIC_STYLE_PRESETS keys ("anime" | "manga" | ...) */
  style: string;
  music: string;
  characters: ComicCharacter[];
  shots: ComicShotPlan[];
}

// Camera-move rotation across consecutive shots (shot-split.ts cadence).
const CAMERA_ROTATION = ["static", "zoom_in", "pan_right", "zoom_out", "pan_left", "zoom_in"] as const;

/**
 * 4-view character sheet prompt (character-image.ts template): front / ¾ /
 * side / back views in one grid, matching the detected style exactly, with
 * the character's NAME printed at the bottom of the sheet so downstream
 * prompts can anchor identity by name.
 */
export function buildComicSheetPrompt(character: ComicCharacter, styleBlock: string): string {
  return [
    `Character reference sheet, model sheet grid of ${character.description}`,
    `four full-body views in one row: front view, three-quarter view, side profile view, back view`,
    `${styleBlock}`,
    `identical character design in every view, consistent outfit colors and proportions`,
    `the name "${character.name}" printed as a small clean caption at the bottom center of the sheet`,
    `plain light grey background, even flat lighting, full body visible head to toe`,
    `Avoid: ${COMIC_NEGATIVE_PROMPT}.`,
  ].join(", ");
}

/**
 * FIRST keyframe prompt for one shot (frame-generate.ts buildFirstFramePrompt):
 * style priority → scene environment → frame description → character anchor →
 * continuity requirement → rendering directives.
 */
export function buildComicFirstFramePrompt(
  shot: ComicShotPlan,
  anchors: ComicCharacter[],
  styleBlock: string,
  previousLastFrame?: string
): string {
  const lines: string[] = [];
  lines.push(`Generate the OPENING FRAME of a storyboard shot as a single high-quality finished image.`);
  lines.push(``);
  lines.push(`=== STYLE (highest priority) ===`);
  lines.push(`${styleBlock}`);
  lines.push(`The style must match exactly across every element in the frame. Do not mix styles.`);
  lines.push(``);
  lines.push(`=== SCENE ENVIRONMENT ===`);
  lines.push(shot.scene_description);
  lines.push(``);
  lines.push(`=== FRAME DESCRIPTION ===`);
  lines.push(shot.first_frame_description);
  lines.push(``);
  if (anchors.length) {
    lines.push(`=== CHARACTER SHEET ANCHOR ===`);
    lines.push(
      `Rendered from character sheet refs: ${anchors
        .map((a) => `${a.name} (${a.description} — identical face, hair, outfit, colors and accessories)`)
        .join("; ")}.`
    );
    lines.push(`Costume must match the sheet exactly — never swap or simplify clothing.`);
    lines.push(``);
  }
  if (previousLastFrame) {
    lines.push(`=== CONTINUITY REQUIREMENT ===`);
    lines.push(
      `This shot immediately follows the previous one, which ended with: "${previousLastFrame}". Maintain visual continuity:`
    );
    lines.push(`- the same characters wear the same outfits with consistent proportions`);
    lines.push(`- environment lighting and color temperature transition smoothly`);
    lines.push(`- character positions continue naturally from where the previous shot ended`);
    lines.push(``);
  }
  lines.push(`=== RENDERING ===`);
  lines.push(`Texture: rich detail appropriate to the style.`);
  lines.push(`Lighting: cinematic lighting with motivated sources; use rim light to separate characters from the background.`);
  lines.push(`Background: fully rendered detailed environment — never blank or abstract.`);
  lines.push(`Characters: exact match to their sheets, expressive faces, dynamic natural poses.`);
  lines.push(`Composition: cinematic framing with clear focal point and depth of field.`);
  lines.push(`Avoid: ${COMIC_NEGATIVE_PROMPT}.`);
  return lines.join("\n");
}

/**
 * LAST keyframe prompt (frame-generate.ts buildLastFramePrompt): must match the
 * first frame's style/environment EXACTLY — only pose/expression/position may
 * change — and end on a stable, standalone-composable pose that can serve as
 * the next shot's continuity anchor.
 */
export function buildComicLastFramePrompt(
  shot: ComicShotPlan,
  anchors: ComicCharacter[],
  styleBlock: string,
  firstFrameDescription: string
): string {
  const lines: string[] = [];
  lines.push(`Generate the CLOSING FRAME of this same storyboard shot as a single high-quality finished image.`);
  lines.push(``);
  lines.push(`=== STYLE (highest priority) ===`);
  lines.push(
    `You MUST match the opening frame's style exactly. Opening frame: "${firstFrameDescription}" in the scene: ${shot.scene_description}.`
  );
  lines.push(`${styleBlock}`);
  lines.push(`Never change or mix styles between the two frames. This is non-negotiable.`);
  lines.push(``);
  lines.push(`=== FRAME DESCRIPTION (end state) ===`);
  lines.push(shot.last_frame_description);
  lines.push(``);
  if (anchors.length) {
    lines.push(`=== CHARACTER SHEET ANCHOR ===`);
    lines.push(
      `${anchors.map((a) => `${a.name}: ${a.description}`).join("; ")} — same outfits, faces and accessories as the opening frame.`
    );
    lines.push(``);
  }
  lines.push(`=== RELATIONSHIP TO THE OPENING FRAME ===`);
  lines.push(`This closing frame shows the END STATE after the shot's action completes. Compared to the opening frame:`);
  lines.push(`- identical environment, lighting setup and color scheme`);
  lines.push(`- identical outfits, faces, hair and accessories — ONLY pose / expression / position change`);
  lines.push(`- character positions, poses and expressions follow the end-state description above`);
  lines.push(``);
  lines.push(`=== AS THE NEXT SHOT'S ANCHOR ===`);
  lines.push(`This frame will be reused as the visual continuation point for the next shot, so:`);
  lines.push(`- hold a stable pose — not a motion-blurred mid-action smear`);
  lines.push(`- keep a complete standalone composition that reads clearly on its own`);
  lines.push(`- leave framing that can cut naturally to a different camera angle`);
  lines.push(``);
  lines.push(`=== RENDERING ===`);
  lines.push(`Texture matches the opening frame; same lighting setup unless the action demands otherwise.`);
  lines.push(`Background consistent with the opening frame's environment.`);
  lines.push(`Characters show the emotional state at the END of the action.`);
  lines.push(`Avoid: ${COMIC_NEGATIVE_PROMPT}.`);
  return lines.join("\n");
}

/**
 * Motion prompt for the start/end-frame interpolation video call
 * (video-generate.ts + Wan FLF2V prompting guide: explain HOW the first frame
 * becomes the last frame, then fold in the camera direction).
 */
export function buildComicMotionPrompt(shot: ComicShotPlan): string {
  const cameraDirectives: Record<string, string> = {
    static: "Fixed camera.",
    zoom_in: "Slow cinematic zoom in.",
    zoom_out: "Slow cinematic zoom out.",
    pan_right: "Smooth pan to the right.",
    pan_left: "Smooth pan to the left.",
  };
  const camera =
    cameraDirectives[shot.camera_direction] || `Subtle cinematic camera movement (${shot.camera_direction}).`;
  const dialogueHint = shot.dialogue.length
    ? ` Characters act out: ${shot.dialogue.map((d) => `${d.character}: "${d.line}"`).join(" ")}`
    : "";
  return [
    `Start exactly from the first image and end exactly at the last image.`,
    `In between, show the action transitioning smoothly and coherently:${dialogueHint ? ` ${shot.scene_description}.` : ` ${shot.scene_description}.`} No flicker, no warping, no morphing.`,
    camera,
    `Preserve exact character designs, outfits and lighting throughout.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * System prompt for the story-plan LLM (shot-split.ts contract): turns any
 * premise or raw script into a complete short episode with extracted
 * characters, auto-detected art style, and a continuity-chained shot list.
 */
export function buildComicSystemPrompt(
  targetDurationSeconds: number,
  language = "English",
  tone = "dramatic",
  artStyle = "auto",
  shotCount?: number
): string {
  const shots = Math.min(10, Math.max(2, shotCount || Math.round(targetDurationSeconds / 5)));
  const rotation = CAMERA_ROTATION.map((c, i) => `shot ${i + 1}: ${c}`).join("; ");
  return [
    `You are a professional comic-drama episode director and storyboard artist.`,
    `Turn the user's premise or raw script into a complete ~${targetDurationSeconds}-second animated episode plan in JSON.`,
    `Write all spoken content in ${language} with a ${tone} tone. Exactly ${shots} shots.`,
    `STORY ARC: open with a strong hook, escalate through one clear conflict, and land either a resolution or a cliffhanger suited to short-form vertical video.`,
    `STYLE: detect the best fit for the story and set "style" to exactly one of "anime", "manga", "comic_book", "3d_pixar", "realistic_cinematic"${artStyle !== "auto" ? ` (OVERRIDE: you must use "${artStyle}")` : ""}.`,
    `CHARACTERS: extract every recurring character as a "characters" entry (name in snake_case English, vivid physical description incl. clothing, colors, age vibe). Max 4 characters.`,
    `CONTINUITY CHAIN RULES (critical): each shot has a first_frame_description and last_frame_description describing concrete visual states (20-40 words: composition, poses, expressions, framing). Shot N+1's first_frame_description MUST naturally continue from shot N's last_frame_description — same moment seen from a new camera angle, or positions continuing forward. Never teleport characters or change outfits mid-episode.`,
    `CAMERA RULES: rotate camera_direction across shots using: ${rotation}.`,
    `DIALOGUE: 0-2 punchy spoken lines per shot performed by named characters ("dialogue": [{character, line}]). Natural speech, no narration filler. At least 6 lines across the whole episode.`,
    `Return ONLY JSON: { "title": string, "style": string, "music": string (background-music description), "characters": [ { "name": string, "description": string } ], "shots": [ { "scene_description": string (environment + action context, 20-40 words), "first_frame_description": string, "last_frame_description": string, "camera_direction": "static"|"zoom_in"|"zoom_out"|"pan_left"|"pan_right", "dialogue": [ { "character": string, "line": string } ], "character_refs": [string] } ] }.`,
  ].join(" ");
}
