import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DESTINATIONS, getDestinationById } from "@/lib/journey";
import { LANDMARK_SHAPES } from "@/lib/landmarkShapes";
import AtmosphereParticles from "@/components/AtmosphereParticles";
import SiteFooter from "@/components/SiteFooter";
import DestinationLandmark from "@/components/three/DestinationLandmark";

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const destination = getDestinationById(params.id);
  if (!destination) return {};
  return {
    title: `${destination.city} — Europe`,
    description: destination.overview,
  };
}

export default function DestinationPage({ params }: { params: { id: string } }) {
  const destination = getDestinationById(params.id);
  if (!destination) notFound();

  const currentIndex = DESTINATIONS.findIndex((d) => d.id === destination.id);
  const next = DESTINATIONS[(currentIndex + 1) % DESTINATIONS.length];
  const landmarkShapes = LANDMARK_SHAPES[destination.id];

  return (
    <main className="bg-void">
      {/* Entrance-fade keyframes, scoped to this page only */}
      <style>{`
        @keyframes destHeroFade {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dest-hero-fade { animation: destHeroFade 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* ---------- Hero ---------- */}
      <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${destination.sky[0]} 0%, ${destination.sky[1]} 100%)` }}
        />
        <AtmosphereParticles kind={destination.atmosphere} />
        <div className="absolute inset-0">
          {landmarkShapes ? <DestinationLandmark shapes={landmarkShapes} accent={destination.accent} /> : null}
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 40%, rgba(5,5,6,0.55) 78%, rgba(5,5,6,0.92) 100%)" }}
        />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
          <div className="dest-hero-fade max-w-3xl">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: destination.accent }}>
              {destination.eyebrow}
            </div>
            <h1
              className="text-balance font-display font-light leading-[0.92] tracking-[-0.03em] text-bone"
              style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
            >
              {destination.city}
            </h1>
            <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[17px]">
              {destination.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Overview ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">Overview</div>
        <p className="mt-6 text-balance font-display text-[22px] font-light leading-[1.5] text-bone md:text-[28px]">
          {destination.overview}
        </p>
      </section>

      {/* ---------- History & Culture ---------- */}
      <section className="border-t border-white/[0.06] bg-panel">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-14 px-6 py-20 md:grid-cols-2 md:gap-16 md:px-10 md:py-28">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">History</div>
            <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[16px]">
              {destination.history}
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">Culture</div>
            <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[16px]">
              {destination.culture}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Highlights ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">Look for</div>
        <ol className="mt-8 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {destination.highlights.map((h, i) => (
            <li key={h} className="flex items-start gap-6 py-6">
              <span
                className="mt-[2px] shrink-0 font-mono text-[12px] tracking-[0.18em]"
                style={{ color: destination.accent }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="max-w-xl text-[15px] font-light leading-relaxed text-bone md:text-[16px]">{h}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Practical info ---------- */}
      <section className="border-t border-white/[0.06] bg-panel">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20 md:flex-row md:justify-between md:px-10 md:py-28">
          <div className="max-w-md">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">Travel tip</div>
            <p className="mt-3 text-[15px] font-light leading-relaxed text-mist md:text-[16px]">{destination.travelTip}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">Best season</div>
            <div className="mt-3 font-mono text-[13px] uppercase tracking-[0.18em] text-mist">{destination.bestSeason}</div>
          </div>
        </div>
      </section>

      {/* ---------- Cross-navigation ---------- */}
      <section className="border-t border-white/[0.06] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">Next destination</div>
          <Link href={`/destinations/${next.id}`} className="group mt-5 inline-flex items-baseline gap-4">
            <span
              className="text-balance font-display font-light leading-[0.95] tracking-[-0.03em] text-bone transition-colors group-hover:text-mist"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
            >
              {next.city}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-smoke transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <div className="mt-4 h-px w-12" style={{ backgroundColor: destination.accent, opacity: 0.4 }} />

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
            <Link href="/destinations" className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-bone">
              All destinations
            </Link>
            <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-bone">
              See it in motion — the full scroll experience
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
