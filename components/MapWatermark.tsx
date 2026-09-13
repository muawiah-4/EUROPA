import Image from "next/image";

/**
 * A faint, fixed Europe-outline plate behind a page's whole scroll length —
 * same source image and invert/color-wash treatment already used under the
 * Journeys route builder's pins, just scaled up and pushed low-opacity so it
 * reads as "we're looking at a map" texture rather than a second graphic.
 * Sits above AmbientBackground's -z-10 bloom and below page content (z-0,
 * content is given relative/z-10 by each page's own sections).
 *
 * `align` shifts the map's focal point per page so Destinations, Journeys,
 * and Experiences don't all present the exact same crop.
 */
export default function MapWatermark({ align = "center" }: { align?: "left" | "center" | "right" }) {
  const objectPosition = align === "left" ? "20% 50%" : align === "right" ? "80% 50%" : "50% 50%";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Image
        src="/maps/europe-outline.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition,
          filter: "invert(1) brightness(0.85) contrast(0.95) grayscale(1)",
          opacity: 0.05,
          transform: "scale(1.3)",
        }}
      />
      <div className="absolute inset-0" style={{ background: "rgb(var(--void))", mixBlendMode: "color", opacity: 0.85 }} />
    </div>
  );
}
