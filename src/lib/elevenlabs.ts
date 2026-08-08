// ElevenLabs Voice Integration Module

/**
 * Curated list of ElevenLabs default voice IDs confirmed to work on the free tier.
 * IMPORTANT: These were verified against the live API (GET /v1/text-to-speech/{id}).
 * Some other "default" voice IDs (Rachel, Domi, Liam, Drew, Clyde, Josh, Elli) return
 * 402 paid_plan_required on free accounts, so they are excluded here.
 */
export const ELEVENLABS_VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", gender: "female", tone: "soft, warm, friendly, expressive" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", gender: "male", tone: "well-rounded, engaging, clear" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", gender: "male", tone: "crisp, articulate, authoritative" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", gender: "male", tone: "deep, smooth, documentary narration" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", gender: "male", tone: "warm, British, captivating story-teller" },
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", gender: "female", tone: "playful, trendy, bright" },
];

export const DEFAULT_ELEVENLABS_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Bella

// Hard allowlist of ElevenLabs default voice IDs. These are the only voices ever sent to the
// API — library/shared voices require a paid plan and return 402 on free accounts.
const FREE_TIER_VOICE_IDS = new Set(ELEVENLABS_VOICES.map((v) => v.id));

export interface ElevenLabsAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

/**
 * Converts ElevenLabs character-level timestamp alignment into word-level timestamps.
 */
export function convertCharacterAlignmentToWords(
  alignment: ElevenLabsAlignment
): Array<{ word: string; start: number; end: number }> {
  const words: Array<{ word: string; start: number; end: number }> = [];
  const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;

  if (!characters || !characters.length) return words;

  let currentWord = "";
  let wordStart: number | null = null;
  let wordEnd: number | null = null;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const start = character_start_times_seconds[i];
    const end = character_end_times_seconds[i];

    if (/\s/.test(char)) {
      if (currentWord.length > 0 && wordStart !== null && wordEnd !== null) {
        words.push({
          word: currentWord,
          start: wordStart,
          end: wordEnd,
        });
        currentWord = "";
        wordStart = null;
        wordEnd = null;
      }
    } else {
      if (currentWord.length === 0) {
        wordStart = start;
      }
      currentWord += char;
      wordEnd = end;
    }
  }

  if (currentWord.length > 0 && wordStart !== null && wordEnd !== null) {
    words.push({
      word: currentWord,
      start: wordStart,
      end: wordEnd,
    });
  }

  return words;
}

/**
 * Generates speech using ElevenLabs TTS with native word-level timestamp alignments.
 */
export async function generateSpeechWithElevenLabs(
  text: string,
  outputPath: string,
  voiceIdOrName?: string
): Promise<Array<{ word: string; start: number; end: number }>> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY environment variable is not set");
  }

  // Resolve voice ID (support passing either voice ID or name like "Rachel", "Adam")
  let resolvedVoiceId = DEFAULT_ELEVENLABS_VOICE_ID;
  if (voiceIdOrName) {
    const matchedVoice = ELEVENLABS_VOICES.find(
      (v) => v.id.toLowerCase() === voiceIdOrName.toLowerCase() || v.name.toLowerCase() === voiceIdOrName.toLowerCase()
    );
    // Never send a library/non-default voice to the API (free accounts get 402)
    if (matchedVoice && FREE_TIER_VOICE_IDS.has(matchedVoice.id)) {
      resolvedVoiceId = matchedVoice.id;
    }
  }

  console.log(`[ElevenLabs] Generating TTS using voice ID [${resolvedVoiceId}] for text: "${text.substring(0, 60)}..."`);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}/with-timestamps`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs TTS error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const audioBase64 = data.audio_base64;
  if (!audioBase64) {
    throw new Error("ElevenLabs response did not contain audio_base64 payload");
  }

  const audioBuffer = Buffer.from(audioBase64, "base64");

  if (typeof window === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    fs.writeFileSync(outputPath, audioBuffer);
    console.log(`[ElevenLabs] Audio saved to ${outputPath} (${audioBuffer.length} bytes)`);
  }

  const alignment: ElevenLabsAlignment = data.alignment || data.normalized_alignment;
  if (!alignment) {
    console.warn("[ElevenLabs] No alignment data returned in response. Synthesizing fallback timestamps.");
    const textWords = text.split(/\s+/);
    const duration = 5;
    const timePerWord = duration / textWords.length;
    return textWords.map((word, idx) => ({
      word,
      start: idx * timePerWord,
      end: (idx + 1) * timePerWord,
    }));
  }

  const wordTimestamps = convertCharacterAlignmentToWords(alignment);
  console.log(`[ElevenLabs] Extracted ${wordTimestamps.length} word-level timestamps.`);
  return wordTimestamps;
}
