import { v4 as uuidv4 } from "uuid";
import { VideoScript, VideoType, JobStatus } from "../shared/video-schema";

export interface RenderJob {
  id: string;
  videoType: VideoType;
  script?: VideoScript;
  timeline?: any;
  status: JobStatus;
  progress: number;
  videoUrl?: string;
  error?: string;
  webhookUrl?: string;
  // Async pipeline params (used by TextToVideo: timeline is generated inside the job)
  pipeline?: {
    prompt: string;
    topic?: string;
    voice?: string;
    aspectRatio?: string;
  };
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// In-memory job storage (for production, use Redis or a database)
const jobs = new Map<string, RenderJob>();

// Queue of job IDs waiting to be processed
const pendingQueue: string[] = [];

// Currently rendering job
let currentJob: string | null = null;

// Max concurrent renders (keep at 1 for now to avoid OOM)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MAX_CONCURRENT = 1; // Reserved for future multi-concurrent render support

// Job cleanup interval (remove completed jobs after 1 hour)
const JOB_TTL_MS = 60 * 60 * 1000;

// Callback for when a job should start rendering
type RenderCallback = (job: RenderJob) => Promise<void>;
let onRenderStart: RenderCallback | null = null;

/**
 * Register the render callback
 */
export function setRenderCallback(callback: RenderCallback) {
  onRenderStart = callback;
}

/**
 * Create a new render job and add it to the queue
 */
export function createJob(
  videoType: VideoType,
  script?: VideoScript,
  timeline?: any,
  webhookUrl?: string,
  pipeline?: RenderJob["pipeline"]
): RenderJob {
  const job: RenderJob = {
    id: uuidv4(),
    videoType,
    script,
    timeline,
    status: "queued",
    progress: 0,
    webhookUrl,
    pipeline,
    createdAt: new Date(),
  };

  jobs.set(job.id, job);
  pendingQueue.push(job.id);

  // Try to process the queue
  processQueue();

  return job;
}

/**
 * Get a job by ID
 */
export function getJob(jobId: string): RenderJob | undefined {
  return jobs.get(jobId);
}

/**
 * Update job status
 */
export function updateJobStatus(
  jobId: string,
  updates: Partial<Pick<RenderJob, "status" | "progress" | "videoUrl" | "error" | "startedAt" | "completedAt">>
) {
  const job = jobs.get(jobId);
  if (!job) return;

  Object.assign(job, updates);

  // If job is done (completed or failed), clear current job, send webhook, and process next
  if (updates.status === "completed" || updates.status === "failed") {
    if (job.webhookUrl) {
      console.log(`[Webhook] Triggering callback for job ${job.id} to ${job.webhookUrl}`);
      fetch(job.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          status: job.status,
          progress: job.progress,
          videoUrl: job.videoUrl,
          error: job.error,
          createdAt: job.createdAt,
          completedAt: job.completedAt,
        }),
      }).catch((webhookErr) => {
        console.warn(`[Webhook] Failed triggering callback for job ${job.id}:`, webhookErr.message);
      });
    }

    if (currentJob === jobId) {
      currentJob = null;
    }
    processQueue();
  }
}

/**
 * Process the queue - start rendering if there's capacity
 */
async function processQueue() {
  // Check if we can start a new render
  if (currentJob !== null) return;
  if (pendingQueue.length === 0) return;
  if (!onRenderStart) return;

  // Get next job from queue
  const nextJobId = pendingQueue.shift();
  if (!nextJobId) return;

  const job = jobs.get(nextJobId);
  if (!job) {
    // Job was deleted, try next
    processQueue();
    return;
  }

  // Start rendering
  currentJob = nextJobId;
  job.status = "rendering";
  job.startedAt = new Date();

  try {
    await onRenderStart(job);
  } catch (err) {
    // Error is handled in the renderer
    console.error(`Queue: Render failed for job ${nextJobId}:`, err);
  }
}

/**
 * Get queue statistics
 */
export function getQueueStats() {
  return {
    pending: pendingQueue.length,
    rendering: currentJob ? 1 : 0,
    total: jobs.size,
  };
}

/**
 * Clean up old completed/failed jobs
 */
export function cleanupOldJobs() {
  const now = Date.now();

  for (const [jobId, job] of jobs.entries()) {
    if (job.status === "completed" || job.status === "failed") {
      const age = now - job.createdAt.getTime();
      if (age > JOB_TTL_MS) {
        jobs.delete(jobId);
      }
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupOldJobs, 10 * 60 * 1000);
