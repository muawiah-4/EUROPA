/**
 * Kinetic wordmark for Prague — "the clock never stops," so the mechanism
 * is literally clockwork, abstracted rather than drawn: a bright accent
 * "tick" travels letter-by-letter across the word, like a hand sweeping
 * past each one in turn, then pauses before its next pass — nothing here
 * is continuous, everything ticks. A second, independent mechanism runs
 * on the hairline rule beneath: a small accent dot slides back and forth
 * along it forever, a metronome standing in for a second hand.
 *
 * Both are genuinely different from every other destination's wordmark —
 * Paris sweeps a continuous highlight, Venice ripples continuously, the
 * Alps reveal once and hold — this one is the only discrete, per-letter,
 * repeating-cycle mechanism in the set.
 *
 * Real text throughout: letters are plain inline-block spans with an
 * animated `color`, not an image or a gradient-clip trick. Both animations
 * collapse to a single static frame under prefers-reduced-motion via the
 * existing global override in globals.css.
 */
const LETTERS = "Prague".split("");
const CYCLE_S = 6.6;

export default function PragueKineticWordmark({ accent }: { accent: string }) {
  const step = CYCLE_S / LETTERS.length;

  return (
    <div className="relative">
      <style>{`
        @keyframes pragueTick {
          0%, 4%, 100% { transform: translateY(0) scale(1); color: rgb(var(--bone)); }
          2% { transform: translateY(-5%) scale(1.05); color: ${accent}; }
        }
        .prague-letter {
          display: inline-block;
          animation: pragueTick ${CYCLE_S}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .prague-wordmark-rule {
          position: relative;
          animation: pragueRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
        @keyframes pragueRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .prague-rule-dot {
          position: absolute;
          top: 50%;
          left: 0;
          width: 5px;
          height: 5px;
          margin-top: -2.5px;
          border-radius: 9999px;
          background: ${accent};
          animation: pragueMetronome 3.4s ease-in-out infinite 1.6s;
        }
        @keyframes pragueMetronome {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(132px); }
        }
      `}</style>

      <h1
        className="text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        {LETTERS.map((ch, i) => (
          <span key={i} className="prague-letter" style={{ animationDelay: `${i * step}s` }}>
            {ch}
          </span>
        ))}
      </h1>

      <div className="prague-wordmark-rule mt-6 h-px" style={{ backgroundColor: "rgb(var(--bone) / 0.25)" }}>
        <span aria-hidden className="prague-rule-dot" />
      </div>
    </div>
  );
}
