import * as fs from "fs";
import * as path from "path";

const scenesDir = path.join(__dirname, "../src/remotion/scenes");

interface SceneDetail {
  category: string;
  filename: string;
  componentName: string;
  japaneseTitle: string;
  englishTitle: string;
  description: string;
  propsList: { name: string; type: string; defaultValue: string }[];
}

function parseProps(content: string, componentName: string): { name: string; type: string; defaultValue: string }[] {
  const result: { name: string; type: string; defaultValue: string }[] = [];
  
  // Find component declaration export const ComponentName = ({ ... }) => { ... } or export const ComponentName = ({ ... }: { ... }) => { ... }
  const regex = new RegExp(`export\\s+const\\s+${componentName}\\s*=\\s*\\(\\s*\\{([\\s\\S]*?)\\}\\s*(:\\s*\\{([\\s\\S]*?)\\})?\\s*\\)\\s*=>`);
  const match = content.match(regex);
  if (!match) return result;

  const argsBlock = match[1] || "";
  const typesBlock = match[3] || "";

  // Parse arguments and their default values using nesting-aware splitters
  function splitNesting(block: string, separator: string): string[] {
    const res: string[] = [];
    let current = "";
    let depth = 0;
    for (let i = 0; i < block.length; i++) {
      const char = block[i];
      if (char === "{" || char === "[" || char === "(" || char === "<") {
        depth++;
      } else if (char === "}" || char === "]" || char === ")" || char === ">") {
        depth--;
      }
      if (char === separator && depth === 0) {
        res.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      res.push(current.trim());
    }
    return res;
  }

  const argLines = splitNesting(argsBlock, ",").filter(Boolean);
  const typeLines = splitNesting(typesBlock, ";").filter(Boolean);

  const typesMap: Record<string, string> = {};
  for (const line of typeLines) {
    const parts = line.split(":");
    if (parts.length >= 2) {
      typesMap[parts[0].trim().replace(/\?$/, "")] = parts.slice(1).join(":").trim();
    }
  }

  // Handle simple parsing of args
  for (const arg of argLines) {
    if (arg.includes("=")) {
      const parts = arg.split("=");
      const name = parts[0].trim();
      let defaultValue = parts.slice(1).join("=").trim();
      // clean up double spaces/comments in default value
      defaultValue = defaultValue.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").trim();
      const type = typesMap[name] || "any";
      result.push({ name, type, defaultValue });
    } else {
      const name = arg.trim();
      const type = typesMap[name] || "any";
      result.push({ name, type, defaultValue: "N/A" });
    }
  }

  return result;
}

function cleanJapaneseText(text: string): string {
  const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(text);
  if (!hasJapanese) return text;
  
  let clean = text;
  const translationMap: Record<string, string> = {
    "オーロラ効果": "Aurora Effect",
    "ボケ効果": "Bokeh Effect",
    "流れるグラデーション": "Flowing Gradient",
    "ジオメトリックパターン": "Geometric Pattern",
    "グリッドアニメーション": "Grid Animation",
    "メッシュグラデーション": "Mesh Gradient",
    "ノイズテクスチャ": "Noise Texture",
    "パースペクティブグリッド": "Perspective Grid",
    "放射状パターン": "Radial Pattern",
    "波形背景": "Wave Background",
    "アクションタイトル": "Action Title",
    "アニメ風タイトル": "Anime Style Title",
    "ドキュメンタリー風": "Documentary Style",
    "エピックタイトル": "Epic Title",
    "大作映画風": "Blockbuster Movie Style",
    "ホラータイトル": "Horror Title",
    "ミニマリストエンディング": "Minimalist Ending",
    "ノワール風": "Noir Style",
    "ロマンスタイトル": "Romance Title",
    "SF/テック風": "Sci-Fi / Tech Style",
    "ヴィンテージ風": "Vintage Style",
    "バーチャート": "Bar Chart",
    "棒グラフ": "Column Graph",
    "ゲージメーター": "Gauge Meter",
    "スピードメーター風": "Speedometer Style",
    "ラインチャート": "Line Chart",
    "折れ線グラフ": "Line Graph",
    "パイチャート": "Pie Chart",
    "円グラフ": "Circle Graph",
    "プログレスバー": "Progress Bars",
    "複数のプログレス": "Multiple Progress Indicators",
    "ランキング": "Ranking",
    "リストアニメーション": "List Animation",
    "スタッツカード": "Stats Cards",
    "統計カード（非対称レイアウト）": "Statistical Cards (Asymmetric Layout)",
    "タイムライン": "Timeline",
    "時系列表示": "Chronological Timeline",
    "ブラウザアドレスバーデモ": "Browser Address Bar Demo",
    "マウスカーソル移動": "Mouse Cursor Movement",
    "クリック": "Click",
    "ドラッグ&ドロップデモ": "Drag & Drop Demo",
    "メニュー展開デモ": "Menu Expansion Demo",
    "モーダル表示デモ": "Modal Display Demo",
    "画面遷移デモ": "Page Transition Demo",
    "画面スクロールデモ": "Page Scroll Demo",
    "検索フィルターデモ": "Search Filter Demo",
    "テキスト入力デモ": "Text Input Demo",
    "ツールチップ/ポップオーバーデモ": "Tooltip / Popover Demo",
    "ステップウィザードデモ": "Step Wizard Demo",
    "ズームイン/フォーカスデモ": "Zoom-In / Focus Demo",
    "クリックリップルエフェクト": "Click Ripple Effect",
    "共通マウスカーソルコンポーネント": "Common Mouse Cursor Component",
    "ハイライトボックス": "Highlight Box",
    "ボタンアニメーション": "Button Animation",
    "ホバー&クリック": "Hover & Click",
    "効果": "Effect",
    "アニメーション": "Animation",
    "デモ": "Demo",
    "共通": "Common",
    "カード": "Card",
    "トースト": "Toast",
    "ナビゲーション": "Navigation",
    "ドロップダウン": "Dropdown",
    "トグル": "Toggle",
    "ローディング": "Loading",
    "タブ": "Tabs",
    "フォーム": "Form",
    "モーダル": "Modal"
  };

  for (const [jp, en] of Object.entries(translationMap)) {
    const regex = new RegExp(jp, "g");
    clean = clean.replace(regex, en);
  }

  // Remove any remaining Japanese characters
  clean = clean.replace(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g, "").trim();
  // Remove duplicate dashes or trailing dashes
  clean = clean.replace(/\s*-\s*-\s*/g, " - ").replace(/^-|-$/g, "").trim();
  
  return clean || "Interactive animated element.";
}

function camelCaseToTitle(camel: string): string {
  return camel.replace(/([A-Z])/g, " $1").trim();
}

function extractDetails(filePath: string, category: string, filename: string): SceneDetail {
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Extract top comment
  let fullComment = "";
  const commentMatch = content.match(/^\/\*\*([\s\S]*?)\*\//) || content.match(/^\/\/([\s\S]*?)(?=\r?\n\r?\n|\r?\nimport)/);
  if (commentMatch) {
    fullComment = commentMatch[1]
      .split("\n")
      .map(line => line.replace(/^\s*\*\s*/, "").replace(/^\s*\/\/\s*/, "").trim())
      .filter(line => line.length > 0)
      .join(" ");
  }

  let englishTitle = "";
  let description = "";

  // Find exported component
  const componentMatch = content.match(/export const ([A-Za-z0-9_]+)/) || content.match(/export default function ([A-Za-z0-9_]+)/);
  const componentName = componentMatch ? componentMatch[1] : filename.replace(/\.tsx?$/, "");

  if (fullComment) {
    const parts = fullComment.split("-").map(p => p.trim());
    if (parts.length >= 3) {
      englishTitle = cleanJapaneseText(parts[0]);
      description = cleanJapaneseText(parts.slice(1).join(" - "));
    } else if (parts.length === 2) {
      englishTitle = cleanJapaneseText(parts[0]);
      description = cleanJapaneseText(parts[1]);
    } else {
      description = cleanJapaneseText(fullComment);
    }
  }

  if (!englishTitle) {
    englishTitle = camelCaseToTitle(componentName);
  }
  if (!description || description === "Interactive animated element.") {
    description = `Provides an animated ${camelCaseToTitle(componentName).toLowerCase()} effect under the ${category} category.`;
  }

  // Parse props
  const propsList = parseProps(content, componentName);

  return {
    category,
    filename,
    componentName,
    japaneseTitle: englishTitle,
    englishTitle,
    description,
    propsList
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

// Generate rich Markdown
let md = `# Remotion Motion Graphics - Complete Scene & Visuals Registry\n\n`;
md += `This document lists all animation templates, scenes, and compositions available in this codebase, explaining what they represent and how to customize their props in your storyboard JSON.\n\n`;

md += `## 🎬 Compositions\n\n`;
md += `- **[Root.tsx](file:///src/remotion/Root.tsx)**: Registers all compositions, sets default frame rates, sizes (horizontal/vertical), and dynamically calculates length/metadata.\n`;
md += `- **[MotionGraphics.tsx](file:///src/remotion/compositions/MotionGraphics.tsx)**: Runs the storyboard sequencing, rendering each scene for its specified \`durationFrames\`, layering audio voiceovers (\`audio\`), and styling background track loops (\`music\`).\n\n`;

md += `## 🚀 Scene Categories Index\n\n`;
for (const category of Object.keys(grouped)) {
  md += `- [📂 ${category}](#-${category.toLowerCase()})\n`;
}
md += `\n---\n\n`;

for (const [category, scenes] of Object.entries(grouped)) {
  md += `## 📂 ${category}\n\n`;
  
  for (const scene of scenes) {
    const fileRelPath = `src/remotion/scenes/${category}/${scene.filename}`.replace(/\\/g, "/");
    md += `### 🎥 ${scene.componentName}\n\n`;
    md += `- **File Path**: [\`${fileRelPath}\`](file:///${fileRelPath})\n`;
    md += `- **Effect Name**: \`${scene.japaneseTitle}\` (${scene.englishTitle})\n`;
    md += `- **Description**: ${scene.description}\n\n`;

    md += `#### 🎛️ Parameters & Customization (Props)\n`;
    if (scene.propsList.length === 0) {
      md += `*Accepts default Remotion scene properties (e.g. \`startDelay\`)*\n\n`;
    } else {
      md += `| Prop Name | Type | Default Value | Description |\n`;
      md += `|---|---|---|---|\n`;
      for (const prop of scene.propsList) {
        md += `| \`${prop.name}\` | \`${prop.type}\` | \`${prop.defaultValue}\` | Configures the visual effect |\n`;
      }
      md += `\n`;
    }

    md += `#### 💡 Storyboard Usage Example\n`;
    md += `\`\`\`json\n{\n  "type": "${scene.componentName}",\n  "durationFrames": 90,\n  "props": {\n`;
    const propsStrings = scene.propsList.map(p => {
      let val = p.defaultValue === "N/A" ? "null" : p.defaultValue;
      if (val.startsWith("C.")) {
        val = `"#00d4ff"`;
      }
      return `    "${p.name}": ${val}`;
    });
    if (propsStrings.length === 0) {
      propsStrings.push(`    "startDelay": 0`);
    }
    md += propsStrings.join(",\n") + `\n  }\n}\n\`\`\`\n\n`;
    md += `---\n\n`;
  }
}

// Write output
const outputPath = path.join(__dirname, "../motion-graphics.md");
fs.writeFileSync(outputPath, md, "utf-8");

console.log("Successfully generated rich markdown.");
