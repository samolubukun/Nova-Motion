import { loadFont } from "@remotion/google-fonts/BreeSerif";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import Subtitle from "./components/Subtitle";

const { fontFamily } = loadFont();
const FPS = 30;
const WORDS_PER_PAGE = 3;

export interface WordCaption {
  word: string;
  startMs: number;
  endMs: number;
}

export interface WavespeedTimelineData {
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
  words?: WordCaption[];
}

const toFrame = (ms: number) => Math.floor((ms * FPS) / 1000);

const resolveAsset = (src: string): string => {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return staticFile(src);
};

const KineticCaptions: React.FC<{ words: WordCaption[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;

  const activeIdx = words.findIndex((w) => timeMs >= w.startMs && timeMs < w.endMs);

  const pages: WordCaption[][] = [];
  for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
    pages.push(words.slice(i, i + WORDS_PER_PAGE));
  }
  const activePage = activeIdx < 0 ? -1 : Math.floor(activeIdx / WORDS_PER_PAGE);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      {pages.map((page, pIdx) => (
        <div
          key={pIdx}
          style={{
            position: "absolute",
            bottom: 180,
            left: 0,
            right: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            padding: "0 60px",
            textAlign: "center",
            opacity: pIdx === activePage ? 1 : 0,
          }}
        >
          {page.map((w, i) => {
            const globalIdx = pIdx * WORDS_PER_PAGE + i;
            const active = globalIdx === activeIdx;
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 56,
                  lineHeight: 1.25,
                  color: active ? "#FBBF24" : "#FFFFFF",
                  textShadow:
                    "0 3px 16px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)",
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const WavespeedVideo: React.FC<{ timeline: WavespeedTimelineData }> = ({
  timeline,
}) => {
  if (!timeline) {
    return <AbsoluteFill style={{ backgroundColor: "black" }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* 1. AI B-roll video clips */}
      {timeline.elements.map((element, index) => {
        const startFrame = toFrame(element.startMs);
        const duration = Math.max(1, toFrame(element.endMs) - startFrame);

        return (
          <Sequence
            key={`wavespeed-video-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={3 * FPS}
          >
            <Video
              src={resolveAsset(element.videoUrl)}
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

      {/* 2. Cinematic gradient to keep captions readable */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 32%, transparent 62%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* 3. Captions — kinetic word highlight when timestamps exist */}
      {timeline.words && timeline.words.length > 0 ? (
        <KineticCaptions words={timeline.words} />
      ) : (
        timeline.text.map((element, index) => {
          const startFrame = toFrame(element.startMs);
          const duration = Math.max(1, toFrame(element.endMs) - startFrame);

          return (
            <Sequence
              key={`wavespeed-text-${index}`}
              from={startFrame}
              durationInFrames={duration}
            >
              <Subtitle text={element.text} />
            </Sequence>
          );
        })
      )}

      {/* 4. Narration audio */}
      {timeline.audio.map((element, index) => {
        const startFrame = toFrame(element.startMs);
        const duration = Math.max(1, toFrame(element.endMs) - startFrame);

        return (
          <Sequence
            key={`wavespeed-audio-${index}`}
            from={startFrame}
            durationInFrames={duration}
          >
            <Audio src={resolveAsset(element.audioUrl)} />
          </Sequence>
        );
      })}

      {/* 5. Background music overlay */}
      {timeline.music &&
        timeline.music.map((track, index) => {
          return (
            <Audio
              key={`wavespeed-music-${index}`}
              src={resolveAsset(track.audioUrl)}
              volume={track.volume || 0.12}
            />
          );
        })}
    </AbsoluteFill>
  );
};
