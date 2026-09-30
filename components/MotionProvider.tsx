"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Client boundary for app-wide Framer Motion config. reducedMotion="user"
 * makes every motion component honour prefers-reduced-motion (transform and
 * layout animations are skipped), matching the CSS override in globals.css.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
