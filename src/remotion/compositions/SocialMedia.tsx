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

// Scene schema for social media (vertical format)
const sceneSchema = z.object({
  startSec: z.number(),
  durationSec: z.number(),
  text: z.string(),
  bgColor: z.string().default("#1a1a2e"),
  textColor: z.string().default("#ffffff"),
  animation: z
    .enum(["fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "bounce", "typewriter"])
    .default("bounce"),
  fontSize: z.number().optional(),
  audioUrl: z.string().optional(),
});

const scriptSchema = z.object({
  title: z.string(),
  durationSec: z.number(),
  fps: z.number().default(30),
  width: z.number().default(1080),
  height: z.number().default(1920),
  scenes: z.array(sceneSchema),
});

export const socialMediaSchema = z.object({
  script: scriptSchema,
});

type SceneProps = z.infer<typeof sceneSchema>;
type SocialMediaProps = z.infer<typeof socialMediaSchema>;

// Social media optimized scene with captions style
const SocialScene: React.FC<SceneProps & { durationInFrames: number }> = ({
  text,
  bgColor,
  textColor,
  fontSize,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Larger text for mobile/social viewing
  const defaultFontSize = Math.min(width, height) * 0.06;
  const actualFontSize = fontSize || defaultFontSize;

  // Bounce animation
  const bounce = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.8,
    },
  });

  const scale = interpolate(bounce, [0, 1], [0.8, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Gradient background for social appeal
  const gradientAngle = interpolate(frame, [0, durationInFrames], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${bgColor}, ${adjustColor(bgColor, 40)})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Caption box style popular on social media */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: 20,
          padding: "30px 40px",
          maxWidth: "85%",
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <div
          style={{
            color: textColor,
            fontSize: actualFontSize,
            fontWeight: "bold",
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Helper to lighten/darken color
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Main SocialMedia composition
export const SocialMedia: React.FC<SocialMediaProps> = ({ script }) => {
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
