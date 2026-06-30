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

#### Endpoint A: AI Storyboard Video (`videoType: "AIVideo"`)
Produces animated vertical shorts using **`gpt-image-2`** base64 illustration generation and Deepgram TTS voiceover.
* **Payload**:
  ```json
  {
    "prompt": "The mystery of the Oak Island money pit",
    "videoType": "AIVideo",
    "topic": "History"
  }
  ```

#### Endpoint B: Stock Video Short (`videoType: "StockVideo"`)
Produces vertical shorts using matching Pexels stock video footage, Deepgram TTS voiceover, and randomized background music overlays (resolved locally to avoid CORS).
* **Payload**:
  ```json
  {
    "prompt": "Top 3 healthy habits for programmers",
    "videoType": "StockVideo",
    "topic": "Health"
  }
  ```
* **Configuration (Optional Background Music)**:
  * To disable the background music overlay, simply omit the `music` array from the generated timeline payload submitted to the render server. Remotion will bypass the audio overlay automatically.

#### Endpoint C: Typographic Slide Videos
Outputs animated text slides with dynamic TTS voiceover. You can request any of the following 4 distinct layouts:
* **`videoType` Options**:
  * `"SocialMedia"`: Mobile/Social optimized quotes.
  * `"Explainer"`: Multi-step layout slides supporting step-numbers.
  * `"General"`: Simple, clean slide transitions.
  * `"TextAnimation"`: Highly animated active kinetic word highlights.
* **Payload**:
  ```json
  {
    "prompt": "A quote by Steve Jobs about design",
    "videoType": "SocialMedia",
    "durationSec": 15
  }
  ```
* **Infused Styling & Elements (Optional)**:
  * You can customize each scene inside the script payload to infuse custom colors, animations, and typography styles:
    ```json
    {
      "text": "Design is how it works.",
      "bgColor": "#020617",       // Hex color code
      "textColor": "#38bdf8",     // Hex color code
      "fontSize": 48,             // Custom font sizing
      "animation": "bounce"       // Transitions: fadeIn, slideUp, slideDown, slideLeft, slideRight, scale, bounce, typewriter
    }
    ```

* **Response**:
  ```json
  {
    "success": true,
    "jobId": "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
    "status": "queued",
    "createdAt": "2026-06-30T04:30:00.000Z"
  }
  ```

---

### API Modes: Generate vs. Direct Render

The endpoint `POST /api/videos` operates in two distinct modes depending on your payload structure:

#### A. Generate Mode (AI Auto-styling)
If you only supply a `"prompt"`, OpenAI will dynamically write the script or timeline. You can pass optional **`style` overrides** to guide the AI's aesthetic choices:
```json
{
  "prompt": "A quote by Steve Jobs about design",
  "videoType": "SocialMedia",
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
