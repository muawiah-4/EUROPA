export default function BarcelonaScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 500 460" className="h-[64vh] w-auto max-w-none opacity-90" style={{ filter: "drop-shadow(0 0 60px rgba(224,133,90,0.12))" }}>
        <defs>
          <linearGradient id="bcn-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#160f0d" />
            <stop offset="100%" stopColor="#231a14" />
          </linearGradient>
        </defs>
        {/* Organic curved spires — original, Gaudi-inspired abstraction, not a literal likeness */}
        <g fill="url(#bcn-fade)" stroke="rgba(224,133,90,0.24)" strokeWidth="1">
          <path d="M170 400 C160 300 185 220 200 130 C210 90 195 60 200 20 C205 60 220 95 225 140 C235 230 250 300 240 400 Z" />
          <path d="M260 400 C255 320 270 250 285 170 C292 140 282 110 285 70 C292 105 302 135 305 175 C312 250 325 320 320 400 Z" />
          <circle cx="200" cy="18" r="8" />
          <circle cx="285" cy="66" r="6" />
          <rect x="100" y="380" width="300" height="30" />
        </g>
        <ellipse cx="250" cy="414" rx="230" ry="6" fill="rgba(224,133,90,0.14)" />
      </svg>
    </div>
  );
}
