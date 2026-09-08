"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * The "descend through clouds" beat between the orbital hero and the first
 * destination. Three soft blurred layers drift at different scroll-linked
 * speeds (a cheap parallax) and thin out as progress moves past this
 * window, reading as passing through cloud cover without any 3D cost.
 */
export default function CloudDescent({
  progress,
  range,
}: {
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const [s, e] = range;
  const opacity = useTransform(progress, [s, s + (e - s) * 0.35, e], [0, 1, 0]);
  const y1 = useTransform(progress, [s, e], ["0%", "-40%"]);
  const y2 = useTransform(progress, [s, e], ["10%", "-70%"]);
  const y3 = useTransform(progress, [s, e], ["-10%", "-25%"]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <motion.div style={{ y: y3 }} className="absolute -inset-x-20 top-[10%] h-[45%] rounded-[100%] bg-white/[0.05] blur-3xl" />
      <motion.div style={{ y: y1 }} className="absolute -inset-x-32 top-[35%] h-[55%] rounded-[100%] bg-white/[0.08] blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute -inset-x-10 top-[60%] h-[50%] rounded-[100%] bg-white/[0.06] blur-3xl" />
    </motion.div>
  );
}
