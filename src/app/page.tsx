"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VideoScript, VideoType } from "../../shared/video-schema";

// Types for API responses
interface GenerateResponse {
  success: boolean;
  jobId?: string;
  status?: string;
  script?: VideoScript;
  error?: string;
}

interface JobStatusResponse {
  success: boolean;
  jobId?: string;
  status?: "queued" | "rendering" | "completed" | "failed";
  progress?: number;
  videoUrl?: string;
  error?: string;
}

// Video type options with descriptions
const VIDEO_TYPES: { value: VideoType; label: string; description: string }[] = [
  { value: "General", label: "General", description: "Flexible template for any content" },
  { value: "TextAnimation", label: "Text Animation", description: "Kinetic typography with word-by-word animations" },
  { value: "SocialMedia", label: "Social Media", description: "Vertical 9:16 format for TikTok, Reels, Shorts" },
  { value: "Explainer", label: "Explainer", description: "Educational content with step indicators" },
  { value: "AIStoryboardVideo", label: "AI Storyboard (Generated)", description: "Generated story with AI images and voiceover" },
  { value: "StockVideo", label: "Stock Video", description: "Generated story with Pexels videos and voiceover" },
  { value: "StockImage", label: "Stock Image", description: "Generated story with Pixabay images and voiceover" },
  { value: "MicroDrama", label: "Micro Drama", description: "Full agentic pipeline: AI story, characters, storyboard, and Seedance clips" },
  { value: "UGC", label: "UGC Ad", description: "AI UGC ad studio: script + reference images → Veo/Grok/Seedance/Happy Horse clip. Full studio at /ugc" },
  { value: "AgenticVideoGenerator", label: "Agentic Video", description: "Concept to screenplay, casting, storyboard, AI scenes, audio, and final platform-ready video" },
  { value: "Luma", label: "Luma AI (Ray 3.2)", description: "All Ray 3.2 capabilities in one mode: T2V, I2V, loop, extend, video edit, reframe + TTS" },
  { value: "VoxVideo", label: "Vox Collage", description: "Vox-style paper-collage explainer: beat map → collage posters → animated clips + voiceover + captions" },
];

// Duration options
const DURATION_OPTIONS = [
  { value: 10, label: "10 seconds" },
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 45, label: "45 seconds" },
  { value: 60, label: "60 seconds" },
];

export default function Home() {
  // Form state
  const [prompt, setPrompt] = useState("");
  const [videoType, setVideoType] = useState<VideoType>("General");
  const [duration, setDuration] = useState(30);
  const [primaryColor, setPrimaryColor] = useState("#1a1a2e");
  const [textColor, setTextColor] = useState("#ffffff");
  const [targetAudience, setTargetAudience] = useState("General audience");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Professional and cinematic");
  const [platform, setPlatform] = useState("standard");
  const [agenticModel, setAgenticModel] = useState("seedanceStandard");

  // Luma state
  const [lumaUseCase, setLumaUseCase] = useState("custom");
  const [lumaOperation, setLumaOperation] = useState("auto");
  const [lumaResolution, setLumaResolution] = useState("720p");
  const [lumaHdr, setLumaHdr] = useState(false);
  const [lumaLoop, setLumaLoop] = useState(false);
  const [lumaGenerateAudio, setLumaGenerateAudio] = useState(true);
  const [lumaSourceVideo, setLumaSourceVideo] = useState("");

  // Vox state
  const [voxTheme, setVoxTheme] = useState("american-retro");
  const [voxArc, setVoxArc] = useState("hook_payoff");
  const [voxMusic, setVoxMusic] = useState(true);
  const [voxGenerateAudio, setVoxGenerateAudio] = useState(true);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ref to track polling
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for job status using useEffect
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

          // Continue polling if still in progress
          if (data.status === "queued" || data.status === "rendering") {
            pollingRef.current = setTimeout(checkStatus, 1500);
          } else if (data.status === "failed") {
            setError(data.error || "Video rendering failed");
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

  // Handle form submission
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentJobId(null);
    setJobStatus(null);
    setScript(null);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoType === "AgenticVideoGenerator" ? {
          videoType,
          title: prompt.trim().slice(0, 200),
          brief: prompt.trim(),
          targetAudience,
          durationSeconds: duration,
          language,
          tone,
          platform,
          videoModel: agenticModel,
        } : videoType === "Luma" ? {
          videoType,
          prompt: prompt.trim(),
          title: prompt.trim().slice(0, 200),
          useCase: lumaUseCase,
          resolution: lumaResolution,
          duration: `${duration <= 5 ? 5 : 10}s`,
          hdr: lumaHdr,
          loop: lumaLoop,
          generateAudio: lumaGenerateAudio,
          sourceVideoUrl: lumaSourceVideo.trim() || undefined,
          explicitOperation: lumaOperation === "auto" ? undefined : lumaOperation,
        } : videoType === "VoxVideo" ? {
          videoType,
          prompt: prompt.trim(),
          title: prompt.trim().slice(0, 200),
          theme: voxTheme,
          arc: voxArc,
          targetDurationSeconds: duration,
          generateAudio: voxGenerateAudio,
          music: voxMusic,
        } : {
          prompt: prompt.trim(),
          videoType,
          durationSec: duration,
          style: {
            primaryColor,
            textColor,
          },
        }),
      });

      const data: GenerateResponse = await response.json();

      if (data.success && data.jobId) {
        setCurrentJobId(data.jobId);
        setScript(data.script || null);
        setJobStatus({ success: true, status: "queued", progress: 0 });
        // Polling will start automatically via useEffect
      } else {
        setError(data.error || "Failed to start video generation");
        setIsGenerating(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video");
      setIsGenerating(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setIsGenerating(false);
    setCurrentJobId(null);
    setJobStatus(null);
    setScript(null);
    setError(null);
  };

  // Get status text
  const getStatusText = () => {
    if (!jobStatus) return "";
    switch (jobStatus.status) {
      case "queued":
        return "Waiting in queue...";
      case "rendering":
        return `Rendering: ${jobStatus.progress || 0}%`;
      case "completed":
        return "Video ready!";
      case "failed":
        return "Rendering failed";
      default:
        return "";
    }
  };

  // Get progress value
  const getProgress = () => {
    if (!jobStatus) return 0;
    if (jobStatus.status === "completed") return 100;
    return jobStatus.progress || 0;
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AI Video Generator</h1>
          <p className="text-muted-foreground">
            Generate professional videos with AI. Enter a prompt and let Claude create your video script.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Video</CardTitle>
              <CardDescription>
                Describe the video you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Create an inspiring video about the importance of daily exercise with motivational quotes"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  rows={4}
                />
              </div>

              {videoType === "AgenticVideoGenerator" && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="space-y-2">
                    <Label htmlFor="agentic-audience">Target Audience</Label>
                    <Input id="agentic-audience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} disabled={isGenerating} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agentic-language">Language</Label>
                      <Input id="agentic-language" value={language} onChange={(e) => setLanguage(e.target.value)} disabled={isGenerating} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentic-tone">Tone</Label>
                      <Input id="agentic-tone" value={tone} onChange={(e) => setTone(e.target.value)} disabled={isGenerating} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select value={platform} onValueChange={setPlatform} disabled={isGenerating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard 16:9</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="instagram_reels">Instagram Reels</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Video Model</Label>
                      <Select value={agenticModel} onValueChange={setAgenticModel} disabled={isGenerating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seedanceStandard">Seedance 2.0</SelectItem>
                          <SelectItem value="seedanceFast">Seedance 2.0 Fast</SelectItem>
                          <SelectItem value="veoFastReference">Veo 3.1 Fast Reference</SelectItem>
                          <SelectItem value="minimaxImage">MiniMax H3 Image</SelectItem>
                          <SelectItem value="minimaxReference">MiniMax H3 Reference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {videoType === "Luma" && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Use Case Scenario</Label>
                      <Select value={lumaUseCase} onValueChange={setLumaUseCase} disabled={isGenerating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Custom / General</SelectItem>
                          <SelectItem value="ugc_post">UGC Product Post</SelectItem>
                          <SelectItem value="product_ad">Product Showcase Ad</SelectItem>
                          <SelectItem value="product_launch">Product Reveal</SelectItem>
                          <SelectItem value="real_estate">Real Estate Tour</SelectItem>
                          <SelectItem value="event_promo">Event Promo</SelectItem>
                          <SelectItem value="education">Educational / Tutorial</SelectItem>
                          <SelectItem value="nonprofit">Nonprofit / Awareness</SelectItem>
                          <SelectItem value="social_generic">Social Media Reel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Operation Mode</Label>
                      <Select value={lumaOperation} onValueChange={setLumaOperation} disabled={isGenerating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (Detect from inputs)</SelectItem>
                          <SelectItem value="image_to_video">Image-to-Video</SelectItem>
                          <SelectItem value="edit">Video Edit (Restyle Footage)</SelectItem>
                          <SelectItem value="reframe">Video Reframe (Outpaint Crop)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Resolution</Label>
                      <Select value={lumaResolution} onValueChange={setLumaResolution} disabled={isGenerating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="360p">360p (Fast Draft)</SelectItem>
                          <SelectItem value="540p">540p</SelectItem>
                          <SelectItem value="720p">720p (HD Default)</SelectItem>
                          <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luma-source-video">Source Video URL (Edit/Reframe)</Label>
                      <Input
                        id="luma-source-video"
                        placeholder="https://... (Optional)"
                        value={lumaSourceVideo}
                        onChange={(e) => setLumaSourceVideo(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lumaHdr}
                        onChange={(e) => setLumaHdr(e.target.checked)}
                        disabled={isGenerating}
                        className="rounded border-gray-300"
                      />
                      <span>HDR Output</span>
                    </label>

                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lumaLoop}
                        onChange={(e) => setLumaLoop(e.target.checked)}
                        disabled={isGenerating}
                        className="rounded border-gray-300"
                      />
                      <span>Seamless Loop</span>
                    </label>

                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lumaGenerateAudio}
                        onChange={(e) => setLumaGenerateAudio(e.target.checked)}
                        disabled={isGenerating}
                        className="rounded border-gray-300"
                      />
                      <span>Generate TTS Voiceover</span>
                    </label>
                  </div>
                </div>
              )}

              {videoType === "VoxVideo" && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Visual Theme</Label>
                      <Select value={voxTheme} onValueChange={setVoxTheme} disabled={isGenerating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="american-retro">American Retro</SelectItem>
                          <SelectItem value="swiss-modern">Swiss Modern</SelectItem>
                          <SelectItem value="punk-zine">Punk Zine</SelectItem>
                          <SelectItem value="chinese-ink">Chinese Ink</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Narrative Arc</Label>
                      <Select value={voxArc} onValueChange={setVoxArc} disabled={isGenerating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hook_payoff">Hook & Payoff</SelectItem>
                          <SelectItem value="timeline">Timeline</SelectItem>
                          <SelectItem value="how_it_works">How It Works</SelectItem>
                          <SelectItem value="pas">Problem-Agitate-Solve</SelectItem>
                          <SelectItem value="bab">Before / After / Bridge</SelectItem>
                          <SelectItem value="man_in_hole">Man in Hole</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={voxGenerateAudio}
                        onChange={(e) => setVoxGenerateAudio(e.target.checked)}
                        disabled={isGenerating}
                        className="rounded border-gray-300"
                      />
                      <span>Generate TTS Voiceover</span>
                    </label>

                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={voxMusic}
                        onChange={(e) => setVoxMusic(e.target.checked)}
                        disabled={isGenerating}
                        className="rounded border-gray-300"
                      />
                      <span>Background Music</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Video Type */}
              <div className="space-y-2">
                <Label htmlFor="video-type">Video Type</Label>
                <Select
                  value={videoType}
                  onValueChange={(value: VideoType) => setVideoType(value)}
                  disabled={isGenerating}
                >
                  <SelectTrigger id="video-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col">
                          <span>{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={duration.toString()}
                  onValueChange={(value) => setDuration(parseInt(value))}
                  disabled={isGenerating}
                >
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      disabled={isGenerating}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      disabled={isGenerating}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      disabled={isGenerating}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      disabled={isGenerating}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? "Generating..." : "Generate Video"}
              </Button>
            </CardContent>
          </Card>

          {/* Output / Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {jobStatus?.status === "completed"
                  ? "Your video is ready"
                  : isGenerating
                  ? "Processing your video..."
                  : "Your generated video will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{getStatusText()}</span>
                    <span>{getProgress()}%</span>
                  </div>
                  <Progress value={getProgress()} />
                </div>
              )}

              {/* Video Player */}
              {jobStatus?.status === "completed" && jobStatus.videoUrl && (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={jobStatus.videoUrl}
                      controls
                      className="w-full h-full"
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

              {/* Script Preview */}
              {script && !jobStatus?.videoUrl && (
                <div className="space-y-2">
                  <Label>Generated Script</Label>
                  <div className="p-3 bg-muted rounded-md text-sm space-y-2 max-h-64 overflow-auto">
                    <p><strong>Title:</strong> {script.title}</p>
                    <p><strong>Duration:</strong> {script.durationSec}s</p>
                    <p><strong>Scenes:</strong> {script.scenes.length}</p>
                    <div className="border-t pt-2 mt-2">
                      {script.scenes.map((scene, idx) => (
                        <div key={idx} className="py-1">
                          <span className="text-muted-foreground">Scene {idx + 1}:</span>{" "}
                          {scene.text.slice(0, 100)}
                          {scene.text.length > 100 && "..."}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isGenerating && !jobStatus?.videoUrl && !script && (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
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
                  <p>Enter a prompt and click Generate to create your video</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>
            Powered by Claude AI and Remotion
          </p>
        </footer>
      </div>
    </main>
  );
}
