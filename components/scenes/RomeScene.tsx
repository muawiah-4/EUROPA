export default function RomeScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 700 380" className="h-[52vh] w-auto max-w-none opacity-90" style={{ filter: "drop-shadow(0 0 70px rgba(217,154,91,0.14))" }}>
        <defs>
          <linearGradient id="rome-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a120c" />
            <stop offset="100%" stopColor="#231a12" />
          </linearGradient>
        </defs>
        {/* Colosseum — original simplified arched-ring silhouette */}
        <g fill="url(#rome-fade)" stroke="rgba(217,154,91,0.22)" strokeWidth="1">
          <path d="M50 340 A300 220 0 0 1 650 340 L650 380 L50 380 Z" />
          {Array.from({ length: 16 }).map((_, i) => {
            const t = i / 15;
            const angle = Math.PI - t * Math.PI;
            const rx = 300;
            const ry = 220;
            const cx = 350 + rx * Math.cos(angle) * 0.98;
            const cy = 340 - ry * Math.sin(angle) * 0.98;
            return <rect key={i} x={cx - 9} y={cy} width="18" height="40" opacity={0.85} />;
          })}
        </g>
        <ellipse cx="350" cy="376" rx="320" ry="6" fill="rgba(217,154,91,0.16)" />
      </svg>
    </div>
  );
}
