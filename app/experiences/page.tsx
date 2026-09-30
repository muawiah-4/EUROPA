import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import SiteFooter from "@/components/SiteFooter";
import GhostHeading from "@/components/GhostHeading";
import ExperienceCategories from "@/components/ExperienceCategories";
import SeasonSelector from "@/components/SeasonSelector";
import MapWatermark from "@/components/MapWatermark";

export const metadata: Metadata = pageMetadata({
  title: "Experiences",
  description: "Six ways to experience Europe, and how the continent changes with the seasons.",
  path: "/experiences",
});

export default function ExperiencesPage() {
  return (
    <main className="bg-void">
      <MapWatermark align="right" />
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <GhostHeading align="left" strokeColor="rgb(var(--bone) / 0.08)" className="top-2 opacity-70 md:top-6">
          EXPERIENCES
        </GhostHeading>
        <div className="relative mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">Experiences</div>
          <h1 className="mt-5 font-display text-4xl font-light leading-[1.08] text-bone md:text-5xl lg:text-6xl">
            How do you want
            <br />
            to experience Europe?
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-mist md:text-base">
            The same ten places, sorted six different ways &mdash; by mood rather than by map. Pick
            the version of the continent you&rsquo;re actually after.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <ExperienceCategories />
        </div>
      </section>

      {/* Seasons */}
      <section className="border-t border-white/[0.06] bg-panel px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">The Seasons</div>
          <h2
            className="mt-3 font-display font-light tracking-[-0.02em] text-bone"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.1rem)" }}
          >
            Four seasons, one continent.
          </h2>
          <p className="mt-4 max-w-[48ch] mx-auto text-[14px] leading-relaxed text-mist">
            Choose a season to see how the light, the atmosphere, and the best places to be all
            shift together.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-5xl md:mt-20">
          <SeasonSelector />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
