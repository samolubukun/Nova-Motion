# Luma-Powered Content Generator — Build Spec (Ray 3.2 / Luma Agents API)

**Goal:** Build an in-app content generation feature (like Luma's Dream Machine) where users can upload an image, upload their own video, or write a text prompt, pick a use-case scenario (UGC post, product ad, real estate listing, etc.), and get back a generated image or video via the Luma Agents API.

This doc is written to hand directly to an engineer or coding agent. It's built against the **Ray 3.2 / Luma Agents API** (the current generation of the API — different and newer than Luma's older `ray-2` REST docs). Covers: API surface, upload handling, core generation modes, use-case prompt templates, multi-clip video assembly, and suggested app flow.

---

## 1. API Basics

**Auth:** Bearer token, key from the Luma platform dashboard.

**Models:** `ray-3.2` for all video generation/editing/reframing. `uni-1` (default) or `uni-1-max` (higher quality, higher cost) for all image generation/editing.

All generation calls are **async**, using one shared pattern:
1. `POST` a generation request → returns HTTP 201 with `state: "queued"` and a top-level `id`.
2. Poll `GET /v1/generations/{id}` until `state` is `"completed"` or `"failed"`.
3. On completion, `output[].url` contains a **presigned MP4 URL that expires after 1 hour** — download to your own storage promptly, or re-poll to mint a fresh URL.
4. The generation `id` itself never expires — keep it, since it's what you reference later to extend, edit, or reframe that clip.

Video generations take longer than image generations. A 5s/720p clip typically finishes in under 2 minutes; 10s/1080p with HDR can take several times longer — build polling with a generous timeout (e.g. 10 min hard deadline, poll every 5s after an initial 30s wait).

Store the API key server-side only — your backend proxies all Luma calls, never the client.

---

## 2. Uploading User Media (Files API)

There's no separate "upload video" endpoint that does something on its own — instead, there's a **Files API**: upload a file there, get back a `file_id`, then pass that `file_id` into a generation request as the source.

Every place a Luma request wants a piece of source media (an image reference, a video source, a keyframe), it accepts the same options interchangeably:
- `{ "url": "https://..." }` — a hosted, publicly reachable URL
- `{ "data": "<base64>", "media_type": "video/mp4" }` — inline base64 (small files only — use `url` or `file_id` for anything larger)
- `{ "generation_id": "<id>" }` — a prior Luma generation (video or image) owned by the same client
- `{ "file_id": "<id>" }` — a file uploaded via the Files API (no `media_type` needed, it's recorded at upload)

**Practical upload flow for your app:** when a user uploads an image or video from their device, send it to the Files API first (or host it on your own CDN), get back a reference (`file_id` or hosted `url`), then use that reference in the actual generation/edit/reframe call.

**Constraints on uploaded video specifically:**
- Video used as a `video_edit` source: **≤18 seconds**
- Video used as a `video_reframe` source: **≤30 seconds**
- Max file size 200 MB for `url`/`data` sources.

---

## 3. Core Generation Modes

### A. Text-to-image — `type: "image"`
```json
{
  "model": "uni-1",
  "type": "image",
  "prompt": "A neon-lit Tokyo alley in the rain, reflections on wet pavement, cinematic photography",
  "aspect_ratio": "16:9",
  "style": "auto",
  "output_format": "png"
}
```
- **Aspect ratios:** `3:1`, `2:1`, `16:9`, `3:2`, `1:1`, `2:3`, `9:16`, `1:2`, `1:3` — or omit and let the model pick based on the prompt.
- **`style`**: `auto` (default) or `manga` (ink outlines/screentone shading). `style: "manga"` is **portrait-only** — restricted to `2:3`, `9:16`, `1:2`, `1:3`; pairing it with a landscape/square ratio is a 422. Useful if you ever want a stylized-illustration option in the scenario picker (e.g. an "animated/illustrated" toggle for education or non-profit content).
- **`output_format`**: `png` or `jpeg`, or omit to let the model pick.
- **`web_search: true`**: has the model search the web for visual references before generating — worth enabling by default for prompts naming real-world subjects, landmarks, or specific products, since it meaningfully improves accuracy (adds a few seconds to generation time).
- **`image_ref`**: up to 9 reference images (url/base64/`file_id`) for **style or content guidance on a brand-new image** — none of the reference's original pixels are preserved. This is for "make something new inspired by this," not for editing an existing image (see below). When using more than one reference, label each one's role explicitly in the prompt (e.g. "use the first reference for color palette, the second for composition") or the model guesses.

### B. Editing an existing/uploaded image — `type: "image_edit"`
This is the counterpart to `image_ref` above: use this when you want to **modify an existing image and keep its content** (change the background, restyle it, adjust an object), rather than generate something new.

```json
{
  "model": "uni-1",
  "type": "image_edit",
  "prompt": "Replace the background with a tropical beach at sunset, warm golden light matching the subject",
  "source": { "url": "https://example.com/portrait.jpg" }
}
```
- `source` is required here (and rejected on plain `type: "image"`) — exactly one of `url`, `data`+`media_type`, `generation_id`, or `file_id`. This is the mechanism for editing a user's uploaded product photo, headshot, etc. Max 50 MB / 8000px per side.
- Output dimensions are derived from the source image, not from a request parameter — `aspect_ratio` is ignored on edits, and `style: "manga"` is accepted regardless of source aspect ratio (unlike on plain generation).
- Can combine `source` (the image being edited) with `image_ref` (up to 8 additional style/content references) to guide the edit — e.g. "apply the lighting from the first reference and the texture from the second to the source image."
- For complex edits (background + color + style all at once), do them as separate sequential `image_edit` calls rather than one mega-prompt — more predictable results, each edit chainable via `source.generation_id` off the previous one.

### C. Text-to-video / Image-to-video — `type: "video"`
Single endpoint handles both, depending on whether you pass anchor frames.

```json
{
  "model": "ray-3.2",
  "type": "video",
  "prompt": "A slow dolly shot through a misty greenhouse at sunrise",
  "aspect_ratio": "16:9",
  "video": { "resolution": "720p", "duration": "5s" }
}
```

- **Aspect ratios:** `9:16`, `3:4`, `1:1`, `4:3`, `16:9`, `21:9`
- **Resolution:** `360p` (draft/fast preview), `540p`, `720p` (default), `1080p` (not yet available for vertical 9:16/3:4 — use 720p or lower for those)
- **Duration:** `5s` (default) or `10s`. `10s` is not supported together with `hdr`, `start_frame`, or `end_frame`.
- **HDR:** `video.hdr: true` — requires 720p/1080p, rejected with 360p/540p/10s/loop. Bills at a higher rate.
- **EXR export:** `video.exr_export: true` — requires `hdr: true`; delivers a professional-grade EXR alongside the MP4.
- **Loop:** `video.loop: true` — seamless loop, create-only, not supported with 10s/HDR/end_frame/keyframes.

**Image-to-video (anchor frames):** pass an image as `video.start_frame` and/or `video.end_frame` (same `ImageRef` shape as above — url/data/file_id/generation_id). Either, both, or neither is valid. Not supported with `duration: "10s"`.

**Multi-keyframe image-to-video (most powerful control):** instead of just start/end, pin up to 64 guide images at arbitrary points through the clip using two parallel arrays:
```json
"video": {
  "keyframes": [ { "url": "..." }, { "url": "..." }, { "url": "..." } ],
  "keyframe_indexes": [0, 60, 120]
}
```
`keyframe_indexes` are positions in the duration × 24fps frame grid (5s → 0–120, 10s → 0–240). Mutually exclusive with `start_frame`/`end_frame`/`loop` — use one approach or the other. This is the best option when you need to choreograph specific beats (e.g. a character's pose at 3 distinct points) rather than just a start/end.

### D. Extending a prior video (chaining clips)
To continue or prepend a **previously Luma-generated** video, pass its `id` as a `generation_id` anchor on a `type: "video"` request:

| Shape | Result |
|---|---|
| `video.start_frame: { "generation_id": "<id>" }` | Forward extend — prior clip becomes the start, new generation continues after it |
| `video.end_frame: { "generation_id": "<id>" }` | Backward extend — prior clip becomes the end, new generation is prepended before it |

This is what powers "one job = a stitched multi-clip video" (Section 5). Extend is standard-dynamic-range only (no HDR/EXR); `loop: true` only works on forward extend.

**Important limitation:** extend only works on **Luma-generated** clips (referenced via `generation_id`), not on a video a user uploaded from their own device. For a user's own uploaded footage, use editing/reframing instead (below).

### E. Editing an existing/uploaded video — `type: "video_edit"`
Re-renders a video under a new prompt — this is how to work with a **user's own uploaded footage** (not just Luma-generated clips), and also how to restyle a prior generation.

```json
{
  "model": "ray-3.2",
  "type": "video_edit",
  "prompt": "Transform the scene into moonlit 35mm film footage",
  "source": { "file_id": "<uploaded_video_file_id>" },
  "video": { "resolution": "720p", "edit": { "auto_controls": true } }
}
```
- `source` accepts exactly one of `generation_id`, `url`, `data`, or `file_id` — this is the mechanism for bringing in a user's own upload.
- Uploaded source video must be **≤18 seconds**.
- `video.edit.auto_controls: true` is the recommended default — model derives its own conditioning from the source.
- For finer control: `video.edit.strength` (9 presets from `adhere_1` through `reimagine_3` — how closely the edit sticks to the source vs. reinterprets it) or `video.edit.controls` (per-signal: pose, depth, normals, trajectory, face) — these are manual-mode alternatives to `auto_controls`, mutually exclusive with it.
- `video.edit.keyframes` + `keyframe_indexes` (same pattern as generation) is the strongest lever on edit quality — pin the exact look at specific moments in the source and the model holds it there.
- Output preserves the source's aspect ratio; setting `aspect_ratio` on an edit is silently ignored.
- `image_ref` is rejected here — guide edits via prompt + keyframes only.

### F. Reframing an existing/uploaded video — `type: "video_reframe"`
Changes aspect ratio (e.g. portrait → widescreen) while preserving the original content frame-for-frame, outpainting the newly exposed canvas.

```json
{
  "model": "ray-3.2",
  "type": "video_reframe",
  "prompt": "Extend the scene into cinematic widescreen",
  "aspect_ratio": "21:9",
  "source": { "file_id": "<uploaded_video_file_id>" },
  "video": { "resolution": "720p" }
}
```
- `source`: same options as edit — including a user's own uploaded video (**≤30 seconds**).
- `prompt` describes how to fill the newly exposed area.
- `video.source_position` (optional) lets you precisely control where the original footage sits within the new canvas, instead of the default centered-fit crop.
- HDR/EXR/loop/edit/start_frame/end_frame are all rejected on reframe — standard dynamic range only.
- **This is the key tool for "one video, many platform-native crops"** — generate/edit once, then reframe the same source into 9:16, 1:1, 16:9, etc. per platform.

---

## 4. Use-Case Scenarios → Prompt Strategy

Rather than one generic "enter a prompt" box, give users a **scenario picker**. Each scenario maps to a prompt template your backend assembles from structured user inputs — this is the biggest lever on output quality, more than the raw prompt box.

| Scenario | Key structured inputs | Prompt/API notes |
|---|---|---|
| **UGC-style product post** | product image, use-context ("coffee mug on cluttered desk, morning light"), platform | Push for handheld framing, mid-scene opening, natural lighting — avoid "studio" language. If user uploads their own reference video/character footage, bring it in via `video_edit` rather than pure generation. |
| **Product ad / e-commerce showcase** | product image or description, style, target placement | Photorealistic lighting, camera push-in/orbit — opposite pole from UGC. |
| **Product launch / reveal** | product story, tagline, tone | Multi-clip shot list: teaser → reveal → feature highlight (see Section 5). |
| **Real estate listing** | property photos or a walkthrough video, feature highlights | If user uploads their own walkthrough footage, use `video_edit`/`video_reframe` on it directly. If generating from photos, one clip per room, chained via extend. |
| **Event promo** | event details/theme, platform target, tone | Generate once, `video_reframe` per platform aspect ratio. |
| **Educational/tutorial** | lesson content/script, subject, audience level | More static/explanatory camera language. |
| **Non-profit/awareness** | mission narrative or testimonial, emotional tone | Prioritize authenticity over polish. |
| **Instagram Reels / social generic** | image, video, or prompt, style/speed | 9:16 default via `aspect_ratio` or `video_reframe` from an existing asset. |

### Generic strong-prompt formula (apply across all scenarios)
1. **Subject + action** — specific, not generic
2. **Camera/framing** — wide shot, close-up, tracking, drone, push-in, orbit
3. **Motion + mood/style** — slow drift vs rapid cut; cinematic/photorealistic/animated
4. **Setting/context** — where, when, lighting

Consider a lightweight LLM prompt-expansion step before submission for non-power-users (optional/toggleable).

---

## 5. One Job = One Video, Built from a Shot List

The core unit of the product: **a job produces one finished video**, assembled from clips stitched together via extend — not a raw duration slider.

**Flow per job:**
1. **User provides inputs for the scenario** — product images, a character reference, or their own uploaded video.
2. **Backend builds a shot list** — a sequence of clip prompts. E.g. UGC product ad: (1) character introduces product, (2) character uses/shows product, (3) reaction/CTA. Real estate: one clip per room.
3. **Decide the transition type between each pair of clips** — don't hardcode this per scenario; run a small LLM decision step for each clip boundary using the two beats' descriptions:
   - **Same continuous scene/motion** → forward-extend clip N+1 from clip N (`video.start_frame: { "generation_id": <clip N id> }`)
   - **Different scene, should flow smoothly** → generate clip N+1 independently, then `interpolate` between clip N and clip N+1
   - **Different scene, an intentional hard cut is fine** (common in UGC-style pacing) → generate clip N+1 independently, no interpolate, just sequence the assets
   This makes the system adapt per-job rather than assuming all product ads are one continuous take or all real-estate tours are hard cuts.
4. **Lock consistency across generated clips** using consistent reference images/`generation_id` chaining so the same character/product/style carries through.
5. **Generate clip 1** (`type: "video"`), then work through the shot list applying whichever transition type was decided in step 3 for each subsequent clip. Wait for each clip to reach `state: "completed"` before submitting the next.
6. **If the user supplied their own footage** for any part of the job, bring it in via `video_edit` (restyle to match) rather than trying to extend it — extend only works on Luma-generated clips.
7. **Queue as a background job**, not a synchronous request — poll or use a webhook-style callback pattern, submit next clip on completion, repeat until the shot list is done.
8. **Add audio** — see Section 5a below. Luma produces silent video only.
9. **Multi-platform export**: once the final video is assembled, run `video_reframe` against it once per target platform aspect ratio (9:16 for Reels/TikTok, 1:1/4:5 for feed, 16:9 for YouTube) rather than generating from scratch per platform.

Shot-list length is scenario-driven (e.g. UGC post ≈ 3 clips, real estate ≈ one clip per room) — surface an estimated cost/time based on shot-list length and chosen resolution/HDR before the user submits.

---

## 5a. Audio (voiceover, music, SFX)

**Ray produces silent video only** — no dialogue, no voiceover, no music, no sound effects, in any generation/edit/reframe mode. Anything audio-related has to be handled outside the Luma API, as a separate step in your pipeline:

1. **Generate the video** (silent) via the flow above.
2. **Generate audio separately**:
   - Voiceover → a TTS service (e.g. ElevenLabs) fed a script matching the video's pacing/duration.
   - Music/SFX → a licensed music library or a generative audio tool.
3. **Merge video + audio server-side** (e.g. ffmpeg) as a final assembly step, timed against the finished video's actual length.
4. **This merge step is what produces the final deliverable** the user downloads — not the raw Luma output.

Only bother with the voiceover/audio step for scenarios that need it (UGC, explainer, launch videos typically do; a silent product B-roll clip may not). Treat it as an optional stage in the job pipeline, not a mandatory one.

---

## 6. Suggested App Flow

1. **Input step**: user uploads image(s)/video and/or writes a text prompt. Uploads go through the Files API (or your own CDN) to get a `file_id`/hosted URL before anything else happens.
2. **Scenario picker**: determines which structured fields are shown and which prompt template/shot-list pattern is used.
3. **Format picker**: aspect ratio, resolution, HDR/EXR toggle (video only, note the resolution/duration restrictions above).
4. **Shot list assembly**: backend builds the clip-by-clip prompts. If user footage was uploaded, decide per-clip whether it's a fresh generation, an edit of their footage, or an extend of a prior generated clip. Show the user the shot list for edit/approval before submitting.
5. **Submit job**: background worker runs the multi-clip orchestration from Section 5.
6. **Status/progress**: poll `GET /v1/generations/{id}` per clip; relay progress to the client.
7. **Output**: show final asset, allow download (note the 1-hour presigned URL expiry — download to your own storage immediately on completion), and offer "iterate" (regenerate a clip), "extend" (add more), or "reframe for another platform."

---

## 7. Backend Data Model (suggested)

- `generation_jobs`: id, user_id, scenario_type, status, final_asset_url, has_audio, created_at
- `generation_clips`: id, job_id, luma_generation_id, sequence_index, source_type (generated/edited/reframed-from-upload), transition_type (extend/interpolate/hard_cut, applies to the link with the previous clip), prompt_used, status, asset_url
- `user_uploads`: id, user_id, luma_file_id or cdn_url, type (image/video), duration_seconds, used_in_job_id
- `platform_exports`: id, job_id, aspect_ratio, luma_generation_id (the reframe generation), asset_url
- `audio_tracks`: id, job_id, type (voiceover/music/sfx), source (tts/library/generated), asset_url
- `prompt_templates`: scenario_type, template_string, required_fields (json)

---

## 8. Notes / Open Items for the Engineer

- Confirm current rate limits and per-second/per-resolution/HDR pricing before finalizing cost estimates shown to users.
- Presigned output URLs expire in 1 hour — the job worker must download/persist the asset to your own storage as soon as a generation completes, not rely on the Luma URL long-term.
- Uploaded video length limits differ by use: ≤18s for `video_edit` source, ≤30s for `video_reframe` source — validate on upload and surface this to users before they try to submit something longer.
- Add your own moderation/validation layer on uploaded media and prompts before sending to Luma.
- Build the LLM prompt-expansion step as optional/toggleable — power users may want to submit raw prompts unmodified.
- **Set expectations on output quality for long chains**: extend chains (and to a lesser extent interpolate) can visually drift over several clips — lighting, character/product consistency, and framing can shift subtly by clip 4-6. Treat 5-15s outputs as reliably strong and 30-60s outputs as "usually good, review before publishing" rather than guaranteed one-shot perfect — build a per-clip regenerate option into the UI rather than only a whole-job regenerate.
- Luma has no native audio in any mode. Voiceover/music/SFX is a separate pipeline stage (TTS + audio library + ffmpeg merge) layered on top of the finished silent video — see Section 5a.
