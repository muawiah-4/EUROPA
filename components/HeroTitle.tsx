"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

export default function HeroTitle({
  progress,
  heroEnd,
}: {
  progress: MotionValue<number>;
  heroEnd: number;
}) {
  const opacity = useTransform(progress, [0, heroEnd * 0.7, heroEnd], [1, 1, 0]);
  const y = useTransform(progress, [0, heroEnd], [0, -60]);
  const scrollHintOpacity = useTransform(progress, [0, heroEnd * 0.4], [1, 0]);

  return (
    <motion.div style={{ opacity, y }} className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
      {/*
        Entrance cascade: each element's delay = prior delay + ~0.75x prior
        duration, so reveals overlap rather than queue strictly end-to-end —
        reads as one continuous unfurl instead of four separate beats.
        Tightened from an 0.3s-in start (felt like dead air before the hero
        did anything) to 0.15s, and the whole sequence now lands by ~1.6s
        instead of ~2.4s.
      */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 font-mono text-[11px] uppercase tracking-[0.32em] text-mist"
      >
        Europe
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-balance font-display font-light leading-[0.9] tracking-[-0.035em] text-bone"
        style={{ fontSize: "clamp(2.8rem, 9vw, 7.5rem)" }}
      >
        <span className="block">EXPLORE</span>
        <span className="block">BEYOND</span>
        <span className="block">THE MAP</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 max-w-sm text-[15px] font-light leading-relaxed text-mist"
      >
        An interactive journey through Europe&rsquo;s most unforgettable places.
      </motion.p>

      {/*
        Scroll-hint opacity was previously driven two ways at once: the
        `style` opacity bound to `scrollHintOpacity` (a derived, read-only
        useTransform value tied to scroll progress) AND an `animate`
        opacity target on the SAME element. Framer Motion resolves that by
        animating the external motion value directly, which stomps on its
        scroll-driven output — the hint's scroll-linked fade-out was
        silently broken. Split into two layers: the outer div owns only the
        scroll-linked fade, the inner div owns only the entrance fade-in.
      */}
      <motion.div
        style={{ opacity: scrollHintOpacity }}
        className="absolute bottom-10 flex flex-col items-center gap-3"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-smoke">Begin the journey</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-mist to-transparent"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
