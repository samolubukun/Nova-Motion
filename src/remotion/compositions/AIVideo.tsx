import { loadFont } from "@remotion/google-fonts/BreeSerif";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Background, BackgroundElement } from "./components/Background";
import Subtitle from "./components/Subtitle";

const { fontFamily } = loadFont();
const FPS = 30;
const INTRO_DURATION = 30; // 1 second intro

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
      <Sequence durationInFrames={INTRO_DURATION}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              fontSize: 80,
              lineHeight: "90px",
              width: "87%",
              color: "black",
              fontFamily,
              textTransform: "uppercase",
              backgroundColor: "yellow",
              paddingTop: 20,
              paddingBottom: 20,
              border: "10px solid black",
            }}
          >
            {timeline.shortTitle}
          </div>
        </AbsoluteFill>
      </Sequence>

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
