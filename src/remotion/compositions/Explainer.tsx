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
  textColor: z.string().default("#212529"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("fadeIn"),
  fontSize: z.number().optional(),
  stepNumber: z.number().optional(),
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

export const explainerSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type ExplainerProps = z.infer<typeof explainerSchema>;

// Professional explainer scene with step indicators
const ExplainerScene: React.FC<SceneProps & { durationInFrames: number; sceneIndex: number }> = ({
  text,
  bgColor,
  textColor,
  fontSize,
  stepNumber,
  durationInFrames,
  sceneIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const defaultFontSize = Math.min(width, height) * 0.05;
  const actualFontSize = fontSize || defaultFontSize;

  // Smooth fade in animation
  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const translateY = interpolate(frame, [0, fps * 0.5], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Step number animation
  const stepScale = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const displayStepNumber = stepNumber ?? sceneIndex + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        padding: "5%",
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
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 36,
            fontWeight: "bold",
            fontFamily: "Inter, system-ui, sans-serif",
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
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {text}
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
