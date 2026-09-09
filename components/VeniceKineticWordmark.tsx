/**
 * Prototype: "kinetic wordmark" hero treatment for Venice — a different
 * mechanism from Paris's on purpose, to prove the concept scales with
 * genuinely varied per-place behavior rather than one trick recolored.
 *
 * Each letter of "Venice" drifts on its own slow vertical bob + slight
 * skew, phase-offset from its neighbors (via negative animation-delay, so
 * the wave is already flowing at first paint instead of needing to "wind
 * up") — reads as a slow ripple passing through the word, like a
 * reflection breaking on canal water. Real text the whole way through:
 * letters are plain inline-block spans, nothing hidden from screen
 * readers, and the animation collapses to a single static frame under
 * prefers-reduced-motion via the existing global CSS override in
 * globals.css.
 */
const LETTERS = "Venice".split("");

export default function VeniceKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes veniceRipple {
          0%   { transform: translateY(0px) skewX(0deg); }
          25%  { transform: translateY(-5px) skewX(-2deg); }
          50%  { transform: translateY(1px) skewX(0deg); }
          75%  { transform: translateY(4px) skewX(2deg); }
          100% { transform: translateY(0px) skewX(0deg); }
        }
        @keyframes veniceRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .venice-letter {
          display: inline-block;
          animation: veniceRipple 4.2s ease-in-out infinite;
          transform-origin: 50% 100%;
        }
        .venice-wordmark-rule {
          animation: veniceRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        {LETTERS.map((ch, i) => (
          <span key={i} className="venice-letter" style={{ animationDelay: `-${i * 0.42}s` }}>
            {ch}
          </span>
        ))}
      </h1>

      <div aria-hidden className="venice-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
