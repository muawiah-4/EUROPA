"use client";

import { useRef } from "react";
import type { Destination } from "@/lib/journey";
import DestinationCard from "@/components/DestinationCard";

/**
 * Horizontal, swipeable rail for the /destinations index — replaces the
 * earlier stacked 3-column grid (all ten cards visible at once, paged down
 * through several rows) with one continuous scrollable row: native touch
 * swipe on mobile, trackpad/wheel scroll or the arrow buttons on desktop.
 * `scroll-snap` keeps each card settling fully into view rather than
 * stopping mid-card.
 */
export default function DestinationsCarousel({ destinations }: { destinations: Destination[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = (card?.offsetWidth ?? 360) + 24;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between px-6 md:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          Swipe to explore all ten →
        </span>
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            aria-label="Scroll left"
            data-cursor="link"
            onClick={() => scrollByCard(-1)}
            className="hairline flex h-9 w-9 items-center justify-center rounded-full text-mist transition-colors hover:border-bone/40 hover:text-bone"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            data-cursor="link"
            onClick={() => scrollByCard(1)}
            className="hairline flex h-9 w-9 items-center justify-center rounded-full text-mist transition-colors hover:border-bone/40 hover:text-bone"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:gap-8 md:px-10"
        style={{ scrollPaddingLeft: "1.5rem" }}
      >
        {destinations.map((destination) => (
          <div key={destination.id} data-carousel-card className="w-[85vw] shrink-0 snap-start sm:w-[380px]">
            <DestinationCard destination={destination} />
          </div>
        ))}
        {/* Trailing spacer so the last card can snap fully into view with
            the same edge padding the first card gets, rather than being
            flush against the scroll container's end. */}
        <div aria-hidden className="w-px shrink-0 md:w-1" />
      </div>
    </div>
  );
}
