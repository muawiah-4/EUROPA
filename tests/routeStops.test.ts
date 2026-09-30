import { describe, expect, it } from "vitest";
import { DESTINATION_IDS } from "@/lib/journey";
import { JOURNEY_ROUTE_ORDER } from "@/lib/europeGeo";
import { MAX_STOPS, STOPS_PARAM, parseStops, stopsQuery, toRouteOrder } from "@/lib/routeStops";

/** What the builder does with a URL: read ?stops=, then render in route order. */
const fromUrl = (search: string) => toRouteOrder(parseStops(new URLSearchParams(search).get(STOPS_PARAM)));

describe("parseStops", () => {
  it("returns [] for a missing or empty param", () => {
    expect(parseStops(null)).toEqual([]);
    expect(parseStops("")).toEqual([]);
    expect(parseStops(",,,")).toEqual([]);
    expect(fromUrl("")).toEqual([]);
    expect(fromUrl("?other=1")).toEqual([]);
  });

  it("keeps known ids in the given order", () => {
    expect(parseStops("rome,london,paris")).toEqual(["rome", "london", "paris"]);
  });

  it("drops unknown ids", () => {
    expect(parseStops("london,atlantis,paris,constructor,__proto__")).toEqual(["london", "paris"]);
  });

  it("drops duplicates, including case/whitespace variants", () => {
    expect(parseStops("paris,paris, PARIS ,rome,Paris")).toEqual(["paris", "rome"]);
  });

  it("drops script/markup payloads", () => {
    expect(parseStops("<script>alert(1)</script>")).toEqual([]);
    expect(parseStops("london,<script>alert(1)</script>,rome")).toEqual(["london", "rome"]);
    expect(fromUrl("?stops=%3Cscript%3Ealert(1)%3C%2Fscript%3E,paris")).toEqual(["paris"]);
  });

  it("caps the list at the number of destinations", () => {
    expect(MAX_STOPS).toBe(10);
    const flood = Array.from({ length: 50 }, (_, i) => DESTINATION_IDS[i % DESTINATION_IDS.length]).join(",");
    const parsed = parseStops(flood);
    expect(parsed).toHaveLength(10);
    expect(new Set(parsed).size).toBe(10);
  });

  it("stops reading once the cap is reached", () => {
    const all = [...DESTINATION_IDS, "junk", ...DESTINATION_IDS].join(",");
    expect(parseStops(all)).toEqual([...DESTINATION_IDS]);
  });
});

describe("stopsQuery", () => {
  it("is empty for no stops", () => {
    expect(stopsQuery([])).toBe("");
  });

  it("writes an unencoded comma list", () => {
    expect(stopsQuery(["london", "paris"])).toBe("?stops=london,paris");
  });
});

describe("round trip", () => {
  it("toRouteOrder sorts into JOURNEY_ROUTE_ORDER regardless of pick order", () => {
    expect(toRouteOrder(["iceland", "rome", "london", "paris"])).toEqual(["london", "paris", "rome", "iceland"]);
    expect(toRouteOrder(new Set(JOURNEY_ROUTE_ORDER.slice().reverse()))).toEqual([...JOURNEY_ROUTE_ORDER]);
  });

  it("serialize → parse is stable and in geographic order", () => {
    const inputs = [
      "rome,london",
      "iceland,barcelona,santorini,rome,venice,alps,prague,amsterdam,paris,london",
      "venice,junk,venice,paris",
      "prague",
    ];
    for (const raw of inputs) {
      const first = toRouteOrder(parseStops(raw));
      const query = stopsQuery(first);
      const second = fromUrl(query);
      expect(second).toEqual(first);
      expect(stopsQuery(second)).toBe(query);
      const idx = second.map((id) => JOURNEY_ROUTE_ORDER.indexOf(id));
      expect(idx).toEqual([...idx].sort((a, b) => a - b));
    }
  });
});
