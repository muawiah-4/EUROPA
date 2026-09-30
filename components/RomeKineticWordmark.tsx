/**
 * Kinetic wordmark for Rome — the deliberate outlier of the set. Rome's
 * whole character is permanence and unhurried time ("TIME STANDS HERE" is
 * its actual headline), so instead of a continuous loop this gets a
 * ONE-SHOT weathered/etched entrance that settles into complete stillness —
 * stillness itself as the "kinetic" signature, in contrast to the other
 * seven destinations' ongoing motion.
 *
 * Mechanism: two SVG filters (feTurbulence + feDisplacementMap) roughen the
 * letterforms like worn stone epigraphy. The accessible base layer carries
 * a permanent, very subtle etch (small displacement scale) and never
 * animates. A duplicate aria-hidden overlay layer carries a much stronger,
 * more turbulent etch and fades out over ~1.4s on load — like a rougher
 * first impression settling into the final, barely-etched state. Once the
 * fade completes the overlay is gone and only the always-still subtly
 * etched base remains, permanently.
 *
 * Real text throughout — the overlay is a duplicate aria-hidden text layer,
 * nothing is rasterized to an image, and the CSS opacity animation
 * collapses to a single static frame under prefers-reduced-motion via the
 * existing global override in globals.css.
 */
export default function RomeKineticWordmark({ accent }: { accent: string }) {
  return (
    <div className="relative">
      <svg aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <defs>
          <filter
            id="rome-etch-subtle"
            x="-15%"
            y="-40%"
            width="130%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={2}
              seed={7}
              result="rome-noise-subtle"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="rome-noise-subtle"
              scale={1.6}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter
            id="rome-etch-strong"
            x="-25%"
            y="-70%"
            width="150%"
            height="240%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045 0.06"
              numOctaves={3}
              seed={7}
              result="rome-noise-strong"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="rome-noise-strong"
              scale={20}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes romeSettle {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes romeRuleGrow {
          from { width: 0; opacity: 0; }
          to { width: 132px; opacity: 1; }
        }
        .rome-wordmark-base {
          filter: url(#rome-etch-subtle);
        }
        .rome-wordmark-overlay {
          filter: url(#rome-etch-strong);
          animation: romeSettle 1400ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both;
        }
        .rome-wordmark-rule {
          animation: romeRuleGrow 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
      `}</style>

      <h1
        className="rome-wordmark-base relative text-balance font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        Rome
      </h1>
      <div
        aria-hidden
        className="rome-wordmark-overlay pointer-events-none absolute left-0 top-0 z-10 select-none whitespace-nowrap font-display font-light leading-[0.92] text-bone"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)", width: "max-content" }}
      >
        Rome
      </div>

      <div aria-hidden className="rome-wordmark-rule mt-6 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}
