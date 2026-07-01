import * as fs from "fs";
import * as path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Base directory for rendered videos
const VIDEOS_DIR = path.join(process.cwd(), "rendered-videos");

// Lazy getters — evaluated at call-time so that dotenv has already
// populated process.env regardless of ESM/CJS import hoisting order.
function isSpacesEnabled(): boolean {
  return Boolean(
    process.env.SPACES_ENDPOINT &&
    process.env.SPACES_KEY &&
    process.env.SPACES_SECRET &&
    process.env.SPACES_BUCKET_NAME
  );
}

function isR2ConfigEnabled(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

// Build an S3Client on-demand so credentials are always fresh
function getS3Client(): S3Client | null {
  if (isSpacesEnabled()) {
    return new S3Client({
      endpoint: process.env.SPACES_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SPACES_KEY!,
        secretAccessKey: process.env.SPACES_SECRET!,
      },
    });
  }
  if (isR2ConfigEnabled()) {
    return new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return null;
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
  return isR2ConfigEnabled() || isSpacesEnabled();
}

/**
 * Upload a video file to S3 compatible storage (R2 or Spaces)
 * Returns the public URL if successful, null otherwise
 */
export async function uploadToStorage(filename: string): Promise<string | null> {
  const spacesEnabled = isSpacesEnabled();
  const r2Enabled = isR2ConfigEnabled();
  const s3Client = getS3Client();

  if (!s3Client || (!r2Enabled && !spacesEnabled)) {
    console.warn("[Storage] No cloud storage configured — skipping upload. Check SPACES_* env vars.");
    return null;
  }

  const filePath = getVideoPath(filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found for storage upload: ${filePath}`);
    return null;
  }

  try {
    if (spacesEnabled) console.log("[Storage] Uploading to DigitalOcean Spaces...");
    else console.log("[Storage] Uploading to Cloudflare R2...");

    const fileBuffer = fs.readFileSync(filePath);
    const bucketName = spacesEnabled ? process.env.SPACES_BUCKET_NAME! : process.env.R2_BUCKET_NAME!;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `videos/${filename}`,
        Body: fileBuffer,
        ContentType: "video/mp4",
        ACL: spacesEnabled ? "public-read" : undefined,
      })
    );

    // If DO Spaces
    if (spacesEnabled) {
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
  if (isR2ConfigEnabled() || isSpacesEnabled()) {
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
