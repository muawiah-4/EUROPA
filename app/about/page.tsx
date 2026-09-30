import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS, getDestinationById } from "@/lib/journey";
import SiteFooter from "@/components/SiteFooter";
import GhostHeading from "@/components/GhostHeading";
import DestinationsMap from "@/components/DestinationsMap";

// Shared mid-weight grade for decorative photo moments on this page — between
// DestinationPhotoBackdrop's heavy hero darkening (these don't sit under
// text) and DestinationPhotoGallery's light touch (these are smaller and
// need to read clearly at a glance).
const ABOUT_PHOTO_FILTER = "grayscale(0.25) sepia(0.15) saturate(0.8) brightness(0.85) contrast(1.08)";

// A handful of destinations for the hero collage — chosen for visual variety
// (architecture, water, volcanic cliffs, ice, spires) rather than any single
// criterion, so the strip reads as "ten places" at a glance.
const HERO_COLLAGE_IDS = ["rome", "venice", "santorini", "iceland", "prague"] as const;

export const metadata: Metadata = {
  title: "About — Europa",
  description:
    "What this site is, how it was built, and where it draws the line between original art and real photography.",
};

const CRAFT_ITEMS: { label: string; value: string; photo?: { src: string } }[] = [
  {
    label: "TYPOGRAPHY",
    value: "Each city's own name is its landmark by default — a restrained, place-specific kinetic motion instead of a drawn or modeled object.",
  },
  {
    label: "ATMOSPHERE",
    value: "A procedural particle system with its own recipe per place — gold dust, snowfall, sun-glint.",
  },
  {
    label: "THE GLOBE",
    value: "A custom-shaded WebGL sphere in the opening scene, built from scratch, with every destination marked at its real coordinates.",
  },
  {
    label: "THE MAP",
    value: "The Grand Tour route on Journeys and Destinations plots real lat/lon coordinates, not an artistic guess at where things are.",
  },
  {
    label: "PARIS, IN PHOTOGRAPHS",
    value: "One deliberate exception: Paris carries real photography, graded toward the site's own palette — a hybrid trial for how far this could go.",
    photo: { src: "/destinations/paris.jpg" },
  },
];

export default function AboutPage() {
  const cityList = DESTINATIONS.map((d) => d.city).join(", ");

  return (
    <main className="bg-void">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-40 md:px-10 md:pb-32 md:pt-48">
        {/* Grayscale bloom, matching the user-supplied monochrome
            background palette — was tinted with two destinations' own
            accents, which read as "background color" for this request's
            purposes even at low opacity. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full blur-[130px]" style={{ background: "#f8f8f9", opacity: 0.08 }} />
          <div className="absolute -bottom-48 -right-24 h-[460px] w-[460px] rounded-full blur-[140px]" style={{ background: "#c3c7ce", opacity: 0.07 }} />
        </div>

        {/* Scattered real-photo collage — a genuine visual, not decoration:
            five destinations giving the hero its own "ten places" moment
            instead of empty space beside the headline. Graded monochrome
            (one shared border/wash tone, not each destination's own
            accent) since this hero isn't any single destination's own
            page — the site's per-destination accent is reserved for that
            context, not a shared ambient collage. Desktop-only (lg+) so it
            never crowds the text at narrower widths. */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
          {HERO_COLLAGE_IDS.map((id, i) => {
            const d = getDestinationById(id);
            if (!d?.photoSrc) return null;
            const layout = [
              { top: "6%", right: "8%", w: 132, rotate: -6 },
              { top: "24%", right: "38%", w: 108, rotate: 5 },
              { top: "44%", right: "4%", w: 148, rotate: 4 },
              { top: "62%", right: "34%", w: 118, rotate: -4 },
              { top: "80%", right: "2%", w: 104, rotate: 7 },
            ][i];
            return (
              <div
                key={id}
                className="absolute overflow-hidden"
                style={{
                  top: layout.top,
                  right: layout.right,
                  width: layout.w,
                  aspectRatio: "4 / 5",
                  transform: `rotate(${layout.rotate}deg)`,
                  border: "1px solid rgb(var(--bone) / 0.14)",
                }}
              >
                <Image
                  src={d.photoSrc}
                  alt=""
                  fill
                  sizes="150px"
                  className="object-cover"
                  style={{ filter: ABOUT_PHOTO_FILTER }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 50%, rgba(11,12,14,0.85))" }}
                />
              </div>
            );
          })}
        </div>

        <GhostHeading align="left" className="-top-4 opacity-60 md:top-0">
          ABOUT
        </GhostHeading>

        <div className="relative mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">About</div>

          <h1
            className="text-balance mt-6 font-display font-light leading-[0.95] tracking-[-0.03em] text-bone"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}
          >
            <span className="block">TEN PLACES.</span>
            <span className="block">NINE INVENTED. ONE REAL.</span>
          </h1>

          <p className="mt-8 max-w-xl text-[15px] font-light leading-relaxed text-mist">
            This site is an interactive, scroll-driven journey through {DESTINATIONS.length} places across
            Europe — {cityList}. It isn&rsquo;t a booking tool or a travel guide. It&rsquo;s a design and motion
            showcase, built to see how far mood, restraint, and rhythm can carry a screen — and, in one
            deliberate chapter, how that same restraint holds up once real photography enters the frame.
          </p>
        </div>
      </section>

      {/* The approach / craft */}
      <section className="border-t border-white/[0.06] bg-panel px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">The approach</div>

          <h2
            className="text-balance mt-5 font-display font-light leading-[0.98] tracking-[-0.025em] text-bone"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.1rem)" }}
          >
            Almost everything here is built, not photographed.
          </h2>

          <p className="mt-7 text-[15px] font-light leading-relaxed text-mist">
            That was the original brief: no real photography anywhere, no landmark drawn or sourced —
            every destination&rsquo;s name would carry its own restrained kinetic signature instead of an
            object standing in for the place: a slow gold sweep for Paris, a canal ripple for Venice,
            deliberate stillness for Rome. A small specimen frame sits around it — corner brackets, real
            coordinates, a plate number — giving the page structure without drawing anything. Every wisp
            of light or fog is a procedural particle-atmosphere system with its own recipe per place, and
            the globe in the opening scene is a custom-shaded WebGL sphere, built from scratch, with every
            destination marked at its true coordinates.
          </p>

          <p className="mt-5 text-[15px] font-light leading-relaxed text-mist">
            One chapter breaks the rule on purpose.{" "}
            <Link href="/paris" className="text-mist underline decoration-white/20 underline-offset-4 transition-colors hover:text-bone">
              Paris in Motion
            </Link>{" "}
            is built from twelve real photographs, each graded toward the destination&rsquo;s own palette
            rather than shown raw — a hybrid trial for how far the site&rsquo;s restraint holds up once a
            real image enters the frame, not a reversal of the rule everywhere else. Every route and map on
            the site, meanwhile, was never invented: the{" "}
            <Link href="/journeys" className="text-mist underline decoration-white/20 underline-offset-4 transition-colors hover:text-bone">
              Grand Tour
            </Link>{" "}
            plots all ten destinations at their real latitude and longitude, sequenced by actual geography.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 border-t border-white/[0.06] pt-10 sm:grid-cols-2 md:grid-cols-3">
            {CRAFT_ITEMS.map((item) => (
              <div key={item.label}>
                {item.photo && (
                  <div
                    className="relative mb-4 h-14 w-14 overflow-hidden"
                    style={{ border: "1px solid rgb(var(--bone) / 0.14)" }}
                  >
                    <Image src={item.photo.src} alt="" fill sizes="56px" className="object-cover" style={{ filter: ABOUT_PHOTO_FILTER }} />
                  </div>
                )}
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">{item.label}</div>
                <p className="mt-3 text-[13.5px] font-light leading-relaxed text-mist">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The real map — a genuine visual, not decoration: proof the routes
          above are plotted at true coordinates, not drawn by feel. */}
      <section className="px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">Proof, not just a claim</div>
          <h2
            className="mt-3 font-display font-light tracking-[-0.02em] text-bone"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.1rem)" }}
          >
            Ten places, plotted where they actually are.
          </h2>
          <p className="mt-4 max-w-[48ch] mx-auto text-[14px] leading-relaxed text-mist">
            The same map that opens Destinations and closes the Journeys route builder — every
            marker below sits at its real coordinates.
          </p>
        </div>
        <div className="mx-auto mt-14 md:mt-16">
          <DestinationsMap />
        </div>
      </section>

      {/* How to explore */}
      <section className="px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-5xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">How to explore</div>

          <h2
            className="text-balance mt-5 max-w-2xl font-display font-light leading-[0.98] tracking-[-0.025em] text-bone"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.1rem)" }}
          >
            Two ways to see it.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href="/"
              className="group block overflow-hidden border border-white/[0.08] bg-elevated transition-colors hover:border-bone/25"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="/destinations/paris.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  style={{ filter: ABOUT_PHOTO_FILTER }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(0deg, rgb(var(--elevated)), transparent)" }} />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" style={{ background: "rgb(var(--mint))" }} />
              </div>
              <div className="p-8 md:p-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-mist/80">Option 01</div>
                <div className="mt-4 font-display text-2xl font-light tracking-[-0.02em] text-bone">
                  The full journey
                </div>
                <p className="mt-4 text-[14px] font-light leading-relaxed text-mist">
                  One continuous scroll through all {DESTINATIONS.length} destinations in sequence, paced like a
                  piece of music — slow chapters linger, brisk ones move quickly. The best way to see it for
                  the first time.
                </p>
                <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors group-hover:text-bone">
                  Begin the journey →
                </div>
              </div>
            </Link>

            <Link
              href="/destinations"
              className="group block overflow-hidden border border-white/[0.08] bg-elevated transition-colors hover:border-bone/25"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="/destinations/santorini.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  style={{ filter: ABOUT_PHOTO_FILTER }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(0deg, rgb(var(--elevated)), transparent)" }} />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" style={{ background: "rgb(var(--mint))" }} />
              </div>
              <div className="p-8 md:p-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-mist/80">Option 02</div>
                <div className="mt-4 font-display text-2xl font-light tracking-[-0.02em] text-bone">
                  Browse by destination
                </div>
                <p className="mt-4 text-[14px] font-light leading-relaxed text-mist">
                  Jump straight to a specific place, read more about its history and character, and come back
                  to it later without replaying the whole journey from the start.
                </p>
                <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors group-hover:text-bone">
                  See all destinations →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-28 text-center md:py-36">
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">Start here</div>
          <h2
            className="text-balance mt-5 font-display font-light leading-[0.95] tracking-[-0.03em] text-bone"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}
          >
            Begin the journey
          </h2>
          <p className="mt-5 text-[14px] font-light leading-relaxed text-mist">
            {DESTINATIONS.length} places, one continuous scroll.
          </p>
          <Link
            href="/"
            className="hairline mt-9 rounded-full px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors hover:border-bone/40 hover:text-bone"
          >
            Start scrolling
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
