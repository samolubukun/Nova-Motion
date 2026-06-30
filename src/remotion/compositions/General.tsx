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
  textColor: z.string().default("#ffffff"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("fadeIn"),
  fontSize: z.number().optional(),
  audioUrl: z.string().optional(),
});

// Script schema for General composition
const scriptSchema = z.object({
  title: z.string(),
  durationSec: z.number(),
  fps: z.number().default(30),
  width: z.number().default(1920),
  height: z.number().default(1080),
  scenes: z.array(sceneSchema),
});

export const generalSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type GeneralProps = z.infer<typeof generalSchema>;

// Animated scene component
const AnimatedScene: React.FC<SceneProps & { durationInFrames: number }> = ({
  text,
  bgColor,
  textColor,
  animation,
  fontSize,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Calculate default font size based on video dimensions
  const defaultFontSize = Math.min(width, height) * 0.08;
  const actualFontSize = fontSize || defaultFontSize;

  // Animation calculations
  const getAnimationStyles = (): React.CSSProperties => {
    switch (animation) {
      case "fadeIn": {
        const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
          extrapolateRight: "clamp",
        });
        return { opacity };
      }

      case "slideUp": {
        const translateY = interpolate(frame, [0, fps * 0.5], [100, 0], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });
        return { transform: `translateY(${translateY}px)`, opacity };
      }

      case "slideDown": {
        const translateY = interpolate(frame, [0, fps * 0.5], [-100, 0], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });
        return { transform: `translateY(${translateY}px)`, opacity };
      }

      case "slideLeft": {
        const translateX = interpolate(frame, [0, fps * 0.5], [200, 0], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });
        return { transform: `translateX(${translateX}px)`, opacity };
      }

      case "slideRight": {
        const translateX = interpolate(frame, [0, fps * 0.5], [-200, 0], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });
        return { transform: `translateX(${translateX}px)`, opacity };
      }

      case "scale": {
        const scale = spring({
          frame,
          fps,
          config: {
            damping: 12,
            stiffness: 200,
          },
        });
        return { transform: `scale(${scale})` };
      }

      case "bounce": {
        const bounce = spring({
          frame,
          fps,
          config: {
            damping: 8,
            stiffness: 150,
            mass: 0.5,
          },
        });
        const translateY = interpolate(bounce, [0, 1], [50, 0]);
        return { transform: `translateY(${translateY}px)` };
      }

      case "typewriter": {
        const charsToShow = Math.floor(
          interpolate(frame, [0, durationInFrames * 0.6], [0, text.length], {
            extrapolateRight: "clamp",
          })
        );
        return { clipPath: `inset(0 ${100 - (charsToShow / text.length) * 100}% 0 0)` };
      }

      default:
        return { opacity: 1 };
    }
  };

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
          color: textColor,
          fontSize: actualFontSize,
          fontWeight: "bold",
          fontFamily: "Inter, system-ui, sans-serif",
          textAlign: "center",
          padding: "0 10%",
          lineHeight: 1.2,
          ...getAnimationStyles(),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Main General composition
export const General: React.FC<GeneralProps> = ({ script }) => {
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
