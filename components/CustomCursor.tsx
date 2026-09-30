"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Global custom cursor: a small solid dot tracking the pointer exactly,
 * plus a slower, spring-trailing hairline ring behind it that expands and
 * fills faintly over anything carrying `data-cursor="link"` (nav links,
 * cards, buttons) or a native `<a>`/`<button>`. Fine-pointer desktop only —
 * gated off entirely on touch devices and under prefers-reduced-motion, so
 * it never fights a thumb or replaces a native cursor someone has asked
 * the OS to keep still. While active, the native cursor is hidden via a
 * single class on <html> rather than a global CSS rule baked into
 * globals.css, so it only ever applies when this component has actually
 * mounted and decided the device qualifies.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 260, damping: 26, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 260, damping: 26, mass: 0.4 });

  const enabledRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ok = fine && !reduced;
    enabledRef.current = ok;
    setEnabled(ok);
    if (ok) document.documentElement.classList.add("custom-cursor-active");
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest('a, button, [data-cursor="link"], [role="button"]');
      setHovering(interactive);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-bone"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{ scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-bone/50"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: hovering ? 52 : 26,
          height: hovering ? 52 : 26,
          // Literal --bone channels: Framer Motion interpolates concrete colours, not var().
          backgroundColor: hovering ? "rgba(248,248,249,0.08)" : "rgba(248,248,249,0)",
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
