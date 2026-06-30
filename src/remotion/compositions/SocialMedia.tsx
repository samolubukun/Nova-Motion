import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";

// Scene schema for social media
const sceneSchema = z.object({
  startSec: z.number(),
  durationSec: z.number(),
  text: z.string(),
  bgColor: z.string().default("#1a1a2e"),
  bgColorTo: z.string().optional(),
  textColor: z.string().default("#ffffff"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("bounce"),
  transition: z.enum(["none", "fade", "slideUp", "slideDown", "crossfade", "wipe"]).default("none").optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
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
  width: z.number().default(1080),
  height: z.number().default(1920),
  scenes: z.array(sceneSchema),
  musicUrl: z.string().optional(),
});

export const socialMediaSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type SocialMediaProps = z.infer<typeof socialMediaSchema>;

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

const SocialScene: React.FC<SceneProps & { durationInFrames: number }> = ({
  text,
  bgColor,
  bgColorTo,
  textColor,
  fontSize,
  animation,
  transition = "none",
  fontFamily,
  words,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Dynamic font sizing to protect against overlaps
  const defaultFontSize = Math.min(width, height) * (text.length > 100 ? 0.045 : (text.length > 50 ? 0.055 : 0.065));
  const actualFontSize = fontSize || defaultFontSize;

  // Spring animation for entrance
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  let scale = 1;
  let opacity = 1;
  let translateY = 0;
  let translateX = 0;

  // Scene entrance animations
  if (animation === "bounce") {
    scale = interpolate(entranceSpring, [0, 1], [0.8, 1]);
    opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "scale") {
    scale = interpolate(frame, [0, 15], [0.5, 1], { extrapolateRight: "clamp" });
    opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideUp") {
    translateY = interpolate(frame, [0, 15], [100, 0], { extrapolateRight: "clamp" });
    opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideDown") {
    translateY = interpolate(frame, [0, 15], [-100, 0], { extrapolateRight: "clamp" });
    opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideLeft") {
    translateX = interpolate(frame, [0, 15], [150, 0], { extrapolateRight: "clamp" });
    opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideRight") {
    translateX = interpolate(frame, [0, 15], [-150, 0], { extrapolateRight: "clamp" });
    opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "fadeIn") {
    opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  }

  // Slide-to-slide transition overrides
  const TRANSITION_FRAMES = 10;
  if (frame < TRANSITION_FRAMES) {
    const progress = frame / TRANSITION_FRAMES;
    if (transition === "fade" || transition === "crossfade") {
      opacity = progress;
    } else if (transition === "slideUp") {
      translateY = interpolate(progress, [0, 1], [150, 0]);
      opacity = progress;
    } else if (transition === "slideDown") {
      translateY = interpolate(progress, [0, 1], [-150, 0]);
      opacity = progress;
    }
  } else if (frame > durationInFrames - TRANSITION_FRAMES) {
    const progress = (durationInFrames - frame) / TRANSITION_FRAMES;
    if (transition === "fade" || transition === "crossfade") {
      opacity = progress;
    } else if (transition === "slideUp") {
      translateY = interpolate(progress, [0, 1], [-150, 0]);
      opacity = progress;
    } else if (transition === "slideDown") {
      translateY = interpolate(progress, [0, 1], [150, 0]);
      opacity = progress;
    }
  }

  // Auto-contrast styling guard
  const contrastRatio = getContrastRatio(bgColor, textColor);
  const textShadowStyle = contrastRatio < 4.0 
    ? "0px 4px 12px rgba(0,0,0,0.85), 0px 2px 4px rgba(0,0,0,0.5)" 
    : "none";

  // Gradient background selection
  const gradientAngle = interpolate(frame, [0, durationInFrames], [120, 240]);
  const backgroundStyle = bgColorTo
    ? `radial-gradient(circle at center, ${bgColor}, ${bgColorTo})`
    : `linear-gradient(${gradientAngle}deg, ${bgColor}, ${adjustColor(bgColor, 30)})`;

  const currentTimeSec = frame / fps;

  return (
    <AbsoluteFill
      style={{
        background: backgroundStyle,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 24,
          padding: "40px 48px",
          maxWidth: "85%",
          transform: `scale(${scale}) translateY(${translateY}px) translateX(${translateX}px)`,
          opacity,
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            color: textColor,
            fontSize: actualFontSize,
            fontWeight: "bold",
            fontFamily: fontFamily || "Outfit, Inter, system-ui, sans-serif",
            textAlign: "center",
            lineHeight: 1.45,
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
                      color: isActive ? "#facc15" : textColor,
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
    </AbsoluteFill>
  );
};

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export const SocialMedia: React.FC<SocialMediaProps> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTimeSec = frame / fps;

  // Dynamic Audio Ducking calculations: duck background music when voiceover is speaking
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
            <SocialScene {...scene} durationInFrames={durationInFrames} />
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
