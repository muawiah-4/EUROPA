import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  DESTINATIONS,
  getDestination,
  getDestinationById,
  haversineKm,
  type Destination,
  type DestinationId,
} from "@/lib/journey";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { JOURNEY_ROUTE_ORDER, estimateTravelTime } from "@/lib/europeGeo";
import AtmosphereParticles from "@/components/AtmosphereParticles";
import SiteFooter from "@/components/SiteFooter";
import DestinationGradientBackdrop from "@/components/DestinationGradientBackdrop";
import DestinationPhotoBackdrop from "@/components/DestinationPhotoBackdrop";
import DestinationPhotoGallery from "@/components/DestinationPhotoGallery";
import DestinationSpecimenFrame from "@/components/DestinationSpecimenFrame";
import ParisKineticWordmark from "@/components/ParisKineticWordmark";
import RomeKineticWordmark from "@/components/RomeKineticWordmark";
import SantoriniKineticWordmark from "@/components/SantoriniKineticWordmark";
import VeniceKineticWordmark from "@/components/VeniceKineticWordmark";
import AlpsKineticWordmark from "@/components/AlpsKineticWordmark";
import LondonKineticWordmark from "@/components/LondonKineticWordmark";
import BarcelonaKineticWordmark from "@/components/BarcelonaKineticWordmark";
import AmsterdamKineticWordmark from "@/components/AmsterdamKineticWordmark";
import PragueKineticWordmark from "@/components/PragueKineticWordmark";
import IcelandKineticWordmark from "@/components/IcelandKineticWordmark";

// One kinetic wordmark per destination — each a genuinely different
// mechanism (see the individual component files), never a 3D object or a
// drawing of a landmark. Looked up by id rather than a long if/else chain.
const KINETIC_WORDMARKS: Record<DestinationId, ComponentType<{ accent: string }>> = {
  paris: ParisKineticWordmark,
  rome: RomeKineticWordmark,
  santorini: SantoriniKineticWordmark,
  venice: VeniceKineticWordmark,
  alps: AlpsKineticWordmark,
  london: LondonKineticWordmark,
  barcelona: BarcelonaKineticWordmark,
  amsterdam: AmsterdamKineticWordmark,
  prague: PragueKineticWordmark,
  iceland: IcelandKineticWordmark,
};

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.id }));
}

const titleCase = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

/** "Rome, Italy" — or just "Iceland" where the stop is the whole country. */
function placeName(destination: Destination): string {
  const country = titleCase(destination.country);
  return destination.city.toLowerCase() === country.toLowerCase() ? destination.city : `${destination.city}, ${country}`;
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const destination = getDestinationById(params.id);
  // Unknown ids render notFound(): keep them out of the index, no canonical.
  if (!destination) return { robots: { index: false, follow: false } };

  // Paris also has the long-form /paris deep-dive; this page is explicitly
  // the overview so the two don't compete for the same query.
  const title = destination.deepDiveHref
    ? `${placeName(destination)} — Destination Overview`
    : `${placeName(destination)} — Destination Guide`;

  return pageMetadata({
    title,
    description: `${destination.tagline} ${destination.overview}`,
    path: `/destinations/${destination.id}`,
    image: destination.photoSrc,
    imageAlt: `${destination.city}, ${titleCase(destination.country)}`,
    ogType: "article",
  });
}

export default function DestinationPage({ params }: { params: { id: string } }) {
  const destination = getDestinationById(params.id);
  if (!destination) notFound();

  const KineticWordmark = KINETIC_WORDMARKS[destination.id];

  // This destination's real place on the Grand Tour route (lib/europeGeo.ts's
  // geographic travel order) — replaces the old standalone map section with
  // concrete route data instead. The "Next destination" cross-link at the
  // foot of the page follows the same order (wrapping from the last stop
  // back to the first), so the page's two "next" links never disagree.
  const routeIndex = JOURNEY_ROUTE_ORDER.indexOf(destination.id);
  const next = getDestination(JOURNEY_ROUTE_ORDER[(routeIndex + 1) % JOURNEY_ROUTE_ORDER.length]);
  const prevStop = routeIndex > 0 ? getDestination(JOURNEY_ROUTE_ORDER[routeIndex - 1]) : null;
  const nextStop =
    routeIndex >= 0 && routeIndex < JOURNEY_ROUTE_ORDER.length - 1
      ? getDestination(JOURNEY_ROUTE_ORDER[routeIndex + 1])
      : null;
  const legFrom = (other: typeof destination) => {
    const km = Math.round(haversineKm(destination.coordinates, other.coordinates));
    const { hours, mode } = estimateTravelTime(km);
    return { km, hours, mode };
  };

  const pageUrl = absoluteUrl(`/destinations/${destination.id}`);
  const images = [destination.photoSrc ?? DEFAULT_OG_IMAGE, ...(destination.galleryPhotos ?? []).map((p) => p.src)].map(
    (src) => absoluteUrl(src)
  );

  return (
    <main className="bg-void">
      {/* Descriptive only — no offers, prices or bookable claims. */}
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "@id": `${pageUrl}#destination`,
            name: destination.city,
            description: destination.overview,
            url: pageUrl,
            image: images,
            geo: {
              "@type": "GeoCoordinates",
              latitude: destination.coordinates.lat,
              longitude: destination.coordinates.lon,
            },
            containedInPlace: { "@type": "Country", name: titleCase(destination.country) },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Destinations", item: absoluteUrl("/destinations") },
              { "@type": "ListItem", position: 3, name: destination.city, item: pageUrl },
            ],
          },
        ]}
      />
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
        <div className="absolute inset-0">
          {destination.photoSrc ? (
            <DestinationPhotoBackdrop
              photos={[destination.photoSrc, ...(destination.galleryPhotos ?? []).map((p) => p.src)]}
              sky={destination.sky}
              accent={destination.accent}
            />
          ) : (
            <DestinationGradientBackdrop sky={destination.sky} accent={destination.accent} />
          )}
        </div>
        <AtmosphereParticles kind={destination.atmosphere} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(11,12,14,0) 40%, rgba(11,12,14,0.55) 78%, rgba(11,12,14,0.92) 100%)" }}
        />

        <DestinationSpecimenFrame destination={destination} />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
          <div className="dest-hero-fade max-w-3xl">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: destination.accent }}>
              {destination.eyebrow}
            </div>
            {KineticWordmark ? (
              <KineticWordmark accent={destination.accent} />
            ) : (
              <h1
                className="text-balance font-display font-light leading-[0.92] tracking-[-0.03em] text-bone"
                style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
              >
                {destination.city}
              </h1>
            )}
            <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[17px]">
              {destination.tagline}
            </p>
            {destination.deepDiveHref && (
              <Link
                href={destination.deepDiveHref}
                className="group mt-8 inline-flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-bone"
              >
                Experience it in motion
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Overview ---------- */}
      <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -top-32 -right-24 h-[380px] w-[380px] rounded-full blur-[130px]"
            style={{ background: destination.accent, opacity: 0.12 }}
          />
        </div>
        <div className="mx-auto max-w-3xl">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">Overview</h2>
          <p className="mt-6 text-balance font-display text-[22px] font-light leading-[1.5] text-bone md:text-[28px]">
            {destination.overview}
          </p>
        </div>
      </section>

      {/* ---------- History & Culture ---------- */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-panel">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full blur-[140px]"
            style={{ background: destination.accent, opacity: 0.1 }}
          />
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-14 px-6 py-20 md:grid-cols-2 md:gap-16 md:px-10 md:py-28">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">History</h2>
            <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[16px]">
              {destination.history}
            </p>
          </div>
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">Culture</h2>
            <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[16px]">
              {destination.culture}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      {destination.galleryPhotos && destination.galleryPhotos.length > 0 && (
        <section className="border-t border-white/[0.06] bg-panel px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">In frame</h2>
            <div className="mt-8">
              <DestinationPhotoGallery photos={destination.galleryPhotos} accent={destination.accent} />
            </div>
          </div>
        </section>
      )}

      {/* ---------- Grand Tour route ---------- */}
      {(prevStop || nextStop) && (
        <section className="border-t border-white/[0.06] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              On the Grand Tour — stop {String(routeIndex + 1).padStart(2, "0")} of {JOURNEY_ROUTE_ORDER.length}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {prevStop && (
                <Link
                  href={`/destinations/${prevStop.id}`}
                  className="group flex flex-col border-l-2 py-1 pl-6 transition-colors"
                  style={{ borderColor: `${prevStop.accent}55` }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
                    ← Previous stop
                  </span>
                  <span className="mt-2 font-display text-2xl font-light tracking-[-0.02em] text-bone transition-colors group-hover:text-mist">
                    {prevStop.city}
                  </span>
                  <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
                    {legFrom(prevStop).km.toLocaleString()} km · ~{legFrom(prevStop).hours.toFixed(1)} hrs · {legFrom(prevStop).mode}
                  </span>
                </Link>
              )}
              {nextStop ? (
                <Link
                  href={`/destinations/${nextStop.id}`}
                  className="group flex flex-col border-l-2 py-1 pl-6 text-left transition-colors md:items-end md:border-l-0 md:border-r-2 md:pl-0 md:pr-6 md:text-right"
                  style={{ borderColor: `${nextStop.accent}55` }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
                    Next stop →
                  </span>
                  <span className="mt-2 font-display text-2xl font-light tracking-[-0.02em] text-bone transition-colors group-hover:text-mist">
                    {nextStop.city}
                  </span>
                  <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
                    {legFrom(nextStop).km.toLocaleString()} km · ~{legFrom(nextStop).hours.toFixed(1)} hrs · {legFrom(nextStop).mode}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col py-1 text-left md:items-end md:text-right">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">Journey&rsquo;s end</span>
                  <span className="mt-2 font-display text-2xl font-light tracking-[-0.02em] text-bone">
                    The tour closes here
                  </span>
                </div>
              )}
            </div>
            <div className="mt-10">
              <Link href="/journeys" className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-bone">
                See the full Grand Tour →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Practical info ---------- */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-panel">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -top-24 right-[10%] h-[340px] w-[340px] rounded-full blur-[130px]"
            style={{ background: destination.accent, opacity: 0.1 }}
          />
        </div>
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20 md:flex-row md:justify-between md:px-10 md:py-28">
          <div className="max-w-md">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">Travel tip</h2>
            <p className="mt-3 text-[15px] font-light leading-relaxed text-mist md:text-[16px]">{destination.travelTip}</p>
          </div>
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">Best season</h2>
            <div className="mt-3 font-mono text-[13px] uppercase tracking-[0.18em] text-mist">{destination.bestSeason}</div>
          </div>
        </div>
      </section>

      {/* ---------- Cross-navigation ---------- */}
      <section className="border-t border-white/[0.06] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">Next destination</h2>
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
