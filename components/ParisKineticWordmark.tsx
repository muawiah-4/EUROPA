/**
 * Prototype: "kinetic wordmark" hero treatment for Paris — the city name
 * itself is the centerpiece (no 3D object, no landmark drawing), given a
 * slow, considered kind of motion rather than a static display. Two
 * continuous loops, both slow and restrained per this site's "nothing
 * moves just to prove it can" rule (and both collapse to a single static
 * frame under prefers-reduced-motion via the global override in
 * globals.css, since they're plain CSS animations):
 *
 * 1. Letter-spacing "breathes" on an ~12s cycle — a nod to haute-couture
 *    kerning discipline, barely perceptible, reads as "considered" rather
 *    than "animated."
 * 2. A narrow gold sheen sweeps across the letterforms on a ~9s loop,
 *    mostly idle — ties to Paris's existing gold-dust atmosphere and
 *    golden-hour identity without drawing anything literal.
 *
 * Plus one one-shot entrance: a hairline rule beneath the wordmark grows
 * in once, like a spotlight mark, then stays still.
 *
 * Real text throughout (the sheen is a duplicate aria-hidden layer over
 * the accessible base), so this stays a heading, not an image.
 */
export default function ParisKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <style>{`
        @keyframes parisTrackingBreathe {
          0%, 100% { letter-spacing: -0.03em; }
          50% { letter-spacing: 0.006em; }
        }
        @keyframes parisSheenSweep {
          0% { background-position: -120% 0; }
          100% { background-position: 220% 0; }
        }
        @keyframes parisRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .paris-wordmark-base,
        .paris-wordmark-sheen {
          font-weight: 300;
          line-height: 0.92;
          animation: parisTrackingBreathe 12s ease-in-out infinite;
        }
        .paris-wordmark-sheen {
          background-image: linear-gradient(
            100deg,
            transparent 0%,
            transparent 42%,
            ${accent} 50%,
            transparent 58%,
            transparent 100%
          );
          background-size: 300% 100%;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation:
            parisTrackingBreathe 12s ease-in-out infinite,
            parisSheenSweep 9s linear infinite;
        }
        .paris-wordmark-rule {
          animation: parisRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="paris-wordmark-base relative text-balance font-display text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        Paris
      </h1>
      <div
        aria-hidden
        className="paris-wordmark-sheen pointer-events-none absolute left-0 top-0 z-10 select-none whitespace-nowrap font-display"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)", width: "max-content" }}
      >
        Paris
      </div>

      <div
        aria-hidden
        className="paris-wordmark-rule mt-6 h-px"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}
