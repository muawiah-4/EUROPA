export type AtmosphereKind =
  | "gold-dust"
  | "warm-haze"
  | "sun-glint"
  | "mist-shimmer"
  | "snowfall"
  | "rain-fog"
  | "warm-drift"
  | "dusk-mist";

export type Destination = {
  id: string;
  index: number; // 1-based, for the progress rail
  country: string;
  city: string;
  /** Scroll-progress range this chapter owns, [start, end] within 0..1 */
  range: [number, number];
  eyebrow: string; // e.g. "04 / ITALY"
  headline: string[]; // rendered as stacked lines
  micro: string; // one-sentence supporting copy
  info: { label: string; value: string }[]; // LOCATION / KNOWN FOR / BEST EXPERIENCED, etc.
  /** Atmosphere + palette drive the per-chapter mood */
  atmosphere: AtmosphereKind;
  sky: [string, string]; // gradient stops, top -> bottom
  accent: string; // single chapter accent used sparingly (label glow, hairline tint)
  /** Relative pacing — mirrors "sound-inspired visual rhythm" from the brief */
  pace: "slow" | "medium" | "brisk";
};

// Total scroll length of the pinned journey container, in vh. Long enough
// that 8 rich chapters each get real breathing room. Chapters are no longer
// equal-width slices — each destination's `pace` now maps to how much of
// that 1100vh it actually owns, so "slow" destinations (Paris, Rome,
// Venice, the Alps) get an unhurried ~127-138vh, "medium" ones (Barcelona,
// Amsterdam) sit around ~105vh, and "brisk" ones (Santorini, London) move
// through in ~83vh — a shorter, quicker beat, per the "sound-inspired
// visual rhythm" from the creative brief. See each `range` tuple below.
export const JOURNEY_LENGTH_VH = 1100;

export const DESTINATIONS: Destination[] = [
  {
    id: "paris",
    index: 1,
    country: "FRANCE",
    city: "Paris",
    range: [0.14, 0.265],
    eyebrow: "01 / FRANCE",
    headline: ["PARIS", "IN MOTION"],
    micro: "A city that rehearses elegance until it looks effortless.",
    info: [
      { label: "LOCATION", value: "PARIS / FRANCE" },
      { label: "KNOWN FOR", value: "ICONIC IRON LATTICE" },
      { label: "BEST EXPERIENCED", value: "GOLDEN HOUR" },
    ],
    atmosphere: "gold-dust",
    sky: ["#241a12", "#1a1210"],
    accent: "#e8c07a",
    pace: "slow",
  },
  {
    id: "rome",
    index: 2,
    country: "ITALY",
    city: "Rome",
    range: [0.265, 0.39],
    eyebrow: "02 / ITALY",
    headline: ["TIME", "STANDS", "HERE"],
    micro: "A city where centuries remain visible in every street.",
    info: [
      { label: "LOCATION", value: "ROME / ITALY" },
      { label: "KNOWN FOR", value: "ANCIENT ARCHITECTURE" },
      { label: "BEST EXPERIENCED", value: "SUNSET" },
    ],
    atmosphere: "warm-haze",
    sky: ["#231a12", "#160f0c"],
    accent: "#d99a5b",
    pace: "slow",
  },
  {
    id: "santorini",
    index: 3,
    country: "GREECE",
    city: "Santorini",
    range: [0.39, 0.465],
    eyebrow: "03 / GREECE",
    headline: ["WHERE THE SKY", "MEETS THE SEA"],
    micro: "White walls, blue domes, and a horizon that never quite ends.",
    info: [
      { label: "LOCATION", value: "SANTORINI / GREECE" },
      { label: "KNOWN FOR", value: "CLIFFSIDE WHITEWASH" },
      { label: "BEST EXPERIENCED", value: "MIDDAY LIGHT" },
    ],
    atmosphere: "sun-glint",
    sky: ["#12232c", "#0a161d"],
    accent: "#5fb8d6",
    pace: "brisk",
  },
  {
    id: "venice",
    index: 4,
    country: "ITALY",
    city: "Venice",
    range: [0.465, 0.58],
    eyebrow: "04 / ITALY",
    headline: ["FLOAT", "THROUGH", "HISTORY"],
    micro: "A city that gave up on streets and kept its beauty anyway.",
    info: [
      { label: "LOCATION", value: "VENICE / ITALY" },
      { label: "KNOWN FOR", value: "CANALS & REFLECTIONS" },
      { label: "BEST EXPERIENCED", value: "EARLY MIST" },
    ],
    atmosphere: "mist-shimmer",
    sky: ["#16232a", "#0d161b"],
    accent: "#7fb0ad",
    pace: "slow",
  },
  {
    id: "alps",
    index: 5,
    country: "SWITZERLAND",
    city: "The Alps",
    range: [0.58, 0.695],
    eyebrow: "05 / SWITZERLAND",
    headline: ["ABOVE", "EVERYTHING"],
    micro: "Scale that makes every other view feel small by comparison.",
    info: [
      { label: "LOCATION", value: "SWISS ALPS" },
      { label: "KNOWN FOR", value: "ALTITUDE & SILENCE" },
      { label: "BEST EXPERIENCED", value: "FIRST LIGHT" },
    ],
    atmosphere: "snowfall",
    sky: ["#1a2129", "#0e1318"],
    accent: "#c9d6dd",
    pace: "slow",
  },
  {
    id: "london",
    index: 6,
    country: "UNITED KINGDOM",
    city: "London",
    range: [0.695, 0.77],
    eyebrow: "06 / UNITED KINGDOM",
    headline: ["WHERE PAST", "MEETS", "FUTURE"],
    micro: "Centuries of stone under a sky that never fully commits.",
    info: [
      { label: "LOCATION", value: "LONDON / UK" },
      { label: "KNOWN FOR", value: "HISTORIC SKYLINE" },
      { label: "BEST EXPERIENCED", value: "BLUE HOUR RAIN" },
    ],
    atmosphere: "rain-fog",
    sky: ["#171b22", "#0e1015"],
    accent: "#e0a94a",
    pace: "brisk",
  },
  {
    id: "barcelona",
    index: 7,
    country: "SPAIN",
    city: "Barcelona",
    range: [0.77, 0.865],
    eyebrow: "07 / SPAIN",
    headline: ["DESIGNED", "TO BE", "DIFFERENT"],
    micro: "A city that let one architect's imagination reshape its skyline.",
    info: [
      { label: "LOCATION", value: "BARCELONA / SPAIN" },
      { label: "KNOWN FOR", value: "ORGANIC ARCHITECTURE" },
      { label: "BEST EXPERIENCED", value: "LATE AFTERNOON" },
    ],
    atmosphere: "warm-drift",
    sky: ["#231a14", "#170f0d"],
    accent: "#e0855a",
    pace: "medium",
  },
  {
    id: "amsterdam",
    index: 8,
    country: "NETHERLANDS",
    city: "Amsterdam",
    range: [0.865, 0.96],
    eyebrow: "08 / NETHERLANDS",
    headline: ["MOVE WITH", "THE CITY"],
    micro: "Water, bicycles, and gabled houses leaning in to listen.",
    info: [
      { label: "LOCATION", value: "AMSTERDAM / NETHERLANDS" },
      { label: "KNOWN FOR", value: "CANAL HOUSES" },
      { label: "BEST EXPERIENCED", value: "DUSK" },
    ],
    atmosphere: "dusk-mist",
    sky: ["#1a1720", "#100e15"],
    accent: "#b98fd1",
    pace: "medium",
  },
];

/**
 * Named scroll breakpoints outside the destination chapters.
 *
 * `mapStart` was originally 0.96, giving the interactive map an ~0.8%-of-
 * scroll window (under 9vh) to fade in, hold, and fade out again — too
 * narrow to reliably land on with a mouse wheel or a swipe. It now opens
 * earlier, inside the last few vh of Amsterdam's dwell, giving it a full
 * ~2%-of-scroll window (~22vh) before `outroStart`. `outroStart` stays at
 * 0.97 to match EndSequence's own internal fade-in start.
 */
export const JOURNEY_MARKS = {
  heroEnd: 0.08,
  descentEnd: 0.14,
  mapStart: 0.955,
  outroStart: 0.97,
};

export function destinationForProgress(p: number): Destination | null {
  return DESTINATIONS.find((d) => p >= d.range[0] && p < d.range[1]) ?? null;
}
