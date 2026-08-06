/**
 * Vox mode prompt library — the "look layer" for the Vox-style paper-collage
 * aesthetic, ported from the reference Vox AI Motion Graphics Generator
 * (`references/prompt-guide.md` and `references/beat-layer.md`).
 *
 * Every beat is generated as a collage *poster* image first (Seedream), then
 * animated into a clip (Seedance I2V). The DNA of the style is locked in the
 * image step via a strict 5-part prompt formula + theme preset.
 */

// === Theme catalog (Style presets) ===
// Each theme contributes a style fragment + background palette guidance used to
// override the default STYLE BLOCK in the 5-part image formula.
export interface VoxTheme {
  id: string;
  label: string;
  styleBlock: string;
  palette: string;
}

export const VOX_THEMES: VoxTheme[] = [
  {
    id: "swiss-modern",
    label: "Swiss Modern",
    styleBlock:
      "mixed-media hand-cut paper collage, Swiss modern editorial zine style. " +
      "Asymmetric grids, heavy negative space, very clean scissor cuts, subtle print texture. " +
      "Typography: heavy grotesque sans-serif (Helvetica style). Pure red, jet black, clean white, slate gray. " +
      "NOT 3D, NOT CGI. Visible paper grain and print imperfections. High contrast.",
    palette: "pure red, jet black, clean white, slate gray",
  },
  {
    id: "american-retro",
    label: "American Retro",
    styleBlock:
      "mixed-media hand-cut paper collage, 1950s/60s American print advertisement style. " +
      "Centered hero illustrations, bold offset badge designs, Ben-Day dot patterns, paper aging, coffee stains. " +
      "Typography: bold slab-serif or display letters. Aged sepia, mustard yellow, teal blue, cherry red. " +
      "NOT 3D, NOT CGI. Visible paper grain and print imperfections. High contrast.",
    palette: "aged sepia, mustard yellow, teal blue, cherry red",
  },
  {
    id: "punk-zine",
    label: "Punk Zine",
    styleBlock:
      "mixed-media hand-cut paper collage, raw handmade punk zine style. " +
      "Chaotic overlapping layers, angled elements, ransom-note cutout letters, distressed stamp letters. " +
      "Heavy xerox copy grain, high-contrast print, tape patches. Duotone palette. " +
      "NOT 3D, NOT CGI. Visible paper grain and print imperfections. High contrast.",
    palette: "neon yellow and black, hot pink and navy, green and white duotone",
  },
  {
    id: "chinese-ink",
    label: "Chinese Ink",
    styleBlock:
      "mixed-media hand-cut paper collage, elegant Chinese ink painting style. " +
      "Dynamic ink sweeps, circular framing, brush-stroke lettering, block stamps. " +
      "Ink washes, soft deckled edges, rice paper fiber textures. " +
      "Charcoal black, soft parchment cream, bright vermilion accent. " +
      "NOT 3D, NOT CGI. Visible paper grain and print imperfections. High contrast.",
    palette: "charcoal black, soft parchment cream, bright vermilion",
  },
];

export const DEFAULT_VOX_THEME = "american-retro";

export function getVoxTheme(theme?: string): VoxTheme {
  return VOX_THEMES.find((t) => t.id === theme) || VOX_THEMES[0];
}

// === Narrative arc library ===
export interface VoxArc {
  id: string;
  label: string;
  sequence: string[];
}

export const VOX_ARC_SEQUENCES: VoxArc[] = [
  { id: "hook_payoff", label: "Hook & Payoff", sequence: ["Hook", "Context", "Build", "Payoff", "Wrap-up"] },
  { id: "pas", label: "Problem-Agitate-Solve", sequence: ["Problem", "Agitate", "Solve", "Proof", "CTA"] },
  { id: "bab", label: "Before/After/Bridge", sequence: ["Before State", "After State", "Bridge", "CTA"] },
  { id: "how_it_works", label: "How It Works", sequence: ["Hook", "Overview", "Step-by-Step", "Benefit", "CTA"] },
  { id: "timeline", label: "Timeline", sequence: ["Beginning", "Key Event 1", "Key Event 2", "Climax", "Takeaway"] },
  { id: "man_in_hole", label: "Man in Hole", sequence: ["Baseline", "Crisis", "Deepening", "Ascent", "Resolution"] },
];

export function getVoxArc(arc?: string): VoxArc {
  return VOX_ARC_SEQUENCES.find((a) => a.id === arc) || VOX_ARC_SEQUENCES[0];
}

// === Shot vocabulary ===
export const VOX_SHOT_SIZES = ["EST_WIDE", "WIDE", "MEDIUM", "CLOSE", "DETAIL"] as const;
export const VOX_CAMERA_MOVES = ["static", "push_in", "pull_out", "pan", "tilt", "parallax"] as const;

// === The default collage style block (used when no theme preset is chosen) ===
const BASE_STYLE_BLOCK =
  "mixed-media hand-cut paper collage, editorial zine style. Torn paper edges, scissor-cut borders, " +
  "tape corners, halftone print dot patterns, paper drop shadows. Figures are printed-texture cut-outs " +
  "from vintage photography or woodblocks. NOT 3D, NOT CGI. Visible paper grain and print imperfections. High contrast.";

// === Beat map interface (what the LLM produces per beat) ===
export interface VoxBeat {
  headline: string;
  narration: string;
  scene: string;
  element_motion: string;
  bg: string;
  shot_size: string;
  camera_move: string;
}

export interface VoxBeatMap {
  title: string;
  theme: string;
  music: string;
  beats: VoxBeat[];
}

/**
 * Build the 5-part image prompt for a single collage poster.
 * Mirrors the reference prompt formula exactly:
 *   [STYLE BLOCK] [SCENE DETAILS] [BACKGROUND] [TEXT BANNER] [TECHNICAL]
 */
export function buildVoxImagePrompt(
  beat: VoxBeat,
  theme?: string,
  aspectHint?: string
): string {
  const themeBlock = getVoxTheme(theme);
  return [
    `[STYLE] ${theme ? themeBlock.styleBlock : BASE_STYLE_BLOCK}`,
    `[SCENE] ${beat.scene} as layered hand-cut paper collage cut-outs. Elements have clean cut-out outlines, casting subtle drop shadows on the layers below.`,
    `[BACKGROUND] on a bold flat ${beat.bg || "cardboard paper"} background.`,
    `[HEADLINE] A torn paper banner with a big bold headline "${beat.headline}" written in heavy sans-serif capital letters.`,
    `[TECH] flat-lay scanned look, straight-on composition, 1k resolution, high contrast${aspectHint ? `, ${aspectHint} composition` : ""}.`,
  ].join("\n");
}

/**
 * Build the motion prompt used to animate a finished collage poster via I2V.
 * Keeps the flat collage aesthetic while driving the per-shot element motion
 * and camera move described in the beat map.
 */
export function buildVoxMotionPrompt(
  beat: VoxBeat,
  cameraMove?: string,
  elementMotion?: string
): string {
  const move = cameraMove || beat.camera_move || "push_in";
  const motion = elementMotion || beat.element_motion || "paper elements gently drift";
  return [
    `Animate this flat paper collage poster: ${motion}.`,
    `Camera: ${move} (flat, uniform, no warping).`,
    "Keep the flat collage aesthetic. No 3D. No text smearing. Preserve the paper cut-out layers and headline.",
  ].join(" ");
}

/**
 * System prompt for the beat-map LLM. Instructs the LLM to write a Vox-style
 * narrative beat map in JSON (hook-led, cadence every ~4-6s, arc-driven).
 */
export function buildVoxSystemPrompt(
  targetDurationSeconds: number,
  arc?: string,
  theme?: string,
  language = "English",
  tone = "natural"
): string {
  const chosenArc = getVoxArc(arc);
  const chosenTheme = getVoxTheme(theme);
  const beats = Math.min(6, Math.max(2, Math.round(targetDurationSeconds / 5)));
  return [
    `You are a Vox-style explainer film director and paper-collage prompt engineer.`,
    `Write a narrative beat map in JSON for a ${targetDurationSeconds}-second video.`,
    `Use ${language}, ${tone} tone. Exactly ${beats} beats.`,
    `Narrative arc: ${chosenArc.label} (${chosenArc.sequence.join(" > ")}).`,
    `First beat is the HOOK (grip in under 3 seconds). Cut every ~4-6 seconds.`,
    `Visual theme: ${chosenTheme.label} paper-collage (${chosenTheme.palette}).`,
    `Return ONLY JSON: { "title": string, "theme": string, "music": string (a background-music description, e.g. "upbeat retro jazz, acoustic double bass, instrumental"), "beats": [ { "headline": string (3-5 ALL-CAPS words), "narration": string (exact spoken words, 1-2 short sentences), "scene": string (detailed paper-collage scene, layered cut-outs, props, accent pieces), "element_motion": string (which elements animate and how), "bg": string (bold flat color), "shot_size": "WIDE"|"MEDIUM"|"CLOSE"|"DETAIL"|"EST_WIDE", "camera_move": "static"|"push_in"|"pull_out"|"pan"|"tilt"|"parallax" } ].`,
    `Keep the subject and style consistent across all beats. Keep headlines on a clean solid paper banner. Return only JSON.`,
  ].join(" ");
}
