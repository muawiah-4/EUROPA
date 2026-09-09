"use client";

import { useState } from "react";
import { motion, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { GradientWave } from "@/components/GradientWave";

/**
 * Ambient color wash behind the globe hero, replacing the flat void
 * background for just the opening beat. Faded and unmounted at the same
 * heroEnd boundary HeroTitle/GlobeHero already use, so it never keeps
 * animating, unseen, behind the rest of the journey.
 */
export default function HeroGradientBackdrop({
  progress,
  heroEnd,
}: {
  progress: MotionValue<number>;
  heroEnd: number;
}) {
  const opacity = useTransform(progress, [0, heroEnd], [1, 0]);
  const [mounted, setMounted] = useState(true);

  useMotionValueEvent(progress, "change", (v) => {
    setMounted(v < heroEnd + 0.01);
  });

  if (!mounted) return null;

  return (
    <motion.div style={{ opacity }} className="absolute inset-0" aria-hidden>
      {/*
        Reused from the original 5-stop palette (no new hues), trimmed to 3:
        void base + a single warm-ember layer + a near-void layer. Fewer
        wave layers reads as a slow ember glow instead of a busy multi-tone
        wash — and HeroTitle sits centered with zero scrim over this canvas,
        so restraint here is what keeps EXPLORE BEYOND THE MAP legible.

        No `darkenTop`: its shadow term only subtracts from the green
        channel, which is invisible on this warm near-black palette (all
        three colors here have negligible blue) but produces a genuine
        magenta artifact on any color with real blue+red content — see the
        same removal in DestinationGradientBackdrop.tsx.
      */}
      <GradientWave
        colors={["#050506", "#1d160c", "#0a0806"]}
        noiseSpeed={0.0000035}
        noiseFrequency={[0.0001, 0.00028]}
        deform={{ incline: 0.18, noiseAmp: 75, noiseFlow: 1.8, offsetTop: -0.5, offsetBottom: -0.5 }}
      />
    </motion.div>
  );
}
