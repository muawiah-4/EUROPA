export default function SantoriniScene() {
  const domes = [70, 160, 250, 330, 420];
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 500 300" className="h-[46vh] w-auto max-w-none">
        {/* cliffside whitewash terraces — original simplified silhouette */}
        <path d="M0 220 L60 210 L120 225 L180 200 L240 218 L300 195 L360 215 L420 205 L500 220 L500 300 L0 300 Z" fill="#eef2f4" opacity="0.94" />
        <path d="M0 240 L80 232 L160 244 L260 228 L360 240 L440 230 L500 240 L500 300 L0 300 Z" fill="#dfe7ea" opacity="0.9" />
        {domes.map((x, i) => (
          <g key={i}>
            <path d={`M${x - 22} 214 a22 20 0 0 1 44 0 z`} fill="#5fb8d6" />
            <rect x={x - 26} y="210" width="52" height="8" fill="#f4f7f8" />
          </g>
        ))}
        <ellipse cx="250" cy="296" rx="230" ry="5" fill="rgba(95,184,214,0.18)" />
      </svg>
    </div>
  );
}
