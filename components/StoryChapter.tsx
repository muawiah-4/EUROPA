"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import type { Destination } from "@/lib/journey";
import AtmosphereParticles from "@/components/AtmosphereParticles";

/**
 * One destination's full-viewport stage: gradient sky, atmosphere particles,
 * a landmark slot (each destination supplies its own silhouette/composition
 * as children), and the whisper-weight typography overlay. Opacity is driven
 * by a shared crossfade window centered on the chapter's own scroll
 * boundary, the same fix applied on the PRX project — see the boundary math
 * below: without it, adjacent chapters both hit near-zero opacity right at
 * their shared edge instead of dissolving into one another.
 */
export function useChapterOpacity(
  progress: MotionValue<number>,
  range: [number, number],
  isFirst: boolean,
  isLast: boolean
) {
  const [s, e] = range;
  const hw = Math.min(0.018, (e - s) / 4);
  if (isFirst) return useTransform(progress, [s, e - hw, e + hw], [1, 1, 0]);
  if (isLast) return useTransform(progress, [s - hw, s + hw, e], [0, 1, 1]);
  return useTransform(progress, [s - hw, s + hw, e - hw, e + hw], [0, 1, 1, 0]);
}

export default function StoryChapter({
  destination,
  opacity,
  landmark,
}: {
  destination: Destination;
  opacity: MotionValue<number>;
  landmark: ReactNode;
}) {
  const blur = useTransform(opacity, [0, 1], [6, 0]);
  const scale = useTransform(opacity, [0, 1], [1.03, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0"
      aria-hidden={false}
    >
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${destination.sky[0]} 0%, ${destination.sky[1]} 100%)` }}
      />
      <AtmosphereParticles kind={destination.atmosphere} />

      {/* Landmark composition, gently blurred/scaled during crossfade for depth */}
      <motion.div style={{ filter: useTransform(blur, (b) => `blur(${b}px)`), scale }} className="absolute inset-0">
        {landmark}
      </motion.div>

      {/* Typography */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
        <div className="max-w-3xl">
          <div
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em]"
            style={{ color: destination.accent }}
          >
            {destination.eyebrow}
          </div>
          <h2 className="text-balance font-display font-light leading-[0.92] tracking-[-0.03em] text-bone" style={{ fontSize: "clamp(2.6rem, 8vw, 6.5rem)" }}>
            {destination.headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-mist md:text-[16px]">
            {destination.micro}
          </p>

          {/*
            Hairline tick marks the hand-off from prose (micro copy) to data
            (info rows) — a second, deliberately restrained appearance of the
            chapter accent (eyebrow is the first), staying well under the
            2-3-places budget for the closed accent economy.
          */}
          <div className="mt-10 h-px w-12" style={{ backgroundColor: destination.accent, opacity: 0.4 }} />

          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
            {destination.info.map((row) => (
              <div key={row.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">{row.label}</div>
                <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.18em] text-mist">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
