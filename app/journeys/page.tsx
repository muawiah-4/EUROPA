import { Suspense } from "react";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import GhostHeading from "@/components/GhostHeading";
import JourneyRouteBuilder, { JourneyRouteBuilderFallback } from "@/components/JourneyRouteBuilder";
import JourneyHeroCollage from "@/components/JourneyHeroCollage";
import MapWatermark from "@/components/MapWatermark";

export const metadata: Metadata = {
  title: "The Grand European Journey — Europa",
  description:
    "Build your own route across the continent — pick any destinations and watch a real, geographically ordered line connect them.",
};

export default function JourneysPage() {
  return (
    <main className="bg-void">
      <MapWatermark align="center" />
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        <JourneyHeroCollage />
        <GhostHeading align="left" className="-top-2 opacity-70 md:top-2">
          JOURNEYS
        </GhostHeading>
        <div className="relative mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">Journeys</div>
          <h1 className="mt-5 font-display text-4xl font-light leading-[1.08] text-bone md:text-5xl lg:text-6xl">
            One route.
            <br />
            A whole continent.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-mist md:text-base">
            A single destination is a place. A route is a story with a shape — distance, pacing,
            and the order things are seen in. Below, build your own: pick any of the ten
            destinations and a straight line connects them in real geographic order, redrawing
            itself with every city you add or take away.
          </p>
        </div>
      </section>

      {/* Route builder — card itself carries bg-panel, so this section stays
          on the page's own bg-void to keep the card reading as raised. */}
      <section className="border-t border-white/[0.06] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          {/* The builder reads ?stops= via useSearchParams, which must sit
              under a Suspense boundary so the page can still be statically
              rendered; the fallback is the same builder with no stops. */}
          <Suspense fallback={<JourneyRouteBuilderFallback />}>
            <JourneyRouteBuilder />
          </Suspense>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
