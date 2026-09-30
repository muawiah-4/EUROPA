import Link from "next/link";

// Same treatment as app/error.tsx. Next adds <meta name="robots"
// content="noindex"> to 404 responses automatically.
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #1d160c 0%, transparent 65%)" }}
      />
      <div className="relative flex max-w-xl flex-col items-center">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em] text-smoke">404 / Off the map</div>
        <h1
          className="text-balance font-display font-light leading-[0.95] tracking-[-0.03em] text-bone"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
        >
          This stop isn&rsquo;t on the route.
        </h1>
        <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-mist">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Pick up the journey from the start,
          or choose a destination.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            data-cursor="link"
            className="rounded-full bg-bone px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-void transition-opacity hover:opacity-80"
          >
            Back home
          </Link>
          <Link
            href="/destinations"
            data-cursor="link"
            className="hairline rounded-full px-7 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors hover:border-bone/40 hover:text-bone"
          >
            All destinations
          </Link>
        </div>
      </div>
    </main>
  );
}
