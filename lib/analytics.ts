/**
 * Opt-in, cookieless analytics via Umami (https://umami.is).
 *
 * Completely off unless NEXT_PUBLIC_UMAMI_WEBSITE_ID is set to a valid UUID:
 * no script is rendered, the CSP is unchanged (see next.config.mjs, which
 * duplicates this validation), and track() is a no-op.
 *
 * Event payloads must never carry personal data or free text — only ids,
 * enums and small numbers.
 */

export const DEFAULT_UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

/**
 * Umami Cloud serves the tracker from cloud.umami.is but its beacons POST to
 * gateway.umami.is/api/send, so connect-src needs both. Self-hosted trackers
 * send to their own origin.
 */
const UMAMI_CLOUD_ORIGIN = "https://cloud.umami.is";
const UMAMI_CLOUD_COLLECT_ORIGIN = "https://gateway.umami.is";

export type AnalyticsValue = string | number | boolean;
export type AnalyticsData = Record<string, AnalyticsValue>;

export interface AnalyticsConfig {
  websiteId: string;
  scriptUrl: string;
  /** Script origin, added to script-src in the CSP. */
  origin: string;
  /** Origins the tracker sends beacons to, added to connect-src in the CSP. */
  connectOrigins: string[];
  /** Hostname for data-domains, or null to let Umami track any host. */
  domain: string | null;
}

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: AnalyticsData) => void;
    };
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function parseScriptUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol === "https:") return url;
    // Plain http is only acceptable for a self-hosted Umami on this machine.
    if (url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname)) return url;
    return null;
  } catch {
    return null;
  }
}

function hostnameOf(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    return new URL(raw).hostname || null;
  } catch {
    return null;
  }
}

/** Pure resolver so the validation can be unit-tested without module reloads. */
export function resolveAnalyticsConfig(env: {
  websiteId?: string;
  scriptUrl?: string;
  siteUrl?: string;
}): AnalyticsConfig | null {
  const websiteId = env.websiteId?.trim();
  if (!websiteId || !UUID_RE.test(websiteId)) return null;

  const url = parseScriptUrl(env.scriptUrl?.trim() || DEFAULT_UMAMI_SCRIPT_URL);
  if (!url) return null;

  return {
    websiteId,
    scriptUrl: url.href,
    origin: url.origin,
    connectOrigins:
      url.origin === UMAMI_CLOUD_ORIGIN ? [url.origin, UMAMI_CLOUD_COLLECT_ORIGIN] : [url.origin],
    domain: hostnameOf(env.siteUrl?.trim()),
  };
}

// Literal `process.env.NEXT_PUBLIC_*` reads so Next inlines them in the client bundle.
export const analyticsConfig: AnalyticsConfig | null = resolveAnalyticsConfig({
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  scriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
});

/**
 * Send a custom event. No-ops on the server, when analytics is disabled,
 * when the tracker hasn't loaded (or was blocked / DNT), and never throws.
 */
export function track(event: string, data?: AnalyticsData): void {
  if (!analyticsConfig || typeof window === "undefined") return;
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics must never break the page.
  }
}
