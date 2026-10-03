# EUROPA — Europe, Beyond the Postcard

A scroll-driven concept travel site covering ten European destinations:
Paris, Rome, Santorini, Venice, The Alps, London, Barcelona, Amsterdam,
Prague and Iceland. It opens on a custom-shaded 3D globe and moves into a
scroll story with one chapter per destination. Every place is shown through
real photography graded toward its own palette. Paris alone gets a separate
deep-dive at `/paris`. Ten places. One goes deeper.

> **Concept project.** This is not a booking platform, and it isn't
> affiliated with any destination, tourism board or brand shown. It's a
> design and motion showcase.

![CI](https://github.com/muawiah-4/EUROPA/actions/workflows/ci.yml/badge.svg)

## Pages

| Route | What it is |
|---|---|
| `/` | The home page. A WebGL globe with every destination marked at its real coordinates, then a scroll-driven journey through ten chapters with a progress rail, an interactive map and an end sequence. |
| `/destinations` | All ten destinations: an "Icons of Europe" landmark grid and a swipeable card carousel. |
| `/destinations/[id]` | A page for each destination: a graded photo hero with the city's moving wordmark, route context ("On the Grand Tour"), a gallery and the next destination. |
| `/journeys` | A route builder. Pick destinations and a line connects them in geographic order, with live distance, travel time and mode (train or flight). Routes are saved in the URL (`?stops=london,paris`) and can be shared with **Copy link**. |
| `/experiences` | The same ten places sorted by mood, plus a season-by-season guide. |
| `/about` | What the site is and how it was built. |
| `/paris` | "Paris in Motion": a standalone 3D scroll through Paris's icons and neighbourhoods, built from twelve graded photographs. |

## Tech stack

| | |
|---|---|
| Framework | Next.js 15.5 (App Router), React 19, TypeScript |
| 3D | Three.js 0.169 through React Three Fiber 9 and Drei 10 |
| Styling | Tailwind CSS 3 with CSS custom-property tokens (`app/globals.css`) |
| Motion | Framer Motion 11, with `MotionConfig reducedMotion="user"` across the whole site |
| Tests | Vitest 4: unit tests, node environment |
| CI | GitHub Actions: typecheck, lint, test and build on every PR |

## Getting started

You need Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3001
```

For a production build:

```bash
npm run build
npm start          # http://localhost:3001
```

The default port is **3001**.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server on :3001 |
| `npm run build` | Builds for production. Every page is generated as static HTML |
| `npm start` | Serves the production build on :3001 |
| `npm run typecheck` | Runs `tsc --noEmit` |
| `npm run lint` | Runs `next lint` on `app/`, `components/`, `lib/` and `tests/` |
| `npm test` | Runs `vitest run`, the 100 unit tests in `tests/` |

CI (`.github/workflows/ci.yml`) runs typecheck, lint, test and build on every
push and pull request to `main`.

## Environment variables

All of these are optional. See `.env.example`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The site's public address, used for canonical URLs, Open Graph tags, the sitemap and JSON-LD. Defaults to `http://localhost:3001`. **Set this when you deploy.** |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Turns on Umami analytics. It must be a UUID. While it's unset, analytics is off. |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | The Umami script URL. Defaults to `https://cloud.umami.is/script.js`. |

### Analytics (optional)

Analytics is off by default. With no website ID set, there's no script, no
CSP change and no network call.

When you turn it on, [Umami](https://umami.is) loads. It uses no cookies and
respects Do Not Track. Its origin is added to `script-src` and `connect-src`.
These events are sent, and none of them include free text (see
`lib/analytics.ts`):

- `journey_chapter_reached`: the destination and chapter, once each per page view
- `route_stop_added` and `route_stop_removed`
- `route_copy_link`
- `plan_route_click`: from the hero or the end sequence

## Design system

- **Colour.** The palette has three grey surface steps (`void` → `panel` →
  `elevated`) and three text tones (`bone`, `mist`, `smoke`).
  - The only accent colour is **mint** (`#3bba9c`). It's used for the logo,
    the hero globe ring, active states and the maps.
  - A destination's own accent colour appears only when that destination is
    the only one on screen, such as its own page, its journey chapter or the
    progress rail's current stop.
  - All of these are CSS variables, wired through `tailwind.config.ts` so
    Tailwind's `/opacity` modifiers work with them.
- **Type.** A serif display face is used for headings and body copy. A
  monospace face is kept for coordinates, labels and data.
- **Geography.** Coordinates, route order, distances and travel times come
  from real latitude and longitude data in `lib/europeGeo.ts` and
  `lib/journey.ts`.
  - Travel time is whichever is faster, train or flight.
  - The globe's markers in `components/three/GlobeHero.tsx` are a separate,
    rounded copy of the coordinates. If you change one, update the other by
    hand.

## Performance and robustness

- Background animations only run when they're visible:
  - Particle canvases pause while their chapter isn't active or is off
    screen.
  - The globe stops rendering (`frameloop="never"`) while it's covered.
  - The gradient canvases pause when they're hidden.
- Only the current chapter's photos and its neighbours' are loaded.
- WebGL contexts are released on teardown (`loseContext`).
- Every 3D canvas sits inside a `WebGLErrorBoundary` with a static fallback,
  so the site still works without WebGL. `app/error.tsx` and
  `app/global-error.tsx` catch everything else.

## Project structure

```
app/                   Routes, plus not-found, error, global-error, sitemap and robots
components/            Shared UI and the per-destination wordmarks
  three/               React Three Fiber scenes (GlobeHero, ParisScene)
  MagneticButton.tsx   Shared with mock-site; keep both copies in sync
  GhostHeading.tsx     Shared with mock-site
  MotionProvider.tsx   Shared with mock-site
lib/
  journey.ts           Destination data, DESTINATION_IDS and the DestinationId type
  europeGeo.ts         Distances, travel time, route neighbours
  routeStops.ts        Parsing and building the ?stops= value (checked against an allow-list)
  parisExperience.ts   /paris scene data
  site.ts              SITE_URL and metadata helpers
  analytics.ts         Opt-in Umami config and track()
tests/                 Vitest unit tests
public/
  destinations/        Destination photography (JPEG)
  paris/               /paris photos (WebP for the 3D scene, JPEG for pages and Open Graph)
  maps/                Map assets
```

## Quality notes

- **Accessibility**
  - Text contrast is at least 4.5:1.
  - Each page has exactly one `<h1>`.
  - Hidden layers never catch clicks or keyboard focus.
  - The map moves focus to its first pin when it opens and returns focus to
    the toggle when it closes. The mobile menu keeps focus inside while
    open.
  - Reduced motion is respected.
- **SEO**
  - Every page has its own title, description, canonical URL, and Open
    Graph and Twitter cards.
  - There's a sitemap, a robots file and a custom 404.
  - Pages include WebSite, TouristDestination and BreadcrumbList JSON-LD.
- **Security.** The site sends a strict Content-Security-Policy with no
  external origins, along with nosniff, Referrer-Policy, Permissions-Policy,
  X-Frame-Options, HSTS and COOP headers. See [SECURITY.md](SECURITY.md).
- **Project rules.** [CLAUDE.md](CLAUDE.md) sets out the design system,
  accessibility, performance and security rules for contributors.

## Related

[TISSOT PRX concept](https://github.com/muawiah-4/mock-site) is a sibling
project: a scroll-driven product site built on the same stack. It shares its
motion components with this site.

## Credits

- Photography is from [Unsplash](https://unsplash.com/license) and
  [Pexels](https://www.pexels.com/license/), used under their free licences.
  Individual photographer credits weren't recorded.
- `components/GradientWave.tsx` is adapted from Stripe's animated WebGL
  gradient ("minigl", © Stripe, Inc.), by way of Kevin Hufnagl's standalone
  port. See the file header for details.
