import { loadFont } from "@remotion/google-fonts/BreeSerif";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Background, BackgroundElement } from "./components/Background";
import Subtitle from "./components/Subtitle";

const { fontFamily } = loadFont();
const FPS = 30;
const INTRO_DURATION = 0; // No intro

export interface TimelineData {
  shortTitle: string;
  elements: Array<BackgroundElement>;
  text: Array<{
    startMs: number;
    endMs: number;
    text: string;
    position: "top" | "bottom" | "center";
  }>;
  audio: Array<{
    startMs: number;
    endMs: number;
    audioUrl: string;
  }>;
}

export const AIVideo: React.FC<{ timeline: TimelineData }> = ({ timeline }) => {
  if (!timeline) {
    return <AbsoluteFill style={{ backgroundColor: "black" }} />;
  }

  const calculateFrameTiming = (
    startMs: number,
    endMs: number,
    options: { includeIntro?: boolean; addIntroOffset?: boolean } = {}
  ) => {
    const { includeIntro = false, addIntroOffset = false } = options;
    const startFrame = (startMs * FPS) / 1000 + (addIntroOffset ? INTRO_DURATION : 0);
    const duration = ((endMs - startMs) * FPS) / 1000 + (includeIntro ? INTRO_DURATION : 0);
    return { startFrame: Math.floor(startFrame), duration: Math.max(1, Math.floor(duration)) };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      {timeline.elements.map((element, index) => {
        const { startFrame, duration } = calculateFrameTiming(
          element.startMs,
          element.endMs,
          { includeIntro: index === 0 }
        );

        return (
          <Sequence
            key={`element-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={3 * FPS}
          >
            <Background item={element} />
          </Sequence>
        );
      })}

      {timeline.text.map((element, index) => {
        const { startFrame, duration } = calculateFrameTiming(
          element.startMs,
          element.endMs,
          { addIntroOffset: true }
        );

        return (
          <Sequence
            key={`text-${index}`}
            from={startFrame}
            durationInFrames={duration}
          >
            <Subtitle text={element.text} />
          </Sequence>
        );
      })}

      {timeline.audio.map((element, index) => {
        const { startFrame, duration } = calculateFrameTiming(
          element.startMs,
          element.endMs,
          { addIntroOffset: true }
        );

        const resolvedAudioSrc =
          element.audioUrl.startsWith("http://") || element.audioUrl.startsWith("https://")
            ? element.audioUrl
            : staticFile(element.audioUrl);

        return (
          <Sequence
            key={`audio-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={3 * FPS}
          >
            <Audio src={resolvedAudioSrc} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
