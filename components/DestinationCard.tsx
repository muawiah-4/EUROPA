import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/journey";
import AtmosphereParticles from "@/components/AtmosphereParticles";

export default function DestinationCard({ destination }: { destination: Destination }) {
  const number = String(destination.index).padStart(2, "0");

  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group relative block overflow-hidden bg-panel outline-none transition-colors duration-500 focus-visible:outline-none"
      style={{ border: "1px solid rgb(var(--bone) / 0.08)" }}
    >
      {/* Art */}
      <div
        className="relative h-64 overflow-hidden sm:h-72 lg:h-80"
        style={{ background: `linear-gradient(180deg, ${destination.sky[0]}, ${destination.sky[1]})` }}
      >
        {/* Real photo, same grading recipe as IconsOfEurope's cards — these
            cards previously showed only the gradient + particle backdrop,
            no photography at all. */}
        {destination.photoSrc && (
          <Image
            src={destination.photoSrc}
            alt=""
            fill
            sizes="(min-width: 640px) 380px, 85vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
            style={{ filter: "grayscale(0.35) sepia(0.2) saturate(0.6) brightness(0.55) contrast(1.1)" }}
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${destination.sky[0]}, ${destination.sky[1]})`,
            mixBlendMode: "color",
            opacity: 0.7,
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-70">
          <AtmosphereParticles kind={destination.atmosphere} />
        </div>

        {/* Accent glow — dormant until hover, then a real color moment
            rather than just the hairline below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${destination.accent}40, transparent 65%)` }}
        />

        {/* Top scrim for label legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{ background: "linear-gradient(180deg, rgba(11,12,14,0.55), transparent)" }}
        />
        {/* Bottom scrim, blends into the text panel below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(0deg, rgb(var(--panel)), transparent)" }}
        />

        {/* Index / country eyebrow */}
        <div className="absolute left-5 top-5 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em]">
          <span style={{ color: destination.accent }}>{number}</span>
          <span className="text-mist/80">{destination.country}</span>
        </div>

        {/* Accent hairline, brightens on hover */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
          style={{ background: destination.accent }}
        />
      </div>

      {/* Copy */}
      <div className="relative px-6 py-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${destination.accent}12, transparent 60%)` }}
        />
        <h3 className="relative font-display text-2xl font-light leading-tight text-bone">{destination.city}</h3>
        <p className="relative mt-3 max-w-[34ch] text-[13px] leading-relaxed text-mist">{destination.tagline}</p>

        <div
          className="relative mt-6 flex items-center justify-between border-t pt-4"
          style={{ borderColor: "rgb(var(--bone) / 0.08)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke transition-colors duration-300 group-hover:text-bone">
            View destination
          </span>
          <span
            aria-hidden
            className="translate-x-0 font-mono text-sm transition-transform duration-300 ease-out group-hover:translate-x-1"
            style={{ color: destination.accent }}
          >
            &rarr;
          </span>
        </div>
      </div>

      {/* Hover border tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ border: `1px solid ${destination.accent}55` }}
      />
    </Link>
  );
}
