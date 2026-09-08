export default function AlpsScene() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 800 340" className="h-[56vh] w-auto max-w-none opacity-95">
        <defs>
          <linearGradient id="alps-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39424a" />
            <stop offset="100%" stopColor="#1a2129" />
          </linearGradient>
          <linearGradient id="alps-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9d6dd" />
            <stop offset="60%" stopColor="#232b32" />
          </linearGradient>
        </defs>
        <path d="M0 200 L100 120 L180 190 L260 90 L340 180 L420 60 L500 170 L580 110 L660 195 L740 130 L800 200 L800 340 L0 340 Z" fill="url(#alps-far)" opacity="0.6" />
        <path d="M0 260 L120 150 L220 230 L320 110 L420 240 L520 140 L620 250 L720 160 L800 260 L800 340 L0 340 Z" fill="url(#alps-near)" />
      </svg>
    </div>
  );
}
