"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { MotionValue } from "framer-motion";
import { DESTINATIONS, JOURNEY_MARKS } from "@/lib/journey";

export default function ProgressRail({
  progress,
  onSelect,
}: {
  progress: MotionValue<number>;
  onSelect: (fraction: number) => void;
}) {
  const [p, setP] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const unsub = progress.on("change", setP);
    return () => unsub();
  }, [progress]);

  const activeIdx = DESTINATIONS.findIndex((d) => p >= d.range[0] && p < d.range[1]);
  // Only show the rail once the journey has left the hero/descent, and hand
  // off cleanly right as the interactive map begins its own fade-in — the
  // two shouldn't be visible chrome at the same time.
  const visible = p > 0.1 && p < JOURNEY_MARKS.mapStart;

  // How far through the active chapter we are, 0-1 — used to grow the
  // active pill as a lightweight "you are here" scrubber instead of a
  // static width, so the rail reads as a real position, not just a label.
  const activeChapterProgress =
    activeIdx >= 0
      ? Math.min(
          1,
          Math.max(
            0,
            (p - DESTINATIONS[activeIdx].range[0]) /
              (DESTINATIONS[activeIdx].range[1] - DESTINATIONS[activeIdx].range[0])
          )
        )
      : 0;

  function jumpTo(i: number, focus: boolean) {
    const d = DESTINATIONS[i];
    onSelect((d.range[0] + d.range[1]) / 2);
    if (focus) buttonRefs.current[i]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      jumpTo(Math.min(DESTINATIONS.length - 1, i + 1), true);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      jumpTo(Math.max(0, i - 1), true);
    }
  }

  return (
    <>
      {/* Desktop: fixed right-side rail, one row per destination with a
          hover/focus preview of that chapter's micro-copy so a jump feels
          informed rather than blind. */}
      <div
        aria-hidden={!visible}
        role="group"
        aria-label="Jump to a destination"
        className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-500 md:flex"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {DESTINATIONS.map((d, i) => {
          const isActive = i === activeIdx;
          const isHovered = hoveredId === d.id;
          return (
            <div
              key={d.id}
              className="relative"
              onMouseEnter={() => setHoveredId(d.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                onClick={() => jumpTo(i, false)}
                onFocus={() => setHoveredId(d.id)}
                onBlur={() => setHoveredId(null)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                aria-label={`Jump to ${d.city}, ${d.country}`}
                aria-current={isActive ? "true" : undefined}
                tabIndex={visible ? 0 : -1}
                className="pointer-events-auto flex items-center gap-2.5 rounded-sm outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-bone/70"
              >
                <span
                  className="font-mono text-[10px] tracking-[0.12em] transition-colors"
                  style={{ color: isActive ? d.accent : "rgba(184,182,174,0.35)" }}
                >
                  {String(d.index).padStart(2, "0")} — {d.city.toUpperCase()}
                </span>
                <span
                  className="h-[3px] rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? `${16 + activeChapterProgress * 14}px` : "8px",
                    background: isActive ? d.accent : "rgba(184,182,174,0.3)",
                  }}
                />
              </button>

              {/* Preview: destination's micro-copy, revealed to the left on
                  hover/focus. Kept text-only and small — a whisper, not a
                  card — per the "extremely minimal" brief. */}
              <div
                className="pointer-events-none absolute right-full top-1/2 mr-4 w-48 -translate-y-1/2 text-right transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
              >
                <p className="font-mono text-[10px] leading-relaxed text-mist">{d.micro}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: the rail is desktop-only (md:flex above), so touch users
          get an equivalent, thumb-reachable alternative — a bottom dot
          scrubber naming the current destination, tap any dot to jump. */}
      <div
        aria-hidden={!visible}
        className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2.5 transition-opacity duration-500 md:hidden"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300"
          style={{ color: activeIdx >= 0 ? DESTINATIONS[activeIdx].accent : "rgba(184,182,174,0.5)" }}
        >
          {activeIdx >= 0
            ? `${String(DESTINATIONS[activeIdx].index).padStart(2, "0")} — ${DESTINATIONS[activeIdx].city.toUpperCase()}`
            : ""}
        </span>
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-void/50 px-3.5 py-2.5 backdrop-blur-sm">
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => jumpTo(i, false)}
              aria-label={`Jump to ${d.city}, ${d.country}`}
              aria-current={i === activeIdx ? "true" : undefined}
              tabIndex={visible ? 0 : -1}
              className="flex h-6 w-6 items-center justify-center rounded-full outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-bone/70"
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === activeIdx ? 14 : 5,
                  height: 5,
                  background: i === activeIdx ? d.accent : "rgba(184,182,174,0.35)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
