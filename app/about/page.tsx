import type { Metadata } from "next";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/journey";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About — Europe",
  description:
    "What this site is, how it was built, and why every scene in it is original art rather than photography.",
};

const CRAFT_ITEMS: { label: string; value: string }[] = [
  {
    label: "LANDMARKS",
    value: "Hand-authored SVG silhouettes, drawn and tuned one destination at a time.",
  },
  {
    label: "ATMOSPHERE",
    value: "A procedural particle system with its own recipe per place — gold dust, snowfall, sun-glint.",
  },
  {
    label: "THE GLOBE",
    value: "A custom-shaded WebGL sphere in the opening scene, built from scratch, not sourced.",
  },
];

const PRINCIPLES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "ONE ACCENT PER PLACE",
    body: "Each destination carries exactly one accent color, spent sparingly — a label glow, a hairline tint — never decoration for its own sake.",
  },
  {
    n: "02",
    title: "NO SHADOWS, ONLY SURFACES",
    body: "Depth comes from stepped surface colors and blur, never a drop shadow. Flat elevation, everywhere on this site.",
  },
  {
    n: "03",
    title: "MONOSPACE AS INTERFACE",
    body: "The uppercase mono type — “01 / FRANCE,” labels, coordinates — is read as real UI voice throughout, not a stylistic flourish.",
  },
  {
    n: "04",
    title: "MOTION THAT ASKS FIRST",
    body: "Every animation respects prefers-reduced-motion. Nothing here moves just to prove that it can.",
  },
];

export default function AboutPage() {
  const cityList = DESTINATIONS.map((d) => d.city).join(", ");

  return (
    <main className="bg-void">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-40 md:px-10 md:pb-32 md:pt-48">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full blur-[130px]"
            style={{ background: DESTINATIONS[0].accent, opacity: 0.12 }}
          />
          <div
            className="absolute -bottom-48 -right-24 h-[460px] w-[460px] rounded-full blur-[140px]"
            style={{ background: DESTINATIONS[7]?.accent ?? "#b98fd1", opacity: 0.1 }}
          />
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">About</div>

          <h1
            className="text-balance mt-6 font-display font-light leading-[0.95] tracking-[-0.03em] text-bone"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}
          >
            <span className="block">EIGHT PLACES.</span>
            <span className="block">ZERO PHOTOGRAPHS.</span>
          </h1>

          <p className="mt-8 max-w-xl text-[15px] font-light leading-relaxed text-mist">
            This site is an interactive, scroll-driven journey through {DESTINATIONS.length} places across
            Europe — {cityList}. It isn&rsquo;t a booking tool or a travel guide. It&rsquo;s a design and motion
            showcase, built to see how far mood, restraint, and rhythm can carry a screen without a single
            real photograph in it.
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
            Every scene here is built, not photographed.
          </h2>

          <p className="mt-7 text-[15px] font-light leading-relaxed text-mist">
            There&rsquo;s no real photography anywhere on this site, and no licensed 3D landmark models — that
            wasn&rsquo;t a corner cut, it was the brief. Every landmark you scroll past is a hand-authored SVG
            silhouette, drawn and tuned destination by destination. Every wisp of light or fog is a
            procedural particle-atmosphere system with its own recipe per place. The globe in the opening
            scene is a custom-shaded WebGL sphere, built from scratch rather than sourced from a library.
          </p>

          <p className="mt-5 text-[15px] font-light leading-relaxed text-mist">
            The result reads more like a poster series than a postcard — flatter, more graphic, more willing
            to lean on color and silhouette than a photograph ever could. That&rsquo;s deliberate. Real
            photography would have made this feel like a travel brochure; original art lets it feel like
            what it actually is — a design exercise wearing the shape of a travel site.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 border-t border-white/[0.06] pt-10 sm:grid-cols-3">
            {CRAFT_ITEMS.map((item) => (
              <div key={item.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">{item.label}</div>
                <p className="mt-3 text-[13.5px] font-light leading-relaxed text-mist">{item.value}</p>
              </div>
            ))}
          </div>
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
              className="group block rounded-2xl border border-white/[0.08] bg-elevated p-8 transition-colors hover:border-bone/25 md:p-10"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">Option 01</div>
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
            </Link>

            <Link
              href="/destinations"
              className="group block rounded-2xl border border-white/[0.08] bg-elevated p-8 transition-colors hover:border-bone/25 md:p-10"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">Option 02</div>
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
            </Link>
          </div>
        </div>
      </section>

      {/* Principles / design notes */}
      <section className="border-t border-white/[0.06] bg-panel px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">Design notes</div>

          <h2
            className="text-balance mt-5 font-display font-light leading-[0.98] tracking-[-0.025em] text-bone"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.1rem)" }}
          >
            A few rules this site follows.
          </h2>

          <ul className="mt-14 flex flex-col gap-10">
            {PRINCIPLES.map((p) => (
              <li key={p.n} className="flex gap-6 border-t border-white/[0.06] pt-8 first:border-t-0 first:pt-0">
                <span className="font-mono text-[13px] tracking-[0.1em] text-smoke">{p.n}</span>
                <div>
                  <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-bone">{p.title}</div>
                  <p className="mt-3 max-w-xl text-[14px] font-light leading-relaxed text-mist">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex items-center gap-3 border-t border-white/[0.06] pt-10">
            {DESTINATIONS.map((d) => (
              <span
                key={d.id}
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: d.accent, opacity: 0.85 }}
              />
            ))}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
              {DESTINATIONS.length} destinations, {DESTINATIONS.length} accents
            </span>
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
