import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const API_BASE_URL = "http://localhost:3005/api/videos";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateAndPoll(videoType: string, prompt: string, extraParams: any = {}) {
  console.log(`\n==================================================`);
  console.log(`[Test Mode: ${videoType}] Initiating generation...`);
  console.log(`[Prompt]: "${prompt}"`);

  const payload = {
    videoType,
    prompt,
    durationSec: 30, // Under 45 seconds
    ...extraParams,
  };

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(600000), // 10 minutes timeout for sequential DALL-E runs
  });

  if (!response.ok) {
    throw new Error(`Failed to queue ${videoType}: ${response.status} - ${await response.text()}`);
  }

  const { success, jobId, error } = await response.json();
  if (!success) {
    throw new Error(`API returned error: ${error}`);
  }

  console.log(`[Job Queued] ID: ${jobId}`);

  // Poll status
  let attempts = 0;
  const maxAttempts = 120; // 6 minutes max
  const pollIntervalMs = 4000;

  while (attempts < maxAttempts) {
    await delay(pollIntervalMs);
    attempts++;

    let jobStatus = "";
    let jobProgress = 0;
    let jobVideoUrl = "";
    let jobError = "";
    let pollSuccess = false;

    try {
      const statusRes = await fetch(`${API_BASE_URL}/${jobId}`);
      if (!statusRes.ok) {
        console.warn(`[Poll Warning] Received ${statusRes.status}. Retrying...`);
        continue;
      }

      const jobData = await statusRes.json();
      if (!jobData.success) {
        console.warn(`[Poll Warning] Success was false. Retrying...`);
        continue;
      }

      jobStatus = jobData.status;
      jobProgress = jobData.progress;
      jobVideoUrl = jobData.videoUrl;
      jobError = jobData.error;
      pollSuccess = true;
    } catch (pollErr: any) {
      console.error(`[Poll Error] ${pollErr.message}`);
    }

    if (pollSuccess) {
      console.log(`[Job ${jobId}] Status: ${jobStatus} | Progress: ${jobProgress}%`);

      if (jobStatus === "completed") {
        console.log(`\n🎉 SUCCESS! Rendered ${videoType} successfully!`);
        console.log(`🔗 Link: ${jobVideoUrl}`);
        return jobVideoUrl;
      } else if (jobStatus === "failed") {
        throw new Error(`Render job failed: ${jobError}`);
      }
    }
  }

  throw new Error(`Job ${jobId} timed out`);
}

async function runTest() {
  console.log("🚀 Starting Three-Mode Video Generation Test Suite...");
  
  const commonPrompt = "Create a high-impact promotional short for a brand trying to push out consistent video content, gain audience engagement, and drive customer conversion rates.";

  try {
    // 1. Generate AIVideo (Image generation mode)
    const aiVideoUrl = await generateAndPoll("AIVideo", commonPrompt, {
      topic: "Marketing Strategy",
      aspectRatio: "16:9"
    });

    // 2. Generate StockVideo (Pexels stock clips mode)
    const stockVideoUrl = await generateAndPoll("StockVideo", commonPrompt, {
      topic: "Content Creation",
      aspectRatio: "16:9"
    });

    // 3. Generate Slide Video (SocialMedia typographic composition)
    const slideVideoUrl = await generateAndPoll("SocialMedia", commonPrompt);

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS RUN SUCCESSFULLY!");
    console.log(`1. AIVideo (Image Gen):     ${aiVideoUrl}`);
    console.log(`2. StockVideo (Stock footage): ${stockVideoUrl}`);
    console.log(`3. Typographic Slide Video: ${slideVideoUrl}`);
    console.log("==================================================");
  } catch (err: any) {
    console.error("\n❌ Test execution failed:", err.message);
  }
}

runTest();
