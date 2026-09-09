import type { Metadata } from "next";
import { DESTINATIONS } from "@/lib/journey";
import DestinationCard from "@/components/DestinationCard";
import DestinationsMap from "@/components/DestinationsMap";
import SiteFooter from "@/components/SiteFooter";
import GhostHeading from "@/components/GhostHeading";

export const metadata: Metadata = {
  title: "All Destinations — EUROPE",
  description: "Every stop on the journey — eight cities across Europe, gathered in one place.",
};

export default function DestinationsPage() {
  const ordered = [...DESTINATIONS].sort((a, b) => a.index - b.index);

  return (
    <main className="bg-void">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <GhostHeading align="right" className="top-2 opacity-70 md:top-6">
          EUROPE
        </GhostHeading>
        <div className="relative mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">
            All Destinations
          </div>
          <h1 className="mt-5 font-display text-4xl font-light leading-[1.08] text-bone md:text-5xl lg:text-6xl">
            Eight cities.
            <br />
            One continent.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-mist md:text-base">
            From Paris&rsquo;s golden hour to Amsterdam&rsquo;s canal dusk, every chapter of the
            journey lives here on its own. Choose a city below to step inside it &mdash; its
            history, its character, and the details worth planning around.
          </p>
        </div>
      </section>

      {/* Map — a second, genuine way to navigate, not a bolted-on extra */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">Navigate by Map</div>
          <h2
            className="mt-3 font-display font-light tracking-[-0.02em] text-bone"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
          >
            The same journey, seen as one constellation.
          </h2>
          <p className="mt-4 max-w-[48ch] mx-auto text-[14px] leading-relaxed text-mist">
            Hover or focus a point to see the city, then choose it to step straight inside.
          </p>
        </div>
        <div className="mt-14 md:mt-16">
          <DestinationsMap />
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {ordered.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
