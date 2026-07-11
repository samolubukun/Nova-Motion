import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const renderScriptPath = path.join(__dirname, "render-user-video.ts");
let fileContent = fs.readFileSync(renderScriptPath, "utf-8");

// We want to add dynamic text and titles to the props in render-user-video.ts
// Let's modify the scenes array in the typescript file using regex replacements.

// Replace empty props of Logo* with text: "ContentNova 2.0"
fileContent = fileContent.replace(
  /"type":\s*"(Logo\w+)",\s*"durationFrames":\s*(\d+),\s*"props":\s*\{\s*"startDelay":\s*0\s*\}/g,
  `"type": "$1",\n      "durationFrames": $2,\n      "props": {\n        "startDelay": 0,\n        "text": "ContentNova 2.0"\n      }`
);

// Replace empty props of Cinematic* with title: "ContentNova 2.0", subtitle: "Brand Story"
fileContent = fileContent.replace(
  /"type":\s*"(Cinematic\w+)",\s*"durationFrames":\s*(\d+),\s*"props":\s*\{\s*"startDelay":\s*0\s*\}/g,
  `"type": "$1",\n      "durationFrames": $2,\n      "props": {\n        "startDelay": 0,\n        "title": "ContentNova 2.0",\n        "subtitle": "Brand Story"\n      }`
);

fs.writeFileSync(renderScriptPath, fileContent, "utf-8");
console.log("Successfully updated render-user-video.ts with dynamic props. Starting re-render...");

try {
  // Let's render the video again!
  execSync(`npx tsx scratch/render-user-video.ts`, { stdio: "inherit" });
  console.log("Re-render completed successfully!");
} catch (err: any) {
  console.error("Re-render failed:", err.message);
}
