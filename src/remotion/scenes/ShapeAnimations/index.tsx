/**
 * Shape Animations - シェイプ&ジオメトリックアニメーション集
 * 
 * 幾何学的な図形を使ったモーショングラフィックス
 */

// Individual components
export { ShapeSpinningRings } from "./ShapeSpinningRings";
export { ShapeMorphing } from "./ShapeMorphing";
export { ShapeParticleField } from "./ShapeParticleField";
export { ShapeHexGrid } from "./ShapeHexGrid";
export { ShapeRipples } from "./ShapeRipples";
export { Shape3DCube } from "./Shape3DCube";
export { ShapeCircularProgress } from "./ShapeCircularProgress";
export { ShapeExplosion } from "./ShapeExplosion";
export { ShapeHelix } from "./ShapeHelix";
export { ShapeMandala } from "./ShapeMandala";

// Showcase component
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../../common";
import { ShapeSpinningRings } from "./ShapeSpinningRings";
import { ShapeMorphing } from "./ShapeMorphing";
import { ShapeParticleField } from "./ShapeParticleField";
import { ShapeHexGrid } from "./ShapeHexGrid";
import { ShapeRipples } from "./ShapeRipples";
import { Shape3DCube } from "./Shape3DCube";
import { ShapeCircularProgress } from "./ShapeCircularProgress";
import { ShapeExplosion } from "./ShapeExplosion";
import { ShapeHelix } from "./ShapeHelix";
import { ShapeMandala } from "./ShapeMandala";

const SCENE_DURATION = 90;

const scenes = [
  { id: "spinningRings", Component: ShapeSpinningRings },
  { id: "morphing", Component: ShapeMorphing },
  { id: "particleField", Component: ShapeParticleField },
  { id: "hexGrid", Component: ShapeHexGrid },
  { id: "ripples", Component: ShapeRipples },
  { id: "3dCube", Component: Shape3DCube },
  { id: "circularProgress", Component: ShapeCircularProgress },
  { id: "explosion", Component: ShapeExplosion },
  { id: "helix", Component: ShapeHelix },
  { id: "mandala", Component: ShapeMandala },
];

export const ShapeShowcase = () => (
  <AbsoluteFill style={{ background: C.black }}>
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

export const SHAPE_SHOWCASE_DURATION = scenes.length * SCENE_DURATION;
