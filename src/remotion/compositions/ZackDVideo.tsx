import { loadFont } from "@remotion/google-fonts/BreeSerif";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import Subtitle from "./components/Subtitle";

const { fontFamily } = loadFont();
const FPS = 30;
const WORDS_PER_PAGE = 3;
const TRANSITION_FRAMES = Math.round(0.35 * FPS); // matches assemble.py's 0.35s cuts

export interface WordCaption {
  word: string;
  startMs: number;
  endMs: number;
}

export interface ZackDElement {
  videoUrl: string;
  startMs: number;
  endMs: number;
  /** Slow push-in crop across the shot (the skill's impact zoom). */
  zoomImpact?: boolean;
  /** Entry transition (the skill's xfade cycle). */
  transition?: "fade" | "wipeleft" | "slideleft" | "circleopen";
}

export interface ZackDTimelineData {
  shortTitle: string;
  elements: ZackDElement[];
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

/**
 * Entry-transition styles ported from the skill's ffmpeg xfade cycle
 * (fade / wipeleft / slideleft / circleopen), rendered natively by Remotion.
 */
const EntryTransition: React.FC<{ transition: ZackDElement["transition"]; children: React.ReactNode }> = ({
  transition,
  children,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (!transition || progress >= 1) {
    return <>{children}</>;
  }

  switch (transition) {
    case "wipeleft":
      return (
        <AbsoluteFill style={{ clipPath: `inset(0 ${100 - progress * 100}% 0 0)` }}>
          {children}
        </AbsoluteFill>
      );
    case "slideleft":
      return (
        <AbsoluteFill style={{ transform: `translateX(${(1 - progress) * 100}%)` }}>
          {children}
        </AbsoluteFill>
      );
    case "circleopen":
      return (
        <AbsoluteFill style={{ clipPath: `circle(${progress * 85}% at 50% 50%)` }}>
          {children}
        </AbsoluteFill>
      );
    case "fade":
    default:
      return <AbsoluteFill style={{ opacity: progress }}>{children}</AbsoluteFill>;
  }
};

/** Slow impact push-in across the whole clip (scale 1 -> 1.15, centered). */
const ImpactZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(
    frame,
    [0, Math.max(TRANSITION_FRAMES, durationInFrames)],
    [1.02, 1.15],
    { extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) }
  );
  return <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
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

export const ZackDVideo: React.FC<{ timeline: ZackDTimelineData }> = ({
  timeline,
}) => {
  if (!timeline) {
    return <AbsoluteFill style={{ backgroundColor: "black" }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* 1. 3D motion clips with entry transitions + impact zooms */}
      {timeline.elements.map((element, index) => {
        const startFrame = toFrame(element.startMs);
        const duration = Math.max(1, toFrame(element.endMs) - startFrame);
        const clip = (
          <Video
            src={resolveAsset(element.videoUrl)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
          />
        );

        return (
          <Sequence
            key={`zackd-video-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={3 * FPS}
          >
            <EntryTransition transition={element.transition}>
              {element.zoomImpact ? <ImpactZoom>{clip}</ImpactZoom> : clip}
            </EntryTransition>
          </Sequence>
        );
      })}

      {/* 2. Cinematic vignette to keep captions readable */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 62%, rgba(0,0,0,0.6) 100%)",
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
              key={`zackd-text-${index}`}
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
            key={`zackd-audio-${index}`}
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
              key={`zackd-music-${index}`}
              src={resolveAsset(track.audioUrl)}
              volume={track.volume || 0.12}
            />
          );
        })}
    </AbsoluteFill>
  );
};
