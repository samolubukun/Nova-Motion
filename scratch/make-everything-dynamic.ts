import * as fs from "fs";
import * as path from "path";

const listDir = path.join(__dirname, "../src/remotion/scenes/ListAnimations");
const layoutDir = path.join(__dirname, "../src/remotion/scenes/LayoutAnimations");
const uiDir = path.join(__dirname, "../src/remotion/scenes/UIAnimations");

// Let's refactor the components to accept customizable props so that
// when a user sends any prompt, the LLM-generated text renders dynamically.

// 1. ListHeroWithList.tsx
const heroPath = path.join(listDir, "ListHeroWithList.tsx");
if (fs.existsSync(heroPath)) {
  let content = fs.readFileSync(heroPath, "utf-8");
  content = content.replace(
    /export const ListHeroWithList = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const ListHeroWithList = ({
  title1 = "CONTENT",
  title2 = "NOVA",
  items = ["Unified Hub", "AI Assistant", "Multi-Format"],
  startDelay = 0
}: {
  title1?: string;
  title2?: string;
  items?: string[];
  startDelay?: number;
}) => {`
  );
  content = content.replace('const listItems = ["Unified Hub", "AI Assistant", "Multi-Format"];', '');
  content = content.replace(/listItems/g, "items");
  content = content.replace(">CONTENT<", ">{title1}<");
  content = content.replace(">NOVA<", ">{title2}<");
  fs.writeFileSync(heroPath, content, "utf-8");
}

// 2. ListFullscreenSequence.tsx
const seqPath = path.join(listDir, "ListFullscreenSequence.tsx");
if (fs.existsSync(seqPath)) {
  let content = fs.readFileSync(seqPath, "utf-8");
  content = content.replace(
    /export const ListFullscreenSequence = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const ListFullscreenSequence = ({
  items = [
    { num: "01", text: "IDEATE", color: C.accent },
    { num: "02", text: "CREATE", color: C.secondary },
    { num: "03", text: "REPURPOSE", color: C.tertiary },
  ],
  startDelay = 0
}: {
  items?: Array<{ num: string; text: string; color: string }>;
  startDelay?: number;
}) => {`
  );
  // Remove local items definition
  content = content.replace(/const items = \[\s*[\s\S]*?\s*\];/g, "");
  fs.writeFileSync(seqPath, content, "utf-8");
}

// 3. ListHorizontalPeek.tsx
const peekPath = path.join(listDir, "ListHorizontalPeek.tsx");
if (fs.existsSync(peekPath)) {
  let content = fs.readFileSync(peekPath, "utf-8");
  content = content.replace(
    /export const ListHorizontalPeek = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const ListHorizontalPeek = ({
  items = [
    { num: "01", title: "Ideate", highlighted: true },
    { num: "02", title: "Create", highlighted: false },
    { num: "03", title: "Repurpose", highlighted: false },
  ],
  startDelay = 0
}: {
  items?: Array<{ num: string; title: string; highlighted: boolean }>;
  startDelay?: number;
}) => {`
  );
  content = content.replace(/const items = \[\s*[\s\S]*?\s*\];/g, "");
  fs.writeFileSync(peekPath, content, "utf-8");
}

// 4. ListMinimalLeft.tsx
const minLeftPath = path.join(listDir, "ListMinimalLeft.tsx");
if (fs.existsSync(minLeftPath)) {
  let content = fs.readFileSync(minLeftPath, "utf-8");
  content = content.replace(
    /export const ListMinimalLeft = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const ListMinimalLeft = ({
  items = [
    "AI-powered brand voice assistant",
    "One-click multi-format repurposing",
    "Unified cross-platform scheduling",
  ],
  startDelay = 0
}: {
  items?: string[];
  startDelay?: number;
}) => {`
  );
  content = content.replace(/const items = \[\s*[\s\S]*?\s*\];/g, "");
  fs.writeFileSync(minLeftPath, content, "utf-8");
}

// 5. ListNumberedVertical.tsx
const numVertPath = path.join(listDir, "ListNumberedVertical.tsx");
if (fs.existsSync(numVertPath)) {
  let content = fs.readFileSync(numVertPath, "utf-8");
  content = content.replace(
    /export const ListNumberedVertical = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const ListNumberedVertical = ({
  items = [
    { num: "01", text: "Onboard your brand style" },
    { num: "02", text: "Generate multi-format content" },
    { num: "03", text: "Auto-publish with optimization" },
  ],
  startDelay = 0
}: {
  items?: Array<{ num: string; text: string }>;
  startDelay?: number;
}) => {`
  );
  content = content.replace(/const items = \[\s*[\s\S]*?\s*\];/g, "");
  fs.writeFileSync(numVertPath, content, "utf-8");
}

// 6. ListSimpleText.tsx
const simpleTextPath = path.join(listDir, "ListSimpleText.tsx");
if (fs.existsSync(simpleTextPath)) {
  let content = fs.readFileSync(simpleTextPath, "utf-8");
  content = content.replace(
    /export const ListSimpleText = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const ListSimpleText = ({
  items = [
    "Brand Assistant Voice-Match",
    "Unified Creator Dashboard",
    "One-click Cross-posting",
  ],
  startDelay = 0
}: {
  items?: string[];
  startDelay?: number;
}) => {`
  );
  content = content.replace(/const items = \[\s*[\s\S]*?\s*\];/g, "");
  fs.writeFileSync(simpleTextPath, content, "utf-8");
}

// 7. ListStatsFocused.tsx
const statsFocusedPath = path.join(listDir, "ListStatsFocused.tsx");
if (fs.existsSync(statsFocusedPath)) {
  let content = fs.readFileSync(statsFocusedPath, "utf-8");
  content = content.replace(
    /export const ListStatsFocused = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const ListStatsFocused = ({
  stats = [
    { value: "94", unit: "%", label: "Voice Match" },
    { value: "20", unit: "x", label: "Speed Lift" },
    { value: "4", unit: "", label: "Channels Synced" },
  ],
  startDelay = 0
}: {
  stats?: Array<{ value: string; unit: string; label: string }>;
  startDelay?: number;
}) => {`
  );
  content = content.replace(/const stats = \[\s*[\s\S]*?\s*\];/g, "");
  fs.writeFileSync(statsFocusedPath, content, "utf-8");
}

// 8. LayoutAsymmetric.tsx
const layoutAsymmetricPath = path.join(layoutDir, "LayoutAsymmetric.tsx");
if (fs.existsSync(layoutAsymmetricPath)) {
  let content = fs.readFileSync(layoutAsymmetricPath, "utf-8");
  content = content.replace(
    /export const LayoutAsymmetric = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const LayoutAsymmetric = ({
  title1 = "CO",
  title2 = "BRAIN",
  badge = "V2.0",
  startDelay = 0
}: {
  title1?: string;
  title2?: string;
  badge?: string;
  startDelay?: number;
}) => {`
  );
  content = content.replace(">CO<", ">{title1}<");
  content = content.replace(">BRAIN<", ">{title2}<");
  content = content.replace(">V2.0<", ">{badge}<");
  fs.writeFileSync(layoutAsymmetricPath, content, "utf-8");
}

// 9. LayoutDiagonal.tsx
const layoutDiagonalPath = path.join(layoutDir, "LayoutDiagonal.tsx");
if (fs.existsSync(layoutDiagonalPath)) {
  let content = fs.readFileSync(layoutDiagonalPath, "utf-8");
  content = content.replace(
    /export const LayoutDiagonal = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\??:\s*number;?\s*\}\) => \{/g,
    `export const LayoutDiagonal = ({
  title = "CREATIVE",
  subtitle1 = "AI",
  subtitle2 = "Power",
  startDelay = 0
}: {
  title?: string;
  subtitle1?: string;
  subtitle2?: string;
  startDelay?: number;
}) => {`
  );
  content = content.replace(">CREATIVE<", ">{title}<");
  content = content.replace(">AI<", ">{subtitle1}<");
  content = content.replace(">Power<", ">{subtitle2}<");
  fs.writeFileSync(layoutDiagonalPath, content, "utf-8");
}

console.log("Successfully converted all templates to accept dynamic customizable props!");
