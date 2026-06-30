import { loadFont } from "@remotion/google-fonts/BreeSerif";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import Subtitle from "./components/Subtitle";

const { fontFamily } = loadFont();
const FPS = 30;
const INTRO_DURATION = 30; // 1 second intro

export interface StockTimelineData {
  shortTitle: string;
  elements: Array<{
    videoUrl: string;
    startMs: number;
    endMs: number;
  }>;
  text: Array<{
    startMs: number;
    endMs: number;
    text: string;
    position: string;
  }>;
  audio: Array<{
    startMs: number;
    endMs: number;
    audioUrl: string;
  }>;
  music?: Array<{
    audioUrl: string;
    volume: number;
  }>;
}

export const StockVideo: React.FC<{ timeline: StockTimelineData }> = ({ timeline }) => {
  if (!timeline) {
    return <AbsoluteFill style={{ backgroundColor: "black" }} />;
  }

  const { durationInFrames } = useVideoConfig();

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
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* 1. Intro Screen */}
      <Sequence durationInFrames={INTRO_DURATION}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            zIndex: 10,
            backgroundColor: "black",
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

      {/* 2. Video Background Elements */}
      {timeline.elements.map((element, index) => {
        const { startFrame, duration } = calculateFrameTiming(
          element.startMs,
          element.endMs,
          { includeIntro: index === 0 }
        );

        return (
          <Sequence
            key={`stock-video-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={3 * FPS}
          >
            <Video
              src={element.videoUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              muted
            />
          </Sequence>
        );
      })}

      {/* 3. Text Captions */}
      {timeline.text.map((element, index) => {
        const { startFrame, duration } = calculateFrameTiming(
          element.startMs,
          element.endMs,
          { addIntroOffset: true }
        );

        return (
          <Sequence
            key={`stock-text-${index}`}
            from={startFrame}
            durationInFrames={duration}
          >
            <Subtitle text={element.text} />
          </Sequence>
        );
      })}

      {/* 4. Deepgram Narrator Audio Clips */}
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
            key={`stock-audio-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={3 * FPS}
          >
            <Audio src={resolvedAudioSrc} />
          </Sequence>
        );
      })}

      {/* 5. Music Overlay */}
      {timeline.music &&
        timeline.music.map((track, index) => {
          return (
            <Audio
              key={`stock-music-${index}`}
              src={track.audioUrl}
              volume={track.volume || 0.15}
            />
          );
        })}
    </AbsoluteFill>
  );
};
