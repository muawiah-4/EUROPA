import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PARIS_LANDMARKS, PARIS_NEIGHBORHOODS } from "@/lib/parisExperience";

const items = [...PARIS_LANDMARKS, ...PARIS_NEIGHBORHOODS];

describe("parisExperience photos", () => {
  it("every referenced photo exists under public/", () => {
    const missing = items.map((i) => i.photo).filter((src) => !existsSync(join(__dirname, "..", "public", src)));
    expect(missing).toEqual([]);
  });

  it("aspect values are positive and finite", () => {
    for (const i of items) expect(Number.isFinite(i.aspect) && i.aspect > 0, i.id).toBe(true);
  });
});
