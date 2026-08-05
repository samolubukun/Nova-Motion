import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { generateStockVideoTimeline } from "./src/lib/stock-timeline";

async function main() {
  try {
    console.log("Testing generation...");
    const timeline = await generateStockVideoTimeline("A peaceful forest", "nature");
    console.log("Success! Timeline length:", timeline.elements.length);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

main();
