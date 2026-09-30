// Shared with the sibling repo (workable-fortnight PRX concept <-> EUROPA) — keep in sync.
"use client";

import { motion } from "framer-motion";

const TONE_STROKE = {
  dark: "rgba(20,23,26,0.08)",
  light: "rgba(255,255,255,0.09)",
} as const;

/**
 * Oversized, near-transparent outline typography sitting behind a section's
 * real heading — a large-scale editorial device (huge word, thin stroke,
 * barely-there fill) that gives a section presence without competing with
 * the copy stacked in front of it. Purely decorative — aria-hidden.
 *
 * Stroke colour: `tone` picks a preset ("dark" = ink on light surfaces,
 * "light" = white on dark surfaces); `strokeColor` (any CSS colour, e.g. a
 * theme token like "rgb(var(--bone) / 0.08)") overrides it.
 */
export default function GhostHeading({
  children,
  align = "left",
  tone = "dark",
  strokeColor,
  className = "",
}: {
  children: string;
  align?: "left" | "center" | "right";
  tone?: keyof typeof TONE_STROKE;
  strokeColor?: string;
  className?: string;
}) {
  const stroke = strokeColor ?? TONE_STROKE[tone];
  const textAlign = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  const justify = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none absolute inset-x-0 top-0 flex select-none overflow-hidden ${justify} ${className}`}
    >
      <span
        className={`${textAlign} font-black uppercase leading-[0.78] tracking-tight`}
        style={{
          fontSize: "clamp(4.5rem, 15vw, 13rem)",
          color: "transparent",
          WebkitTextStroke: `1px ${stroke}`,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}
