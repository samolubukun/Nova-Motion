import { TextGlitch } from "../src/remotion/scenes/TextAnimations/TextGlitch";
import { TextKinetic } from "../src/remotion/scenes/TextAnimations/TextKinetic";
import { TextTypewriter } from "../src/remotion/scenes/TextAnimations/TextTypewriter";
import { TextNeon } from "../src/remotion/scenes/TextAnimations/TextNeon";
import { TextWave } from "../src/remotion/scenes/TextAnimations/TextWave";
import { TextGradient } from "../src/remotion/scenes/TextAnimations/TextGradient";
import { TextScramble } from "../src/remotion/scenes/TextAnimations/TextScramble";

import { DataBarChart } from "../src/remotion/scenes/DataAnimations/DataBarChart";
import { DataPieChart } from "../src/remotion/scenes/DataAnimations/DataPieChart";
import { DataLineChart } from "../src/remotion/scenes/DataAnimations/DataLineChart";
import { DataStatsCards } from "../src/remotion/scenes/DataAnimations/DataStatsCards";
import { DataProgressBars } from "../src/remotion/scenes/DataAnimations/DataProgressBars";
import { DataTimeline } from "../src/remotion/scenes/DataAnimations/DataTimeline";
import { DataRanking } from "../src/remotion/scenes/DataAnimations/DataRanking";
import { DataGauge } from "../src/remotion/scenes/DataAnimations/DataGauge";

import { UIButton } from "../src/remotion/scenes/UIAnimations/UIButton";
import { UICard } from "../src/remotion/scenes/UIAnimations/UICard";
import { UIModal } from "../src/remotion/scenes/UIAnimations/UIModal";
import { UIToast } from "../src/remotion/scenes/UIAnimations/UIToast";
import { UINavigation } from "../src/remotion/scenes/UIAnimations/UINavigation";
import { UIDropdown } from "../src/remotion/scenes/UIAnimations/UIDropdown";
import { UIToggle } from "../src/remotion/scenes/UIAnimations/UIToggle";
import { UILoading } from "../src/remotion/scenes/UIAnimations/UILoading";
import { UITabs } from "../src/remotion/scenes/UIAnimations/UITabs";
import { UIForm } from "../src/remotion/scenes/UIAnimations/UIForm";

const registry = {
  TextGlitch,
  TextKinetic,
  TextTypewriter,
  TextNeon,
  TextWave,
  TextGradient,
  TextScramble,
  DataBarChart,
  DataPieChart,
  DataLineChart,
  DataStatsCards,
  DataProgressBars,
  DataTimeline,
  DataRanking,
  DataGauge,
  UIButton,
  UICard,
  UIModal,
  UIToast,
  UINavigation,
  UIDropdown,
  UIToggle,
  UILoading,
  UITabs,
  UIForm
};

for (const [key, value] of Object.entries(registry)) {
  console.log(`${key}: ${typeof value} (${value ? "VALID" : "UNDEFINED!"})`);
}

