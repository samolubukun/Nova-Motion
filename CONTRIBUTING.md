# Contributing to Nova Motion

Thanks for contributing. Nova Motion is an AI video generation engine - a Next.js API gateway, an Express render queue, Remotion compositions, and a bunch of AI pipelines powered by WaveSpeed, OpenAI, ElevenLabs, Deepgram, Luma, Pexels, and Pixabay.

Every contribution counts, whether you are:

- Verifying that a video mode still works against the live APIs and fixing what broke.
- Improving an existing pipeline (scripts, visuals, narration, captions, music).
- Adding a brand new video mode.
- Fixing bugs, sharpening the studio UI, or improving the docs.

This guide walks you through the setup, how to test a mode end to end, and how to add a new mode.

---

## Priority Areas

These are the areas that move the project forward, roughly in order of importance.

### 1. Verify and fix the untested modes (highest priority)

Only four modes are confirmed working today: **AI Storyboard**, **Text to Video**, **Stock Video**, and **Stock Image**. The rest need to be confirmed against the live APIs and fixed where they break: **Vox**, **UGC**, **Motion Graphics**, **MicroDrama**, **Agentic Video**, **Luma**, and the typography slide modes.

Each verification is: run the mode end to end, confirm the output, and either report a clean pass or fix what broke. Verification PRs are the single most valuable contribution right now.

### 2. Harden the pipeline and workflow

Every mode is a production pipeline made of ordered steps: the request is validated at the gateway, the job is queued on the render server, an LLM writes the script or beat map, media is generated (images, clips, music), narration is synthesized with word timestamps, and Remotion assembles everything into the final mp4. Understanding these steps - which are parallelizable, which depend on earlier output, which can fail independently - is the key to improving the whole system.

Make the generation workflow more reliable: better error messages, retries on transient provider failures, graceful fallbacks for every sub-step, accurate progress reporting, and a smoother submit-to-poll-to-download loop. Structural workflow improvements - splitting long jobs into smaller stages, reusing generated assets, caching repeated API calls, or streaming progress between the servers - are especially valuable.

### 3. Improve the studio / frontend

Polish the web UI, the `/ugc` studio, and the prompt-to-video experience - communication surfaces such as progress feedback, job history, and any chat-driven generation flow. Anything that makes creating a video from the browser easier is welcome.

### 4. Improve the existing modes

Better scripts and narratives, stronger visuals, tighter captions, and richer music for every mode already shipped.

### 5. Add new modes

New formats, new models, and new explainer styles, following the add-a-mode pattern below.

### General housekeeping

Bug fixes, performance, documentation, and anything that keeps the codebase clean are always welcome at any priority level.

---

## Table of Contents

1. [Repository Layout](#repository-layout)
2. [Local Setup](#local-setup)
3. [API Keys and What They Unlock](#api-keys-and-what-they-unlock)
4. [Running the Stack](#running-the-stack)
5. [Verifying a Video Mode End to End](#verifying-a-video-mode-end-to-end)
6. [Adding a New Video Mode](#adding-a-new-video-mode)
7. [Code Style and Conventions](#code-style-and-conventions)
8. [Workflow: Issues and Pull Requests](#workflow-issues-and-pull-requests)
9. [Troubleshooting](#troubleshooting)

---

## Repository Layout

```text
├── src/
│   ├── app/                  # Next.js gateway (API routes, studio UI, /ugc studio)
│   │   ├── api/videos/       #   POST /api/videos, GET /api/videos/:jobId
│   │   ├── api/upload/       #   Asset upload (returns hosted URLs)
│   │   └── api/generate/     #   Script-only generation helpers
│   ├── lib/                  # Generation pipelines (wavespeed, vox, luma, ugc, micro-drama, ...)
│   ├── remotion/             # Remotion compositions (Root.tsx, WavespeedVideo, ...)
│   └── components/           # Studio UI components
├── render-server/            # Express queue rendering backend (headless Chromium)
│   ├── server.ts             #   POST /render/* endpoints (one per async mode)
│   ├── renderer.ts           #   Pipeline dispatch + Remotion rendering
│   ├── queue.ts              #   In-memory job queue state
│   └── storage.ts            #   Local / S3 (Spaces / R2) storage layer
├── shared/                   # Zod request/response schemas shared by both servers
└── .env.local.example        # Every environment variable, documented
```

The gateway and the render server are two processes that talk over HTTP. The gateway validates a request, creates a job, and forwards it to the render server. The render server runs the AI pipeline and renders the mp4 with Remotion.

---

## Local Setup

### Prerequisites

- Node.js 20+ and npm
- ffmpeg on your PATH (`ffmpeg -version`)
- A Chromium/Chrome build for headless rendering:

```bash
npx remotion browser ensure
```

### Install

```bash
npm install
```

### Environment Variables

Copy the example env file and fill in your own keys:

```bash
cp .env.local.example .env.local
```

`.env.local` is gitignored and is never committed. You need your own API keys - see the table below for what each key unlocks. Start with the smallest set of keys you need for the mode you are working on.

---

## API Keys and What They Unlock

| Variable | Provider | Unlocks |
| --- | --- | --- |
| `OPENAI_API_KEY` | OpenAI | `AIStoryboardVideo` (scripts + gpt-image-2 illustrations); fallback LLM for Luma planning |
| `ELEVENLABS_API_KEY` | ElevenLabs | Primary TTS with native word timestamps (captions) for most narration modes |
| `DEEPGRAM_API_KEY` | Deepgram | Fallback TTS (Aura) + Nova-2 STT word timestamps when ElevenLabs is absent |
| `WAVESPEED_API_KEY` | WaveSpeed | Seedream images, Seedance text/image-to-video, Lyria music, lipsync-2, LLM (llm.wavespeed.ai) |
| `LUMA_AGENTS_API_KEY` | Luma | `Luma` mode (Ray 3.2: text-to-video, image-to-video, loop, extend, edit, reframe) |
| `PEXELS_API_KEY` | Pexels | `StockVideo` mode (stock video loops) |
| `PIXABAY_API_KEY` | Pixabay | `StockImage` mode (stock images) |

Optional overrides live in `.env.local.example`: WaveSpeed model defaults (`WAVESPEED_VIDEO_MODEL`, `WAVESPEED_IMAGE_MODEL`, `WAVESPEED_I2V_MODEL`, ...), Luma LLM (`LUMA_LLM_URL`, `LUMA_LLM_MODEL`), Vox LLM (`VOX_LLM_URL`, `VOX_LLM_MODEL`), storage (DO Spaces / Cloudflare R2), and render-server settings.

If a key is missing, that mode returns an error at submission time with a clear message telling you which key it needs.

---

## Running the Stack

The gateway and the render server run as two separate processes. Run them in two terminals.

### 1. Render server (port 3001)

```bash
npm run render-server
```

Use `npm run render-server:dev` for auto-reload while iterating on pipeline code.

### 2. API gateway (port 3005)

```bash
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js gateway on port 3005 |
| `npm run render-server` | Express render queue on port 3001 |
| `npm run lint` | ESLint over the repo |
| `npx tsc --noEmit` | TypeScript typecheck |
| `npm run remotion:studio` | Remotion studio for composition work |
| `npm run remotion:render` | Render a single composition to a file |

The studio UI is at `http://localhost:3005`. The UGC studio lives at `http://localhost:3005/ugc`.

---

## Verifying a Video Mode End to End

Modes are async: you submit a job and poll until it is done.

1. Make sure the render server and the gateway are both running.
2. `POST /api/videos` with a valid payload for the mode you are testing.
3. Poll `GET /api/videos/{jobId}` until `status` becomes `completed`.
4. Confirm the response returns a `videoUrl` and that the mp4 plays.

Example with curl:

```bash
curl -X POST http://localhost:3005/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "videoType": "TextToVideo",
    "prompt": "Weird facts about the deep ocean",
    "topic": "Marine Biology",
    "aspectRatio": "9:16"
  }'
```

You get back a `jobId`. Poll:

```bash
curl http://localhost:3005/api/videos/<jobId>
```

### What "works" means

- The job reaches `completed` without a provider error, or fails with a clear, actionable error.
- The audio is present and matches the narration; captions are roughly synced to the words.
- The visuals match the prompt, the aspect ratio is correct, and the file plays.
- The pipeline handles a failing sub-step gracefully (non-fatal fallbacks) instead of crashing the job.

### Picking a fast test case

- `TextToVideo` with a short `prompt` and the default `WAVESPEED_VIDEO_MODEL` (cheap Seedance, 480p, 5s clips) is the fastest end-to-end smoke test of the WaveSpeed path.
- `VoxVideo` with `targetDurationSeconds` near 10-15 keeps the collage pipeline short.
- `Luma` without media attachments is a single generation call.
- Stock modes (`StockVideo`, `StockImage`) are deterministic and cheap - good for testing the narration + caption path.

---

## Adding a New Video Mode

Every mode follows the same seven-file pattern. `VoxVideo` is the best reference: a self-contained pipeline added end to end. The checklist:

1. **Schema** (`shared/video-schema.ts`): add the new `videoType` to the enum and a `zod` request schema for its inputs (required fields, defaults, enum validation).
2. **Gateway branch** (`src/app/api/videos/route.ts`): validate the request and submit it to the render server. For async modes, create a `submitXxxToRenderServer` helper.
3. **Render-server endpoint** (`render-server/server.ts`): add `POST /render/<mode>` with the same shape as the existing handlers (auth via `RENDER_SERVER_SECRET`, enqueue, return `{ jobId }`).
4. **Queue fields** (`render-server/queue.ts`): store the mode-specific inputs on the job.
5. **Pipeline** (`render-server/renderer.ts` + `src/lib/`): build the timeline. Reuse the existing clients (`wavespeed.ts`, `elevenlabs.ts`, `deepgram.ts`) and fall back gracefully on sub-step failure. Keep the pipeline function in `src/lib/` so it is testable without the HTTP layer.
6. **Composition** (`src/remotion/Root.tsx`): register a composition whose `id` exactly matches the `videoType`. Reuse an existing composition (e.g. `WavespeedVideo`) when the output is a similar timeline.
7. **UI (optional but appreciated)** (`src/app/page.tsx` or `/ugc`): add the mode to the picker with its controls.
8. **Docs**: add the mode to `README.md` (models section + an exact JSON payload) and note any new env vars in `.env.local.example`.

Good candidates for a new mode: another explainer format, a new video model, or a different script-to-video flow. When in doubt, open an issue first to discuss the design.

---

## Code Style and Conventions

- **TypeScript everywhere**; keep types tight and explicit. Run `npx tsc --noEmit` before pushing.
- **ESLint** is configured - run `npm run lint` and fix warnings in the files you touch.
- **Reuse existing clients.** Media/TTS/LLM calls go through the shared wrappers in `src/lib/`. Do not re-implement API calls inline in the render server.
- **Fail gracefully.** Sub-steps that can fail independently (a clip, a music track, a TTS file) should be non-fatal with a clear `updateProgress` message, not a thrown job.
- **Commit in small, focused commits.** Match the existing style: short imperative messages, one logical change per commit, docs last.

---

## Workflow: Issues and Pull Requests

1. Open an issue (or comment on an existing one) describing what you want to fix or build.
2. Create a branch from `main`: `git checkout -b fix/describe-the-fix`.
3. Make your changes, keeping commits small and focused.
4. Run `npm run lint` and `npx tsc --noEmit`.
5. Test the affected mode end to end (see above) and note the result in the PR description.
6. Open a pull request referencing the issue and summarizing what changed and how you tested it.

Maintainers will review, suggest changes, and merge once the checks pass.

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security vulnerabilities should be reported privately per the [Security Policy](SECURITY.md), not as public issues.

---

## Troubleshooting

- **`Render server cannot connect`**: make sure `npm run render-server` is up on port 3001 and that `RENDER_SERVER_URL` matches. If the secret is set, it must match on both sides.
- **`ffmpeg` not found**: install ffmpeg and make sure it is on your PATH.
- **Blank/failed renders**: run `npx remotion browser ensure` to refresh the headless browser.
- **Provider errors**: check the API key for the mode (table above), that the key is active, and that the model id exists. The job logs the exact error - include it in bug reports.
- **Storage errors**: without Spaces/R2 configured, videos are saved to local disk (`rendered-videos/`). Add the storage env vars only if you need public URLs.
