import { describe, expect, it } from "vitest";
import { estimateTravelTime } from "@/lib/europeGeo";
import { getDestination, haversineKm } from "@/lib/journey";

const LONDON = { lat: 51.5074, lon: -0.1278 };
const PARIS = { lat: 48.8566, lon: 2.3522 };

describe("haversineKm", () => {
  it("London–Paris is about 344 km", () => {
    expect(haversineKm(LONDON, PARIS)).toBeGreaterThan(339);
    expect(haversineKm(LONDON, PARIS)).toBeLessThan(349);
  });

  it("Rome–Barcelona is about 860 km", () => {
    const km = haversineKm(getDestination("rome").coordinates, getDestination("barcelona").coordinates);
    expect(km).toBeGreaterThan(850);
    expect(km).toBeLessThan(870);
  });

  it("is zero for the same point and symmetric", () => {
    expect(haversineKm(PARIS, PARIS)).toBe(0);
    expect(haversineKm(LONDON, PARIS)).toBeCloseTo(haversineKm(PARIS, LONDON), 9);
  });
});

describe("estimateTravelTime", () => {
  it("takes the train on short legs, with train-speed hours", () => {
    expect(estimateTravelTime(180)).toEqual({ hours: 2, mode: "train" });
  });

  it("flies on long legs, with cruise time plus 5 h overhead", () => {
    const t = estimateTravelTime(1500);
    expect(t.mode).toBe("flight");
    expect(t.hours).toBeCloseTo(1500 / 750 + 5, 9);
  });

  it("always returns the faster of the two options, labelled with its mode", () => {
    for (let km = 0; km <= 3000; km += 25) {
      const train = km / 90;
      const flight = km / 750 + 5;
      const t = estimateTravelTime(km);
      expect(t.hours).toBeCloseTo(Math.min(train, flight), 9);
      expect(t.mode).toBe(train <= flight ? "train" : "flight");
    }
  });

  it("is monotonic: a longer leg never shows a shorter time (50–3000 km)", () => {
    let prev = estimateTravelTime(50).hours;
    for (let km = 51; km <= 3000; km += 1) {
      const hours = estimateTravelTime(km).hours;
      expect(hours, `${km} km`).toBeGreaterThanOrEqual(prev);
      prev = hours;
    }
  });

  // Regression: with the old fixed distance cutoff, Prague→Alps (614 km)
  // showed 5.8 h while the shorter Prague→Venice (539 km) showed 5.99 h.
  // Distances are rounded exactly as the UI rounds them before estimating.
  describe("Prague legs (old non-monotonic bug)", () => {
    const prague = getDestination("prague").coordinates;
    const toAlps = Math.round(haversineKm(prague, getDestination("alps").coordinates));
    const toVenice = Math.round(haversineKm(prague, getDestination("venice").coordinates));

    it("uses the real coordinates from lib/journey.ts", () => {
      expect(toAlps).toBeGreaterThan(609);
      expect(toAlps).toBeLessThan(619);
      expect(toVenice).toBeGreaterThan(534);
      expect(toVenice).toBeLessThan(544);
    });

    it("the longer Prague→Alps leg is not faster than Prague→Venice", () => {
      expect(estimateTravelTime(toAlps).hours).toBeGreaterThanOrEqual(estimateTravelTime(toVenice).hours);
    });
  });
});
