"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DESTINATIONS } from "@/lib/journey";

// Hand-placed constellation coordinates (percent of container), adapted from
// the homepage's InteractiveMap — an artistic arrangement echoing each
// city's rough relative position in Europe, not a literal map projection.
const POSITIONS: Record<string, { x: number; y: number }> = {
  paris: { x: 34, y: 32 },
  london: { x: 26, y: 20 },
  amsterdam: { x: 40, y: 22 },
  barcelona: { x: 28, y: 62 },
  rome: { x: 54, y: 58 },
  venice: { x: 56, y: 44 },
  santorini: { x: 70, y: 72 },
  alps: { x: 46, y: 42 },
};

const ORDERED = [...DESTINATIONS].sort((a, b) => a.index - b.index);

/**
 * Permanent, always-on constellation map for the /destinations index —
 * a second, genuine way to navigate alongside the card grid. Unlike the
 * homepage's scroll-gated InteractiveMap, this one carries no visibility
 * window: it simply lives in the page and plays its entrance once, the
 * same way GhostHeading and the rest of this system's sections do.
 */
export default function DestinationsMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto aspect-[16/10] w-full max-w-4xl"
    >
      <svg
        viewBox="0 0 100 75"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-25"
        aria-hidden
      >
        {ORDERED.slice(0, -1).map((d, i) => {
          const a = POSITIONS[d.id];
          const b = POSITIONS[ORDERED[i + 1].id];
          if (!a || !b) return null;
          return <line key={d.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6b6a66" strokeWidth="0.15" />;
        })}
      </svg>

      {ORDERED.map((d) => {
        const pos = POSITIONS[d.id];
        if (!pos) return null;
        const isActive = active === d.id;

        const nearLeft = pos.x < 30;
        const nearRight = pos.x > 68;
        const nearTop = pos.y < 25;

        return (
          <Link
            key={d.id}
            href={`/destinations/${d.id}`}
            aria-label={`View ${d.city}, ${d.country} — ${d.tagline}`}
            onMouseEnter={() => setActive(d.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(d.id)}
            onBlur={() => setActive(null)}
            className="group absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-bone/70"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <motion.span
              className="block rounded-full"
              initial={{ width: 7, height: 7 }}
              animate={{
                width: isActive ? 13 : 7,
                height: isActive ? 13 : 7,
                boxShadow: isActive
                  ? `0 0 22px ${d.accent}`
                  : [`0 0 6px ${d.accent}`, `0 0 13px ${d.accent}`, `0 0 6px ${d.accent}`],
              }}
              transition={
                isActive ? { duration: 0.25 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
              }
              style={{ background: d.accent }}
            />

            {/* Resting label — always-on city name, dims when the full card takes over */}
            <span
              className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity duration-300"
              style={{ color: d.accent, opacity: isActive ? 0 : 0.55 }}
            >
              {d.city}
            </span>

            {/* Floating detail card — real presence, flat elevation, no shadow */}
            <div
              role="presentation"
              className={`pointer-events-none absolute z-10 w-48 border bg-elevated px-4 py-3 text-left transition-opacity duration-300 sm:w-56 ${
                isActive ? "opacity-100" : "opacity-0"
              } ${nearTop ? "top-full mt-5" : "bottom-full mb-5"} ${
                nearLeft ? "left-0" : nearRight ? "right-0" : "left-1/2 -translate-x-1/2"
              }`}
              style={{ borderColor: "rgba(242,239,233,0.14)" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: d.accent }}>
                {d.country}
              </div>
              <div className="mt-1 font-display text-lg font-light leading-tight text-bone">{d.city}</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-mist">{d.tagline}</p>
            </div>
          </Link>
        );
      })}
    </motion.div>
  );
}
