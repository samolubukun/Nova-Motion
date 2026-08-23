import { Composition } from "remotion";
import { General, generalSchema } from "./compositions/General";
import { TextAnimation, textAnimationSchema } from "./compositions/TextAnimation";
import { SocialMedia, socialMediaSchema } from "./compositions/SocialMedia";
import { Explainer, explainerSchema } from "./compositions/Explainer";
import { AIVideo } from "./compositions/AIVideo";
import { StockVideo } from "./compositions/StockVideo";
import { WavespeedVideo } from "./compositions/WavespeedVideo";
import { ZackDVideo } from "./compositions/ZackDVideo";
import { ComicDramaVideo } from "./compositions/ComicDramaVideo";
import { DynamicMotionGraphics } from "./compositions/DynamicMotionGraphics";
import { z } from "zod";

const motionGraphicsSchema = z.object({
  storyboard: z.object({
    shortTitle: z.string(),
    slides: z.array(z.any()),
    audio: z.array(z.any()).optional(),
    music: z.array(z.any()).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

const aiVideoPropsSchema = z.object({
  timeline: z.object({
    shortTitle: z.string(),
    elements: z.array(z.any()),
    text: z.array(z.any()),
    audio: z.array(z.any()),
    music: z.array(z.any()).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

const wavespeedVideoPropsSchema = z.object({
  timeline: z.object({
    shortTitle: z.string(),
    elements: z.array(z.any()),
    text: z.array(z.any()),
    words: z.array(z.any()).optional(),
    audio: z.array(z.any()),
    music: z.array(z.any()).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StockVideo"
        component={StockVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={aiVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Stock Title",
            elements: [],
            text: [],
            audio: [],
            music: [],
            width: 1080,
            height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          if (!timeline || !timeline.elements.length) {
            return { durationInFrames: 150 };
          }
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lengthMs = lastElement.endMs || 0;
          const lengthFrames = Math.floor((lengthMs * 30) / 1000) + 30; // duration + 30 frames intro
          return {
            durationInFrames: lengthFrames,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="TextToVideo"
        component={WavespeedVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Text To Video",
            elements: [],
            text: [],
            words: [],
            audio: [],
            music: [],
            width: 1080,
            height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          if (!timeline || !timeline.elements.length) {
            return { durationInFrames: 150 };
          }
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lengthMs = lastElement.endMs || 0;
          const lengthFrames = Math.floor((lengthMs * 30) / 1000) + 30; // duration + 30 frames outro
          return {
            durationInFrames: lengthFrames,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="MicroDrama"
        component={WavespeedVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Micro Drama",
            elements: [],
            text: [],
            words: [],
            audio: [],
            music: [],
            width: 1920,
            height: 1080,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          if (!timeline || !timeline.elements.length) {
            return { durationInFrames: 150 };
          }
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lastAudio = timeline.audio[timeline.audio.length - 1];
          const contentEndMs = Math.max(lastElement.endMs || 0, lastAudio?.endMs || 0);
          const lengthFrames = Math.floor((contentEndMs * 30) / 1000) + 30; // duration + 30 frames outro
          return {
            durationInFrames: lengthFrames,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="UGC"
        component={WavespeedVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default UGC Ad",
            elements: [],
            text: [],
            words: [],
            audio: [],
            music: [],
            width: 1080,
            height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          if (!timeline || !timeline.elements.length) {
            return { durationInFrames: 150 };
          }
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lengthMs = lastElement.endMs || 0;
          const lengthFrames = Math.floor((lengthMs * 30) / 1000) + 30; // duration + 30 frames outro
          return {
            durationInFrames: lengthFrames,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="AgenticVideoGenerator"
        component={WavespeedVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Agentic Video",
            elements: [], text: [], words: [], audio: [], music: [], width: 1920, height: 1080,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lastAudio = timeline.audio[timeline.audio.length - 1];
          const contentEndMs = Math.max(lastElement?.endMs || 0, lastAudio?.endMs || 0);
          return {
            durationInFrames: contentEndMs ? Math.floor((contentEndMs * 30) / 1000) + 30 : 150,
            fps: 30,
            width: timeline.width || 1920,
            height: timeline.height || 1080,
          };
        }}
      />
      <Composition
        id="Luma"
        component={WavespeedVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Luma Video",
            elements: [], text: [], words: [], audio: [], music: [], width: 1920, height: 1080,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lastAudio = timeline.audio[timeline.audio.length - 1];
          const contentEndMs = Math.max(lastElement?.endMs || 0, lastAudio?.endMs || 0);
          return {
            durationInFrames: contentEndMs ? Math.floor((contentEndMs * 30) / 1000) + 30 : 150,
            fps: 30,
            width: timeline.width || 1920,
            height: timeline.height || 1080,
          };
        }}
      />
      <Composition
        id="VoxVideo"
        component={WavespeedVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Vox Collage Video",
            elements: [], text: [], words: [], audio: [], music: [], width: 1920, height: 1080,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lastAudio = timeline.audio[timeline.audio.length - 1];
          const contentEndMs = Math.max(lastElement?.endMs || 0, lastAudio?.endMs || 0);
          return {
            durationInFrames: contentEndMs ? Math.floor((contentEndMs * 30) / 1000) + 30 : 150,
            fps: 30,
            width: timeline.width || 1920,
            height: timeline.height || 1080,
          };
        }}
      />
      <Composition
        id="ZackDVideo"
        component={ZackDVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Zack D Short",
            elements: [], text: [], words: [], audio: [], music: [], width: 1080, height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lastAudio = timeline.audio[timeline.audio.length - 1];
          const contentEndMs = Math.max(lastElement?.endMs || 0, lastAudio?.endMs || 0);
          return {
            durationInFrames: contentEndMs ? Math.floor((contentEndMs * 30) / 1000) + 30 : 150,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="ComicDramaVideo"
        component={ComicDramaVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={wavespeedVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Comic Drama Episode",
            elements: [], text: [], words: [], audio: [], music: [], width: 1080, height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lastAudio = timeline.audio[timeline.audio.length - 1];
          const contentEndMs = Math.max(lastElement?.endMs || 0, lastAudio?.endMs || 0);
          return {
            durationInFrames: contentEndMs ? Math.floor((contentEndMs * 30) / 1000) + 30 : 150,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="StockImage"
        component={AIVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={aiVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default Stock Image Title",
            elements: [],
            text: [],
            audio: [],
            width: 1080,
            height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          if (!timeline || !timeline.elements.length) {
            return { durationInFrames: 150 };
          }
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lengthMs = lastElement.endMs || 0;
          const lengthFrames = Math.floor((lengthMs * 30) / 1000) + 30; // duration + 30 frames intro
          return {
            durationInFrames: lengthFrames,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="AIStoryboardVideo"
        component={AIVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={aiVideoPropsSchema}
        defaultProps={{
          timeline: {
            shortTitle: "Default AI Title",
            elements: [],
            text: [],
            audio: [],
            width: 1080,
            height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { timeline } = props;
          if (!timeline || !timeline.elements.length) {
            return { durationInFrames: 150 };
          }
          const lastElement = timeline.elements[timeline.elements.length - 1];
          const lengthMs = lastElement.endMs || 0;
          const lengthFrames = Math.floor((lengthMs * 30) / 1000) + 30; // duration + 30 frames intro
          return {
            durationInFrames: lengthFrames,
            fps: 30,
            width: timeline.width || 1080,
            height: timeline.height || 1920,
          };
        }}
      />
      <Composition
        id="General"
        component={General}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={generalSchema}
        defaultProps={{
          script: {
            title: "Default Video",
            durationSec: 10,
            fps: 30,
            width: 1920,
            height: 1080,
            scenes: [
              {
                startSec: 0,
                durationSec: 5,
                text: "Hello World",
                bgColor: "#1a1a2e",
                textColor: "#ffffff",
                animation: "fadeIn",
              },
              {
                startSec: 5,
                durationSec: 5,
                text: "Welcome to Remotion",
                bgColor: "#16213e",
                textColor: "#ffffff",
                animation: "slideUp",
              },
            ],
          },
        }}
        calculateMetadata={({ props }) => {
          const { script } = props;
          return {
            durationInFrames: Math.round(script.durationSec * script.fps),
            fps: script.fps,
            width: script.width,
            height: script.height,
          };
        }}
      />
      <Composition
        id="TextAnimation"
        component={TextAnimation}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={textAnimationSchema}
        defaultProps={{
          script: {
            title: "Text Animation",
            durationSec: 10,
            fps: 30,
            width: 1920,
            height: 1080,
            scenes: [
              {
                startSec: 0,
                durationSec: 10,
                text: "Kinetic Typography",
                bgColor: "#0f0f23",
                textColor: "#00d4ff",
                animation: "typewriter",
              },
            ],
          },
        }}
        calculateMetadata={({ props }) => {
          const { script } = props;
          return {
            durationInFrames: Math.round(script.durationSec * script.fps),
            fps: script.fps,
            width: script.width,
            height: script.height,
          };
        }}
      />
      <Composition
        id="SocialMedia"
        component={SocialMedia}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        schema={socialMediaSchema}
        defaultProps={{
          script: {
            title: "Social Media Video",
            durationSec: 15,
            fps: 30,
            width: 1080,
            height: 1920,
            scenes: [
              {
                startSec: 0,
                durationSec: 15,
                text: "Vertical Content",
                bgColor: "#1a1a2e",
                textColor: "#ffffff",
                animation: "bounce",
              },
            ],
          },
        }}
        calculateMetadata={({ props }) => {
          const { script } = props;
          return {
            durationInFrames: Math.round(script.durationSec * script.fps),
            fps: script.fps,
            width: script.width,
            height: script.height,
          };
        }}
      />
      <Composition
        id="Explainer"
        component={Explainer}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        schema={explainerSchema}
        defaultProps={{
          script: {
            title: "Explainer Video",
            durationSec: 20,
            fps: 30,
            width: 1920,
            height: 1080,
            scenes: [
              {
                startSec: 0,
                durationSec: 20,
                text: "Educational Content",
                bgColor: "#f8f9fa",
                textColor: "#212529",
                animation: "fadeIn",
              },
            ],
          },
        }}
        calculateMetadata={({ props }) => {
          const { script } = props;
          return {
            durationInFrames: Math.round(script.durationSec * script.fps),
            fps: script.fps,
            width: script.width,
            height: script.height,
          };
        }}
      />
      <Composition
        id="MotionGraphics"
        component={DynamicMotionGraphics}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={motionGraphicsSchema}
        defaultProps={{
          storyboard: {
            shortTitle: "Default Motion Graphics",
            slides: [],
            audio: [],
            music: [],
            width: 1080,
            height: 1920,
          },
        }}
        calculateMetadata={({ props }) => {
          const { storyboard } = props;
          if (!storyboard || !storyboard.slides || !storyboard.slides.length) {
            return { durationInFrames: 150 };
          }
          let totalFrames = 0;
          for (const slide of storyboard.slides) {
            totalFrames += slide.durationFrames || 90;
          }
          return {
            durationInFrames: totalFrames,
            fps: 30,
            width: storyboard.width || 1080,
            height: storyboard.height || 1920,
          };
        }}
      />
    </>
  );
};
