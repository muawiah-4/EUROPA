/**
 * Kinetic wordmark for Santorini — reuses Paris's proven background-clip:text
 * sheen TECHNIQUE (accent color as sparing punctuation, sweeping over real
 * text) but tunes it to read as a completely different character: Santorini's
 * atmosphere is "sun-glint," brisk pace, midday light — so this sweep is
 * brighter, faster, and harder-edged than Paris's slow warm-gold idle sweep.
 * A short ~5.5s linear cycle and a tight, near-white highlight band (with
 * the accent only as a thin edge tint either side of a white core) reads as
 * sharp Mediterranean sun catching whitewash, not a recolored Paris.
 *
 * Real text throughout — the sheen is a duplicate aria-hidden text layer
 * sized to its own content (not stretched to fill its positioned ancestor),
 * layered above the accessible base in DOM order so the effect actually
 * paints. Collapses to a single static frame under prefers-reduced-motion
 * via the existing global override in globals.css.
 */
export default function SantoriniKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes santoriniSheenSweep {
          0% { background-position: -140% 0; }
          100% { background-position: 240% 0; }
        }
        @keyframes santoriniRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .santorini-wordmark-sheen {
          background-image: linear-gradient(
            96deg,
            transparent 0%,
            transparent 47%,
            ${accent} 49%,
            #ffffff 50%,
            ${accent} 51%,
            transparent 53%,
            transparent 100%
          );
          background-size: 340% 100%;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: santoriniSheenSweep 5.5s linear infinite;
        }
        .santorini-wordmark-rule {
          animation: santoriniRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="relative text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        Santorini
      </h1>
      <div
        aria-hidden
        className="santorini-wordmark-sheen pointer-events-none absolute left-0 top-0 z-10 select-none whitespace-nowrap font-display font-light leading-[0.92]"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)", width: "max-content" }}
      >
        Santorini
      </div>

      <div aria-hidden className="santorini-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
