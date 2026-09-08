export default function LondonScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 400 500" className="h-[68vh] w-auto max-w-none opacity-90" style={{ filter: "drop-shadow(0 0 50px rgba(224,169,74,0.1))" }}>
        <defs>
          <linearGradient id="london-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1116" />
            <stop offset="100%" stopColor="#171b22" />
          </linearGradient>
        </defs>
        {/* Clock-tower silhouette — original simplified form */}
        <g fill="url(#london-fade)" stroke="rgba(224,169,74,0.2)" strokeWidth="1">
          <rect x="150" y="60" width="100" height="360" />
          <rect x="135" y="40" width="130" height="24" />
          <path d="M150 40 L200 0 L250 40 Z" />
          <circle cx="200" cy="140" r="34" fill="#e0a94a" opacity="0.85" />
          <rect x="60" y="380" width="280" height="40" />
        </g>
        <ellipse cx="200" cy="424" rx="200" ry="6" fill="rgba(224,169,74,0.12)" />
      </svg>
    </div>
  );
}
