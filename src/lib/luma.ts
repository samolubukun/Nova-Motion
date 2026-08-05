/**
 * Luma Agents API client — Ray 3.2 video generation/editing/reframing and
 * Uni-1 image generation/editing, plus the Files API for uploaded media.
 *
 * Base URL and auth are taken from the current Luma Agents API docs:
 *   POST/GET https://agents.lumalabs.ai/v1/generations
 *   POST     https://agents.lumalabs.ai/v1/files
 * Auth: Bearer token from the Luma API platform (LUMA_AGENTS_API_KEY).
 */

export const LUMA_BASE_URL = "https://agents.lumalabs.ai";
export const LUMA_VIDEO_MODEL = "ray-3.2";
export const LUMA_IMAGE_MODEL = "uni-1";
export const LUMA_IMAGE_MODEL_MAX = "uni-1-max";

export interface LumaGenerationOutput {
  type: string;
  url: string;
}

export interface LumaGeneration {
  id: string;
  type: string;
  state: "queued" | "processing" | "completed" | "failed";
  model: string;
  created_at?: string;
  output: LumaGenerationOutput[];
  failure_reason?: string | null;
  failure_code?: string | null;
}

export interface LumaFileRecord {
  id: string;
  state: "pending" | "ready" | "failed" | "deleted";
  filename?: string;
  mime_type?: string;
  failure_reason?: string | null;
}

export class LumaClient {
  private apiKey: string;
  private headers: Record<string, string>;

  constructor() {
    const apiKey = process.env.LUMA_AGENTS_API_KEY;
    if (!apiKey) {
      throw new Error("LUMA_AGENTS_API_KEY environment variable is not set in your .env.local file.");
    }
    this.apiKey = apiKey;
    this.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
  }

  private async requestJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Luma API error ${response.status}: ${text}`);
    }
    return response.json() as Promise<T>;
  }

  /**
   * Submit a generation request (type: video | video_edit | video_reframe |
   * image | image_edit | layering). Returns HTTP 201 with the top-level id.
   */
  async createGeneration(payload: Record<string, unknown>): Promise<LumaGeneration> {
    console.log(`[Luma] Submitting ${payload.type} generation: ${JSON.stringify(payload).slice(0, 320)}`);
    return this.requestJson<LumaGeneration>(`${LUMA_BASE_URL}/v1/generations`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
  }

  /** Get the current state of a generation. */
  async getGeneration(id: string): Promise<LumaGeneration> {
    return this.requestJson<LumaGeneration>(`${LUMA_BASE_URL}/v1/generations/${id}`, {
      method: "GET",
      headers: this.headers,
    });
  }

  /**
   * Poll a generation until it reaches a terminal state.
   * Mirrors the docs' recommended polling: initial 30s wait, then poll every
   * 5s up to a 10-minute hard deadline.
   */
  async pollGeneration(
    id: string,
    options: { initialWaitMs?: number; intervalMs?: number; timeoutMs?: number } = {}
  ): Promise<LumaGeneration> {
    const initialWaitMs = options.initialWaitMs ?? 30_000;
    const intervalMs = options.intervalMs ?? 5_000;
    const timeoutMs = options.timeoutMs ?? 600_000;
    const start = Date.now();

    await new Promise((resolve) => setTimeout(resolve, Math.min(initialWaitMs, timeoutMs)));

    while (Date.now() - start < timeoutMs) {
      const generation = await this.getGeneration(id);
      if (generation.state === "completed" || generation.state === "failed") {
        return generation;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Luma generation ${id} did not complete in ${timeoutMs / 1000}s`);
  }

  /** Download an output asset to a local file path (presigned URLs expire in 1h). */
  async downloadOutput(url: string, outputPath: string, timeoutMs = 180_000): Promise<void> {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) {
      throw new Error(`Luma output download failed: ${response.status} ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const fs = await import("fs");
    fs.writeFileSync(outputPath, buffer);
  }

  /**
   * Upload a file via the Files API (multipart inline flow) and return its id.
   * Small enough for inline uploads; files become referenceable once ready.
   */
  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    purpose: "input" | "reference" = "input"
  ): Promise<string> {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
    form.append("purpose", purpose);

    const response = await fetch(`${LUMA_BASE_URL}/v1/files`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: form,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Luma Files API error ${response.status}: ${text}`);
    }
    const data = (await response.json()) as { id?: string; file?: { id?: string } };
    const fileId = data.id || data.file?.id;
    if (!fileId) throw new Error(`Luma Files API did not return a file id: ${JSON.stringify(data)}`);
    console.log(`[Luma] Uploaded ${filename} -> file_id ${fileId}`);
    return fileId;
  }

  /** Poll a file until it is ready to reference. */
  async pollFileReady(fileId: string, intervalMs = 2_000, timeoutMs = 120_000): Promise<LumaFileRecord> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const file = await this.requestJson<LumaFileRecord>(`${LUMA_BASE_URL}/v1/files/${fileId}`, {
        method: "GET",
        headers: this.headers,
      });
      if (file.state === "ready") return file;
      if (file.state === "failed") throw new Error(`Luma file ingest failed: ${file.failure_reason || "unknown"}`);
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error(`Luma file ${fileId} did not become ready in ${timeoutMs / 1000}s`);
  }
}
