import { NextRequest, NextResponse } from "next/server";
import { JobResponseSchema } from "../../../../../shared/video-schema";

export const runtime = "nodejs";

// Get render server configuration
function getRenderServerConfig() {
  const url = process.env.RENDER_SERVER_URL;
  const secret = process.env.RENDER_SERVER_SECRET;

  if (!url) {
    throw new Error("RENDER_SERVER_URL environment variable is not set");
  }

  return { url, secret };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const { url, secret } = getRenderServerConfig();

    const headers: Record<string, string> = {};
    if (secret) {
      headers["X-Render-Secret"] = secret;
    }

    const response = await fetch(`${url}/render/${jobId}`, {
      method: "GET",
      headers,
      // Don't cache status checks
      cache: "no-store",
    });

    if (response.status === 404) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `Render server returned ${response.status}`);
    }

    const data = await response.json();

    // Validate response shape
    const validation = JobResponseSchema.safeParse(data);
    if (!validation.success) {
      console.error("Invalid job response from render server:", data);
      // Return raw data anyway, but log the issue
    }

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("Job status API error:", err);

    // Check if it's a connection error to render server
    if (err instanceof Error && err.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to connect to render server. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
