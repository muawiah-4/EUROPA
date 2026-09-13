import type { Destination } from "@/lib/journey";
import { DESTINATIONS } from "@/lib/journey";

/**
 * Formats a single decimal-degree coordinate as a compass-suffixed string,
 * e.g. formatCoordinate(48.8566, "N", "S") -> "48.8566° N"
 *      formatCoordinate(-0.1278, "E", "W") -> "0.1278° W"
 *
 * Negative values take `negativeLabel`, zero and positive values take
 * `positiveLabel` — the magnitude is always shown unsigned, with the
 * hemisphere/meridian carried entirely by the letter suffix.
 */
function formatCoordinate(value: number, positiveLabel: string, negativeLabel: string): string {
  const magnitude = Math.abs(value).toFixed(4);
  const direction = value < 0 ? negativeLabel : positiveLabel;
  return `${magnitude}° ${direction}`;
}

type Corner = "tl" | "tr" | "bl" | "br";

/**
 * One 22×22px L-shaped hairline mark, anchored to a viewport corner.
 * Structural "specimen vitrine" framing chrome, tinted with the
 * destination's own accent (previously a fixed neutral mist tone) so the
 * frame itself carries the page's color, not just the headline beneath it.
 */
function CornerBracket({ corner, accent }: { corner: Corner; accent: string }) {
  const isTop = corner === "tl" || corner === "tr";
  const isLeft = corner === "tl" || corner === "bl";

  return (
    <div
      className={[
        "absolute h-[22px] w-[22px]",
        isTop ? "top-6 md:top-10" : "bottom-6 md:bottom-10",
        isLeft ? "left-6 md:left-10" : "right-6 md:right-10",
      ].join(" ")}
    >
      <div className={["absolute h-px w-full", isTop ? "top-0" : "bottom-0"].join(" ")} style={{ background: `${accent}70` }} />
      <div className={["absolute h-full w-px", isLeft ? "left-0" : "right-0"].join(" ")} style={{ background: `${accent}70` }} />
    </div>
  );
}

/**
 * Fills the empty two-thirds of a destination hero (the space around the
 * bottom-left kinetic-wordmark headline) with a restrained "cataloged
 * specimen" framing device: four corner-bracket hairlines marking the
 * viewport like a vitrine, plus a small monospace coordinate/plate stamp
 * sitting in the open right-hand background. Every value shown is real
 * data already on the `Destination` model — nothing invented.
 *
 * Intended to be layered inside the hero `<section>` as an absolutely
 * positioned sibling (z-10, same stacking context as the headline block),
 * after the gradient backdrop / atmosphere particles / scrim and either
 * before or after the headline itself — it never occupies the bottom-left
 * quadrant, so ordering relative to the headline doesn't matter visually.
 */
export default function DestinationSpecimenFrame({ destination }: { destination: Destination }) {
  const lat = formatCoordinate(destination.coordinates.lat, "N", "S");
  const lon = formatCoordinate(destination.coordinates.lon, "E", "W");
  const plateIndex = String(destination.index).padStart(2, "0");
  const plateTotal = String(DESTINATIONS.length).padStart(2, "0");

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      <CornerBracket corner="tl" accent={destination.accent} />
      <CornerBracket corner="tr" accent={destination.accent} />
      <CornerBracket corner="bl" accent={destination.accent} />
      <CornerBracket corner="br" accent={destination.accent} />

      <div className="dest-hero-fade absolute right-6 top-24 text-right md:right-16 md:top-28">
        <div className="ml-auto h-px w-6" style={{ background: `${destination.accent}70` }} />
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/80 md:text-[12px]">
          {lat}, {lon}
        </div>
        <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke md:text-[12px]">
          Plate No. {plateIndex} / {plateTotal}
        </div>
        <div
          className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] md:text-[12px]"
          style={{ color: destination.accent, opacity: 0.85 }}
        >
          {destination.atmosphere}
        </div>
      </div>
    </div>
  );
}
