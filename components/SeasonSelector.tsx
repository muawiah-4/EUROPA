"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { DESTINATIONS, getDestinationById, type AtmosphereKind, type Destination } from "@/lib/journey";
import AtmosphereParticles from "@/components/AtmosphereParticles";
import DestinationPhotoBackdrop from "@/components/DestinationPhotoBackdrop";

type SeasonId = "spring" | "summer" | "autumn" | "winter";

type Season = {
  id: SeasonId;
  label: string;
  months: string[];
  atmosphere: AtmosphereKind;
  copy: string;
  /** A representative photo + a season-specific tint — deliberately its
   * own color identity, not the pictured destination's own accent, so the
   * four seasons read as four distinct moods rather than four cities. */
  photoId: string;
  sky: [string, string];
  accent: string;
};

const SEASONS: Season[] = [
  {
    id: "spring",
    label: "Spring",
    months: ["march", "april", "may"],
    atmosphere: "sun-glint",
    copy: "Europe wakes up unevenly — tulip fields open in the north while southern terraces are already back in daily use. Light returns before the crowds do, which is most of the argument for going now.",
    photoId: "amsterdam",
    sky: ["#132a1c", "#0d1712"],
    accent: "#7fd6a0",
  },
  {
    id: "summer",
    label: "Summer",
    months: ["june", "july", "august"],
    atmosphere: "warm-drift",
    copy: "Long evenings push dinner later and keep coastal towns lit well past ten. It's the fullest, loudest version of the continent — worth it for the Alps' brief thaw and a midnight sun further north.",
    photoId: "santorini",
    sky: ["#2a1c0a", "#1a1006"],
    accent: "#f0c05a",
  },
  {
    id: "autumn",
    label: "Autumn",
    months: ["september", "october", "november"],
    atmosphere: "amber-glow",
    copy: "The light turns lower and warmer just as the summer crowds thin out — arguably the best-kept-secret season, when cities that felt overrun in July return to their own rhythm.",
    photoId: "prague",
    sky: ["#2a1408", "#1a0d06"],
    accent: "#d97a4a",
  },
  {
    id: "winter",
    label: "Winter",
    months: ["december", "january", "february"],
    atmosphere: "snowfall",
    copy: "The quiet season — short days, cold air, and a sky at the continent's northern edge that occasionally answers back in color. Not every place is built for it, but the ones that are come alive.",
    photoId: "iceland",
    sky: ["#0a1622", "#060a12"],
    accent: "#5fc9e8",
  },
];

// Simple, honest month-substring match against each destination's own
// `bestSeason` text (no new data model) — then pad with the remaining
// destinations, in their existing order, so every season always surfaces
// exactly three picks even when few `bestSeason` strings mention its
// months literally (winter's real-word matches are sparse on purpose —
// see SEASONS above; most of this site's destinations are shoulder-season
// places, and pretending otherwise would misrepresent the copy already on
// their own detail pages).
function destinationsFor(season: Season): Destination[] {
  const matches = DESTINATIONS.filter((d) =>
    season.months.some((m) => d.bestSeason.toLowerCase().includes(m))
  );
  const rest = DESTINATIONS.filter((d) => !matches.includes(d));
  return [...matches, ...rest].slice(0, 3);
}

export default function SeasonSelector() {
  const [active, setActive] = useState<SeasonId>("spring");
  const season = SEASONS.find((s) => s.id === active) ?? SEASONS[0];
  const picks = destinationsFor(season);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-4 border-b border-white/[0.06] pb-8">
        {SEASONS.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              data-cursor="link"
              aria-pressed={isActive}
              className="group relative flex flex-col items-center gap-2.5 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-bone/70"
            >
              <span
                className="font-mono text-[11px] uppercase tracking-[0.28em] transition-colors"
                style={{ color: isActive ? s.accent : "rgba(184,182,174,0.45)" }}
              >
                {s.label}
              </span>
              <span
                className="h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: isActive ? "26px" : "8px",
                  background: isActive ? s.accent : "rgba(184,182,174,0.3)",
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="relative mt-16 overflow-hidden border border-white/[0.08]">
        <AnimatePresence mode="wait">
          <motion.div
            key={season.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-panel px-8 py-14 md:px-16 md:py-20"
          >
            {getDestinationById(season.photoId)?.photoSrc && (
              <div aria-hidden className="absolute inset-0">
                <DestinationPhotoBackdrop
                  photos={[getDestinationById(season.photoId)!.photoSrc!]}
                  sky={season.sky}
                  accent={season.accent}
                />
              </div>
            )}
            <div aria-hidden className="absolute inset-0 opacity-50">
              <AtmosphereParticles kind={season.atmosphere} />
            </div>

            <div className="relative max-w-2xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Europe in {season.label.toLowerCase()}
              </div>
              <p className="mt-6 text-balance font-display text-[20px] font-light leading-[1.6] text-bone md:text-[26px]">
                {season.copy}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">Best now</span>
                {picks.map((d) => (
                  <Link
                    key={d.id}
                    href={`/destinations/${d.id}`}
                    data-cursor="link"
                    className="hairline rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-bone/40"
                    style={{ color: d.accent }}
                  >
                    {d.city}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
