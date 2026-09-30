import { describe, expect, it } from "vitest";
import { JOURNEY_ROUTE_ORDER, routeNeighbours } from "@/lib/europeGeo";

const first = JOURNEY_ROUTE_ORDER[0];
const last = JOURNEY_ROUTE_ORDER[JOURNEY_ROUTE_ORDER.length - 1];

describe("routeNeighbours (detail page 'Next stop' / 'Next destination')", () => {
  it.each(JOURNEY_ROUTE_ORDER.map((id, i) => [id, i] as const))("%s follows JOURNEY_ROUTE_ORDER", (id, i) => {
    const r = routeNeighbours(id);
    expect(r.routeIndex).toBe(i);
    expect(r.nextWrapped).toBe(JOURNEY_ROUTE_ORDER[(i + 1) % JOURNEY_ROUTE_ORDER.length]);
    expect(r.prev).toBe(i > 0 ? JOURNEY_ROUTE_ORDER[i - 1] : null);
    // The two "next" links agree everywhere except the final stop.
    if (i < JOURNEY_ROUTE_ORDER.length - 1) expect(r.next).toBe(r.nextWrapped);
  });

  it("'Next destination' wraps from the last stop to the first", () => {
    expect(routeNeighbours(last).nextWrapped).toBe(first);
  });

  it("'Next stop' ends the tour at the last stop instead of wrapping", () => {
    expect(routeNeighbours(last).next).toBeNull();
  });

  it("the first stop has no previous stop", () => {
    expect(routeNeighbours(first).prev).toBeNull();
  });

  it("walking nextWrapped visits every stop once and returns to the start", () => {
    const seen = [first];
    let cur = routeNeighbours(first).nextWrapped;
    while (cur !== first && seen.length <= JOURNEY_ROUTE_ORDER.length) {
      seen.push(cur);
      cur = routeNeighbours(cur).nextWrapped;
    }
    expect(seen).toEqual([...JOURNEY_ROUTE_ORDER]);
  });
});
