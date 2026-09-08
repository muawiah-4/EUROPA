export default function VeniceScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 600 300" className="h-[50vh] w-auto max-w-none opacity-90">
        <defs>
          <linearGradient id="venice-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1b20" />
            <stop offset="100%" stopColor="#16232a" />
          </linearGradient>
        </defs>
        {/* Canal-front facades — original simplified rowline */}
        <g fill="url(#venice-fade)" stroke="rgba(127,176,173,0.22)" strokeWidth="1">
          <rect x="20" y="120" width="70" height="90" />
          <rect x="95" y="90" width="60" height="120" />
          <path d="M95 90 h60 l-30 -26 z" />
          <rect x="160" y="110" width="80" height="100" />
          <rect x="245" y="70" width="50" height="140" />
          <path d="M245 70 h50 l-25 -22 z" />
          <rect x="300" y="100" width="90" height="110" />
          <rect x="395" y="115" width="65" height="95" />
          <rect x="465" y="85" width="55" height="125" />
          <path d="M465 85 h55 l-27 -22 z" />
          <rect x="525" y="105" width="55" height="105" />
        </g>
        {/* water + reflection */}
        <rect x="0" y="210" width="600" height="90" fill="rgba(127,176,173,0.08)" />
        <g opacity="0.18" transform="translate(0 210) scale(1 -1)">
          <rect x="95" y="-120" width="60" height="30" fill="#7fb0ad" />
          <rect x="245" y="-140" width="50" height="30" fill="#7fb0ad" />
          <rect x="465" y="-125" width="55" height="30" fill="#7fb0ad" />
        </g>
        {/* gondola */}
        <path d="M250 232 q40 -10 90 0 l-10 8 q-35 -6 -70 0 z" fill="#0b1a1c" />
      </svg>
    </div>
  );
}
