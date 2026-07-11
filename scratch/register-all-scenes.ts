import * as fs from "fs";
import * as path from "path";

const scenesDir = path.join(__dirname, "../src/remotion/scenes");
const motionGraphicsFile = path.join(__dirname, "../src/remotion/compositions/MotionGraphics.tsx");

interface SceneInfo {
  category: string;
  filename: string;
  componentName: string;
}

function scanDir(dir: string, baseDir: string = scenesDir): SceneInfo[] {
  const results: SceneInfo[] = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...scanDir(fullPath, baseDir));
    } else if (stat.isFile() && (item.endsWith(".tsx") || item.endsWith(".ts")) && !item.endsWith("index.tsx") && !item.endsWith("index.ts")) {
      const relativeCategory = path.relative(baseDir, dir);
      const content = fs.readFileSync(fullPath, "utf-8");
      
      const componentMatch = content.match(/export const ([A-Za-z0-9_]+)/) || content.match(/export default function ([A-Za-z0-9_]+)/);
      const componentName = componentMatch ? componentMatch[1] : item.replace(/\.tsx?$/, "");

      results.push({
        category: relativeCategory || "Root",
        filename: item,
        componentName
      });
    }
  }
  return results;
}

const allScenes = scanDir(scenesDir);

// Generate import statements
let importsStr = `import React from "react";\nimport { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";\n\n`;

// Group by category to make it clean
const grouped: Record<string, SceneInfo[]> = {};
for (const scene of allScenes) {
  if (!grouped[scene.category]) {
    grouped[scene.category] = [];
  }
  grouped[scene.category].push(scene);
}

for (const [category, scenes] of Object.entries(grouped)) {
  importsStr += `// ${category}\n`;
  for (const scene of scenes) {
    const importPath = `../scenes/${category}/${scene.filename.replace(/\.tsx?$/, "")}`.replace(/\\/g, "/");
    importsStr += `import { ${scene.componentName} } from "${importPath}";\n`;
  }
  importsStr += `\n`;
}

// Generate componentsRegistry
let registryStr = `const componentsRegistry: Record<string, React.ComponentType<any>> = {\n`;
for (const scene of allScenes) {
  registryStr += `  ${scene.componentName},\n`;
}
// Remove trailing comma and close
registryStr = registryStr.replace(/,\n$/, "\n") + `};\n`;

// Let's read the rest of MotionGraphics.tsx (the parts after componentsRegistry)
const originalContent = fs.readFileSync(motionGraphicsFile, "utf-8");
const registryStartIndex = originalContent.indexOf("export interface MotionGraphicsScene");
if (registryStartIndex === -1) {
  throw new Error("Could not find export interface MotionGraphicsScene in MotionGraphics.tsx");
}

const restOfFile = originalContent.substring(registryStartIndex);

const newContent = `${importsStr}
${restOfFile.replace(/const componentsRegistry: Record<string, React.ComponentType<any>> = \{[\s\S]*?\};/, registryStr)}`;

fs.writeFileSync(motionGraphicsFile, newContent, "utf-8");
console.log("Successfully updated MotionGraphics.tsx with all scenes registered.");
