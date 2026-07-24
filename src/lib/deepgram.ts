import * as fs from "fs";
import {
  generateSpeechWithElevenLabs,
  ELEVENLABS_VOICES,
  DEFAULT_ELEVENLABS_VOICE_ID,
} from "./elevenlabs";

/**
 * Robust fetch wrapper with exponential backoff retries.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 2000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        console.warn(`[Network] Retryable status ${response.status} on ${url}. Retrying in ${delay}ms...`);
      } else {
        return response;
      }
    } catch (err) {
      console.warn(`[Network] Connection failed to ${url} (Attempt ${i + 1}/${retries}). Error: ${err}. Retrying in ${delay}ms...`);
      if (i === retries - 1) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export const AURA_VOICES = [
  "aura-2-thalia-en",
  "aura-2-andromeda-en",
  "aura-2-arcas-en",
  "aura-2-aries-en",
];

export { ELEVENLABS_VOICES };

/**
 * Primary speech generation entry point.
 * Prioritizes ElevenLabs TTS if ELEVENLABS_API_KEY is configured.
 * Automatically falls back to Deepgram (TTS + STT) if ElevenLabs key is missing or fails.
 */
export async function generateSpeechWithTimestamps(
  text: string,
  outputPath: string,
  voice?: string
): Promise<Array<{ word: string; start: number; end: number }>> {
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

  if (elevenLabsKey) {
    try {
      console.log("[TTS] ELEVENLABS_API_KEY is active. Using ElevenLabs TTS with word timestamps...");
      return await generateSpeechWithElevenLabs(text, outputPath, voice);
    } catch (elevenErr) {
      console.warn(`[TTS] ElevenLabs synthesis failed (${elevenErr}). Falling back to Deepgram...`);
    }
  } else {
    console.log("[TTS] ELEVENLABS_API_KEY is not set. Using Deepgram TTS fallback...");
  }

  // Deepgram Fallback Path
  const deepgramKey = process.env.DEEPGRAM_API_KEY;
  if (!deepgramKey) {
    throw new Error("Neither ELEVENLABS_API_KEY nor DEEPGRAM_API_KEY environment variable is configured.");
  }

  // Pick Deepgram voice if the provided voice isn't a Deepgram voice
  const selectedVoice = (voice && AURA_VOICES.includes(voice))
    ? voice
    : AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  console.log(`[Deepgram] Generating TTS using voice [${selectedVoice}] for text: "${text.substring(0, 60)}..."`);

  // 1. Generate speech via Deepgram TTS
  const ttsResponse = await fetchWithRetry(
    `https://api.deepgram.com/v1/speak?model=${selectedVoice}`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${deepgramKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }
  );

  if (!ttsResponse.ok) {
    const errorText = await ttsResponse.text();
    throw new Error(`Deepgram TTS error: ${ttsResponse.status} - ${errorText}`);
  }

  const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
  fs.writeFileSync(outputPath, audioBuffer);
  console.log(`[Deepgram] Audio file saved to ${outputPath}`);

  // 2. Transcribe audio to get timestamps via Deepgram STT
  console.log("[Deepgram] Transcribing audio to get word-level timestamps...");
  const sttResponse = await fetchWithRetry(
    "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&utterances=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${deepgramKey}`,
        "Content-Type": "audio/mpeg",
      },
      body: audioBuffer,
    }
  );

  if (!sttResponse.ok) {
    const errorText = await sttResponse.text();
    throw new Error(`Deepgram STT error: ${sttResponse.status} - ${errorText}`);
  }

  const sttData = await sttResponse.json();
  const words = sttData.results?.channels?.[0]?.alternatives?.[0]?.words;

  if (!words || !words.length) {
    console.warn("[Deepgram] No word alignments returned by STT. Synthesizing fallback timestamps.");
    const textWords = text.split(/\s+/);
    const duration = 5;
    const timePerWord = duration / textWords.length;
    return textWords.map((word, idx) => ({
      word,
      start: idx * timePerWord,
      end: (idx + 1) * timePerWord,
    }));
  }

  return words.map((w: { word: string; start: number; end: number }) => ({
    word: w.word,
    start: w.start,
    end: w.end,
  }));
}

