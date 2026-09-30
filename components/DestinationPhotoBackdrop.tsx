"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const CYCLE_MS = 6500;

/**
 * Cinematic hero backdrop — cycles through every photo supplied for this
 * destination (hero + gallery) rather than holding on one static frame, with
 * a slow continuous Ken Burns drift on the active photo standing in for
 * video motion without shipping an actual video file. Replaces the earlier
 * single-photo version, which read as flat next to the rest of the site's
 * moving parts (particles, kinetic wordmarks) once there was more than one
 * photo available per destination to draw from.
 *
 * Grading is unchanged from the original: a real photograph, desaturated
 * and darkened via CSS filter, then a `mix-blend-mode: color` wash using
 * the destination's own sky gradient (keeps luminosity/silhouette, replaces
 * hue), a faint accent-color bloom, and an edge vignette — see the original
 * file history for the fuller rationale. This is still the site's one
 * departure from "zero photographs" (app/about/page.tsx), scoped to
 * destinations carrying real photos; everyone else keeps
 * DestinationGradientBackdrop unchanged.
 */
export default function DestinationPhotoBackdrop({
  photos,
  sky,
  accent,
}: {
  photos: string[];
  sky: [string, string];
  accent: string;
}) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduced || photos.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduced, photos.length]);

  const active = photos[index] ?? photos[0];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={reduced ? { scale: 1 } : { scale: 1.09 }}
            transition={{ duration: (CYCLE_MS / 1000) * 1.4, ease: "linear" }}
          >
            <Image
              src={active}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{
                filter: "grayscale(0.4) sepia(0.22) saturate(0.55) brightness(0.5) contrast(1.12)",
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${sky[0]}, ${sky[1]})`,
          mixBlendMode: "color",
          opacity: 0.78,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 28%, ${accent}26, transparent 60%)`,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 42%, rgba(11,12,14,0.68) 100%)",
        }}
      />

      {/* Subtle progress dashes — mirrors the pulsing-dot idiom used
          elsewhere on the site, giving the cycle a visible rhythm instead
          of photos silently changing underneath the reader. */}
      {photos.length > 1 && (
        <div className="pointer-events-none absolute bottom-6 right-6 z-10 flex gap-1.5 md:bottom-8 md:right-10">
          {photos.map((p, i) => (
            <span
              key={p}
              className="h-[3px] rounded-full transition-all duration-500"
              style={{
                width: i === index ? "18px" : "6px",
                background: i === index ? accent : "rgb(var(--bone) / 0.3)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
