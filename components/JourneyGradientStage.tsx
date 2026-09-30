"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { Gradient } from "@/components/GradientWave";
import { DESTINATIONS, destinationForProgress } from "@/lib/journey";

// Each destination's own sky + accent colors, reused as the wave palette —
// no new hues introduced, just the existing per-place identity in motion
// instead of held flat. Order matters here, not just content: Gradient
// turns colors[0] into the base fill and every color after it into its own
// noise-blended wave layer, and each layer's blend threshold rises with its
// index (see Gradient.init's noiseCeil), so the LAST color in this array is
// the rarest, most sparingly-shown one. Putting `accent` last — once, not
// twice — is what keeps this a "whisper of place-color over a moving sky,"
// matching the closed accent economy the rest of the chapter UI (eyebrow +
// one hairline tick) already holds to, instead of a wash of saturated
// accent standing behind un-scrimmed headline text.
function colorsForDestination(d: (typeof DESTINATIONS)[number]): string[] {
  return [d.sky[0], d.sky[1], d.accent];
}

const START = DESTINATIONS[0].range[0];
const END = DESTINATIONS[DESTINATIONS.length - 1].range[1];
const FADE = 0.02;

function skyGradient(d: (typeof DESTINATIONS)[number]) {
  return `linear-gradient(180deg, ${d.sky[0]}, ${d.sky[1]})`;
}

function isStageVisible(p: number) {
  return p > START - FADE && p < END + FADE;
}

/**
 * Single shared animated background for the whole scroll journey, replacing
 * every chapter's flat `linear-gradient(sky[0], sky[1])` div with one
 * continuously-running GradientWave canvas whose palette swaps as the
 * active destination changes. Mounting ten separate WebGL contexts (one
 * per chapter, all crossfaded via opacity like the chapters themselves)
 * would be wasteful and janky; one canvas that repaints its uniforms on
 * change (see Gradient.setColors) keeps it to a single context.
 */
export default function JourneyGradientStage({ progress }: { progress: MotionValue<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<Gradient | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const failedRef = useRef(false);

  const opacity = useTransform(progress, [START - FADE, START, END, END + FADE], [0, 1, 1, 0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    container.appendChild(canvas);

    const first = destinationForProgress(START + 0.001) ?? DESTINATIONS[0];
    activeIdRef.current = first.id;

    let gradient: Gradient;
    try {
      gradient = new Gradient(canvas, colorsForDestination(first));
    } catch (error) {
      // No WebGL (disabled, blocklisted, or out of contexts): fall back to
      // the flat per-destination sky gradient the chapters used before this
      // animated stage existed, kept in sync by the progress listener below.
      console.warn("JourneyGradientStage: WebGL unavailable, using static sky.", error);
      container.removeChild(canvas);
      failedRef.current = true;
      container.style.background = skyGradient(destinationForProgress(progress.get()) ?? first);
      return () => {
        failedRef.current = false;
        container.style.background = "";
      };
    }

    gradient.mesh.material.uniforms.u_shadow_power.value = 7;
    gradient.mesh.material.uniforms.u_darken_top.value = 0;
    // Wider, slower noise coordinates than the demo defaults: bigger, calmer
    // patches instead of small busy ones — this canvas runs unscrimmed the
    // entire scroll journey, directly behind headline text, so it has to
    // read as ambient sky, not an animation calling attention to itself.
    gradient.mesh.material.uniforms.u_global.value.noiseFreq.value = [0.0001, 0.00026];
    gradient.mesh.material.uniforms.u_global.value.noiseSpeed.value = 0.0000032;
    Object.assign(gradient.mesh.material.uniforms.u_vertDeform.value, {
      incline: 0.1,
      noiseAmp: 65,
      noiseFlow: 1.6,
      offsetTop: -0.5,
      offsetBottom: -0.5,
    });

    // Only animate while the stage is at least partly visible — outside
    // [START - FADE, END + FADE] its opacity is 0.
    if (isStageVisible(progress.get())) gradient.start();
    gradientRef.current = gradient;

    return () => {
      gradient.stop();
      if (container.contains(canvas)) container.removeChild(canvas);
      gradientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(progress, "change", (p) => {
    const gradient = gradientRef.current;
    if (gradient) {
      if (isStageVisible(p)) gradient.start();
      else gradient.pause();
    }
    const d = destinationForProgress(p);
    if (!d || d.id === activeIdRef.current) return;
    activeIdRef.current = d.id;
    if (gradient) gradient.setColors(colorsForDestination(d));
    else if (failedRef.current && containerRef.current) containerRef.current.style.background = skyGradient(d);
  });

  return <motion.div ref={containerRef} style={{ opacity }} className="absolute inset-0" aria-hidden />;
}
