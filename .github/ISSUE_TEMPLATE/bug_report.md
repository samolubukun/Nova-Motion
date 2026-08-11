---
name: Bug report
about: Report a bug or a mode that is not working as expected
title: "[Bug] "
labels: bug
assignees: ""
---

**Describe the bug**

A clear and concise description of what is wrong.

**Which mode / area**

Which video mode is affected (AIStoryboardVideo, StockVideo, StockImage, TextToVideo, MicroDrama, UGC, AgenticVideoGenerator, MotionGraphics, VoxVideo, Luma, or a typography slide mode)? Or is this about the API gateway, the render server, the studio UI, or docs?

**To reproduce**

Steps to reproduce the behavior:

1. Send this payload to `POST /api/videos`:

```json
{
  "videoType": "TextToVideo",
  "prompt": "Your prompt here",
  "aspectRatio": "9:16"
}
```

2. Poll `GET /api/videos/<jobId>` and note the status/progress.
3. Paste any error message from the job or the terminal.

**Expected behavior**

What you expected to happen instead.

**Actual behavior**

What actually happened. Include the exact error message, `jobId`, and relevant log lines.

**Screenshots**

If applicable, add screenshots of the output or error.

**Environment**

- OS: [e.g. Windows, macOS, Linux]
- Node version: [e.g. 20.x]
- Browser (for UI issues): [e.g. Chrome 130]
- Storage config: [local / DigitalOcean Spaces / Cloudflare R2]

**Additional context**

Anything else that might help: `.env.local` keys present (names only, never the values), models used, etc. Never share real API keys.
