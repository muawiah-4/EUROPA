"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #1d160c 0%, transparent 65%)" }}
      />
      <div className="relative flex max-w-xl flex-col items-center">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">Off the map</div>
        <h1
          className="text-balance font-display font-light leading-[0.95] tracking-[-0.03em] text-bone"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
        >
          This part of the journey didn&rsquo;t load.
        </h1>
        <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-mist">
          Something went wrong rendering this page. Try again, or head back to the start.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            data-cursor="link"
            className="rounded-full bg-bone px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-void transition-opacity hover:opacity-80"
          >
            Try again
          </button>
          <Link
            href="/"
            data-cursor="link"
            className="hairline rounded-full px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors hover:border-bone/40 hover:text-bone"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
