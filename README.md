# EUROPA — Europe, Beyond the Postcard

A scroll-driven concept travel site exploring ten European destinations — Paris, Rome, Santorini, Venice, The Alps, London, Barcelona, Amsterdam, Prague, and Iceland. It isn't a booking platform or affiliated with any destination shown; it's a design and motion showcase built to see how far mood, restraint, and rhythm can carry a screen. Ten places. One goes deeper: every destination is shown through real photography graded toward its own palette, and Paris alone gets a standalone deep-dive at `/paris`.

Built with Next.js 15 (App Router) on React 19, TypeScript, Tailwind CSS, Framer Motion, and Three.js (via React Three Fiber 9 + Drei 10) for the opening 3D globe and the `/paris` scene.

## Pages

- **`/`** — Home. A custom-shaded WebGL globe with every destination marked at its real coordinates, into a scroll-driven story sequence.
- **`/destinations`** — All ten destinations: an "Icons of Europe" grid of defining landmarks, and a horizontal swipeable carousel of destination cards.
- **`/destinations/[id]`** — Per-destination detail page: graded photo hero with the city's kinetic wordmark, real-coordinate route context ("On the Grand Tour"), and a photo gallery.
- **`/journeys`** — An interactive route builder. Pick any of the ten destinations and a line connects them in real geographic order (not click order), with live-computed distance, travel time, and mode (train vs. flight).
- **`/experiences`** — The same ten places, sorted by mood instead of geography, plus a season-by-season guide to Europe.
- **`/about`** — What the site is, how it was built, and which parts are original design work versus real photography.
- **`/paris`** — "Paris in Motion": the one destination that goes deeper — a standalone scroll through its icons and neighborhoods, built from twelve graded photographs, one level richer than the standard `/destinations/[id]` template.

## Design system

- **Color**: a closed accent economy — three grayscale surface steps (`void` → `panel` → `elevated`), three text tones (`bone`, `mist`, `smoke`), and exactly one accent color (`mint`, `#3bba9c`) used sparingly across the entire site. Defined as CSS variables in `app/globals.css` and wired through `tailwind.config.ts` so Tailwind's `/opacity` modifiers work correctly against them.
- **Type**: a serif display face (Times New Roman) for headings and body copy, and a monospace face reserved as a distinct "UI voice" for coordinates, labels, and data.
- **Geography**: destination coordinates, route ordering, and travel-time estimates are computed from real lat/lon data (`lib/europeGeo.ts`), not artistic guesses — the same data drives the flat maps and the Journeys route builder. The 3D globe's markers (`components/three/GlobeHero.tsx`) are a separate, rounded copy of those coordinates, so keep the two in sync by hand.
- Per-destination accent colors exist only on that destination's own card or page (e.g. Iceland's teal, Rome's amber) — never as a shared, ambient, multi-hue moment elsewhere on the site.

## Development

```bash
npm install
npm run dev      # starts on :3001
npm run build
npm start        # serves the production build on :3001
```

The site runs on port 3001 locally; `lib/site.ts` defaults `SITE_URL` to `http://localhost:3001` (override with `NEXT_PUBLIC_SITE_URL`). Node version is pinned in `.nvmrc` (22).

## Quality checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint (next/core-web-vitals)
npm test            # vitest run (unit tests in tests/, node env)
npm run build       # production build
```

CI (`.github/workflows/ci.yml`) runs all four on every push and pull request to `main`.

## Project structure

```
app/                 Route segments (App Router)
components/          Shared UI, per-destination components, and three/ (R3F scenes)
lib/                 Destination data, geography helpers, journey/travel-time logic
public/              Destination photography, gallery images, maps
```

## Credits

- Photography sourced from [Unsplash](https://unsplash.com/license) and [Pexels](https://www.pexels.com/license/) under their respective free licences. Individual photographer credits weren't recorded.
- `components/GradientWave.tsx` is adapted from Stripe's animated WebGL gradient ("minigl", © Stripe, Inc.) via Kevin Hufnagl's standalone port — see the file header.
