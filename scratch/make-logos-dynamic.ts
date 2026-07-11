import * as fs from "fs";
import * as path from "path";

const logosDir = path.join(__dirname, "../src/remotion/scenes/LogoAnimations");

interface Replacement {
  filename: string;
  targetText: string;
  fallbackText: string;
}

const replacements: Replacement[] = [
  { filename: "Logo3DRotate.tsx", targetText: "BRAND", fallbackText: "BRAND" },
  { filename: "LogoGlitch.tsx", targetText: "GLITCH", fallbackText: "GLITCH" },
  { filename: "LogoLightTrail.tsx", targetText: "LIGHT", fallbackText: "LIGHT" },
  { filename: "LogoMaskReveal.tsx", targetText: "MASK", fallbackText: "MASK" },
  { filename: "LogoMorph.tsx", targetText: "MORPH", fallbackText: "MORPH" },
  { filename: "LogoNeonSign.tsx", targetText: "NEON", fallbackText: "NEON" },
  { filename: "LogoParticles.tsx", targetText: "PARTICLES", fallbackText: "PARTICLES" },
  { filename: "LogoSplitScreen.tsx", targetText: "SPLIT", fallbackText: "SPLIT" },
  { filename: "LogoStamp.tsx", targetText: "STAMP", fallbackText: "STAMP" },
  { filename: "LogoStroke.tsx", targetText: "STROKE", fallbackText: "STROKE" }
];

for (const rep of replacements) {
  const filePath = path.join(logosDir, rep.filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, "utf-8");

  // 1. Update component parameters to accept text
  content = content.replace(
    /export const (\w+) = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\s*(\??):\s*number;?\s*\}\) =>/g,
    `export const $1 = ({ text = "${rep.fallbackText}", startDelay = 0 }: {\n  text?: string;\n  startDelay?: number;\n}) =>`
  );

  // 2. Replace the hardcoded string with {text}
  const textRegex = new RegExp(`>\\s*${rep.targetText}\\s*<`, "g");
  content = content.replace(textRegex, ">{text}<");

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated ${rep.filename} to be dynamic.`);
}
