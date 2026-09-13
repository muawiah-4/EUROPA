"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "europa-visited";

/**
 * One-time cinematic loading veil shown before the globe hero — "EUROPA" /
 * "Preparing your journey…" / a minimal fill bar — gated behind
 * sessionStorage so a client-side route change (this layout persists
 * across those in the app router) or a later visit in the same tab never
 * replays it. A hard refresh in a fresh tab shows it again, which is the
 * intended scope: a first-visit entrance, not a page-transition spinner.
 *
 * The progress bar is a fixed ~1.8s ease, not tied to real asset weight —
 * everything on this site is code-generated (WebGL shaders, canvas
 * particles, plain CSS) rather than a large photo/video payload, so there
 * is no real "loading" to report; this is a deliberate cinematic beat, not
 * a progress lie about heavy assets that don't exist here.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sessionStorage.setItem(SESSION_KEY, "1");
      const t = setTimeout(() => setVisible(false), 320);
      return () => clearTimeout(t);
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1750;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out cubic — fast start, settles slowly, never feels stalled.
      const inv = 1 - t;
      setProgress(1 - inv * inv * inv);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => setVisible(false), 300);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Nothing rendered until the sessionStorage check resolves client-side —
  // avoids a one-frame flash of the veil on repeat visits.
  if (!mounted) return null;

  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-smoke">Europa</div>
          <div className="mt-4 text-balance text-center font-display text-2xl font-light tracking-[-0.02em] text-bone md:text-3xl">
            Preparing your journey&hellip;
          </div>
          <div className="mt-10 h-px w-40 overflow-hidden bg-white/10">
            <div className="h-full bg-bone" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 font-mono text-[10px] tracking-[0.2em] text-smoke">
            {String(pct).padStart(3, "0")}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
