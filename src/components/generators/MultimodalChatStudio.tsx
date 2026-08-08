'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Zap,
  Image as ImageIcon,
  Paperclip,
  AtSign,
  Send,
  Sparkles,
  X,
  Play,
  Sliders,
  Layers,
  Wand2,
  Trash2
} from 'lucide-react';
import { useStudio } from '@/lib/studio-store';

interface MultimodalChatStudioProps {
  modeId?: string;
}

interface TagOption {
  tag: string;
  label: string;
  description: string;
}

export function MultimodalChatStudio({ modeId = 'text-to-video' }: MultimodalChatStudioProps) {
  const { startVideoJob, setIsDrawerOpen } = useStudio();
  const [prompt, setPrompt] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [showTagMenu, setShowTagMenu] = useState(false);

  // Common controls
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [voice, setVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Bella

  // TextToVideo controls
  const [motionIntensity, setMotionIntensity] = useState(75);
  const [cameraAngle, setCameraAngle] = useState('Dynamic Zoom');

  // UGC controls
  const [ugcModel, setUgcModel] = useState('bytedance/seedance-2.0');
  const [multiScene, setMultiScene] = useState(true);
  const [lipSync, setLipSync] = useState(true);

  // Luma controls
  const [lumaUseCase, setLumaUseCase] = useState('custom');
  const [lumaExplicitOperation, setLumaExplicitOperation] = useState('image_to_video');
  const [lumaResolution, setLumaResolution] = useState('720p');
  const [lumaEditStrength, setLumaEditStrength] = useState('adhere_1');
  const [hdr, setHdr] = useState(false);

  // Agentic controls
  const [agenticPlatform, setAgenticPlatform] = useState('standard');
  const [agenticModel, setAgenticModel] = useState('seedanceStandard');
  const [targetAudience, setTargetAudience] = useState('General audience');
  const [characterDescription, setCharacterDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableTags: TagOption[] = [
    { tag: '@image1', label: 'First Attached Image', description: 'Reference base image subject' },
    { tag: '@style_cyberpunk', label: 'Cyberpunk Aesthetic', description: 'Glow neon lighting & dark futuristic tones' },
    { tag: '@motion_wave', label: 'Wave Motion Preset', description: 'Fluid organic undulating camera movement' },
    { tag: '@camera_orbit', label: '360 Orbit Camera', description: 'Smooth circular camera trajectory' },
  ];

  const handleInsertTag = (tag: string) => {
    setPrompt((prev) => (prev ? `${prev} ${tag}` : tag));
    setShowTagMenu(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setAttachedImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const activePrompt = prompt.trim() || 'Generate professional high quality video content';

    if (modeId === 'ugc') {
      startVideoJob({
        prompt: activePrompt,
        videoType: 'UGC',
        model: ugcModel,
        images: attachedImages,
        aspectRatio,
        multiScene,
        voice,
        lipSync,
      });
    } else if (modeId === 'luma') {
      startVideoJob({
        prompt: activePrompt,
        videoType: 'Luma',
        useCase: lumaUseCase,
        explicitOperation: lumaExplicitOperation,
        resolution: lumaResolution,
        editStrength: lumaExplicitOperation === 'edit' ? lumaEditStrength : undefined,
        hdr,
        referenceImages: attachedImages,
        aspectRatio,
        voice,
        generateAudio: true,
      });
    } else if (modeId === 'agentic-video') {
      startVideoJob({
        videoType: 'AgenticVideoGenerator',
        title: activePrompt.substring(0, 40),
        brief: activePrompt,
        targetAudience: targetAudience || 'General Audience',
        platform: agenticPlatform,
        videoModel: agenticModel,
        characterDescription: characterDescription || undefined,
        referenceImages: attachedImages,
        aspectRatio,
        voice,
        lipSync,
      });
    } else {
      startVideoJob({
        prompt: activePrompt,
        videoType: 'TextToVideo',
        aspectRatio,
        voice,
      });
    }

    setIsDrawerOpen(true);
    setPrompt('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 overflow-hidden">
      {/* Left Chat & Multimodal Canvas Studio */}
      <div className="flex-1 flex flex-col bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden glass-panel">
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base">
                {modeId === 'ugc'
                  ? 'AI UGC Studio Engine'
                  : modeId === 'luma'
                  ? 'Luma AI Ray 3.2 Studio'
                  : 'AI Text-to-Video Engine'}
              </h1>
              <p className="text-xs text-slate-400">
                {modeId === 'ugc'
                  ? 'Upload reference avatars (@image1), pick model, and generate UGC ad scenes with lip-sync'
                  : modeId === 'luma'
                  ? 'Upload start/end keyframe guides, configure Ray 3.2 camera motion, and render'
                  : 'Attach assets, tag references (@), and generate high-motion WaveSpeed Seedance B-roll'}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
            videoType: {modeId === 'ugc' ? 'UGC' : modeId === 'luma' ? 'Luma' : 'TextToVideo'}
          </span>
        </div>

        {/* Canvas Workspace & Attached Assets */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Asset Dropzone / Preview Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Attached Media Assets ({attachedImages.length})</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-white/15 hover:border-cyan-500/50 bg-white/[0.02] hover:bg-cyan-500/5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-300 transition-all shrink-0"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-[10px] font-bold">Upload Image</span>
              </button>

              {attachedImages.map((img, idx) => (
                <div key={idx} className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/15 group shrink-0 shadow-lg">
                  <Image src={img} alt="Attached asset" fill className="object-cover" />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-cyan-300">
                    @image{idx + 1}
                  </div>
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-lg bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Quick Tag Pill Bar */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Quick Mention Tags</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((t) => (
                <button
                  key={t.tag}
                  type="button"
                  onClick={() => handleInsertTag(t.tag)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-xs font-mono text-amber-300 transition-all"
                >
                  {t.tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSendPrompt} className="p-4 border-t border-white/10 bg-slate-950/80 space-y-3">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe motion trajectory, reference @image1, or add scene cues..."
              className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors pr-24"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTagMenu(!showTagMenu)}
                className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                title="Tag references"
              >
                <AtSign className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:opacity-90 font-bold shadow-lg shadow-amber-500/20 transition-all"
              >
                <Send className="w-4 h-4 fill-black" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Right API Controls & Inspector Panel */}
      <div className="w-80 bg-slate-900/60 border border-white/10 rounded-3xl p-6 glass-panel space-y-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-3 border-b border-white/10">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>
              {modeId === 'ugc'
                ? 'UGC Studio Controls'
                : modeId === 'luma'
                ? 'Luma Ray 3.2 Controls'
                : modeId === 'agentic-video'
                ? 'Agentic Video Controls'
                : 'TextToVideo Controls'}
            </span>
          </div>

          {/* UGC Specific Controls */}
          {modeId === 'ugc' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">UGC AI Video Model</label>
                <select
                  value={ugcModel}
                  onChange={(e) => setUgcModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="bytedance/seedance-2.0">ByteDance Seedance 2.0</option>
                  <option value="google/veo3.1">Google Veo 3.1</option>
                  <option value="x-ai/grok-imagine-video">xAI Grok Imagine Video</option>
                  <option value="alibaba/happyhorse-1.0">Alibaba Happy Horse 1.0</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300">Multi-Scene Engine</span>
                <input
                  type="checkbox"
                  checked={multiScene}
                  onChange={(e) => setMultiScene(e.target.checked)}
                  className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300">WaveSpeed Lip-Sync</span>
                <input
                  type="checkbox"
                  checked={lipSync}
                  onChange={(e) => setLipSync(e.target.checked)}
                  className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Luma Ray 3.2 Specific Controls */}
          {modeId === 'luma' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Ray 3.2 Use-Case Preset</label>
                <select
                  value={lumaUseCase}
                  onChange={(e) => setLumaUseCase(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="custom">Custom Pipeline</option>
                  <option value="ugc_post">UGC Social Post</option>
                  <option value="product_ad">Product Commercial Ad</option>
                  <option value="product_launch">Product Launch Keynote</option>
                  <option value="real_estate">Real Estate Showcase</option>
                  <option value="event_promo">Event Highlight Reel</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Explicit Operation</label>
                <select
                  value={lumaExplicitOperation}
                  onChange={(e) => setLumaExplicitOperation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="image_to_video">Image-to-Video (I2V)</option>
                  <option value="edit">Video Inpainting Edit</option>
                  <option value="reframe">Canvas Motion Reframe</option>
                </select>
              </div>

              {lumaExplicitOperation === 'edit' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Inpainting Edit Strength</label>
                  <select
                    value={lumaEditStrength}
                    onChange={(e) => setLumaEditStrength(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="adhere_1">Strict Adherence (1)</option>
                    <option value="adhere_2">Balanced Adherence (2)</option>
                    <option value="flex_1">Flexible Creative (1)</option>
                    <option value="reimagine_1">Full Reimagine (1)</option>
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Resolution Output</label>
                <select
                  value={lumaResolution}
                  onChange={(e) => setLumaResolution(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="540p">540p Fast</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300">HDR Color Grade</span>
                <input
                  type="checkbox"
                  checked={hdr}
                  onChange={(e) => setHdr(e.target.checked)}
                  className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Agentic Video Specific Controls */}
          {modeId === 'agentic-video' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Campaign Platform Preset</label>
                <select
                  value={agenticPlatform}
                  onChange={(e) => setAgenticPlatform(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="standard">Standard HD Video</option>
                  <option value="youtube">YouTube Mainstream</option>
                  <option value="instagram_reels">Instagram Reels</option>
                  <option value="tiktok">TikTok Viral Short</option>
                  <option value="linkedin">LinkedIn B2B Feed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Video Generation Engine</label>
                <select
                  value={agenticModel}
                  onChange={(e) => setAgenticModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="seedanceStandard">Seedance Standard</option>
                  <option value="veoFastReference">Veo Fast Reference</option>
                  <option value="minimaxImage">MiniMax Image Model</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Gen Z tech enthusiasts"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Character Casting Description</label>
                <input
                  type="text"
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="e.g. 28yo confident tech founder"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300">InfiniteTalk Lip-Sync</span>
                <input
                  type="checkbox"
                  checked={lipSync}
                  onChange={(e) => setLipSync(e.target.checked)}
                  className="accent-amber-500 h-4 w-4 rounded cursor-pointer"
                />
              </div>
            </>
          )}

          {/* TextToVideo Specific Controls */}
          {modeId === 'text-to-video' && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Motion Intensity</span>
                  <span className="text-amber-400 font-mono font-bold">{motionIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={motionIntensity}
                  onChange={(e) => setMotionIntensity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Camera Trajectory</label>
                <select
                  value={cameraAngle}
                  onChange={(e) => setCameraAngle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Dynamic Zoom">Dynamic Zoom</option>
                  <option value="Wave Undulation">Wave Undulation</option>
                  <option value="Rotational Roll">Rotational Roll</option>
                </select>
              </div>
            </>
          )}

          {/* Common Aspect Ratio & Voice Pickers */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="text-xs text-slate-400 font-semibold">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="9:16">9:16 Portrait (Reels / TikTok)</option>
              <option value="16:9">16:9 Landscape (YouTube)</option>
              <option value="1:1">1:1 Square (Instagram / LinkedIn)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold">Voiceover Audio Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="EXAVITQu4vr4xnSDxMaL">Bella (Soft &amp; Warm Female)</option>
              <option value="ErXwobaYiN019PkySvjV">Antoni (Engaging Male)</option>
              <option value="VR6AewLTigWG4xSOukaG">Arnold (Authoritative Crisp)</option>
              <option value="pNInz6obpgDQGcFmaJgB">Adam (Deep Documentary)</option>
            </select>
          </div>
        </div>

        {/* Trigger Render CTA */}
        <button
          onClick={handleSendPrompt}
          className="w-full py-3.5 mt-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-500 text-black font-extrabold text-xs shadow-xl shadow-amber-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Wand2 className="w-4 h-4 fill-black" />
          <span>Launch Video Job</span>
        </button>
      </div>
    </div>
  );
}
