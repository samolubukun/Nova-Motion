'use client';

import { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Film,
  Volume2,
  Monitor,
  Layers,
  Send,
  Wand2,
  Bot,
  User,
  Palette,
  Target,
  Music,
  CheckCircle2,
  Settings2,
  ChevronDown,
  ChevronUp,
  Globe,
  Tv
} from 'lucide-react';
import { useStudio } from '@/lib/studio-store';

interface FormProps {
  modeId: string;
  title: string;
  subtitle: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedParams?: Record<string, any>;
}

export function StandardFormGenerator({ modeId, title, subtitle }: FormProps) {
  const { startTask, startVideoJob, setIsDrawerOpen } = useStudio();
  const [prompt, setPrompt] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Welcome to **${title}**! Describe your video idea or ask me to configure optimal parameters for your target audience, tone, or aspect ratio.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Full unlocked parameters based on backend schemas (shared/video-schema.ts)
  const [videoType, setVideoType] = useState<string>(
    modeId === 'ugc'
      ? 'UGC'
      : modeId === 'luma'
      ? 'Luma'
      : modeId === 'vox-video'
      ? 'VoxVideo'
      : modeId === 'microdrama'
      ? 'MicroDrama'
      : modeId === 'agentic-video'
      ? 'AgenticVideoGenerator'
      : modeId === 'motion-graphics'
      ? 'MotionGraphics'
      : modeId === 'ai-storyboard'
      ? 'AIStoryboardVideo'
      : modeId === 'stock-video'
      ? 'StockVideo'
      : modeId === 'stock-image'
      ? 'StockImage'
      : modeId === 'typography-slideshow'
      ? 'Explainer'
      : 'Explainer'
  );
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1080p');
  const [duration, setDuration] = useState(30);
  const [fps, setFps] = useState(30);
  const [voice, setVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Bella (ElevenLabs)

  // API Advanced Drawer State
  const [voxTheme, setVoxTheme] = useState<string>('american-retro');
  const [voxArc, setVoxArc] = useState<string>('hook_payoff');
  const [agenticPlatform, setAgenticPlatform] = useState<string>('youtube');
  const [lumaUseCase, setLumaUseCase] = useState<string>('text_to_video');
  const [brandColor, setBrandColor] = useState('#0088ff');
  const [topic, setTopic] = useState('Interesting Facts');
  const [microDramaIdea, setMicroDramaIdea] = useState('');
  const [microDramaRequirement, setMicroDramaRequirement] = useState('');
  
  const [animation, setAnimation] = useState('fadeIn');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('English');
  const [targetAudience, setTargetAudience] = useState('');
  const [callToAction, setCallToAction] = useState('');

  // Brand Palette
  const [primaryColor, setPrimaryColor] = useState('#0088ff');
  const [secondaryColor, setSecondaryColor] = useState('#ffb800');
  const [textColor, setTextColor] = useState('#ffffff');

  // Feature Toggles
  const [lipSync, setLipSync] = useState(true);
  const [multiScene, setMultiScene] = useState(true);
  const [generateAudio, setGenerateAudio] = useState(true);

  // UI Drawer Collapsibles
  const [showAdvanced, setShowAdvanced] = useState(false);

  const voiceOptions = [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Soft & Warm Female)' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Engaging Male)' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Authoritative Crisp)' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Deep Documentary)' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Warm British)' },
    { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (Trendy Bright)' },
  ];

  const handleSendPrompt = (userText: string) => {
    if (!userText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setTimeout(() => {
      let reply = `Understood! I'll build a script for **${videoType}** with **${aspectRatio}** layout.`;

      if (userText.toLowerCase().includes('portrait') || userText.toLowerCase().includes('reel')) {
        setAspectRatio('9:16');
        reply += ' Configured aspect ratio to **9:16 Portrait**.';
      }
      if (userText.toLowerCase().includes('retro') || userText.toLowerCase().includes('vox')) {
        setVoxTheme('AmericanRetro');
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleLaunchTask = () => {
    const finalPrompt = prompt || messages[messages.length - 1]?.text || title;

    if (modeId === 'microdrama') {
      startVideoJob({
        videoType: 'MicroDrama',
        idea: microDramaIdea || finalPrompt,
        requirement: microDramaRequirement,
        aspectRatio,
      });
    } else if (modeId === 'agentic-video') {
      startVideoJob({
        videoType: 'AgenticVideoGenerator',
        title: title || 'AI Video Campaign',
        brief: finalPrompt,
        targetAudience: targetAudience || 'General audience',
        platform: agenticPlatform,
        aspectRatio,
        voice,
      });
    } else if (modeId === 'vox-video') {
      startVideoJob({
        videoType: 'VoxVideo',
        prompt: finalPrompt,
        theme: voxTheme,
        arc: voxArc,
        aspectRatio,
        voice,
      });
    } else {
      startVideoJob({
        prompt: finalPrompt,
        videoType: videoType as any,
        topic,
        aspectRatio,
        durationSec: duration,
        voice,
        style: { primaryColor, secondaryColor, textColor },
      });
    }

    setIsDrawerOpen(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 overflow-hidden">
      {/* Left Column: Interactive Chat Interface & Prompt Builder */}
      <div className="flex-1 flex flex-col bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base">{title}</h1>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
            videoType: {videoType}
          </span>
        </div>

        {/* Sub-variant Selector Pill Bar for Typography & Slideshow Studio */}
        {modeId === 'typography-slideshow' && (
          <div className="px-6 py-2.5 bg-slate-950 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1 shrink-0">Sub-Variant:</span>
            {[
              { id: 'Explainer', name: 'Explainer (Step Numbers)' },
              { id: 'SocialMedia', name: 'Social Media (Reels & Quotes)' },
              { id: 'General', name: 'General (Clean Slides)' },
              { id: 'TextAnimation', name: 'Text Highlight Animation' },
            ].map((variant) => (
              <button
                key={variant.id}
                onClick={() => setVideoType(variant.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  videoType === variant.id
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        )}

        {/* Chat History Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-black'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-lg p-4 rounded-2xl text-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span className="text-[10px] text-slate-400 block text-right">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input & Launch Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (chatInput.trim()) {
              handleSendPrompt(chatInput);
              setChatInput('');
            }
          }}
          className="p-4 border-t border-white/10 bg-slate-950/80 space-y-3"
        >
          <div className="relative">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              rows={2}
              placeholder="Describe your video script, ask AI to refine concept, or type prompt..."
              className="w-full p-3 pl-4 pr-24 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchTask}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-400 hover:opacity-90 text-black font-extrabold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Launch Render Job</span>
          </button>
        </form>
      </div>

      {/* Right Column: Full Unlocked API Parameters Drawer */}
      <div className="w-[380px] bg-slate-900/60 border border-white/10 rounded-3xl p-6 glass-panel space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Full API Parameters</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Backend V2.5
          </span>
        </div>

        {/* Video Type Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-slate-400" />
            <span>Pipeline Engine</span>
          </label>
          <select
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="TextToVideo">TextToVideo AI (WaveSpeed Seedance)</option>
            <option value="MicroDrama">MicroDrama Agentic Engine</option>
            <option value="UGC">UGC AI Studio (Veo / Grok / Seedance)</option>
            <option value="AgenticVideoGenerator">Agentic AI Pipeline</option>
            <option value="Luma">Luma Ray 3.2 Studio</option>
            <option value="VoxVideo">Vox Paper-Collage Studio</option>
            <option value="MotionGraphics">Motion Graphics & Charts</option>
            <option value="Explainer">Explainer Slide Layout</option>
            <option value="General">General Slide Layout</option>
            <option value="SocialMedia">Social Media Reel</option>
            <option value="TextAnimation">Text Kinetic Highlight</option>
            <option value="AIStoryboardVideo">AI Storyboard Video</option>
            <option value="StockVideo">Stock Video Engine</option>
            <option value="StockImage">Stock Image Engine</option>
          </select>
        </div>

        {/* Aspect Ratio & Resolution */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-400" />
              <span>Aspect Ratio</span>
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="16:9">16:9 Landscape</option>
              <option value="9:16">9:16 Portrait</option>
              <option value="1:1">1:1 Square</option>
              <option value="21:9">21:9 UltraWide</option>
              <option value="4:3">4:3 Classic</option>
              <option value="3:4">3:4 Vertical</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-slate-400" />
              <span>Resolution</span>
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="2k">2K Quad HD</option>
              <option value="4k">4K Ultra HD</option>
            </select>
          </div>
        </div>

        {/* Duration & FPS Sliders */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Duration (Seconds)</span>
              <span className="text-cyan-400 font-mono font-bold">{duration}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400">Framerate (FPS)</label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200"
              >
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
                <option value={24}>24 FPS</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400">Animation Style</label>
              <select
                value={animation}
                onChange={(e) => setAnimation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200"
              >
                <option value="fadeIn">Fade In</option>
                <option value="slideUp">Slide Up</option>
                <option value="bounce">Bounce</option>
                <option value="typewriter">Typewriter</option>
                <option value="scale">Scale</option>
              </select>
            </div>
          </div>
        </div>

        {/* Voiceover Engine Selection */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Voiceover Engine (ElevenLabs)</span>
          </label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200"
          >
            {voiceOptions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Palette Colors */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span>Brand Colors</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Primary</span>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-8 rounded bg-slate-950 cursor-pointer border border-white/10"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Accent</span>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full h-8 rounded bg-slate-950 cursor-pointer border border-white/10"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Text</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-8 rounded bg-slate-950 cursor-pointer border border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Parameters */}
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white py-1"
          >
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Advanced Pipeline Settings</span>
            </div>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-3">
              {/* Vox Controls */}
              {videoType === 'VoxVideo' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Vox Aesthetic Theme</label>
                    <select
                      value={voxTheme}
                      onChange={(e) => setVoxTheme(e.target.value as any)}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200"
                    >
                      <option value="swiss-modern">Swiss Modern (Clean Grid)</option>
                      <option value="american-retro">American Retro (Pop Vintage)</option>
                      <option value="punk-zine">Punk Zine (Grungy Collage)</option>
                      <option value="chinese-ink">Chinese Ink (Traditional Calligraphy)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Story Arc Structure</label>
                    <select
                      value={voxArc}
                      onChange={(e) => setVoxArc(e.target.value as any)}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200"
                    >
                      <option value="hook_payoff">Hook &amp; Payoff</option>
                      <option value="pas">PAS (Problem-Agitate-Solve)</option>
                      <option value="bab">BAB (Before-After-Bridge)</option>
                      <option value="how_it_works">How It Works Step-by-Step</option>
                      <option value="timeline">Historical Chronological Timeline</option>
                      <option value="man_in_hole">Man in Hole Recovery</option>
                    </select>
                  </div>
                </>
              )}

              {/* Tone & Audience */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Content Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200"
                >
                  <option value="professional">Professional</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="energetic">Energetic & Hype</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="casual">Casual & Conversational</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Gen-Z Tech Founders"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center justify-between text-xs text-slate-300">
                  <span>WaveSpeed Lip-Sync</span>
                  <input
                    type="checkbox"
                    checked={lipSync}
                    onChange={(e) => setLipSync(e.target.checked)}
                    className="accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300">
                  <span>Multi-Scene Auto Breakdown</span>
                  <input
                    type="checkbox"
                    checked={multiScene}
                    onChange={(e) => setMultiScene(e.target.checked)}
                    className="accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300">
                  <span>Synthesize Background Music</span>
                  <input
                    type="checkbox"
                    checked={generateAudio}
                    onChange={(e) => setGenerateAudio(e.target.checked)}
                    className="accent-cyan-500"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
