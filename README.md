# Content Nova Video Engine

A unified automated video generation API service. This project merges several short-form video creation engines into a single Next.js API gateway and Express queue rendering backend. It generates high-quality videos using OpenAI, Deepgram, Pexels, and Remotion.

All assets (voiceovers, background images, and final rendered videos) are automatically uploaded to DigitalOcean Spaces or Cloudflare R2, returning public URLs.

---

## Video Generation Models (Compositions)

### 1. AI Storyboard Video (`videoType: "AIVideo"`)
Produces highly engaging vertical story videos (9:16) using gpt-image-2 image generation.
* **GPT-4o-mini**: Writes a narrative story script and detailed visual scene descriptions.
* **gpt-image-2**: Generates high-resolution vertical portrait illustrations for each scene.
* **Deepgram Aura TTS & Nova-2 STT**: Synthesizes natural narration and transcribes word-level offsets for kinetic subtitle alignments.

### 2. Stock Video Short (`videoType: "StockVideo"`)
Generates vertical videos (9:16) by sourcing stock clips from Pexels.
* **GPT-4o-mini**: Writes the script and outputs context-based search keywords.
* **Pexels API**: Fetches relevant vertical stock video loops.
* **Background Music**: Low-volume background tracks mixed under the voiceover.
* **Deepgram TTS + STT**: Narrates and maps word captions.

### 3. Typography/Layout Slide Videos (`videoType: "SocialMedia" | "Explainer" | "General" | "TextAnimation"`)
Clean layouts using modern typographic animations and styles.
* **Claude/OpenAI**: Writes structured JSON scripts defining slide colors, text, and timing.
* **Deepgram**: Overlays audio voiceovers.

### 4. Motion Graphics & Data Visualizations (`videoType: "MotionGraphics"`)
Produces premium, highly animated visual components such as charts, hacker text, neon typography, and mock UI interactions.
* **OpenAI (GPT-4o-mini)**: Generates a complete storyboard containing glitch/neon/wave text, bar/pie/line charts, growth metrics, and simulated UI interactions (buttons, tabs, forms, modals).
* **Deepgram & Background Music**: Synthesizes custom TTS narration for each scene and overlays background audio tracks.

---

## Tech Stack
* **Framework**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
* **AI Engines**: OpenAI (GPT-4o-mini, gpt-image-2), Deepgram (Aura TTS, Nova-2 STT)
* **Stock Sourcing**: Pexels Video API
* **Rendering**: Remotion Core, Express.js (render queue server)
* **Cloud Storage**: DigitalOcean Spaces / Cloudflare R2 (S3-compatible)

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root of the project:
```env
# AI API Keys
OPENAI_API_KEY=your-openai-api-key
DEEPGRAM_API_KEY=your-deepgram-api-key
PEXELS_API_KEY=your-pexels-api-key

# Render Server Configuration
RENDER_SERVER_URL=http://localhost:3001
RENDER_SERVER_SECRET=your-secret-string

# DigitalOcean Spaces Storage (Optional - falls back to local files)
SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
SPACES_KEY=your-do-access-key
SPACES_SECRET=your-do-secret-key
SPACES_BUCKET_NAME=your-bucket-name
SPACES_PUBLIC_URL=https://your-custom-cdn.com
```

### 3. Start the Render Server
The rendering backend handles the queue and runs chromium in headless mode to render the video files.
```bash
npm run render-server
```

### 4. Start the Next.js API Gateway
In a new terminal:
```bash
npm run dev
```

---

## API Documentation

### 1. Generate Video (`POST /api/videos`)
Submits a prompt to generate and render a new video.

#### Request Parameters
All endpoints support the following root payload fields:
* **`prompt`** (string, required): The core instruction, script, topic, or concept to generate.
* **`videoType`** (string, required): The video template mode. Must be one of:
  * `"AIVideo"`: AI Storyboard mode (gpt-image-2 images + voiceover).
  * `"StockVideo"`: Pexels stock footage mode (stock video loops + voiceover).
  * `"SocialMedia"`: Kinetic typographic slide style (quotes/shorts).
  * `"Explainer"`: Multi-step layout slides supporting step numbers.
  * `"General"`: Simple slide layout transitions.
  * `"TextAnimation"`: Words with active highlighting animations.
  * `"MotionGraphics"`: Dynamic motion graphics, charts, and interactive UI component simulations.
* **`aspectRatio`** (string, optional): Target video layout format. Must be one of:
  * `"9:16"`: Portrait (mobile vertical) - defaults to `1080x1920`.
  * `"16:9"`: Landscape (widescreen desktop) - defaults to `1920x1080`.
  * `"1:1"`: Square (social feed block) - defaults to `1080x1080`.
* **`durationSec`** (number, optional): Target video duration (under 45 seconds is recommended).
* **`topic`** (string, optional): Context topic used to direct scriptwriting style.
* **`voice`** (string, optional): Deepgram voice key to customize narrator voice (e.g., `"aura-2-aries-en"`, `"aura-2-arcas-en"`, `"aura-2-luna-en"`).
* **`style`** (object, optional): Global branding override parameters:
  * `primaryColor` (string): Background or primary element hex code (e.g. `"#020617"`).
  * `secondaryColor` (string): Accent highlight hex code (e.g. `"#38bdf8"`).
  * `textColor` (string): Slide foreground text hex code (e.g. `"#ffffff"`).

---

#### Endpoint A: AI Storyboard Video (`videoType: "AIVideo"`)
Produces animated vertical or landscape shorts using **`gpt-image-2`** base64 illustration generation and Deepgram TTS voiceover.
* **Example Payload**:
  ```json
  {
    "prompt": "The mystery of the Oak Island money pit",
    "videoType": "AIVideo",
    "topic": "History",
    "aspectRatio": "16:9",
    "voice": "aura-2-aries-en"
  }
  ```

#### Endpoint B: Stock Video Short (`videoType: "StockVideo"`)
Produces shorts using context-matched Pexels stock video footage, Deepgram TTS voiceover, and background music overlays.
* **Example Payload**:
  ```json
  {
    "prompt": "Top 3 healthy habits for programmers",
    "videoType": "StockVideo",
    "topic": "Health",
    "aspectRatio": "16:9",
    "voice": "aura-2-arcas-en"
  }
  ```

#### Endpoint C: Typographic Slide Videos (`videoType` Options: `"SocialMedia" | "Explainer" | "General" | "TextAnimation"`)
Outputs animated text slides with dynamic TTS voiceover. Layout automatically adapts font dimensions to the target aspect ratio.
* **Example Payload**:
  ```json
  {
    "prompt": "A quote by Steve Jobs about design",
    "videoType": "SocialMedia",
    "durationSec": 15,
    "aspectRatio": "1:1",
    "style": {
      "primaryColor": "#0f172a",
      "textColor": "#38bdf8"
    }
  }
  ```

#### Endpoint D: Motion Graphics & Data Visualizations (`videoType: "MotionGraphics"`)
Generates highly animated technical slides with data visualization layouts (bar charts, pie charts, line charts, gauge progress charts, process timelines, ranking lists) and simulated UI components (buttons, tabs, inputs, toggle switches, toast messages).
* **Example Payload**:
  ```json
  {
    "prompt": "Show a comparison of the top 3 programming languages in 2026",
    "videoType": "MotionGraphics",
    "topic": "Programming",
    "aspectRatio": "9:16",
    "voice": "aura-2-aries-en"
  }
  ```

---

### Exact JSON Request Payloads for All Video Modes
All requests must be sent as `POST` requests to:
`http://localhost:3000/api/videos`

#### 1. AI Storyboard Video (`AIVideo`)
```json
{
  "prompt": "Explain how black holes are formed in space",
  "videoType": "AIVideo",
  "topic": "Space Science",
  "aspectRatio": "16:9",
  "voice": "aura-2-aries-en"
}
```

#### 2. Stock Footage Video (`StockVideo`)
```json
{
  "prompt": "Why drinking water in the morning improves focus",
  "videoType": "StockVideo",
  "topic": "Wellness & Health",
  "aspectRatio": "16:9",
  "voice": "aura-2-arcas-en"
}
```

#### 3. Social Media Typography Slide (`SocialMedia`)
```json
{
  "prompt": "A short piece of advice about starting a business today",
  "videoType": "SocialMedia",
  "aspectRatio": "9:16",
  "durationSec": 15,
  "style": {
    "primaryColor": "#020617",
    "textColor": "#38bdf8"
  }
}
```

#### 4. Explainer Presentation Slide (`Explainer`)
```json
{
  "prompt": "3 steps to write clean code",
  "videoType": "Explainer",
  "aspectRatio": "16:9",
  "durationSec": 20,
  "style": {
    "primaryColor": "#1e1b4b",
    "textColor": "#818cf8"
  }
}
```

#### 5. General Slide Layout (`General`)
```json
{
  "prompt": "A description of the scale of the solar system",
  "videoType": "General",
  "aspectRatio": "1:1",
  "durationSec": 15,
  "style": {
    "primaryColor": "#172554",
    "textColor": "#f8fafc"
  }
}
```

#### 6. Text Animation / Kinetic Highlight (`TextAnimation`)
```json
{
  "prompt": "A high energy quote about doing your best work",
  "videoType": "TextAnimation",
  "aspectRatio": "9:16",
  "durationSec": 12,
  "style": {
    "primaryColor": "#000000",
    "textColor": "#ffffff"
  }
}
```

#### 7. Motion Graphics Video (`MotionGraphics`)
```json
{
  "prompt": "Show a comparison of the top 3 programming languages in 2026",
  "videoType": "MotionGraphics",
  "topic": "Programming",
  "aspectRatio": "9:16",
  "voice": "aura-2-aries-en"
}
```

* **Response**:
  ```json
  {
    "success": true,
    "jobId": "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
    "status": "queued",
    "createdAt": "2026-07-01T18:00:00.000Z"
  }
  ```

---

### API Modes: Generate vs. Direct Render

The endpoint `POST /api/videos` operates in two distinct modes depending on your payload structure:

#### A. Generate Mode (AI Auto-styling)
If you only supply a `"prompt"`, OpenAI will dynamically write the script or timeline. You can pass optional **`style` overrides** to guide the AI's aesthetic choices.

Additionally, you can specify a consistent **`voice`** parameter to narrate the entire video. If omitted, the API will randomly pick a single voice and use it consistently for all scenes of that video.

* **Supported Voices**: `"aura-2-thalia-en"`, `"aura-2-andromeda-en"`, `"aura-2-arcas-en"`, `"aura-2-aries-en"`

```json
{
  "prompt": "A quote by Steve Jobs about design",
  "videoType": "SocialMedia",
  "voice": "aura-2-thalia-en",     // Optional premium Aura-2 voice override
  "style": {
    "primaryColor": "#0f172a",    // Guide AI to use slate blue backgrounds
    "textColor": "#38bdf8"       // Guide AI to use light blue text
  }
}
```

#### B. Direct Render Mode (Full Custom Control)
If you want to design a custom editor interface where the user manually controls every slide (timing, background color, text color, individual animations, and voiceover audio files), you can submit a fully pre-defined `script` or `timeline` object. In this mode, the server skips OpenAI completely and renders the exact parameters provided:
```json
{
  "videoType": "SocialMedia",
  "script": {
    "title": "Manual Quote",
    "durationSec": 10,
    "fps": 30,
    "width": 1080,
    "height": 1920,
    "scenes": [
      {
        "text": "Design is not just what it looks like.",
        "startSec": 0,
        "durationSec": 5,
        "bgColor": "#1e1b4b",
        "textColor": "#facc15",
        "fontSize": 64,
        "animation": "bounce",
        "audioUrl": "/assets-temp/scene-0.mp3"
      },
      {
        "text": "Design is how it works.",
        "startSec": 5,
        "durationSec": 5,
        "bgColor": "#020617",
        "textColor": "#38bdf8",
        "fontSize": 64,
        "animation": "typewriter",
        "audioUrl": "/assets-temp/scene-1.mp3"
      }
    ]
  }
}
```

---

### 2. Get Video Link / Job Status (`GET /api/videos/:jobId`)
Polls the render queue status. Once rendering is completed, it uploads the final `.mp4` file to your S3 storage bucket and returns the public link.

* **Response (completed)**:
  ```json
  {
    "jobId": "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
    "status": "completed",
    "progress": 100,
    "videoUrl": "https://your-spaces-bucket.nyc3.digitaloceanspaces.com/videos/a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6.mp4",
    "createdAt": "2026-06-30T04:30:00.000Z",
    "startedAt": "2026-06-30T04:30:05.000Z",
    "completedAt": "2026-06-30T04:30:50.000Z"
  }
  ```

---

## Troubleshooting

### Render server cannot connect
* Ensure the render server is running on port `3001` (`npm run render-server`).
* If deploying, verify your Cloudflare Tunnel URL and ensure `RENDER_SERVER_SECRET` matches on both frontend and backend.

### Video fails to render
* Verify that `ffmpeg` is installed: `ffmpeg -version`.
* Ensure chrome headless dependencies are present: `npx remotion browser ensure`.

### OpenAI/Deepgram API errors
* Check that your API keys are active and have sufficient balance limits.
* Monitor service statuses: [OpenAI Status](https://status.openai.com/), [Deepgram Status](https://status.deepgram.com/).
