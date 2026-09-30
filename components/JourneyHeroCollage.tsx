import Image from "next/image";
import { getDestinationById } from "@/lib/journey";

// A geographic spread across the Grand Tour route.
const COLLAGE_IDS = ["london", "amsterdam", "alps", "rome", "iceland"] as const;

const LAYOUT: { top: string; left: string; rotate: number; z: number }[] = [
  { top: "6%", left: "0%", rotate: -7, z: 1 },
  { top: "0%", left: "17%", rotate: 4, z: 2 },
  { top: "10%", left: "37%", rotate: -3, z: 3 },
  { top: "2%", left: "58%", rotate: 5, z: 2 },
  { top: "8%", left: "79%", rotate: -5, z: 1 },
];

/**
 * A fanned photo collage behind the Journeys hero — one card per stop in
 * COLLAGE_IDS. Graded monochrome (a neutral panel/void wash, one shared
 * mint glow) rather than each destination's own sky/accent — this hero is
 * ambient background, not any one destination's own page, so it follows
 * the site's closed accent economy instead of the per-destination palette
 * exception that page carries. Desktop/tablet only — collapsed on narrow
 * viewports where five angled cards would just read as clutter behind the
 * headline.
 */
export default function JourneyHeroCollage() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden opacity-90 md:block">
      {COLLAGE_IDS.map((id, i) => {
        const d = getDestinationById(id);
        if (!d?.photoSrc) return null;
        const layout = LAYOUT[i];
        return (
          <div
            key={id}
            className="absolute h-64 w-44 overflow-hidden lg:h-72 lg:w-48"
            style={{
              top: layout.top,
              left: layout.left,
              transform: `rotate(${layout.rotate}deg)`,
              zIndex: layout.z,
              border: "1px solid rgb(var(--bone) / 0.1)",
            }}
          >
            <Image
              src={d.photoSrc}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
              style={{ filter: "grayscale(0.35) sepia(0.18) saturate(0.7) brightness(0.55) contrast(1.1)" }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgb(var(--elevated)), rgb(var(--void)))", mixBlendMode: "color", opacity: 0.75 }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 30%, #3bba9c22, transparent 65%)" }}
            />
          </div>
        );
      })}
      {/* Scrim so the headline stays legible regardless of layout/viewport */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,12,14,0.55) 0%, rgba(11,12,14,0.3) 42%, rgba(11,12,14,0.94) 100%)",
        }}
      />
    </div>
  );
}
