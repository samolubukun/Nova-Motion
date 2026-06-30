import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";

// Scene schema for explainer videos
const sceneSchema = z.object({
  startSec: z.number(),
  durationSec: z.number(),
  text: z.string(),
  bgColor: z.string().default("#f8f9fa"),
  bgColorTo: z.string().optional(),
  textColor: z.string().default("#212529"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("fadeIn"),
  transition: z.enum(["none", "fade", "slideUp", "slideDown", "crossfade", "wipe"]).default("none").optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  stepNumber: z.number().optional(),
  audioUrl: z.string().optional(),
  words: z.array(z.object({
    word: z.string(),
    start: z.number(),
    end: z.number(),
  })).optional(),
});

const scriptSchema = z.object({
  title: z.string(),
  durationSec: z.number(),
  fps: z.number().default(30),
  width: z.number().default(1920),
  height: z.number().default(1080),
  scenes: z.array(sceneSchema),
  musicUrl: z.string().optional(),
});

export const explainerSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type ExplainerProps = z.infer<typeof explainerSchema>;

// Contrast checking utility
function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const cleaned = hex.replace("#", "");
    const r = parseInt(cleaned.substring(0, 2), 16) / 255;
    const g = parseInt(cleaned.substring(2, 4), 16) / 255;
    const b = parseInt(cleaned.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Helper to adjust color
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Professional explainer scene with step indicators
const ExplainerScene: React.FC<SceneProps & { durationInFrames: number; sceneIndex: number }> = ({
  text,
  bgColor,
  bgColorTo,
  textColor,
  fontSize,
  stepNumber,
  transition = "none",
  fontFamily,
  words,
  durationInFrames,
  sceneIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Dynamic font sizing
  const defaultFontSize = Math.min(width, height) * (text.length > 100 ? 0.045 : (text.length > 50 ? 0.05 : 0.055));
  const actualFontSize = fontSize || defaultFontSize;

  // Smooth fade in/out animation values
  let opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  let translateY = interpolate(frame, [0, fps * 0.5], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Slide-to-slide transition overrides
  const TRANSITION_FRAMES = 10;
  if (frame < TRANSITION_FRAMES) {
    const progress = frame / TRANSITION_FRAMES;
    if (transition === "fade" || transition === "crossfade") {
      opacity = progress;
    } else if (transition === "slideUp") {
      translateY = interpolate(progress, [0, 1], [100, 0]);
      opacity = progress;
    } else if (transition === "slideDown") {
      translateY = interpolate(progress, [0, 1], [-100, 0]);
      opacity = progress;
    }
  } else if (frame > durationInFrames - TRANSITION_FRAMES) {
    const progress = (durationInFrames - frame) / TRANSITION_FRAMES;
    if (transition === "fade" || transition === "crossfade") {
      opacity = progress;
    } else if (transition === "slideUp") {
      translateY = interpolate(progress, [0, 1], [-100, 0]);
      opacity = progress;
    } else if (transition === "slideDown") {
      translateY = interpolate(progress, [0, 1], [100, 0]);
      opacity = progress;
    }
  }

  // Step number scale
  const stepScale = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const displayStepNumber = stepNumber ?? sceneIndex + 1;

  // Auto-contrast styling guard
  const contrastRatio = getContrastRatio(bgColor, textColor);
  const textShadowStyle = contrastRatio < 4.0 
    ? "0px 4px 12px rgba(0,0,0,0.85), 0px 2px 4px rgba(0,0,0,0.5)" 
    : "none";

  // Gradient background selection
  const gradientAngle = interpolate(frame, [0, durationInFrames], [120, 240]);
  const backgroundStyle = bgColorTo
    ? `linear-gradient(${gradientAngle}deg, ${bgColor}, ${bgColorTo})`
    : `linear-gradient(${gradientAngle}deg, ${bgColor}, ${adjustColor(bgColor, -20)})`;

  const currentTimeSec = frame / fps;

  return (
    <AbsoluteFill
      style={{
        background: backgroundStyle,
        justifyContent: "center",
        alignItems: "center",
        padding: "5%",
        overflow: "hidden",
      }}
    >
      {/* Step indicator */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: `translateX(-50%) scale(${stepScale})`,
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "#4361ee",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(67, 97, 238, 0.3)",
          opacity,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 36,
            fontWeight: "bold",
            fontFamily: fontFamily || "Outfit, Inter, system-ui, sans-serif",
          }}
        >
          {displayStepNumber}
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          marginTop: 60,
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: "80%",
        }}
      >
        <div
          style={{
            color: textColor,
            fontSize: actualFontSize,
            fontWeight: 600,
            fontFamily: fontFamily || "Outfit, Inter, system-ui, sans-serif",
            textAlign: "center",
            lineHeight: 1.5,
            textShadow: textShadowStyle,
          }}
        >
          {words && words.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 14px" }}>
              {words.map((w, i) => {
                const isActive = currentTimeSec >= w.start && currentTimeSec <= w.end;
                return (
                  <span
                    key={i}
                    style={{
                      color: isActive ? "#4361ee" : textColor,
                      transform: isActive ? "scale(1.12)" : "scale(1.0)",
                      transition: "all 0.12s cubic-bezier(0.16, 1, 0.3, 1)",
                      display: "inline-block",
                    }}
                  >
                    {w.word}
                  </span>
                );
              })}
            </div>
          ) : (
            text
          )}
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "10%",
          right: "10%",
          height: 6,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(frame / durationInFrames) * 100}%`,
            height: "100%",
            backgroundColor: "#4361ee",
            borderRadius: 3,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Main Explainer composition
export const Explainer: React.FC<ExplainerProps> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTimeSec = frame / fps;

  // Dynamic Audio Ducking calculations
  const isSpeaking = script.scenes.some(
    (scene) =>
      scene.audioUrl &&
      currentTimeSec >= scene.startSec &&
      currentTimeSec <= scene.startSec + scene.durationSec
  );
  const musicVolume = isSpeaking ? 0.03 : 0.14;

  return (
    <AbsoluteFill>
      {script.musicUrl && (
        <Audio
          src={
            script.musicUrl.startsWith("http://") || script.musicUrl.startsWith("https://")
              ? script.musicUrl
              : staticFile(script.musicUrl)
          }
          volume={musicVolume}
        />
      )}
      {script.scenes.map((scene, idx) => {
        const startFrame = Math.round(scene.startSec * fps);
        const durationInFrames = Math.round(scene.durationSec * fps);

        return (
          <Sequence
            key={idx}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <ExplainerScene
              {...scene}
              durationInFrames={durationInFrames}
              sceneIndex={idx}
            />
            {scene.audioUrl && (
              <Audio
                src={
                  scene.audioUrl.startsWith("http://") || scene.audioUrl.startsWith("https://")
                    ? scene.audioUrl
                    : staticFile(scene.audioUrl)
                }
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
