/**
 * Kinetic wordmark for The Alps — atmosphere is "snowfall," accent is icy
 * (#c9d6dd), and the whole feeling should be stillness and cold rather than
 * anything bouncy. Mechanism: a one-shot "frost creeping up from the
 * baseline" entrance.
 *
 * A duplicate aria-hidden overlay layer carries a vertical accent-tinted
 * gradient (transparent at the base, solid accent concentrated toward the
 * top — a permanent "frosted tip" shape) clipped by a `clip-path: inset()`
 * whose top-inset animates from 100% (fully hidden) to 0% (fully revealed)
 * over ~1.35s on load. Because the clip is anchored to the bottom edge, the
 * reveal reads as frost climbing up from each letter's baseline to its tip.
 * Once settled, a very slow (~13s), barely-there opacity shimmer keeps it
 * from reading as completely dead — long cycle, low amplitude, no bounce.
 *
 * Real text throughout — the overlay is a duplicate aria-hidden text layer
 * sized to its own content box (not stretched to fill its positioned
 * ancestor), layered above the accessible base in DOM order. Both
 * animations collapse to a single static frame under prefers-reduced-motion
 * via the existing global override in globals.css.
 */
export default function AlpsKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes alpsFrostRise {
          from { clip-path: inset(100% 0 0 0); }
          to   { clip-path: inset(0% 0 0 0); }
        }
        @keyframes alpsFrostShimmer {
          0%, 100% { opacity: 0.88; }
          50% { opacity: 1; }
        }
        @keyframes alpsRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .alps-wordmark-frost {
          background-image: linear-gradient(
            to top,
            transparent 0%,
            transparent 35%,
            ${accent} 78%,
            ${accent} 100%
          );
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation:
            alpsFrostRise 1350ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both,
            alpsFrostShimmer 13s ease-in-out 1650ms infinite;
        }
        .alps-wordmark-rule {
          animation: alpsRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="relative text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        The Alps
      </h1>
      <h1
        aria-hidden
        className="alps-wordmark-frost pointer-events-none absolute left-0 top-0 z-10 select-none whitespace-nowrap font-display font-light leading-[0.92]"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)", width: "max-content" }}
      >
        The Alps
      </h1>

      <div aria-hidden className="alps-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
