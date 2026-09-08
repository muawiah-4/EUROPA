export default function AmsterdamScene() {
  const widths = [46, 52, 44, 58, 48, 50, 42, 56];
  let x = 30;
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 560 300" className="h-[50vh] w-auto max-w-none opacity-90">
        <defs>
          <linearGradient id="ams-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141019" />
            <stop offset="100%" stopColor="#1a1720" />
          </linearGradient>
        </defs>
        <g fill="url(#ams-fade)" stroke="rgba(185,143,209,0.22)" strokeWidth="1">
          {widths.map((w, i) => {
            const h = 110 + ((i * 37) % 60);
            const gx = x;
            x += w + 6;
            return (
              <g key={i}>
                <rect x={gx} y={210 - h} width={w} height={h} />
                <path d={`M${gx} ${210 - h} h${w} l${-w / 2} -22 z`} />
              </g>
            );
          })}
        </g>
        <rect x="0" y="210" width="560" height="60" fill="rgba(185,143,209,0.07)" />
        <ellipse cx="280" cy="266" rx="260" ry="5" fill="rgba(185,143,209,0.14)" />
      </svg>
    </div>
  );
}
