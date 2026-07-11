import * as fs from "fs";
import * as path from "path";

const scenesDir = path.join(__dirname, "../src/remotion/scenes");

interface SceneFile {
  category: string;
  filename: string;
  filepath: string;
  components: string[];
  props: string[];
}

function scanDir(dir: string, baseDir: string = scenesDir): SceneFile[] {
  const results: SceneFile[] = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...scanDir(fullPath, baseDir));
    } else if (stat.isFile() && (item.endsWith(".tsx") || item.endsWith(".ts")) && !item.endsWith("index.tsx") && !item.endsWith("index.ts")) {
      const relativeCategory = path.relative(baseDir, dir);
      const content = fs.readFileSync(fullPath, "utf-8");
      
      // Look for component names exported
      const componentMatches = content.match(/export (const|default|function) ([A-Za-z0-9_]+)/g) || [];
      const components = componentMatches.map(m => m.replace(/export (const|default|function) /, ""));

      // Look for props/interfaces
      const interfaceMatches = content.match(/interface ([A-Za-z0-9_]+)/g) || [];
      const typeMatches = content.match(/type ([A-Za-z0-9_]+)/g) || [];
      const props = [...interfaceMatches, ...typeMatches].map(m => m.replace(/(interface|type) /, ""));

      results.push({
        category: relativeCategory || "Root",
        filename: item,
        filepath: fullPath,
        components,
        props
      });
    }
  }
  return results;
}

const allScenes = scanDir(scenesDir);
console.log(JSON.stringify(allScenes, null, 2));
