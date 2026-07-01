import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const API_BASE_URL = "http://localhost:3000/api/videos";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateAndPoll(videoType: string, prompt: string) {
  console.log(`\n--------------------------------------------------`);
  console.log(`[Custom Script] Initiating generation for type: ${videoType}`);
  console.log(`[Custom Script] Prompt: "${prompt}"`);

  // 1. Send request to Next.js API Gateway endpoint
  const payload = {
    videoType,
    prompt,
    durationSec: 10,
    aspectRatio: "16:9",
  };

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to initiate video generation: ${response.status} - ${await response.text()}`);
  }

  const { success, jobId, status, error } = await response.json();
  if (!success) {
    throw new Error(`API returned failure: ${error}`);
  }

  console.log(`[Custom Script] Job successfully queued. Job ID: ${jobId}`);

  // 2. Poll the Next.js API endpoint for status
  let attempts = 0;
  const maxAttempts = 60; // 3 minutes total
  const pollIntervalMs = 3000;

  while (attempts < maxAttempts) {
    await delay(pollIntervalMs);
    attempts++;

    try {
      const statusRes = await fetch(`${API_BASE_URL}/${jobId}`);
      if (!statusRes.ok) {
        console.warn(`[Custom Script] Warning: Status check returned ${statusRes.status}. Retrying...`);
        continue;
      }

      const jobData = await statusRes.json();
      if (!jobData.success) {
        console.warn(`[Custom Script] Warning: Job check returned success=false. Retrying...`);
        continue;
      }

      console.log(`[Custom Script] Status: ${jobData.status} | Progress: ${jobData.progress}%`);

      if (jobData.status === "completed") {
        console.log(`\n🎉 SUCCESS! Rendered ${videoType} video successfully!`);
        console.log(`🔗 Video URL: ${jobData.videoUrl}\n`);
        return jobData.videoUrl;
      } else if (jobData.status === "failed") {
        throw new Error(`Render job failed on server: ${jobData.error}`);
      }
    } catch (pollErr: any) {
      console.error(`[Custom Script] Error during status check: ${pollErr.message}`);
    }
  }

  throw new Error(`Timed out waiting for render job ${jobId} to complete`);
}

async function main() {
  console.log("🚀 Starting Custom Video Generation Script...");
  try {
    // Render 1: SocialMedia typography slide
    const video1Url = await generateAndPoll(
      "SocialMedia",
      "A short quote by Albert Einstein about creativity"
    );

    // Render 2: Explainer typography slide
    const video2Url = await generateAndPoll(
      "Explainer",
      "3 main steps to achieve daily focus and productivity"
    );

    console.log("==================================================");
    console.log("All videos generated successfully!");
    console.log(`Video 1 (SocialMedia): ${video1Url}`);
    console.log(`Video 2 (Explainer):   ${video2Url}`);
    console.log("==================================================");
  } catch (err: any) {
    console.error("Fatal Error running custom script:", err.message);
  }
}

main();
