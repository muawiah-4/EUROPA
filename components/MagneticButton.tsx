// Shared with the sibling repo (workable-fortnight PRX concept <-> EUROPA) — keep in sync.
"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const MotionLink = motion(Link);
const SPRING = { stiffness: 200, damping: 18, mass: 0.4 };

// One ref type assignable to every host this component can render.
type Host = HTMLAnchorElement & HTMLButtonElement & HTMLDivElement;

/**
 * How far the element leans toward the cursor. Pick exactly one unit:
 * - `maxOffsetPx`: fixed pixels of travel when the cursor is at the element's
 *   edge, scaled linearly toward the centre — same feel at any element size.
 * - `pullRatio`: the element travels this fraction (0–1) of the cursor's
 *   distance from its centre — bigger elements move further.
 * Neither given → `maxOffsetPx: 7`.
 */
type Pull =
  | { maxOffsetPx?: number; pullRatio?: never }
  | { pullRatio: number; maxOffsetPx?: never };

type Props = Pull & {
  children: ReactNode;
  className?: string;
  /** Renders a Next.js Link (magnetic element is the link itself). */
  href?: string;
  /** Renders a <button> (magnetic element is the button itself). */
  onClick?: () => void;
};

/**
 * Restrained, spring-damped magnetic pull toward the cursor within the
 * element's own bounds. Renders a Link when `href` is set, a <button> when
 * `onClick` is set, otherwise an inline-block <div> wrapper around an
 * interactive child. Under prefers-reduced-motion no move listener is attached.
 */
export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  maxOffsetPx = 7,
  pullRatio,
}: Props) {
  const ref = useRef<Host>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const onMouseMove = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    if (pullRatio !== undefined) {
      x.set(relX * pullRatio);
      y.set(relY * pullRatio);
    } else {
      x.set((relX / (rect.width / 2)) * maxOffsetPx);
      y.set((relY / (rect.height / 2)) * maxOffsetPx);
    }
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    ref,
    onMouseMove: reduceMotion ? undefined : onMouseMove,
    onMouseLeave,
    style: { x: springX, y: springY },
  };

  if (href) {
    return (
      <MotionLink {...shared} href={href} className={className}>
        {children}
      </MotionLink>
    );
  }

  if (onClick) {
    return (
      <motion.button {...shared} onClick={onClick} className={className}>
        {children}
      </motion.button>
    );
  }

  return (
    <motion.div {...shared} className={className ? `inline-block ${className}` : "inline-block"}>
      {children}
    </motion.div>
  );
}
