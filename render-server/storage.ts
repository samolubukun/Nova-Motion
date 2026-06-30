import * as fs from "fs";
import * as path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Base directory for rendered videos
const VIDEOS_DIR = path.join(process.cwd(), "rendered-videos");

// R2 configuration (optional - set via environment variables)
const R2_ENABLED = Boolean(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

// DO Spaces configuration (optional)
const SPACES_ENABLED = Boolean(
  process.env.SPACES_ENDPOINT &&
  process.env.SPACES_KEY &&
  process.env.SPACES_SECRET &&
  process.env.SPACES_BUCKET_NAME
);

// Initialize S3 client for R2 or DO Spaces
let s3Client: S3Client | null = null;
if (SPACES_ENABLED) {
  s3Client = new S3Client({
    endpoint: process.env.SPACES_ENDPOINT,
    region: "us-east-1", // DO Spaces requires a region parameter, us-east-1 acts as standard
    credentials: {
      accessKeyId: process.env.SPACES_KEY!,
      secretAccessKey: process.env.SPACES_SECRET!,
    },
  });
  console.log("DigitalOcean Spaces storage enabled");
} else if (R2_ENABLED) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  console.log("R2 storage enabled");
}

// Ensure videos directory exists
export function ensureVideosDir() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }
}

/**
 * Get the full path for a video file
 */
export function getVideoPath(filename: string): string {
  ensureVideosDir();
  return path.join(VIDEOS_DIR, filename);
}

/**
 * Generate a unique filename for a rendered video
 */
export function generateVideoFilename(jobId: string): string {
  return `${jobId}.mp4`;
}

/**
 * Get the public URL for a video file
 */
export function getVideoUrl(filename: string, baseUrl: string): string {
  return `${baseUrl}/videos/${filename}`;
}

/**
 * Check if a video file exists
 */
export function videoExists(filename: string): boolean {
  return fs.existsSync(getVideoPath(filename));
}

/**
 * Get video file stats
 */
export function getVideoStats(filename: string): fs.Stats | null {
  try {
    return fs.statSync(getVideoPath(filename));
  } catch {
    return null;
  }
}

/**
 * Delete a video file
 */
export function deleteVideo(filename: string): boolean {
  try {
    fs.unlinkSync(getVideoPath(filename));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the videos directory path
 */
export function getVideosDirectory(): string {
  ensureVideosDir();
  return VIDEOS_DIR;
}

/**
 * Clean up old video files (older than specified hours)
 */
export function cleanupOldVideos(maxAgeHours: number = 24): number {
  ensureVideosDir();

  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  let deletedCount = 0;

  try {
    const files = fs.readdirSync(VIDEOS_DIR);

    for (const file of files) {
      if (!file.endsWith(".mp4")) continue;

      const filePath = path.join(VIDEOS_DIR, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAgeMs) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }
  } catch (err) {
    console.error("Error cleaning up old videos:", err);
  }

  return deletedCount;
}

/**
 * Check if R2 or Spaces upload is enabled
 */
export function isR2Enabled(): boolean {
  return R2_ENABLED || SPACES_ENABLED;
}

/**
 * Upload a video file to S3 compatible storage (R2 or Spaces)
 * Returns the public URL if successful, null otherwise
 */
export async function uploadToStorage(filename: string): Promise<string | null> {
  if (!s3Client || (!R2_ENABLED && !SPACES_ENABLED)) {
    return null;
  }

  const filePath = getVideoPath(filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found for storage upload: ${filePath}`);
    return null;
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const bucketName = SPACES_ENABLED ? process.env.SPACES_BUCKET_NAME! : process.env.R2_BUCKET_NAME!;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `videos/${filename}`,
        Body: fileBuffer,
        ContentType: "video/mp4",
        ACL: SPACES_ENABLED ? "public-read" : undefined,
      })
    );

    // If DO Spaces
    if (SPACES_ENABLED) {
      const publicUrl = process.env.SPACES_PUBLIC_URL;
      if (publicUrl) {
        return `${publicUrl}/videos/${filename}`;
      }
      const endpoint = process.env.SPACES_ENDPOINT!;
      const cleanEndpoint = endpoint.replace("https://", "").replace("http://", "");
      return `https://${bucketName}.${cleanEndpoint}/videos/${filename}`;
    }

    // If Cloudflare R2
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl}/videos/${filename}`;
    }

    // Fallback to R2 dev URL
    return `https://${process.env.R2_ACCOUNT_ID}.r2.dev/${bucketName}/videos/${filename}`;
  } catch (err) {
    console.error("Error uploading to storage:", err);
    return null;
  }
}

/**
 * Upload a video file to Cloudflare R2 (Legacy alias)
 */
export async function uploadToR2(filename: string): Promise<string | null> {
  return uploadToStorage(filename);
}

/**
 * Get video URL - uses storage upload if available, otherwise local URL
 */
export async function getVideoUrlWithR2Fallback(
  filename: string,
  localBaseUrl: string
): Promise<string> {
  // Try storage upload first if enabled
  if (R2_ENABLED || SPACES_ENABLED) {
    const uploadUrl = await uploadToStorage(filename);
    if (uploadUrl) {
      console.log(`Video uploaded to S3: ${uploadUrl}`);
      // Optionally delete local file after successful upload
      if (process.env.R2_DELETE_LOCAL_AFTER_UPLOAD === "true") {
        deleteVideo(filename);
      }
      return uploadUrl;
    }
  }

  // Fallback to local URL
  return getVideoUrl(filename, localBaseUrl);
}
