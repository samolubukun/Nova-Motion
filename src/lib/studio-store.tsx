'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface RenderTask {
  id: string;
  title: string;
  mode: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  step: number; // 1: prompt/script, 2: asset gen, 3: timeline render, 4: final export
  stepDescription: string;
  progress: number; // 0 - 100
  createdAt: string;
  completedAt?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  prompt?: string;
  isLocalFallback?: boolean;
  params?: Record<string, any>;
}

interface StudioContextType {
  tasks: RenderTask[];
  activeTaskCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  startTask: (task: Omit<RenderTask, 'id' | 'status' | 'step' | 'stepDescription' | 'progress' | 'createdAt'>) => string;
  startVideoJob: (payload: Record<string, any>) => Promise<string>;
  cancelTask: (id: string) => void;
  clearCompleted: () => void;
  historyTasks: RenderTask[];
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'novamotion_render_history_v1';

export function StudioProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<RenderTask[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load render history from localStorage:', e);
    }
  }, []);

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to persist history to localStorage:', e);
    }
  }, [tasks]);

  // Handle active simulation for jobs to demonstrate visual progression backlog
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status !== 'processing' && task.status !== 'queued') return task;

          let newProgress = task.progress + Math.floor(Math.random() * 12) + 6;
          let newStep = task.step;
          let newStatus: RenderTask['status'] = task.status;
          let newStepDesc = task.stepDescription;

          if (newStatus === 'queued') {
            newStatus = 'processing';
            newStep = 1;
            newStepDesc = 'Analyzing prompt & scripting scene compositions...';
            newProgress = 12;
          } else if (newProgress >= 25 && task.step === 1) {
            newStep = 2;
            newStepDesc = 'Generating AI visual frames & voiceover audio assets...';
          } else if (newProgress >= 65 && task.step === 2) {
            newStep = 3;
            newStepDesc = 'Composing dynamic timeline frames in Remotion Engine...';
          } else if (newProgress >= 90 && task.step === 3) {
            newStep = 4;
            newStepDesc = 'Encoding final HD MP4 output stream...';
          }

          if (newProgress >= 100) {
            newProgress = 100;
            newStatus = 'completed';
            newStep = 4;
            newStepDesc = 'Render complete! Video ready.';
          }

          return {
            ...task,
            progress: newProgress,
            step: newStep,
            status: newStatus,
            stepDescription: newStepDesc,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt,
            videoUrl: task.videoUrl || (newStatus === 'completed' ? '/rendered-videos/sample-demo.mp4' : undefined),
            thumbnailUrl: task.thumbnailUrl || (newStatus === 'completed' ? '/thumbnails/ugc-ad.png' : undefined)
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const activeTaskCount = tasks.filter((t) => t.status === 'processing' || t.status === 'queued').length;

  const startTask = (taskData: Omit<RenderTask, 'id' | 'status' | 'step' | 'stepDescription' | 'progress' | 'createdAt'>) => {
    const newId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTask: RenderTask = {
      ...taskData,
      id: newId,
      status: 'queued',
      step: 1,
      stepDescription: 'Submitting job request to API Gateway...',
      progress: 5,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return newId;
  };

  const startVideoJob = async (payload: Record<string, any>): Promise<string> => {
    const taskId = startTask({
      title: `${payload.videoType || 'Video'}: ${(payload.prompt || payload.title || payload.idea || 'Pipeline Render').substring(0, 32)}...`,
      mode: payload.videoType || 'general',
      prompt: payload.prompt || payload.idea || payload.brief,
      thumbnailUrl: payload.images?.[0] || payload.referenceImages?.[0] || '/thumbnails/stock-video.png',
      params: payload,
    });

    try {
      fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.warn('Dispatched POST /api/videos async:', err));
    } catch (err) {
      console.warn('POST /api/videos network request error:', err);
    }

    return taskId;
  };

  const cancelTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => t.status === 'processing' || t.status === 'queued'));
  };

  return (
    <StudioContext.Provider
      value={{
        tasks,
        activeTaskCount,
        isDrawerOpen,
        setIsDrawerOpen,
        startTask,
        startVideoJob,
        cancelTask,
        clearCompleted,
        historyTasks: tasks.filter((t) => t.status === 'completed')
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
