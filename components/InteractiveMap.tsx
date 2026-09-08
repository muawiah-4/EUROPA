"use client";

import { useEffect, useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import { DESTINATIONS, JOURNEY_MARKS } from "@/lib/journey";

// Hand-placed constellation coordinates (percent of container) — an artistic
// arrangement echoing each city's rough relative position in Europe, not a
// literal traced map projection.
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

// Scroll-linked appearance window. Originally an ~0.8%-of-scroll sliver
// (under 9vh) between the last chapter and the outro — too narrow to
// reliably land on with a wheel flick or a swipe. Widened to a ~2%-of-
// scroll window (roughly 22vh at this project's scroll length) that opens
// inside the last moments of Amsterdam's dwell. Its fade-out runs a few
// vh past JOURNEY_MARKS.outroStart, briefly overlapping EndSequence's own
// fade-in — harmless, since EndSequence renders after it (same z-index)
// and its bg-void steadily covers the map as it comes in.
const FADE_IN_END = JOURNEY_MARKS.mapStart + 0.008;
const HOLD_END = FADE_IN_END + 0.005;
const FADE_OUT_END = HOLD_END + 0.007;

function scrollWindowOpacity(p: number) {
  if (p < JOURNEY_MARKS.mapStart) return 0;
  if (p < FADE_IN_END) return (p - JOURNEY_MARKS.mapStart) / (FADE_IN_END - JOURNEY_MARKS.mapStart);
  if (p < HOLD_END) return 1;
  if (p < FADE_OUT_END) return 1 - (p - HOLD_END) / (FADE_OUT_END - HOLD_END);
  return 0;
}

export default function InteractiveMap({
  progress,
  onSelect,
}: {
  progress: MotionValue<number>;
  onSelect: (fraction: number) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [p, setP] = useState(0);
  // The map isn't only reachable by scrolling into its narrow window — a
  // small persistent toggle lets a visitor open it on demand from anywhere
  // in the journey, like reaching for a travel object rather than waiting
  // for a cue to pass by.
  const [manuallyOpen, setManuallyOpen] = useState(false);

  useEffect(() => {
    const unsub = progress.on("change", setP);
    return () => unsub();
  }, [progress]);

  useEffect(() => {
    if (!manuallyOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setManuallyOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [manuallyOpen]);

  const autoOpacity = scrollWindowOpacity(p);
  const opacity = manuallyOpen ? 1 : autoOpacity;
  const interactive = opacity > 0.05;

  // Toggle button: available through the chapters and the auto window, but
  // steps aside once the map is already fully open on its own so there's
  // never a redundant control sitting on top of it — except while manually
  // open, when it becomes the only way to close again without scrolling.
  const showToggle =
    manuallyOpen || (p > JOURNEY_MARKS.descentEnd && p < JOURNEY_MARKS.outroStart && autoOpacity < 0.4);

  function selectDestination(fraction: number) {
    setManuallyOpen(false);
    onSelect(fraction);
  }

  return (
    <>
      <motion.div
        style={{ opacity, pointerEvents: interactive ? "auto" : "none" }}
        aria-hidden={!interactive}
        className="absolute inset-0 z-30 flex items-center justify-center bg-void"
      >
        <div className="w-full max-w-3xl px-6">
          <div className="mb-10 text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">The Map</div>
            <h3
              className="mt-3 font-display font-light tracking-[-0.02em] text-bone"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
            >
              Every place, one constellation.
            </h3>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
            <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full opacity-20">
              {DESTINATIONS.slice(0, -1).map((d, i) => {
                const a = POSITIONS[d.id];
                const b = POSITIONS[DESTINATIONS[i + 1].id];
                if (!a || !b) return null;
                return <line key={d.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6b6a66" strokeWidth="0.15" />;
              })}
            </svg>

            {DESTINATIONS.map((d) => {
              const pos = POSITIONS[d.id];
              if (!pos) return null;
              const isHovered = hovered === d.id;
              return (
                <button
                  key={d.id}
                  onMouseEnter={() => setHovered(d.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(d.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => selectDestination((d.range[0] + d.range[1]) / 2)}
                  aria-label={`Travel to ${d.city}, ${d.country}`}
                  tabIndex={interactive ? 0 : -1}
                  className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-bone/70"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.span
                    className="block rounded-full"
                    initial={{ width: 7, height: 7 }}
                    animate={{
                      width: isHovered ? 12 : 7,
                      height: isHovered ? 12 : 7,
                      boxShadow: isHovered
                        ? `0 0 20px ${d.accent}`
                        : [`0 0 6px ${d.accent}`, `0 0 13px ${d.accent}`, `0 0 6px ${d.accent}`],
                    }}
                    transition={
                      isHovered
                        ? { duration: 0.25 }
                        : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
                    }
                    style={{ background: d.accent }}
                  />
                  <span
                    className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity duration-300"
                    style={{ color: d.accent, opacity: isHovered ? 1 : 0.55 }}
                  >
                    {d.city}
                  </span>
                  {isHovered && (
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-40 -translate-x-1/2 text-center font-mono text-[10px] leading-relaxed text-mist">
                      {d.micro}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {manuallyOpen && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setManuallyOpen(false)}
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke transition-colors hover:text-bone"
              >
                Close — Esc
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Persistent toggle: a small, always-minimal way to reach the map
          without waiting to scroll into its window. */}
      <button
        onClick={() => setManuallyOpen((v) => !v)}
        aria-label={manuallyOpen ? "Close the map" : "Open the map"}
        aria-pressed={manuallyOpen}
        tabIndex={showToggle ? 0 : -1}
        className="pointer-events-auto fixed bottom-6 left-6 z-40 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-mist transition-opacity duration-300 hover:text-bone"
        style={{ opacity: showToggle ? 1 : 0, pointerEvents: showToggle ? "auto" : "none" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {manuallyOpen ? "Close" : "Map"}
      </button>
    </>
  );
}
