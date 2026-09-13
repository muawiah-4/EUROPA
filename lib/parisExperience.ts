/**
 * Data for /paris — "Paris in Motion," a scroll-driven cinematic deep-dive
 * into a single destination, one level richer than the standard
 * /destinations/[id] template. Phase 1 of 3: Acts 01–03 only (Motion,
 * Icons, Neighborhoods). Acts 04–09 from the original brief (Look Closer,
 * Beneath Paris, The Seine, The Art of Paris, After Dark, Leaving Paris)
 * are a deliberately separate follow-up phase, not stubbed here — this
 * ships as a complete, non-dangling 3-act experience rather than a
 * 9-act shell with six empty rooms.
 *
 * Facts (arrondissements, dates, architects) are real, not invented —
 * see each landmark/neighborhood's `description` for what's asserted.
 * Positions are an artistic, roughly-geographic arrangement (west-to-east
 * along the Seine, Montmartre elevated to the north), not a surveyed map.
 */

export type Vec3 = [number, number, number];

export type ParisAct = {
  id: string;
  index: number;
  label: string;
  range: [number, number];
};

export type ParisLandmark = {
  id: string;
  name: string;
  district: string;
  description: string;
  position: Vec3;
  height: number;
  range: [number, number];
  photo: string;
  aspect: number;
};

export type ParisNeighborhood = {
  id: string;
  name: string;
  description: string;
  position: Vec3;
  height: number;
  range: [number, number];
  photo: string;
  aspect: number;
};

// The Act 01 "Paris in Motion" establishing shot — a rooftop sunset with
// the tower distant. Shown full-bleed before the camera dollies into the
// Eiffel Tower billboard.
export const PARIS_HERO_PHOTO = "/paris/hero.jpg";
export const PARIS_HERO_ASPECT = 1.5;

function evenRanges(start: number, end: number, count: number): [number, number][] {
  const step = (end - start) / count;
  return Array.from({ length: count }, (_, i) => [start + i * step, start + (i + 1) * step] as [number, number]);
}

export const PARIS_ACCENT = "#e8c07a";
export const PARIS_SKY: [string, string] = ["#241a12", "#0d0a08"];

// Total scroll length, in vh. Act 01 is a short establishing beat; Act 02
// carries seven real dwell-and-transition landmark visits; Act 03 gives
// four neighborhoods a slower, closer, street-level pace.
export const PARIS_LENGTH_VH = 2560;

export const PARIS_ACTS: ParisAct[] = [
  { id: "motion", index: 1, label: "PARIS IN MOTION", range: [0, 0.09] },
  { id: "icons", index: 2, label: "THE ICONS", range: [0.09, 0.6] },
  { id: "neighborhoods", index: 3, label: "THE NEIGHBORHOODS", range: [0.6, 1] },
];

const iconRanges = evenRanges(0.09, 0.6, 7);
const neighborhoodRanges = evenRanges(0.6, 1, 4);

export const PARIS_LANDMARKS: ParisLandmark[] = [
  {
    id: "eiffel",
    name: "Eiffel Tower",
    district: "7th Arrondissement",
    description: "Paris from above.",
    position: [-6, 0, 2],
    height: 6.2,
    range: iconRanges[0],
    photo: "/paris/eiffel.jpg",
    aspect: 1.551,
  },
  {
    id: "louvre",
    name: "Louvre",
    district: "1st Arrondissement",
    description: "The world inside a former palace.",
    position: [1, 0, -2],
    height: 1.9,
    range: iconRanges[1],
    photo: "/paris/louvre.jpg",
    aspect: 1.904,
  },
  {
    id: "arc",
    name: "Arc de Triomphe",
    district: "8th Arrondissement",
    description: "Twelve avenues meet at one arch.",
    position: [-3, 0, -3],
    height: 2.3,
    range: iconRanges[2],
    photo: "/paris/arc.jpg",
    aspect: 1.498,
  },
  {
    id: "notredame",
    name: "Notre-Dame",
    district: "Île de la Cité",
    description: "Eight centuries, still standing.",
    position: [4, 0, 0],
    height: 3.0,
    range: iconRanges[3],
    photo: "/paris/notredame.jpg",
    aspect: 1.333,
  },
  {
    id: "sacrecoeur",
    name: "Sacré-Cœur",
    district: "Montmartre",
    description: "The highest point in the city.",
    position: [0, 3, -6],
    height: 3.6,
    range: iconRanges[4],
    photo: "/paris/sacrecoeur.jpg",
    aspect: 1.776,
  },
  {
    id: "garnier",
    name: "Palais Garnier",
    district: "9th Arrondissement",
    description: "An opera house built like a stage set.",
    position: [-1, 0, -4.5],
    height: 2.1,
    range: iconRanges[5],
    photo: "/paris/garnier.jpg",
    aspect: 1.6,
  },
  {
    id: "pont",
    name: "Pont Alexandre III",
    district: "7th / 8th Arrondissement",
    description: "The most ornate way to cross the river.",
    position: [-4.5, 0, 1],
    height: 1.3,
    range: iconRanges[6],
    photo: "/paris/pont.jpg",
    aspect: 1.294,
  },
];

export const PARIS_NEIGHBORHOODS: ParisNeighborhood[] = [
  {
    id: "montmartre",
    name: "Montmartre",
    description: "A hilltop village the city grew around, not through.",
    position: [0, 3, -6],
    height: 3.6,
    range: neighborhoodRanges[0],
    photo: "/paris/montmartre.jpg",
    aspect: 1.5,
  },
  {
    id: "marais",
    name: "Le Marais",
    description: "Medieval streets that never widened for cars.",
    position: [3, 0, -1],
    height: 1.6,
    range: neighborhoodRanges[1],
    photo: "/paris/marais.jpg",
    aspect: 0.799,
  },
  {
    id: "latin",
    name: "Latin Quarter",
    description: "Named for the language its scholars stopped speaking.",
    position: [3, 0, 2.2],
    height: 1.7,
    range: neighborhoodRanges[2],
    photo: "/paris/latin.jpg",
    aspect: 1.5,
  },
  {
    id: "germain",
    name: "Saint-Germain-des-Prés",
    description: "Where the cafés outlasted the philosophers.",
    position: [0, 0, 3.2],
    height: 2.0,
    range: neighborhoodRanges[3],
    photo: "/paris/germain.jpg",
    aspect: 1.333,
  },
];

export function actForProgress(p: number): ParisAct | null {
  return PARIS_ACTS.find((a) => p >= a.range[0] && p < a.range[1]) ?? PARIS_ACTS[PARIS_ACTS.length - 1] ?? null;
}

export function landmarkForProgress(p: number): ParisLandmark | null {
  return PARIS_LANDMARKS.find((l) => p >= l.range[0] && p < l.range[1]) ?? null;
}

export function neighborhoodForProgress(p: number): ParisNeighborhood | null {
  return PARIS_NEIGHBORHOODS.find((n) => p >= n.range[0] && p < n.range[1]) ?? null;
}
