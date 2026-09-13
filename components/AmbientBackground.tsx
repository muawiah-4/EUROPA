/**
 * A persistent, fixed-to-viewport color layer sitting behind every page —
 * every page's own bg-void/bg-panel surfaces are slightly translucent (see
 * globals.css) so this shows through consistently as you scroll, since
 * `position: fixed` keeps it covering exactly the current viewport at any
 * scroll depth.
 *
 * Reworked into a genuine monochrome "bloom" (soft off-white glows against
 * near-black, no hue at all) to match the user-supplied grayscale palette —
 * the previous version blended five destination accent colors here, which
 * directly contradicted a background specifically requested as monochrome.
 * One mint accent still appears elsewhere on the site (the logo mark) —
 * intentionally kept as this palette's single color note against an
 * otherwise fully neutral background, not reintroduced here.
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: "#0b0c0e" }}>
      <div className="absolute -top-1/4 left-[6%] h-[62vh] w-[62vh] rounded-full blur-[160px]" style={{ background: "#f8f8f9", opacity: 0.1 }} />
      <div className="absolute top-[6%] right-[-6%] h-[58vh] w-[58vh] rounded-full blur-[160px]" style={{ background: "#c3c7ce", opacity: 0.09 }} />
      <div className="absolute bottom-[2%] left-[-8%] h-[56vh] w-[56vh] rounded-full blur-[160px]" style={{ background: "#c3c7ce", opacity: 0.08 }} />
      <div className="absolute -bottom-1/4 right-[6%] h-[60vh] w-[60vh] rounded-full blur-[160px]" style={{ background: "#f8f8f9", opacity: 0.09 }} />
      <div className="absolute top-1/2 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[170px]" style={{ background: "#f8f8f9", opacity: 0.06 }} />
    </div>
  );
}
