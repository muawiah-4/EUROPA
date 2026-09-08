"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Explore" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "About" },
];

/**
 * Global overlay nav. On the flagship journey page (/) it stays fully
 * transparent until the user scrolls a little (so it never competes with
 * the hero's own entrance), then gains a soft glass backing — same
 * "chrome floats over the world, never a hard bar" instinct as the rest of
 * the design system. On interior pages it's solid from the start since
 * there's no full-bleed hero underneath it immediately.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 md:px-10">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 transition-opacity duration-500"
        style={{
          opacity: scrolled ? 1 : 0,
          background: "rgba(5,5,6,0.72)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(242,239,233,0.08)",
        }}
      />

      <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone">
        Europe
      </Link>

      <nav className="flex items-center gap-8">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] uppercase tracking-[0.24em] transition-colors"
              style={{ color: active ? "#f2efe9" : "rgba(184,182,174,0.6)" }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
