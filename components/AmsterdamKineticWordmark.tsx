/**
 * Kinetic wordmark for Amsterdam — the site's own copy says the city's
 * canal houses "lean forward on purpose... the whole city is paying
 * attention" (tagline: "A city that leans in to listen"). This literalizes
 * that line directly: the whole wordmark (not per-letter, unlike Venice/
 * London/Barcelona) carries a barely-perceptible continuous skewX
 * oscillation — small amplitude (±1.2deg), slow ~12s cycle — reading as the
 * word itself leaning in and back, listening.
 *
 * Real text throughout — a single heading element, nothing hidden from
 * screen readers, no overlay layer needed since the effect applies to the
 * whole wordmark uniformly. Collapses to a single static frame under
 * prefers-reduced-motion via the existing global override in globals.css.
 */
export default function AmsterdamKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes amsterdamLeanIn {
          0%, 100% { transform: skewX(-1.2deg); }
          50%      { transform: skewX(1.2deg); }
        }
        @keyframes amsterdamRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .amsterdam-wordmark {
          display: inline-block;
          animation: amsterdamLeanIn 12s ease-in-out infinite;
        }
        .amsterdam-wordmark-rule {
          animation: amsterdamRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="amsterdam-wordmark text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        Amsterdam
      </h1>

      <div aria-hidden className="amsterdam-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
