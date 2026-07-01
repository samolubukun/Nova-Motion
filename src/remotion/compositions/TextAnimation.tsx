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

const sceneSchema = z.object({
  startSec: z.number(),
  durationSec: z.number(),
  text: z.string(),
  bgColor: z.string().default("#0f0f23"),
  bgColorTo: z.string().optional(),
  textColor: z.string().default("#00d4ff"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("typewriter"),
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
  width: z.number().default(1920),
  height: z.number().default(1080),
  scenes: z.array(sceneSchema),
  musicUrl: z.string().optional(),
});

export const textAnimationSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type TextAnimationProps = z.infer<typeof textAnimationSchema>;

function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const cleaned = hex.replace("#", "");
    const r = parseInt(cleaned.substring(0, 2), 16) / 255;
    const g = parseInt(cleaned.substring(2, 4), 16) / 255;
    const b = parseInt(cleaned.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.722;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const KineticScene: React.FC<SceneProps & { durationInFrames: number }> = ({
  text,
  bgColor,
  bgColorTo,
  textColor,
  transition = "none",
  fontFamily,
  fontSize,
  words: apiWords,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const defaultFontSize = Math.min(width, height) * (text.length > 100 ? 0.07 : (text.length > 50 ? 0.085 : 0.1));
  const actualFontSize = fontSize || defaultFontSize;

  const currentTimeSec = frame / fps;

  const finalWords = apiWords && apiWords.length > 0 
    ? apiWords 
    : text.split(" ").map((w, idx) => {
        const framesPerWord = Math.max(10, Math.floor(durationInFrames / text.split(" ").length));
        return {
          word: w,
          start: (idx * framesPerWord * 0.7) / fps,
          end: ((idx + 1) * framesPerWord * 0.7) / fps,
        };
      });

  let opacity = 1;
  let translateY = 0;

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

  const contrastRatio = getContrastRatio(bgColor, textColor);
  const textShadowStyle = contrastRatio < 4.0 
    ? "0px 4px 12px rgba(0,0,0,0.85), 0px 2px 4px rgba(0,0,0,0.5)" 
    : "none";

  const gradientAngle = interpolate(frame, [0, durationInFrames], [120, 240]);
  const backgroundStyle = bgColorTo
    ? `linear-gradient(${gradientAngle}deg, ${bgColor}, ${bgColorTo})`
    : `linear-gradient(${gradientAngle}deg, ${bgColor}, ${adjustColor(bgColor, 30)})`;

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
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.25em 0.4em",
          padding: "0 10%",
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {(() => {
          let capitalizedFirst = false;
          return finalWords.map((w, idx) => {
            const wordProgress = interpolate(currentTimeSec - w.start, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const wordY = interpolate(wordProgress, [0, 1], [40, 0], {
              easing: Easing.out(Easing.cubic),
            });

            const wordOpacity = interpolate(wordProgress, [0, 0.5], [0, 1], {
              extrapolateRight: "clamp",
            });

            const isActive = currentTimeSec >= w.start && currentTimeSec <= w.end;
            let displayWord = w.word;
            if (!capitalizedFirst && /[a-zA-Z]/.test(displayWord)) {
              const firstLetterIdx = displayWord.search(/[a-zA-Z]/);
              if (firstLetterIdx !== -1) {
                displayWord = displayWord.slice(0, firstLetterIdx) + displayWord.charAt(firstLetterIdx).toUpperCase() + displayWord.slice(firstLetterIdx + 1);
                capitalizedFirst = true;
              }
            }

            return (
              <span
                key={idx}
                style={{
                  color: isActive ? "#facc15" : textColor,
                  fontSize: actualFontSize,
                  fontWeight: "bold",
                  fontFamily: fontFamily || "Outfit, Inter, system-ui, sans-serif",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${isActive ? 1.12 : 1.0})`,
                  transition: "all 0.12s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "inline-block",
                  textShadow: textShadowStyle,
                }}
              >
                {displayWord}
              </span>
            );
          });
        })()}
      </div>
    </AbsoluteFill>
  );
};

export const TextAnimation: React.FC<TextAnimationProps> = ({ script }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTimeSec = frame / fps;

  const isSpeaking = script.scenes.some(
    (scene) =>
      scene.audioUrl &&
      currentTimeSec >= scene.startSec &&
      currentTimeSec <= scene.startSec + scene.durationSec
  );
  const musicVolume = isSpeaking ? 0.02 : 0.08;

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
            <KineticScene {...scene} durationInFrames={durationInFrames} />
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
