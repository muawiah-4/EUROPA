# CLAUDE.md — EUROPA concept travel site

Scroll-driven concept travel site ("Europe, Beyond the Postcard") for ten European
destinations: WebGL globe home, destinations, per-destination pages, a route builder
(`/journeys`), experiences, about, and a `/paris` deep-dive. Design/motion showcase —
not a booking platform.

## Brand / IP rules
- Unofficial concept; not affiliated with any destination, tourism board or brand.
  No "official" claims, no invented bookings, prices or availability presented as real.
- No invented quotes, reviews or attributions. No real people without a concrete reason.
- Photography is Unsplash/Pexels under their licences, used for a non-commercial demo;
  keep README credits (incl. the Stripe/minigl attribution in `GradientWave.tsx`).
- Geography is real: coordinates/routes come from `lib/europeGeo.ts`. The globe's
  markers in `components/three/GlobeHero.tsx` are a hand-synced copy — update both.

## Stack
Next.js 15.5 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3.4 ·
Framer Motion 11 · three 0.169 + @react-three/fiber 9 + drei 10 · Vitest 4 ·
ESLint 8 (next lint). Node per `.nvmrc` (22).

## Commands
```bash
npm run dev          # :3001
npm run build
npm start            # :3001
npm run typecheck    # tsc --noEmit
npm run lint         # next lint (also lints tests/)
npm test             # vitest run (tests/, node env)
```

## Quality gate before every commit
`npm run typecheck && npm run lint && npm test && npm run build` — all must pass
(CI in `.github/workflows/ci.yml` runs the same four). Stage specific files only.

## Machine
8 GB RAM. Never run two `next build`s (or build + dev) at once, including across
the sibling PRX repo. Prefer tsc/lint/test for quick checks.

## Design system
- Monochrome: surfaces `void → panel → elevated`, text `bone / mist / smoke`
  (RGB-channel tokens in `app/globals.css`, wired via `tailwind.config.ts` so
  `/NN` opacity modifiers work — keep the channel format).
- Exactly one site accent: `mint` (#3bba9c), used sparingly.
- Per-destination colours only when that single destination is on screen (its
  card or page) — never several destination hues together as ambient decoration.
- Serif display type; monospace reserved as the UI voice (labels, coords, data).

## Accessibility
- Text contrast ≥ 4.5:1 on its actual surface (`smoke` fails on `elevated`; use
  `mist/80` there).
- `MotionProvider` wraps the app in `MotionConfig reducedMotion="user"`; canvas,
  WebGL and pointer effects must also honour prefers-reduced-motion themselves.
- Exactly one `<h1>` per page; decorative text (GhostHeading) stays `aria-hidden`.

## Performance
- Pause offscreen loops (IntersectionObserver / visibility) — rAF, particles,
  gradient canvases must not run when not visible.
- R3F canvases gate `frameloop` on visibility (`"always"` ↔ `"never"`).
- On unmount release GPU contexts (`WEBGL_lose_context().loseContext()`).
- Every R3F `<Canvas>` sits inside `WebGLErrorBoundary` with a static fallback.

## Security
- CSP and security headers live in `next.config.mjs`, `'self'`-only. Adding any
  external origin requires updating the CSP there. `images.remotePatterns` stays empty.
- Treat URL params and any storage as untrusted: parse/validate with a fallback
  (e.g. `?stops=` via `lib/routeStops.ts`).
- JSON-LD only through `components/JsonLd.tsx`, which escapes `<`.

## Mirrored components
`components/MagneticButton.tsx`, `components/GhostHeading.tsx` and
`components/MotionProvider.tsx` are byte-identical copies of the same files in the
PRX repo (`workable-fortnight`). Edit both together (`cmp` them) — no shared package.
MagneticButton: `maxOffsetPx` (px at edge, default 7) XOR `pullRatio` (0–1; this
repo uses 0.35). GhostHeading here passes `strokeColor="rgb(var(--bone) / 0.08)"`.
