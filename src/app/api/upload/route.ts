import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Lazy S3/Spaces/R2 client so env is fresh at call time
function getS3Client(): S3Client | null {
  if (
    process.env.SPACES_ENDPOINT &&
    process.env.SPACES_KEY &&
    process.env.SPACES_SECRET &&
    process.env.SPACES_BUCKET_NAME
  ) {
    return new S3Client({
      endpoint: process.env.SPACES_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
      },
    });
  }
  if (
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  ) {
    return new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Use JPG, PNG, WebP, or GIF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be under 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = EXT_BY_TYPE[file.type] || "jpg";
    const filename = `${uuidv4()}.${ext}`;

    // Always keep a local copy (served from the public dir).
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localPath = path.join(uploadDir, filename);
    fs.writeFileSync(localPath, buffer);

    // Upload to cloud storage if configured (returns a stable public URL).
    const s3Client = getS3Client();
    if (s3Client) {
      const isSpaces = Boolean(process.env.SPACES_BUCKET_NAME);
      const bucketName = isSpaces ? process.env.SPACES_BUCKET_NAME! : process.env.R2_BUCKET_NAME!;
      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: `images/${filename}`,
            Body: buffer,
            ContentType: file.type,
            ACL: isSpaces ? "public-read" : undefined,
          })
        );

        if (isSpaces) {
          const publicUrl = process.env.SPACES_PUBLIC_URL;
          if (publicUrl) {
            return NextResponse.json({ url: `${publicUrl}/images/${filename}` });
          }
          const endpoint = process.env.SPACES_ENDPOINT!.replace("https://", "").replace("http://", "");
          return NextResponse.json({ url: `https://${bucketName}.${endpoint}/images/${filename}` });
        }

        const publicUrl = process.env.R2_PUBLIC_URL;
        if (publicUrl) {
          return NextResponse.json({ url: `${publicUrl}/images/${filename}` });
        }
        return NextResponse.json({
          url: `https://${process.env.R2_ACCOUNT_ID}.r2.dev/${bucketName}/images/${filename}`,
        });
      } catch (s3Err) {
        console.warn("[Upload] Cloud upload failed, relying on local copy:", s3Err);
      }
    }

    // Local fallback — only reachable by WaveSpeed when the gateway is public.
    return NextResponse.json({ url: `${req.nextUrl.origin}/uploads/${filename}` });
  } catch (err) {
    console.error("[UPLOAD_ERROR]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
