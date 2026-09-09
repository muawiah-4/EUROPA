import type { LandmarkShape } from "@/components/three/FloatingLandmark";

// Generates a curved arc of identical box "columns" facing the camera —
// used for Rome's amphitheater colonnade. Only a camera-facing arc (not a
// full 360° ring) so the wraparound reads as one curved facade instead of
// the far side's columns visually colliding with the near side's under a
// far, low-perspective camera.
function colonnadeArc(
  count: number,
  radius: number,
  y: number,
  w: number,
  h: number,
  d: number,
  span: number
): LandmarkShape {
  const out: LandmarkShape = [];
  const start = Math.PI / 2 - span / 2;
  for (let i = 0; i < count; i++) {
    const a = start + (count === 1 ? 0 : (i / (count - 1)) * span);
    out.push({
      kind: "box",
      args: [w, h, d],
      position: [Math.cos(a) * radius, y, Math.sin(a) * radius],
      rotation: [0, a, 0],
    });
  }
  return out;
}

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

  // Colosseum — a curved colonnade of individual box "columns" (see
  // colonnadeArc above) in two tiers of decreasing radius/height on a
  // squat foundation drum. The gaps between columns read as the arcade's
  // arches; a flat stacked-ring version (tried first) read as nothing more
  // than floating discs, so this trades a literal torus for actual
  // countable rhythm.
  rome: [
    { kind: "cylinder", args: [1.05, 1.1, 0.22, 24], position: [0, -1.62, 0] },
    ...colonnadeArc(13, 0.95, -1.12, 0.15, 0.85, 0.13, 3.3),
    ...colonnadeArc(11, 0.72, -0.32, 0.13, 0.55, 0.11, 3.1),
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

  // Canal bridge + facade row — a humpback bridge arch (a half-arc torus;
  // three.js sweeps a torus's main ring in its local XY plane, so arc=PI
  // with no rotation already faces the camera as a clean arch) standing in
  // front of five canal-house facades that touch edge-to-edge (each box's
  // x-spacing equals its own width, so there's no gap for the eye to read
  // as "floating"), on a quay slab. The previous version's facades floated
  // with visible gaps and a lone diagonal pole read as a stray line rather
  // than a mooring post — this keeps every piece touching the water line.
  venice: [
    { kind: "box", args: [2.1, 0.3, 0.85], position: [0, -1.55, 0] },
    { kind: "box", args: [0.42, 1.05, 0.4], position: [-1.05, -0.875, -0.25] },
    { kind: "box", args: [0.42, 1.45, 0.4], position: [-0.63, -0.675, -0.25] },
    { kind: "box", args: [0.42, 1.2, 0.4], position: [-0.21, -0.8, -0.25] },
    { kind: "box", args: [0.42, 1.6, 0.4], position: [0.21, -0.6, -0.25] },
    { kind: "box", args: [0.42, 0.95, 0.4], position: [0.63, -0.925, -0.25] },
    { kind: "torus", args: [0.62, 0.085, 8, 20, Math.PI], position: [0, -1.4, 0.35] },
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

  // Two spires built from overlapping spheres of decreasing radius — the
  // overlap leaves a visible waist-pinch between each bulge, so the
  // silhouette reads as a beaded, organic taper (close to how Sagrada
  // Família's real pinnacles narrow) rather than a smooth cone (reads as
  // a pine tree, tried first) or a rotated-box stack (read as a stack of
  // capsules/lipstick tubes, tried second). Each spire ends in a thin
  // cone spike for the pinnacle tip.
  barcelona: [
    { kind: "sphere", args: [0.26, 12, 10], position: [-0.4, -1.55, 0] },
    { kind: "sphere", args: [0.22, 12, 10], position: [-0.4, -1.15, 0] },
    { kind: "sphere", args: [0.18, 12, 10], position: [-0.4, -0.82, 0] },
    { kind: "sphere", args: [0.14, 12, 10], position: [-0.4, -0.55, 0] },
    { kind: "sphere", args: [0.1, 10, 8], position: [-0.4, -0.34, 0] },
    { kind: "cone", args: [0.06, 0.22, 8], position: [-0.4, -0.14, 0] },
    { kind: "sphere", args: [0.3, 12, 10], position: [0.35, -1.5, 0.1] },
    { kind: "sphere", args: [0.26, 12, 10], position: [0.35, -1.05, 0.1] },
    { kind: "sphere", args: [0.22, 12, 10], position: [0.35, -0.68, 0.1] },
    { kind: "sphere", args: [0.18, 12, 10], position: [0.35, -0.38, 0.1] },
    { kind: "sphere", args: [0.13, 10, 8], position: [0.35, -0.14, 0.1] },
    { kind: "sphere", args: [0.09, 10, 8], position: [0.35, 0.06, 0.1] },
    { kind: "cone", args: [0.05, 0.22, 8], position: [0.35, 0.24, 0.1] },
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
