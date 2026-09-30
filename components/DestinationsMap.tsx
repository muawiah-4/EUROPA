"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DESTINATIONS, getDestination, haversineKm } from "@/lib/journey";
import { JOURNEY_ROUTE_ORDER, MAP_HEIGHT, MAP_WIDTH, estimateTravelTime, projectLatLon } from "@/lib/europeGeo";

const ROUTE = JOURNEY_ROUTE_ORDER.map(getDestination);

// Real bounding box this projection covers (see lib/europeGeo.ts) — shown
// verbatim in the plate stamp so the "real coordinates" claim is checkable,
// not just asserted.
const BOUNDS_LABEL = "34°–67°N · 25°W–33°E";

// A handful of faint reference lines (not a literal landmass trace) —
// enough to read as a cartographic instrument with real spatial structure,
// without the scattered-dot "star field" look this replaced.
const GRATICULE_X = [0.2, 0.4, 0.6, 0.8];
const GRATICULE_Y = [0.25, 0.5, 0.75];

// One-accent rule: all ten cities share this map at once, so markers and
// route legs stay neutral at rest and only the hovered/focused one turns
// mint — per-destination accents are reserved for a destination's own page.
// Resting labels sit at mist/65 (~5.2:1 on the plate) rather than an
// accent at 55% opacity (which fell to ~2–3:1 for the darker accents).
// Literal channels (= --mist / --mint in app/globals.css) rather than
// var(): SVG presentation attributes and Framer Motion's colour
// interpolation both need a concrete colour.
const MARKER_REST = "rgb(195, 199, 206)";
const MARKER_GLOW = "rgba(195, 199, 206, 0.45)";
const MARKER_ACTIVE = "rgb(59, 186, 156)";
const LABEL_REST = "rgba(195, 199, 206, 0.65)";
const ROUTE_REST = "rgba(195, 199, 206, 0.7)";
const ROUTE_ACTIVE = "rgb(59, 186, 156)";

function CornerBracket({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const isTop = corner === "tl" || corner === "tr";
  const isLeft = corner === "tl" || corner === "bl";
  return (
    <div
      className={[
        "pointer-events-none absolute h-4 w-4 md:h-5 md:w-5",
        isTop ? "top-4 md:top-5" : "bottom-4 md:bottom-5",
        isLeft ? "left-4 md:left-5" : "right-4 md:right-5",
      ].join(" ")}
    >
      <div className={["absolute h-px w-full bg-mist/40", isTop ? "top-0" : "bottom-0"].join(" ")} />
      <div className={["absolute h-full w-px bg-mist/40", isLeft ? "left-0" : "right-0"].join(" ")} />
    </div>
  );
}

/**
 * Permanent, always-on map for the /destinations index (and the About
 * page's embed) — a second, genuine way to navigate alongside the card
 * grid. Every city sits at its real projected lat/lon (see
 * lib/europeGeo.ts) and the connecting line traces the Grand Tour's actual
 * geographic route order.
 *
 * Framed as a cataloged instrument rather than a floating line drawing:
 * a bordered plate with corner brackets and a coordinate stamp (matching
 * DestinationSpecimenFrame's idiom), a faint graticule for spatial context,
 * and gradient-glow arcs between cities instead of flat dashed lines. Route
 * legs surface their real distance/time/mode on hover as a typographic
 * tooltip rather than a drawn transport icon — small icon glyphs don't
 * survive being rendered at this scale.
 */
export default function DestinationsMap() {
  const [active, setActive] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const gradientIdBase = useId();

  const segments = ROUTE.slice(0, -1).map((d, i) => {
    const next = ROUTE[i + 1];
    const a = projectLatLon(d.coordinates.lat, d.coordinates.lon);
    const b = projectLatLon(next.coordinates.lat, next.coordinates.lon);
    const km = haversineKm(d.coordinates, next.coordinates);
    const { hours, mode } = estimateTravelTime(km);

    // Gentle outward arc instead of a straight segment — every curve bows
    // the same rotational direction (perpendicular-left of travel), which
    // is what makes a set of flight-path lines read as one drawn system
    // rather than a jumble of arbitrary bends.
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const bow = len * 0.14;
    const mid = { x: (a.x + b.x) / 2 + nx * bow, y: (a.y + b.y) / 2 + ny * bow };

    return { from: d, to: next, a, b, mid, km: Math.round(km), hours, mode };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-4xl overflow-hidden border border-white/[0.08]"
      style={{
        aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
        background: "radial-gradient(ellipse at 50% 32%, #0f1319 0%, #07080a 62%, #050506 100%)",
      }}
    >
      <CornerBracket corner="tl" />
      <CornerBracket corner="tr" />
      <CornerBracket corner="bl" />
      <CornerBracket corner="br" />

      {/* Plate stamp — same "cataloged instrument" idiom as DestinationSpecimenFrame */}
      <div className="pointer-events-none absolute left-4 top-4 md:left-5 md:top-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-mist/70 md:text-[10px]">
          The Grand Tour
        </div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-smoke md:text-[10px]">
          {BOUNDS_LABEL}
        </div>
      </div>
      <div className="pointer-events-none absolute left-4 bottom-4 md:left-5 md:bottom-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-smoke md:text-[10px]">
          {ROUTE.length} stops · equirectangular proj.
        </div>
      </div>

      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id={`${gradientIdBase}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.55" />
          </filter>
        </defs>

        {/* Graticule — faint spatial reference, not a landmass trace */}
        <g opacity={0.07}>
          {GRATICULE_X.map((f) => (
            <line key={`x${f}`} x1={MAP_WIDTH * f} y1={0} x2={MAP_WIDTH * f} y2={MAP_HEIGHT} stroke="#c3c7ce" strokeWidth={0.04} />
          ))}
          {GRATICULE_Y.map((f) => (
            <line key={`y${f}`} x1={0} y1={MAP_HEIGHT * f} x2={MAP_WIDTH} y2={MAP_HEIGHT * f} stroke="#c3c7ce" strokeWidth={0.04} />
          ))}
        </g>

        {segments.map((s, i) => {
          const isHovered = hoveredSegment === i;
          const path = `M ${s.a.x} ${s.a.y} Q ${s.mid.x} ${s.mid.y} ${s.b.x} ${s.b.y}`;
          const dash = s.mode === "flight" ? "0.6 0.5" : "0.12 0.28";
          return (
            <g key={s.from.id}>
              {/* Soft glow duplicate, brightens on hover */}
              <path
                d={path}
                fill="none"
                stroke={isHovered ? ROUTE_ACTIVE : ROUTE_REST}
                strokeWidth={isHovered ? 0.5 : 0.32}
                opacity={isHovered ? 0.55 : 0.28}
                filter={`url(#${gradientIdBase}-glow)`}
                style={{ transition: "stroke 200ms ease-out, stroke-width 200ms ease-out, opacity 200ms ease-out" }}
              />
              {/* Crisp line on top, dash style itself encodes the mode */}
              <path
                d={path}
                fill="none"
                stroke={isHovered ? ROUTE_ACTIVE : ROUTE_REST}
                strokeWidth={0.075}
                strokeDasharray={dash}
                strokeLinecap="round"
                opacity={isHovered ? 1 : 0.75}
                style={{ transition: "stroke 200ms ease-out, opacity 200ms ease-out" }}
              />
              {/* Generous invisible hit-area along the curve for the hover tooltip */}
              <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={1.4}
                onMouseEnter={() => setHoveredSegment(i)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip — real leg data as typography, not a drawn icon */}
      {segments.map((s, i) => {
        const pos = { x: (s.mid.x / MAP_WIDTH) * 100, y: (s.mid.y / MAP_HEIGHT) * 100 };
        return (
          <div
            key={s.from.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border bg-elevated px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-mist transition-opacity duration-200"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              opacity: hoveredSegment === i ? 1 : 0,
              borderColor: "rgb(var(--bone) / 0.16)",
            }}
          >
            {s.km.toLocaleString()} km · ~{s.hours.toFixed(1)} hrs · {s.mode}
          </div>
        );
      })}

      {DESTINATIONS.map((d) => {
        const p = projectLatLon(d.coordinates.lat, d.coordinates.lon);
        const pos = { x: (p.x / MAP_WIDTH) * 100, y: (p.y / MAP_HEIGHT) * 100 };
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
              initial={{ width: 7, height: 7, backgroundColor: MARKER_REST }}
              animate={{
                width: isActive ? 13 : 7,
                height: isActive ? 13 : 7,
                backgroundColor: isActive ? MARKER_ACTIVE : MARKER_REST,
                boxShadow: isActive
                  ? `0 0 22px ${MARKER_ACTIVE}`
                  : [`0 0 6px ${MARKER_GLOW}`, `0 0 13px ${MARKER_GLOW}`, `0 0 6px ${MARKER_GLOW}`],
              }}
              transition={
                isActive ? { duration: 0.25 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut", backgroundColor: { duration: 0.3 } }
              }
            />

            {/* Resting label — always-on city name, dims when the full card takes over */}
            <span
              className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity duration-300"
              style={{ color: LABEL_REST, opacity: isActive ? 0 : 1 }}
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
              style={{ borderColor: "rgb(var(--mint) / 0.45)" }}
            >
              {/* Mint lives on the card's edge, not the 10px label: mint on
                  elevated is only ~4.4:1, mist is ~6.3:1. */}
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
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
