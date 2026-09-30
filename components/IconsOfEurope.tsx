import Image from "next/image";
import Link from "next/link";
import { getDestination, type DestinationId } from "@/lib/journey";
import AtmosphereParticles from "@/components/AtmosphereParticles";

/**
 * "Icons of Europe" editorial grid — one landmark or defining moment per
 * destination, not an eleventh unrelated entry (the brief's own suggested
 * list includes Neuschwanstein Castle, which belongs to no destination in
 * this site; swapped for Amsterdam's canal houses so all ten cards stay
 * genuine, clickable doorways into a real destination page rather than one
 * decorative dead end).
 *
 * Visual language deliberately mirrors DestinationCard.tsx's hover
 * vocabulary exactly (background scale, accent hairline, arrow translate,
 * border tint) rather than inventing a second idiom — same sky gradient +
 * AtmosphereParticles backing, no photography, no drawn landmark art.
 */
const ICONS: {
  destinationId: DestinationId;
  name: string;
  category: string;
  description: string;
  photo: string;
  span?: string;
}[] = [
  {
    destinationId: "paris",
    name: "Eiffel Tower",
    category: "ARCHITECTURE",
    description: "Built for a world's fair, meant to be temporary, on lattice iron never removed since 1889.",
    photo: "/paris/eiffel.jpg",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    destinationId: "rome",
    name: "The Colosseum",
    category: "ANCIENT HISTORY",
    description: "A stone amphitheater that has outlasted the empire that built it by two thousand years.",
    photo: "/destinations/rome-gallery-1.jpg",
  },
  {
    destinationId: "london",
    name: "Big Ben",
    category: "ARCHITECTURE",
    description: "A clock tower whose bell has rung the same four notes since 1859.",
    photo: "/destinations/london-gallery-1.jpg",
  },
  {
    destinationId: "barcelona",
    name: "Sagrada Família",
    category: "ARCHITECTURE",
    description: "A cathedral one architect began in 1882, still not finished, still rising.",
    photo: "/destinations/barcelona-gallery-1.jpg",
    span: "md:col-span-2",
  },
  {
    destinationId: "santorini",
    name: "The Caldera",
    category: "NATURE",
    description: "The rim of a volcanic collapse, now lined white and blue above the sea it created.",
    photo: "/destinations/santorini.jpg",
  },
  {
    destinationId: "alps",
    name: "The Alps",
    category: "NATURE",
    description: "Peaks that hold snow through the height of summer, older than any border drawn beneath them.",
    photo: "/destinations/alps.jpg",
  },
  {
    destinationId: "venice",
    name: "The Canals",
    category: "WATER",
    description: "Streets abandoned for water six centuries ago, and never missed since.",
    photo: "/destinations/venice.jpg",
    span: "md:col-span-2",
  },
  {
    destinationId: "amsterdam",
    name: "The Canal Houses",
    category: "ARCHITECTURE",
    description: "Facades built to lean forward, just enough to hoist furniture past every window below.",
    photo: "/destinations/amsterdam-gallery-1.jpg",
  },
  {
    destinationId: "prague",
    name: "The Astronomical Clock",
    category: "HISTORY",
    description: "A dial that has tracked the sun, the moon, and the zodiac since 1410, still correct.",
    photo: "/destinations/prague-gallery-3.jpg",
  },
  {
    destinationId: "iceland",
    name: "The Northern Lights",
    category: "LIGHT",
    description: "A sky that occasionally answers geomagnetic storms in green, sometimes violet, always briefly.",
    photo: "/destinations/iceland-northern-lights.jpg",
    span: "md:col-span-2 md:row-span-2",
  },
];

export default function IconsOfEurope() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:auto-rows-[minmax(210px,auto)] md:grid-cols-4 md:gap-6">
      {ICONS.map((icon, i) => {
        const d = getDestination(icon.destinationId);
        return (
          <Link
            key={icon.name}
            href={`/destinations/${d.id}`}
            data-cursor="link"
            className={`group relative flex flex-col justify-end overflow-hidden bg-panel p-6 outline-none ${icon.span ?? ""}`}
            style={{ border: "1px solid rgba(242,239,233,0.08)" }}
          >
            {/* Base sky — fallback color, sits behind the photo */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, ${d.sky[0]}, ${d.sky[1]})` }}
            />

            {/* Real photo of the landmark itself, graded the same recipe as
                ExperienceCategories.tsx's cards (desaturated/darkened
                filter, then a mix-blend-mode: color wash from the
                destination's own sky gradient) — replaces the earlier
                procedural-particles-only backdrop this grid started with. */}
            <Image
              src={icon.photo}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
              style={{ filter: "grayscale(0.4) sepia(0.22) saturate(0.55) brightness(0.5) contrast(1.12)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${d.sky[0]}, ${d.sky[1]})`,
                mixBlendMode: "color",
                opacity: 0.78,
              }}
            />

            {/* Atmosphere: dormant until hover, same idiom as DestinationCard/ExperienceCategories */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-70">
              <AtmosphereParticles kind={d.atmosphere} />
            </div>

            {/* Accent wash on top of the graded photo, for the same
                per-city color identity the grid had before photos */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 50% 20%, ${d.accent}40, transparent 70%)` }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(0deg, rgba(11,12,14,0.85), rgba(11,12,14,0.15) 55%, transparent 85%)" }}
            />

            <div className="relative flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em]">
              <span style={{ color: d.accent }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-mist/80">{icon.category}</span>
            </div>
            <h3 className="relative mt-2 font-display text-xl font-light leading-tight text-bone md:text-2xl">
              {icon.name}
            </h3>
            <p className="relative mt-2 max-w-[32ch] text-[12.5px] leading-relaxed text-mist">{icon.description}</p>

            <div
              className="relative mt-4 flex items-center justify-between border-t pt-3"
              style={{ borderColor: "rgba(242,239,233,0.08)" }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-smoke transition-colors duration-300 group-hover:text-bone">
                {d.city}, {d.country}
              </span>
              <span
                aria-hidden
                className="translate-x-0 font-mono text-sm transition-transform duration-300 ease-out group-hover:translate-x-1"
                style={{ color: d.accent }}
              >
                &rarr;
              </span>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ border: `1px solid ${d.accent}55` }}
            />
          </Link>
        );
      })}
    </div>
  );
}
