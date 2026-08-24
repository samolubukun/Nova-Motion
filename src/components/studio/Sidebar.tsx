'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Sparkles, FolderOpen, Cpu, Zap, Film, Image as ImageIcon, Flame, BookOpen, PencilRuler } from 'lucide-react';
import { useStudio } from '@/lib/studio-store';

export function Sidebar() {
  const pathname = usePathname();
  const { activeTaskCount, setIsDrawerOpen } = useStudio();

  const mainNav = [
    { name: 'Explore Studio', href: '/studio', icon: LayoutGrid },
    { name: 'Media Library', href: '/studio/history', icon: FolderOpen },
  ];

  const modesNav = [
    { name: 'Stock Video', href: '/studio/mode/stock-video', icon: Flame },
    { name: 'Stock Image', href: '/studio/mode/stock-image', icon: ImageIcon },
    { name: 'AI Storyboard', href: '/studio/mode/ai-storyboard', icon: Film },
    { name: 'Text To Video AI', href: '/studio/mode/text-to-video', icon: Zap },
    { name: 'Micro Drama Pipeline', href: '/studio/mode/microdrama', icon: Film },
    { name: 'UGC Studio', href: '/studio/mode/ugc', icon: Sparkles },
    { name: 'Agentic AI Video', href: '/studio/mode/agentic-video', icon: Flame },
    { name: 'Luma Ray 3.2', href: '/studio/mode/luma', icon: Flame },
    { name: 'Vox Paper Explainer', href: '/studio/mode/vox-video', icon: Sparkles },
    { name: 'Zack D 3D Shorts', href: '/studio/mode/zack-d', icon: Film },
    { name: 'Comic Drama', href: '/studio/mode/comic-drama', icon: BookOpen },
    { name: 'Stickman Explainer', href: '/studio/mode/stickman-explainer', icon: PencilRuler },
    { name: 'Motion Graphics', href: '/studio/mode/motion-graphics', icon: Cpu },
    { name: 'Typography Slideshow', href: '/studio/mode/typography-slideshow', icon: LayoutGrid },
  ];

  return (
    <aside className="w-56 lg:w-60 h-[125vh] min-h-[125vh] fixed left-0 top-0 bottom-0 bg-[#0b0f19] border-r border-white/10 flex flex-col z-30 justify-between">
      <div className="overflow-y-auto flex-1">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-5 py-4 border-b border-white/10 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/novamotion.png"
              alt="Novamotion Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-white flex items-center gap-1">
              NOVA<span className="text-gradient-gold">MOTION</span>
            </h1>
            <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase block -mt-0.5">AI Studio v2.5</span>
          </div>
        </Link>

        {/* Main Navigation */}
        <div className="px-4 py-6 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Creation Modes */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Studio Modes</p>
            <nav className="space-y-1">
              {modesNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Render Queue Backlog Bar */}
      <div className="mt-auto p-4 border-t border-white/10 bg-slate-900/50">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 hover:border-blue-400/60 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Render Queue</p>
              <p className="text-[11px] text-slate-400">{activeTaskCount} Active Job{activeTaskCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {activeTaskCount > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          )}
        </button>
      </div>
    </aside>
  );
}
