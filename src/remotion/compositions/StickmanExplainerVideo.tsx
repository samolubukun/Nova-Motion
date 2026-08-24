import { loadFont } from "@remotion/google-fonts/Poppins";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import Subtitle from "./components/Subtitle";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
});
const FPS = 30;

export interface WordCaption {
  word: string;
  startMs: number;
  endMs: number;
}

export interface StickmanElement {
  /** Scene illustration (slideshow mode) — animated with a Ken Burns zoom. */
  imageUrl?: string;
  /** Rendered clip (animated mode). */
  videoUrl?: string;
  startMs: number;
  endMs: number;
}

export interface StickmanTimelineData {
  shortTitle: string;
  elements: StickmanElement[];
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
 * Ken Burns zoom on a still — the free "slideshow" animation ported from
 * Stickman Studio's ffmpeg zoompan (z=1 → 1.1 over the scene duration),
 * with the zoom direction alternating per scene for variety.
 */
const KenBurnsImage: React.FC<{ src: string; flip: boolean }> = ({ src, flip }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  const eased = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.quad),
  });
  const scale = flip ? 1.1 - 0.1 * eased : 1 + 0.1 * eased;
  const driftX = (flip ? 1 : -1) * 2.2 * eased;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={resolveAsset(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${driftX}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Scene label chip in the top-left — the storyboard scene title, hand-drawn
 * notebook vibe.
 */
const SceneLabel: React.FC<{ title: string; index: number }> = ({ title, index }) => {
  const frame = useCurrentFrame();
  const pop = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 160 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        left: 54,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 24px",
        borderRadius: 999,
        backgroundColor: "rgba(17,17,17,0.82)",
        border: "3px solid #FFFFFF",
        boxShadow: "0 8px 26px rgba(0,0,0,0.35)",
        transform: `scale(${pop})`,
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 700,
          color: "#FFFFFF",
          backgroundColor: "#111111",
          border: "2.5px solid #FFFFFF",
          borderRadius: 999,
          width: 46,
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {index + 1}
      </span>
      <span style={{ fontFamily, fontSize: 32, fontWeight: 600, color: "#FFFFFF", letterSpacing: 0.5 }}>
        {title}
      </span>
    </div>
  );
};

/**
 * Narration caption strip — lower-third white text with a heavy black stroke
 * (Stickman Studio's subtitle look), active word popping slightly.
 */
const NarrationCaptions: React.FC<{ words: WordCaption[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;

  const activeIdx = words.findIndex((w) => timeMs >= w.startMs && timeMs < w.endMs);
  if (!words.length || activeIdx < 0) return null;

  // Show a sliding window of ~7 words around the active one.
  const WINDOW = 7;
  const pageStart = Math.max(0, Math.min(activeIdx - Math.floor(WINDOW / 2), words.length - WINDOW));
  const windowWords = words.slice(pageStart, pageStart + WINDOW);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 60,
          right: 60,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 14,
          rowGap: 4,
          textAlign: "center",
        }}
      >
        {windowWords.map((w, i) => {
          const active = pageStart + i === activeIdx;
          return (
            <span
              key={pageStart + i}
              style={{
                fontFamily,
                fontSize: active ? 62 : 54,
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#FFFFFF",
                WebkitTextStroke: "2.5px #111111",
                paintOrder: "stroke fill",
                textShadow: "3px 3px 0 rgba(0,0,0,0.45)",
                transform: active ? "scale(1.06)" : "scale(1)",
                transition: "none",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Opening title card — the video title slides up over scene 1 like a
 * whiteboard marker being written, then fades away.
 */
const TitleCard: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  if (frame > 2.6 * FPS) return null;

  const slide = interpolate(frame, [2, 18], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(frame, [2 * FPS, 2.6 * FPS], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <h1
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: title.length > 26 ? 92 : 120,
          color: "#FFFFFF",
          WebkitTextStroke: "6px #111111",
          paintOrder: "stroke fill",
          textShadow: "8px 8px 0 rgba(0,0,0,0.35)",
          transform: `translateY(${slide}px) rotate(-2deg)`,
          textAlign: "center",
          margin: 0,
          padding: "0 70px",
          maxWidth: "88%",
        }}
      >
        {title}
      </h1>
    </AbsoluteFill>
  );
};

export const StickmanExplainerVideo: React.FC<{ timeline: StickmanTimelineData }> = ({
  timeline,
}) => {
  if (!timeline) {
    return <AbsoluteFill style={{ backgroundColor: "#FAFAF7" }} />;
  }

  let visualSceneIndex = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF7" }}>
      {/* 1. Scene visuals: Ken Burns stills or animated clips */}
      {timeline.elements.map((element, index) => {
        const startFrame = toFrame(element.startMs);
        const duration = Math.max(1, toFrame(element.endMs) - startFrame);
        const sceneIndex = visualSceneIndex++;

        return (
          <Sequence
            key={`stickman-visual-${index}`}
            from={startFrame}
            durationInFrames={duration}
            premountFor={2 * FPS}
          >
            {element.videoUrl ? (
              <Video
                src={resolveAsset(element.videoUrl)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                muted
              />
            ) : element.imageUrl ? (
              <KenBurnsImage src={element.imageUrl} flip={sceneIndex % 2 === 1} />
            ) : null}
            <SceneLabel title={`Scene ${sceneIndex + 1}`} index={sceneIndex} />
          </Sequence>
        );
      })}

      {/* 2. Paper-grain vignette for the hand-drawn feel */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 58%, rgba(20,20,20,0.16) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 3. Video title over the opening scene */}
      {timeline.shortTitle ? <TitleCard title={timeline.shortTitle} /> : null}

      {/* 4. Narration captions — karaoke when timestamps exist */}
      {timeline.words && timeline.words.length > 0 ? (
        <NarrationCaptions words={timeline.words} />
      ) : (
        timeline.text.map((element, index) => {
          const startFrame = toFrame(element.startMs);
          const duration = Math.max(1, toFrame(element.endMs) - startFrame);

          return (
            <Sequence
              key={`stickman-text-${index}`}
              from={startFrame}
              durationInFrames={duration}
            >
              <Subtitle text={element.text} />
            </Sequence>
          );
        })
      )}

      {/* 5. Narration audio */}
      {timeline.audio.map((element, index) => {
        const startFrame = toFrame(element.startMs);
        const duration = Math.max(1, toFrame(element.endMs) - startFrame);

        return (
          <Sequence
            key={`stickman-audio-${index}`}
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
              key={`stickman-music-${index}`}
              src={resolveAsset(track.audioUrl)}
              volume={track.volume || 0.12}
            />
          );
        })}
    </AbsoluteFill>
  );
};
