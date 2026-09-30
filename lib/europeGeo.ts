/**
 * Real-geography backing for the site's two map surfaces
 * (components/DestinationsMap.tsx and components/JourneyRouteBuilder.tsx).
 * Replaces the old hand-placed "artistic constellation" coordinates with
 * an actual equirectangular projection of each destination's real
 * lat/lon (from lib/journey.ts), plus a landmass point-cloud sampled from
 * the same silhouette components/three/GlobeHero.tsx uses on the 3D globe
 * — so the flat map and the globe agree on what Europe looks like.
 */

import type { DestinationId } from "@/lib/journey";

// Europe's very rough lat/long bounding shape, sampled as a loose point
// cloud rather than a traced coastline — enough to read as "a continent"
// without importing real geo/GeoJSON data. Shared with GlobeHero's 3D
// point cloud so both surfaces draw the same silhouette.
export const EUROPE_POINTS: [number, number][] = [
  [36, -9], [37, -3], [39, 3], [41, 9], [43, 13], [45, 12], [44, 8], [46, 6],
  [47, 8], [48, 11], [50, 8], [52, 4], [51, -1], [53, -3], [55, -3], [57, 8],
  [59, 11], [60, 18], [58, 24], [55, 24], [53, 20], [50, 19], [48, 22], [46, 25],
  [44, 26], [42, 21], [40, 23], [38, 21], [37, 15], [40, 15], [42, 12], [43, 10],
  [45, 15], [45, 19], [47, 21], [49, 14], [50, 16], [52, 13], [54, 15], [55, 10],
  [56, 12], [58, 14], [60, 24], [61, 21], [63, 21], [65, 17],
];

// Bounding box the projection is calibrated to — wide enough to hold
// Iceland in the northwest corner without distorting the rest of the
// continent's relative shape.
const LON_MIN = -25;
const LON_MAX = 33;
const LAT_MIN = 34;
const LAT_MAX = 67;

// A plain equirectangular projection (x = lon, y = -lat) stretches Europe
// noticeably at this latitude, since a degree of longitude covers less
// real ground than a degree of latitude the further north you go. A
// single cosine correction at Europe's mid-latitude keeps x/y in the same
// real-world scale without needing a full map-projection library — close
// enough for an honest "same relative shape and distances" map, not a
// survey-grade one.
const REF_LAT_RAD = (50 * Math.PI) / 180;
const LON_SCALE = Math.cos(REF_LAT_RAD);

/** SVG viewBox size this projection naturally produces — use verbatim as `viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}"`. */
export const MAP_WIDTH = (LON_MAX - LON_MIN) * LON_SCALE;
export const MAP_HEIGHT = LAT_MAX - LAT_MIN;

/** Equirectangular-with-cosine-correction projection into the MAP_WIDTH x MAP_HEIGHT box above. */
export function projectLatLon(lat: number, lon: number): { x: number; y: number } {
  const x = (lon - LON_MIN) * LON_SCALE;
  const y = LAT_MAX - lat;
  return { x, y };
}

// The Grand Tour's real travel order — a geographically continuous sweep
// (no criss-crossing back over already-covered ground) rather than the
// site's narrative/scroll order in lib/journey.ts, which is sequenced for
// pacing and mood, not physical geography. Iceland stays the closing
// flight, same as the main journey's own framing of it as "the edge of
// the map."
export const JOURNEY_ROUTE_ORDER: readonly DestinationId[] = [
  "london",
  "paris",
  "amsterdam",
  "prague",
  "alps",
  "venice",
  "rome",
  "santorini",
  "barcelona",
  "iceland",
];

// Recommended dwell, in days — an editorial judgment call loosely following
// each destination's own `pace` field (slow/medium/brisk maps to roughly
// 3/2/2 days), not a scraped average.
export const STAY_DURATIONS: Record<DestinationId, number> = {
  london: 2,
  paris: 3,
  amsterdam: 2,
  prague: 2,
  alps: 3,
  venice: 3,
  rome: 3,
  santorini: 2,
  barcelona: 2,
  iceland: 3,
};

export type TravelMode = "train" | "flight";
export type TravelEstimate = { hours: number; mode: TravelMode };

// Not a routing API — an editorial judgment call on how long each leg
// plausibly takes door-to-door, the same spirit as STAY_DURATIONS above.
// Both options are costed for every leg and the faster one wins: a
// train/car hop at a realistic average of 90km/h (well under highway top
// speed once stations, transfers and border crossings are counted), or a
// flight at a 750km/h cruise plus a flat 2.5-hour overhead on *each* end
// (check-in, security, boarding, deplaning, baggage) — which is why even a
// relatively short "as the crow flies" hop still costs a half-day once
// you're flying it. Picking the minimum (rather than a fixed distance
// cutoff) keeps the estimate monotonic: a longer leg never shows a shorter
// time than a shorter one. The two break even at roughly 510km.
const TRAIN_SPEED_KMH = 90;
const FLIGHT_CRUISE_KMH = 750;
const FLIGHT_OVERHEAD_HOURS_PER_END = 2.5;

export function estimateTravelTime(km: number): TravelEstimate {
  const trainHours = km / TRAIN_SPEED_KMH;
  const flightHours = km / FLIGHT_CRUISE_KMH + FLIGHT_OVERHEAD_HOURS_PER_END * 2;
  return trainHours <= flightHours
    ? { hours: trainHours, mode: "train" }
    : { hours: flightHours, mode: "flight" };
}

/**
 * A destination's neighbours along JOURNEY_ROUTE_ORDER, for the detail
 * page's cross-links. `next` is the "Next stop" on the Grand Tour leg card
 * and is null at the final stop ("Journey's end"); `nextWrapped` is the foot
 * of page "Next destination" link, which wraps from the last stop back to
 * the first. For every stop but the last the two are the same id.
 */
export function routeNeighbours(id: DestinationId): {
  routeIndex: number;
  prev: DestinationId | null;
  next: DestinationId | null;
  nextWrapped: DestinationId;
} {
  const routeIndex = JOURNEY_ROUTE_ORDER.indexOf(id);
  const last = JOURNEY_ROUTE_ORDER.length - 1;
  return {
    routeIndex,
    prev: routeIndex > 0 ? JOURNEY_ROUTE_ORDER[routeIndex - 1] : null,
    next: routeIndex >= 0 && routeIndex < last ? JOURNEY_ROUTE_ORDER[routeIndex + 1] : null,
    nextWrapped: JOURNEY_ROUTE_ORDER[(routeIndex + 1) % JOURNEY_ROUTE_ORDER.length],
  };
}
