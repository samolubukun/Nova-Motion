'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Zap, Film, Flame, Image as ImageIcon, Video, Layers, ArrowRight, Play, Tv, BookOpen } from 'lucide-react';

interface StudioMode {
  id: string;
  title: string;
  category: 'text-to-video' | 'microdrama' | 'ugc' | 'agentic' | 'luma' | 'vox' | 'zackd' | 'comic' | 'motion-graphics' | 'storyboard' | 'stock' | 'slideshow';
  type: 'form' | 'chat';
  description: string;
  thumbnail: string;
  badge: string;
  paramsSummary: string;
}

export default function StudioHubPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Studio Modes' },
    { id: 'text-to-video', label: 'TextToVideo AI' },
    { id: 'microdrama', label: 'MicroDrama' },
    { id: 'ugc', label: 'UGC Studio' },
    { id: 'agentic', label: 'Agentic AI' },
    { id: 'luma', label: 'Luma Ray 3.2' },
    { id: 'vox', label: 'Vox Paper' },
    { id: 'zackd', label: 'Zack D 3D Shorts' },
    { id: 'comic', label: 'Comic Drama' },
    { id: 'motion-graphics', label: 'Motion Graphics' },
    { id: 'storyboard', label: 'AI Storyboards' },
    { id: 'stock', label: 'Stock Media' },
    { id: 'slideshow', label: 'Typography Slides' },
  ];

  const modes: StudioMode[] = [
    {
      id: 'stock-video',
      title: 'Stock Video Studio',
      category: 'stock',
      type: 'form',
      description: 'Sourcing stock video clips from Pexels, context-matched search keywords, background music & voiceover.',
      thumbnail: '/thumbnails/stock-video.png',
      badge: 'Stock Video',
      paramsSummary: 'Context Tags • Voiceover • Aspect Ratio • Audio Track',
    },
    {
      id: 'stock-image',
      title: 'Stock Image Studio',
      category: 'stock',
      type: 'form',
      description: 'Sourcing stock images from Pixabay, animated Ken Burns pan/zoom motion, background audio & voiceover.',
      thumbnail: '/thumbnails/stock-image.png',
      badge: 'Stock Image',
      paramsSummary: 'Prompt • Ken Burns Motion • Aspect Ratio • Voiceover',
    },
    {
      id: 'ai-storyboard',
      title: 'AI Storyboard Studio',
      category: 'storyboard',
      type: 'form',
      description: 'Generates multi-scene narrative scripts, gpt-image-2 visual shot descriptions, and Deepgram voiceover audio.',
      thumbnail: '/thumbnails/ai-storyboard.png',
      badge: 'AI Storyboard',
      paramsSummary: 'Prompt • Topic • Aspect Ratio • Voiceover Style',
    },
    {
      id: 'text-to-video',
      title: 'AI Text-to-Video Engine',
      category: 'text-to-video',
      type: 'chat',
      description: 'AI-generated B-roll clips from WaveSpeed Seedance + TTS voiceover. Supports multimodal image dropzone and @tag references.',
      thumbnail: '/thumbnails/text-to-video-new.png',
      badge: 'Text To Video',
      paramsSummary: 'Seedance Model • Multimodal @Tags • Aspect Ratio • Voiceover',
    },
    {
      id: 'microdrama',
      title: 'MicroDrama Story Engine',
      category: 'microdrama',
      type: 'form',
      description: 'Full agentic pipeline — AI screenplay, character casting, storyboard frames, and Seedance I2V narrative clips.',
      thumbnail: '/thumbnails/microdrama.png',
      badge: 'Micro Drama',
      paramsSummary: 'Idea Script • Requirement • Aspect Ratio • Character Sync',
    },
    {
      id: 'ugc',
      title: 'AI UGC Studio',
      category: 'ugc',
      type: 'form',
      description: 'AI UGC ad studio — script + up to 7 reference images (@image1 tag) → Veo / Grok / Seedance clips with native audio & WaveSpeed lip-sync.',
      thumbnail: '/thumbnails/ugc-ad.png',
      badge: 'UGC Ad Studio',
      paramsSummary: 'Script • Multimodal Avatars • Lip-Sync • ElevenLabs Voice • 9:16 Aspect',
    },
    {
      id: 'agentic-video',
      title: 'Agentic Concept-to-Video',
      category: 'agentic',
      type: 'form',
      description: 'End-to-end concept to screenplay, character casting, storyboard, AI scenes, audio, and platform-ready video.',
      thumbnail: '/thumbnails/agentic-video.png',
      badge: 'Agentic Video',
      paramsSummary: 'Brief • Target Audience • Tone • CTA • Platform Preset',
    },
    {
      id: 'luma',
      title: 'Luma AI Ray 3.2 Studio',
      category: 'luma',
      type: 'form',
      description: 'Unified Ray 3.2 pipeline — text-to-video, image-to-video, loop, extend, video edit, reframe + TTS voiceover & kinetic captions.',
      thumbnail: '/thumbnails/luma-ray.png',
      badge: 'Luma Ray 3.2',
      paramsSummary: 'Prompt • Operation • Multi-Keyframe • Edit Strength • Resolution',
    },
    {
      id: 'vox-video',
      title: 'Vox Paper-Collage Studio',
      category: 'vox',
      type: 'form',
      description: 'Vox-style paper-collage explainer — LLM beat map → Seedream collage posters → Seedance animated clips + TTS & music.',
      thumbnail: '/thumbnails/vox-explainer.png',
      badge: 'Vox Explainer',
      paramsSummary: 'Vox Theme • Story Arc • 1080p Resolution • ElevenLabs Voice',
    },
    {
      id: 'zack-d',
      title: 'Zack D Films 3D Shorts',
      category: 'zackd',
      type: 'form',
      description: 'Zack D Films-style 3D curiosity shorts — curiosity-loop script → character turnaround sheets → keyframes → animated clips → impact zooms & transitions.',
      thumbnail: '/thumbnails/zack-d.png',
      badge: '3D Curiosity Short',
      paramsSummary: 'Curiosity Loop • Character Sheets • Impact Zooms • ElevenLabs Voice',
    },
    {
      id: 'comic-drama',
      title: 'AI Comic Drama Studio',
      category: 'comic',
      type: 'form',
      description: 'Comic & anime drama episodes — story plan → 4-view character sheets → first/last keyframe pairs → interpolated motion clips with dialogue subtitles.',
      thumbnail: '/thumbnails/comic-drama.png',
      badge: 'Comic Drama',
      paramsSummary: 'Art Style • Storyboard Shots • Dialogue TTS • Comic Subtitles',
    },
    {
      id: 'motion-graphics',
      title: 'Motion Graphics Studio',
      category: 'motion-graphics',
      type: 'form',
      description: 'Dynamic motion graphics, animated 3D bar/pie charts, infographics, and interactive UI component simulations.',
      thumbnail: '/thumbnails/motion-graphics.png',
      badge: 'Motion Graphics',
      paramsSummary: 'Chart Type • Data Points • Theme • Brand Palette • FPS',
    },
    {
      id: 'typography-slideshow',
      title: 'Typography & Slideshow Studio',
      category: 'slideshow',
      type: 'form',
      description: 'Grouped studio for Explainer, Social Media Reels, General, and Text Animation modes with step numbers & active word highlighting.',
      thumbnail: '/thumbnails/typography-slideshow-new.svg',
      badge: 'Typography Slides',
      paramsSummary: 'Slide Style • Step Numbers • Brand Colors • Voiceover Engine',
    },
  ];

  const filteredModes = activeCategory === 'all'
    ? modes
    : modes.filter((m) => m.category === activeCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Studio Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0a0f1d] via-[#10182b] to-[#241c08] p-6 md:p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Choose Your <span className="text-gradient-gold">Creation Pipeline</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Select standard parameter form modes with interactive chat assistant or launch multimodal chat studios with image attachments and @tag references.
          </p>
        </div>
      </div>

      {/* Filter Tabs / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModes.map((mode) => (
          <Link
            key={mode.id}
            href={`/studio/mode/${mode.id}`}
            className="group glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Thumbnail Image Header */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <Image
                src={mode.thumbnail}
                alt={mode.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1523] via-transparent to-transparent" />

              {/* Golden Mode Type Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 text-black shadow-lg shadow-amber-500/20">
                  {mode.badge}
                </span>
              </div>
            </div>

            {/* Mode Body Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {mode.title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-[11px] text-slate-500 font-mono">
                  <span className="text-slate-400 font-semibold">Inputs: </span>
                  {mode.paramsSummary}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
