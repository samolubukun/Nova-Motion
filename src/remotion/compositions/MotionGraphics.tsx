import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";

// Import dynamic scene components
import { TextGlitch } from "../scenes/TextAnimations/TextGlitch";
import { TextKinetic } from "../scenes/TextAnimations/TextKinetic";
import { TextTypewriter } from "../scenes/TextAnimations/TextTypewriter";
import { DataBarChart } from "../scenes/DataAnimations/DataBarChart";

export interface MotionGraphicsScene {
  type: string;
  durationFrames: number;
  props: any;
}

export interface MotionGraphicsStoryboard {
  shortTitle: string;
  scenes: Array<MotionGraphicsScene>;
  audio?: Array<{
    startMs: number;
    endMs: number;
    audioUrl: string;
  }>;
  music?: Array<{
    audioUrl: string;
    volume?: number;
  }>;
}

// Map scene type string to the actual React component
const SceneResolver: React.FC<{ type: string; props: any }> = ({ type, props }) => {
  switch (type) {
    case "TextGlitch":
      return <TextGlitch {...props} />;
    case "TextKinetic":
      return <TextKinetic {...props} />;
    case "TextTypewriter":
      return <TextTypewriter {...props} />;
    case "DataBarChart":
      return <DataBarChart {...props} />;
    default:
      // Fallback screen if type not found or matched
      return (
        <AbsoluteFill style={{ backgroundColor: "#09090b", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ color: "white", fontSize: 32, fontFamily: "sans-serif" }}>
            Scene: {type}
          </div>
        </AbsoluteFill>
      );
  }
};

export const MotionGraphics: React.FC<{ storyboard: MotionGraphicsStoryboard }> = ({ storyboard }) => {
  if (!storyboard || !storyboard.scenes) {
    return <AbsoluteFill style={{ backgroundColor: "black" }} />;
  }

  let cumulativeFrames = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#09090b" }}>
      {/* 1. Sequence the Motion Graphic Scenes */}
      {storyboard.scenes.map((scene, index) => {
        const startFrame = cumulativeFrames;
        cumulativeFrames += scene.durationFrames;

        return (
          <Sequence
            key={`scene-${index}`}
            from={startFrame}
            durationInFrames={scene.durationFrames}
          >
            <SceneResolver type={scene.type} props={scene.props} />
          </Sequence>
        );
      })}

      {/* 2. Voiceover narration tracks */}
      {storyboard.audio &&
        storyboard.audio.map((clip, index) => {
          const startFrame = Math.floor((clip.startMs * 30) / 1000);
          const duration = Math.ceil(((clip.endMs - clip.startMs) * 30) / 1000);
          
          const resolvedAudioSrc =
            clip.audioUrl.startsWith("http://") || clip.audioUrl.startsWith("https://")
              ? clip.audioUrl
              : staticFile(clip.audioUrl);

          return (
            <Sequence
              key={`vo-${index}`}
              from={startFrame}
              durationInFrames={Math.max(1, duration)}
            >
              <Audio src={resolvedAudioSrc} />
            </Sequence>
          );
        })}

      {/* 3. Background Music tracks */}
      {storyboard.music &&
        storyboard.music.map((track, index) => {
          const resolvedMusicSrc =
            track.audioUrl.startsWith("http://") || track.audioUrl.startsWith("https://")
              ? track.audioUrl
              : staticFile(track.audioUrl);

          return (
            <Audio
              key={`bgm-${index}`}
              src={resolvedMusicSrc}
              volume={track.volume || 0.08}
            />
          );
        })}
    </AbsoluteFill>
  );
};