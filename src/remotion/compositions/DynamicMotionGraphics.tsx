/**
 * DynamicMotionGraphics — Universal JSON-driven Remotion composition.
 *
 * Instead of looking up 200+ pre-coded scene components by name, each slide in
 * the storyboard is a self-describing JSON descriptor.  A single DynamicSlide
 * component reads the descriptor and renders it — text, charts, lists, stats —
 * using flexible inline element renderers.  The AI only needs to produce valid
 * JSON; it never has to know which React component to call.
 */

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: inter } = loadInter();

// ─── Easing helpers ──────────────────────────────────────────────────────────
const eOut = Easing.bezier(0.16, 1, 0.3, 1);
const eOvershoot = Easing.bezier(0.34, 1.56, 0.64, 1);

function lerp(
  frame: number,
  range: [number, number],
  output: [number, number],
  easing?: (t: number) => number
) {
  return interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

// ─── Schema Types ────────────────────────────────────────────────────────────

export interface DynamicBackground {
  type: "solid" | "gradient" | "grid" | "mesh" | "radial" | "noise";
  from?: string;   // primary / start color
  to?: string;     // secondary / end color
  angle?: number;  // gradient angle in degrees (default 135)
}

export interface DynamicElement {
  type:
    | "title"
    | "subtitle"
    | "body"
    | "label"
    | "list"
    | "barChart"
    | "pieChart"
    | "stat"
    | "counter"
    | "divider"
    | "badge"
    | "highlight";
  /** Text for title / subtitle / body / label / badge */
  text?: string;
  /** List items (for type: "list") */
  items?: string[];
  /** Primary accent color for this element */
  color?: string;
  /** Text color override */
  textColor?: string;
  /** Font size override in px */
  fontSize?: number;
  /**
   * Entry animation for text elements
   * "fadeIn" | "slideUp" | "slideLeft" | "glitch" | "typewriter" | "scale"
   */
  animation?: string;
  /** Stagger delay in frames relative to slide start */
  delay?: number;

  // Chart-specific
  title?: string;
  subtitle?: string;
  data?: Array<{ label: string; value: number; color?: string }>;

  // Counter-specific
  targetNumber?: number;
  prefix?: string;
  suffix?: string;
  unit?: string;

  // Stat-specific
  value?: string;
  label?: string;
}

export interface DynamicSlideDescriptor {
  /** Duration of this slide in frames (30fps) */
  durationFrames: number;
  /** Background descriptor */
  background?: DynamicBackground;
  /** Ordered list of visual elements */
  elements?: DynamicElement[];
  /** Narration text — used for TTS by the pipeline */
  narration?: string;
}

export interface DynamicStoryboard {
  shortTitle: string;
  slides: DynamicSlideDescriptor[];
  audio?: Array<{ startMs: number; endMs: number; audioUrl: string }>;
  music?: Array<{ audioUrl: string; volume?: number }>;
  width?: number;
  height?: number;
}

// ─── Background Renderer ─────────────────────────────────────────────────────

const BackgroundLayer: React.FC<{ bg?: DynamicBackground; frame: number }> = ({ bg, frame }) => {
  const from = bg?.from ?? "#0a0a0a";
  const to = bg?.to ?? "#1a1a2e";
  const angle = bg?.angle ?? 135;
  const type = bg?.type ?? "gradient";

  const drift = Math.sin(frame * 0.015) * 10;

  let background = `linear-gradient(${angle}deg, ${from}, ${to})`;

  if (type === "solid") {
    background = from;
  } else if (type === "radial") {
    background = `radial-gradient(ellipse at ${50 + drift * 0.3}% ${50 + drift * 0.2}%, ${from} 0%, ${to} 70%)`;
  } else if (type === "mesh") {
    background = `
      radial-gradient(ellipse at 20% 30%, ${from}88 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, ${to}66 0%, transparent 50%),
      linear-gradient(135deg, #0a0a0a 0%, #12121e 100%)
    `;
  }

  return (
    <AbsoluteFill style={{ background }}>
      {type === "grid" && (
        <AbsoluteFill
          style={{
            backgroundImage: `
              linear-gradient(${from}20 1px, transparent 1px),
              linear-gradient(90deg, ${from}20 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.6,
          }}
        />
      )}
      {type === "noise" && (
        <AbsoluteFill
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                ${from}08 3px,
                ${from}08 4px
              )
            `,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ─── Element Renderers ───────────────────────────────────────────────────────

const TitleEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = el.delay ?? 0;
  const anim = el.animation ?? "slideUp";
  const fs = el.fontSize ?? (base * 10);
  const color = el.textColor ?? el.color ?? "#ffffff";

  let opacity = 1;
  let transform = "none";

  if (anim === "fadeIn" || anim === "slideUp" || anim === "slideLeft") {
    opacity = lerp(frame, [delay, delay + 25], [0, 1], eOut);
    const tx = anim === "slideLeft" ? lerp(frame, [delay, delay + 30], [-60, 0], eOut) : 0;
    const ty = anim === "slideUp" ? lerp(frame, [delay, delay + 30], [40, 0], eOut) : 0;
    transform = `translate(${tx}px, ${ty}px)`;
  } else if (anim === "scale") {
    const s = lerp(frame, [delay, delay + 30], [0.6, 1], eOvershoot);
    opacity = lerp(frame, [delay, delay + 20], [0, 1]);
    transform = `scale(${s})`;
  } else if (anim === "glitch") {
    opacity = lerp(frame, [delay, delay + 15], [0, 1]);
    const glitch = frame > delay + 15 && Math.sin(frame * 3.7) > 0.85;
    const gx = glitch ? (Math.sin(frame * 7.3) - 0.5) * 12 : 0;
    transform = `translateX(${gx}px)`;
  } else if (anim === "typewriter") {
    opacity = lerp(frame, [delay, delay + 10], [0, 1]);
  }

  const text = el.text ?? "";

  return (
    <div
      style={{
        fontFamily: inter,
        fontSize: fs,
        fontWeight: 800,
        color,
        lineHeight: 1.1,
        opacity,
        transform,
        letterSpacing: "-0.5px",
        textShadow: el.color ? `0 0 40px ${el.color}40` : undefined,
      }}
    >
      {anim === "typewriter"
        ? text.slice(0, Math.floor(lerp(frame, [delay + 5, delay + 60], [0, text.length])))
        : text}
    </div>
  );
};

const SubtitleEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = (el.delay ?? 0) + 15;
  const opacity = lerp(frame, [delay, delay + 20], [0, 1], eOut);
  const ty = lerp(frame, [delay, delay + 25], [20, 0], eOut);
  const color = el.textColor ?? el.color ?? "#a1a1aa";

  return (
    <div
      style={{
        fontFamily: inter,
        fontSize: el.fontSize ?? (base * 5),
        fontWeight: 400,
        color,
        lineHeight: 1.5,
        opacity,
        transform: `translateY(${ty}px)`,
        marginTop: base * 1.5,
      }}
    >
      {el.text}
    </div>
  );
};

const BodyEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = el.delay ?? 20;
  const opacity = lerp(frame, [delay, delay + 20], [0, 1], eOut);

  return (
    <div
      style={{
        fontFamily: inter,
        fontSize: el.fontSize ?? (base * 4),
        fontWeight: 400,
        color: el.textColor ?? "#71717a",
        lineHeight: 1.7,
        opacity,
        marginTop: base * 1.5,
        maxWidth: "80%",
      }}
    >
      {el.text}
    </div>
  );
};

const LabelEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = el.delay ?? 0;
  const opacity = lerp(frame, [delay, delay + 15], [0, 1], eOut);
  const color = el.color ?? "#6366f1";

  return (
    <div
      style={{
        fontFamily: inter,
        fontSize: el.fontSize ?? (base * 3.5),
        fontWeight: 600,
        color,
        letterSpacing: 3,
        textTransform: "uppercase",
        opacity,
        marginBottom: base * 1.5,
      }}
    >
      {el.text}
    </div>
  );
};

const BadgeEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = el.delay ?? 0;
  const opacity = lerp(frame, [delay, delay + 15], [0, 1], eOvershoot);
  const s = lerp(frame, [delay, delay + 20], [0.7, 1], eOvershoot);
  const color = el.color ?? "#6366f1";

  return (
    <div
      style={{
        display: "inline-block",
        background: `${color}22`,
        border: `1.5px solid ${color}66`,
        borderRadius: 100,
        padding: `${base * 0.8}px ${base * 2}px`,
        fontFamily: inter,
        fontSize: el.fontSize ?? (base * 3.5),
        fontWeight: 600,
        color,
        opacity,
        transform: `scale(${s})`,
        marginBottom: base * 1.5,
      }}
    >
      {el.text}
    </div>
  );
};

const HighlightEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = el.delay ?? 0;
  const opacity = lerp(frame, [delay, delay + 20], [0, 1], eOut);
  const color = el.color ?? "#6366f1";
  const w = lerp(frame, [delay + 5, delay + 40], [0, 100], eOut);

  return (
    <div style={{ position: "relative", display: "inline-block", opacity }}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "35%",
          width: `${w}%`,
          background: `${color}40`,
          borderRadius: 2,
          zIndex: 0,
        }}
      />
      <span
        style={{
          fontFamily: inter,
          fontSize: el.fontSize ?? (base * 10),
          fontWeight: 800,
          color: el.textColor ?? "#ffffff",
          position: "relative",
          zIndex: 1,
        }}
      >
        {el.text}
      </span>
    </div>
  );
};

const ListEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const items = el.items ?? [];
  const baseDelay = el.delay ?? 10;
  const color = el.color ?? "#6366f1";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: base * 1.5, marginTop: base * 1.5 }}>
      {items.map((item, i) => {
        const delay = baseDelay + i * 18;
        const opacity = lerp(frame, [delay, delay + 20], [0, 1], eOut);
        const tx = lerp(frame, [delay, delay + 25], [-40, 0], eOut);

        return (
          <div
            key={`list-${i}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: base * 2,
              opacity,
              transform: `translateX(${tx}px)`,
            }}
          >
            <div
              style={{
                width: base * 1.2,
                height: base * 1.2,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
                marginTop: base * 1.5,
                boxShadow: `0 0 10px ${color}80`,
              }}
            />
            <span
              style={{
                fontFamily: inter,
                fontSize: el.fontSize ?? (base * 4.5),
                fontWeight: 500,
                color: el.textColor ?? "#e4e4e7",
                lineHeight: 1.5,
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const BarChartEl: React.FC<{ el: DynamicElement; frame: number; fps: number; base: number }> = ({
  el,
  frame,
  fps,
  base,
}) => {
  const data = el.data ?? [];
  const delay = el.delay ?? 0;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const titleOpacity = lerp(frame, [delay, delay + 20], [0, 1]);

  return (
    <div style={{ width: "100%", marginTop: base * 2 }}>
      {el.title && (
        <div
          style={{
            fontFamily: inter,
            fontSize: base * 5,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: base,
            opacity: titleOpacity,
          }}
        >
          {el.title}
        </div>
      )}
      {el.subtitle && (
        <div
          style={{
            fontFamily: inter,
            fontSize: base * 3.5,
            color: "#71717a",
            marginBottom: base * 2.5,
            opacity: titleOpacity,
          }}
        >
          {el.subtitle}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-end", gap: base * 1.5, height: base * 30 }}>
        {data.map((item, i) => {
          const barDelay = delay + 20 + i * 8;
          const progress = spring({
            frame: frame - barDelay,
            fps,
            config: { damping: 14, stiffness: 90 },
          });
          const barH = (item.value / maxVal) * (base * 25) * progress;
          const barColor = item.color ?? el.color ?? "#6366f1";

          return (
            <div
              key={`bar-${i}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
            >
              <div
                style={{
                  fontFamily: inter,
                  fontSize: base * 3,
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: base,
                  opacity: progress,
                }}
              >
                {Math.round(item.value * progress)}
              </div>
              <div
                style={{
                  width: "100%",
                  height: barH,
                  background: `linear-gradient(to top, ${barColor}, ${barColor}bb)`,
                  borderRadius: "6px 6px 0 0",
                  boxShadow: `0 0 16px ${barColor}50`,
                }}
              />
              <div
                style={{
                  fontFamily: inter,
                  fontSize: base * 2.8,
                  color: "#71717a",
                  marginTop: base,
                  textAlign: "center",
                  opacity: progress,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PieChartEl: React.FC<{ el: DynamicElement; frame: number; fps: number; base: number }> = ({
  el,
  frame,
  fps,
  base,
}) => {
  const data = el.data ?? [];
  const delay = el.delay ?? 0;
  const radius = base * 16;
  const cx = base * 20;
  const cy = base * 20;

  const prog = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 70 },
  });

  let currentAngle = -90;
  const defaultColors = ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#ef4444", "#22c55e"];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: base * 4, marginTop: base * 2 }}>
      <svg width={base * 40} height={base * 40} style={{ flexShrink: 0 }}>
        {data.map((item, i) => {
          const angle = (item.value / 100) * 360 * prog;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = cx + radius * Math.cos(startRad);
          const y1 = cy + radius * Math.sin(startRad);
          const x2 = cx + radius * Math.cos(endRad);
          const y2 = cy + radius * Math.sin(endRad);
          const largeArc = angle > 180 ? 1 : 0;
          const c = item.color ?? defaultColors[i % defaultColors.length];

          return (
            <path
              key={`pie-${i}`}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={c}
              stroke="#0a0a0a"
              strokeWidth={3}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={base * 9} fill="#0a0a0a" />
        <text x={cx} y={cy + (base * 1.5)} textAnchor="middle" fill="#ffffff" fontSize={base * 4.5} fontWeight="bold" fontFamily={inter}>
          {Math.round(prog * 100)}%
        </text>
      </svg>
      <div style={{ flex: 1 }}>
        {el.title && (
          <div style={{ fontFamily: inter, fontSize: base * 4.5, fontWeight: 700, color: "#ffffff", marginBottom: base * 2 }}>
            {el.title}
          </div>
        )}
        {data.map((item, i) => {
          const c = item.color ?? defaultColors[i % defaultColors.length];
          const itemOpacity = lerp(frame, [delay + 20 + i * 10, delay + 35 + i * 10], [0, 1], eOut);
          return (
            <div key={`pl-${i}`} style={{ display: "flex", alignItems: "center", gap: base * 1.5, marginBottom: base * 1.5, opacity: itemOpacity }}>
              <div style={{ width: base * 1.5, height: base * 1.5, borderRadius: base * 0.4, background: c }} />
              <span style={{ fontFamily: inter, fontSize: base * 3.5, color: "#e4e4e7" }}>{item.label}</span>
              <span style={{ fontFamily: inter, fontSize: base * 3.5, fontWeight: 700, color: "#ffffff", marginLeft: "auto" }}>
                {item.value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = el.delay ?? 0;
  const color = el.color ?? "#6366f1";
  const s = lerp(frame, [delay, delay + 30], [0.7, 1], eOvershoot);
  const opacity = lerp(frame, [delay, delay + 20], [0, 1], eOut);
  const labelOpacity = lerp(frame, [delay + 20, delay + 35], [0, 1], eOut);

  return (
    <div style={{ textAlign: "center", opacity }}>
      <div
        style={{
          fontFamily: inter,
          fontSize: el.fontSize ?? (base * 18),
          fontWeight: 900,
          color: el.textColor ?? color,
          lineHeight: 1,
          transform: `scale(${s})`,
          textShadow: `0 0 60px ${color}60`,
        }}
      >
        {el.prefix}{el.value ?? el.text}{el.suffix}
      </div>
      {(el.label ?? el.unit) && (
        <div
          style={{
            fontFamily: inter,
            fontSize: base * 4,
            fontWeight: 500,
            color: "#71717a",
            marginTop: base * 1.5,
            opacity: labelOpacity,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {el.label ?? el.unit}
        </div>
      )}
    </div>
  );
};

const CounterEl: React.FC<{ el: DynamicElement; frame: number; fps: number; base: number }> = ({
  el,
  frame,
  fps,
  base,
}) => {
  const delay = el.delay ?? 0;
  const color = el.color ?? "#6366f1";
  const target = el.targetNumber ?? 100;

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 25, stiffness: 60 },
  });

  const current = Math.round(progress * target);
  const opacity = lerp(frame, [delay, delay + 15], [0, 1]);

  return (
    <div style={{ textAlign: "center", opacity }}>
      {el.title && (
        <div style={{ fontFamily: inter, fontSize: base * 4, color: "#71717a", marginBottom: base * 1.5, textTransform: "uppercase", letterSpacing: 2 }}>
          {el.title}
        </div>
      )}
      <div
        style={{
          fontFamily: inter,
          fontSize: el.fontSize ?? (base * 18),
          fontWeight: 900,
          color,
          lineHeight: 1,
          textShadow: `0 0 80px ${color}50`,
        }}
      >
        {el.prefix}{current.toLocaleString()}{el.suffix ?? el.unit}
      </div>
      {el.label && (
        <div style={{ fontFamily: inter, fontSize: base * 4, color: "#71717a", marginTop: base * 1.5 }}>
          {el.label}
        </div>
      )}
    </div>
  );
};

const DividerEl: React.FC<{ el: DynamicElement; frame: number; base: number }> = ({ el, frame, base }) => {
  const delay = el.delay ?? 0;
  const color = el.color ?? "#27272a";
  const w = lerp(frame, [delay, delay + 40], [0, 100], eOut);

  return (
    <div
      style={{
        width: `${w}%`,
        height: Math.max(2, base * 0.2),
        background: color,
        borderRadius: 1,
        margin: `${base * 2}px 0`,
        boxShadow: el.color ? `0 0 10px ${el.color}60` : undefined,
      }}
    />
  );
};

// ─── Element Dispatcher ──────────────────────────────────────────────────────

const DynamicElementRenderer: React.FC<{ el: DynamicElement; frame: number; fps: number; videoWidth: number }> = ({
  el,
  frame,
  fps,
  videoWidth,
}) => {
  const base = videoWidth / 100;
  switch (el.type) {
    case "title":
      return <TitleEl el={el} frame={frame} base={base} />;
    case "subtitle":
      return <SubtitleEl el={el} frame={frame} base={base} />;
    case "body":
      return <BodyEl el={el} frame={frame} base={base} />;
    case "label":
      return <LabelEl el={el} frame={frame} base={base} />;
    case "badge":
      return <BadgeEl el={el} frame={frame} base={base} />;
    case "highlight":
      return <HighlightEl el={el} frame={frame} base={base} />;
    case "list":
      return <ListEl el={el} frame={frame} base={base} />;
    case "barChart":
      return <BarChartEl el={el} frame={frame} fps={fps} base={base} />;
    case "pieChart":
      return <PieChartEl el={el} frame={frame} fps={fps} base={base} />;
    case "stat":
      return <StatEl el={el} frame={frame} base={base} />;
    case "counter":
      return <CounterEl el={el} frame={frame} fps={fps} base={base} />;
    case "divider":
      return <DividerEl el={el} frame={frame} base={base} />;
    default:
      return null;
  }
};

// ─── Slide Renderer ──────────────────────────────────────────────────────────

const DynamicSlide: React.FC<{ slide: DynamicSlideDescriptor }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const elements = slide.elements ?? [];
  const pad = Math.min(width, height) * 0.08;

  return (
    <AbsoluteFill>
      {/* Background */}
      <BackgroundLayer bg={slide.background} frame={frame} />

      {/* Content overlay */}
      <AbsoluteFill
        style={{
          padding: pad,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {elements.map((el, i) => (
          <DynamicElementRenderer key={`el-${i}`} el={el} frame={frame} fps={fps} videoWidth={width} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

export const DynamicMotionGraphics: React.FC<{ storyboard: DynamicStoryboard }> = ({
  storyboard,
}) => {
  if (!storyboard || !storyboard.slides?.length) {
    return (
      <AbsoluteFill
        style={{
          background: "#0a0a0a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#71717a", fontFamily: inter, fontSize: 28 }}>
          No slides in storyboard
        </div>
      </AbsoluteFill>
    );
  }

  let cumulativeFrames = 0;

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* 1. Slides */}
      {storyboard.slides.map((slide, index) => {
        const startFrame = cumulativeFrames;
        cumulativeFrames += slide.durationFrames;

        return (
          <Sequence
            key={`slide-${index}`}
            from={startFrame}
            durationInFrames={slide.durationFrames}
          >
            <DynamicSlide slide={slide} />
          </Sequence>
        );
      })}

      {/* 2. Voiceover narration tracks */}
      {storyboard.audio?.map((clip, index) => {
        const startFrame = Math.floor((clip.startMs * 30) / 1000);
        const duration = Math.ceil(((clip.endMs - clip.startMs) * 30) / 1000);
        const audioSrc =
          clip.audioUrl.startsWith("http://") || clip.audioUrl.startsWith("https://")
            ? clip.audioUrl
            : staticFile(clip.audioUrl);

        return (
          <Sequence
            key={`vo-${index}`}
            from={startFrame}
            durationInFrames={Math.max(1, duration)}
          >
            <Audio src={audioSrc} />
          </Sequence>
        );
      })}

      {/* 3. Background music */}
      {storyboard.music?.map((track, index) => {
        const musicSrc =
          track.audioUrl.startsWith("http://") || track.audioUrl.startsWith("https://")
            ? track.audioUrl
            : staticFile(track.audioUrl);

        return (
          <Audio key={`bgm-${index}`} src={musicSrc} volume={track.volume ?? 0.08} />
        );
      })}
    </AbsoluteFill>
  );
};
