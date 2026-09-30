"use client";

import { useEffect } from "react";
import "./globals.css";

// Replaces the root layout when the layout itself throws, so it renders its
// own <html>/<body> and can't rely on SiteHeader, MotionProvider, etc.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-void px-6 text-center">
          <div className="flex max-w-xl flex-col items-center">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">EUROPA</div>
            <h1
              className="text-balance font-display font-light leading-[0.95] tracking-[-0.03em] text-bone"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
            >
              Something went wrong.
            </h1>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-bone px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-void transition-opacity hover:opacity-80"
              >
                Try again
              </button>
              {/* Plain anchor: a full reload is the most reliable recovery here. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="hairline rounded-full px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors hover:text-bone"
              >
                Back home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
