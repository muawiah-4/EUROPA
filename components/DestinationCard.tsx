"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Destination } from "@/lib/journey";
import { LANDMARK_SHAPES } from "@/lib/landmarkShapes";
import AtmosphereParticles from "@/components/AtmosphereParticles";

// Client-only: this card renders inside a server-rendered grid
// (app/destinations/page.tsx), and the WebGL canvas must never run on the
// server.
const FloatingLandmark = dynamic(() => import("@/components/three/FloatingLandmark"), { ssr: false });

/**
 * Mounts the 3D landmark canvas only once the card scrolls near the
 * viewport. /destinations renders 8 cards at once — mounting 8 live WebGL
 * canvases simultaneously would be a real performance risk, so each card's
 * canvas stays unmounted (just the sky gradient + particles showing)
 * until it's actually about to be seen.
 */
function LazyLandmarkArt({ destination }: { destination: Destination }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = hostRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  const shapes = LANDMARK_SHAPES[destination.id];

  return (
    <div ref={hostRef} className="absolute inset-0">
      {visible && shapes ? <FloatingLandmark shapes={shapes} accent={destination.accent} interactive={false} /> : null}
    </div>
  );
}

export default function DestinationCard({ destination }: { destination: Destination }) {
  const number = String(destination.index).padStart(2, "0");

  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group relative block overflow-hidden bg-panel outline-none transition-colors duration-500 focus-visible:outline-none"
      style={{ border: "1px solid rgba(242,239,233,0.08)" }}
    >
      {/* Art */}
      <div
        className="relative h-64 overflow-hidden sm:h-72 lg:h-80"
        style={{ background: `linear-gradient(180deg, ${destination.sky[0]}, ${destination.sky[1]})` }}
      >
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]">
          <LazyLandmarkArt destination={destination} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-70">
          <AtmosphereParticles kind={destination.atmosphere} />
        </div>

        {/* Top scrim for label legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{ background: "linear-gradient(180deg, rgba(5,5,6,0.55), transparent)" }}
        />
        {/* Bottom scrim, blends into the text panel below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(0deg, var(--panel), transparent)" }}
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
        <h3 className="font-display text-2xl font-light leading-tight text-bone">{destination.city}</h3>
        <p className="mt-3 max-w-[34ch] text-[13px] leading-relaxed text-mist">{destination.tagline}</p>

        <div
          className="mt-6 flex items-center justify-between border-t pt-4"
          style={{ borderColor: "rgba(242,239,233,0.08)" }}
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
