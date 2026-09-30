"use client";

import { useState } from "react";
import { motion, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { GradientWave } from "@/components/GradientWave";

// Hoisted so GradientWave sees stable props — inline literals here were
// part of its effect deps and rebuilt the WebGL canvas on every render.
const HERO_COLORS = ["#050506", "#0b1d18", "#060a09"];
const HERO_NOISE_FREQUENCY: [number, number] = [0.0001, 0.00028];
const HERO_DEFORM = { incline: 0.18, noiseAmp: 75, noiseFlow: 1.8, offsetTop: -0.5, offsetBottom: -0.5 };

/**
 * Ambient color wash behind the globe hero, replacing the flat void
 * background for just the opening beat. Faded out and paused at the same
 * heroEnd boundary HeroTitle/GlobeHero already use, so it never keeps
 * animating, unseen, behind the rest of the journey. Hidden rather than
 * unmounted, so scrolling back up resumes the same canvas instead of
 * creating a fresh WebGL context each time.
 */
export default function HeroGradientBackdrop({
  progress,
  heroEnd,
}: {
  progress: MotionValue<number>;
  heroEnd: number;
}) {
  const opacity = useTransform(progress, [0, heroEnd], [1, 0]);
  const [active, setActive] = useState(() => progress.get() < heroEnd + 0.01);

  useMotionValueEvent(progress, "change", (v) => {
    setActive(v < heroEnd + 0.01);
  });

  return (
    <motion.div
      style={{ opacity, visibility: active ? "visible" : "hidden" }}
      className="absolute inset-0"
      aria-hidden
    >
      {/*
        3 stops: void base + a single deep-mint layer (the site's one
        accent, --mint, at near-black luminance) + a near-void layer. Fewer
        wave layers reads as a slow glow instead of a busy multi-tone
        wash — and HeroTitle sits centered with zero scrim over this canvas,
        so restraint here is what keeps EXPLORE BEYOND THE MAP legible.

        No `darkenTop`: its shadow term only subtracts from the green
        channel, which would pull this mint palette toward magenta/grey
        (and produces a genuine magenta artifact on any color with real
        blue+red content) — see the same removal in
        DestinationGradientBackdrop.tsx.
      */}
      <GradientWave
        colors={HERO_COLORS}
        isPlaying={active}
        noiseSpeed={0.0000035}
        noiseFrequency={HERO_NOISE_FREQUENCY}
        deform={HERO_DEFORM}
      />
    </motion.div>
  );
}
