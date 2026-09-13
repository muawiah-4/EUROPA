"use client";

import Image from "next/image";
import Link from "next/link";
import { getDestinationById } from "@/lib/journey";
import AtmosphereParticles from "@/components/AtmosphereParticles";

type Category = {
  n: string;
  title: string;
  blurb: string;
  linkedIds: [string, string];
  span: string;
};

/**
 * Six ways to sort the same ten destinations by mood rather than by map.
 * Every card links to its first linked destination's real detail page —
 * no separate "experience" content model, just a different lens on data
 * that already exists in lib/journey.ts.
 */
const CATEGORIES: Category[] = [
  {
    n: "01",
    title: "The Romantic Europe",
    blurb: "Golden light, water underfoot, and cities built for slow walks with nowhere urgent to be.",
    linkedIds: ["paris", "venice"],
    span: "sm:col-span-2 lg:col-span-4 lg:row-span-2",
  },
  {
    n: "02",
    title: "The Historic Europe",
    blurb: "Centuries stacked in plain sight — clocks, ruins, and skylines that never finished becoming themselves.",
    linkedIds: ["rome", "prague"],
    span: "lg:col-span-2 lg:row-span-1",
  },
  {
    n: "03",
    title: "The Wild Europe",
    blurb: "Altitude, ice, and geology still doing its work — the continent's edges, where scale takes over.",
    linkedIds: ["alps", "iceland"],
    span: "lg:col-span-2 lg:row-span-1",
  },
  {
    n: "04",
    title: "The Coastal Europe",
    blurb: "Caldera cliffs and canal water — places that let the horizon do most of the talking.",
    linkedIds: ["santorini", "amsterdam"],
    span: "sm:col-span-2 lg:col-span-3 lg:row-span-1",
  },
  {
    n: "05",
    title: "The Culinary Europe",
    blurb: "Long dinners and slow mornings, in cities that treat a table as a place to stay, not pass through.",
    linkedIds: ["barcelona", "paris"],
    span: "sm:col-span-2 lg:col-span-3 lg:row-span-1",
  },
  {
    n: "06",
    title: "The Creative Europe",
    blurb: "One imagination reshaping a skyline, one city leaning in to listen — places built by design, not default.",
    linkedIds: ["amsterdam", "barcelona"],
    span: "sm:col-span-2 lg:col-span-6 lg:row-span-1",
  },
];

export default function ExperienceCategories() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[220px]">
      {CATEGORIES.map((c) => {
        const primary = getDestinationById(c.linkedIds[0]);
        if (!primary) return null;
        const linkedCities = c.linkedIds
          .map((id) => getDestinationById(id)?.city)
          .filter(Boolean)
          .join(" · ");

        return (
          <Link
            key={c.n}
            href={`/destinations/${primary.id}`}
            data-cursor="link"
            className={`group relative block min-h-[280px] overflow-hidden bg-panel outline-none transition-colors duration-500 focus-visible:outline-none lg:min-h-0 ${c.span}`}
            style={{ border: "1px solid rgba(242,239,233,0.08)" }}
          >
            {/* Base sky — fallback color, sits behind the photo in case a
                destination is ever added without one */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, ${primary.sky[0]}, ${primary.sky[1]})` }}
            />

            {/* Real photo backdrop, graded toward this category's primary
                destination's own palette — same two-layer recipe as
                DestinationPhotoBackdrop (desaturated/darkened filter, then a
                mix-blend-mode: color wash from the destination's own sky
                gradient) so a photo card reads as "one graded look" with
                every gradient-only card elsewhere on the site. */}
            {primary.photoSrc && (
              <>
                <Image
                  src={primary.photoSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
                  style={{ filter: "grayscale(0.4) sepia(0.22) saturate(0.55) brightness(0.5) contrast(1.12)" }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, ${primary.sky[0]}, ${primary.sky[1]})`,
                    mixBlendMode: "color",
                    opacity: 0.78,
                  }}
                />
              </>
            )}

            {/* Atmosphere: dormant until hover, same idiom as DestinationCard */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-70">
              <AtmosphereParticles kind={primary.atmosphere} />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24"
              style={{ background: "linear-gradient(180deg, rgba(11,12,14,0.55), transparent)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
              style={{ background: "linear-gradient(0deg, rgba(11,12,14,0.8), transparent)" }}
            />

            {/* Index / kind eyebrow */}
            <div className="absolute left-6 top-5 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em]">
              <span style={{ color: primary.accent }}>{c.n}</span>
              <span className="text-mist/80">Experience</span>
            </div>

            {/* Accent hairline, brightens + grows on hover */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
              style={{ background: primary.accent }}
            />

            <div className="absolute inset-x-0 bottom-0 px-6 py-6 md:px-7 md:py-7">
              <h3 className="font-display text-2xl font-light leading-tight text-bone md:text-3xl">{c.title}</h3>
              <p className="mt-2.5 max-w-[42ch] text-[13px] leading-relaxed text-mist">{c.blurb}</p>

              <div
                className="mt-6 flex items-center justify-between border-t pt-4"
                style={{ borderColor: "rgba(242,239,233,0.08)" }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke transition-colors duration-300 group-hover:text-bone">
                  {linkedCities}
                </span>
                <span
                  aria-hidden
                  className="translate-x-0 font-mono text-sm transition-transform duration-300 ease-out group-hover:translate-x-1"
                  style={{ color: primary.accent }}
                >
                  &rarr;
                </span>
              </div>
            </div>

            {/* Hover border tint */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ border: `1px solid ${primary.accent}55` }}
            />
          </Link>
        );
      })}
    </div>
  );
}
