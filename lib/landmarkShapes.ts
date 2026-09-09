import type { LandmarkShape } from "@/components/three/FloatingLandmark";

/**
 * Per-destination 3D landmark recipes — plain data consumed by
 * FloatingLandmark / LandmarkObject (components/three/FloatingLandmark.tsx).
 * Every shape is an abstracted geometric read of the destination's original
 * flat-SVG composition (components/scenes/*.tsx), rebuilt from primitive
 * geometry only: confident, low-facet sculptures rather than literal or
 * photoreal models. Coordinates are centered loosely on the origin, sized
 * to read well at the default camera framing in FloatingLandmark
 * (position [0, -0.1, 6.2], fov 36).
 */
export const LANDMARK_SHAPES: Record<string, LandmarkShape> = {
  // Eiffel Tower — a tapering stack of low-facet (4-sided) cylinders reads
  // as a lattice tower silhouette without modeling actual latticework; the
  // 45°-twisted mid tier gives it a faceted, structural feel rather than a
  // plain cone.
  paris: [
    { kind: "cylinder", args: [0.62, 0.95, 0.85, 4], position: [0, -1.35, 0] },
    { kind: "cylinder", args: [0.32, 0.62, 0.75, 4], position: [0, -0.55, 0], rotation: [0, Math.PI / 4, 0] },
    { kind: "cylinder", args: [0.12, 0.32, 0.65, 4], position: [0, 0.15, 0] },
    { kind: "cone", args: [0.12, 0.55, 4], position: [0, 0.75, 0] },
  ],

  // Colosseum — a faceted torus (tubularSegments 16 reads as an arcade
  // rhythm of bays) sitting on a squat drum base, with a smaller ring tier
  // above suggesting the amphitheater's stepped upper level.
  rome: [
    { kind: "cylinder", args: [1.05, 1.05, 0.55, 24], position: [0, -0.85, 0] },
    { kind: "torus", args: [0.95, 0.22, 8, 16], position: [0, -0.15, 0], rotation: [Math.PI / 2, 0, 0] },
    { kind: "torus", args: [0.72, 0.1, 6, 12], position: [0, 0.55, 0], rotation: [Math.PI / 2, 0, 0] },
  ],

  // Cliffside village — stacked cuboid tiers of decreasing size, each
  // topped by a sphere sunk halfway into the tier above it so only the
  // upper hemisphere reads — a cheap, reliable way to get a "dome" without
  // partial-sphere geometry.
  santorini: [
    { kind: "box", args: [1.6, 0.5, 1.1], position: [0, -1.3, 0] },
    { kind: "box", args: [1.15, 0.45, 0.85], position: [0.15, -0.85, 0.05] },
    { kind: "box", args: [0.5, 0.35, 0.5], position: [0.5, -0.45, 0.35] },
    { kind: "sphere", args: [0.24, 16, 12], position: [0.5, -0.27, 0.35] },
    { kind: "box", args: [0.75, 0.4, 0.6], position: [-0.15, -0.42, -0.1] },
    { kind: "sphere", args: [0.32, 16, 12], position: [-0.15, -0.22, -0.1] },
  ],

  // Canal hull + facade row — a long low box hull with a shallow torus arc
  // (a partial-arc torus, the 5th TorusGeometry arg) standing in for the
  // curved waterline, plus four narrow facade boxes of varying height and
  // a single leaning pole (mooring post / gondola pole).
  venice: [
    { kind: "box", args: [2.3, 0.35, 0.9], position: [0, -1.55, 0] },
    { kind: "torus", args: [1.6, 0.08, 6, 20, 1.6], position: [0, -1.35, 0], rotation: [Math.PI / 2, 0, 0] },
    { kind: "box", args: [0.3, 1.0, 0.3], position: [-0.7, -0.7, 0] },
    { kind: "box", args: [0.26, 1.3, 0.26], position: [-0.2, -0.55, 0] },
    { kind: "box", args: [0.22, 0.85, 0.22], position: [0.3, -0.68, 0] },
    { kind: "box", args: [0.3, 1.1, 0.3], position: [0.85, -0.65, 0] },
    { kind: "cylinder", args: [0.03, 0.03, 1.7, 6], position: [1.3, -0.3, 0], rotation: [0, 0, -0.18] },
  ],

  // Mountain cluster — plain cones at varying radius/height/position; the
  // simplest recipe of the eight, deliberately so — the Alps' whole
  // character is scale and repetition, not detail.
  alps: [
    { kind: "cone", args: [0.75, 1.7, 5], position: [-0.9, -1.05, -0.3] },
    { kind: "cone", args: [0.55, 1.15, 5], position: [-0.15, -1.35, 0.15] },
    { kind: "cone", args: [0.95, 2.1, 6], position: [0.55, -0.9, -0.1] },
    { kind: "cone", args: [0.4, 0.85, 5], position: [1.15, -1.45, 0.3] },
    { kind: "cone", args: [0.28, 0.55, 5], position: [-1.4, -1.55, 0.35] },
  ],

  // Clock tower — a tall box shaft with a 45°-rotated 4-sided cone cap
  // (its square cross-section reads as a pitched pyramidal roof) and a
  // flat ring "clock face" set into the shaft, facing the camera.
  london: [
    { kind: "box", args: [1.1, 0.3, 1.1], position: [0, -1.85, 0] },
    { kind: "box", args: [0.85, 2.6, 0.85], position: [0, -0.55, 0] },
    { kind: "ring", args: [0.22, 0.34, 24], position: [0, 0.35, 0.44] },
    { kind: "cone", args: [0.65, 0.75, 4], position: [0, 1.1, 0], rotation: [0, Math.PI / 4, 0] },
  ],

  // Two organic spires, each built from three tapering (rounder,
  // 8-sided) cylinder segments with progressive Y-axis rotation offsets
  // and a slender cone tip — an abstract nod to Sagrada Família's twisting
  // spires, not a literal likeness, per the original SVG's own approach.
  barcelona: [
    { kind: "cylinder", args: [0.05, 0.32, 0.55, 8], position: [-0.35, -1.5, 0] },
    { kind: "cylinder", args: [0.09, 0.28, 0.55, 8], position: [-0.3, -0.98, 0], rotation: [0, 0.4, 0] },
    { kind: "cylinder", args: [0.05, 0.2, 0.5, 8], position: [-0.22, -0.48, 0], rotation: [0, 0.8, 0] },
    { kind: "cone", args: [0.05, 0.35, 8], position: [-0.15, -0.05, 0] },
    { kind: "cylinder", args: [0.07, 0.4, 0.7, 8], position: [0.45, -1.4, 0] },
    { kind: "cylinder", args: [0.11, 0.33, 0.6, 8], position: [0.4, -0.8, 0], rotation: [0, -0.35, 0] },
    { kind: "cylinder", args: [0.06, 0.22, 0.55, 8], position: [0.32, -0.25, 0], rotation: [0, -0.7, 0] },
    { kind: "cone", args: [0.06, 0.4, 8], position: [0.25, 0.2, 0] },
  ],

  // Canal house row — four narrow boxes at varying heights, each capped
  // with a 45°-rotated 4-sided cone standing in for a triangular gable
  // roof, the way London's cap does — same trick, different rhythm and
  // proportions.
  amsterdam: [
    { kind: "box", args: [0.5, 1.5, 0.5], position: [-1.05, -1.05, 0] },
    { kind: "cone", args: [0.4, 0.5, 4], position: [-1.05, -0.05, 0], rotation: [0, Math.PI / 4, 0] },
    { kind: "box", args: [0.5, 1.9, 0.5], position: [-0.4, -0.85, 0] },
    { kind: "cone", args: [0.4, 0.55, 4], position: [-0.4, 0.32, 0], rotation: [0, Math.PI / 4, 0] },
    { kind: "box", args: [0.5, 1.65, 0.5], position: [0.25, -0.97, 0] },
    { kind: "cone", args: [0.4, 0.5, 4], position: [0.25, 0.08, 0], rotation: [0, Math.PI / 4, 0] },
    { kind: "box", args: [0.5, 2.1, 0.5], position: [0.9, -0.75, 0] },
    { kind: "cone", args: [0.4, 0.6, 4], position: [0.9, 0.6, 0], rotation: [0, Math.PI / 4, 0] },
  ],
};
