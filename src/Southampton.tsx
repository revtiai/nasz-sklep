import { useEffect, useRef, useState } from 'react';

const INK = '#2A2420';
const ln = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Battlements({ x, y, w, step = 14, h = 9 }: { x: number; y: number; w: number; step?: number; h?: number }) {
  const n = Math.floor(w / step);
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) {
    const a = x + i * step;
    d += i % 2 === 0 ? ` L${a} ${y - h} L${a + step} ${y - h} L${a + step} ${y}` : ` L${a + step} ${y}`;
  }
  return <path d={d} {...ln} fill="#FBF3E6" />;
}

function Crane({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 372) scale(${s})`} {...ln}>
      <path d="M0 0 L12 -150 M58 0 L46 -150 M12 -150 L46 -150 M6 -75 L52 -75 M0 0 L52 -75 M58 0 L6 -75" />
      <path d="M-120 -150 L110 -150 L110 -162 L-120 -162 Z" fill="url(#hatch)" />
      <path d="M-120 -162 L-120 -150 M-90 -162 L-60 -150 M-60 -162 L-30 -150 M-30 -162 L0 -150" />
      <path d="M22 -162 L29 -205 L36 -162 M29 -205 L-110 -162 M29 -205 L104 -162" />
      <rect x="14" y="-182" width="30" height="20" fill="url(#hatch-dense)" stroke={INK} strokeWidth="1.4" />
      <path d="M-70 -150 L-70 -112 M-78 -112 L-62 -112" />
      <rect x="-82" y="-112" width="24" height="12" fill="#FBF3E6" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

function Bargate() {
  const tower = (x: number) => (
    <g>
      <path d={`M${x} 372 L${x} 196 L${x + 64} 196 L${x + 64} 372 Z`} fill="url(#stone)" {...ln} />
      <Battlements x={x - 4} y={196} w={72} step={12} />
      <path d={`M${x + 20} 236 L${x + 20} 262 M${x + 44} 236 L${x + 44} 262`} stroke={INK} strokeWidth="3" />
      <path d={`M${x + 8} 196 L${x + 8} 372 M${x + 56} 196 L${x + 56} 372`} stroke={INK} strokeWidth=".7" opacity=".6" />
    </g>
  );
  return (
    <g>
      <path d="M672 372 L672 176 L828 176 L828 372 Z" fill="url(#stone)" {...ln} />
      <Battlements x={668} y={176} w={164} step={14} h={10} />
      {tower(622)}
      {tower(814)}
      <path d="M712 372 L712 312 Q750 268 788 312 L788 372 Z" fill="url(#hatch-dense)" {...ln} />
      <path d="M704 372 L704 308 Q750 256 796 308 L796 372" {...ln} />
      {[722, 750, 778].map((x) => (
        <path key={x} d={`M${x - 6} 246 L${x - 6} 228 Q${x} 218 ${x + 6} 228 L${x + 6} 246 Z`} fill="url(#hatch-dense)" {...ln} />
      ))}
      <path d="M690 266 L810 266" {...ln} />
      <path d="M750 176 L750 140" {...ln} />
      <path d="M750 140 L776 147 L750 154" {...ln} fill="#D7141A" />
      <text x="750" y="294" textAnchor="middle" fontSize="7" fontFamily="serif" fill={INK} opacity=".7">BARGATE</text>
    </g>
  );
}

function Wall() {
  return (
    <g>
      <path d="M878 372 L878 296 L1070 296 L1070 372" fill="url(#stone)" {...ln} />
      <Battlements x={878} y={296} w={192} step={12} h={8} />
      <path d="M560 372 L560 304 L622 304 L622 372" fill="url(#stone)" {...ln} />
      <Battlements x={560} y={304} w={62} step={12} h={8} />
    </g>
  );
}

function ClockTower() {
  return (
    <g>
      <path d="M1094 372 L1094 108 L1136 108 L1136 372 Z" fill="url(#hatch)" {...ln} />
      <path d="M1088 108 L1142 108 L1142 98 L1088 98 Z" fill="#FBF3E6" {...ln} />
      <path d="M1098 98 L1115 64 L1132 98 Z" fill="url(#hatch-dense)" {...ln} />
      <path d="M1115 64 L1115 40" {...ln} />
      <circle cx="1115" cy="128" r="12" fill="#FBF3E6" {...ln} />
      <path d="M1115 128 L1115 120 M1115 128 L1121 131" {...ln} />
      {[160, 200, 240, 280, 320].map((y) => <path key={y} d={`M1104 ${y} L1104 ${y + 22} M1126 ${y} L1126 ${y + 22}`} {...ln} strokeWidth="2.4" />)}
      <path d="M1040 372 L1040 300 L1094 300 M1136 300 L1176 300 L1176 372" fill="url(#hatch)" {...ln} />
      {[1050, 1066, 1146, 1160].map((x) => <rect key={x} x={x} y="314" width="8" height="18" fill="#FBF3E6" {...ln} strokeWidth="1.1" />)}
    </g>
  );
}

function Terrace() {
  const houses = [
    { x: 1190, w: 86, h: 150 },
    { x: 1276, w: 96, h: 172, shop: true },
    { x: 1372, w: 84, h: 140 },
    { x: 1456, w: 92, h: 162 },
    { x: 1548, w: 70, h: 132 },
  ];
  return (
    <g>
      {houses.map(({ x, w, h, shop }) => {
        const top = 372 - h;
        return (
          <g key={x}>
            <path d={`M${x} 372 L${x} ${top} L${x + w} ${top} L${x + w} 372`} fill="#FBF3E6" {...ln} />
            <path d={`M${x} ${top} L${x + w / 2} ${top - 26} L${x + w} ${top} Z`} fill="url(#hatch)" {...ln} />
            <rect x={x + w * 0.62} y={top - 38} width="12" height="22" fill="url(#hatch-dense)" {...ln} />
            {[0, 1].map((r) => [0, 1].map((c) => (
              <g key={`${r}${c}`}>
                <rect x={x + 14 + c * (w / 2 - 6)} y={top + 18 + r * 40} width={w / 2 - 22} height="24" fill="#FBF3E6" {...ln} strokeWidth="1.2" />
                <path d={`M${x + 14 + c * (w / 2 - 6) + (w / 2 - 22) / 2} ${top + 18 + r * 40} l0 24`} {...ln} strokeWidth=".8" />
              </g>
            )))}
            {shop ? (
              <g>
                <rect x={x + 6} y={330} width={w - 12} height="14" fill="#FBF3E6" stroke="#D7141A" strokeWidth="2" />
                <text x={x + w / 2} y={341} textAnchor="middle" fontSize="9" fontWeight="800" fontFamily="'Bricolage Grotesque Variable', sans-serif" fill="#D7141A">NASZ SKLEP</text>
                <path d={`M${x + 4} 346 L${x + w - 4} 346 L${x + w - 10} 356 L${x + 10} 356 Z`} fill="#D7141A" stroke={INK} strokeWidth="1.2" />
                <rect x={x + 14} y={358} width={w - 28} height="14" fill="url(#hatch-dense)" {...ln} strokeWidth="1.1" />
              </g>
            ) : (
              <rect x={x + w / 2 - 9} y={340} width="18" height="32" fill="url(#hatch)" {...ln} strokeWidth="1.2" />
            )}
          </g>
        );
      })}
    </g>
  );
}

function CruiseShip() {
  return (
    <g>
      <path d="M0 0 L540 0 L520 46 L36 46 Q14 46 0 0 Z" fill="url(#hatch)" {...ln} strokeWidth="2" />
      <path d="M8 14 L534 14" {...ln} />
      <path d="M40 0 L40 -18 L470 -18 L490 0 M60 -18 L60 -34 L440 -34 L452 -18 M90 -34 L90 -50 L400 -50 L410 -34 M120 -50 L120 -64 L330 -64 L338 -50" fill="#FBF3E6" {...ln} />
      {[-9, -26, -42, -57].map((y, i) => (
        <path key={y} d={`M${52 + i * 30} ${y} L${460 - i * 34} ${y}`} stroke={INK} strokeWidth="2.6" strokeDasharray="5 4" />
      ))}
      <path d="M240 -64 L246 -98 L292 -98 L300 -64 Z" fill="url(#hatch-dense)" {...ln} strokeWidth="1.8" />
      <path d="M238 -106 L300 -106 L296 -98 L242 -98 Z" fill={INK} />
      <path d="M128 -64 L128 -84 M128 -84 L176 -64" {...ln} />
      {[70, 160, 250, 340, 430].map((x) => <circle key={x} cx={x} cy="30" r="2.2" fill={INK} />)}
      <path d="M-40 40 Q-10 36 0 44 M-90 46 Q-50 40 -14 50 M-150 52 Q-90 46 -30 56" {...ln} strokeWidth="1.1" opacity=".7" />
    </g>
  );
}

function Ferry() {
  return (
    <g>
      <path d="M0 0 L210 0 L196 22 L18 22 Z" fill="url(#hatch)" {...ln} />
      <path d="M24 0 L24 -16 L170 -16 L184 0" fill="#FBF3E6" {...ln} />
      <path d="M40 -8 L160 -8" stroke={INK} strokeWidth="2.4" strokeDasharray="4 4" />
      <path d="M92 -16 L96 -40 L122 -40 L126 -16 Z" fill="#D7141A" stroke={INK} strokeWidth="1.6" />
      <path d="M94 -46 L124 -46 L122 -40 L96 -40 Z" fill={INK} />
      <path d="M214 18 Q240 14 262 22 M224 24 Q262 20 300 28" {...ln} strokeWidth="1.1" opacity=".7" />
    </g>
  );
}

/** Southampton waterfront, drawn as a pen-and-ink engraving: the Bargate, the old walls, the Civic Centre
 *  clock tower, a St Mary's terrace with the shop, dock cranes and ships on Southampton Water. */
export function Southampton({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <svg ref={ref} viewBox="0 0 1600 560" preserveAspectRatio="xMidYMax slice" fill="none" className={`${className} ${on ? '' : 'paused'}`} aria-hidden="true">
      <defs>
        <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="1" />
        </pattern>
        <pattern id="hatch-dense" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke={INK} strokeWidth="1.3" />
        </pattern>
        <pattern id="stone" width="22" height="12" patternUnits="userSpaceOnUse">
          <rect width="22" height="12" fill="#FBF3E6" />
          <path d="M0 12 L22 12 M0 6 L22 6 M8 0 L8 6 M19 6 L19 12" stroke={INK} strokeWidth=".8" opacity=".75" />
        </pattern>
        <pattern id="water" width="60" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 4 Q15 1 30 4 T60 4" stroke={INK} strokeWidth=".9" fill="none" opacity=".55" />
        </pattern>
      </defs>

      <g opacity=".45">
        {[40, 62, 84].map((y, i) => <path key={y} d={`M${180 + i * 40} ${y} q40 -16 80 0 q30 -12 60 2`} {...ln} strokeWidth="1.1" />)}
        {[54, 76].map((y, i) => <path key={y} d={`M${1320 + i * 30} ${y} q30 -12 60 0 q26 -10 52 2`} {...ln} strokeWidth="1.1" />)}
      </g>

      <Crane x={70} s={0.9} />
      <Crane x={250} s={1.08} />
      <Crane x={430} s={0.82} />
      <Wall />
      <Bargate />
      <ClockTower />
      <Terrace />

      <path d="M0 372 L1600 372" stroke={INK} strokeWidth="2.2" />
      <path d="M0 380 L1600 380" stroke={INK} strokeWidth="1" />
      {Array.from({ length: 20 }, (_, i) => <rect key={i} x={20 + i * 82} y="366" width="6" height="8" rx="2" fill={INK} />)}
      <rect x="0" y="384" width="1600" height="176" fill="url(#water)" />

      <g className="gulls">
        {[[520, 120], [560, 98], [980, 86], [1010, 110], [1250, 70]].map(([x, y], i) => (
          <path key={i} className="gull" style={{ animationDelay: `${i * 0.7}s` }} d={`M${x - 9} ${y} q5 -6 9 0 q4 -6 9 0`} {...ln} strokeWidth="1.4" />
        ))}
      </g>

      <g className="sail-ferry"><g transform="translate(0 488)"><Ferry /></g></g>
      <g className="sail-ship"><g transform="translate(0 432)"><CruiseShip /></g></g>
    </svg>
  );
}
