/**
 * Concept-to-video orchestration inspired by the reference Python pipeline.
 * Each stage produces a real artifact or a validated intermediate contract;
 * media generation and final assembly are delegated to existing WaveSpeed and
 * Remotion integrations rather than returning placeholder file paths.
 */
import type { WavespeedTimelineAsset } from "./wavespeed-timeline";
import { getAspectRatioDimensions } from "../../shared/video-schema";
import { WavespeedClient } from "./wavespeed";
import {
  AGENTIC_IMAGE_EDIT_MODEL,
  AGENTIC_IMAGE_MODEL,
  buildAgenticVideoRequest,
  getAgenticVideoModel,
} from "./agentic-models";
import { generateSpeechWithElevenLabs } from "./elevenlabs";
import { uploadAsset } from "./wavespeed-timeline";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { loadAgenticCheckpoint, saveAgenticCheckpoint } from "./agentic-checkpoints";
import type { AgenticCheckpoint, AgenticStage } from "./agentic-checkpoints";

const LLM_URL = "https://llm.wavespeed.ai/v1/chat/completions";

export interface AgenticVideoInput {
  title: string;
  brief: string;
  targetAudience: string;
  durationSeconds: number;
  language: string;
  tone: string;
  keyMessages?: string[];
  callToAction?: string;
  platform: string;
  aspectRatio?: string;
  voice?: string;
  style?: string;
  videoModel?: string;
  videoResolution?: string;
  characterDescription?: string;
  referenceImages?: string[];
  lipSync?: boolean;
}

interface AgenticScreenplay {
  title: string;
  story: string;
  visualStyle: string;
  characters: Array<{ name: string; description: string }>;
  scenes: Array<{
    title: string;
    script: string;
    visual: string;
    camera: string;
    audio: string;
  }>;
}

export interface AgenticPipelineOptions {
  onProgress?: (progress: number) => void;
  assetBaseUrl?: string;
  onStage?: (stage: AgenticStage) => void;
  jobId?: string;
}

interface SavedSceneArtifact {
  imageUrl: string;
  videoUrl: string;
  audioUrl: string;
  words: Array<{ word: string; start: number; end: number }>;
  spokenDuration: number;
  actualDuration: number;
}

function ratioForPlatform(platform: string): string {
  switch (platform) {
    case "instagram_reels":
    case "tiktok":
      return "9:16";
    case "linkedin":
      return "16:9";
    case "youtube":
    case "standard":
    default:
      return "16:9";
  }
}

function extractJson(text: string): string {
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) return block[1].trim();
  const object = text.match(/\{[\s\S]*\}/);
  return object ? object[0] : text.trim();
}

async function createScreenplay(input: AgenticVideoInput): Promise<AgenticScreenplay> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) throw new Error("WAVESPEED_API_KEY is required for AgenticVideoGenerator");

  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.WAVESPEED_LLM_MODEL || "deepseek/deepseek-v4-flash",
      temperature: 0.65,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an AI film production team: screenwriter, storyboard artist,
casting director, cinematographer, and sound designer. Create a production-ready
short video plan in JSON. Use ${input.language}, a ${input.tone} tone, and keep the
story visually filmable. Return 2-6 scenes. Each scene must have enough visual,
camera, and audio detail for an AI video model. Do not invent unsupported product
claims. Return only JSON with title, story, visualStyle, characters, and scenes.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            title: input.title,
            brief: input.brief,
            targetAudience: input.targetAudience,
            durationSeconds: input.durationSeconds,
            keyMessages: input.keyMessages || [],
            callToAction: input.callToAction || "",
            style: input.style || "cinematic, polished, natural lighting",
            characterDescription: input.characterDescription || "",
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) throw new Error(`WaveSpeed LLM error ${response.status}: ${await response.text()}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("WaveSpeed LLM returned an empty screenplay");
  const parsed = JSON.parse(extractJson(content)) as AgenticScreenplay;
  if (!parsed.title || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error("WaveSpeed LLM returned an invalid screenplay");
  }
  return parsed;
}

export async function generateAgenticVideoTimeline(
  input: AgenticVideoInput,
  options: AgenticPipelineOptions = {}
): Promise<WavespeedTimelineAsset> {
  const checkpoint: AgenticCheckpoint | null = options.jobId
    ? loadAgenticCheckpoint(options.jobId)
    : null;
  if (checkpoint?.timeline) return checkpoint.timeline as WavespeedTimelineAsset;
  const artifacts = checkpoint?.artifacts || {};
  const providerTasks = checkpoint?.providerTasks || {};
  const persist = (stage: AgenticStage, progress: number) => {
    if (!options.jobId) return;
    saveAgenticCheckpoint({
      jobId: options.jobId,
      input,
      currentStage: stage,
      completedStages: checkpoint?.completedStages || [],
      progress,
      artifacts,
      providerTasks,
      updatedAt: new Date().toISOString(),
    });
  };
  const ratio = input.aspectRatio || ratioForPlatform(input.platform);
  options.onStage?.("planning");
  options.onProgress?.(0.05);

  const screenplay = (artifacts.screenplay as AgenticScreenplay | undefined) || await createScreenplay(input);
  artifacts.screenplay = screenplay;
  persist("planning", 0.2);
  options.onProgress?.(0.2);

  const characterContext = screenplay.characters
    .map((character) => `${character.name}: ${character.description}`)
    .join("; ");
  const model = getAgenticVideoModel(input.videoModel);
  if (input.referenceImages?.length && "maxReferences" in model && input.referenceImages.length > model.maxReferences) {
    throw new Error(`${model.label} accepts at most ${model.maxReferences} reference images`);
  }
  const client = new WavespeedClient();
  const runWaveSpeedTask = async (
    key: string,
    stage: AgenticStage,
    progress: number,
    submit: () => Promise<{ predictionId: string; resultUrl: string }>
  ): Promise<string> => {
    let task = providerTasks[key];
    if (!task) {
      task = await submit();
      providerTasks[key] = task;
      persist(stage, progress);
    }
    const output = (await client.pollPrediction(task.resultUrl))[0];
    if (!output) throw new Error(`WaveSpeed task ${key} completed without an output URL`);
    return output;
  };
  const tempDir = path.join(process.cwd(), "public", "assets-temp");
  fs.mkdirSync(tempDir, { recursive: true });
  const pipelineId = uuidv4();
  const elements: WavespeedTimelineAsset["elements"] = [];
  const audio: WavespeedTimelineAsset["audio"] = [];
  const text: WavespeedTimelineAsset["text"] = [];
  const words: NonNullable<WavespeedTimelineAsset["words"]> = [];
  let offsetMs = 0;
  const sceneSpan = 0.75 / screenplay.scenes.length;
  options.onStage?.("character_design");
  const generatedCharacterReferences = (artifacts.characterReferences as string[] | undefined) || [];
  for (let characterIndex = generatedCharacterReferences.length; characterIndex < screenplay.characters.slice(0, 5).length; characterIndex++) {
    const character = screenplay.characters[characterIndex];
    generatedCharacterReferences.push(await runWaveSpeedTask(
      `character-${characterIndex}`,
      "character_design",
      0.2,
      () => client.triggerModel(AGENTIC_IMAGE_MODEL, {
        prompt: `Character reference portrait for ${character.name}. ${character.description}. ${screenplay.visualStyle}. Neutral expression, clear facial features, consistent wardrobe, clean background, no text.`,
        aspect_ratio: "3:4",
        resolution: "2k",
        output_format: "png",
      })
    ));
    artifacts.characterReferences = generatedCharacterReferences;
    persist("character_design", 0.2);
  }
  const identityReferences = [
    ...(input.referenceImages || []),
    ...generatedCharacterReferences,
  ].slice(0, 10);

  for (let index = 0; index < screenplay.scenes.length; index++) {
    const scene = screenplay.scenes[index];
    const savedScenes = (artifacts.scenes as SavedSceneArtifact[] | undefined) || [];
    const savedScene = savedScenes[index];
    options.onStage?.("voice");
    const audioPath = path.join(tempDir, `${pipelineId}-scene-${index}.mp3`);
    const sceneWords = savedScene?.words || await generateSpeechWithElevenLabs(scene.script, audioPath, input.voice);
    const lastWord = sceneWords[sceneWords.length - 1];
    const spokenDuration = Math.ceil((lastWord?.end || 4) + 0.35);
    const duration = Math.min(model.maxDuration, Math.max(model.minDuration, spokenDuration));
    if (spokenDuration > model.maxDuration) {
      throw new Error(`Scene ${index + 1} narration is ${spokenDuration}s but ${model.label} supports at most ${model.maxDuration}s`);
    }
    const relativeAudioUrl = savedScene?.audioUrl || await uploadAsset(fs.readFileSync(audioPath), `${pipelineId}-scene-${index}.mp3`, "audio/mpeg");
    const publicAudioUrl = relativeAudioUrl.startsWith("/")
      ? `${options.assetBaseUrl || ""}${relativeAudioUrl}`
      : relativeAudioUrl;
    if (input.lipSync && !options.assetBaseUrl) {
      throw new Error("lipSync requires a public RENDER_SERVER_BASE_URL");
    }
    const imagePrompt = `${scene.visual}. ${screenplay.visualStyle}. Character continuity: ${characterContext}. Aspect ratio ${ratio}. No readable text.`;
    options.onStage?.("keyframes");
    const imageUrl = savedScene?.imageUrl || await runWaveSpeedTask(
      `scene-${index}-keyframe`,
      "keyframes",
      0.2 + sceneSpan * index,
      () => identityReferences.length
        ? client.triggerModel(AGENTIC_IMAGE_EDIT_MODEL, {
            prompt: `${imagePrompt} Preserve the identities and defining visual details from the references.`,
            images: identityReferences,
            aspect_ratio: ratio,
            resolution: "2k",
            output_format: "png",
          })
        : client.triggerModel(AGENTIC_IMAGE_MODEL, {
            prompt: imagePrompt,
            aspect_ratio: ratio,
            resolution: "2k",
            output_format: "png",
          })
    );
    const videoPrompt = `${scene.visual} Camera: ${scene.camera}. Sound: ${scene.audio}. Style: ${screenplay.visualStyle}.`;
    let videoUrl: string;
    let actualDuration = duration;
    options.onStage?.("video_generation");
    if (savedScene?.videoUrl) {
      videoUrl = savedScene.videoUrl;
      actualDuration = savedScene.actualDuration;
    } else if (input.lipSync) {
      videoUrl = await runWaveSpeedTask(
        `scene-${index}-lipsync`,
        "video_generation",
        0.2 + sceneSpan * index,
        () => client.triggerModel("wavespeed-ai/infinitetalk", {
          image: imageUrl,
          audio: publicAudioUrl,
          prompt: `${scene.camera}. ${scene.visual}`,
          resolution: input.videoResolution === "720p" ? "720p" : "480p",
          seed: -1,
        })
      );
      actualDuration = spokenDuration;
    } else {
      const request = buildAgenticVideoRequest({
        modelId: input.videoModel,
        prompt: videoPrompt,
      keyframeUrl: imageUrl,
      referenceImages: identityReferences,
        aspectRatio: ratio,
        resolution: input.videoResolution,
        duration,
        generateAudio: false,
      });
      videoUrl = await runWaveSpeedTask(
        `scene-${index}-video`,
        "video_generation",
        0.2 + sceneSpan * index,
        () => client.triggerModel(request.endpoint, request.payload)
      );
      actualDuration = request.duration;
    }
    savedScenes[index] = {
      imageUrl,
      videoUrl,
      audioUrl: relativeAudioUrl,
      words: sceneWords,
      spokenDuration,
      actualDuration,
    };
    artifacts.scenes = savedScenes;
    persist("video_generation", 0.2 + sceneSpan * (index + 1));
    const startMs = offsetMs;
    const endMs = startMs + actualDuration * 1000;
    elements.push({ videoUrl, startMs, endMs });
    audio.push({ startMs, endMs: Math.min(endMs, startMs + spokenDuration * 1000), audioUrl: publicAudioUrl });
    for (const word of sceneWords) {
      words.push({
        word: word.word,
        startMs: startMs + Math.round(word.start * 1000),
        endMs: startMs + Math.round(word.end * 1000),
      });
    }
    text.push({ startMs, endMs: Math.min(endMs, startMs + 2500), text: scene.title, position: "center" });
    offsetMs = endMs;
    options.onProgress?.(0.2 + sceneSpan * (index + 1));
  }
  options.onStage?.("music");
  let musicUrl = artifacts.musicUrl as string | undefined;
  if (!musicUrl) {
    musicUrl = await runWaveSpeedTask(
      "music",
      "music",
      0.95,
      () => client.triggerMusic(
        `Instrumental background score for ${input.title}. ${screenplay.visualStyle}. ${input.tone}. No vocals.`
      )
    );
    artifacts.musicUrl = musicUrl;
    persist("music", 0.97);
  }
  options.onStage?.("quality_check");
  if (elements.length !== screenplay.scenes.length) {
    throw new Error(`Quality check failed: generated ${elements.length}/${screenplay.scenes.length} scenes`);
  }
  if (elements.some((element, index) => element.startMs >= element.endMs || (index > 0 && element.startMs !== elements[index - 1].endMs))) {
    throw new Error("Quality check failed: scene timing is invalid or contains gaps");
  }
  if (!audio.length || !words.length || !musicUrl) {
    throw new Error("Quality check failed: voice, word timing, or music artifact is missing");
  }
  options.onStage?.("assembly");
  const dimensions = getAspectRatioDimensions(ratio);
  options.onProgress?.(1);
  const timeline: WavespeedTimelineAsset = {
    shortTitle: screenplay.title.slice(0, 60),
    elements,
    text,
    audio,
    words,
    music: [{ audioUrl: musicUrl, volume: 0.1 }],
    ...dimensions,
  };
  if (options.jobId) {
    saveAgenticCheckpoint({
      jobId: options.jobId,
      input,
      currentStage: "assembly",
      completedStages: ["planning", "character_design", "voice", "keyframes", "video_generation", "music", "quality_check", "assembly"],
      progress: 1,
      artifacts,
      providerTasks,
      timeline,
      updatedAt: new Date().toISOString(),
    });
  }
  return timeline;
}
