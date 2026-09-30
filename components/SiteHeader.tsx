"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EuropaMark from "@/components/EuropaMark";

const LINKS = [
  { href: "/", label: "Explore" },
  { href: "/destinations", label: "Destinations" },
  { href: "/journeys", label: "Journeys" },
  { href: "/experiences", label: "Experiences" },
  { href: "/about", label: "About" },
];

/**
 * Global overlay nav. On the flagship journey page (/) it stays fully
 * transparent until the user scrolls a little (so it never competes with
 * the hero's own entrance), then gains a soft glass backing — same
 * "chrome floats over the world, never a hard bar" instinct as the rest of
 * the design system. On interior pages it's solid from the start since
 * there's no full-bleed hero underneath it immediately.
 *
 * Below md, the five links no longer fit a single row at the type scale
 * this system uses (mono, wide tracking, real tap targets) — a hamburger
 * opens a fullscreen overlay instead of shrinking type or wrapping links,
 * with the same restrained stagger-reveal entrance GhostHeading/HeroTitle
 * already use elsewhere.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  // Recomputed whenever the route changes: the header persists across
  // client-side navigations, so inner pages must reset it to solid here
  // rather than relying on the initial useState value.
  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close on route change, lock body scroll while open, allow Escape.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const chromeVisible = scrolled || menuOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 md:px-10">
        {/* Made to "pop" against the page rather than sit as a faint glass
            sliver: a near-opaque elevated surface (was translucent void)
            plus a visible mint-tinted bottom edge instead of the old
            near-invisible neutral hairline — still flat (no shadow/blur
            elevation trick), just a more confident surface + a real accent
            line marking where the chrome ends and the page begins. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 transition-opacity duration-500"
          style={{
            opacity: chromeVisible ? 1 : 0,
            background: "rgba(58,63,71,0.92)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(59,186,156,0.35)",
          }}
        />

        <Link
          href="/"
          data-cursor="link"
          className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.32em] text-bone"
        >
          <EuropaMark />
          Europa
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                data-cursor="link"
                className="font-mono text-[10px] uppercase tracking-[0.24em] transition-colors"
                style={{ color: active ? "rgb(var(--bone))" : "rgba(196,194,186,0.6)" }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          data-cursor="link"
          className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className="block h-px w-5 bg-bone transition-transform duration-300"
            style={{ transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-px w-5 bg-bone transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block h-px w-5 bg-bone transition-transform duration-300"
            style={{ transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none" }}
          />
        </button>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-void px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={l.href}
                      className="block border-b py-4 font-display text-4xl font-light tracking-[-0.02em]"
                      style={{
                        color: active ? "rgb(var(--bone))" : "rgb(var(--mist))",
                        borderColor: "rgba(242,239,233,0.08)",
                      }}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-smoke"
            >
              Europe, beyond the postcard.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
