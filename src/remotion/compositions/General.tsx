import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";

// Scene schema
const sceneSchema = z.object({
  startSec: z.number(),
  durationSec: z.number(),
  text: z.string(),
  bgColor: z.string().default("#1a1a2e"),
  bgColorTo: z.string().optional(),
  textColor: z.string().default("#ffffff"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("fadeIn"),
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

// Script schema for General composition
const scriptSchema = z.object({
  title: z.string(),
  durationSec: z.number(),
  fps: z.number().default(30),
  width: z.number().default(1920),
  height: z.number().default(1080),
  scenes: z.array(sceneSchema),
  musicUrl: z.string().optional(),
});

export const generalSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type GeneralProps = z.infer<typeof generalSchema>;

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

// Animated scene component
const AnimatedScene: React.FC<SceneProps & { durationInFrames: number }> = ({
  text,
  bgColor,
  bgColorTo,
  textColor,
  animation,
  transition = "none",
  fontFamily,
  fontSize,
  words,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Dynamic font sizing
  const defaultFontSize = Math.min(width, height) * (text.length > 100 ? 0.06 : (text.length > 50 ? 0.07 : 0.08));
  const actualFontSize = fontSize || defaultFontSize;

  // Base animation styles
  let scale = 1;
  let opacity = 1;
  let translateY = 0;
  let translateX = 0;
  let clipPercent = 0;

  // Scene entrance animations
  if (animation === "fadeIn") {
    opacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideUp") {
    translateY = interpolate(frame, [0, fps * 0.5], [100, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    opacity = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideDown") {
    translateY = interpolate(frame, [0, fps * 0.5], [-100, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    opacity = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideLeft") {
    translateX = interpolate(frame, [0, fps * 0.5], [200, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    opacity = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "slideRight") {
    translateX = interpolate(frame, [0, fps * 0.5], [-200, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    opacity = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: "clamp" });
  } else if (animation === "scale") {
    const s = spring({
      frame,
      fps,
      config: { damping: 12, stiffness: 200 },
    });
    scale = s;
  } else if (animation === "bounce") {
    const b = spring({
      frame,
      fps,
      config: { damping: 8, stiffness: 150, mass: 0.5 },
    });
    translateY = interpolate(b, [0, 1], [50, 0]);
  } else if (animation === "typewriter") {
    const charsToShow = Math.floor(
      interpolate(frame, [0, durationInFrames * 0.6], [0, text.length], {
        extrapolateRight: "clamp",
      })
    );
    clipPercent = 100 - (charsToShow / text.length) * 100;
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
    ? `linear-gradient(${gradientAngle}deg, ${bgColor}, ${bgColorTo})`
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
          color: textColor,
          fontSize: actualFontSize,
          fontWeight: "bold",
          fontFamily: fontFamily || "Outfit, Inter, system-ui, sans-serif",
          textAlign: "center",
          padding: "0 10%",
          lineHeight: 1.25,
          textShadow: textShadowStyle,
          transform: `scale(${scale}) translateY(${translateY}px) translateX(${translateX}px)`,
          opacity,
          clipPath: animation === "typewriter" ? `inset(0 ${clipPercent}% 0 0)` : "none",
        }}
      >
        {words && words.length > 0 && animation !== "typewriter" ? (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px" }}>
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
    </AbsoluteFill>
  );
};

// Main General composition
export const General: React.FC<GeneralProps> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTimeSec = frame / fps;

  // Audio ducking calculations
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
            <AnimatedScene {...scene} durationInFrames={durationInFrames} />
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
