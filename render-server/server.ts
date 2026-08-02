import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables immediately before any local module imports
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createJob, getJob, setRenderCallback, getQueueStats } from "./queue";
import { renderVideo } from "./renderer";
import { getVideosDirectory, cleanupOldVideos, ensureVideosDir } from "./storage";
import { RenderRequestSchema, TextToVideoRequestSchema, MicroDramaRequestSchema, UGCRequestSchema } from "../shared/video-schema";

const app = express();
const PORT = process.env.RENDER_SERVER_PORT || 3001;
const RENDER_SECRET = process.env.RENDER_SERVER_SECRET;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth if no secret is configured (local development)
  if (!RENDER_SECRET) {
    return next();
  }

  const providedSecret = req.headers["x-render-secret"];
  if (providedSecret !== RENDER_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

// Health check endpoint (no auth required)
app.get("/health", (_req, res) => {
  const stats = getQueueStats();
  res.json({
    status: "ok",
    queue: stats,
    timestamp: new Date().toISOString(),
  });
});

// Submit a render job
app.post("/render", authenticate, (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = RenderRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: validation.error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const { videoType, script, timeline } = validation.data;
    const webhookUrl = req.body.webhookUrl;

    // Create job and add to queue
    const job = createJob(videoType, script, timeline, webhookUrl);

    console.log(`Job created: ${job.id} (${videoType})`);

    res.status(201).json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});

// Submit a TextToVideo pipeline job (async: timeline is generated inside the job)
app.post("/render/text-to-video", authenticate, (req: Request, res: Response) => {
  try {
    const validation = TextToVideoRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: validation.error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const { prompt, topic, voice, aspectRatio, webhookUrl } = validation.data;

    const job = createJob(
      "TextToVideo",
      undefined,
      undefined,
      webhookUrl,
      { prompt, topic, voice, aspectRatio }
    );

    console.log(`TextToVideo job created: ${job.id}`);

    res.status(201).json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Error creating TextToVideo job:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});

// Submit a MicroDrama pipeline job (async: the story → characters → scene →
// frames → I2V-clip timeline is generated inside the job, then rendered)
app.post("/render/micro-drama", authenticate, (req: Request, res: Response) => {
  try {
    const validation = MicroDramaRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: validation.error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const { idea, script, style, requirement, aspectRatio, webhookUrl } = validation.data;

    const job = createJob(
      "MicroDrama",
      undefined,
      undefined,
      webhookUrl,
      { idea, script, style, requirement, aspectRatio }
    );

    console.log(`MicroDrama job created: ${job.id}`);

    res.status(201).json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Error creating MicroDrama job:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});

// Submit a UGC pipeline job (async: the script → WaveSpeed T2V/I2V clip is
// generated inside the job, then persisted to storage)
app.post("/render/ugc", authenticate, (req: Request, res: Response) => {
  try {
    const validation = UGCRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: validation.error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const { prompt, model, images, aspectRatio, duration, resolution, mode, webhookUrl } = validation.data;

    const job = createJob(
      "UGC",
      undefined,
      undefined,
      webhookUrl,
      { prompt, model, images, aspectRatio, duration, resolution, mode }
    );

    console.log(`UGC job created: ${job.id}`);

    res.status(201).json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Error creating UGC job:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});

// Get job status
app.get("/render/:jobId", authenticate, (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const job = getJob(jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json({
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    videoUrl: job.videoUrl,
    error: job.error,
    createdAt: job.createdAt.toISOString(),
    startedAt: job.startedAt?.toISOString(),
    completedAt: job.completedAt?.toISOString(),
  });
});

// Serve rendered videos
app.use("/videos", express.static(getVideosDirectory(), {
  maxAge: "1h",
  setHeaders: (res) => {
    // Set content type for video files
    res.setHeader("Content-Type", "video/mp4");
  },
}));

// Serve locally stored pipeline assets (audio, music) so the renderer can
// fetch them while generating TextToVideo timelines in-process
app.use("/assets-temp", express.static(path.join(process.cwd(), "public", "assets-temp"), {
  maxAge: "1h",
}));

// Queue stats endpoint
app.get("/stats", authenticate, (_req, res) => {
  const stats = getQueueStats();
  res.json(stats);
});

// Manual cleanup endpoint (for maintenance)
app.post("/cleanup", authenticate, (_req, res) => {
  const deleted = cleanupOldVideos(24);
  res.json({ deleted, message: `Cleaned up ${deleted} old video files` });
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Set up render callback
setRenderCallback(async (job) => {
  // We need to determine the base URL for video URLs
  // This is a bit tricky since we don't have the request context here
  // Use environment variable or default to localhost
  const baseUrl = process.env.RENDER_SERVER_BASE_URL || `http://localhost:${PORT}`;
  await renderVideo(job, baseUrl);
});

// Ensure videos directory exists
ensureVideosDir();

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           Remotion Render Server                           ║
╠════════════════════════════════════════════════════════════╣
║  Port:     ${String(PORT).padEnd(46)}║
║  Auth:     ${RENDER_SECRET ? "Enabled".padEnd(46) : "Disabled (set RENDER_SERVER_SECRET)".padEnd(46)}║
║  Videos:   ${getVideosDirectory().slice(-44).padEnd(46)}║
╚════════════════════════════════════════════════════════════╝

Endpoints:
  POST /render              - Submit a render job
  POST /render/text-to-video - Submit an async TextToVideo pipeline job
  POST /render/micro-drama  - Submit an async MicroDrama pipeline job
  POST /render/ugc          - Submit an async UGC pipeline job
  GET  /render/:id          - Get job status
  GET  /videos/:file        - Serve rendered videos
  GET  /health              - Health check
  GET  /stats               - Queue statistics
  POST /cleanup             - Clean up old videos

Ready to accept render requests!
`);
});

// Long render jobs can starve the event loop and trip Node's default
// 5s keep-alive / 60s headers timeouts, causing clients to see ECONNRESET.
// Bump them so status polls survive busy renders.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 70_000;
server.requestTimeout = 70_000;

// Run cleanup every hour
setInterval(() => {
  const deleted = cleanupOldVideos(24);
  if (deleted > 0) {
    console.log(`Cleanup: Removed ${deleted} old video files`);
  }
}, 60 * 60 * 1000);
