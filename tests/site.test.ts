import { afterEach, describe, expect, it, vi } from "vitest";

// SITE_URL is computed at module load, so each case stubs the env and
// re-imports a fresh copy of the module.
async function loadSite(url: string | undefined) {
  vi.resetModules();
  if (url === undefined) vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined as unknown as string);
  else vi.stubEnv("NEXT_PUBLIC_SITE_URL", url);
  return import("@/lib/site");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("SITE_URL", () => {
  it("falls back to the local port when unset", async () => {
    const { SITE_URL } = await loadSite(undefined);
    expect(SITE_URL).toBe("http://localhost:3001");
  });

  it("strips one or more trailing slashes", async () => {
    expect((await loadSite("https://europa.example/")).SITE_URL).toBe("https://europa.example");
    expect((await loadSite("https://europa.example///")).SITE_URL).toBe("https://europa.example");
    expect((await loadSite("https://europa.example")).SITE_URL).toBe("https://europa.example");
  });
});

describe("absoluteUrl", () => {
  it("joins paths with exactly one slash", async () => {
    const { absoluteUrl } = await loadSite("https://europa.example/");
    expect(absoluteUrl("/destinations")).toBe("https://europa.example/destinations");
    expect(absoluteUrl("destinations")).toBe("https://europa.example/destinations");
    expect(absoluteUrl("/paris/louvre.jpg")).toBe("https://europa.example/paris/louvre.jpg");
  });

  it("maps the root (and the default) to a trailing-slash origin", async () => {
    const { absoluteUrl } = await loadSite("https://europa.example");
    expect(absoluteUrl()).toBe("https://europa.example/");
    expect(absoluteUrl("/")).toBe("https://europa.example/");
    expect(absoluteUrl("")).toBe("https://europa.example/");
  });

  it("passes absolute http(s) URLs through untouched", async () => {
    const { absoluteUrl } = await loadSite("https://europa.example");
    expect(absoluteUrl("https://cdn.example/a.jpg")).toBe("https://cdn.example/a.jpg");
    expect(absoluteUrl("HTTP://cdn.example/a.jpg")).toBe("HTTP://cdn.example/a.jpg");
  });
});
