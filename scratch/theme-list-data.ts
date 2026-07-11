import * as fs from "fs";
import * as path from "path";

const listDir = path.join(__dirname, "../src/remotion/scenes/ListAnimations");

interface FileUpdate {
  filename: string;
  replacements: Array<{ target: string; replacement: string }>;
}

const updates: FileUpdate[] = [
  {
    filename: "ListHeroWithList.tsx",
    replacements: [
      { target: 'const listItems = ["Fast", "Secure", "Reliable"];', replacement: 'const listItems = ["Unified Hub", "AI Assistant", "Multi-Format"];' },
      { target: 'BUILD', replacement: 'CONTENT' },
      { target: 'BETTER', replacement: 'NOVA' }
    ]
  },
  {
    filename: "ListFullscreenSequence.tsx",
    replacements: [
      { target: '{ num: "01", text: "INNOVATE", color: C.accent },', replacement: '{ num: "01", text: "IDEATE", color: C.accent },' },
      { target: '{ num: "02", text: "CREATE", color: C.secondary },', replacement: '{ num: "02", text: "CREATE", color: C.secondary },' },
      { target: '{ num: "03", text: "DELIVER", color: C.tertiary },', replacement: '{ num: "03", text: "REPURPOSE", color: C.tertiary },' }
    ]
  },
  {
    filename: "ListHorizontalPeek.tsx",
    replacements: [
      { target: '{ num: "01", title: "Design", highlighted: true },', replacement: '{ num: "01", title: "Ideate", highlighted: true },' },
      { target: '{ num: "02", title: "Develop", highlighted: false },', replacement: '{ num: "02", title: "Create", highlighted: false },' },
      { target: '{ num: "03", title: "Deploy", highlighted: false },', replacement: '{ num: "03", title: "Repurpose", highlighted: false },' }
    ]
  },
  {
    filename: "ListMinimalLeft.tsx",
    replacements: [
      { target: '"Faster development cycles",', replacement: '"AI-powered brand voice assistant",' },
      { target: '"Reduced operational costs",', replacement: '"One-click multi-format repurposing",' },
      { target: '"Improved team collaboration",', replacement: '"Unified cross-platform scheduling",' }
    ]
  },
  {
    filename: "ListNumberedVertical.tsx",
    replacements: [
      { target: '{ num: "01", text: "Understand your needs" },', replacement: '{ num: "01", text: "Onboard your brand style" },' },
      { target: '{ num: "02", text: "Design the solution" },', replacement: '{ num: "02", text: "Generate multi-format content" },' },
      { target: '{ num: "03", text: "Build and iterate" },', replacement: '{ num: "03", text: "Auto-publish with optimization" },' }
    ]
  },
  {
    filename: "ListSimpleText.tsx",
    replacements: [
      { target: '"Intuitive interface",', replacement: '"Brand Assistant Voice-Match",' },
      { target: '"Powerful automation",', replacement: '"Unified Creator Dashboard",' },
      { target: '"Seamless integration",', replacement: '"One-click Cross-posting",' }
    ]
  },
  {
    filename: "ListStaggered.tsx",
    replacements: [
      { target: '{ title: "Research", desc: "Deep market analysis", align: "left", top: 100 },', replacement: '{ title: "Capture", desc: "Voice-to-text notes capture", align: "left", top: 100 },' },
      { target: '{ title: "Strategy", desc: "Data-driven planning", align: "right", top: 220 },', replacement: '{ title: "Co-Brainstorm", desc: "AI-assisted generation", align: "right", top: 220 },' },
      { target: '{ title: "Execute", desc: "Rapid implementation", align: "left", top: 340 },', replacement: '{ title: "Optimize", desc: "Platform tailored formats", align: "left", top: 340 },' }
    ]
  },
  {
    filename: "ListStatsFocused.tsx",
    replacements: [
      { target: '{ value: "99.9", unit: "%", label: "Uptime" },', replacement: '{ value: "94", unit: "%", label: "Voice Match" },' },
      { target: '{ value: "50", unit: "ms", label: "Latency" },', replacement: '{ value: "20", unit: "x", label: "Speed Lift" },' },
      { target: '{ value: "10", unit: "x", label: "Faster" },', replacement: '{ value: "4", unit: "", label: "Channels Synced" },' }
    ]
  },
  {
    filename: "ListTimeline.tsx",
    replacements: [
      { target: '{ year: "2022", title: "Foundation", desc: "Company established" },', replacement: '{ year: "01", title: "Brand Profile", desc: "Map your style and topics" },' },
      { target: '{ year: "2023", title: "Growth", desc: "Series A funding" },', replacement: '{ year: "02", title: "Drafting", desc: "Create high-performing assets" },' },
      { target: '{ year: "2024", title: "Scale", desc: "Global expansion" },', replacement: '{ year: "03", title: "Publishing", desc: "One-click schedule and post" },' }
    ]
  },
  {
    filename: "ListTwoColumnCompare.tsx",
    replacements: [
      { target: 'const leftItems = ["Speed", "Security", "Support"];', replacement: 'const leftItems = ["Ideation", "Repurposing", "Publishing"];' },
      { target: 'const rightValues = ["10x faster", "Enterprise-grade", "24/7 available"];', replacement: 'const rightValues = ["AI voice-matched", "One-click layouts", "Autotagged schedule"];' }
    ]
  },
  {
    filename: "ListUnevenGrid.tsx",
    replacements: [
      { target: 'Enterprise', replacement: 'Content' },
      { target: 'Solutions', replacement: 'Nova' },
      { target: 'Comprehensive platform designed for large-scale operations and complex workflows.', replacement: 'A unified creative workspace designed for modern creators, teams, and content brands.' },
      { target: 'Startup', replacement: 'Ideate' },
      { target: 'Perfect for growing teams', replacement: 'AI-assisted niche brainstorming' },
      { target: 'Pro', replacement: 'Publish' },
      { target: 'For professionals', replacement: 'Optimized scheduling & reach' }
    ]
  }
];

for (const update of updates) {
  const filePath = path.join(listDir, update.filename);
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
    console.log(`Themed list file: ${update.filename}`);
  } else {
    console.log(`No changes made to ${update.filename}`);
  }
}
