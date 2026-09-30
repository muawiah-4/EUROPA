"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { Destination } from "@/lib/journey";
import AtmosphereParticles from "@/components/AtmosphereParticles";

/**
 * One destination's full-viewport stage, split into two pieces so the
 * homepage's single shared 3D landmark canvas (JourneyLandmarkStage) can be
 * mounted once, between all ten chapters' backgrounds and all ten
 * chapters' typography, and still land in the correct visual stack order:
 * sky + atmosphere (this file's Background) -> landmark -> typography
 * (this file's Foreground). Previously this was one component that also
 * rendered a per-chapter flat-SVG `landmark` prop in between; that prop is
 * gone — see components/three/JourneyLandmarkStage.tsx.
 *
 * Opacity is driven by a shared crossfade window centered on the chapter's
 * own scroll boundary, the same fix applied on the PRX project — see the
 * boundary math below: without it, adjacent chapters both hit near-zero
 * opacity right at their shared edge instead of dissolving into one
 * another.
 */
export function useChapterOpacity(
  progress: MotionValue<number>,
  range: [number, number],
  isFirst: boolean,
  isLast: boolean,
  halfWidth?: number
) {
  const [s, e] = range;
  const hw = halfWidth ?? Math.min(0.018, (e - s) / 4);
  if (isFirst) return useTransform(progress, [s, e - hw, e + hw], [1, 1, 0]);
  if (isLast) return useTransform(progress, [s - hw, s + hw, e], [0, 1, 1]);
  return useTransform(progress, [s - hw, s + hw, e - hw, e + hw], [0, 1, 1, 0]);
}

// Headline/copy sits in the same fixed screen position across every
// chapter, so the wide dissolve window that looks good on the sky/particle
// background reads as two overlapping, competing headlines on text. Text
// gets its own much narrower crossfade so the swap stays crisp and legible.
export const TEXT_HALF_WIDTH = 0.004;

export function StoryChapterBackground({
  destination,
  opacity,
  active = true,
  loadPhoto = true,
  priority = false,
}: {
  destination: Destination;
  opacity: MotionValue<number>;
  /** Whether this chapter is currently visible — gates the particle loop. */
  active?: boolean;
  /**
   * Whether the photo should be requested yet. Every chapter is stacked in
   * the same sticky viewport, so native lazy-loading sees all ten as
   * in-view; the journey instead flips this on for the active chapter and
   * its neighbours only.
   */
  loadPhoto?: boolean;
  priority?: boolean;
}) {
  // The flat linear-gradient sky div that used to live here is gone — the
  // homepage's shared JourneyGradientStage now paints the animated
  // equivalent underneath every chapter (see JourneyExperience.tsx). Every
  // destination now carries a real photo (see lib/journey.ts's `photoSrc`,
  // set for all 10 as of the site's second photo pass) — this layer adds
  // it here too, so the main journey stops being "gradient + particles"
  // for nine of its ten chapters and one photo for the tenth. Graded
  // noticeably lighter-touch than DestinationPhotoBackdrop's detail-page
  // recipe (less desaturation, a much bolder accent bloom) — this site's
  // "more color, not just one muted accent" direction, not the detail
  // page's quieter one.
  return (
    <motion.div style={{ opacity }} className="absolute inset-0" aria-hidden>
      {destination.photoSrc && loadPhoto && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={destination.photoSrc}
            alt=""
            fill
            sizes="100vw"
            priority={priority}
            className="object-cover"
            style={{ filter: "grayscale(0.08) sepia(0.06) saturate(1.05) brightness(0.72) contrast(1.05)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${destination.sky[0]}, ${destination.sky[1]})`,
              mixBlendMode: "color",
              opacity: 0.32,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 30%, ${destination.accent}66, transparent 68%)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 36%, rgba(11,12,14,0.6) 100%)" }}
          />
        </div>
      )}
      <AtmosphereParticles kind={destination.atmosphere} active={active} />
    </motion.div>
  );
}

export function StoryChapterForeground({ destination, opacity }: { destination: Destination; opacity: MotionValue<number> }) {
  return (
    <motion.div style={{ opacity }} className="absolute inset-0" aria-hidden={false}>
      {/* Legibility scrim, tinted with the chapter's own accent rather than
          flat black — the background photo now runs brighter/more colorful
          than the old pure-gradient chapters, so text needs help standing
          off it, but the scrim itself is a chance for more color, not a
          reason to mute everything back down to black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{ background: `linear-gradient(0deg, rgba(11,12,14,0.86) 0%, ${destination.accent}22 55%, transparent 100%)` }}
      />
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
