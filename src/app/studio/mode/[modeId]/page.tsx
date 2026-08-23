'use client';

import { use } from 'react';
import { StandardFormGenerator } from '@/components/generators/StandardFormGenerator';
import { MultimodalChatStudio } from '@/components/generators/MultimodalChatStudio';

interface PageProps {
  params: Promise<{ modeId: string }>;
}

const modeConfigs: Record<string, { title: string; subtitle: string }> = {
  'text-to-video': {
    title: 'AI Text-to-Video Engine',
    subtitle: 'AI-generated B-roll clips from WaveSpeed Seedance + TTS voiceover with multimodal image dropzone and @tag references.',
  },
  'microdrama': {
    title: 'MicroDrama Story Engine',
    subtitle: 'Full agentic pipeline — AI screenplay, character casting, storyboard frames, and Seedance I2V narrative clips.',
  },
  'ugc': {
    title: 'AI UGC Studio Engine',
    subtitle: 'AI UGC ad studio — script + up to 7 reference images (@image1 tag) → Veo / Grok / Seedance clips with native audio & WaveSpeed lip-sync.',
  },
  'agentic-video': {
    title: 'Agentic Concept-to-Video AI',
    subtitle: 'End-to-end concept to screenplay, character casting, storyboard, AI scenes, audio, and platform-ready video.',
  },
  'luma': {
    title: 'Luma AI Ray 3.2 Studio',
    subtitle: 'Unified Ray 3.2 pipeline — text-to-video, image-to-video, loop, extend, video edit, reframe + TTS voiceover & kinetic captions.',
  },
  'vox-video': {
    title: 'Vox Paper-Collage Studio',
    subtitle: 'Vox-style paper-collage explainer — LLM beat map → Seedream collage posters → Seedance animated clips + TTS & music.',
  },
  'zack-d': {
    title: 'Zack D Films 3D Shorts',
    subtitle: 'Zack D-style 3D curiosity shorts — curiosity-loop script, character turnaround sheets, keyframes, animated clips, impact zooms & transitions.',
  },
  'comic-drama': {
    title: 'AI Comic Drama Studio',
    subtitle: 'Comic & anime drama episodes — story plan, 4-view character sheets, first/last keyframe interpolation, dialogue TTS & comic subtitles.',
  },
  'motion-graphics': {
    title: 'Motion Graphics Studio',
    subtitle: 'Dynamic motion graphics, animated 3D bar/pie charts, infographics, and interactive UI component simulations.',
  },
  'ai-storyboard': {
    title: 'AI Storyboard Studio',
    subtitle: 'Multi-scene narrative scripts, gpt-image-2 visual shot descriptions, and Deepgram voiceover audio.',
  },
  'stock-video': {
    title: 'Stock Video Studio',
    subtitle: 'Sourcing stock video clips from Pexels, context-matched search keywords, background music & voiceover.',
  },
  'stock-image': {
    title: 'Stock Image Studio',
    subtitle: 'Sourcing stock images from Pixabay, animated Ken Burns pan/zoom motion, background audio & voiceover.',
  },
  'typography-slideshow': {
    title: 'Typography & Slideshow Studio',
    subtitle: 'Unified studio grouping Explainer (step numbers), SocialMedia (reels/quotes), General (clean slides), and TextAnimation (active highlights).',
  },
};

export default function StudioModePage({ params }: PageProps) {
  const { modeId } = use(params);

  if (modeId === 'text-to-video' || modeId === 'ugc' || modeId === 'luma' || modeId === 'agentic-video') {
    return <MultimodalChatStudio modeId={modeId} />;
  }

  const config = modeConfigs[modeId] || {
    title: `${modeId.replace('-', ' ').toUpperCase()} Studio`,
    subtitle: 'Configure your prompt and render settings below.',
  };

  return (
    <StandardFormGenerator
      modeId={modeId}
      title={config.title}
      subtitle={config.subtitle}
    />
  );
}
