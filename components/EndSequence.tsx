"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { DESTINATIONS } from "@/lib/journey";
import MagneticButton from "@/components/MagneticButton";

export default function EndSequence({
  progress,
  onRestart,
}: {
  progress: MotionValue<number>;
  onRestart: () => void;
}) {
  const start = 0.97;
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);
  const scale = useTransform(progress, [start, 1], [1.08, 1]);
  const [p, setP] = useState(() => progress.get());

  useEffect(() => {
    setP(progress.get());
    const unsub = progress.on("change", setP);
    return () => unsub();
  }, [progress]);

  // Same gating as InteractiveMap: while faded out (the whole journey until
  // ~97%), this full-screen layer must not swallow clicks meant for the map
  // beneath it, nor expose its buttons to Tab / screen readers.
  const interactive = p > start + 0.001;

  return (
    <motion.div
      style={{ opacity, pointerEvents: interactive ? "auto" : "none" }}
      aria-hidden={!interactive}
      className="absolute inset-0 z-30 flex items-center justify-center bg-void"
    >
      <motion.div style={{ scale }} className="relative flex flex-col items-center px-6 text-center">
        {/*
          Constellation of every visited destination. Previously positioned
          with raw `left`/`top` pixel offsets against a 2x2px anchor div —
          those offsets placed each dot's top-left corner (not its center)
          on the circle, so the ring read subtly lopsided, and the "glow"
          was a box-shadow, which this system doesn't use anywhere else.
          Rebuilt as: a properly sized anchor (matching the circle's actual
          footprint, not a near-invisible 2px stub), each dot centered on
          its point via translate(-50%,-50%) + the polar offset, and the
          glow done with a blurred duplicate layer instead of box-shadow —
          consistent with "depth via blur, not shadow" elsewhere in the UI.
          Angles start at 12 o'clock so the ring reads as a clock/compass
          rather than an arbitrary scatter.
        */}
        <div className="relative mb-10 h-[168px] w-[168px]">
          {DESTINATIONS.map((d, i) => {
            const angle = (i / DESTINATIONS.length) * Math.PI * 2 - Math.PI / 2;
            const r = 82;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <span
                key={d.id}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                <span
                  className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[3px]"
                  style={{ backgroundColor: d.accent, opacity: 0.35 }}
                />
                <span
                  className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: d.accent, opacity: 0.85 }}
                />
              </span>
            );
          })}
        </div>

        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em] text-mist">Journey Complete</div>

        <h2 className="text-balance font-display font-light leading-[0.95] tracking-[-0.03em] text-bone" style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>
          <span className="block">THE JOURNEY</span>
          <span className="block">HAS ONLY</span>
          <span className="block">BEGUN</span>
        </h2>

        <p className="mt-6 max-w-sm text-[15px] font-light leading-relaxed text-mist">
          Ten cities, one continuous story — yours to retrace, anytime.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <button
              onClick={onRestart}
              tabIndex={interactive ? 0 : -1}
              data-cursor="link"
              className="hairline rounded-full px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors hover:border-bone/40 hover:text-bone"
            >
              Explore again
            </button>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/destinations"
              tabIndex={interactive ? 0 : -1}
              data-cursor="link"
              className="rounded-full bg-bone px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-void transition-opacity hover:opacity-80"
            >
              Browse destinations
            </Link>
          </MagneticButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
