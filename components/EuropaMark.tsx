/**
 * The site's logomark — a ring of small stars, echoing the idea behind the
 * user-supplied reference image (the EU flag's circle-of-stars) without
 * reproducing the actual flag: that's an official government symbol, and
 * using it as this site's own logo would misleadingly suggest institutional
 * affiliation, directly contradicting the footer's own "not affiliated with
 * any destination shown" disclaimer. This keeps the *motif* — unity, a
 * circle, stars — in the site's single mint accent instead of the
 * flag's specific blue/gold (app/icon.svg mirrors this mark), and with 8 points instead of 12 so it reads as
 * its own mark rather than a redrawn copy.
 */
export default function EuropaMark({ size = 18 }: { size?: number }) {
  const points = 8;
  const r = 6.5;
  const stars = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
    return { x: 10 + r * Math.cos(angle), y: 10 + r * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden className="shrink-0">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={0.9} fill="#3bba9c" />
      ))}
      <circle cx={10} cy={10} r={1.1} fill="#3bba9c" opacity={0.55} />
    </svg>
  );
}
