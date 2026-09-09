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
      <GradientWave
        colors={["#050506", "#1d160c", "#050506", "#241a0e", "#0a0806"]}
        shadowPower={10}
        darkenTop
        noiseSpeed={0.000006}
        noiseFrequency={[0.00012, 0.0004]}
        deform={{ incline: 0.32, noiseAmp: 130, noiseFlow: 3.2, offsetTop: -0.5, offsetBottom: -0.5 }}
      />
    </motion.div>
  );
}
