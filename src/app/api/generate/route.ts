import { NextRequest, NextResponse } from "next/server";
import { generateVideoScript } from "@/lib/openai";
import { GenerateRequestSchema } from "../../../../shared/video-schema";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for Claude to respond

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate request
    const validation = GenerateRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          details: validation.error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { prompt, videoType, durationSec, style } = validation.data;

    // Generate video script using Claude
    const result = await generateVideoScript(prompt, videoType, durationSec, style);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      script: result.script,
    });
  } catch (err) {
    console.error("Generate API error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
