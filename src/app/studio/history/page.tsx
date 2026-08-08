'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HardDrive, FolderOpen, Play, Download, Trash2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { useStudio, RenderTask } from '@/lib/studio-store';

export default function HistoryPage() {
  const { historyTasks, cancelTask } = useStudio();
  const [activePreview, setActivePreview] = useState<RenderTask | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Local Output Fallback Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Media Library & Renders</h1>
          <p className="text-sm text-slate-400 mt-1">
            All rendered MP4 videos are indexed locally (`/rendered-videos`) with browser memory persistence.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloud S3 Fallback System</span>
          </div>
          <p className="text-slate-500 text-[11px]">No S3 credentials required for standalone operation.</p>
        </div>
      </div>

      {/* Renders Grid */}
      {historyTasks.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-white/10 space-y-4">
          <FolderOpen className="w-16 h-16 mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-slate-300">No Rendered Media Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Launch any creation mode in the studio to generate video outputs. Rendered files will automatically persist here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyTasks.map((task) => (
            <div
              key={task.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/40 flex flex-col justify-between transition-all"
            >
              {/* Video / Thumbnail Box */}
              <div
                onClick={() => setActivePreview(task)}
                className="relative aspect-video w-full bg-slate-950 cursor-pointer group overflow-hidden"
              >
                <Image
                  src={task.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                  alt={task.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="p-3.5 rounded-full bg-cyan-500/90 text-black shadow-xl shadow-cyan-500/40 transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-black" />
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-black/80 text-amber-300 border border-amber-500/30 uppercase">
                    {task.mode}
                  </span>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base line-clamp-1">{task.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.prompt || 'Custom parameter video rendering'}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <button
                    onClick={() => handleCopyPrompt(task.id, task.prompt)}
                    className="text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === task.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === task.id ? 'Copied' : 'Copy Prompt'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={task.videoUrl || '/rendered-videos/sample-demo.mp4'}
                      download
                      className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                      title="Download MP4"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => cancelTask(task.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Preview */}
      {activePreview && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-3xl bg-[#0f1523] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">{activePreview.title}</h3>
                <p className="text-xs text-slate-400">Mode: {activePreview.mode}</p>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-xl bg-black overflow-hidden border border-white/10 flex items-center justify-center">
              <video
                src={activePreview.videoUrl || '/rendered-videos/sample-demo.mp4'}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
