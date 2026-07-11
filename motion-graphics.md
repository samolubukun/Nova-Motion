# Remotion Motion Graphics - Complete Scene & Visuals Registry

This document lists all animation templates, scenes, and compositions available in this codebase, explaining what they represent and how to customize their props in your storyboard JSON.

## 🎬 Compositions

- **[Root.tsx](file:///src/remotion/Root.tsx)**: Registers all compositions, sets default frame rates, sizes (horizontal/vertical), and dynamically calculates length/metadata.
- **[MotionGraphics.tsx](file:///src/remotion/compositions/MotionGraphics.tsx)**: Runs the storyboard sequencing, rendering each scene for its specified `durationFrames`, layering audio voiceovers (`audio`), and styling background track loops (`music`).

## 🚀 Scene Categories Index

- [📂 BackgroundAnimations](#-backgroundanimations)
- [📂 CinematicAnimations](#-cinematicanimations)
- [📂 DataAnimations](#-dataanimations)
- [📂 DemoAnimations](#-demoanimations)
- [📂 DemoAnimations\shared](#-demoanimations\shared)
- [📂 EffectAnimations](#-effectanimations)
- [📂 LayoutAnimations](#-layoutanimations)
- [📂 LiquidAnimations](#-liquidanimations)
- [📂 LiquidAnimations\shared](#-liquidanimations\shared)
- [📂 ListAnimations](#-listanimations)
- [📂 LogoAnimations](#-logoanimations)
- [📂 ParticleAnimations](#-particleanimations)
- [📂 RollerAnimations](#-rolleranimations)
- [📂 ShapeAnimations](#-shapeanimations)
- [📂 TextAnimations](#-textanimations)
- [📂 ThemeAnimations](#-themeanimations)
- [📂 TransitionAnimations](#-transitionanimations)
- [📂 UIAnimations](#-uianimations)

---

## 📂 BackgroundAnimations

### 🎥 BackgroundAurora

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundAurora.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundAurora.tsx)
- **Effect Name**: `BackgroundAurora` (BackgroundAurora)
- **Description**: Aurora Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundAurora",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundBokeh

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundBokeh.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundBokeh.tsx)
- **Effect Name**: `BackgroundBokeh` (BackgroundBokeh)
- **Description**: Bokeh Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundBokeh",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundFlowingGradient

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundFlowingGradient.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundFlowingGradient.tsx)
- **Effect Name**: `BackgroundFlowingGradient` (BackgroundFlowingGradient)
- **Description**: Flowing Gradient

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundFlowingGradient",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundGeometric

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundGeometric.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundGeometric.tsx)
- **Effect Name**: `BackgroundGeometric` (BackgroundGeometric)
- **Description**: Geometric Pattern

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundGeometric",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundGrid

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundGrid.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundGrid.tsx)
- **Effect Name**: `BackgroundGrid` (BackgroundGrid)
- **Description**: Grid Animation

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundGrid",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundMeshGradient

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundMeshGradient.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundMeshGradient.tsx)
- **Effect Name**: `BackgroundMeshGradient` (BackgroundMeshGradient)
- **Description**: Mesh Gradient

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundMeshGradient",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundNoiseTexture

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundNoiseTexture.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundNoiseTexture.tsx)
- **Effect Name**: `BackgroundNoiseTexture` (BackgroundNoiseTexture)
- **Description**: Noise Texture

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundNoiseTexture",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundPerspectiveGrid

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundPerspectiveGrid.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundPerspectiveGrid.tsx)
- **Effect Name**: `BackgroundPerspectiveGrid` (BackgroundPerspectiveGrid)
- **Description**: Perspective Grid

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundPerspectiveGrid",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundRadial

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundRadial.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundRadial.tsx)
- **Effect Name**: `BackgroundRadial` (BackgroundRadial)
- **Description**: Radial Pattern

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundRadial",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 BackgroundWaves

- **File Path**: [`src/remotion/scenes/BackgroundAnimations/BackgroundWaves.tsx`](file:///src/remotion/scenes/BackgroundAnimations/BackgroundWaves.tsx)
- **Effect Name**: `BackgroundWaves` (BackgroundWaves)
- **Description**: Wave Background

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "BackgroundWaves",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 CinematicAnimations

### 🎥 CinematicAction

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicAction.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicAction.tsx)
- **Effect Name**: `CinematicAction` (CinematicAction)
- **Description**: Action Title

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicAction",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicAnime

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicAnime.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicAnime.tsx)
- **Effect Name**: `CinematicAnime` (CinematicAnime)
- **Description**: Anime Style Title

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicAnime",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicDocumentary

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicDocumentary.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicDocumentary.tsx)
- **Effect Name**: `CinematicDocumentary` (CinematicDocumentary)
- **Description**: Documentary Style

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicDocumentary",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicEpic

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicEpic.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicEpic.tsx)
- **Effect Name**: `CinematicEpic` (CinematicEpic)
- **Description**: Epic Title - Blockbuster Movie Style

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicEpic",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicHorror

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicHorror.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicHorror.tsx)
- **Effect Name**: `CinematicHorror` (CinematicHorror)
- **Description**: Horror Title

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicHorror",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicMinimalEnd

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicMinimalEnd.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicMinimalEnd.tsx)
- **Effect Name**: `CinematicMinimalEnd` (CinematicMinimalEnd)
- **Description**: Minimalist Ending

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicMinimalEnd",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicNoir

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicNoir.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicNoir.tsx)
- **Effect Name**: `CinematicNoir` (CinematicNoir)
- **Description**: Noir Style

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicNoir",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicRomance

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicRomance.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicRomance.tsx)
- **Effect Name**: `CinematicRomance` (CinematicRomance)
- **Description**: Romance Title

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicRomance",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicSciFi

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicSciFi.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicSciFi.tsx)
- **Effect Name**: `CinematicSciFi` (CinematicSciFi)
- **Description**: Sci - Fi / Tech Style

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicSciFi",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 CinematicVintage

- **File Path**: [`src/remotion/scenes/CinematicAnimations/CinematicVintage.tsx`](file:///src/remotion/scenes/CinematicAnimations/CinematicVintage.tsx)
- **Effect Name**: `CinematicVintage` (CinematicVintage)
- **Description**: Vintage Style

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "CinematicVintage",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 DataAnimations

### 🎥 DataBarChart

- **File Path**: [`src/remotion/scenes/DataAnimations/DataBarChart.tsx`](file:///src/remotion/scenes/DataAnimations/DataBarChart.tsx)
- **Effect Name**: `DataBarChart` (DataBarChart)
- **Description**: Bar Chart - Column Graph

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `title` | `string` | `"Weekly Activity"` | Configures the visual effect |
| `subtitle` | `string` | `"User engagement metrics"` | Configures the visual effect |
| `data` | `Array<BarChartDataItem>` | `[
    { label: "Mon", value: 65, color: C.accent },
    { label: "Tue", value: 85, color: C.accent },
    { label: "Wed", value: 45, color: C.accent },
    { label: "Thu", value: 92, color: C.accent },
    { label: "Fri", value: 78, color: C.accent },
    { label: "Sat", value: 55, color: C.gray[600] },
    { label: "Sun", value: 40, color: C.gray[600] },
  ]` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataBarChart",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "title": "Weekly Activity",
    "subtitle": "User engagement metrics",
    "data": [
    { label: "Mon", value: 65, color: C.accent },
    { label: "Tue", value: 85, color: C.accent },
    { label: "Wed", value: 45, color: C.accent },
    { label: "Thu", value: 92, color: C.accent },
    { label: "Fri", value: 78, color: C.accent },
    { label: "Sat", value: 55, color: C.gray[600] },
    { label: "Sun", value: 40, color: C.gray[600] },
  ]
  }
}
```

---

### 🎥 DataGauge

- **File Path**: [`src/remotion/scenes/DataAnimations/DataGauge.tsx`](file:///src/remotion/scenes/DataAnimations/DataGauge.tsx)
- **Effect Name**: `DataGauge` (DataGauge)
- **Description**: Gauge Meter - Speedometer Style

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `value` | `number` | `78` | Configures the visual effect |
| `maxValue` | `number` | `100` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataGauge",
  "durationFrames": 90,
  "props": {
    "value": 78,
    "maxValue": 100,
    "startDelay": 0
  }
}
```

---

### 🎥 DataLineChart

- **File Path**: [`src/remotion/scenes/DataAnimations/DataLineChart.tsx`](file:///src/remotion/scenes/DataAnimations/DataLineChart.tsx)
- **Effect Name**: `DataLineChart` (DataLineChart)
- **Description**: Line Chart - Line Graph

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataLineChart",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DataPieChart

- **File Path**: [`src/remotion/scenes/DataAnimations/DataPieChart.tsx`](file:///src/remotion/scenes/DataAnimations/DataPieChart.tsx)
- **Effect Name**: `DataPieChart` (DataPieChart)
- **Description**: Pie Chart - Circle Graph

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataPieChart",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DataProgressBars

- **File Path**: [`src/remotion/scenes/DataAnimations/DataProgressBars.tsx`](file:///src/remotion/scenes/DataAnimations/DataProgressBars.tsx)
- **Effect Name**: `DataProgressBars` (DataProgressBars)
- **Description**: Progress Bar - Multiple Progress Indicators

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataProgressBars",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DataRanking

- **File Path**: [`src/remotion/scenes/DataAnimations/DataRanking.tsx`](file:///src/remotion/scenes/DataAnimations/DataRanking.tsx)
- **Effect Name**: `DataRanking` (DataRanking)
- **Description**: Ranking - List Animation

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataRanking",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DataStatsCards

- **File Path**: [`src/remotion/scenes/DataAnimations/DataStatsCards.tsx`](file:///src/remotion/scenes/DataAnimations/DataStatsCards.tsx)
- **Effect Name**: `DataStatsCards` (DataStatsCards)
- **Description**: Stats Cards - Statistical Cards (Asymmetric Layout)

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataStatsCards",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DataTimeline

- **File Path**: [`src/remotion/scenes/DataAnimations/DataTimeline.tsx`](file:///src/remotion/scenes/DataAnimations/DataTimeline.tsx)
- **Effect Name**: `DataTimeline` (DataTimeline)
- **Description**: Timeline - Chronological Timeline

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DataTimeline",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 DemoAnimations

### 🎥 DemoAddressBar

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoAddressBar.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoAddressBar.tsx)
- **Effect Name**: `DemoAddressBar` (DemoAddressBar)
- **Description**: Browser Address Bar Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoAddressBar",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoCursorClick

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoCursorClick.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoCursorClick.tsx)
- **Effect Name**: `DemoCursorClick` (DemoCursorClick)
- **Description**: Mouse Cursor Movement + Click

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoCursorClick",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoDragDrop

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoDragDrop.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoDragDrop.tsx)
- **Effect Name**: `DemoDragDrop` (DemoDragDrop)
- **Description**: Drag & Drop Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoDragDrop",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoMenuExpand

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoMenuExpand.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoMenuExpand.tsx)
- **Effect Name**: `DemoMenuExpand` (DemoMenuExpand)
- **Description**: Menu Expansion Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoMenuExpand",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoModal

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoModal.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoModal.tsx)
- **Effect Name**: `DemoModal` (DemoModal)
- **Description**: Modal Display Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoModal",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoPageTransition

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoPageTransition.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoPageTransition.tsx)
- **Effect Name**: `DemoPageTransition` (DemoPageTransition)
- **Description**: Page Transition Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoPageTransition",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoScroll

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoScroll.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoScroll.tsx)
- **Effect Name**: `DemoScroll` (DemoScroll)
- **Description**: Page Scroll Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoScroll",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoSearchFilter

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoSearchFilter.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoSearchFilter.tsx)
- **Effect Name**: `DemoSearchFilter` (DemoSearchFilter)
- **Description**: Search Filter Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoSearchFilter",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoTextInput

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoTextInput.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoTextInput.tsx)
- **Effect Name**: `DemoTextInput` (DemoTextInput)
- **Description**: Text Input Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoTextInput",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoTooltip

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoTooltip.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoTooltip.tsx)
- **Effect Name**: `DemoTooltip` (DemoTooltip)
- **Description**: Tooltip / Popover Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoTooltip",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoWizard

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoWizard.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoWizard.tsx)
- **Effect Name**: `DemoWizard` (DemoWizard)
- **Description**: Step Wizard Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoWizard",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 DemoZoomFocus

- **File Path**: [`src/remotion/scenes/DemoAnimations/DemoZoomFocus.tsx`](file:///src/remotion/scenes/DemoAnimations/DemoZoomFocus.tsx)
- **Effect Name**: `DemoZoomFocus` (DemoZoomFocus)
- **Description**: Zoom - In / Focus Demo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "DemoZoomFocus",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 DemoAnimations\shared

### 🎥 ClickRipple

- **File Path**: [`src/remotion/scenes/DemoAnimations/shared/ClickRipple.tsx`](file:///src/remotion/scenes/DemoAnimations/shared/ClickRipple.tsx)
- **Effect Name**: `ClickRipple` (ClickRipple)
- **Description**: Click Ripple Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `x` | `number` | `N/A` | Configures the visual effect |
| `y` | `number` | `N/A` | Configures the visual effect |
| `progress` | `number` | `N/A` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ClickRipple",
  "durationFrames": 90,
  "props": {
    "x": null,
    "y": null,
    "progress": null
  }
}
```

---

### 🎥 Cursor

- **File Path**: [`src/remotion/scenes/DemoAnimations/shared/Cursor.tsx`](file:///src/remotion/scenes/DemoAnimations/shared/Cursor.tsx)
- **Effect Name**: `Cursor` (Cursor)
- **Description**: Common Mouse Cursor Component

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `x` | `number` | `N/A` | Configures the visual effect |
| `y` | `number` | `N/A` | Configures the visual effect |
| `clicking` | `boolean` | `false` | Configures the visual effect |
| `style` | `React.CSSProperties` | `N/A` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "Cursor",
  "durationFrames": 90,
  "props": {
    "x": null,
    "y": null,
    "clicking": false,
    "style": null
  }
}
```

---

### 🎥 Highlight

- **File Path**: [`src/remotion/scenes/DemoAnimations/shared/Highlight.tsx`](file:///src/remotion/scenes/DemoAnimations/shared/Highlight.tsx)
- **Effect Name**: `Highlight` (Highlight)
- **Description**: Highlight Box

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `x` | `number` | `N/A` | Configures the visual effect |
| `y` | `number` | `N/A` | Configures the visual effect |
| `width` | `number` | `N/A` | Configures the visual effect |
| `height` | `number` | `N/A` | Configures the visual effect |
| `progress` | `number` | `N/A` | Configures the visual effect |
| `label` | `string` | `N/A` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "Highlight",
  "durationFrames": 90,
  "props": {
    "x": null,
    "y": null,
    "width": null,
    "height": null,
    "progress": null,
    "label": null
  }
}
```

---

## 📂 EffectAnimations

### 🎥 EffectChromaticAberration

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectChromaticAberration.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectChromaticAberration.tsx)
- **Effect Name**: `EffectChromaticAberration` (EffectChromaticAberration)
- **Description**: Provides an animated effect chromatic aberration effect under the EffectAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectChromaticAberration",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectDepthOfField

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectDepthOfField.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectDepthOfField.tsx)
- **Effect Name**: `EffectDepthOfField` (EffectDepthOfField)
- **Description**: Provides an animated effect depth of field effect under the EffectAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectDepthOfField",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectDuotone

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectDuotone.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectDuotone.tsx)
- **Effect Name**: `EffectDuotone` (EffectDuotone)
- **Description**: Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectDuotone",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectFilmGrain

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectFilmGrain.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectFilmGrain.tsx)
- **Effect Name**: `EffectFilmGrain` (EffectFilmGrain)
- **Description**: Provides an animated effect film grain effect under the EffectAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectFilmGrain",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectGlow

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectGlow.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectGlow.tsx)
- **Effect Name**: `EffectGlow` (EffectGlow)
- **Description**: Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectGlow",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectKaleidoscope

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectKaleidoscope.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectKaleidoscope.tsx)
- **Effect Name**: `EffectKaleidoscope` (EffectKaleidoscope)
- **Description**: Provides an animated effect kaleidoscope effect under the EffectAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectKaleidoscope",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectLightLeak

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectLightLeak.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectLightLeak.tsx)
- **Effect Name**: `EffectLightLeak` (EffectLightLeak)
- **Description**: Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectLightLeak",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectMatrix

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectMatrix.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectMatrix.tsx)
- **Effect Name**: `EffectMatrix` (EffectMatrix)
- **Description**: Provides an animated effect matrix effect under the EffectAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectMatrix",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectNoise

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectNoise.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectNoise.tsx)
- **Effect Name**: `EffectNoise` (EffectNoise)
- **Description**: Noise Texture - TV

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectNoise",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 EffectVHS

- **File Path**: [`src/remotion/scenes/EffectAnimations/EffectVHS.tsx`](file:///src/remotion/scenes/EffectAnimations/EffectVHS.tsx)
- **Effect Name**: `EffectVHS` (EffectVHS)
- **Description**: VHS

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "EffectVHS",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 LayoutAnimations

### 🎥 LayoutAsymmetric

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutAsymmetric.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutAsymmetric.tsx)
- **Effect Name**: `LayoutAsymmetric` (LayoutAsymmetric)
- **Description**: 、

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutAsymmetric",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutDiagonal

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutDiagonal.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutDiagonal.tsx)
- **Effect Name**: `LayoutDiagonal` (LayoutDiagonal)
- **Description**: Provides an animated layout diagonal effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutDiagonal",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutFrameInFrame

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutFrameInFrame.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutFrameInFrame.tsx)
- **Effect Name**: `LayoutFrameInFrame` (LayoutFrameInFrame)
- **Description**: Provides an animated layout frame in frame effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutFrameInFrame",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutFullscreenType

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutFullscreenType.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutFullscreenType.tsx)
- **Effect Name**: `LayoutFullscreenType` (LayoutFullscreenType)
- **Description**: Provides an animated layout fullscreen type effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutFullscreenType",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutGiantNumber

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutGiantNumber.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutGiantNumber.tsx)
- **Effect Name**: `LayoutGiantNumber` (LayoutGiantNumber)
- **Description**: +

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutGiantNumber",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutGridBreak

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutGridBreak.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutGridBreak.tsx)
- **Effect Name**: `LayoutGridBreak` (LayoutGridBreak)
- **Description**: Provides an animated layout grid break effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutGridBreak",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutLayered

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutLayered.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutLayered.tsx)
- **Effect Name**: `LayoutLayered` (LayoutLayered)
- **Description**: Provides an animated layout layered effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutLayered",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutMultiColumn

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutMultiColumn.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutMultiColumn.tsx)
- **Effect Name**: `LayoutMultiColumn` (LayoutMultiColumn)
- **Description**: Provides an animated layout multi column effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutMultiColumn",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutOffGrid

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutOffGrid.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutOffGrid.tsx)
- **Effect Name**: `LayoutOffGrid` (LayoutOffGrid)
- **Description**: Provides an animated layout off grid effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutOffGrid",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutSplitContrast

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutSplitContrast.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutSplitContrast.tsx)
- **Effect Name**: `LayoutSplitContrast` (LayoutSplitContrast)
- **Description**: Provides an animated layout split contrast effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutSplitContrast",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutVerticalMix

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutVerticalMix.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutVerticalMix.tsx)
- **Effect Name**: `LayoutVerticalMix` (LayoutVerticalMix)
- **Description**: +

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutVerticalMix",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LayoutWhitespace

- **File Path**: [`src/remotion/scenes/LayoutAnimations/LayoutWhitespace.tsx`](file:///src/remotion/scenes/LayoutAnimations/LayoutWhitespace.tsx)
- **Effect Name**: `LayoutWhitespace` (LayoutWhitespace)
- **Description**: Provides an animated layout whitespace effect under the LayoutAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LayoutWhitespace",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 LiquidAnimations

### 🎥 LiquidBlob

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidBlob.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidBlob.tsx)
- **Effect Name**: `LiquidBlob` (LiquidBlob)
- **Description**: Provides an animated liquid blob effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidBlob",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidCalligraphyInk

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidCalligraphyInk.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidCalligraphyInk.tsx)
- **Effect Name**: `LiquidCalligraphyInk` (LiquidCalligraphyInk)
- **Description**: /

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidCalligraphyInk",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidFluidWave

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidFluidWave.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidFluidWave.tsx)
- **Effect Name**: `LiquidFluidWave` (LiquidFluidWave)
- **Description**: Provides an animated liquid fluid wave effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidFluidWave",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidInkSplash

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidInkSplash.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidInkSplash.tsx)
- **Effect Name**: `LiquidInkSplash` (LiquidInkSplash)
- **Description**: （Spotify）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidInkSplash",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidMorphBlob

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidMorphBlob.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidMorphBlob.tsx)
- **Effect Name**: `LiquidMorphBlob` (LiquidMorphBlob)
- **Description**: Provides an animated liquid morph blob effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidMorphBlob",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidOilSpill

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidOilSpill.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidOilSpill.tsx)
- **Effect Name**: `LiquidOilSpill` (LiquidOilSpill)
- **Description**: Provides an animated liquid oil spill effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidOilSpill",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidPaintDrip

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidPaintDrip.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidPaintDrip.tsx)
- **Effect Name**: `LiquidPaintDrip` (LiquidPaintDrip)
- **Description**: Provides an animated liquid paint drip effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidPaintDrip",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidSplatter

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidSplatter.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidSplatter.tsx)
- **Effect Name**: `LiquidSplatter` (LiquidSplatter)
- **Description**: Provides an animated liquid splatter effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidSplatter",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidSwirl

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidSwirl.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidSwirl.tsx)
- **Effect Name**: `LiquidSwirl` (LiquidSwirl)
- **Description**: Provides an animated liquid swirl effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidSwirl",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LiquidWaterDrop

- **File Path**: [`src/remotion/scenes/LiquidAnimations/LiquidWaterDrop.tsx`](file:///src/remotion/scenes/LiquidAnimations/LiquidWaterDrop.tsx)
- **Effect Name**: `LiquidWaterDrop` (LiquidWaterDrop)
- **Description**: Provides an animated liquid water drop effect under the LiquidAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LiquidWaterDrop",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 LiquidAnimations\shared

### 🎥 generateBlobPath

- **File Path**: [`src/remotion/scenes/LiquidAnimations/shared/blobUtils.ts`](file:///src/remotion/scenes/LiquidAnimations/shared/blobUtils.ts)
- **Effect Name**: `generate Blob Path` (generate Blob Path)
- **Description**: Blob utility functions for LiquidAnimations

#### 🎛️ Parameters & Customization (Props)
*Accepts default Remotion scene properties (e.g. `startDelay`)*

#### 💡 Storyboard Usage Example
```json
{
  "type": "generateBlobPath",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 ListAnimations

### 🎥 ListAsymmetric3

- **File Path**: [`src/remotion/scenes/ListAnimations/ListAsymmetric3.tsx`](file:///src/remotion/scenes/ListAnimations/ListAsymmetric3.tsx)
- **Effect Name**: `ListAsymmetric3` (ListAsymmetric3)
- **Description**: 3（1+2）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListAsymmetric3",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListFullscreenSequence

- **File Path**: [`src/remotion/scenes/ListAnimations/ListFullscreenSequence.tsx`](file:///src/remotion/scenes/ListAnimations/ListFullscreenSequence.tsx)
- **Effect Name**: `ListFullscreenSequence` (ListFullscreenSequence)
- **Description**: （1）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListFullscreenSequence",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListHeroWithList

- **File Path**: [`src/remotion/scenes/ListAnimations/ListHeroWithList.tsx`](file:///src/remotion/scenes/ListAnimations/ListHeroWithList.tsx)
- **Effect Name**: `ListHeroWithList` (ListHeroWithList)
- **Description**: 1 +

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListHeroWithList",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListHorizontalPeek

- **File Path**: [`src/remotion/scenes/ListAnimations/ListHorizontalPeek.tsx`](file:///src/remotion/scenes/ListAnimations/ListHorizontalPeek.tsx)
- **Effect Name**: `ListHorizontalPeek` (ListHorizontalPeek)
- **Description**: （）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListHorizontalPeek",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListMinimalLeft

- **File Path**: [`src/remotion/scenes/ListAnimations/ListMinimalLeft.tsx`](file:///src/remotion/scenes/ListAnimations/ListMinimalLeft.tsx)
- **Effect Name**: `ListMinimalLeft` (ListMinimalLeft)
- **Description**: Provides an animated list minimal left effect under the ListAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListMinimalLeft",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListNumberedVertical

- **File Path**: [`src/remotion/scenes/ListAnimations/ListNumberedVertical.tsx`](file:///src/remotion/scenes/ListAnimations/ListNumberedVertical.tsx)
- **Effect Name**: `ListNumberedVertical` (ListNumberedVertical)
- **Description**: （、）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListNumberedVertical",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListSimpleText

- **File Path**: [`src/remotion/scenes/ListAnimations/ListSimpleText.tsx`](file:///src/remotion/scenes/ListAnimations/ListSimpleText.tsx)
- **Effect Name**: `ListSimpleText` (ListSimpleText)
- **Description**: Provides an animated list simple text effect under the ListAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListSimpleText",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListStaggered

- **File Path**: [`src/remotion/scenes/ListAnimations/ListStaggered.tsx`](file:///src/remotion/scenes/ListAnimations/ListStaggered.tsx)
- **Effect Name**: `ListStaggered` (ListStaggered)
- **Description**: /

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListStaggered",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListStatsFocused

- **File Path**: [`src/remotion/scenes/ListAnimations/ListStatsFocused.tsx`](file:///src/remotion/scenes/ListAnimations/ListStatsFocused.tsx)
- **Effect Name**: `ListStatsFocused` (ListStatsFocused)
- **Description**: （）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListStatsFocused",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListTimeline

- **File Path**: [`src/remotion/scenes/ListAnimations/ListTimeline.tsx`](file:///src/remotion/scenes/ListAnimations/ListTimeline.tsx)
- **Effect Name**: `ListTimeline` (ListTimeline)
- **Description**: Timeline

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListTimeline",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListTwoColumnCompare

- **File Path**: [`src/remotion/scenes/ListAnimations/ListTwoColumnCompare.tsx`](file:///src/remotion/scenes/ListAnimations/ListTwoColumnCompare.tsx)
- **Effect Name**: `ListTwoColumnCompare` (ListTwoColumnCompare)
- **Description**: （2）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListTwoColumnCompare",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ListUnevenGrid

- **File Path**: [`src/remotion/scenes/ListAnimations/ListUnevenGrid.tsx`](file:///src/remotion/scenes/ListAnimations/ListUnevenGrid.tsx)
- **Effect Name**: `ListUnevenGrid` (ListUnevenGrid)
- **Description**: （1+2）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ListUnevenGrid",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 LogoAnimations

### 🎥 Logo3DRotate

- **File Path**: [`src/remotion/scenes/LogoAnimations/Logo3DRotate.tsx`](file:///src/remotion/scenes/LogoAnimations/Logo3DRotate.tsx)
- **Effect Name**: `Logo3DRotate` (Logo3DRotate)
- **Description**: Logo3D

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "Logo3DRotate",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoGlitch

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoGlitch.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoGlitch.tsx)
- **Effect Name**: `LogoGlitch` (LogoGlitch)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoGlitch",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoLightTrail

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoLightTrail.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoLightTrail.tsx)
- **Effect Name**: `LogoLightTrail` (LogoLightTrail)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoLightTrail",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoMaskReveal

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoMaskReveal.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoMaskReveal.tsx)
- **Effect Name**: `LogoMaskReveal` (LogoMaskReveal)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoMaskReveal",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoMorph

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoMorph.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoMorph.tsx)
- **Effect Name**: `LogoMorph` (LogoMorph)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoMorph",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoNeonSign

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoNeonSign.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoNeonSign.tsx)
- **Effect Name**: `LogoNeonSign` (LogoNeonSign)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoNeonSign",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoParticles

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoParticles.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoParticles.tsx)
- **Effect Name**: `LogoParticles` (LogoParticles)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoParticles",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoSplitScreen

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoSplitScreen.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoSplitScreen.tsx)
- **Effect Name**: `LogoSplitScreen` (LogoSplitScreen)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoSplitScreen",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoStamp

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoStamp.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoStamp.tsx)
- **Effect Name**: `LogoStamp` (LogoStamp)
- **Description**: Logo

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoStamp",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 LogoStroke

- **File Path**: [`src/remotion/scenes/LogoAnimations/LogoStroke.tsx`](file:///src/remotion/scenes/LogoAnimations/LogoStroke.tsx)
- **Effect Name**: `LogoStroke` (LogoStroke)
- **Description**: LogoAnimation

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "LogoStroke",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 ParticleAnimations

### 🎥 ParticleBubbles

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleBubbles.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleBubbles.tsx)
- **Effect Name**: `ParticleBubbles` (ParticleBubbles)
- **Description**: Bubble

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleBubbles",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleConfetti

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleConfetti.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleConfetti.tsx)
- **Effect Name**: `ParticleConfetti` (ParticleConfetti)
- **Description**: Provides an animated particle confetti effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleConfetti",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleFireworks

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleFireworks.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleFireworks.tsx)
- **Effect Name**: `ParticleFireworks` (ParticleFireworks)
- **Description**: Provides an animated particle fireworks effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleFireworks",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleLightning

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleLightning.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleLightning.tsx)
- **Effect Name**: `ParticleLightning` (ParticleLightning)
- **Description**: /

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleLightning",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleMagneticField

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleMagneticField.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleMagneticField.tsx)
- **Effect Name**: `ParticleMagneticField` (ParticleMagneticField)
- **Description**: Provides an animated particle magnetic field effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleMagneticField",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleSakura

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleSakura.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleSakura.tsx)
- **Effect Name**: `ParticleSakura` (ParticleSakura)
- **Description**: Provides an animated particle sakura effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleSakura",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleShootingStars

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleShootingStars.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleShootingStars.tsx)
- **Effect Name**: `ParticleShootingStars` (ParticleShootingStars)
- **Description**: Provides an animated particle shooting stars effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleShootingStars",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleSmoke

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleSmoke.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleSmoke.tsx)
- **Effect Name**: `ParticleSmoke` (ParticleSmoke)
- **Description**: Provides an animated particle smoke effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleSmoke",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleSnow

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleSnow.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleSnow.tsx)
- **Effect Name**: `ParticleSnow` (ParticleSnow)
- **Description**: Provides an animated particle snow effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleSnow",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ParticleSparks

- **File Path**: [`src/remotion/scenes/ParticleAnimations/ParticleSparks.tsx`](file:///src/remotion/scenes/ParticleAnimations/ParticleSparks.tsx)
- **Effect Name**: `ParticleSparks` (ParticleSparks)
- **Description**: Provides an animated particle sparks effect under the ParticleAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ParticleSparks",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 RollerAnimations

### 🎥 Roller3DCarousel

- **File Path**: [`src/remotion/scenes/RollerAnimations/Roller3DCarousel.tsx`](file:///src/remotion/scenes/RollerAnimations/Roller3DCarousel.tsx)
- **Effect Name**: `Roller3DCarousel` (Roller3DCarousel)
- **Description**: 3D

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "Roller3DCarousel",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerBlur

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerBlur.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerBlur.tsx)
- **Effect Name**: `RollerBlur` (RollerBlur)
- **Description**: Provides an animated roller blur effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerBlur",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerCountdown

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerCountdown.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerCountdown.tsx)
- **Effect Name**: `RollerCountdown` (RollerCountdown)
- **Description**: Provides an animated roller countdown effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerCountdown",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerDramaticStop

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerDramaticStop.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerDramaticStop.tsx)
- **Effect Name**: `RollerDramaticStop` (RollerDramaticStop)
- **Description**: Provides an animated roller dramatic stop effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerDramaticStop",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerDrum

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerDrum.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerDrum.tsx)
- **Effect Name**: `RollerDrum` (RollerDrum)
- **Description**: Provides an animated roller drum effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerDrum",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerFadeSlide

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerFadeSlide.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerFadeSlide.tsx)
- **Effect Name**: `RollerFadeSlide` (RollerFadeSlide)
- **Description**: （）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerFadeSlide",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerFlip

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerFlip.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerFlip.tsx)
- **Effect Name**: `RollerFlip` (RollerFlip)
- **Description**: （Card）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerFlip",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerGlitch

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerGlitch.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerGlitch.tsx)
- **Effect Name**: `RollerGlitch` (RollerGlitch)
- **Description**: Provides an animated roller glitch effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerGlitch",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerGradientWave

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerGradientWave.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerGradientWave.tsx)
- **Effect Name**: `RollerGradientWave` (RollerGradientWave)
- **Description**: Provides an animated roller gradient wave effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerGradientWave",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerLiquid

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerLiquid.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerLiquid.tsx)
- **Effect Name**: `RollerLiquid` (RollerLiquid)
- **Description**: Provides an animated roller liquid effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerLiquid",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerMaskSlide

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerMaskSlide.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerMaskSlide.tsx)
- **Effect Name**: `RollerMaskSlide` (RollerMaskSlide)
- **Description**: Provides an animated roller mask slide effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerMaskSlide",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerMultiSlot

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerMultiSlot.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerMultiSlot.tsx)
- **Effect Name**: `RollerMultiSlot` (RollerMultiSlot)
- **Description**: Provides an animated roller multi slot effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerMultiSlot",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerOutlineHighlight

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerOutlineHighlight.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerOutlineHighlight.tsx)
- **Effect Name**: `RollerOutlineHighlight` (RollerOutlineHighlight)
- **Description**: 、1

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerOutlineHighlight",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerPerspectiveStripes

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerPerspectiveStripes.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerPerspectiveStripes.tsx)
- **Effect Name**: `RollerPerspectiveStripes` (RollerPerspectiveStripes)
- **Description**: Provides an animated roller perspective stripes effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerPerspectiveStripes",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerScaleBounce

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerScaleBounce.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerScaleBounce.tsx)
- **Effect Name**: `RollerScaleBounce` (RollerScaleBounce)
- **Description**: Provides an animated roller scale bounce effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerScaleBounce",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerShuffle

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerShuffle.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerShuffle.tsx)
- **Effect Name**: `RollerShuffle` (RollerShuffle)
- **Description**: Provides an animated roller shuffle effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerShuffle",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerSlotMachine

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerSlotMachine.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerSlotMachine.tsx)
- **Effect Name**: `RollerSlotMachine` (RollerSlotMachine)
- **Description**: （）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerSlotMachine",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerSlotReveal

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerSlotReveal.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerSlotReveal.tsx)
- **Effect Name**: `RollerSlotReveal` (RollerSlotReveal)
- **Description**: 「New [X]」→→

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerSlotReveal",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerSplitFlap

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerSplitFlap.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerSplitFlap.tsx)
- **Effect Name**: `RollerSplitFlap` (RollerSplitFlap)
- **Description**: （）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerSplitFlap",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerTypewriter

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerTypewriter.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerTypewriter.tsx)
- **Effect Name**: `RollerTypewriter` (RollerTypewriter)
- **Description**: Provides an animated roller typewriter effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerTypewriter",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerVerticalList

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerVerticalList.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerVerticalList.tsx)
- **Effect Name**: `RollerVerticalList` (RollerVerticalList)
- **Description**: （）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerVerticalList",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 RollerWave

- **File Path**: [`src/remotion/scenes/RollerAnimations/RollerWave.tsx`](file:///src/remotion/scenes/RollerAnimations/RollerWave.tsx)
- **Effect Name**: `RollerWave` (RollerWave)
- **Description**: Provides an animated roller wave effect under the RollerAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "RollerWave",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 ShapeAnimations

### 🎥 Shape3DCube

- **File Path**: [`src/remotion/scenes/ShapeAnimations/Shape3DCube.tsx`](file:///src/remotion/scenes/ShapeAnimations/Shape3DCube.tsx)
- **Effect Name**: `Shape3DCube` (Shape3DCube)
- **Description**: 3D

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "Shape3DCube",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeCircularProgress

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeCircularProgress.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeCircularProgress.tsx)
- **Effect Name**: `ShapeCircularProgress` (ShapeCircularProgress)
- **Description**: Provides an animated shape circular progress effect under the ShapeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `percentage` | `number` | `75` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeCircularProgress",
  "durationFrames": 90,
  "props": {
    "percentage": 75,
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeExplosion

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeExplosion.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeExplosion.tsx)
- **Effect Name**: `ShapeExplosion` (ShapeExplosion)
- **Description**: Provides an animated shape explosion effect under the ShapeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeExplosion",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeHelix

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeHelix.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeHelix.tsx)
- **Effect Name**: `ShapeHelix` (ShapeHelix)
- **Description**: DNA

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeHelix",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeHexGrid

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeHexGrid.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeHexGrid.tsx)
- **Effect Name**: `ShapeHexGrid` (ShapeHexGrid)
- **Description**: Provides an animated shape hex grid effect under the ShapeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeHexGrid",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeMandala

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeMandala.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeMandala.tsx)
- **Effect Name**: `ShapeMandala` (ShapeMandala)
- **Description**: Provides an animated shape mandala effect under the ShapeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeMandala",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeMorphing

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeMorphing.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeMorphing.tsx)
- **Effect Name**: `ShapeMorphing` (ShapeMorphing)
- **Description**: Provides an animated shape morphing effect under the ShapeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeMorphing",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeParticleField

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeParticleField.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeParticleField.tsx)
- **Effect Name**: `ShapeParticleField` (ShapeParticleField)
- **Description**: Provides an animated shape particle field effect under the ShapeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `particleCount` | `number` | `60` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeParticleField",
  "durationFrames": 90,
  "props": {
    "particleCount": 60,
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeRipples

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeRipples.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeRipples.tsx)
- **Effect Name**: `ShapeRipples` (ShapeRipples)
- **Description**: Provides an animated shape ripples effect under the ShapeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeRipples",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ShapeSpinningRings

- **File Path**: [`src/remotion/scenes/ShapeAnimations/ShapeSpinningRings.tsx`](file:///src/remotion/scenes/ShapeAnimations/ShapeSpinningRings.tsx)
- **Effect Name**: `ShapeSpinningRings` (ShapeSpinningRings)
- **Description**: Loading

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ShapeSpinningRings",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 TextAnimations

### 🎥 Text3DFlip

- **File Path**: [`src/remotion/scenes/TextAnimations/Text3DFlip.tsx`](file:///src/remotion/scenes/TextAnimations/Text3DFlip.tsx)
- **Effect Name**: `Text3DFlip` (Text3DFlip)
- **Description**: 3D - Y

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"FLIP"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "Text3DFlip",
  "durationFrames": 90,
  "props": {
    "text": "FLIP",
    "startDelay": 0
  }
}
```

---

### 🎥 TextCounter

- **File Path**: [`src/remotion/scenes/TextAnimations/TextCounter.tsx`](file:///src/remotion/scenes/TextAnimations/TextCounter.tsx)
- **Effect Name**: `TextCounter` (TextCounter)
- **Description**: Counter

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `targetNumber` | `number` | `10000` | Configures the visual effect |
| `prefix` | `string` | `""` | Configures the visual effect |
| `suffix` | `string` | `"+"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextCounter",
  "durationFrames": 90,
  "props": {
    "targetNumber": 10000,
    "prefix": "",
    "suffix": "+",
    "startDelay": 0
  }
}
```

---

### 🎥 TextExplode

- **File Path**: [`src/remotion/scenes/TextAnimations/TextExplode.tsx`](file:///src/remotion/scenes/TextAnimations/TextExplode.tsx)
- **Effect Name**: `TextExplode` (TextExplode)
- **Description**: Provides an animated text explode effect under the TextAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"BOOM"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextExplode",
  "durationFrames": 90,
  "props": {
    "text": "BOOM",
    "startDelay": 0
  }
}
```

---

### 🎥 TextGlitch

- **File Path**: [`src/remotion/scenes/TextAnimations/TextGlitch.tsx`](file:///src/remotion/scenes/TextAnimations/TextGlitch.tsx)
- **Effect Name**: `TextGlitch` (TextGlitch)
- **Description**: Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"GLITCH"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextGlitch",
  "durationFrames": 90,
  "props": {
    "text": "GLITCH",
    "startDelay": 0
  }
}
```

---

### 🎥 TextGradient

- **File Path**: [`src/remotion/scenes/TextAnimations/TextGradient.tsx`](file:///src/remotion/scenes/TextAnimations/TextGradient.tsx)
- **Effect Name**: `TextGradient` (TextGradient)
- **Description**: Provides an animated text gradient effect under the TextAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"GRADIENT"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextGradient",
  "durationFrames": 90,
  "props": {
    "text": "GRADIENT",
    "startDelay": 0
  }
}
```

---

### 🎥 TextKinetic

- **File Path**: [`src/remotion/scenes/TextAnimations/TextKinetic.tsx`](file:///src/remotion/scenes/TextAnimations/TextKinetic.tsx)
- **Effect Name**: `TextKinetic` (TextKinetic)
- **Description**: Provides an animated text kinetic effect under the TextAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"KINETIC"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextKinetic",
  "durationFrames": 90,
  "props": {
    "text": "KINETIC",
    "startDelay": 0
  }
}
```

---

### 🎥 TextMaskReveal

- **File Path**: [`src/remotion/scenes/TextAnimations/TextMaskReveal.tsx`](file:///src/remotion/scenes/TextAnimations/TextMaskReveal.tsx)
- **Effect Name**: `TextMaskReveal` (TextMaskReveal)
- **Description**: 1

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"MASKED"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextMaskReveal",
  "durationFrames": 90,
  "props": {
    "text": "MASKED",
    "startDelay": 0
  }
}
```

---

### 🎥 TextNeon

- **File Path**: [`src/remotion/scenes/TextAnimations/TextNeon.tsx`](file:///src/remotion/scenes/TextAnimations/TextNeon.tsx)
- **Effect Name**: `TextNeon` (TextNeon)
- **Description**: Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"NEON"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextNeon",
  "durationFrames": 90,
  "props": {
    "text": "NEON",
    "startDelay": 0
  }
}
```

---

### 🎥 TextScramble

- **File Path**: [`src/remotion/scenes/TextAnimations/TextScramble.tsx`](file:///src/remotion/scenes/TextAnimations/TextScramble.tsx)
- **Effect Name**: `TextScramble` (TextScramble)
- **Description**: Provides an animated text scramble effect under the TextAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"SCRAMBLE"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextScramble",
  "durationFrames": 90,
  "props": {
    "text": "SCRAMBLE",
    "startDelay": 0
  }
}
```

---

### 🎥 TextSplit

- **File Path**: [`src/remotion/scenes/TextAnimations/TextSplit.tsx`](file:///src/remotion/scenes/TextAnimations/TextSplit.tsx)
- **Effect Name**: `TextSplit` (TextSplit)
- **Description**: Provides an animated text split effect under the TextAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `textTop` | `string` | `"SPLIT"` | Configures the visual effect |
| `textBottom` | `string` | `"REVEAL"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextSplit",
  "durationFrames": 90,
  "props": {
    "textTop": "SPLIT",
    "textBottom": "REVEAL",
    "startDelay": 0
  }
}
```

---

### 🎥 TextTypewriter

- **File Path**: [`src/remotion/scenes/TextAnimations/TextTypewriter.tsx`](file:///src/remotion/scenes/TextAnimations/TextTypewriter.tsx)
- **Effect Name**: `TextTypewriter` (TextTypewriter)
- **Description**: Provides an animated text typewriter effect under the TextAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"TYPING EFFECT..."` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |
| `durationFrames` | `number` | `90` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextTypewriter",
  "durationFrames": 90,
  "props": {
    "text": "TYPING EFFECT...",
    "startDelay": 0,
    "durationFrames": 90
  }
}
```

---

### 🎥 TextWave

- **File Path**: [`src/remotion/scenes/TextAnimations/TextWave.tsx`](file:///src/remotion/scenes/TextAnimations/TextWave.tsx)
- **Effect Name**: `TextWave` (TextWave)
- **Description**: Provides an animated text wave effect under the TextAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `text` | `string` | `"WAVE MOTION"` | Configures the visual effect |
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TextWave",
  "durationFrames": 90,
  "props": {
    "text": "WAVE MOTION",
    "startDelay": 0
  }
}
```

---

## 📂 ThemeAnimations

### 🎥 Theme3DGlass

- **File Path**: [`src/remotion/scenes/ThemeAnimations/Theme3DGlass.tsx`](file:///src/remotion/scenes/ThemeAnimations/Theme3DGlass.tsx)
- **Effect Name**: `Theme3DGlass` (Theme3DGlass)
- **Description**: 3D Glass - Effect（）

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "Theme3DGlass",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeArtDeco

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeArtDeco.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeArtDeco.tsx)
- **Effect Name**: `ThemeArtDeco` (ThemeArtDeco)
- **Description**: Art Deco

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeArtDeco",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeBauhaus

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeBauhaus.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeBauhaus.tsx)
- **Effect Name**: `ThemeBauhaus` (ThemeBauhaus)
- **Description**: Bauhaus

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeBauhaus",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeBoho

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeBoho.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeBoho.tsx)
- **Effect Name**: `ThemeBoho` (ThemeBoho)
- **Description**: / - 、

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeBoho",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeBrutalistWeb

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeBrutalistWeb.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeBrutalistWeb.tsx)
- **Effect Name**: `ThemeBrutalistWeb` (ThemeBrutalistWeb)
- **Description**: Brutalist Web

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeBrutalistWeb",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeCosmic

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeCosmic.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeCosmic.tsx)
- **Effect Name**: `ThemeCosmic` (ThemeCosmic)
- **Description**: Cosmic/Space

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeCosmic",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeCyberpunk

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeCyberpunk.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeCyberpunk.tsx)
- **Effect Name**: `ThemeCyberpunk` (ThemeCyberpunk)
- **Description**: 、

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay: _startDelay` | `any` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeCyberpunk",
  "durationFrames": 90,
  "props": {
    "startDelay: _startDelay": 0
  }
}
```

---

### 🎥 ThemeDarkMode

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeDarkMode.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeDarkMode.tsx)
- **Effect Name**: `ThemeDarkMode` (ThemeDarkMode)
- **Description**: 、

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeDarkMode",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeDuotone

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeDuotone.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeDuotone.tsx)
- **Effect Name**: `ThemeDuotone` (ThemeDuotone)
- **Description**: Duotone

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeDuotone",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeGeometricAbstract

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeGeometricAbstract.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeGeometricAbstract.tsx)
- **Effect Name**: `ThemeGeometricAbstract` (ThemeGeometricAbstract)
- **Description**: Geometric Abstraction

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeGeometricAbstract",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeGlassmorphism

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeGlassmorphism.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeGlassmorphism.tsx)
- **Effect Name**: `ThemeGlassmorphism` (ThemeGlassmorphism)
- **Description**: 、

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeGlassmorphism",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeGradient

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeGradient.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeGradient.tsx)
- **Effect Name**: `ThemeGradient` (ThemeGradient)
- **Description**: Provides an animated theme gradient effect under the ThemeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeGradient",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeHolographic

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeHolographic.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeHolographic.tsx)
- **Effect Name**: `ThemeHolographic` (ThemeHolographic)
- **Description**: Holographic

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeHolographic",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeIndustrial

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeIndustrial.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeIndustrial.tsx)
- **Effect Name**: `ThemeIndustrial` (ThemeIndustrial)
- **Description**: Industrial

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeIndustrial",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeIsometric

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeIsometric.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeIsometric.tsx)
- **Effect Name**: `ThemeIsometric` (ThemeIsometric)
- **Description**: 3D/

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeIsometric",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeJapanese

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeJapanese.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeJapanese.tsx)
- **Effect Name**: `ThemeJapanese` (ThemeJapanese)
- **Description**: Japanese Style - 、

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeJapanese",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeLuxury

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeLuxury.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeLuxury.tsx)
- **Effect Name**: `ThemeLuxury` (ThemeLuxury)
- **Description**: 、

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeLuxury",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeMemphis

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeMemphis.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeMemphis.tsx)
- **Effect Name**: `ThemeMemphis` (ThemeMemphis)
- **Description**: Memphis

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeMemphis",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeMinimalist

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeMinimalist.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeMinimalist.tsx)
- **Effect Name**: `ThemeMinimalist` (ThemeMinimalist)
- **Description**: Provides an animated theme minimalist effect under the ThemeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeMinimalist",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeMonochrome

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeMonochrome.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeMonochrome.tsx)
- **Effect Name**: `ThemeMonochrome` (ThemeMonochrome)
- **Description**: Provides an animated theme monochrome effect under the ThemeAnimations category.

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeMonochrome",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeNatural

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeNatural.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeNatural.tsx)
- **Effect Name**: `ThemeNatural` (ThemeNatural)
- **Description**: / - Nature, Earth Colors

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeNatural",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeNeobrutalism

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeNeobrutalism.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeNeobrutalism.tsx)
- **Effect Name**: `ThemeNeobrutalism` (ThemeNeobrutalism)
- **Description**: Thick Border, Primaries, Shadow

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeNeobrutalism",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeNeon

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeNeon.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeNeon.tsx)
- **Effect Name**: `ThemeNeon` (ThemeNeon)
- **Description**: Neon

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeNeon",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeNeumorphism

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeNeumorphism.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeNeumorphism.tsx)
- **Effect Name**: `ThemeNeumorphism` (ThemeNeumorphism)
- **Description**: Soft Contours

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeNeumorphism",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeOrganic

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeOrganic.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeOrganic.tsx)
- **Effect Name**: `ThemeOrganic` (ThemeOrganic)
- **Description**: Organic - /

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeOrganic",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemePaperCut

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemePaperCut.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemePaperCut.tsx)
- **Effect Name**: `ThemePaperCut` (ThemePaperCut)
- **Description**: Paper Cut

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemePaperCut",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemePop

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemePop.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemePop.tsx)
- **Effect Name**: `ThemePop` (ThemePop)
- **Description**: /

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemePop",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeRetro

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeRetro.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeRetro.tsx)
- **Effect Name**: `ThemeRetro` (ThemeRetro)
- **Description**: / - Sepia, Noise

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeRetro",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeSwiss

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeSwiss.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeSwiss.tsx)
- **Effect Name**: `ThemeSwiss` (ThemeSwiss)
- **Description**: Swiss/International

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeSwiss",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeTech

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeTech.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeTech.tsx)
- **Effect Name**: `ThemeTech` (ThemeTech)
- **Description**: / - Modern, Clean

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeTech",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeWatercolor

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeWatercolor.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeWatercolor.tsx)
- **Effect Name**: `ThemeWatercolor` (ThemeWatercolor)
- **Description**: Watercolor - Watercolor

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeWatercolor",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 ThemeY2K

- **File Path**: [`src/remotion/scenes/ThemeAnimations/ThemeY2K.tsx`](file:///src/remotion/scenes/ThemeAnimations/ThemeY2K.tsx)
- **Effect Name**: `ThemeY2K` (ThemeY2K)
- **Description**: Y2K / Millennium - Glossy & Metallic of early 2000s

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "ThemeY2K",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 TransitionAnimations

### 🎥 TransitionBlinds

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionBlinds.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionBlinds.tsx)
- **Effect Name**: `TransitionBlinds` (TransitionBlinds)
- **Description**: Blinds Transition - Vertical Blinds

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `direction` | `"vertical" | "horizontal"` | `"vertical"` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionBlinds",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "direction": "vertical"
  }
}
```

---

### 🎥 TransitionBoxReveal

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionBoxReveal.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionBoxReveal.tsx)
- **Effect Name**: `TransitionBoxReveal` (TransitionBoxReveal)
- **Description**: Box Reveal - Display in Grid

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `gridSize` | `number` | `6` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionBoxReveal",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "gridSize": 6
  }
}
```

---

### 🎥 TransitionCircleWipe

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionCircleWipe.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionCircleWipe.tsx)
- **Effect Name**: `TransitionCircleWipe` (TransitionCircleWipe)
- **Description**: Circle Wipe - Spreads in Circle

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `originX` | `number` | `50` | Configures the visual effect |
| `originY` | `number` | `50` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionCircleWipe",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "originX": 50,
    "originY": 50
  }
}
```

---

### 🎥 TransitionDiagonalSlice

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionDiagonalSlice.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionDiagonalSlice.tsx)
- **Effect Name**: `TransitionDiagonalSlice` (TransitionDiagonalSlice)
- **Description**: Diagonal Slice - Switch on Diagonal Line

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `angle` | `number` | `15` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionDiagonalSlice",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "angle": 15
  }
}
```

---

### 🎥 TransitionFlash

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionFlash.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionFlash.tsx)
- **Effect Name**: `TransitionFlash` (TransitionFlash)
- **Description**: Flash Transition

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `flashColor` | `string` | `C.white` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionFlash",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "flashColor": "#00d4ff"
  }
}
```

---

### 🎥 TransitionGlitch

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionGlitch.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionGlitch.tsx)
- **Effect Name**: `TransitionGlitch` (TransitionGlitch)
- **Description**: Glitch Transition

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionGlitch",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 TransitionLineSweep

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionLineSweep.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionLineSweep.tsx)
- **Effect Name**: `TransitionLineSweep` (TransitionLineSweep)
- **Description**: Line Sweep - Multiple Lines Cross

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `lineCount` | `number` | `5` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionLineSweep",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "lineCount": 5
  }
}
```

---

### 🎥 TransitionLiquidMorph

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionLiquidMorph.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionLiquidMorph.tsx)
- **Effect Name**: `TransitionLiquidMorph` (TransitionLiquidMorph)
- **Description**: Liquid Morph - Morphic Transformation

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionLiquidMorph",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 TransitionShutter

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionShutter.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionShutter.tsx)
- **Effect Name**: `TransitionShutter` (TransitionShutter)
- **Description**: Shutter Transition - Camera Shutter Style

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |
| `bladeCount` | `number` | `8` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionShutter",
  "durationFrames": 90,
  "props": {
    "startDelay": 0,
    "bladeCount": 8
  }
}
```

---

### 🎥 TransitionZoomBlur

- **File Path**: [`src/remotion/scenes/TransitionAnimations/TransitionZoomBlur.tsx`](file:///src/remotion/scenes/TransitionAnimations/TransitionZoomBlur.tsx)
- **Effect Name**: `TransitionZoomBlur` (TransitionZoomBlur)
- **Description**: Zoom Blur Transition

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "TransitionZoomBlur",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

## 📂 UIAnimations

### 🎥 UIButton

- **File Path**: [`src/remotion/scenes/UIAnimations/UIButton.tsx`](file:///src/remotion/scenes/UIAnimations/UIButton.tsx)
- **Effect Name**: `UIButton` (UIButton)
- **Description**: Button Animation - Hover & Click

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UIButton",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UICard

- **File Path**: [`src/remotion/scenes/UIAnimations/UICard.tsx`](file:///src/remotion/scenes/UIAnimations/UICard.tsx)
- **Effect Name**: `UICard` (UICard)
- **Description**: Card Animation - Hover Effect

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UICard",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UIDropdown

- **File Path**: [`src/remotion/scenes/UIAnimations/UIDropdown.tsx`](file:///src/remotion/scenes/UIAnimations/UIDropdown.tsx)
- **Effect Name**: `UIDropdown` (UIDropdown)
- **Description**: Dropdown Menu

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UIDropdown",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UIForm

- **File Path**: [`src/remotion/scenes/UIAnimations/UIForm.tsx`](file:///src/remotion/scenes/UIAnimations/UIForm.tsx)
- **Effect Name**: `UIForm` (UIForm)
- **Description**: Input Form

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UIForm",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UILoading

- **File Path**: [`src/remotion/scenes/UIAnimations/UILoading.tsx`](file:///src/remotion/scenes/UIAnimations/UILoading.tsx)
- **Effect Name**: `UILoading` (UILoading)
- **Description**: Loading Animation

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UILoading",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UIModal

- **File Path**: [`src/remotion/scenes/UIAnimations/UIModal.tsx`](file:///src/remotion/scenes/UIAnimations/UIModal.tsx)
- **Effect Name**: `UIModal` (UIModal)
- **Description**: Modal Animation

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UIModal",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UINavigation

- **File Path**: [`src/remotion/scenes/UIAnimations/UINavigation.tsx`](file:///src/remotion/scenes/UIAnimations/UINavigation.tsx)
- **Effect Name**: `UINavigation` (UINavigation)
- **Description**: Navigation Menu

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UINavigation",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UITabs

- **File Path**: [`src/remotion/scenes/UIAnimations/UITabs.tsx`](file:///src/remotion/scenes/UIAnimations/UITabs.tsx)
- **Effect Name**: `UITabs` (UITabs)
- **Description**: Tabs Animation

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UITabs",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UIToast

- **File Path**: [`src/remotion/scenes/UIAnimations/UIToast.tsx`](file:///src/remotion/scenes/UIAnimations/UIToast.tsx)
- **Effect Name**: `UIToast` (UIToast)
- **Description**: Notification Animation - Toast

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UIToast",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

### 🎥 UIToggle

- **File Path**: [`src/remotion/scenes/UIAnimations/UIToggle.tsx`](file:///src/remotion/scenes/UIAnimations/UIToggle.tsx)
- **Effect Name**: `UIToggle` (UIToggle)
- **Description**: Switch/Toggle

#### 🎛️ Parameters & Customization (Props)
| Prop Name | Type | Default Value | Description |
|---|---|---|---|
| `startDelay` | `number` | `0` | Configures the visual effect |

#### 💡 Storyboard Usage Example
```json
{
  "type": "UIToggle",
  "durationFrames": 90,
  "props": {
    "startDelay": 0
  }
}
```

---

