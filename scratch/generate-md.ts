import * as fs from "fs";
import * as path from "path";

const scenesDir = path.join(__dirname, "../src/remotion/scenes");

interface SceneDetail {
  category: string;
  filename: string;
  componentName: string;
  description: string;
  codeSnippet: string;
}

function extractDetails(filePath: string, category: string, filename: string): SceneDetail {
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Extract top comment
  let description = "";
  const commentMatch = content.match(/^\/\*\*([\s\S]*?)\*\//) || content.match(/^\/\/([\s\S]*?)(?=\r?\n\r?\n|\r?\nimport)/);
  if (commentMatch) {
    description = commentMatch[1]
      .split("\n")
      .map(line => line.replace(/^\s*\*\s*/, "").replace(/^\s*\/\/\s*/, "").trim())
      .filter(line => line.length > 0)
      .join(" ");
  } else {
    description = "No description provided.";
  }

  // Find exported component
  const componentMatch = content.match(/export const ([A-Za-z0-9_]+)/) || content.match(/export default function ([A-Za-z0-9_]+)/);
  const componentName = componentMatch ? componentMatch[1] : filename.replace(/\.tsx?$/, "");

  // Extract a small preview snippet (the export line and a few lines after)
  let codeSnippet = "";
  if (componentMatch && componentMatch.index !== undefined) {
    const startIdx = componentMatch.index;
    const endIdx = content.indexOf(")", startIdx);
    if (endIdx !== -1) {
      codeSnippet = content.substring(startIdx, endIdx + 2);
    }
  }

  return {
    category,
    filename,
    componentName,
    description,
    codeSnippet
  };
}

function scanDir(dir: string, baseDir: string = scenesDir): SceneDetail[] {
  const results: SceneDetail[] = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...scanDir(fullPath, baseDir));
    } else if (stat.isFile() && (item.endsWith(".tsx") || item.endsWith(".ts")) && !item.endsWith("index.tsx") && !item.endsWith("index.ts")) {
      const relativeCategory = path.relative(baseDir, dir);
      results.push(extractDetails(fullPath, relativeCategory || "Root", item));
    }
  }
  return results;
}

const allDetails = scanDir(scenesDir);

// Now let's group by category
const grouped: Record<string, SceneDetail[]> = {};
for (const detail of allDetails) {
  if (!grouped[detail.category]) {
    grouped[detail.category] = [];
  }
  grouped[detail.category].push(detail);
}

// Generate Markdown
let md = `# Remotion Motion Graphics - Scenes & Compositions Registry\n\n`;
md += `This document provides a comprehensive registry of all motion graphics templates, scenes, compositions, and animations available in this Remotion codebase.\n\n`;

md += `## 🎬 Compositions Overview\n\n`;
md += `The core composition router is defined in [\`Root.tsx\`](file:///src/remotion/Root.tsx). The main motion graphics composition is:\n\n`;
md += `- **MotionGraphics** (ID: \`MotionGraphics\`) in [\`MotionGraphics.tsx\`](file:///src/remotion/compositions/MotionGraphics.tsx): Sequences storyboard scenes, handles audio tracks (voiceover, background music), and renders dynamic transitions.\n\n`;

md += `### Motion Graphics Schema / Storyboard Structure\n`;
md += `\`\`\`typescript\ninterface MotionGraphicsStoryboard {\n  shortTitle: string;\n  scenes: Array<{\n    type: string; // The scene component name (e.g. TextGlitch)\n    durationFrames: number;\n    props: any; // Props passed to the scene component\n  }>;\n  audio?: Array<{\n    startMs: number;\n    endMs: number;\n    audioUrl: string;\n  }>;\n  music?: Array<{\n    audioUrl: string;\n    volume?: number;\n  }>;\n}\n\`\`\`\n\n`;

md += `## 🚀 All Motion Graphics Scenes by Category\n\n`;

for (const [category, scenes] of Object.entries(grouped)) {
  md += `### 📂 ${category}\n\n`;
  md += `| File Name | Component Name | Description / Effect | Path |\n`;
  md += `|---|---|---|---|\n`;
  for (const scene of scenes) {
    const cleanDesc = scene.description.replace(/\|/g, "\\|");
    const fileRelPath = `src/remotion/scenes/${category}/${scene.filename}`.replace(/\\/g, "/");
    md += `| [\`${scene.filename}\`](file:///${fileRelPath}) | \`${scene.componentName}\` | ${cleanDesc} | \`/${fileRelPath}\` |\n`;
  }
  md += `\n`;
}

// Write to files
const outputPath1 = path.join(__dirname, "../motion-graphics.md");
const outputPath2 = path.join(__dirname, "../motion grpahic.md");

fs.writeFileSync(outputPath1, md, "utf-8");
fs.writeFileSync(outputPath2, md, "utf-8");

console.log("Successfully generated markdown files.");
