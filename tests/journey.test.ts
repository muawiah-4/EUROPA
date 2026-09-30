import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DESTINATIONS,
  DESTINATION_IDS,
  getDestination,
  getDestinationById,
} from "@/lib/journey";
import { JOURNEY_ROUTE_ORDER, STAY_DURATIONS } from "@/lib/europeGeo";

const ROOT = join(__dirname, "..");
const publicFile = (src: string) => join(ROOT, "public", src);

describe("destination ids", () => {
  it("DESTINATION_IDS are unique", () => {
    expect(new Set(DESTINATION_IDS).size).toBe(DESTINATION_IDS.length);
  });

  it("every id has exactly one DESTINATIONS entry, and vice versa", () => {
    expect(DESTINATIONS.map((d) => d.id).sort()).toEqual([...DESTINATION_IDS].sort());
  });

  it("JOURNEY_ROUTE_ORDER is a permutation of the ids", () => {
    expect(JOURNEY_ROUTE_ORDER).toHaveLength(DESTINATION_IDS.length);
    expect([...JOURNEY_ROUTE_ORDER].sort()).toEqual([...DESTINATION_IDS].sort());
  });

  it("STAY_DURATIONS covers every id with a positive whole number of days", () => {
    expect(Object.keys(STAY_DURATIONS).sort()).toEqual([...DESTINATION_IDS].sort());
    for (const days of Object.values(STAY_DURATIONS)) {
      expect(Number.isInteger(days) && days > 0).toBe(true);
    }
  });

  // KINETIC_WORDMARKS lives in a server page that imports React components,
  // so it's checked at source level rather than imported.
  it("KINETIC_WORDMARKS maps every id to its own distinct component", () => {
    const src = readFileSync(join(ROOT, "app/destinations/[id]/page.tsx"), "utf8");
    const block = src.match(/const KINETIC_WORDMARKS[^=]*=\s*\{([\s\S]*?)\};/);
    expect(block).not.toBeNull();
    const entries = [...block![1].matchAll(/^\s*([a-z]+):\s*(\w+),?\s*$/gm)].map((m) => [m[1], m[2]]);
    expect(entries.map(([id]) => id).sort()).toEqual([...DESTINATION_IDS].sort());
    expect(new Set(entries.map(([, c]) => c)).size).toBe(entries.length);
  });
});

describe("lookups", () => {
  it("getDestination returns the matching entry for every id", () => {
    for (const id of DESTINATION_IDS) expect(getDestination(id).id).toBe(id);
  });

  it("getDestinationById handles untrusted strings", () => {
    expect(getDestinationById("rome")?.city).toBe("Rome");
    expect(getDestinationById("atlantis")).toBeUndefined();
    expect(getDestinationById("")).toBeUndefined();
    expect(getDestinationById("Rome")).toBeUndefined();
    expect(getDestinationById("__proto__")).toBeUndefined();
    expect(getDestinationById("toString")).toBeUndefined();
  });
});

describe("destination data", () => {
  it.each(DESTINATIONS.map((d) => [d.id, d] as const))("%s: coordinates are within Europe-ish bounds", (_, d) => {
    expect(d.coordinates.lat).toBeGreaterThanOrEqual(34);
    expect(d.coordinates.lat).toBeLessThanOrEqual(67);
    expect(d.coordinates.lon).toBeGreaterThanOrEqual(-25);
    expect(d.coordinates.lon).toBeLessThanOrEqual(33);
  });

  it.each(DESTINATIONS.map((d) => [d.id, d] as const))("%s: gallery aspects are positive and finite", (_, d) => {
    for (const p of d.galleryPhotos ?? []) {
      expect(Number.isFinite(p.aspect) && p.aspect > 0, p.src).toBe(true);
    }
  });

  it.each(DESTINATIONS.map((d) => [d.id, d] as const))("%s: every referenced photo exists under public/", (_, d) => {
    const srcs = [d.photoSrc, ...(d.galleryPhotos ?? []).map((p) => p.src)].filter((s): s is string => !!s);
    const missing = srcs.filter((s) => !existsSync(publicFile(s)));
    expect(missing).toEqual([]);
  });
});
