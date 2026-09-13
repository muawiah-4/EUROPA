# EUROPA — Europe, Beyond the Postcard

A scroll-driven concept travel site exploring ten European destinations — Paris, Rome, Santorini, Venice, The Alps, London, Barcelona, Amsterdam, Prague, and Iceland. It isn't a booking platform or affiliated with any destination shown; it's a design and motion showcase built to see how far mood, restraint, and rhythm can carry a screen — and, in one deliberate chapter, how that restraint holds up once real photography enters the frame.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Three.js (via React Three Fiber + Drei) for the opening 3D globe.

## Pages

- **`/`** — Home. A custom-shaded WebGL globe with every destination marked at its real coordinates, into a scroll-driven story sequence.
- **`/destinations`** — All ten destinations: an "Icons of Europe" grid of defining landmarks, and a horizontal swipeable carousel of destination cards.
- **`/destinations/[id]`** — Per-destination detail page: hero backdrop, real-coordinate route context ("On the Grand Tour"), and a photo gallery.
- **`/journeys`** — An interactive route builder. Pick any of the ten destinations and a line connects them in real geographic order (not click order), with live-computed distance, travel time, and mode (train vs. flight).
- **`/experiences`** — The same ten places, sorted by mood instead of geography, plus a season-by-season guide to Europe.
- **`/about`** — What the site is, how it was built, and where it draws the line between original design work and real photography.
- **`/paris`** — A standalone, deeper hybrid-photography treatment of Paris — the one deliberate exception where real photos, graded toward the site's palette, replace the drawn/procedural treatment used everywhere else.

## Design system

- **Color**: a closed accent economy — three grayscale surface steps (`void` → `panel` → `elevated`), three text tones (`bone`, `mist`, `smoke`), and exactly one accent color (`mint`, `#3bba9c`) used sparingly across the entire site. Defined as CSS variables in `app/globals.css` and wired through `tailwind.config.ts` so Tailwind's `/opacity` modifiers work correctly against them.
- **Type**: a serif display face (Times New Roman) for headings and body copy, and a monospace face reserved as a distinct "UI voice" for coordinates, labels, and data.
- **Geography**: destination coordinates, route ordering, and travel-time estimates are computed from real lat/lon data (`lib/europeGeo.ts`), not artistic guesses — the same data drives the 3D globe's markers, the flat maps, and the Journeys route builder.
- Per-destination accent colors exist only on that destination's own card or page (e.g. Iceland's teal, Rome's amber) — never as a shared, ambient, multi-hue moment elsewhere on the site.

## Development

```bash
npm install
npm run dev      # starts on :3000 (or set PORT to override)
npm run build
npm run lint
```

## Project structure

```
app/                 Route segments (App Router)
components/          Shared UI, per-destination components, and three/ (R3F scenes)
lib/                 Destination data, geography helpers, journey/travel-time logic
public/              Destination photography, gallery images, maps
```
