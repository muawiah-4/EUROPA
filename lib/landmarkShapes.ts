import * as THREE from "three";
import type { LandmarkShape } from "@/components/three/FloatingLandmark";

type Shape = LandmarkShape[number];
type Point3 = [number, number, number];

// ---------------------------------------------------------------------------
// Generator helpers
//
// All of these are plain functions that return LandmarkShape arrays (or a
// single Shape), computed once at module load — same pattern the original
// colonnadeArc() used. They exist so the eight recipes below can express
// real structural repetition (cross-bracing, repeated arches, tiering,
// stepped rooflines, beaded/branching spires) as a few parameterized calls
// instead of hundreds of hand-typed literals. Every generator only ever
// emits box/cylinder/cone/torus/ring/sphere primitives — the project's hard
// geometry constraint (see components/three/FloatingLandmark.tsx).
// ---------------------------------------------------------------------------

// A single box "strut" connecting two arbitrary 3D points — the primitive
// used for diagonal cross-bracing (Eiffel Tower lattice, Sagrada Família
// branch details). BoxGeometry's height axis is local +Y, so we align that
// axis with the p0→p1 direction via a quaternion, then read it back out as
// an Euler triplet (three.js's default object rotation order is XYZ, which
// is exactly what <mesh rotation={...}> expects) — a single-axis or
// arbitrary-axis alignment done once, correctly, rather than hand-deriving
// per-strut angles.
function strut(p0: Point3, p1: Point3, thickness: number, depth: number = thickness): Shape {
  const a = new THREE.Vector3(...p0);
  const b = new THREE.Vector3(...p1);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a);
  const length = dir.length() || 0.0001;
  dir.normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  const euler = new THREE.Euler().setFromQuaternion(quat, "XYZ");
  return {
    kind: "box",
    args: [thickness, length, depth],
    position: [mid.x, mid.y, mid.z],
    rotation: [euler.x, euler.y, euler.z],
  };
}

// A half-torus "arch" spanning between two same-height points, oriented so
// its flat diameter line sits on p0→p1 and the dome bulges straight up —
// the generalized version of the single hand-placed Venice bridge arch
// (`torus` with `arc=Math.PI` and no rotation already faces the camera
// as a clean arch when p0/p1 lie along world X; this rotates that same
// trick to face any horizontal direction). Used both standalone (Eiffel's
// base arches) and inside archRing (Colosseum's repeated arcade bays).
function archBetween(p0: Point3, p1: Point3, tube: number): Shape {
  const dx = p1[0] - p0[0];
  const dz = p1[2] - p0[2];
  const halfSpan = Math.sqrt(dx * dx + dz * dz) / 2;
  const theta = -Math.atan2(dz, dx);
  return {
    kind: "torus",
    args: [halfSpan, tube, 6, 12, Math.PI],
    position: [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2],
    rotation: [0, theta, 0],
  };
}

// One corner of a tapering square tower at normalized height t∈[0,1]
// between (y0, half-width bw) and (y1, half-width tw). idx selects which
// of the 4 corners (matching the sign pairs below) — used by latticeTier
// to place both the 4 tapering corner legs and the cross-brace endpoints
// along them.
const CORNER_SIGNS: [number, number][] = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];
function towerCorner(t: number, idx: number, y0: number, y1: number, bw: number, tw: number): Point3 {
  const [sx, sz] = CORNER_SIGNS[idx];
  const hw = bw + (tw - bw) * t;
  return [sx * hw, y0 + (y1 - y0) * t, sz * hw];
}

// A tapering, square-plan lattice tier: 4 corner legs (straight struts from
// the wide base corners to the narrower top corners) plus real X-cross-
// bracing on each of the 4 faces, subdivided into `braceSegments` panels —
// the Eiffel Tower's actual structural language, not a stand-in cone.
function latticeTier(
  y0: number,
  y1: number,
  bw: number,
  tw: number,
  braceSegments: number,
  strutW: number
): LandmarkShape {
  const out: LandmarkShape = [];
  for (let i = 0; i < 4; i++) {
    out.push(strut(towerCorner(0, i, y0, y1, bw, tw), towerCorner(1, i, y0, y1, bw, tw), strutW));
  }
  const faces: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  for (const [ci, cj] of faces) {
    for (let s = 0; s < braceSegments; s++) {
      const t0 = s / braceSegments;
      const t1 = (s + 1) / braceSegments;
      const a0 = towerCorner(t0, ci, y0, y1, bw, tw);
      const b0 = towerCorner(t0, cj, y0, y1, bw, tw);
      const a1 = towerCorner(t1, ci, y0, y1, bw, tw);
      const b1 = towerCorner(t1, cj, y0, y1, bw, tw);
      out.push(strut(a0, b1, strutW * 0.75));
      out.push(strut(b0, a1, strutW * 0.75));
    }
  }
  return out;
}

// A curved (not full 360°) ring of repeated open arch bays: two pillars
// plus an archBetween cap per bay, walked around a circle the same way
// colonnadeArc walks its columns — generalizing both colonnadeArc's
// camera-facing-arc placement AND the single hand-built Venice arch into a
// repeatable-around-a-circle arcade. Used for the Colosseum's tiers, where
// the gaps between bays read as real open arches rather than solid columns.
function archRing(
  count: number,
  radius: number,
  y0: number,
  pillarHeight: number,
  bayWidth: number,
  pillarThickness: number,
  span: number
): LandmarkShape {
  const out: LandmarkShape = [];
  const start = Math.PI / 2 - span / 2;
  const halfW = bayWidth / 2;
  for (let i = 0; i < count; i++) {
    const a = start + (count === 1 ? 0 : (i / (count - 1)) * span);
    const cx = Math.cos(a) * radius;
    const cz = Math.sin(a) * radius;
    const tx = -Math.sin(a);
    const tz = Math.cos(a);
    const p1: Point3 = [cx + tx * halfW, y0 + pillarHeight, cz + tz * halfW];
    const p2: Point3 = [cx - tx * halfW, y0 + pillarHeight, cz - tz * halfW];
    out.push({
      kind: "box",
      args: [pillarThickness, pillarHeight, pillarThickness],
      position: [p1[0], y0 + pillarHeight / 2, p1[2]],
    });
    out.push({
      kind: "box",
      args: [pillarThickness, pillarHeight, pillarThickness],
      position: [p2[0], y0 + pillarHeight / 2, p2[2]],
    });
    out.push(archBetween(p1, p2, pillarThickness * 0.55));
  }
  return out;
}

// A tapering, faceted "rock" peak topped with a smaller, steeper cone —
// the steeper tip catches the shared material's directional key light at a
// different angle than the broad rock body beneath it, so it reads as a
// lighter snow cap purely through the existing lighting/fresnel material
// (no second color, no material change — just a second, smaller primitive).
function snowPeak(radius: number, height: number, segments: number, position: Point3): LandmarkShape {
  const [x, y, z] = position;
  const capHeight = height * 0.3;
  const capRadius = radius * 0.34;
  const capY = y + height / 2 - capHeight * 0.4;
  return [
    { kind: "cone", args: [radius, height, segments], position: [x, y, z] },
    { kind: "cone", args: [capRadius, capHeight, Math.min(segments, 6)], position: [x, capY, z] },
  ];
}

// A tapering stack of overlapping spheres (see the original file's note on
// why this reads as a "beaded" organic taper better than a smooth cone or
// a stacked-box capsule), optionally with one diagonal branch strut flaring
// off partway up — Sagrada Família's tree-column/branching read, reusing
// the same strut() generator the Eiffel Tower's bracing uses.
function beadedSpire(
  position: Point3,
  baseY: number,
  baseRadius: number,
  beadCount: number,
  branch: boolean
): LandmarkShape {
  const out: LandmarkShape = [];
  const [cx, , cz] = position;
  let y = baseY;
  let r = baseRadius;
  const branchAt = Math.floor(beadCount * 0.4);
  for (let i = 0; i < beadCount; i++) {
    out.push({ kind: "sphere", args: [r, 12, 10], position: [cx, y, cz] });
    if (branch && i === branchAt) {
      const bx = cx + (cx >= 0 ? 0.3 : -0.3);
      const by = y - r * 1.7;
      const bz = cz + (cz >= 0 ? 0.16 : -0.16);
      out.push(strut([cx, y, cz], [bx, by, bz], r * 0.5));
    }
    y += r * 1.35;
    r *= 0.78;
  }
  out.push({ kind: "cone", args: [r * 0.65, r * 2.4, 8], position: [cx, y, cz] });
  return out;
}

// A townhouse/palazzo facade row: boxes placed edge-to-edge (no gaps, same
// technique the original Venice recipe used) each topped with one of a
// small vocabulary of roofline caps. Reused by both Amsterdam (stepped and
// bell gables — its whole structural brief) and Venice (flat cornice caps,
// for its extended facade row).
type Gable = "triangular" | "stepped" | "bell" | "flat";

function gableCap(kind: Gable, cx: number, topY: number, width: number, depth: number, cz: number): LandmarkShape {
  const out: LandmarkShape = [];
  if (kind === "triangular") {
    out.push({
      kind: "cone",
      args: [width * 0.72, width * 0.85, 4],
      position: [cx, topY + width * 0.42, cz],
      rotation: [0, Math.PI / 4, 0],
    });
  } else if (kind === "stepped") {
    let w = width * 0.94;
    let y = topY;
    for (let s = 0; s < 3; s++) {
      const h = width * 0.28;
      out.push({ kind: "box", args: [w, h, depth * 0.82], position: [cx, y + h / 2, cz] });
      y += h;
      w *= 0.6;
    }
    out.push({ kind: "cone", args: [w * 0.65, width * 0.3, 4], position: [cx, y + width * 0.15, cz], rotation: [0, Math.PI / 4, 0] });
  } else if (kind === "bell") {
    out.push({ kind: "cylinder", args: [width * 0.22, width * 0.48, width * 0.24, 8], position: [cx, topY + width * 0.12, cz] });
    out.push({
      kind: "cylinder",
      args: [width * 0.09, width * 0.22, width * 0.34, 8],
      position: [cx, topY + width * 0.24 + width * 0.17, cz],
    });
    out.push({ kind: "sphere", args: [width * 0.12, 10, 8], position: [cx, topY + width * 0.24 + width * 0.34 + width * 0.06, cz] });
  } else {
    out.push({ kind: "box", args: [width * 1.08, width * 0.12, depth * 1.05], position: [cx, topY + width * 0.06, cz] });
  }
  return out;
}

type FacadeSpec = { width: number; height: number; depth: number; gable: Gable; setback?: number };

function facadeRow(specs: FacadeSpec[], baseY: number, startX: number, baseZ = 0): LandmarkShape {
  const out: LandmarkShape = [];
  let x = startX;
  for (const spec of specs) {
    const cx = x + spec.width / 2;
    const cz = baseZ + (spec.setback ?? 0);
    const topY = baseY + spec.height;
    out.push({ kind: "box", args: [spec.width, spec.height, spec.depth], position: [cx, baseY + spec.height / 2, cz] });
    out.push(...gableCap(spec.gable, cx, topY, spec.width, spec.depth, cz));
    x += spec.width;
  }
  return out;
}

/**
 * Per-destination 3D landmark recipes — plain data consumed by
 * FloatingLandmark / LandmarkObject (components/three/FloatingLandmark.tsx).
 * Built from primitive geometry only (box/cylinder/cone/torus/ring/sphere),
 * assembled with real structural repetition — actual cross-bracing, actual
 * repeated arches, actual tiering — via the generator helpers above, so
 * each silhouette reads as the real landmark rather than an abstracted
 * stand-in shape. Coordinates stay centered loosely on the origin, sized to
 * read well at FloatingLandmark's default camera framing.
 */
export const LANDMARK_SHAPES: Record<string, LandmarkShape> = {
  // Eiffel Tower — three tapering, X-cross-braced lattice tiers (wide splayed
  // base legs meeting a base arch on each face, a mid tier, and a denser
  // upper cage) separated by flat observation-platform discs, capped with a
  // tapering antenna mast.
  paris: [
    ...latticeTier(-1.72, -0.95, 0.92, 0.56, 3, 0.05),
    archBetween(towerCorner(0, 0, -1.72, -0.95, 0.92, 0.56), towerCorner(0, 1, -1.72, -0.95, 0.92, 0.56), 0.045),
    archBetween(towerCorner(0, 1, -1.72, -0.95, 0.92, 0.56), towerCorner(0, 2, -1.72, -0.95, 0.92, 0.56), 0.045),
    archBetween(towerCorner(0, 2, -1.72, -0.95, 0.92, 0.56), towerCorner(0, 3, -1.72, -0.95, 0.92, 0.56), 0.045),
    archBetween(towerCorner(0, 3, -1.72, -0.95, 0.92, 0.56), towerCorner(0, 0, -1.72, -0.95, 0.92, 0.56), 0.045),
    { kind: "box", args: [1.28, 0.06, 1.28], position: [0, -0.95, 0] },
    ...latticeTier(-0.95, -0.15, 0.5, 0.28, 3, 0.045),
    { kind: "box", args: [0.78, 0.05, 0.78], position: [0, -0.15, 0] },
    ...latticeTier(-0.15, 0.75, 0.24, 0.06, 4, 0.035),
    { kind: "box", args: [0.22, 0.04, 0.22], position: [0, 0.75, 0] },
    { kind: "cone", args: [0.065, 0.5, 6], position: [0, 1.0, 0] },
    { kind: "cone", args: [0.022, 0.16, 4], position: [0, 1.33, 0] },
  ],

  // Colosseum — three stacked archRing tiers of decreasing radius/height,
  // each a true ring of repeated open arch bays, plus a foundation drum and
  // a flat solid attic tier on top (the Colosseum's real uppermost story,
  // which had no arcade).
  rome: [
    { kind: "cylinder", args: [1.15, 1.2, 0.22, 24], position: [0, -1.78, 0] },
    ...archRing(15, 1.05, -1.6, 0.6, 0.26, 0.065, 3.4),
    ...archRing(14, 0.88, -0.83, 0.5, 0.23, 0.058, 3.3),
    ...archRing(12, 0.72, -0.18, 0.4, 0.2, 0.05, 3.15),
    { kind: "cylinder", args: [0.6, 0.66, 0.24, 20], position: [0, 0.37, 0] },
  ],

  // Cliffside village — stacked whitewashed cuboid tiers following a
  // hillside silhouette, four separate hemisphere-read domes (sphere sunk
  // halfway into its supporting cuboid), and a bell-tower accent. The blue
  // "dome color" reads entirely through the shared material's accent rim
  // light (Santorini's own accent, #5fb8d6, is already blue) — no new
  // color introduced.
  santorini: [
    { kind: "box", args: [1.7, 0.45, 1.15], position: [0, -1.55, 0] },
    { kind: "box", args: [1.25, 0.42, 0.9], position: [0.18, -1.14, 0.08] },
    { kind: "box", args: [0.55, 0.4, 0.55], position: [0.55, -0.75, 0.4] },
    { kind: "sphere", args: [0.26, 16, 12], position: [0.55, -0.55, 0.4] },
    { kind: "box", args: [0.8, 0.42, 0.62], position: [-0.2, -0.72, -0.12] },
    { kind: "sphere", args: [0.34, 16, 12], position: [-0.2, -0.5, -0.12] },
    { kind: "box", args: [0.4, 0.35, 0.4], position: [-0.65, -0.42, -0.35] },
    { kind: "sphere", args: [0.2, 14, 10], position: [-0.65, -0.24, -0.35] },
    { kind: "box", args: [0.34, 0.3, 0.34], position: [0.85, -0.42, 0.55] },
    { kind: "sphere", args: [0.17, 14, 10], position: [0.85, -0.27, 0.55] },
    { kind: "box", args: [0.22, 0.55, 0.22], position: [0.1, -0.42, -0.55] },
    { kind: "cylinder", args: [0.1, 0.1, 0.16, 8], position: [0.1, -0.06, -0.55] },
    { kind: "cone", args: [0.13, 0.22, 6], position: [0.1, 0.13, -0.55] },
  ],

  // Canal bridge (kept — already good) extended with a taller, denser
  // facadeRow of seven flat-corniced palazzo facades (edge-to-edge, varying
  // width/height for real skyline rhythm) and a campanile-style accent
  // tower standing apart from the row, the way San Marco's actually does.
  venice: [
    { kind: "box", args: [2.3, 0.3, 0.9], position: [0, -1.55, 0] },
    ...facadeRow(
      [
        { width: 0.3, height: 0.95, depth: 0.42, gable: "flat" },
        { width: 0.32, height: 1.35, depth: 0.42, gable: "flat" },
        { width: 0.28, height: 1.1, depth: 0.42, gable: "flat" },
        { width: 0.34, height: 1.6, depth: 0.42, gable: "flat" },
        { width: 0.3, height: 1.0, depth: 0.42, gable: "flat" },
        { width: 0.32, height: 1.45, depth: 0.42, gable: "flat" },
        { width: 0.28, height: 0.9, depth: 0.42, gable: "flat" },
      ],
      -1.4,
      -1.07,
      -0.25
    ),
    { kind: "torus", args: [0.62, 0.085, 8, 20, Math.PI], position: [0, -1.4, 0.35] },
    { kind: "box", args: [0.26, 1.55, 0.26], position: [1.18, -0.72, -0.4] },
    { kind: "box", args: [0.34, 0.08, 0.34], position: [1.18, 0.06, -0.4] },
    { kind: "cylinder", args: [0.15, 0.15, 0.22, 8], position: [1.18, 0.21, -0.4] },
    { kind: "cone", args: [0.19, 0.32, 4], position: [1.18, 0.48, -0.4], rotation: [0, Math.PI / 4, 0] },
  ],

  // Mountain cluster — six snowPeak() cones instead of plain cones; each
  // peak's smaller, steeper tip cone catches the shared material's fixed
  // key light differently than the broad rock body, reading as a lighter
  // snow cap without any new color or material change.
  alps: [
    ...snowPeak(0.75, 1.7, 6, [-0.9, -1.05, -0.3]),
    ...snowPeak(0.55, 1.15, 6, [-0.15, -1.35, 0.15]),
    ...snowPeak(0.95, 2.1, 7, [0.55, -0.9, -0.1]),
    ...snowPeak(0.4, 0.85, 6, [1.15, -1.45, 0.3]),
    ...snowPeak(0.28, 0.55, 5, [-1.4, -1.55, 0.35]),
    ...snowPeak(0.5, 1.0, 6, [-0.55, -1.4, -0.55]),
  ],

  // Big Ben — a proper tiered clock tower: plinth, two tapering shaft tiers
  // separated by cornice ledges, a clock stage with four outward-facing
  // clock-face rings (one per cardinal side, not just camera-facing), four
  // corner pinnacles, and a real pyramidal spire with a finial tip.
  london: [
    { kind: "box", args: [1.15, 0.3, 1.15], position: [0, -1.85, 0] },
    { kind: "box", args: [0.86, 0.95, 0.86], position: [0, -1.225, 0] },
    { kind: "box", args: [0.98, 0.06, 0.98], position: [0, -0.72, 0] },
    { kind: "box", args: [0.72, 0.67, 0.72], position: [0, -0.385, 0] },
    { kind: "box", args: [0.82, 0.06, 0.82], position: [0, -0.02, 0] },
    { kind: "box", args: [0.9, 0.62, 0.9], position: [0, 0.29, 0] },
    { kind: "ring", args: [0.16, 0.22, 20], position: [0, 0.29, 0.46] },
    { kind: "ring", args: [0.16, 0.22, 20], position: [0, 0.29, -0.46], rotation: [0, Math.PI, 0] },
    { kind: "ring", args: [0.16, 0.22, 20], position: [0.46, 0.29, 0], rotation: [0, Math.PI / 2, 0] },
    { kind: "ring", args: [0.16, 0.22, 20], position: [-0.46, 0.29, 0], rotation: [0, -Math.PI / 2, 0] },
    { kind: "cone", args: [0.05, 0.22, 4], position: [0.38, 0.71, 0.38], rotation: [0, Math.PI / 4, 0] },
    { kind: "cone", args: [0.05, 0.22, 4], position: [0.38, 0.71, -0.38], rotation: [0, Math.PI / 4, 0] },
    { kind: "cone", args: [0.05, 0.22, 4], position: [-0.38, 0.71, 0.38], rotation: [0, Math.PI / 4, 0] },
    { kind: "cone", args: [0.05, 0.22, 4], position: [-0.38, 0.71, -0.38], rotation: [0, Math.PI / 4, 0] },
    { kind: "cone", args: [0.34, 0.85, 4], position: [0, 1.02, 0], rotation: [0, Math.PI / 4, 0] },
    { kind: "cone", args: [0.05, 0.18, 4], position: [0, 1.54, 0] },
  ],

  // Sagrada Família — five beaded, tapering spires of varying height/radius
  // (up from two), three of them with a branch strut flaring off partway
  // up for the organic tree-column read.
  barcelona: [
    ...beadedSpire([-0.62, 0, 0.05], -1.6, 0.24, 6, true),
    ...beadedSpire([-0.32, 0, -0.05], -1.6, 0.3, 7, true),
    ...beadedSpire([0.0, 0, 0.1], -1.6, 0.22, 5, false),
    ...beadedSpire([0.32, 0, -0.08], -1.6, 0.28, 7, true),
    ...beadedSpire([0.6, 0, 0.06], -1.6, 0.2, 5, false),
  ],

  // Canal house row — five facadeRow() houses of varying width/height,
  // alternating real stepped and bell gable profiles (not just triangular
  // caps) for an authentic canal-row rhythm, with small setbacks so the
  // row doesn't read as a single flat wall.
  amsterdam: [
    ...facadeRow(
      [
        { width: 0.42, height: 1.55, depth: 0.42, gable: "stepped" },
        { width: 0.36, height: 1.95, depth: 0.4, gable: "bell", setback: -0.05 },
        { width: 0.4, height: 1.65, depth: 0.42, gable: "triangular" },
        { width: 0.34, height: 2.15, depth: 0.4, gable: "stepped", setback: 0.04 },
        { width: 0.44, height: 1.45, depth: 0.42, gable: "triangular" },
      ],
      -1.8,
      -0.98
    ),
  ],
};
