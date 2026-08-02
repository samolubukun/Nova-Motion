"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UGC_MODELS, getUGCModel } from "@/lib/ugc-models";
import { ELEVENLABS_VOICES } from "@/lib/elevenlabs";

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  status: "uploading" | "ready" | "error";
}

interface JobStatusResponse {
  success: boolean;
  jobId?: string;
  status?: "queued" | "rendering" | "completed" | "failed";
  progress?: number;
  videoUrl?: string;
  error?: string;
}

const MAX_IMAGES = 7;

export default function UGCPage() {
  const [selectedModelId, setSelectedModelId] = useState<string>(getUGCModel().id);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [aspectRatio, setAspectRatio] = useState(getUGCModel().defaultAspectRatio);
  const [duration, setDuration] = useState<number>(getUGCModel().defaultDuration);
  const [resolution, setResolution] = useState(getUGCModel().defaultResolution);
  const [mode, setMode] = useState(getUGCModel().defaultMode || "normal");
  const [multiScene, setMultiScene] = useState(false);
  const [voice, setVoice] = useState("");
  const [targetDurationSec, setTargetDurationSec] = useState(30);
  const [lipSync, setLipSync] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const selectedModel = UGC_MODELS.find((m) => m.id === selectedModelId) || getUGCModel();

  // Reset per-model params when the model changes
  useEffect(() => {
    setAspectRatio(selectedModel.defaultAspectRatio);
    setDuration(selectedModel.defaultDuration);
    setResolution(selectedModel.defaultResolution);
    if (selectedModel.defaultMode) setMode(selectedModel.defaultMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModelId]);

  // Poll for job status
  useEffect(() => {
    if (!currentJobId || !isGenerating) {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/videos/${currentJobId}`);
        const data: JobStatusResponse = await response.json();

        if (data.success) {
          setJobStatus(data);
          if (data.status === "queued" || data.status === "rendering") {
            pollingRef.current = setTimeout(checkStatus, 2000);
          } else if (data.status === "failed") {
            setError(data.error || "Video generation failed");
            setIsGenerating(false);
          } else if (data.status === "completed") {
            setIsGenerating(false);
          }
        } else {
          setError(data.error || "Failed to get job status");
          setIsGenerating(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check job status");
        setIsGenerating(false);
      }
    };

    checkStatus();

    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [currentJobId, isGenerating]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (e.target.value) e.target.value = "";

    for (const file of files) {
      if (images.length >= MAX_IMAGES) {
        setError(`Maximum ${MAX_IMAGES} reference images.`);
        break;
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setImages((prev) => [...prev, { id, name: file.name, url: "", status: "uploading" }]);

      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => prev.map((i) => (i.id === id ? { ...i, url: data.url, status: "ready" } : i)));
        } else {
          setImages((prev) => prev.map((i) => (i.id === id ? { ...i, status: "error" } : i)));
          setError(data.error || "Upload failed");
        }
      } catch (err) {
        setImages((prev) => prev.map((i) => (i.id === id ? { ...i, status: "error" } : i)));
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const readyImages = images.filter((i) => i.status === "ready");
  const uploading = images.some((i) => i.status === "uploading");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a script.");
      return;
    }
    if (uploading) {
      setError("Please wait for images to finish uploading.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentJobId(null);
    setJobStatus(null);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoType: "UGC",
          prompt: prompt.trim(),
          model: selectedModel.id,
          images: readyImages.map((i) => i.url),
          aspectRatio,
          duration: multiScene ? undefined : duration,
          resolution,
          mode: selectedModel.modes ? mode : undefined,
          multiScene,
          voice: multiScene ? voice : undefined,
          targetDurationSec: multiScene ? targetDurationSec : undefined,
          lipSync: multiScene ? lipSync : undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.jobId) {
        setCurrentJobId(data.jobId);
        setJobStatus({ success: true, status: "queued", progress: 0 });
      } else {
        setError(data.error || "Failed to start UGC generation");
        setIsGenerating(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video");
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setIsGenerating(false);
    setCurrentJobId(null);
    setJobStatus(null);
    setError(null);
  };

  const getStatusText = () => {
    if (!jobStatus) return "";
    switch (jobStatus.status) {
      case "queued":
        return "Waiting in queue...";
      case "rendering":
        return `Generating: ${jobStatus.progress || 0}%`;
      case "completed":
        return "Video ready!";
      case "failed":
        return "Generation failed";
      default:
        return "";
    }
  };

  const getProgress = () => {
    if (!jobStatus) return 0;
    if (jobStatus.status === "completed") return 100;
    return jobStatus.progress || 0;
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AI UGC Video Studio</h1>
          <p className="text-muted-foreground">
            Paste a script, optionally upload reference images, pick a model, and ship a scroll-stopping UGC ad.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle>Create UGC Ad</CardTitle>
              <CardDescription>
                Model, reference images, script, and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model picker */}
              <div className="space-y-2">
                <Label>Video Model</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {UGC_MODELS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModelId(model.id)}
                      disabled={isGenerating}
                      className={`text-left rounded-lg border p-3 transition-colors ${
                        selectedModelId === model.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{model.label}</span>
                        <span className="text-xs text-muted-foreground">{model.provider}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{model.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference images */}
              <div className="space-y-2">
                <Label>Reference Images ({images.length}/{MAX_IMAGES})</Label>
                <div className="flex flex-wrap gap-2">
                  {images.map((img) => (
                    <div key={img.id} className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                      {img.status === "ready" ? (
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground">
                          {img.status === "uploading" ? "Uploading..." : "Error"}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        disabled={isGenerating}
                        className="absolute top-0 right-0 w-5 h-5 bg-black/70 text-white text-xs rounded-bl flex items-center justify-center"
                        aria-label={`Remove ${img.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isGenerating}
                      className="w-20 h-20 rounded-md border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center text-muted-foreground text-xs gap-1"
                    >
                      <span className="text-lg leading-none">+</span>
                      <span>Add</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleUpload}
                  disabled={isGenerating}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Upload an actor face or product (up to {MAX_IMAGES}). Reference them in your script with{" "}
                  <code className="bg-muted px-1 rounded">@image1</code>, <code className="bg-muted px-1 rounded">@image2</code>, etc.
                </p>
              </div>

              {/* Script */}
              <div className="space-y-2">
                <Label htmlFor="ugc-prompt">Script</Label>
                <Textarea
                  id="ugc-prompt"
                  placeholder="E.g., Hey! @image1 here and I just found the best hack for your morning routine. Let me show you..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  rows={5}
                />
              </div>

              {/* Generation style */}
              <div className="space-y-2">
                <Label>Generation Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMultiScene(false)}
                    disabled={isGenerating}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      !multiScene
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">Single clip</span>
                    <p className="mt-1 text-xs text-muted-foreground">One continuous take with native audio.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMultiScene(true)}
                    disabled={isGenerating}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      multiScene
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">Multi-scene (Arcads-style)</span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Script → LLM scene split → one TTS voiceover → per-scene clips, cut together.
                    </p>
                  </button>
                </div>
                {multiScene && (
                  <p className="text-xs text-muted-foreground">
                    Requires <code className="bg-muted px-1 rounded">ELEVENLABS_API_KEY</code> or{" "}
                    <code className="bg-muted px-1 rounded">DEEPGRAM_API_KEY</code> for the voiceover. Reference
                    images keep the same actor across every scene.
                  </p>
                )}
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ugc-ratio">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                    <SelectTrigger id="ugc-ratio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModel.aspectRatios.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ugc-resolution">Resolution</Label>
                  <Select value={resolution} onValueChange={setResolution} disabled={isGenerating}>
                    <SelectTrigger id="ugc-resolution">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModel.resolutions.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {multiScene ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ugc-target">Target Length</Label>
                      <Select
                        value={targetDurationSec.toString()}
                        onValueChange={(v) => setTargetDurationSec(parseInt(v))}
                        disabled={isGenerating}
                      >
                        <SelectTrigger id="ugc-target">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((d) => (
                            <SelectItem key={d} value={d.toString()}>
                              {d}s
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ugc-voice">Voice</Label>
                      <Select value={voice} onValueChange={setVoice} disabled={isGenerating}>
                        <SelectTrigger id="ugc-voice">
                          <SelectValue placeholder="Auto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Auto</SelectItem>
                          {ELEVENLABS_VOICES.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ugc-duration">Duration</Label>
                      <Select
                        value={duration.toString()}
                        onValueChange={(v) => setDuration(parseInt(v))}
                        disabled={isGenerating}
                      >
                        <SelectTrigger id="ugc-duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: selectedModel.durationMax - selectedModel.durationMin + 1 }, (_, i) => {
                            const d = selectedModel.durationMin + i;
                            return (
                              <SelectItem key={d} value={d.toString()}>
                                {d}s
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedModel.modes ? (
                      <div className="space-y-2">
                        <Label htmlFor="ugc-mode">Mode</Label>
                        <Select value={mode} onValueChange={setMode} disabled={isGenerating}>
                          <SelectTrigger id="ugc-mode">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedModel.modes.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Mode</Label>
                        <div className="h-10 flex items-center text-sm text-muted-foreground">—</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Lip-sync toggle (multi-scene only) */}
              {multiScene && (
                <button
                  type="button"
                  onClick={() => setLipSync((v) => !v)}
                  disabled={isGenerating}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    lipSync
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">
                    Lip-sync actor to voiceover {lipSync ? "• On" : "• Off"}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Re-animates the actor&apos;s mouth to match the TTS (WaveSpeed sync/lipsync-2).
                    Adds ~$0.05/scene and ~2 min per scene. Falls back to the raw clip if it fails.
                  </p>
                </button>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || uploading}
                className="w-full"
                size="lg"
              >
                {isGenerating ? "Generating..." : "Generate UGC Ad"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {jobStatus?.status === "completed"
                  ? "Your video is ready"
                  : isGenerating
                  ? "Processing your video..."
                  : "Your generated UGC ad will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{getStatusText()}</span>
                    <span>{getProgress()}%</span>
                  </div>
                  <Progress value={getProgress()} />
                  <p className="text-xs text-muted-foreground">
                    {currentJobId ? `Job ${currentJobId.slice(0, 8)}…` : ""} AI video generation usually takes 1-3 minutes.
                  </p>
                </div>
              )}

              {jobStatus?.status === "completed" && jobStatus.videoUrl && (
                <div className="space-y-4">
                  <div className="relative aspect-[9/16] max-h-[60vh] mx-auto bg-black rounded-lg overflow-hidden">
                    <video
                      src={jobStatus.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                      autoPlay
                      loop
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <a href={jobStatus.videoUrl} download>
                        Download Video
                      </a>
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Create Another
                    </Button>
                  </div>
                </div>
              )}

              {!isGenerating && !jobStatus?.videoUrl && (
                <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
                  <svg
                    className="w-16 h-16 mb-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p>Enter a script and click Generate to create your UGC ad</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <footer className="text-center text-sm text-muted-foreground space-y-1">
          <p>
            <Link href="/" className="underline underline-offset-2">
              ← Back to AI Video Generator
            </Link>
          </p>
          <p>Powered by WaveSpeed and Remotion</p>
        </footer>
      </div>
    </main>
  );
}
