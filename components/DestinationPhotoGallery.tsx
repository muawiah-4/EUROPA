import Image from "next/image";

export type GalleryPhoto = { src: string; aspect: number; caption: string };

/**
 * A small real-photo gallery for the /destinations/[id] page — the same
 * hybrid-photography trial Paris started (see DestinationPhotoBackdrop),
 * extended with a lighter grade suited to a gallery grid rather than a
 * full-bleed hero: subtle warmth and desaturation instead of the hero's
 * heavy darkening, since these photos carry themselves rather than sitting
 * behind overlaid text. Visual idiom (numbered plate, thin border, accent
 * hairline on hover) matches DestinationCard.tsx exactly.
 *
 * Photos arrive at whatever aspect ratio the source shot had — some
 * landscape, some portrait, occasionally square. That used to drive a CSS
 * multi-column masonry layout that let each photo keep its native
 * proportions, but with exactly three photos per destination (every
 * destination has exactly three — see lib/journey.ts), three columns means
 * one photo per column: a single portrait-shaped source among two
 * landscape ones then produced one column running much taller than its
 * neighbors, an accidental-looking gap that read as "this destination has
 * fewer photos" even though every destination has the same count.
 *
 * Fixed now with one deliberate composition every destination shares: a
 * large frame plus two stacked frames beside it, each cell a fixed
 * aspect ratio (not the source photo's own), photos cropped to fill via
 * object-cover. Every destination page renders the same shape, so the
 * gallery reads as one consistent frame set rather than a byproduct of
 * whatever aspect ratio each source photo happened to arrive at.
 */
export default function DestinationPhotoGallery({ photos, accent }: { photos: GalleryPhoto[]; accent: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:h-[440px] sm:grid-cols-3 sm:grid-rows-2 md:h-[500px]">
      {photos.map((p, i) => (
        <figure
          key={p.src}
          className={`group relative block overflow-hidden bg-panel aspect-[4/3] sm:aspect-auto sm:h-full ${
            i === 0 ? "sm:col-span-2 sm:row-span-2" : "sm:col-span-1 sm:row-span-1"
          }`}
          style={{ border: "1px solid rgba(242,239,233,0.08)" }}
        >
          <Image
            src={p.src}
            alt={p.caption}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
            style={{ filter: "grayscale(0.12) sepia(0.1) saturate(0.9) contrast(1.04)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{ background: "linear-gradient(0deg, rgba(11,12,14,0.75), transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ border: `1px solid ${accent}55` }}
          />
          <figcaption className="pointer-events-none absolute bottom-3 left-4 right-4 font-mono text-[10px] uppercase tracking-[0.16em] text-mist/90">
            <span style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span> &mdash; {p.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
