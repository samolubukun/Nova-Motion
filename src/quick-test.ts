import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const API_BASE_URL = "http://localhost:3005/api/videos";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🚀 Quick 1-scene test — checking for DO Spaces URL...\n");

  // Submit job
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoType: "SocialMedia",
      prompt: "One quick test scene",
      durationSec: 5,
      aspectRatio: "9:16",
    }),
  });

  if (!res.ok) throw new Error(`Submit failed: ${res.status} ${await res.text()}`);
  const { jobId } = await res.json();
  console.log(`✅ Job queued: ${jobId}`);

  // Poll until done
  for (let i = 0; i < 40; i++) {
    await delay(4000);
    const statusRes = await fetch(`${API_BASE_URL}/${jobId}`);
    const data = await statusRes.json();
    console.log(`   [${data.status}] ${data.progress}%`);

    if (data.status === "completed") {
      console.log("\n🎉 DONE!");
      console.log(`🔗 Video URL: ${data.videoUrl}`);
      if (data.videoUrl?.includes("digitaloceanspaces.com") || data.videoUrl?.includes("contentnova")) {
        console.log("✅ Confirmed: DO Spaces URL returned!");
      } else {
        console.log("⚠️  Still returning local URL — check render-server logs for [Storage] messages.");
      }
      return;
    }
    if (data.status === "failed") throw new Error(`Job failed: ${data.error}`);
  }
  throw new Error("Timed out");
}

main().catch(console.error);
