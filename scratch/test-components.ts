import { componentsRegistry } from "../src/remotion/compositions/MotionGraphics";

console.log("Checking components registry...");
for (const [key, value] of Object.entries(componentsRegistry)) {
  if (value === undefined) {
    console.log(`❌ ${key} is undefined!`);
  } else {
    console.log(`✅ ${key} is defined.`);
  }
}
