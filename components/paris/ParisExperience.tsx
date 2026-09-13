"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  PARIS_ACTS,
  PARIS_LENGTH_VH,
  actForProgress,
  landmarkForProgress,
  neighborhoodForProgress,
} from "@/lib/parisExperience";

// React Three Fiber touches WebGL — must stay client-only, same pattern
// JourneyExperience.tsx already uses for GlobeHero.
const ParisScene = dynamic(() => import("@/components/three/ParisScene"), { ssr: false });

export default function ParisExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProgress);

  const scrollToFraction = useCallback((fraction: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollRange = el.offsetHeight - window.innerHeight;
    const target = containerTop + Math.min(1, Math.max(0, fraction)) * scrollRange;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const act = actForProgress(progress);
  const landmark = act?.id === "icons" ? landmarkForProgress(progress) : null;
  const neighborhood = act?.id === "neighborhoods" ? neighborhoodForProgress(progress) : null;

  // A brief, timed title card on entering each act — decoupled from exact
  // scroll position (rather than a scroll-interpolated crossfade) so it
  // never has to compete for the same screen moment as the first
  // landmark/neighborhood label inside that act.
  const [titleCard, setTitleCard] = useState<string | null>(PARIS_ACTS[0].id);
  const lastActId = useRef(PARIS_ACTS[0].id);
  useEffect(() => {
    if (!act || act.id === lastActId.current) return;
    lastActId.current = act.id;
    setTitleCard(act.id);
    const t = setTimeout(() => setTitleCard(null), 2200);
    return () => clearTimeout(t);
  }, [act]);

  const scrollHintOpacity = progress < 0.02 ? 1 : 0;

  return (
    <div ref={containerRef} style={{ height: `${PARIS_LENGTH_VH}vh` }} className="relative bg-void">
      <div className="grain sticky top-0 h-screen w-full overflow-hidden">
        <ParisScene progress={scrollYProgress} />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(11,12,14,0.35) 0%, transparent 22%, transparent 70%, rgba(11,12,14,0.75) 100%)" }}
        />

        {/* ---------- Corner metadata stamp ---------- */}
        <div className="pointer-events-none absolute right-6 top-24 text-right md:right-10 md:top-28">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/80">
            48.8566° N, 2.3522° E
          </div>
          <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke">Paris, France</div>
        </div>

        {/* ---------- Act title card ---------- */}
        <AnimatePresence>
          {titleCard && (
            <motion.div
              key={titleCard}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >
              {PARIS_ACTS.filter((a) => a.id === titleCard).map((a) => (
                <div key={a.id}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mist">
                    {String(a.index).padStart(2, "0")} / 09
                  </div>
                  <h2
                    className="text-balance mt-5 font-display font-light leading-[0.92] tracking-[-0.03em] text-bone"
                    style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)" }}
                  >
                    {a.label}
                  </h2>
                  {a.id === "motion" && (
                    <p className="mx-auto mt-6 max-w-sm text-[15px] font-light leading-relaxed text-mist">
                      An ever-moving city of monuments, hidden streets and stories.
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- Landmark / neighborhood annotation ---------- */}
        <AnimatePresence mode="wait">
          {(landmark || neighborhood) && (
            <motion.div
              key={landmark?.id ?? neighborhood?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-16 md:pb-24"
            >
              <div className="max-w-lg">
                {landmark && (
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist">
                    {landmark.district}
                  </div>
                )}
                <h3
                  className="text-balance font-display font-light leading-[0.95] tracking-[-0.025em] text-bone"
                  style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
                >
                  {landmark ? landmark.name : neighborhood?.name}
                </h3>
                <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[16px]">
                  {landmark ? landmark.description : neighborhood?.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- Scroll hint ---------- */}
        <motion.div
          animate={{ opacity: scrollHintOpacity }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-smoke">Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-mist to-transparent"
          />
        </motion.div>

        {/* ---------- Act dot timeline ---------- */}
        <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center md:flex md:right-10">
          {PARIS_ACTS.map((a, i) => {
            const isActive = act?.id === a.id;
            const isLast = i === PARIS_ACTS.length - 1;
            return (
              <div key={a.id} className="flex flex-col items-center">
                <button
                  onClick={() => scrollToFraction((a.range[0] + a.range[1]) / 2)}
                  aria-label={`Jump to ${a.label}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group pointer-events-auto relative flex items-center justify-end gap-3 rounded-sm py-2 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-bone/70"
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ color: isActive ? "#e8c07a" : "rgba(184,182,174,0.6)" }}
                  >
                    {String(a.index).padStart(2, "0")} — {a.label}
                  </span>
                  <motion.span
                    className="block rounded-full"
                    initial={false}
                    animate={{
                      width: isActive ? 12 : 7,
                      height: isActive ? 12 : 7,
                      boxShadow: isActive
                        ? [`0 0 8px #e8c07a`, `0 0 16px #e8c07a`, `0 0 8px #e8c07a`]
                        : "0 0 0px transparent",
                    }}
                    transition={
                      isActive
                        ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    style={{
                      background: isActive ? "#e8c07a" : "transparent",
                      border: isActive ? "none" : "1.5px solid rgba(184,182,174,0.45)",
                    }}
                  />
                </button>
                {!isLast && <span className="h-9 w-px" style={{ background: "rgba(184,182,174,0.25)" }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
