import { loadFont } from "@remotion/google-fonts/Bangers";
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
const WORDS_PER_PAGE = 4;
/** White flash length at every hard cut (comic panel turn). */
const FLASH_FRAMES = Math.round(0.08 * FPS);

export interface WordCaption {
  word: string;
  startMs: number;
  endMs: number;
}

export interface ComicDramaElement {
  videoUrl: string;
  startMs: number;
  endMs: number;
}

export interface ComicDramaTimelineData {
  shortTitle: string;
  elements: ComicDramaElement[];
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
 * Comic-panel cut flash: a quick white pop right after each hard cut
 * (skipped on the very first frame so the episode doesn't open with a flash).
 */
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 1 || frame > FLASH_FRAMES) {
    return null;
  }
  const opacity = interpolate(frame, [1, FLASH_FRAMES], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity }} />;
};

/**
 * Dialogue strip in comic style: bold caption bar pinned near the bottom,
 * active word highlighted in amber.
 */
const DialogueStrip: React.FC<{ words: WordCaption[] }> = ({ words }) => {
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
            bottom: 150,
            left: 60,
            right: 60,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            borderRadius: 18,
            border: "3px solid rgba(255,255,255,0.92)",
            backgroundColor: "rgba(10,10,16,0.72)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.55)",
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
                  fontSize: 58,
                  lineHeight: 1.15,
                  letterSpacing: 2,
                  color: active ? "#FBBF24" : "#FFFFFF",
                  WebkitTextStroke: "1.5px #10101A",
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

/**
 * Opening title card overlay — the episode title slams in over shot 1
 * manga-style, then fades out.
 */
const TitleCard: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const showFrames = 2 * FPS + FLASH_FRAMES;
  if (frame > showFrames) return null;

  const slam = interpolate(frame, [4, 16], [1.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const fadeOut = interpolate(frame, [showFrames - FPS, showFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <h1
        style={{
          fontFamily,
          fontSize: title.length > 22 ? 110 : 150,
          color: "#FFFFFF",
          WebkitTextStroke: "5px #10101A",
          textShadow: "0 10px 34px rgba(0,0,0,0.75)",
          transform: `scale(${slam}) rotate(-3deg)`,
          textAlign: "center",
          margin: 0,
          padding: "0 70px",
        }}
      >
        {title}
      </h1>
    </AbsoluteFill>
  );
};

export const ComicDramaVideo: React.FC<{ timeline: ComicDramaTimelineData }> = ({
  timeline,
}) => {
  if (!timeline) {
    return <AbsoluteFill style={{ backgroundColor: "black" }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* 1. Interpolated clips, butt-jointed hard cuts */}
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
            key={`comic-video-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={3 * FPS}
          >
            {clip}
            <CutFlash />
          </Sequence>
        );
      })}

      {/* 2. Cinematic vignette to keep the dialogue strip readable */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 26%, transparent 66%, rgba(0,0,0,0.62) 100%)",
        }}
      />

      {/* 3. Episode title card over the first shots */}
      {timeline.shortTitle ? <TitleCard title={timeline.shortTitle} /> : null}

      {/* 4. Dialogue captions — comic strip when timestamps exist */}
      {timeline.words && timeline.words.length > 0 ? (
        <DialogueStrip words={timeline.words} />
      ) : (
        timeline.text.map((element, index) => {
          const startFrame = toFrame(element.startMs);
          const duration = Math.max(1, toFrame(element.endMs) - startFrame);

          return (
            <Sequence
              key={`comic-text-${index}`}
              from={startFrame}
              durationInFrames={duration}
            >
              <Subtitle text={element.text} />
            </Sequence>
          );
        })
      )}

      {/* 5. Dialogue audio */}
      {timeline.audio.map((element, index) => {
        const startFrame = toFrame(element.startMs);
        const duration = Math.max(1, toFrame(element.endMs) - startFrame);

        return (
          <Sequence
            key={`comic-audio-${index}`}
            from={startFrame}
            durationInFrames={duration}
          >
            <Audio src={resolveAsset(element.audioUrl)} />
          </Sequence>
        );
      })}

      {/* 6. Background music overlay */}
      {timeline.music &&
        timeline.music.map((track, index) => {
          return (
            <Audio
              key={`comic-music-${index}`}
              src={resolveAsset(track.audioUrl)}
              volume={track.volume || 0.12}
            />
          );
        })}
    </AbsoluteFill>
  );
};
