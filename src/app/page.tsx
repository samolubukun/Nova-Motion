'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Film,
  Zap,
  Layers,
  Cpu,
  Tv,
  BarChart3,
  Video,
  Bot,
  Clapperboard,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface ShowcaseMode {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  accentColor: string;
  paramsSummary: string;
}

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const showcaseModes: ShowcaseMode[] = [
    {
      id: 'stock-video',
      title: 'Stock Video Studio',
      subtitle: 'Context-matched Pexels stock video loops, ambient music, and narration.',
      image: '/thumbnails/stock-video.png',
      badge: 'Pexels API',
      accentColor: 'from-amber-500 to-yellow-400',
      paramsSummary: 'Stock Clips • Voiceover • Aspect Ratio',
    },
    {
      id: 'stock-image',
      title: 'Stock Image Studio',
      subtitle: 'Pixabay stock imagery with animated Ken Burns pan/zoom motion.',
      image: '/thumbnails/stock-image.png',
      badge: 'Pixabay Motion',
      accentColor: 'from-cyan-500 to-teal-400',
      paramsSummary: 'Ken Burns Motion • Pixabay Images • Voice',
    },
    {
      id: 'ai-storyboard',
      title: 'AI Storyboard Studio',
      subtitle: 'Multi-scene narrative scripts, gpt-image-2 visual illustrations & narration.',
      image: '/thumbnails/ai-storyboard.png',
      badge: 'GPT-4o + Image-2',
      accentColor: 'from-blue-600 to-cyan-500',
      paramsSummary: 'Multi-Scene Story • Shot Descriptions • Voice',
    },
    {
      id: 'text-to-video',
      title: 'AI Text-to-Video Engine',
      subtitle: 'WaveSpeed Seedance B-roll generation with TTS narration.',
      image: '/thumbnails/text-to-video-new.png',
      badge: 'Seedance AI',
      accentColor: 'from-cyan-400 to-blue-600',
      paramsSummary: 'Seedance B-Roll • Multimodal @Tags • Kinetic Captions',
    },
    {
      id: 'microdrama',
      title: 'MicroDrama Story Engine',
      subtitle: 'Agentic screenplay, character casting, storyboard, and Seedance narrative clips.',
      image: '/thumbnails/microdrama.png',
      badge: 'Agentic Screenwriter',
      accentColor: 'from-amber-500 to-yellow-400',
      paramsSummary: 'Idea / Script Mode • Character Sync • Native Audio',
    },
    {
      id: 'ugc',
      title: 'AI UGC Studio',
      subtitle: 'AI UGC ad studio with up to 7 reference images (@image1) and WaveSpeed lip-sync.',
      image: '/thumbnails/ugc-ad.png',
      badge: 'UGC Ad Studio',
      accentColor: 'from-cyan-500 to-blue-500',
      paramsSummary: 'Veo 3.1 / Seedance 2 / Grok • Lip-Sync • Avatars',
    },
    {
      id: 'agentic-video',
      title: 'Agentic Concept-to-Video',
      subtitle: 'End-to-end campaign brief to screenplay, casting, storyboard, and export.',
      image: '/thumbnails/agentic-video.png',
      badge: 'Full Campaign Agent',
      accentColor: 'from-amber-400 to-cyan-500',
      paramsSummary: 'Brief • Platform Presets • Character Casting',
    },
    {
      id: 'luma',
      title: 'Luma AI Ray 3.2 Studio',
      subtitle: 'Unified Ray 3.2 pipeline — text-to-video, image-to-video, extend, and reframing.',
      image: '/thumbnails/luma-ray.png',
      badge: 'Luma Ray 3.2',
      accentColor: 'from-cyan-400 to-amber-400',
      paramsSummary: 'T2V / I2V • Keyframes • Edit Strength • HDR',
    },
    {
      id: 'vox-video',
      title: 'Vox Paper-Collage Studio',
      subtitle: 'Vox-style paper-collage explainer posters, Seedance motion, and TTS narration.',
      image: '/thumbnails/vox-explainer.png',
      badge: 'Paper Collage',
      accentColor: 'from-amber-500 to-yellow-300',
      paramsSummary: 'Vox Theme • Story Arc • Poster Animation',
    },
    {
      id: 'motion-graphics',
      title: 'Motion Graphics Studio',
      subtitle: 'Dynamic motion graphics, 3D animated bar/pie/line charts, and growth metrics.',
      image: '/thumbnails/motion-graphics.png',
      badge: '3D Chart Engine',
      accentColor: 'from-blue-500 to-cyan-400',
      paramsSummary: '3D Charts • Growth Metrics • Palette Picker',
    },
    {
      id: 'typography-slideshow',
      title: 'Typography & Slideshow Studio',
      subtitle: 'Grouped studio for Explainer, Social Media Reels, General, and Text Animation.',
      image: '/thumbnails/typography-slideshow-new.svg',
      badge: 'Typography Slides',
      accentColor: 'from-teal-400 to-cyan-500',
      paramsSummary: 'Step Numbers • Quotes • Kinetic Highlighting',
    },
  ];

  const isLockedRef = useRef(false);

  // Scroll Lock UX Flow for Carousel (Discrete 1-card step per gesture)
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      // Section must be centered in main viewport (-100px to 150px top offset)
      const isCenteredInView = rect.top >= -100 && rect.top <= 150;

      if (isCenteredInView) {
        if (e.deltaY > 0) {
          // Scrolling DOWN
          if (activeIndex < showcaseModes.length - 1) {
            e.preventDefault();
            if (!isLockedRef.current) {
              isLockedRef.current = true;
              setActiveIndex((prev) => Math.min(prev + 1, showcaseModes.length - 1));
              setTimeout(() => {
                isLockedRef.current = false;
              }, 700);
            }
          }
          // When at last card, scroll unlocks naturally down the page
        } else if (e.deltaY < 0) {
          // Scrolling UP
          if (activeIndex > 0) {
            e.preventDefault();
            if (!isLockedRef.current) {
              isLockedRef.current = true;
              setActiveIndex((prev) => Math.max(prev - 1, 0));
              setTimeout(() => {
                isLockedRef.current = false;
              }, 700);
            }
          }
          // When at first card, scroll unlocks naturally up the page
        }
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, [activeIndex, showcaseModes.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = startX.current - e.clientX;
    if (diff > 50 && activeIndex < showcaseModes.length - 1) {
      setActiveIndex((prev) => prev + 1);
      isDragging.current = false;
    } else if (diff < -50 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      isDragging.current = false;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const features = [
    {
      icon: Clapperboard,
      title: 'Studio Creation Engines',
      description: 'AI storyboards, stock shorts, typography slides, 3D motion graphics, micro drama, UGC ads, Luma Ray 3.2, and Vox collage explainers.',
    },
    {
      icon: Bot,
      title: 'Agentic Scriptwriting',
      description: 'Autonomous LLMs write screenplays, cast consistent characters, plan storyboards, and direct camera motion.',
    },
    {
      icon: Zap,
      title: 'Kinetic Audio Captions',
      description: 'ElevenLabs and Deepgram TTS narration with precise word-level subtitle timing synced to speech.',
    },
    {
      icon: Cpu,
      title: 'Asynchronous Express Queue',
      description: 'Submit video jobs, track real-time 4-step rendering progress, and export HD MP4 outputs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Our Brand Theme Cyan / Amber Glow Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-amber-500/10 blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px]" />
        
        {/* Subtle Diagonal Accent Lines Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/novamotion.png"
              alt="Novamotion Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-white">
            NOVA<span className="text-gradient-gold">MOTION</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#engines" className="hover:text-cyan-300 transition-colors">Studio Engines</a>
          <a href="#architecture" className="hover:text-cyan-300 transition-colors">Architecture</a>
          <Link href="/studio/history" className="hover:text-cyan-300 transition-colors">Media Library</Link>
        </nav>

        {/* Right White Pill CTA Button */}
        <Link
          href="/studio"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-slate-200 font-extrabold text-xs shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <span>Open Studio</span>
          <ArrowUpRight className="w-4 h-4 text-black" />
        </Link>
      </header>

      {/* Syngri-Style Hero Section (Our Cyan/Gold Brand Theme) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Hero Content */}
        <div className="lg:col-span-7 space-y-6 text-left lg:pl-16">
          <h1 className="text-2xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold tracking-tight leading-tight text-white">
            <span className="block whitespace-nowrap">Bring Your Ideas To Life With</span>
            <span className="block whitespace-nowrap text-gradient-hero">
              NovaMotion AI Video Engine
            </span>
          </h1>

          <p className="max-w-xl text-base text-slate-300 leading-relaxed font-normal">
            One prompt. One automated pipeline. Scripted, generated, narrated, and rendered into a finished, platform-ready video.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/studio"
              className="px-7 py-3.5 rounded-full bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-all shadow-xl shadow-cyan-500/20"
            >
              Open Studio
            </Link>

            <a
              href="#engines"
              className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-xs backdrop-blur-md transition-all"
            >
              Explore Engines
            </a>
          </div>
        </div>

        {/* Right Side 3D Glass Sculpture Art */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px]">
          {/* Glass Torus Ambient Glow Backdrop */}
          <div className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-[100px] animate-pulse" />

          {/* 3D Glass Torus Sculpture Graphic (Cyan/Amber Accent Light) */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-cyan-500/20 glass-panel shadow-2xl shadow-cyan-500/20 flex items-center justify-center transform hover:rotate-6 transition-transform duration-700">
            <div className="w-60 h-60 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 border-r-amber-400 border-b-blue-500 border-l-teal-300 animate-[spin_16s_linear_infinite] shadow-inner" />
            <div className="absolute w-44 h-44 rounded-full border-2 border-amber-400/30 border-t-amber-400 border-b-cyan-400 animate-[spin_10s_linear_infinite_reverse]" />
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600/30 via-amber-500/30 to-blue-500/30 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center">
              <Film className="w-10 h-10 text-cyan-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Scroll Lock Carousel Section */}
      <section ref={sectionRef} id="engines" className="relative z-10 max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Studio Creation Engines
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Scroll vertically to step through studio engines. Click any card to launch immediately.
          </p>
        </div>

        {/* 3D Carousel Stage */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative h-[420px] sm:h-[460px] flex items-center justify-center perspective-[1200px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          {showcaseModes.map((mode, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);
            const isVisible = absOffset <= 3;

            if (!isVisible) return null;

            const rotateY = offset * -18;
            const translateX = offset * 240;
            const translateZ = -absOffset * 150;
            const scale = 1 - absOffset * 0.12;
            const opacity = 1 - absOffset * 0.25;
            const zIndex = 20 - absOffset;

            return (
              <Link
                key={mode.id}
                href={`/studio/mode/${mode.id}`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
                className={`absolute w-[270px] sm:w-[320px] h-[360px] sm:h-[400px] rounded-3xl overflow-hidden border transition-all duration-500 ease-out glass-card flex flex-col justify-between p-6 group ${
                  offset === 0
                    ? 'border-cyan-500/80 shadow-2xl shadow-cyan-500/30'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Background Thumbnail Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={mode.image}
                    alt={mode.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/60 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold text-black uppercase tracking-wider bg-gradient-to-r ${mode.accentColor}`}
                  >
                    {mode.badge}
                  </span>
                </div>

                {/* Card Bottom Content */}
                <div className="relative z-10 space-y-2">
                  <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {mode.subtitle}
                  </p>

                  <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                    {mode.paramsSummary}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {showcaseModes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="architecture" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Production-Grade Video Architecture</h2>
          <p className="text-sm text-slate-400">Complete studio workflow engineered for standalone execution, async job processing, and cloud storage resilience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 glass-panel">
                <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Minimal Clean Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Novamotion AI Video Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
