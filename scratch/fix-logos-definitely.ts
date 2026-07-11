import * as fs from "fs";
import * as path from "path";

const logosDir = path.join(__dirname, "../src/remotion/scenes/LogoAnimations");

// 1. Logo3DRotate.tsx: replace BRAND with {text}
const rotatePath = path.join(logosDir, "Logo3DRotate.tsx");
if (fs.existsSync(rotatePath)) {
  let content = fs.readFileSync(rotatePath, "utf-8");
  content = content.replace(">BRAND<", ">{text}<").replace(">BRAND<", ">{text}<");
  fs.writeFileSync(rotatePath, content, "utf-8");
  console.log("Fixed Logo3DRotate");
}

// 2. LogoGlitch.tsx: replace GLITCH with {text}
const glitchPath = path.join(logosDir, "LogoGlitch.tsx");
if (fs.existsSync(glitchPath)) {
  let content = fs.readFileSync(glitchPath, "utf-8");
  content = content.replace(">GLITCH<", ">{text}<").replace(">GLITCH<", ">{text}<").replace(">GLITCH<", ">{text}<");
  fs.writeFileSync(glitchPath, content, "utf-8");
  console.log("Fixed LogoGlitch");
}

// 3. LogoLightTrail.tsx: replace SPEED with {text}
const trailPath = path.join(logosDir, "LogoLightTrail.tsx");
if (fs.existsSync(trailPath)) {
  let content = fs.readFileSync(trailPath, "utf-8");
  content = content.replace(">SPEED<", ">{text}<");
  fs.writeFileSync(trailPath, content, "utf-8");
  console.log("Fixed LogoLightTrail");
}

// 4. LogoMaskReveal.tsx: replace BRAND with {text}
const maskPath = path.join(logosDir, "LogoMaskReveal.tsx");
if (fs.existsSync(maskPath)) {
  let content = fs.readFileSync(maskPath, "utf-8");
  content = content.replace(">BRAND<", ">{text}<");
  fs.writeFileSync(maskPath, content, "utf-8");
  console.log("Fixed LogoMaskReveal");
}

// 5. LogoMorph.tsx: make morph letters dynamic based on text
const morphPath = path.join(logosDir, "LogoMorph.tsx");
if (fs.existsSync(morphPath)) {
  let content = fs.readFileSync(morphPath, "utf-8");
  content = content.replace(
    `  const letters = ["L", "O", "G", "O"];\n  const targetLetters = ["B", "R", "N", "D"];`,
    `  const letters = "LOGO".split("");\n  const targetLetters = text.substring(0, 4).padEnd(4, " ").toUpperCase().split("");`
  );
  fs.writeFileSync(morphPath, content, "utf-8");
  console.log("Fixed LogoMorph");
}

// 6. LogoNeonSign.tsx: replace split("NEON") with split(text)
const neonPath = path.join(logosDir, "LogoNeonSign.tsx");
if (fs.existsSync(neonPath)) {
  let content = fs.readFileSync(neonPath, "utf-8");
  content = content.replace(`const letters = "NEON".split("");`, `const letters = text.toUpperCase().split("");`);
  fs.writeFileSync(neonPath, content, "utf-8");
  console.log("Fixed LogoNeonSign");
}

// 7. LogoParticles.tsx: replace LOGO with {text}
const partPath = path.join(logosDir, "LogoParticles.tsx");
if (fs.existsSync(partPath)) {
  let content = fs.readFileSync(partPath, "utf-8");
  content = content.replace(">LOGO<", ">{text}<");
  fs.writeFileSync(partPath, content, "utf-8");
  console.log("Fixed LogoParticles");
}

// 8. LogoSplitScreen.tsx: replace BRAND with {text}
const splitPath = path.join(logosDir, "LogoSplitScreen.tsx");
if (fs.existsSync(splitPath)) {
  let content = fs.readFileSync(splitPath, "utf-8");
  content = content.replace(">BRAND<", ">{text}<");
  fs.writeFileSync(splitPath, content, "utf-8");
  console.log("Fixed LogoSplitScreen");
}

// 9. LogoStamp.tsx: replace APPROVED with {text}
const stampPath = path.join(logosDir, "LogoStamp.tsx");
if (fs.existsSync(stampPath)) {
  let content = fs.readFileSync(stampPath, "utf-8");
  content = content.replace(">APPROVED<", ">{text}<");
  fs.writeFileSync(stampPath, content, "utf-8");
  console.log("Fixed LogoStamp");
}

// 10. LogoStroke.tsx: replace LOGO with {text}
const strokePath = path.join(logosDir, "LogoStroke.tsx");
if (fs.existsSync(strokePath)) {
  let content = fs.readFileSync(strokePath, "utf-8");
  content = content.replace(">LOGO</text>", ">{text}</text>").replace(">LOGO</text>", ">{text}</text>");
  fs.writeFileSync(strokePath, content, "utf-8");
  console.log("Fixed LogoStroke");
}
