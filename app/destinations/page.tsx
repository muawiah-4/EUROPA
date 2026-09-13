import type { Metadata } from "next";
import { DESTINATIONS } from "@/lib/journey";
import SiteFooter from "@/components/SiteFooter";
import GhostHeading from "@/components/GhostHeading";
import IconsOfEurope from "@/components/IconsOfEurope";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import MapWatermark from "@/components/MapWatermark";

export const metadata: Metadata = {
  title: "All Destinations — EUROPA",
  description: "Every stop on the journey — ten cities across Europe, gathered in one place.",
};

export default function DestinationsPage() {
  const ordered = [...DESTINATIONS].sort((a, b) => a.index - b.index);

  return (
    <main className="bg-void">
      <MapWatermark align="left" />
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        {/* Was a five-destination-accent blend (this page aggregates all
            ten, so it used to earn an exception to the one-accent rule) —
            recolored to grayscale bloom to match the user-supplied
            monochrome background palette; the multi-color moment lived here
            specifically because it was still "the background," which this
            request covers. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-[8%] h-[380px] w-[380px] rounded-full blur-[130px]" style={{ background: "#f8f8f9", opacity: 0.1 }} />
          <div className="absolute -top-10 right-[12%] h-[340px] w-[340px] rounded-full blur-[130px]" style={{ background: "#c3c7ce", opacity: 0.09 }} />
          <div className="absolute top-40 left-[38%] h-[320px] w-[320px] rounded-full blur-[130px]" style={{ background: "#f8f8f9", opacity: 0.07 }} />
          <div className="absolute top-64 right-[30%] h-[300px] w-[300px] rounded-full blur-[130px]" style={{ background: "#c3c7ce", opacity: 0.08 }} />
          <div className="absolute top-10 left-[60%] h-[260px] w-[260px] rounded-full blur-[130px]" style={{ background: "#f8f8f9", opacity: 0.06 }} />
        </div>
        <GhostHeading align="right" className="top-2 opacity-70 md:top-6">
          EUROPE
        </GhostHeading>
        <div className="relative mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">
            All Destinations
          </div>
          <h1 className="mt-5 font-display text-4xl font-light leading-[1.08] text-bone md:text-5xl lg:text-6xl">
            Ten cities.
            <br />
            One continent.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-mist md:text-base">
            From Paris&rsquo;s golden hour to Iceland&rsquo;s northern light, every chapter of the
            journey lives here on its own. Choose a city below to step inside it &mdash; its
            history, its character, and the details worth planning around.
          </p>
        </div>
      </section>

      {/* Icons of Europe — one defining landmark per destination */}
      <section className="relative border-t border-white/[0.06] bg-panel px-6 py-20 md:px-10 md:py-28">
        <GhostHeading align="left" className="top-4 opacity-60 md:top-8">
          ICONS
        </GhostHeading>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">The Icons of Europe</div>
          <h2
            className="mt-3 font-display font-light tracking-[-0.02em] text-bone"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
          >
            Ten places, ten defining landmarks.
          </h2>
          <p className="mt-4 max-w-[48ch] mx-auto text-[14px] leading-relaxed text-mist">
            Every card here opens the destination it belongs to — the landmark is a doorway, not a postcard.
          </p>
        </div>
        <div className="relative mx-auto mt-14 max-w-6xl md:mt-16">
          <IconsOfEurope />
        </div>
      </section>

      {/* Grid — a horizontal, swipeable rail rather than a stacked grid, so
          all ten cards live in one continuous row you scroll through
          (native touch swipe on mobile, trackpad/wheel or the arrow
          buttons on desktop) instead of paging down past several rows. */}
      <section className="border-t border-mint/40 pb-24 pt-16 md:pb-32 md:pt-20">
        <DestinationsCarousel destinations={ordered} />
      </section>

      <SiteFooter />
    </main>
  );
}
