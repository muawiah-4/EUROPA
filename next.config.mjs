import path from "node:path";
import { fileURLToPath } from "node:url";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Origin of the opt-in Umami script, or null when analytics is disabled.
 * Mirrors the validation in lib/analytics.ts (this file is plain ESM and
 * can't import TS): a UUID website id, and an https:// script URL (or
 * http://localhost for a self-hosted dev instance).
 */
function analyticsOrigin() {
  const id = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  try {
    const url = new URL(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim() || "https://cloud.umami.is/script.js");
    if (url.protocol === "https:") return url.origin;
    if (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return url.origin;
  } catch {
    // invalid URL → disabled
  }
  return null;
}
const umamiOrigin = analyticsOrigin();
const umamiScriptSrc = umamiOrigin ? ` ${umamiOrigin}` : "";
// Umami Cloud's tracker loads from cloud.umami.is but beacons to gateway.umami.is.
const umamiConnectSrc = !umamiOrigin
  ? ""
  : umamiOrigin === "https://cloud.umami.is"
    ? ` ${umamiOrigin} https://gateway.umami.is`
    : ` ${umamiOrigin}`;

// Every runtime asset (images, textures, fonts) is self-hosted under /public,
// so the policy is 'self'-only — apart from the opt-in Umami analytics
// origins, added only when analytics is enabled. 'unsafe-inline' on script-src covers Next's
// inline bootstrap (no nonce middleware on this static site); 'unsafe-eval'
// and the HMR websocket are dev-only. worker-src blob: leaves room for
// three/drei helpers that spawn blob workers. No upgrade-insecure-requests:
// the site is served over plain http on localhost:3001.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${umamiScriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}${umamiConnectSrc}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lint the test suite too (next lint skips tests/ by default).
  eslint: { dirs: ["app", "components", "lib", "tests"] },
  // next/image is used with local /public images only — keep the optimizer,
  // but never allow remote sources.
  images: { remotePatterns: [] },
  // Pin the tracing root to this project so Next doesn't infer a parent
  // directory when a stray lockfile exists higher up the tree.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
