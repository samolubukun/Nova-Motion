/**
 * Data Animations - Individual Component Exports
 * 
 * Re-exports all data visualization animation components
 */

import { DataBarChart } from "./DataBarChart";
import { DataLineChart } from "./DataLineChart";
import { DataPieChart } from "./DataPieChart";
import { DataStatsCards } from "./DataStatsCards";
import { DataProgressBars } from "./DataProgressBars";
import { DataTimeline } from "./DataTimeline";
import { DataRanking } from "./DataRanking";
import { DataGauge } from "./DataGauge";

export {
  DataBarChart,
  DataLineChart,
  DataPieChart,
  DataStatsCards,
  DataProgressBars,
  DataTimeline,
  DataRanking,
  DataGauge,
};

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";

const SCENE_DURATION = 90;

const scenes = [
  { id: "barChart", Component: DataBarChart },
  { id: "lineChart", Component: DataLineChart },
  { id: "pieChart", Component: DataPieChart },
  { id: "statsCards", Component: DataStatsCards },
  { id: "progressBars", Component: DataProgressBars },
  { id: "timeline", Component: DataTimeline },
  { id: "ranking", Component: DataRanking },
  { id: "gauge", Component: DataGauge },
];

export const DataShowcase = () => (
  <AbsoluteFill style={{ background: "#0a0a0a" }}>
    {scenes.map((scene, index) => (
      <Sequence
        key={scene.id}
        from={index * SCENE_DURATION}
        durationInFrames={SCENE_DURATION}
      >
        <scene.Component />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const DATA_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
