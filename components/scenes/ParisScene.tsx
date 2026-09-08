export default function ParisScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg
        viewBox="0 0 400 620"
        className="h-[78vh] w-auto max-w-none opacity-90"
        style={{ filter: "drop-shadow(0 0 60px rgba(232,192,122,0.12))" }}
      >
        <defs>
          <linearGradient id="paris-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0906" />
            <stop offset="100%" stopColor="#241a12" />
          </linearGradient>
        </defs>
        {/* Eiffel Tower — simplified original lattice silhouette */}
        <g fill="url(#paris-fade)" stroke="rgba(232,192,122,0.25)" strokeWidth="1">
          <path d="M200 40 L212 220 L188 220 Z" />
          <path d="M188 220 L120 420 L152 420 L200 240 Z" />
          <path d="M212 220 L280 420 L248 420 L200 240 Z" />
          <path d="M152 420 L60 610 L110 610 L188 440 Z" />
          <path d="M248 420 L340 610 L290 610 L212 440 Z" />
          <rect x="120" y="415" width="160" height="10" />
          <rect x="80" y="600" width="240" height="16" />
          <path d="M175 240 h50 v40 h-50 z" opacity="0.7" />
        </g>
        {/* horizon glow */}
        <ellipse cx="200" cy="616" rx="220" ry="6" fill="rgba(232,192,122,0.15)" />
      </svg>
    </div>
  );
}
