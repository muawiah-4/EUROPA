/**
 * Kinetic wordmark for London — atmosphere is "rain-fog," tagline "a sky
 * that won't commit." A different per-letter mechanism from Venice's
 * position-based ripple: here each letter of "London" is its own
 * inline-block span independently pulsing opacity + a couple pixels of
 * blur, out of sync with its neighbors via *negative* animation-delay (so
 * it's already mid-drift at first paint, not winding up from zero) — reads
 * as fog rolling through the word, patches of it softening and sharpening
 * independently. Blur stays small (max ~1.6px) and opacity never drops
 * below ~0.78, so the wordmark stays legible throughout.
 *
 * Real text throughout — plain inline-block spans, nothing hidden from
 * screen readers. Collapses to a single static frame under
 * prefers-reduced-motion via the existing global override in globals.css.
 */
const LETTERS = "London".split("");

export default function LondonKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes londonFogPulse {
          0%   { opacity: 1;    filter: blur(0px); }
          45%  { opacity: 0.78; filter: blur(1.6px); }
          100% { opacity: 1;    filter: blur(0px); }
        }
        @keyframes londonRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .london-letter {
          display: inline-block;
          animation: londonFogPulse 7.4s ease-in-out infinite;
        }
        .london-wordmark-rule {
          animation: londonRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        {LETTERS.map((ch, i) => (
          <span key={i} className="london-letter" style={{ animationDelay: `-${i * 1.15}s` }}>
            {ch}
          </span>
        ))}
      </h1>

      <div aria-hidden className="london-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
