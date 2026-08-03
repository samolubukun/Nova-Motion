import * as fs from "fs";
import * as path from "path";

export type AgenticStage =
  | "planning"
  | "character_design"
  | "voice"
  | "keyframes"
  | "video_generation"
  | "music"
  | "quality_check"
  | "assembly";

export interface AgenticCheckpoint {
  jobId: string;
  input?: unknown;
  currentStage: AgenticStage;
  completedStages: AgenticStage[];
  progress: number;
  artifacts: Record<string, unknown>;
  providerTasks: Record<string, { predictionId: string; resultUrl: string }>;
  timeline?: unknown;
  updatedAt: string;
  error?: string;
}

function checkpointPath(jobId: string): string {
  return path.join(process.cwd(), ".checkpoints", `${jobId}.json`);
}

export function saveAgenticCheckpoint(checkpoint: AgenticCheckpoint): void {
  const directory = path.dirname(checkpointPath(checkpoint.jobId));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(checkpointPath(checkpoint.jobId), JSON.stringify(checkpoint, null, 2));
}

export function loadAgenticCheckpoint(jobId: string): AgenticCheckpoint | null {
  const filePath = checkpointPath(jobId);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as AgenticCheckpoint;
}

export function listAgenticCheckpoints(): AgenticCheckpoint[] {
  const directory = path.join(process.cwd(), ".checkpoints");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")) as AgenticCheckpoint;
      } catch {
        return null;
      }
    })
    .filter((value): value is AgenticCheckpoint => Boolean(value));
}
