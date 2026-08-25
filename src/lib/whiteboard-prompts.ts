/**
 * WhiteboardVideo mode prompt library — ported from the reference
 * Storyboard-AI project (genai-pipeline/tools/director.py + image_prompt_tool.py)
 * and re-hosted on the WaveSpeed stack:
 *
 *   topic ─► LLM scene breakdown (narration + visual description per scene)
 *           ─► whiteboard line-art image per scene (Seedream T2I)
 *           ─► optional SAM3 Video segmentation for animated mask effects
 *           ─► narrator TTS + optional Lyria music
 *           ─► Ken Burns slideshow rendered by the WavespeedVideo composition.
 */

export const WHITEBOARD_STYLE_BLOCK =
  "clean whiteboard animation style, simple black line drawings on a pure white background, hand-drawn marker aesthetic, flat strokes only, no shading, no gradients, no photorealism, selective vibrant color on 1-2 focal objects only";

export const WHITEBOARD_NEGATIVE_PROMPT =
  "hands, arms, markers, pens, person drawing, artist, photorealistic, 3d render, shadows, gradients, clutter, blurry, low resolution, complex background, dark background";

export const DEFAULT_WHITEBOARD_MUSIC =
  "light upbeat acoustic guitar and soft piano with a curious tempo, educational documentary feel, instrumental";

// === Scene plan interfaces (the LLM contract) ===
export interface WhiteboardScenePlan {
  index: number;
  /** 1-line summary of what this scene accomplishes */
  summary: string;
  /** Full spoken narration script (1-3 sentences, max ~30-40s of speech) */
  narration: string;
  /** Visual description for the image generator (what should be DRAWN) */
  description: string;
  /** Specific visual direction (composition, key elements, focal points) */
  visual_setup: string;
  /** Search query for Wikipedia reference (if featuring real-world entity) */
  search_query?: string;
  /** Specific text to render into the frame */
  text_overlay?: string;
  /** Critical facts/data this scene must convey */
  key_information?: string;
  /** Emotional tone of this specific scene */
  emotional_beat?: string;
}

export interface WhiteboardStoryPlan {
  title: string;
  tone: string;
  narrative_persona: string;
  visual_style: string;
  pacing: string;
  narrative_arc: string;
  target_audience: string;
  music: string;
  scenes: WhiteboardScenePlan[];
}

/**
 * System prompt for the Director Agent — ported from the original
 * genai-pipeline/tools/director.py `director_tool_fn`.
 */
export function buildWhiteboardDirectorSystemPrompt(
  targetDurationSeconds: number,
  language: string,
  tone: string,
  sceneCount?: number
): string {
  const sceneGuide = sceneCount
    ? `Aim for approximately ${sceneCount} scenes.`
    : `Determine the optimal number of scenes. Each scene should have no more than ~30-40 seconds of narration. Target total duration: ~${targetDurationSeconds} seconds.`;

  return `You are an award-winning Video Director, Writer, and Storyteller.
You are planning a whiteboard animation video. Your job is to craft the ENTIRE video —
the narrative arc, the script, and the visual direction for every single scene.

STEP 1: Analyze the topic and decide:
- What TONE fits? (informative, dramatic, playful, sad, etc.)
- What is the NARRATIVE ARC? (beginning hook → build-up → climax → resolution)
- Who is narrating? (a professional explainer, a storyteller, a historian, etc.)
- How many scenes are needed? ${sceneGuide}

STEP 2: For EACH scene, you must provide:
- 'summary': A 1-line summary of what this scene accomplishes in the narrative arc
- 'narration': The FULL spoken script for this scene. THIS IS THE MOST IMPORTANT PART.
- 'description': Visual description for the image generator (what should be DRAWN in this frame)
- 'visual_setup': Specific visual direction for this frame (composition, key elements, focal points)
- 'search_query': (OPTIONAL) If this scene features a specific real-world person, historical figure, or landmark, provide a search query.
- 'text_overlay': (OPTIONAL) If you want specific impactful text visually rendered.
- 'key_information': Any critical facts/data from the research that this scene must convey
- 'emotional_beat': The emotional tone of this specific scene

CRITICAL RULES:
- LANGUAGE: The entire narration and summary values MUST be written in ${language}.
- ATTRACTIVE PACING & TONE: Match the tone "${tone}".
- No single scene should exceed ~30-40 seconds of narration.

Output STRICT JSON (no markdown, no explanation) with this exact structure:
{
  "title": "Video title",
  "tone": "...",
  "narrative_persona": "...",
  "visual_style": "Clean Whiteboard Animation",
  "pacing": "...",
  "narrative_arc": "...",
  "target_audience": "...",
  "music": "description of background music style",
  "scenes": [
    {
      "summary": "...",
      "narration": "...",
      "description": "...",
      "visual_setup": "...",
      "search_query": "...",
      "text_overlay": "...",
      "key_information": "...",
      "emotional_beat": "..."
    }
  ]
}`;
}

/**
 * Image prompt generator — ported from genai-pipeline/tools/image_prompt_tool.py.
 * Uses the Nano Banana formula: [Subject] + [Action] + [Location] + [Composition] + [Style]
 */
export function buildWhiteboardImagePrompt(
  sceneDescription: string,
  visualSetup: string,
  textOverlay?: string,
  tone?: string
): string {
  const toneGuidance =
    tone === "informative"
      ? "The visual should be clear, accurate, and educational. Use a neat composition."
      : tone === "dramatic"
      ? "The visual should be expressive, using dynamic framing and bold focus."
      : "The visual should be engaging and clear.";

  const textGuidance = textOverlay
    ? `\nTEXT OVERLAY HANDLING: The user wants specifically to insert this text: "${textOverlay}". Render it in a bold, black, marker-style font in the corner of the frame.`
    : "";

  return `You are an expert whiteboard animation artist and creative director.
Create an image generation prompt using the formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]

WHAT WHITEBOARD ANIMATION LOOKS LIKE:
- Clean WHITE background (like a dry-erase whiteboard)
- Simple, quick LINE DRAWINGS using black lines (just the pure ink on the board)
- Hand-drawn aesthetic — not photorealistic, not heavily detailed
- NO shading, NO gradients — flat simple strokes only

STRICT FORBIDDEN:
- DO NOT draw hands, human arms, markers, pens, or any person physically drawing!
- ONLY the final completed artwork standing alone on the white background.

COLOR RULE:
- Primarily BLACK lines on WHITE background
- 1-2 KEY objects or focal areas should have VIBRANT selective color
- Everything else stays black-and-white line art

SCENE DETAILS:
- Subject / Description: "${sceneDescription}"
- Action / Setup: "${visualSetup}"
- Tone: ${tone || "dramatic"} (${toneGuidance})
${textGuidance}

Output: ONLY the final prompt string. No explanations, no markdown blocks.`;
}
