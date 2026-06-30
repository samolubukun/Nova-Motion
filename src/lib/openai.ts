import {
  VideoScript,
  VideoScriptSchema,
  VideoType,
  normalizeVideoScript,
  getDefaultDimensions,
  getDefaultColors,
  getDefaultAnimation,
} from "../../shared/video-schema";

// Call OpenAI chat completion endpoint
async function callOpenAI(payload: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error: ${res.status} - ${errText}`);
  }

  return res.json();
}

// System prompt for video script generation
const getSystemPrompt = (videoType: VideoType, durationSec: number) => {
  const { width, height } = getDefaultDimensions(videoType);
  const { bgColor, textColor } = getDefaultColors(videoType);
  const animation = getDefaultAnimation(videoType);

  return `You are a professional video script generator for Remotion. Your task is to create engaging video content based on user prompts.

IMPORTANT: You must respond with ONLY valid JSON - no markdown, no explanation, no code blocks.

Video Type: ${videoType}
Target Duration: ${durationSec} seconds
Dimensions: ${width}x${height}
Default Background: ${bgColor}
Default Text Color: ${textColor}
Default Animation: ${animation}

Generate a video script with this exact JSON structure:
{
  "title": "A descriptive title for the video",
  "durationSec": ${durationSec},
  "fps": 30,
  "width": ${width},
  "height": ${height},
  "scenes": [
    {
      "startSec": 0,
      "durationSec": 5,
      "text": "Scene content text",
      "bgColor": "${bgColor}",
      "textColor": "${textColor}",
      "animation": "${animation}"
    }
  ]
}

Scene Guidelines:
- Each scene should be 3-8 seconds for best pacing
- Text should be concise (10-30 words per scene)
- Vary animations between scenes: fadeIn, slideUp, slideDown, slideLeft, slideRight, scale, bounce, typewriter
- Use contrasting colors for different scenes to maintain visual interest
- The sum of all scene durations should equal the total video duration
- startSec should increment properly (each scene starts after the previous one ends)

Animation Recommendations by Video Type:
- General: Mix of fadeIn, slideUp, scale
- TextAnimation: typewriter, slideUp, fadeIn
- SocialMedia: bounce, scale, slideUp (more dynamic)
- Explainer: fadeIn, slideUp (more professional)

Color Palette Suggestions:
- Dark modern: #1a1a2e, #16213e, #0f3460, #e94560
- Light professional: #f8f9fa, #e9ecef, #212529, #495057
- Vibrant: #7400b8, #6930c3, #5e60ce, #5390d9
- Warm: #ff6b6b, #feca57, #48dbfb, #1dd1a1

Remember: Return ONLY the JSON object, nothing else.`;
};

// Extract JSON from response
function extractJSON(text: string): string {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  return text.trim();
}

// Generate video script from prompt using OpenAI gpt-4o-mini
export async function generateVideoScript(
  prompt: string,
  videoType: VideoType,
  durationSec: number = 30,
  styleOverrides?: {
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
  }
): Promise<{ success: true; script: VideoScript } | { success: false; error: string }> {
  const systemPrompt = getSystemPrompt(videoType, durationSec);

  let userPrompt = `Create a ${videoType} video about: ${prompt}`;
  
  if (styleOverrides) {
    userPrompt += `\n\nStyle preferences:`;
    if (styleOverrides.primaryColor) {
      userPrompt += `\n- Primary/Background color: ${styleOverrides.primaryColor}`;
    }
    if (styleOverrides.textColor) {
      userPrompt += `\n- Text color: ${styleOverrides.textColor}`;
    }
  }

  try {
    const response = await callOpenAI({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    const jsonText = extractJSON(text);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return await repairAndValidate(systemPrompt, userPrompt, text, "Invalid JSON format");
    }

    // Validate with Zod
    const validation = VideoScriptSchema.safeParse(parsed);
    if (validation.success) {
      return { success: true, script: normalizeVideoScript(validation.data) };
    }

    // Validation failed - try repair
    const errorMsg = validation.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");

    return await repairAndValidate(systemPrompt, userPrompt, text, errorMsg);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error calling OpenAI API";
    return { success: false, error: message };
  }
}

// Repair attempt - one retry with error feedback
async function repairAndValidate(
  systemPrompt: string,
  originalPrompt: string,
  previousResponse: string,
  errorMessage: string
): Promise<{ success: true; script: VideoScript } | { success: false; error: string }> {
  const repairPrompt = `Your previous response had validation errors:
${errorMessage}

Previous response:
${previousResponse.slice(0, 2000)}

Please fix the JSON and respond with ONLY the corrected JSON object. Ensure:
1. All required fields are present
2. All values are the correct type
3. startSec values increment properly
4. Colors are valid hex format (#RRGGBB)
5. Scene durations sum to total duration

Original request: ${originalPrompt}`;

  try {
    const response = await callOpenAI({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: repairPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const text = response.choices[0].message.content;
    const jsonText = extractJSON(text);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return { success: false, error: `Failed to parse JSON after repair: ${jsonText.slice(0, 200)}...` };
    }

    const validation = VideoScriptSchema.safeParse(parsed);
    if (validation.success) {
      return { success: true, script: normalizeVideoScript(validation.data) };
    }

    const finalError = validation.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");

    return { success: false, error: `Validation failed after repair: ${finalError}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error during repair";
    return { success: false, error: `Repair attempt failed: ${message}` };
  }
}
