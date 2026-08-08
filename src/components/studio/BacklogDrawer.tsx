'use client';

import { X, Play, CheckCircle2, Clock, Loader2, Cpu, Trash2, ExternalLink } from 'lucide-react';
import { useStudio, RenderTask } from '@/lib/studio-store';
import { useState } from 'react';

export function BacklogDrawer() {
  const { tasks, isDrawerOpen, setIsDrawerOpen, cancelTask, clearCompleted } = useStudio();
  const [selectedPreviewVideo, setSelectedPreviewVideo] = useState<RenderTask | null>(null);

  if (!isDrawerOpen) return null;

  const stepsList = [
    { num: 1, label: 'Script & Scene Analysis' },
    { num: 2, label: 'AI Frame & Audio Generation' },
    { num: 3, label: 'Remotion Engine Render' },
    { num: 4, label: 'HD MP4 Export' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[500px] h-full bg-[#0b0f19] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base">Job Progression Backlog</h2>
              <p className="text-xs text-slate-400">Real-time Remotion & AI queue pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompleted}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
            >
              Clear Completed
            </button>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tasks Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-3">
              <Clock className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
              <p className="text-sm font-medium">No rendering tasks in queue</p>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Select any mode from the studio and click generate to trigger render pipelines.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
              >
                {/* Task Title & Mode Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full uppercase border border-amber-400/20">
                      {task.mode}
                    </span>
                    <h3 className="font-semibold text-sm text-slate-200 mt-1 line-clamp-1">
                      {task.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => cancelTask(task.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Cancel task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar & Status */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      {task.status === 'processing' && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                      {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {task.stepDescription}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{task.progress}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                {/* Step Breakdown */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {stepsList.map((st) => {
                    const isDone = task.step > st.num || task.status === 'completed';
                    const isCurrent = task.step === st.num && task.status === 'processing';
                    return (
                      <div
                        key={st.num}
                        className={`p-1.5 rounded-lg border text-center text-[10px] transition-all ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : isCurrent
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold animate-pulse'
                            : 'bg-slate-900 border-white/5 text-slate-600'
                        }`}
                      >
                        Step {st.num}
                      </div>
                    );
                  })}
                </div>

                {/* Completed Action */}
                {task.status === 'completed' && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPreviewVideo(task)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Play Rendered Output</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Video Preview Modal */}
      {selectedPreviewVideo && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-3xl bg-[#0f1523] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">{selectedPreviewVideo.title}</h3>
                <p className="text-xs text-cyan-400">Mode: {selectedPreviewVideo.mode} • Local Storage Fallback</p>
              </div>
              <button
                onClick={() => setSelectedPreviewVideo(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl bg-black overflow-hidden border border-white/10 flex items-center justify-center">
              <video
                src={selectedPreviewVideo.videoUrl || '/rendered-videos/sample-demo.mp4'}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Completed at {new Date(selectedPreviewVideo.completedAt || '').toLocaleTimeString()}</span>
              <a
                href={selectedPreviewVideo.videoUrl || '/rendered-videos/sample-demo.mp4'}
                download
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Download MP4 File</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
