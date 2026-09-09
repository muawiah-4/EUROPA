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
  /** Real-world coordinates, decimal degrees — used by the detail-page specimen stamp */
  coordinates: { lat: number; lon: number };
  /** Relative pacing — mirrors "sound-inspired visual rhythm" from the brief */
  pace: "slow" | "medium" | "brisk";

  // --- Extended content, used on /destinations and /destinations/[id] ---
  /** Short one-line tagline for index cards (distinct from the stacked `headline`) */
  tagline: string;
  /** 2-3 sentence intro paragraph for the detail page */
  overview: string;
  /** Short history paragraph */
  history: string;
  /** Short culture/character paragraph */
  culture: string;
  /** 3-4 short "look for" highlights */
  highlights: string[];
  /** One practical visiting tip */
  travelTip: string;
  /** Best season to visit, plain text */
  bestSeason: string;
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
    coordinates: { lat: 48.8566, lon: 2.3522 },
    pace: "slow",
    tagline: "The city that invented looking effortless.",
    overview:
      "Paris built its reputation on precision disguised as ease — wide boulevards, iron lattice, and a light that turns ordinary stone gold at the end of the day.",
    history:
      "Rebuilt in the 19th century into the boulevarded city known today, Paris has spent over 150 years refining the art of urban elegance without ever finishing the job.",
    culture:
      "Café terraces face outward, not inward — a small architectural habit that turns people-watching into the city's quiet national sport.",
    highlights: [
      "Iron lattice towers built for a world's fair, never meant to stay",
      "Riverside walks that change character every few hundred meters",
      "A café culture built around watching, not just eating",
    ],
    travelTip: "Arrive an hour before sunset and let the light do the work.",
    bestSeason: "April – June, or September – October",
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
    coordinates: { lat: 41.9028, lon: 12.4964 },
    pace: "slow",
    tagline: "Where every layer is a different century.",
    overview:
      "Rome doesn't separate its past from its present — a two-thousand-year-old amphitheater sits a short walk from a twenty-first-century espresso bar, and nobody finds that strange.",
    history:
      "Built and rebuilt across the reigns of emperors, popes, and republics, Rome's ruins were never demolished so much as built around.",
    culture:
      "Meals run long here on purpose — a table is treated as a place to stay, not pass through.",
    highlights: [
      "A stone amphitheater still standing after two millennia",
      "Fountains meant to be walked past slowly, not photographed quickly",
      "Ruins that double as neighborhood shortcuts",
    ],
    travelTip: "Visit the ancient sites at opening time, before the heat and the crowds arrive together.",
    bestSeason: "April – May, or late September",
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
    coordinates: { lat: 36.3932, lon: 25.4615 },
    pace: "brisk",
    tagline: "An island built to face the sunset.",
    overview:
      "Santorini's white walls and blue domes weren't chosen for postcards — they're a practical response to sun, wind, and a volcanic caldera that shapes everything built above it.",
    history:
      "Formed by one of the largest volcanic eruptions in recorded history, the island's crescent shape is literally the rim of a collapsed caldera.",
    culture:
      "Life here runs on the caldera's schedule — terraces fill an hour before sunset and empty an hour after, all at once.",
    highlights: [
      "Cliffside villages stacked in tiers above the caldera",
      "Volcanic beaches in black, red, and white sand",
      "Whitewash and blue-domed churches used as wayfinding, not decoration",
    ],
    travelTip: "Watch the sunset from the northern villages — the same view, a fraction of the crowd.",
    bestSeason: "Late May – June, or September",
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
    coordinates: { lat: 45.4408, lon: 12.3155 },
    pace: "slow",
    tagline: "A city that chose water over roads.",
    overview:
      "Venice was built on a lagoon out of necessity and has spent centuries turning that limitation into its entire identity — no cars, no wide streets, just water, stone, and the sound of oars.",
    history:
      "Founded by refugees fleeing invasion on the mainland, the city grew into a maritime republic that once controlled trade across the Mediterranean.",
    culture:
      "Getting lost is treated as part of the visit, not a failure of it — the alleys were never meant to be walked in a straight line.",
    highlights: [
      "Canals that double as the city's only streets",
      "Facades built to be seen from the water first",
      "Morning mist that softens the whole skyline",
    ],
    travelTip: "Walk the back canals at dawn, before the day's first boats stir the water.",
    bestSeason: "April – June, or late September – October",
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
    coordinates: { lat: 46.6863, lon: 7.8632 },
    pace: "slow",
    tagline: "Scale that resets your sense of size.",
    overview:
      "The Swiss Alps don't announce themselves gradually — they rise fast, hold snow late into the year, and make every other landscape feel like a rehearsal.",
    history:
      "Shaped over millions of years by glaciers that carved the valleys long before any village settled in them.",
    culture:
      "Villages here are built to work with the mountain's schedule — steep roofs and paths that follow the snowline instead of fighting it.",
    highlights: [
      "Peaks that hold snow through the height of summer",
      "Valleys carved by glaciers long since retreated",
      "Silence dense enough to hear your own breathing",
    ],
    travelTip: "Go up at first light — the ridgelines catch color for only a few minutes.",
    bestSeason: "June – September for hiking, December – March for snow",
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
    coordinates: { lat: 51.5074, lon: -0.1278 },
    pace: "brisk",
    tagline: "Centuries of stone under a sky that won't commit.",
    overview:
      "London layers its history in plain sight — a clock tower older than most nations sits blocks from glass towers still under construction, and the weather never quite decides which era it prefers.",
    history:
      "Rebuilt repeatedly after fire, war, and expansion, London has never fully demolished its own past — just built the next century on top of it.",
    culture:
      "Queueing is closer to a civic ritual than an inconvenience — orderly, unspoken, and taken seriously.",
    highlights: [
      "A clock tower that has marked time since the 1800s",
      "Wet pavement that turns streetlights into long reflections",
      "Neighborhoods that change character every few blocks",
    ],
    travelTip: "Bring a coat regardless of the forecast — the sky changes its mind hourly.",
    bestSeason: "May – September",
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
    coordinates: { lat: 41.3851, lon: 2.1734 },
    pace: "medium",
    tagline: "A skyline shaped by one imagination.",
    overview:
      "Barcelona let one architect's vision reshape entire blocks of the city — the result is a skyline where organic curves interrupt the grid on purpose.",
    history:
      "Built on a strict 19th-century grid, the city's most famous buildings were designed specifically to break that grid's rules.",
    culture:
      "Evenings start late and stretch longer — dinner rarely begins before nine, and nobody treats that as unusual.",
    highlights: [
      "Facades that curve where the rest of the city goes straight",
      "A cathedral still under construction after more than a century",
      "Balconies used as much as any room indoors",
    ],
    travelTip: "Visit the famous facades at opening time — the crowds triple by midday.",
    bestSeason: "May – June, or September – October",
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
    coordinates: { lat: 52.3676, lon: 4.9041 },
    pace: "medium",
    tagline: "A city that leans in to listen.",
    overview:
      "Amsterdam's canal houses lean slightly forward by design — a centuries-old trick for hoisting furniture through upper windows that now just looks like the whole city is paying attention.",
    history:
      "Built on reclaimed land and threaded with canals dug for trade, the city's ring of waterways is still its defining shape today.",
    culture:
      "Bicycles outnumber cars in the city center, and right-of-way is negotiated by habit more than by sign.",
    highlights: [
      "Canal houses that lean forward on purpose, not by accident",
      "A ring of waterways still used daily, not just for show",
      "Bridges lit at dusk in a slow, staggered wave",
    ],
    travelTip: "Rent a bike for an afternoon — the city reveals itself differently at cycling speed.",
    bestSeason: "April (tulip season), or June – August",
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

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}
