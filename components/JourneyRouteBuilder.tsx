"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getDestination, haversineKm, type DestinationId } from "@/lib/journey";
import { STOPS_PARAM, parseStops, stopsQuery, toRouteOrder } from "@/lib/routeStops";
import { JOURNEY_ROUTE_ORDER, MAP_HEIGHT, MAP_WIDTH, STAY_DURATIONS, estimateTravelTime, projectLatLon } from "@/lib/europeGeo";
import AtmosphereParticles from "@/components/AtmosphereParticles";

// All ten stops, precomputed once — the builder always shows every city as
// a clickable option; only *which of them are selected* changes.
const ALL_STOPS = JOURNEY_ROUTE_ORDER.map(getDestination);

// One-accent rule: all ten cities are on this map at once, so unselected
// stops rest neutral and the chosen route (dots, legs, chips) is mint — no
// per-destination accents here. Literal channels of --mist / --mint (see
// app/globals.css): SVG attributes and Framer Motion colour interpolation
// can't resolve var(). Resting labels at mist/70 ≈ 4.8:1+ on the panel.
const MARKER_REST = "rgb(195, 199, 206)";
const MARKER_GLOW = "rgba(195, 199, 206, 0.45)";
const MARKER_ACTIVE = "rgb(59, 186, 156)";
const LABEL_REST = "rgba(195, 199, 206, 0.7)";
const ROUTE_COLOR = "rgb(59, 186, 156)";

const POSITIONS: Record<string, { x: number; y: number }> = (() => {
  const map: Record<string, { x: number; y: number }> = {};
  for (const d of ALL_STOPS) {
    const p = projectLatLon(d.coordinates.lat, d.coordinates.lon);
    map[d.id] = { x: (p.x / MAP_WIDTH) * 100, y: (p.y / MAP_HEIGHT) * 100 };
  }
  return map;
})();

// ---------- Shareable route URL: /journeys?stops=london,paris,rome ----------
// Parsing/serializing lives in lib/routeStops.ts (unit tested).

/**
 * URL-synced builder. Reads the initial route from `?stops=` and keeps the
 * query in step with the selection via router.replace (no history entry
 * per click). useSearchParams() needs a <Suspense> boundary in the page —
 * app/journeys/page.tsx wraps this and uses JourneyRouteBuilderFallback as
 * the server-rendered fallback.
 */
export default function JourneyRouteBuilder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [initialStops] = useState(() => parseStops(searchParams.get(STOPS_PARAM)));

  // Latest params/router in a ref so the builder's change effect can stay
  // keyed on the route itself, not on the callback's identity.
  const latest = useRef({ searchParams, router, pathname });
  latest.current = { searchParams, router, pathname };

  const syncUrl = useCallback((ids: readonly DestinationId[]) => {
    const { searchParams: params, router: r, pathname: path } = latest.current;
    const current = params.get(STOPS_PARAM);
    const next = ids.join(",");
    if ((current ?? "") === next && (next !== "" || current === null)) return;
    const rest = new URLSearchParams(params.toString());
    rest.delete(STOPS_PARAM);
    const other = rest.toString();
    const query = [ids.length > 0 ? `${STOPS_PARAM}=${next}` : "", other].filter(Boolean).join("&");
    r.replace(query ? `${path}?${query}` : path, { scroll: false });
  }, []);

  return <RouteBuilder initialStops={initialStops} onRouteChange={syncUrl} />;
}

/** Static, URL-agnostic render of the builder for the page's Suspense fallback. */
export function JourneyRouteBuilderFallback() {
  return <RouteBuilder initialStops={[]} />;
}

function RouteBuilder({
  initialStops,
  onRouteChange,
}: {
  initialStops: readonly DestinationId[];
  onRouteChange?: (ids: readonly DestinationId[]) => void;
}) {
  // Starts from the shared link's stops when there are any, otherwise empty
  // rather than pre-selecting a few — starting blank keeps the "you pick,
  // it draws" mechanic unambiguous: nothing on the map is "the" route
  // until you choose it to be.
  const [selected, setSelected] = useState<Set<DestinationId>>(() => new Set(initialStops));
  const gradientIdBase = useId();
  const linkFieldId = useId();

  const toggle = (id: DestinationId) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Selection order is whatever order the user happened to click in, but
  // the route itself is always drawn in real geographic order (the same
  // JOURNEY_ROUTE_ORDER the rest of the site uses) — picking Rome before
  // London shouldn't zigzag the line backwards across the continent.
  const orderedStops = useMemo(
    () => toRouteOrder(selected).map(getDestination),
    [selected]
  );

  const legs = useMemo(
    () =>
      orderedStops.slice(0, -1).map((from, i) => {
        const to = orderedStops[i + 1];
        const km = Math.round(haversineKm(from.coordinates, to.coordinates));
        return { from, to, km, travel: estimateTravelTime(km) };
      }),
    [orderedStops]
  );

  const totalKm = legs.reduce((sum, l) => sum + l.km, 0);
  const totalDays = orderedStops.reduce((sum, d) => sum + STAY_DURATIONS[d.id], 0);
  const totalTravelHours = legs.reduce((sum, l) => sum + l.travel.hours, 0);

  // The URL always carries the canonical (geographic) order, so the same
  // set of cities always produces the same link.
  const routeIds = useMemo(() => orderedStops.map((d) => d.id), [orderedStops]);
  const routeKey = routeIds.join(",");

  const onRouteChangeRef = useRef(onRouteChange);
  onRouteChangeRef.current = onRouteChange;

  // Copy-link state: "manual" means the Clipboard API was unavailable or
  // refused, so the link is shown in a selected text field instead.
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const [shareUrl, setShareUrl] = useState("");
  const linkFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onRouteChangeRef.current?.(routeIds);
    // Any previously copied/shown link is stale once the route changes.
    setCopyState("idle");
    // routeKey captures routeIds' content; the array identity is irrelevant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  useEffect(() => {
    if (copyState === "copied") {
      const t = setTimeout(() => setCopyState("idle"), 3000);
      return () => clearTimeout(t);
    }
    if (copyState === "manual") {
      linkFieldRef.current?.focus();
      linkFieldRef.current?.select();
    }
  }, [copyState, shareUrl]);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}${stopsQuery(routeIds)}`;
    setShareUrl(url);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  };

  return (
    <div className="relative">
      {/* Map card */}
      <div
        className="relative overflow-hidden bg-panel px-6 py-10 md:px-12 md:py-14"
        style={{ border: "1px solid rgb(var(--bone) / 0.08)" }}
      >
        {/* Grayscale wash, matching the user-supplied monochrome background
            palette — was a multi-destination-accent blend (this card picks
            freely across the whole continent, so it used to earn the same
            "several accents at once" license the Destinations page used). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(120deg, #f8f8f920, transparent 30%, #c3c7ce16 55%, transparent 78%, #f8f8f922)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <AtmosphereParticles kind="mist-shimmer" />
        </div>

        <div className="relative flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
          <div className="md:w-[38%]">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mist/80">Build your own</div>
            <h2 className="mt-4 font-display text-3xl font-light leading-[1.05] tracking-[-0.02em] text-bone md:text-4xl">
              Pick your places.
              <br />
              Draw your line.
            </h2>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-mist">
              Choose any of the ten destinations, on the map or below. However many you pick, the
              route connects them in real geographic order — never a zigzag based on the order you
              clicked.
            </p>

            {/* Selection chips — the same toggle as the map dots, easier
                to hit precisely on touch and legible without hovering. */}
            <div className="mt-6 flex flex-wrap gap-2">
              {ALL_STOPS.map((d) => {
                const isSelected = selected.has(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggle(d.id)}
                    aria-pressed={isSelected}
                    data-cursor="link"
                    className="rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
                    style={{
                      borderColor: isSelected ? "rgb(var(--mint))" : "rgb(var(--bone) / 0.14)",
                      color: isSelected ? "rgb(var(--mint))" : "rgb(var(--mist))",
                      background: isSelected ? "rgb(var(--mint) / 0.09)" : "transparent",
                    }}
                  >
                    {d.city}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/80">Distance</div>
                <div className="mt-1 font-mono text-[13px] uppercase tracking-[0.14em] text-mist">
                  {orderedStops.length === 0 ? "—" : `${totalKm.toLocaleString()} km`}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/80">On the ground</div>
                <div className="mt-1 font-mono text-[13px] uppercase tracking-[0.14em] text-mist">
                  {orderedStops.length === 0 ? "—" : `${totalDays} days`}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/80">In transit</div>
                <div className="mt-1 font-mono text-[13px] uppercase tracking-[0.14em] text-mist">
                  {orderedStops.length === 0 ? "—" : `~${Math.round(totalTravelHours)} hrs`}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/80">Stops</div>
                <div className="mt-1 font-mono text-[13px] uppercase tracking-[0.14em] text-mist">
                  {orderedStops.length === 0 ? "—" : `${orderedStops.length} ${orderedStops.length === 1 ? "city" : "cities"}`}
                </div>
              </div>
            </div>

            {selected.size > 0 && (
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                <button
                  type="button"
                  onClick={copyLink}
                  data-cursor="link"
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-bone"
                >
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  data-cursor="link"
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist/80 transition-colors hover:text-bone"
                >
                  Clear trip
                </button>
              </div>
            )}

            {/* Fallback when the Clipboard API is unavailable or refused:
                the link is shown here, focused and pre-selected, so a
                single Ctrl/⌘+C copies it. */}
            {copyState === "manual" && selected.size > 0 && (
              <div className="mt-5 max-w-sm">
                <label htmlFor={linkFieldId} className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/80">
                  Route link
                </label>
                <input
                  ref={linkFieldRef}
                  id={linkFieldId}
                  type="text"
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="mt-2 w-full bg-transparent px-3 py-2 font-mono text-[11px] tracking-[0.04em] text-mist outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-bone/70"
                  style={{ border: "1px solid rgb(var(--bone) / 0.14)" }}
                />
              </div>
            )}

            {/* Always mounted so screen readers pick up the change politely. */}
            <p
              role="status"
              aria-live="polite"
              className={`font-mono text-[10px] uppercase tracking-[0.2em] ${copyState === "idle" ? "" : "mt-3"} ${
                copyState === "copied" ? "text-mint" : "text-mist"
              }`}
            >
              {copyState === "copied"
                ? "Link copied"
                : copyState === "manual"
                  ? "Couldn’t copy automatically — the link is selected, press Ctrl+C or ⌘C"
                  : ""}
            </p>
          </div>

          {/* Map */}
          <div className="relative w-full md:w-[62%]" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
            {/* Real Europe outline, sitting directly behind the pins/route —
                inverted (the source is gray-on-white) then color-washed with
                the panel tone so it reads as a dark map plate rather than a
                pasted photo, at low opacity so it stays a backdrop, not a
                second focal layer competing with the pins. Not a
                geographically-precise registration (this image carries no
                projection metadata to align against lib/europeGeo.ts's
                bounds), but positioned/scaled to sit under the same
                continental area the pins occupy. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <Image
                src="/maps/europe-outline.jpg"
                alt=""
                fill
                sizes="700px"
                className="object-contain"
                style={{ filter: "invert(1) brightness(0.9) contrast(0.9)", opacity: 0.4 }}
              />
              <div aria-hidden className="absolute inset-0" style={{ background: "rgb(var(--panel))", mixBlendMode: "color", opacity: 0.7 }} />
            </div>

            <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <filter id={`${gradientIdBase}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.5" />
                </filter>
              </defs>
              {legs.map((l) => {
                const a = { x: (POSITIONS[l.from.id].x / 100) * MAP_WIDTH, y: (POSITIONS[l.from.id].y / 100) * MAP_HEIGHT };
                const b = { x: (POSITIONS[l.to.id].x / 100) * MAP_WIDTH, y: (POSITIONS[l.to.id].y / 100) * MAP_HEIGHT };
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const len = Math.hypot(dx, dy) || 1;
                const nx = -dy / len;
                const ny = dx / len;
                const bow = len * 0.14;
                const mid = { x: (a.x + b.x) / 2 + nx * bow, y: (a.y + b.y) / 2 + ny * bow };
                const path = `M ${a.x} ${a.y} Q ${mid.x} ${mid.y} ${b.x} ${b.y}`;
                return (
                  <g key={`${l.from.id}-${l.to.id}`}>
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={ROUTE_COLOR}
                      strokeWidth={0.5}
                      filter={`url(#${gradientIdBase}-glow)`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={ROUTE_COLOR}
                      strokeWidth={0.08}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </g>
                );
              })}
            </svg>

            {ALL_STOPS.map((d) => {
              const pos = POSITIONS[d.id];
              const isSelected = selected.has(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggle(d.id)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Remove" : "Add"} ${d.city}`}
                  data-cursor="link"
                  className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-bone/70"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.span
                    className="block rounded-full"
                    initial={{ backgroundColor: MARKER_REST }}
                    animate={{
                      width: isSelected ? 11 : 6,
                      height: isSelected ? 11 : 6,
                      backgroundColor: isSelected ? MARKER_ACTIVE : MARKER_REST,
                      boxShadow: isSelected
                        ? `0 0 14px ${MARKER_ACTIVE}`
                        : [`0 0 3px ${MARKER_GLOW}`, `0 0 8px ${MARKER_GLOW}`, `0 0 3px ${MARKER_GLOW}`],
                    }}
                    transition={
                      isSelected
                        ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                        : { duration: 3.2, repeat: Infinity, ease: "easeInOut", backgroundColor: { duration: 0.3 } }
                    }
                    style={{ opacity: isSelected ? 1 : 0.55 }}
                  />
                  <span
                    className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] transition-opacity"
                    style={{ color: isSelected ? MARKER_ACTIVE : LABEL_REST }}
                  >
                    {d.city}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Itinerary */}
      {orderedStops.length === 0 ? (
        <div className="mt-8 border-y border-white/[0.06] py-14 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-smoke">
            Choose a city above, or click a point on the map, to start building your trip.
          </p>
        </div>
      ) : (
        <ol className="mt-8 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {orderedStops.map((d, i) => {
            const next = orderedStops[i + 1];
            const leg = next ? legs.find((l) => l.from.id === d.id && l.to.id === next.id) : undefined;
            return (
              <motion.li
                key={d.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 py-6 md:flex-row md:items-start md:gap-6"
              >
                {/* 1. City identity */}
                <div className="flex items-start gap-4 md:w-[24%] md:shrink-0">
                  {d.photoSrc && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden" style={{ border: "1px solid rgb(var(--bone) / 0.1)" }}>
                      <Image
                        src={d.photoSrc}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                        style={{ filter: "grayscale(0.15) sepia(0.1) saturate(0.9) contrast(1.04)" }}
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-2.5">
                    <span className="mt-[2px] shrink-0 font-mono text-[12px] tracking-[0.18em] text-mint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-display text-xl font-light leading-tight text-bone">{d.city}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">{d.country}</div>
                    </div>
                  </div>
                </div>

                {/* 2. Stay duration */}
                <div className="pl-[30px] md:w-[12%] md:shrink-0 md:pl-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">Stay</div>
                  <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.16em] text-mist">
                    {STAY_DURATIONS[d.id]} days
                  </div>
                </div>

                {/* 3. Landmarks */}
                <ul className="flex flex-col gap-1.5 pl-[30px] md:flex-1 md:pl-0">
                  {d.highlights.slice(0, 2).map((h) => (
                    <li key={h} className="max-w-md text-[13px] leading-relaxed text-mist">
                      &mdash; {h}
                    </li>
                  ))}
                </ul>

                {/* 4. Next destination + travel time */}
                <div className="pl-[30px] md:w-[22%] md:shrink-0 md:pl-0 md:text-right">
                  {next && leg ? (
                    <>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">Next: {next.city}</div>
                      <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.16em] text-mist">
                        {leg.km.toLocaleString()} km
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
                        ~{leg.travel.hours.toFixed(1)} hrs &middot; {leg.travel.mode}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">Journey&rsquo;s end</div>
                      <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.16em] text-mist">&mdash;</div>
                    </>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
