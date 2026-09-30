/**
 * Shareable route URL for the /journeys builder: /journeys?stops=london,paris,rome.
 * Pure parse/serialize helpers, kept out of components/JourneyRouteBuilder.tsx
 * so they can be unit tested.
 */

import { DESTINATION_IDS, type DestinationId } from "@/lib/journey";
import { JOURNEY_ROUTE_ORDER } from "@/lib/europeGeo";

export const STOPS_PARAM = "stops";

// The query is untrusted input: anything that isn't a known DestinationId is
// dropped, duplicates collapse, and the list is capped at the number of
// destinations the builder can show (every stop at most once).
const VALID_STOPS = new Set<string>(DESTINATION_IDS);
export const MAX_STOPS = DESTINATION_IDS.length;

export function parseStops(raw: string | null): DestinationId[] {
  if (!raw) return [];
  const out: DestinationId[] = [];
  for (const part of raw.split(",")) {
    const id = part.trim().toLowerCase();
    if (VALID_STOPS.has(id) && !out.includes(id as DestinationId)) out.push(id as DestinationId);
    if (out.length >= MAX_STOPS) break;
  }
  return out;
}

// Ids are plain lowercase ASCII, so the comma list is written unencoded —
// URLSearchParams would turn every comma into %2C and make the link ugly.
export function stopsQuery(ids: readonly DestinationId[]): string {
  return ids.length > 0 ? `?${STOPS_PARAM}=${ids.join(",")}` : "";
}

/**
 * The selected stops in real geographic order (JOURNEY_ROUTE_ORDER), however
 * they were picked — so the same set of cities always draws the same line and
 * produces the same link.
 */
export function toRouteOrder(selected: Iterable<DestinationId>): DestinationId[] {
  const set = new Set(selected);
  return JOURNEY_ROUTE_ORDER.filter((id) => set.has(id));
}
