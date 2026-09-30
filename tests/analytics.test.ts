import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_UMAMI_SCRIPT_URL, resolveAnalyticsConfig } from "@/lib/analytics";

const ID = "3f1c2a9e-7b4d-4e8a-9c21-5d6e7f809a1b";

// analyticsConfig is computed at import time from the env, so each case re-imports the module.
async function loadAnalytics(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const key of ["NEXT_PUBLIC_UMAMI_WEBSITE_ID", "NEXT_PUBLIC_UMAMI_SCRIPT_URL", "NEXT_PUBLIC_SITE_URL"]) {
    vi.stubEnv(key, env[key] as string);
  }
  return import("@/lib/analytics");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("analyticsConfig", () => {
  it("is disabled by default", async () => {
    const { analyticsConfig } = await loadAnalytics({});
    expect(analyticsConfig).toBeNull();
  });

  it("is enabled with a valid website id and defaults to Umami Cloud", async () => {
    const { analyticsConfig } = await loadAnalytics({ NEXT_PUBLIC_UMAMI_WEBSITE_ID: ID });
    expect(analyticsConfig).toEqual({
      websiteId: ID,
      scriptUrl: DEFAULT_UMAMI_SCRIPT_URL,
      origin: "https://cloud.umami.is",
      connectOrigins: ["https://cloud.umami.is", "https://gateway.umami.is"],
      domain: null,
    });
  });

  it("uses NEXT_PUBLIC_SITE_URL's hostname for data-domains", async () => {
    const { analyticsConfig } = await loadAnalytics({
      NEXT_PUBLIC_UMAMI_WEBSITE_ID: ID,
      NEXT_PUBLIC_SITE_URL: "https://europa.example/",
    });
    expect(analyticsConfig?.domain).toBe("europa.example");
  });
});

describe("resolveAnalyticsConfig", () => {
  it.each(["", "   ", "not-a-uuid", "3f1c2a9e7b4d4e8a9c215d6e7f809a1b", `${ID}x`])(
    "is disabled for website id %j",
    (websiteId) => {
      expect(resolveAnalyticsConfig({ websiteId })).toBeNull();
    }
  );

  it.each([
    "http://umami.example/script.js",
    "javascript:alert(1)",
    "ftp://umami.example/script.js",
    "//umami.example/script.js",
    "not a url",
  ])("is disabled for script URL %j", (scriptUrl) => {
    expect(resolveAnalyticsConfig({ websiteId: ID, scriptUrl })).toBeNull();
  });

  it("accepts a self-hosted https script and only connects to its origin", () => {
    const config = resolveAnalyticsConfig({ websiteId: ID, scriptUrl: "https://stats.example/u.js" });
    expect(config?.origin).toBe("https://stats.example");
    expect(config?.connectOrigins).toEqual(["https://stats.example"]);
  });

  it.each(["http://localhost:3002/script.js", "http://127.0.0.1:3002/script.js"])(
    "accepts local http for self-hosted dev: %s",
    (scriptUrl) => {
      expect(resolveAnalyticsConfig({ websiteId: ID, scriptUrl })?.scriptUrl).toBe(scriptUrl);
    }
  );

  it("ignores an unparseable site URL rather than disabling", () => {
    expect(resolveAnalyticsConfig({ websiteId: ID, siteUrl: "nope" })?.domain).toBeNull();
  });
});

describe("track", () => {
  it("does not call umami when disabled", async () => {
    const { track } = await loadAnalytics({});
    const spy = vi.fn();
    vi.stubGlobal("window", { umami: { track: spy } });
    track("route_stop_added", { destination: "paris" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("no-ops server-side (no window) when enabled", async () => {
    const { track } = await loadAnalytics({ NEXT_PUBLIC_UMAMI_WEBSITE_ID: ID });
    expect(typeof window).toBe("undefined");
    expect(() => track("route_copy_link")).not.toThrow();
  });

  it("no-ops when the tracker hasn't loaded", async () => {
    const { track } = await loadAnalytics({ NEXT_PUBLIC_UMAMI_WEBSITE_ID: ID });
    vi.stubGlobal("window", {});
    expect(() => track("route_copy_link")).not.toThrow();
  });

  it("swallows errors thrown by the tracker", async () => {
    const { track } = await loadAnalytics({ NEXT_PUBLIC_UMAMI_WEBSITE_ID: ID });
    vi.stubGlobal("window", {
      umami: {
        track: () => {
          throw new Error("blocked");
        },
      },
    });
    expect(() => track("route_copy_link")).not.toThrow();
  });

  it("forwards the event and data when enabled", async () => {
    const { track } = await loadAnalytics({ NEXT_PUBLIC_UMAMI_WEBSITE_ID: ID });
    const spy = vi.fn();
    vi.stubGlobal("window", { umami: { track: spy } });
    track("journey_chapter_reached", { destination: "paris", chapter: 2 });
    expect(spy).toHaveBeenCalledWith("journey_chapter_reached", { destination: "paris", chapter: 2 });
  });
});
