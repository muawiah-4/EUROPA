import Link from "next/link";
import { DESTINATIONS } from "@/lib/journey";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-void px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone">Europe</div>
          <p className="mt-4 max-w-[26ch] text-[13px] leading-relaxed text-smoke">
            An interactive journey through Europe&rsquo;s most unforgettable places.
          </p>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">Destinations</div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {DESTINATIONS.slice(0, 4).map((d) => (
              <li key={d.id}>
                <Link href={`/destinations/${d.id}`} className="text-[13px] text-mist transition-colors hover:text-bone">
                  {d.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">More</div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {DESTINATIONS.slice(4).map((d) => (
              <li key={d.id}>
                <Link href={`/destinations/${d.id}`} className="text-[13px] text-mist transition-colors hover:text-bone">
                  {d.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">Site</div>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <Link href="/" className="text-[13px] text-mist transition-colors hover:text-bone">
                Begin the journey
              </Link>
            </li>
            <li>
              <Link href="/destinations" className="text-[13px] text-mist transition-colors hover:text-bone">
                All destinations
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-[13px] text-mist transition-colors hover:text-bone">
                About this project
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-smoke md:flex-row md:items-center">
        <p>A concept travel experience — not a booking platform, not affiliated with any destination shown.</p>
        <p className="font-mono uppercase tracking-[0.2em]">8 cities · 1 journey</p>
      </div>
    </footer>
  );
}
