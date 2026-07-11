import * as fs from "fs";
import * as path from "path";

const rootDir = path.join(__dirname, "../src/remotion");

function scanDir(dir: string, phrases: Set<string>) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, phrases);
    } else if (stat.isFile() && (item.endsWith(".tsx") || item.endsWith(".ts"))) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(line);
        if (hasJapanese) {
          phrases.add(line.trim());
        }
      }
    }
  }
}

const phrases = new Set<string>();
scanDir(rootDir, phrases);

console.log(JSON.stringify(Array.from(phrases), null, 2));
