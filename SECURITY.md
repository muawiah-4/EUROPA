# Security

This is a static concept site. It has no backend, no accounts, no API routes,
no server actions and no forms, and it doesn't use browser storage. The only
user input it reads is the `?stops=` query on `/journeys`.

## Reporting a vulnerability

Please use GitHub's **private vulnerability reporting**: go to the
[Security tab](https://github.com/muawiah-4/EUROPA/security) and choose
**Report a vulnerability**. Please don't open a public issue for security
problems.

## What's in place

- **Content-Security-Policy** (`next.config.mjs`): `default-src 'self'`.
  No external origins are allowed unless the optional Umami analytics is
  enabled, which adds only its own origin. Every image and Three.js texture is
  served from `/public`. Also set: `worker-src 'self' blob:`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` and
  `frame-ancestors 'none'`.
- **Other headers:**
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - a restrictive `Permissions-Policy`
  - `X-Frame-Options: DENY`
  - HSTS
  - `Cross-Origin-Opener-Policy: same-origin`
  - `X-Powered-By` is removed.
- **Images:** the `next/image` optimizer serves local files only
  (`remotePatterns: []`).
- **URL input:** `?stops=` is checked against the `DESTINATION_IDS`
  allow-list. Duplicates are dropped, it's capped at 10 stops, and the raw
  value is never rendered. Unknown `/destinations/[id]` values return a 404.
- **JSON-LD:** escaped (`<` → `<`), and built only from static data.
- **Error pages:** they never show error messages or stack traces to visitors.
- **Dependencies:** `npm audit --omit=dev` is clean. PostCSS is pinned to a
  patched version through `overrides`. CI runs typecheck, lint, tests and
  build on every PR.

## Known trade-off: `'unsafe-inline'` scripts

`script-src` allows `'unsafe-inline'` because Next.js injects inline bootstrap
scripts into statically generated pages. Removing it would need a per-request
nonce (middleware). That would make every page server-rendered on each
request, so the site could no longer be served as static HTML.

The residual risk is low:

- No user-generated content is ever rendered.
- No external script origins are allowed.
- The only `dangerouslySetInnerHTML` is the escaped, static JSON-LD.

Revisit this if the site ever renders user input or third-party content.
