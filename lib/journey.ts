export type AtmosphereKind =
  | "gold-dust"
  | "warm-haze"
  | "sun-glint"
  | "mist-shimmer"
  | "snowfall"
  | "rain-fog"
  | "warm-drift"
  | "dusk-mist"
  | "amber-glow"
  | "aurora";

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
  /**
   * Optional real photograph, graded toward this destination's own
   * `sky`/`accent` rather than shown raw — see DestinationPhotoBackdrop.
   * Started as a hybrid trial on Paris only; now set per-destination as
   * real photos are supplied. Omitted entirely, a destination falls back
   * to the existing pure-procedural DestinationGradientBackdrop.
   */
  photoSrc?: string;
  /**
   * Optional small real-photo gallery for the detail page — see
   * DestinationPhotoGallery. Same hybrid-photography trial as `photoSrc`,
   * just more of it; omitted entirely for destinations with no supplied
   * photos yet.
   */
  galleryPhotos?: { src: string; aspect: number; caption: string }[];
  /**
   * Optional link to a richer, bespoke scroll experience for this
   * destination (e.g. /paris) — set only where one exists; every other
   * destination falls back to the standard detail-page template.
   */
  deepDiveHref?: string;
};

// Total scroll length of the pinned journey container, in vh. Long enough
// that 10 rich chapters each get real breathing room. Chapters are no longer
// equal-width slices — each destination's `pace` now maps to how much of
// that 1342vh it actually owns, so "slow" destinations (Paris, Rome,
// Venice, the Alps, Iceland) get an unhurried ~127-138vh, "medium" ones
// (Barcelona, Amsterdam, Prague) sit around ~105vh, and "brisk" ones
// (Santorini, London) move through in ~83vh — a shorter, quicker beat, per
// the "sound-inspired visual rhythm" from the creative brief. See each
// `range` tuple below.
//
// Prague and Iceland were added after the original 8 (see git history) —
// rather than reshuffle the whole journey's order and re-tune every
// existing chapter's carefully-set pacing, they're appended at the end,
// preserving the original 8's absolute on-screen dwell time exactly
// (each chapter's vh width is unchanged; only the total denominator grew).
// Iceland closes the journey as the grand, slow finale — the edge of the
// map — right before the interactive map/outro.
export const JOURNEY_LENGTH_VH = 1342;

export const DESTINATIONS: Destination[] = [
  {
    id: "paris",
    index: 1,
    country: "FRANCE",
    city: "Paris",
    range: [0.115, 0.217],
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
    photoSrc: "/destinations/paris.jpg",
    galleryPhotos: [
      { src: "/paris/eiffel.jpg", aspect: 1.551, caption: "The Eiffel Tower, grass and blue sky" },
      { src: "/paris/louvre.jpg", aspect: 1.904, caption: "The Louvre pyramid at daylight" },
      { src: "/paris/notredame.jpg", aspect: 1.333, caption: "Notre-Dame's west façade and twin towers" },
    ],
    deepDiveHref: "/paris",
  },
  {
    id: "rome",
    index: 2,
    country: "ITALY",
    city: "Rome",
    range: [0.217, 0.32],
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
    photoSrc: "/destinations/rome.jpg",
    galleryPhotos: [
      { src: "/destinations/rome-gallery-1.jpg", aspect: 1.905, caption: "The Colosseum, sun flaring over the top tier" },
      { src: "/destinations/rome-gallery-2.jpg", aspect: 1.5, caption: "Trevi Fountain, empty at first light" },
      { src: "/destinations/rome-gallery-3.jpg", aspect: 1.778, caption: "St. Peter's Basilica across an empty square" },
    ],
  },
  {
    id: "santorini",
    index: 3,
    country: "GREECE",
    city: "Santorini",
    range: [0.32, 0.381],
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
      "Formed by one of the largest volcanic eruptions in human history — the Bronze Age Minoan eruption — the island's crescent shape is literally the rim of a collapsed caldera.",
    culture:
      "Life here runs on the caldera's schedule — terraces fill an hour before sunset and empty an hour after, all at once.",
    highlights: [
      "Cliffside villages stacked in tiers above the caldera",
      "Volcanic beaches in black, red, and white sand",
      "Whitewash and blue-domed churches used as wayfinding, not decoration",
    ],
    travelTip: "Watch the sunset from the northern villages — the same view, a fraction of the crowd.",
    bestSeason: "Late May – June, or September",
    photoSrc: "/destinations/santorini.jpg",
    galleryPhotos: [
      { src: "/destinations/santorini-gallery-1.jpg", aspect: 1.509, caption: "The blue-domed churches, town spilling down the hillside" },
      { src: "/destinations/santorini-gallery-2.jpg", aspect: 0.666, caption: "Oia's windmills stacked along the clifftop" },
      { src: "/destinations/santorini-gallery-3.jpg", aspect: 1.502, caption: "A shaded doorway, blue shutters, the sea beyond" },
    ],
  },
  {
    id: "venice",
    index: 4,
    country: "ITALY",
    city: "Venice",
    range: [0.381, 0.475],
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
    photoSrc: "/destinations/venice.jpg",
    galleryPhotos: [
      { src: "/destinations/venice-gallery-1.jpg", aspect: 1.51, caption: "Rialto Bridge over Grand Canal traffic" },
      { src: "/destinations/venice-gallery-2.jpg", aspect: 1.0, caption: "Gondolas and gondoliers mid-stroke on the Grand Canal" },
      { src: "/destinations/venice-gallery-3.jpg", aspect: 1.498, caption: "St. Mark's Basilica, gold mosaics and spires" },
    ],
  },
  {
    id: "alps",
    index: 5,
    country: "SWITZERLAND",
    city: "The Alps",
    range: [0.475, 0.57],
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
    photoSrc: "/destinations/alps.jpg",
    galleryPhotos: [
      { src: "/destinations/alps-gallery-1.jpg", aspect: 1.791, caption: "A flower-draped Zermatt street, the Matterhorn behind" },
      { src: "/destinations/alps-gallery-2.jpg", aspect: 1.778, caption: "An alpine valley town at sunrise, sun breaking over the peaks" },
      { src: "/destinations/alps-gallery-3.jpg", aspect: 0.75, caption: "A quiet alpine street, flower balconies and gabled roofs" },
    ],
  },
  {
    id: "london",
    index: 6,
    country: "UNITED KINGDOM",
    city: "London",
    range: [0.57, 0.631],
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
    photoSrc: "/destinations/london.jpg",
    galleryPhotos: [
      { src: "/destinations/london-gallery-1.jpg", aspect: 0.75, caption: "Big Ben's clock face against a deep blue sky" },
      { src: "/destinations/london-gallery-2.jpg", aspect: 0.8, caption: "Notting Hill's pastel terraced houses" },
      { src: "/destinations/london-gallery-3.jpg", aspect: 1.449, caption: "The London Eye across the Thames" },
    ],
  },
  {
    id: "barcelona",
    index: 7,
    country: "SPAIN",
    city: "Barcelona",
    range: [0.631, 0.709],
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
      "A basilica whose towers only just topped out, after more than 140 years of building",
      "Balconies used as much as any room indoors",
    ],
    travelTip: "Visit the famous facades at opening time — the crowds triple by midday.",
    bestSeason: "May – June, or September – October",
    photoSrc: "/destinations/barcelona.jpg",
    galleryPhotos: [
      { src: "/destinations/barcelona-gallery-1.jpg", aspect: 1.0, caption: "Sagrada Família, front façade and reflecting pool" },
      { src: "/destinations/barcelona-gallery-2.jpg", aspect: 1.0, caption: "Park Güell's tiled terrace in golden light" },
      { src: "/destinations/barcelona-gallery-3.jpg", aspect: 1.778, caption: "A Gothic Quarter alley strung with red bunting" },
    ],
  },
  {
    id: "amsterdam",
    index: 8,
    country: "NETHERLANDS",
    city: "Amsterdam",
    range: [0.709, 0.787],
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
    photoSrc: "/destinations/amsterdam.jpg",
    galleryPhotos: [
      { src: "/destinations/amsterdam-gallery-1.jpg", aspect: 1.83, caption: "A row of narrow gabled canal houses in autumn light" },
      { src: "/destinations/amsterdam-gallery-2.jpg", aspect: 1.0, caption: "Bicycles along a canal bridge railing" },
      { src: "/destinations/amsterdam-gallery-3.jpg", aspect: 1.54, caption: "Amsterdam Centraal's twin-spired façade" },
    ],
  },
  {
    id: "prague",
    index: 9,
    country: "CZECH REPUBLIC",
    city: "Prague",
    range: [0.787, 0.865],
    eyebrow: "09 / CZECH REPUBLIC",
    headline: ["THE CLOCK", "NEVER", "STOPS"],
    micro: "A skyline of spires that has told the same story for six hundred years.",
    info: [
      { label: "LOCATION", value: "PRAGUE / CZECH REPUBLIC" },
      { label: "KNOWN FOR", value: "GREEN COPPER SPIRES" },
      { label: "BEST EXPERIENCED", value: "AMBER DUSK" },
    ],
    atmosphere: "amber-glow",
    sky: ["#1c170f", "#100d08"],
    accent: "#7fa88f",
    coordinates: { lat: 50.0755, lon: 14.4378 },
    pace: "medium",
    tagline: "A skyline that turned green with age, on purpose.",
    overview:
      "Prague's Gothic spires and Baroque domes were never restored back to shine — the copper roofs were left to oxidize into their now-famous patina, and the whole skyline reads as proof that time is allowed to show.",
    history:
      "Spared the leveling that reshaped so many European capitals after the wars, Prague kept its medieval street plan and skyline largely intact, layer laid on layer since the 14th century.",
    culture:
      "The astronomical clock on Old Town Hall has marked the hour the same way since 1410 — a small mechanical ritual the city still gathers to watch.",
    highlights: [
      "A 600-year-old astronomical clock that still keeps time",
      "Copper domes and spires oxidized to a permanent green",
      "A medieval street plan that survived the century intact",
    ],
    travelTip: "Cross the old stone bridge at sunrise, before the vendors and the crowds arrive.",
    bestSeason: "April – May, or September – October",
    photoSrc: "/destinations/prague.jpg",
    galleryPhotos: [
      { src: "/destinations/prague-gallery-1.jpg", aspect: 1.5, caption: "Charles Bridge, cobblestones and baroque statues" },
      { src: "/destinations/prague-gallery-2.jpg", aspect: 1.779, caption: "Malá Strana's colorful facades and church towers" },
      { src: "/destinations/prague-gallery-3.jpg", aspect: 0.668, caption: "The Prague Astronomical Clock face" },
    ],
  },
  {
    id: "iceland",
    index: 10,
    country: "ICELAND",
    city: "Iceland",
    range: [0.865, 0.967],
    eyebrow: "10 / ICELAND",
    headline: ["THE LAST", "WILD", "LIGHT"],
    micro: "A landscape still being made — glaciers, geysers, and a sky that glows on its own schedule.",
    info: [
      { label: "LOCATION", value: "ICELAND" },
      { label: "KNOWN FOR", value: "AURORA & GLACIERS" },
      { label: "BEST EXPERIENCED", value: "POLAR NIGHT" },
    ],
    atmosphere: "aurora",
    sky: ["#0a1410", "#050706"],
    accent: "#4fd1a5",
    coordinates: { lat: 64.9631, lon: -19.0208 },
    pace: "slow",
    tagline: "Where the ground still decides what to become.",
    overview:
      "Iceland sits on the seam between two tectonic plates, and it shows — glaciers grind over active volcanoes, geysers vent straight through moss-covered lava, and on a clear night the sky answers with its own color.",
    history:
      "Settled late by European standards and shaped almost entirely by geology rather than empire, Iceland's landscape has spent longer being formed than being inhabited.",
    culture:
      "Distance from anywhere else made self-reliance a habit long before it became a marketing word — small population, short summers, and a sky that runs the calendar as much as any clock.",
    highlights: [
      "Aurora borealis on clear nights through the darker months",
      "Glaciers still visibly carving the land beneath them",
      "Geothermal vents and hot springs breaking through black lava fields",
    ],
    travelTip: "Give the aurora at least three clear nights — one lucky sighting beats a rigid one-night itinerary.",
    bestSeason: "September – March for aurora, June – August for the midnight sun",
    photoSrc: "/destinations/iceland.jpg",
    galleryPhotos: [
      { src: "/destinations/iceland-gallery-1.jpg", aspect: 1.498, caption: "Reynisfjara's black-sand beach and basalt sea stacks" },
      { src: "/destinations/iceland-gallery-2.jpg", aspect: 1.51, caption: "Seljalandsfoss, a waterfall you can walk behind" },
      { src: "/destinations/iceland-gallery-3.jpg", aspect: 1.5, caption: "Seyðisfjörður's rainbow street, mountains behind" },
    ],
  },
];

/**
 * Named scroll breakpoints outside the destination chapters.
 *
 * `mapStart` was originally 0.96, giving the interactive map an ~0.8%-of-
 * scroll window (under 9vh) to fade in, hold, and fade out again — too
 * narrow to reliably land on with a mouse wheel or a swipe. It now opens
 * earlier, inside the last few vh of a chapter's dwell (Amsterdam's,
 * originally — now Iceland's, the new final chapter), giving it a full
 * ~2%-of-scroll window before `outroStart`.
 *
 * All four marks below were rescaled when Prague and Iceland extended the
 * journey from 1100vh to 1342vh (see JOURNEY_LENGTH_VH) — each keeps the
 * exact same absolute vh offset it had before (heroEnd at 88vh, descentEnd
 * at 154vh, mapStart 5.5vh before the last chapter's end, outroStart 11vh
 * after it), just expressed as a fraction of the new, longer total.
 */
export const JOURNEY_MARKS = {
  heroEnd: 0.066,
  descentEnd: 0.115,
  mapStart: 0.963,
  outroStart: 0.975,
};

export function destinationForProgress(p: number): Destination | null {
  return DESTINATIONS.find((d) => p >= d.range[0] && p < d.range[1]) ?? null;
}

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}

/**
 * Great-circle distance between two decimal-degree coordinates, in
 * kilometers (haversine formula, Earth radius 6371km). Used by the
 * /journeys route builder to show a real straight-line distance between
 * consecutive stops — not a driving/flight distance, just an honest "as
 * the crow flies" figure consistent with this site's "every value shown
 * is real data" rule (see DestinationSpecimenFrame's coordinate stamps).
 */
export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
