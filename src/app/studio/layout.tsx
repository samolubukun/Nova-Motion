'use client';

import { Sidebar } from '@/components/studio/Sidebar';
import { Navbar } from '@/components/studio/Navbar';
import { BacklogDrawer } from '@/components/studio/BacklogDrawer';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[125vh] bg-[#080b11] text-slate-100 flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Studio Area */}
      <div className="pl-56 lg:pl-60 flex-1 flex flex-col min-h-[125vh]">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Slide-over Backlog Queue Drawer */}
      <BacklogDrawer />
    </div>
  );
}
