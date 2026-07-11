import * as fs from "fs";
import * as path from "path";

const cinematicDir = path.join(__dirname, "../src/remotion/scenes/CinematicAnimations");

interface CinematicRepl {
  filename: string;
  defaultTitle: string;
  defaultSub: string;
}

const repls: CinematicRepl[] = [
  { filename: "CinematicAction.tsx", defaultTitle: "ACTION", defaultSub: "THE THRILL OF MOTION" },
  { filename: "CinematicAnime.tsx", defaultTitle: "ANIME", defaultSub: "NEO TOKYO EDITION" },
  { filename: "CinematicDocumentary.tsx", defaultTitle: "DOCUMENTARY", defaultSub: "A REALISTIC PERSPECTIVE" },
  { filename: "CinematicEpic.tsx", defaultTitle: "EPIC", defaultSub: "A CINEMATIC EXPERIENCE" },
  { filename: "CinematicHorror.tsx", defaultTitle: "HORROR", defaultSub: "FEAR THE DARK" },
  { filename: "CinematicMinimalEnd.tsx", defaultTitle: "THE END", defaultSub: "THANK YOU FOR WATCHING" },
  { filename: "CinematicNoir.tsx", defaultTitle: "NOIR", defaultSub: "A DETECTIVE STORY" },
  { filename: "CinematicRomance.tsx", defaultTitle: "ROMANCE", defaultSub: "A LOVE STORY" },
  { filename: "CinematicSciFi.tsx", defaultTitle: "SCI-FI", defaultSub: "THE FUTURE IS NOW" },
  { filename: "CinematicVintage.tsx", defaultTitle: "VINTAGE", defaultSub: "A TRIP DOWN MEMORY LANE" }
];

for (const rep of repls) {
  const filePath = path.join(cinematicDir, rep.filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, "utf-8");

  // 1. Update signature to take title, subtitle, startDelay
  content = content.replace(
    /export const (\w+) = \(\{\s*startDelay = 0\s*\}\s*:\s*\{\s*startDelay\s*(\??):\s*number;?\s*\}\) =>/g,
    `export const $1 = ({ title = "${rep.defaultTitle}", subtitle = "${rep.defaultSub}", startDelay = 0 }: {\n  title?: string;\n  subtitle?: string;\n  startDelay?: number;\n}) =>`
  );

  // 2. Replace hardcoded title & subtitle
  const titleRegex = new RegExp(`>\\s*${rep.defaultTitle}\\s*<`, "g");
  const subRegex = new RegExp(`>\\s*${rep.defaultSub}\\s*<`, "g");
  
  content = content.replace(titleRegex, ">{title}<");
  content = content.replace(subRegex, ">{subtitle}<");

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated Cinematic ${rep.filename} to be dynamic.`);
}
