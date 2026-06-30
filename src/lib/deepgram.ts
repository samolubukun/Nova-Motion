import fs from "fs";

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

/**
 * Generates speech using Deepgram Aura TTS and retrieves word alignment timestamps using Deepgram STT.
 */
export async function generateSpeechWithTimestamps(
  text: string,
  outputPath: string,
  voice?: string
): Promise<Array<{ word: string; start: number; end: number }>> {
  const deepgramKey = process.env.DEEPGRAM_API_KEY;
  if (!deepgramKey) {
    throw new Error("DEEPGRAM_API_KEY environment variable is not set");
  }

  // Use the passed voice, or fall back to picking a random one if not set
  const selectedVoice = voice || AURA_VOICES[Math.floor(Math.random() * AURA_VOICES.length)];
  console.log(`[Deepgram] Generating TTS using voice [${selectedVoice}] for text: "${text.substring(0, 60)}..."`);

  // 1. Generate speech via TTS
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

  // 2. Transcribe audio to get timestamps
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
