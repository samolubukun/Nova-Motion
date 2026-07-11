import * as fs from "fs";
import * as path from "path";

const layoutDir = path.join(__dirname, "../src/remotion/scenes/LayoutAnimations");

interface LayoutUpdate {
  filename: string;
  replacements: Array<{ target: string; replacement: string }>;
}

const updates: LayoutUpdate[] = [
  {
    filename: "LayoutAsymmetric.tsx",
    replacements: [
      { target: "BIG", replacement: "CO" },
      { target: "IDEA", replacement: "BRAIN" },
      { target: "EST. 2024", replacement: "V2.0" }
    ]
  },
  {
    filename: "LayoutDiagonal.tsx",
    replacements: [
      { target: "DYNAMIC", replacement: "CREATIVE" },
      { target: "Motion", replacement: "AI" },
      { target: "Design", replacement: "Power" }
    ]
  },
  {
    filename: "LayoutFrameInFrame.tsx",
    replacements: [
      { target: "FRAME", replacement: "CO-BRAIN" }
    ]
  },
  {
    filename: "LayoutFullscreenType.tsx",
    replacements: [
      { target: "MAKE", replacement: "GO" },
      { target: "IT<span style={{ color: C.secondary }}> HAPPEN</span>", replacement: "VI<span style={{ color: C.secondary }}>RAL NOW</span>" },
      { target: "NOW.", replacement: "GROW." },
      { target: "START TODAY", replacement: "CONTENT NOVA" }
    ]
  },
  {
    filename: "LayoutGiantNumber.tsx",
    replacements: [
      { target: "33:         97", replacement: "33:         \"20x\"" },
      { target: "CUSTOMER SATISFACTION", replacement: "SPEED INCREASE" },
      { target: "Percent", replacement: "Faster" },
      { target: "Happy", replacement: "Output" },
      { target: "Based on 10,000+ reviews from verified customers worldwide.", replacement: "Generates multiple channels formats instantly using AI matching your voice." }
    ]
  }
];

// Read LayoutGiantNumber.tsx first to see how 97 is rendered so we can replace it correctly
const giantNumberPath = path.join(layoutDir, "LayoutGiantNumber.tsx");
if (fs.existsSync(giantNumberPath)) {
  let content = fs.readFileSync(giantNumberPath, "utf-8");
  content = content.replace(">97<", ">\"20x\"<").replace(">97<", ">20x<");
  fs.writeFileSync(giantNumberPath, content, "utf-8");
}

for (const update of updates) {
  const filePath = path.join(layoutDir, update.filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${update.filename}`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  for (const repl of update.replacements) {
    if (content.includes(repl.target)) {
      content = content.replace(repl.target, repl.replacement);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Themed layout file: ${update.filename}`);
  } else {
    console.log(`No changes made to ${update.filename}`);
  }
}
