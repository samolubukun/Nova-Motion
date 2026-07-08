import { Composition } from "remotion";
import { General, generalSchema } from "./compositions/General";
import { TextAnimation, textAnimationSchema } from "./compositions/TextAnimation";
import { SocialMedia, socialMediaSchema } from "./compositions/SocialMedia";
import { Explainer, explainerSchema } from "./compositions/Explainer";
import { AIVideo } from "./compositions/AIVideo";
import { StockVideo } from "./compositions/StockVideo";
import { z } from "zod";

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
        id="AIVideo"
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
    </>
  );
};
