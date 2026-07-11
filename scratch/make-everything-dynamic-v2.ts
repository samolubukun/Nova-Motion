import * as fs from "fs";
import * as path from "path";

const listDir = path.join(__dirname, "../src/remotion/scenes/ListAnimations");
const layoutDir = path.join(__dirname, "../src/remotion/scenes/LayoutAnimations");

// We will do exact multiline string replacements to make them 100% dynamic.

// 1. ListHeroWithList.tsx
const heroPath = path.join(listDir, "ListHeroWithList.tsx");
if (fs.existsSync(heroPath)) {
  let content = fs.readFileSync(heroPath, "utf-8");
  const oldSig = `export const ListHeroWithList = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const ListHeroWithList = ({\n  title1 = "CONTENT",\n  title2 = "NOVA",\n  items = ["Unified Hub", "AI Assistant", "Multi-Format"],\n  startDelay = 0\n}: {\n  title1?: string;\n  title2?: string;\n  items?: string[];\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace('const listItems = ["Unified Hub", "AI Assistant", "Multi-Format"];', '');
    content = content.replace(/listItems/g, "items");
    content = content.replace(">CONTENT<", ">{title1}<");
    content = content.replace(">NOVA<", ">{title2}<");
    fs.writeFileSync(heroPath, content, "utf-8");
    console.log("Updated ListHeroWithList");
  }
}

// 2. ListFullscreenSequence.tsx
const seqPath = path.join(listDir, "ListFullscreenSequence.tsx");
if (fs.existsSync(seqPath)) {
  let content = fs.readFileSync(seqPath, "utf-8");
  const oldSig = `export const ListFullscreenSequence = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const ListFullscreenSequence = ({\n  items = [\n    { num: "01", text: "IDEATE", color: C.accent },\n    { num: "02", text: "CREATE", color: C.secondary },\n    { num: "03", text: "REPURPOSE", color: C.tertiary },\n  ],\n  startDelay = 0\n}: {\n  items?: Array<{ num: string; text: string; color: string }>;\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    // Remove local definition of items
    content = content.replace(`  const items = [\n    { num: "01", text: "IDEATE", color: C.accent },\n    { num: "02", text: "CREATE", color: C.secondary },\n    { num: "03", text: "REPURPOSE", color: C.tertiary },\n  ];`, '');
    fs.writeFileSync(seqPath, content, "utf-8");
    console.log("Updated ListFullscreenSequence");
  }
}

// 3. ListHorizontalPeek.tsx
const peekPath = path.join(listDir, "ListHorizontalPeek.tsx");
if (fs.existsSync(peekPath)) {
  let content = fs.readFileSync(peekPath, "utf-8");
  const oldSig = `export const ListHorizontalPeek = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const ListHorizontalPeek = ({\n  items = [\n    { num: "01", title: "Ideate", highlighted: true },\n    { num: "02", title: "Create", highlighted: false },\n    { num: "03", title: "Repurpose", highlighted: false },\n  ],\n  startDelay = 0\n}: {\n  items?: Array<{ num: string; title: string; highlighted: boolean }>;\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace(`  const items = [\n    { num: "01", title: "Ideate", highlighted: true },\n    { num: "02", title: "Create", highlighted: false },\n    { num: "03", title: "Repurpose", highlighted: false },\n  ];`, '');
    fs.writeFileSync(peekPath, content, "utf-8");
    console.log("Updated ListHorizontalPeek");
  }
}

// 4. ListMinimalLeft.tsx
const minLeftPath = path.join(listDir, "ListMinimalLeft.tsx");
if (fs.existsSync(minLeftPath)) {
  let content = fs.readFileSync(minLeftPath, "utf-8");
  const oldSig = `export const ListMinimalLeft = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const ListMinimalLeft = ({\n  items = [\n    "AI-powered brand voice assistant",\n    "One-click multi-format repurposing",\n    "Unified cross-platform scheduling",\n  ],\n  startDelay = 0\n}: {\n  items?: string[];\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace(`  const items = [\n    "AI-powered brand voice assistant",\n    "One-click multi-format repurposing",\n    "Unified cross-platform scheduling",\n  ];`, '');
    fs.writeFileSync(minLeftPath, content, "utf-8");
    console.log("Updated ListMinimalLeft");
  }
}

// 5. ListNumberedVertical.tsx
const numVertPath = path.join(listDir, "ListNumberedVertical.tsx");
if (fs.existsSync(numVertPath)) {
  let content = fs.readFileSync(numVertPath, "utf-8");
  const oldSig = `export const ListNumberedVertical = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const ListNumberedVertical = ({\n  items = [\n    { num: "01", text: "Onboard your brand style" },\n    { num: "02", text: "Generate multi-format content" },\n    { num: "03", text: "Auto-publish with optimization" },\n  ],\n  startDelay = 0\n}: {\n  items?: Array<{ num: string; text: string }>;\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace(`  const items = [\n    { num: "01", text: "Onboard your brand style" },\n    { num: "02", text: "Generate multi-format content" },\n    { num: "03", text: "Auto-publish with optimization" },\n  ];`, '');
    fs.writeFileSync(numVertPath, content, "utf-8");
    console.log("Updated ListNumberedVertical");
  }
}

// 6. ListSimpleText.tsx
const simpleTextPath = path.join(listDir, "ListSimpleText.tsx");
if (fs.existsSync(simpleTextPath)) {
  let content = fs.readFileSync(simpleTextPath, "utf-8");
  const oldSig = `export const ListSimpleText = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const ListSimpleText = ({\n  items = [\n    "Brand Assistant Voice-Match",\n    "Unified Creator Dashboard",\n    "One-click Cross-posting",\n  ],\n  startDelay = 0\n}: {\n  items?: string[];\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace(`  const items = [\n    "Brand Assistant Voice-Match",\n    "Unified Creator Dashboard",\n    "One-click Cross-posting",\n  ];`, '');
    fs.writeFileSync(simpleTextPath, content, "utf-8");
    console.log("Updated ListSimpleText");
  }
}

// 7. ListStatsFocused.tsx
const statsFocusedPath = path.join(listDir, "ListStatsFocused.tsx");
if (fs.existsSync(statsFocusedPath)) {
  let content = fs.readFileSync(statsFocusedPath, "utf-8");
  const oldSig = `export const ListStatsFocused = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const ListStatsFocused = ({\n  stats = [\n    { value: "94", unit: "%", label: "Voice Match" },\n    { value: "20", unit: "x", label: "Speed Lift" },\n    { value: "4", unit: "", label: "Channels Synced" },\n  ],\n  startDelay = 0\n}: {\n  stats?: Array<{ value: string; unit: string; label: string }>;\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace(`  const stats = [\n    { value: "94", unit: "%", label: "Voice Match" },\n    { value: "20", unit: "x", label: "Speed Lift" },\n    { value: "4", unit: "", label: "Channels Synced" },\n  ];`, '');
    fs.writeFileSync(statsFocusedPath, content, "utf-8");
    console.log("Updated ListStatsFocused");
  }
}

// 8. LayoutAsymmetric.tsx
const layoutAsymmetricPath = path.join(layoutDir, "LayoutAsymmetric.tsx");
if (fs.existsSync(layoutAsymmetricPath)) {
  let content = fs.readFileSync(layoutAsymmetricPath, "utf-8");
  const oldSig = `export const LayoutAsymmetric = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const LayoutAsymmetric = ({\n  title1 = "CO",\n  title2 = "BRAIN",\n  badge = "V2.0",\n  startDelay = 0\n}: {\n  title1?: string;\n  title2?: string;\n  badge?: string;\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace(">CO<", ">{title1}<");
    content = content.replace(">BRAIN<", ">{title2}<");
    content = content.replace(">V2.0<", ">{badge}<");
    fs.writeFileSync(layoutAsymmetricPath, content, "utf-8");
    console.log("Updated LayoutAsymmetric");
  }
}

// 9. LayoutDiagonal.tsx
const layoutDiagonalPath = path.join(layoutDir, "LayoutDiagonal.tsx");
if (fs.existsSync(layoutDiagonalPath)) {
  let content = fs.readFileSync(layoutDiagonalPath, "utf-8");
  const oldSig = `export const LayoutDiagonal = ({ startDelay = 0 }: {\n  startDelay?: number;\n}) => {`;
  const newSig = `export const LayoutDiagonal = ({\n  title = "CREATIVE",\n  subtitle1 = "AI",\n  subtitle2 = "Power",\n  startDelay = 0\n}: {\n  title?: string;\n  subtitle1?: string;\n  subtitle2?: string;\n  startDelay?: number;\n}) => {`;
  
  if (content.includes(oldSig)) {
    content = content.replace(oldSig, newSig);
    content = content.replace(">CREATIVE<", ">{title}<");
    content = content.replace(">AI<", ">{subtitle1}<");
    content = content.replace(">Power<", ">{subtitle2}<");
    fs.writeFileSync(layoutDiagonalPath, content, "utf-8");
    console.log("Updated LayoutDiagonal");
  }
}

console.log("SUCCESS");
