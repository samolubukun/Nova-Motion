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

// Scene schema for text animation
const sceneSchema = z.object({
  startSec: z.number(),
  durationSec: z.number(),
  text: z.string(),
  bgColor: z.string().default("#0f0f23"),
  textColor: z.string().default("#00d4ff"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("typewriter"),
  fontSize: z.number().optional(),
  audioUrl: z.string().optional(),
});

const scriptSchema = z.object({
  title: z.string(),
  durationSec: z.number(),
  fps: z.number().default(30),
  width: z.number().default(1920),
  height: z.number().default(1080),
  scenes: z.array(sceneSchema),
});

export const textAnimationSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type TextAnimationProps = z.infer<typeof textAnimationSchema>;

// Kinetic typography scene
const KineticScene: React.FC<SceneProps & { durationInFrames: number }> = ({
  text,
  bgColor,
  textColor,
  fontSize,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const defaultFontSize = Math.min(width, height) * 0.1;
  const actualFontSize = fontSize || defaultFontSize;

  // Split text into words for individual animation
  const words = text.split(" ");
  const framesPerWord = Math.max(10, Math.floor(durationInFrames / words.length));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.3em",
          padding: "0 10%",
        }}
      >
        {words.map((word, idx) => {
          const wordStart = idx * framesPerWord * 0.7;
          const progress = interpolate(frame - wordStart, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const translateY = interpolate(progress, [0, 1], [50, 0], {
            easing: Easing.out(Easing.cubic),
          });

          const opacity = interpolate(progress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <span
              key={idx}
              style={{
                color: textColor,
                fontSize: actualFontSize,
                fontWeight: "bold",
                fontFamily: "Inter, system-ui, sans-serif",
                opacity,
                transform: `translateY(${translateY}px)`,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Main TextAnimation composition
export const TextAnimation: React.FC<TextAnimationProps> = ({ script }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
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
