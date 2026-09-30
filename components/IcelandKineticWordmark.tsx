/**
 * Kinetic wordmark for Iceland — the only destination whose defining
 * atmosphere is light itself, not weather or architecture, so the
 * mechanism is a slow multi-hue color drift standing in for aurora light
 * moving across the sky: green, teal, and violet bleed into one another
 * across the whole word continuously, paired with a very slow, barely-there
 * vertical sway (a soft "curtain" breathing) rather than any bounce.
 *
 * Different from every other wordmark's mechanism: Paris/Prague/Alps all
 * key a single accent color against a fixed base, and Venice ripples
 * position, not color — this is the only one where color itself is the
 * whole animation, sweeping continuously across several hues instead of
 * flashing one accent once per cycle.
 *
 * Real text throughout (the aurora layer is a duplicate aria-hidden layer
 * over the accessible bone-colored base, same pattern as Paris's sheen).
 * Collapses to a single static frame under prefers-reduced-motion via the
 * existing global override in globals.css.
 */
export default function IcelandKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes icelandAuroraDrift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes icelandCurtainSway {
          0%, 100% { transform: scaleY(1) skewX(0deg); }
          50% { transform: scaleY(1.015) skewX(-0.5deg); }
        }
        @keyframes icelandRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .iceland-wordmark-aurora {
          background-image: linear-gradient(
            100deg,
            ${accent} 0%,
            #8fd6c4 22%,
            #9b8fd6 44%,
            ${accent} 66%,
            #6fe0b8 88%,
            ${accent} 100%
          );
          background-size: 320% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transform-origin: 50% 100%;
          animation:
            icelandAuroraDrift 16s ease-in-out infinite,
            icelandCurtainSway 9s ease-in-out infinite;
        }
        .iceland-wordmark-rule {
          animation: icelandRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="relative text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        Iceland
      </h1>
      <div
        aria-hidden
        className="iceland-wordmark-aurora pointer-events-none absolute left-0 top-0 z-10 select-none whitespace-nowrap font-display font-light leading-[0.92]"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)", width: "max-content" }}
      >
        Iceland
      </div>

      <div aria-hidden className="iceland-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
