// Shared with the sibling repo (workable-fortnight PRX concept <-> EUROPA) — keep in sync.
"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * App-wide Framer Motion config. Framer animates via inline styles / WAAPI,
 * so the global CSS prefers-reduced-motion override doesn't reach it;
 * reducedMotion="user" makes every motion component skip transform/layout
 * animation (opacity fades still run) when the OS asks for reduced motion.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
