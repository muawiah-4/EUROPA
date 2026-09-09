# Landmark Hero — Style Reference (adapted from Max Yinger reference)

> One detailed, recognizable 3D landmark per destination, filling the entire
> detail-page viewport as the page's central imagery. Everything else —
> wordmark, telemetry labels, bio-style copy — is pushed to the corners.
> Adapted from a Max Yinger–style personal-site reference: same structural
> idea (dark canvas + one viewport-scale 3D hero + corner-anchored HUD text),
> re-tokened onto THIS project's existing palette rather than importing the
> reference's own colors — Yinger's bone-white/rose-quartz system would
> collide with our established per-destination accent economy.

**Theme:** dark (unchanged from the rest of the site)

## What changes vs. the current landmark treatment

The current `FloatingLandmark` shapes (see `lib/landmarkShapes.ts`) are
deliberately abstracted — a cone for a tower, a box for a building. That
was the right call for the small-scale homepage chapters and card
thumbnails, where the landmark is one element among many on screen. It is
NOT enough for the detail-page hero, which now needs to be the page: a
full-viewport, detailed, unmistakably-that-landmark model — the Eiffel
Tower's actual lattice, the Colosseum's actual arched colonnade, Sagrada
Família's actual spire cluster — built up from many more primitives so the
silhouette reads as real structure, not a geometric stand-in.

Still governed by the project's existing hard constraint: primitive
Three.js geometry only (box/cylinder/cone/torus/ring/sphere), no imported
or purchased 3D models, no textures/photography. "Detailed" means more
primitives, assembled with real structural logic (actual cross-bracing,
actual repeated arches, actual tiering) — not higher-poly single shapes.

## Tokens — reuse, don't replace

Do not introduce a new color system. Reuse exactly what already exists:

| Reference role | This project's token | Value |
|---|---|---|
| Canvas / background | `--void` | `#050506` |
| Primary text | `--bone` | `#f2efe9` |
| Secondary text | `--mist` | `#b8b6ae` |
| Tertiary / label text | `--smoke` | `#6b6a66` |
| 3D artifact edge-light accent | each destination's own `accent` (`lib/journey.ts`) | e.g. Paris `#e8c07a`, Amsterdam `#b98fd1` |

The reference's "one warm off-white does all the work, with a whisper of
accent bleeding from the 3D rendering as the only chromatic punctuation"
principle carries over directly — it's already this site's principle
(`[[design_cross_validated_principles]]`-style closed accent economy), just
applied per-destination instead of globally.

## Typography — reuse existing families

- Display / masthead → `font-display`, `font-light` (already established)
- Telemetry / HUD labels (coordinates, height, built-year, FPS-style
  technical callouts) → `font-mono`, uppercase, wide tracking — this
  project's existing "mono as real UI voice" convention, not a new face.

## Components (adapted)

### Full-Viewport 3D Hero Artifact
**Role:** the entire detail-page hero — replaces the current smaller
landmark treatment. One detailed landmark model, camera framed so it fills
the viewport height, floating in negative space. No container, no border,
no card. Drag-to-rotate stays; idle motion stays gentle per
`prefers-reduced-motion`.

### Corner Telemetry Cluster
**Role:** the destination's existing `info` rows (LOCATION / KNOWN FOR /
BEST EXPERIENCED), re-presented as HUD-style annotations anchored to a
viewport corner rather than stacked under the headline — mono, uppercase,
12px-scale, tight tracking, reading like engine telemetry next to the
model. Reuses existing data, no new copy needed.

### Masthead / Wordmark
**Role:** unchanged — `SiteHeader` already does this job (top-left,
minimal). Don't duplicate it.

## Do's and Don'ts

### Do
- Give each landmark real structural repetition: actual cross-braced
  lattice tiers (Eiffel Tower), actual repeated arch bays around a curve
  (Colosseum), actual tiered/twisting spire cluster (Sagrada Família).
- Keep one accent per destination, used only as edge-light/rim-glow on the
  model — never a chrome color.
- Keep the model camera-framed to fill the viewport — this is the page's
  imagery now, not a small supporting element.
- Keep everything else (text, labels) minimal and pushed to corners.

### Don't
- Don't invent a new color palette — reuse `--void`/`--bone`/`--mist`/
  `--smoke` + per-destination `accent`.
- Don't add box-shadows, drop-shadows, or containers around the 3D canvas.
- Don't import or purchase any external model/texture — primitives only.
- Don't let per-landmark mesh count get so high it tanks frame rate on a
  mid-tier laptop — hundreds of small simple meshes sharing one material
  per landmark is fine; thousands is not. Profile before committing to a
  final density.

## Per-landmark structural brief

- **Paris — Eiffel Tower:** four tapering corner legs meeting at a base
  arch, with actual X-cross-bracing lattice panels repeating up multiple
  tapering tiers, first and second observation platforms as flat rings/
  discs, tapering antenna mast on top.
- **Rome — Colosseum:** a true ring of repeated arch bays (not solid
  columns) across 3-4 stacked tiers of decreasing height, each tier's
  arches slightly smaller/set back, flat attic tier on top.
- **Santorini:** stacked whitewashed cuboid tiers following a hillside
  silhouette, multiple actual hemisphere domes (not one), a bell-tower
  accent, blue-dome color read via accent-tinted rim light only.
- **Venice:** a real arched bridge (already good — keep), extended with a
  taller, denser canal-facade row and a recognizable campanile-style tower
  accent.
- **The Alps:** cluster of tapering peaks — already reads well; add snow-
  cap color variation via a second, lighter accent band near each peak tip.
- **London — Big Ben:** a proper clock tower — tiered shaft, four visible
  clock faces (rings) near the top, a real spired/pinnacled cap, not a
  single cone.
- **Barcelona — Sagrada Família:** multiple beaded, tapering spires of
  varying height (already good direction — keep), increase spire count and
  add cross-bracing "branch" details partway up for the organic-structure
  read.
- **Amsterdam:** a longer row of narrow gabled canal houses with actual
  stepped/bell gable profiles (not just triangular caps), varying facade
  widths and setbacks for an authentic canal-row rhythm.

## Similar Brands

- **Bruno Simon** — dark-canvas 3D-hero-as-identity, single detailed
  rendered artifact as visual centerpiece, minimal text at the edges.
- **Active Theory** — dark terminal aesthetic, real-time 3D artifacts,
  monospaced telemetry-style labels.
