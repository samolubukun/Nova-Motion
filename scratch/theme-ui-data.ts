import * as fs from "fs";
import * as path from "path";

const uiDir = path.join(__dirname, "../src/remotion/scenes/UIAnimations");

interface UIUpdate {
  filename: string;
  replacements: Array<{ target: string; replacement: string }>;
}

const updates: UIUpdate[] = [
  {
    filename: "UIForm.tsx",
    replacements: [
      { target: "Sign In", replacement: "Configure Brand Voice" },
      { target: "Email", replacement: "Brand Description" },
      { target: "john@example.com", replacement: "A lifestyle tech brand creating reels and tutorials..." }
    ]
  },
  {
    filename: "UICard.tsx",
    replacements: [
      { target: "FEATURED WORK", replacement: "PORTFOLIO REVEAL" },
      { target: "01 — PROJECT", replacement: "01 — OUTPUT" },
      { target: "Brand Identity", replacement: "AI Reels Post" },
      { target: "Complete visual identity system including logo, typography, and brand guidelines.", replacement: "Pre-rendered multi-format reel optimized for TikTok, Instagram, and Shorts." },
      { target: '["Branding", "Strategy"]', replacement: '["Shorts", "Reels"]' }
    ]
  },
  {
    filename: "UIModal.tsx",
    replacements: [
      { target: "Account Created", replacement: "Campaign Scheduled" },
      { target: "Your account has been successfully created. You can now access all features.", replacement: "Your content campaign is successfully scheduled. All platforms synced." },
      { target: "Get Started", replacement: "View Dashboard" }
    ]
  }
];

for (const update of updates) {
  const filePath = path.join(uiDir, update.filename);
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
    console.log(`Themed UI file: ${update.filename}`);
  } else {
    console.log(`No changes made to ${update.filename}`);
  }
}
