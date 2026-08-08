'use client';

import { Search, Sparkles, HardDrive, Bell, Layers } from 'lucide-react';
import { useStudio } from '@/lib/studio-store';

export function Navbar() {
  const { activeTaskCount, setIsDrawerOpen } = useStudio();

  return (
    <header className="h-16 border-b border-white/10 bg-[#080b11]/80 backdrop-blur-xl sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-60 sm:w-80 max-w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search templates, video styles, prompts..."
          className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Local Storage Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-400">
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Storage Active</span>
        </div>

        {/* Backlog Drawer Trigger */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-all"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Jobs Backlog</span>
          {activeTaskCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-extrabold">
              {activeTaskCount}
            </span>
          )}
        </button>

        {/* Create Quick Action */}
        <a
          href="/studio/mode/text-to-video"
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Create</span>
        </a>
      </div>
    </header>
  );
}
