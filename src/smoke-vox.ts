/**
 * Vox mode smoke test — validates the full pipeline shape WITHOUT calling any
 * external API (no WaveSpeed, no TTS, no LLM network):
 *
 *   - `fetch` is stubbed: LLM chat-completions returns a valid beat map JSON
 *     (exercises the real parse/extractJson path), and poster downloads return
 *     a tiny binary blob.
 *   - `WavespeedClient` methods are stubbed to return fake prediction URLs, so
 *     triggerImage / triggerImageToVideo / triggerMusic / pollPrediction never
 *     hit the network.
 *   - TTS is skipped via generateAudio: false (uses no credits either way).
 *
 * Run with: npm run smoke:vox
 */
import { generateVoxVideoTimeline } from "./lib/vox-pipeline";
import { WavespeedClient } from "./lib/wavespeed";

process.env.WAVESPEED_API_KEY = "smoke-test-key";

// ---- Stub fetch (LLM JSON + binary poster download) ----
const fakeBeatMap = {
  title: "Smoke Test Film",
  theme: "american-retro",
  music: "upbeat retro jazz, acoustic bass, instrumental",
  beats: [
    {
      headline: "SMOKE TEST",
      narration: "This is the first beat of the smoke test.",
      scene: "a torn paper coffee cup with steam cut-outs",
      element_motion: "steam drifts upward, halftone dots pulse",
      bg: "amber clay",
      shot_size: "WIDE",
      camera_move: "push_in",
    },
    {
      headline: "WHY IT MATTERS",
      narration: "This is the second beat of the smoke test.",
      scene: "a paper chart with rising cut-out bars",
      element_motion: "bars slide up one by one",
      bg: "mustard yellow",
      shot_size: "MEDIUM",
      camera_move: "pan",
    },
    {
      headline: "THE PAYOFF",
      narration: "This is the final beat of the smoke test.",
      scene: "a torn banner with a big paper checkmark",
      element_motion: "sunburst lines pulse behind the banner",
      bg: "teal blue",
      shot_size: "CLOSE",
      camera_move: "static",
    },
  ],
};

const originalFetch = globalThis.fetch;
globalThis.fetch = (async (input: any, init?: any) => {
  const url = typeof input === "string" ? input : input.url;
  if (url.includes("chat/completions")) {
    const body = JSON.stringify({ choices: [{ message: { content: JSON.stringify(fakeBeatMap) } }] });
    return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
  }
  // Poster image download -> tiny binary blob.
  return new Response(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]), { status: 200 });
}) as typeof fetch;

// ---- Stub the WaveSpeed client so nothing hits the network ----
const fakeTask = { predictionId: "smoke-prediction", resultUrl: "https://mock-wavespeed.example/result" };
(WavespeedClient.prototype as any).triggerImage = async () => fakeTask;
(WavespeedClient.prototype as any).triggerImageToVideo = async () => fakeTask;
(WavespeedClient.prototype as any).triggerMusic = async () => fakeTask;
(WavespeedClient.prototype as any).pollPrediction = async () => ["https://mock-wavespeed.example/output.mp4"];

// ---- Run the pipeline ----
async function main() {
  const timeline = await generateVoxVideoTimeline(
    {
      prompt: "A brief history of coffee",
      title: "Smoke Test",
      aspectRatio: "9:16",
      targetDurationSeconds: 30,
      generateAudio: false,
      music: true,
    },
    { assetBaseUrl: "http://localhost:3001" }
  );

  const errors: string[] = [];
  if (!timeline.shortTitle) errors.push("shortTitle missing");
  if (!timeline.elements || timeline.elements.length === 0) errors.push("no elements/clips generated");
  if (timeline.text.length !== timeline.elements.length) errors.push(`text count ${timeline.text.length} != elements ${timeline.elements.length}`);
  if (timeline.width !== 1080 || timeline.height !== 1920) errors.push(`wrong dimensions ${timeline.width}x${timeline.height} (expected 1080x1920)`);
  if (!timeline.music || timeline.music.length !== 1) errors.push("music track missing");

  // Clips must be sequential (no overlaps).
  let prevEnd = 0;
  for (const el of timeline.elements) {
    if (el.startMs < prevEnd) errors.push(`overlapping clip at ${el.startMs}ms`);
    prevEnd = el.endMs;
  }

  console.log("=== Vox Smoke Test Timeline ===");
  console.log(JSON.stringify(timeline, null, 2));
  console.log(`\nClips: ${timeline.elements.length} | Headlines: ${timeline.text.length} | Music: ${timeline.music?.length ?? 0} | Size: ${timeline.width}x${timeline.height}`);

  if (errors.length) {
    console.error("\nSMOKE TEST FAILED:");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log("\nSMOKE TEST PASSED ✔ (no external API was called)");

  globalThis.fetch = originalFetch;
}

main().catch((err) => {
  console.error("\nSMOKE TEST FAILED with exception:", err);
  process.exit(1);
});
