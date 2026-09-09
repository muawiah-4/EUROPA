import type { CSSProperties } from "react";

/**
 * Kinetic wordmark for Barcelona — the site's copy frames the city as
 * shaped by "one architect's imagination reshaping the skyline" (Gaudí,
 * unnamed, organic architecture breaking the grid). Each letter of
 * "Barcelona" gets a fixed vertical offset following a cosine curve across
 * its index, so the whole word sits on a shallow static arc instead of a
 * straight baseline — a quiet structural nod, not literal Sagrada Família
 * geometry. It isn't perfectly static either: a very slow (~15s), small
 * amplitude "breathing" of the curve's own amplitude lets the arc gently
 * deepen and flatten over time, applied uniformly across all letters so the
 * whole shape moves as one arc rather than letters drifting independently.
 *
 * The per-letter offset is written as a static CSS custom property
 * (`--bcn-y`, computed once in JS from the cosine formula) and the shared
 * `barcelona-letter` class only ever *scales* that static value inside its
 * keyframes — the custom property itself is never animated, so the
 * transform interpolates smoothly across browsers without needing
 * `@property` registration.
 *
 * Real text throughout — plain inline-block spans, nothing hidden from
 * screen readers. Collapses to a single static frame (the resting arc)
 * under prefers-reduced-motion via the existing global override in
 * globals.css.
 */
const WORD = "Barcelona";
const LETTERS = WORD.split("");
const ARC_AMPLITUDE = 15; // px — peak lift at the word's midpoint

function arcOffset(index: number, total: number) {
  const t = total > 1 ? index / (total - 1) : 0.5;
  return -ARC_AMPLITUDE * Math.cos((t - 0.5) * Math.PI);
}

export default function BarcelonaKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes barcelonaArcBreathe {
          0%, 100% { transform: translateY(var(--bcn-y)); }
          50%      { transform: translateY(calc(var(--bcn-y) * 0.55)); }
        }
        @keyframes barcelonaRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .barcelona-letter {
          display: inline-block;
          animation: barcelonaArcBreathe 15s ease-in-out infinite;
        }
        .barcelona-wordmark-rule {
          animation: barcelonaRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="barcelona-letter"
            style={{ "--bcn-y": `${arcOffset(i, LETTERS.length).toFixed(2)}px` } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </h1>

      <div aria-hidden className="barcelona-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
