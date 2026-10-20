import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useStore } from './store.tsx';
import type { Product } from './data.ts';

export const BASE = import.meta.env.BASE_URL;
export const img = (path: string) => `${BASE}img/${path}`;
export const ease = [0.22, 1, 0.36, 1] as const;

export function useT() {
  const { lang } = useStore();
  return (en: string, pl: string) => (lang === 'pl' ? pl : en);
}

/** The rounded frame from the shop sign. Drawn as one continuous line that starts and ends at the
 *  gap in the bottom edge, so it can draw itself in and leave room for a label, exactly like the sign. */
function framePath(w: number, h: number, sw: number, gap: number) {
  const i = sw / 2;
  const r = Math.min((h - sw) * 0.42, (w - sw) / 2);
  const L = i, R = w - i, T = i, B = h - i, cx = w / 2;
  const g = gap / 2;
  return `M${cx - g} ${B} L${L + r} ${B} A${r} ${r} 0 0 1 ${L} ${B - r} L${L} ${T + r} A${r} ${r} 0 0 1 ${L + r} ${T} L${R - r} ${T} A${r} ${r} 0 0 1 ${R} ${T + r} L${R} ${B - r} A${r} ${r} 0 0 1 ${R - r} ${B} L${cx + g} ${B}`;
}

export function Frame({ draw = true, colour = '#D7141A', gapPx = 0, delay = 0.15 }: { draw?: boolean; colour?: string; gapPx?: number; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<[number, number, number] | null>(null);
  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      setBox([el.offsetWidth, el.offsetHeight, Math.max(1.5, fs * 0.075)]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const animate = draw && !reduce;
  return (
    <svg ref={ref} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden="true">
      {box && (
        <motion.path
          d={framePath(box[0], box[1], box[2], gapPx)}
          fill="none"
          stroke={colour}
          strokeWidth={box[2]}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
    </svg>
  );
}

/** The shop's name exactly as on the sign: red, inside the rounded red frame. This is the logo.
 *  With `place`, SOUTHAMPTON sits in a gap in the bottom line; the gap is measured from the label itself. */
export function Wordmark({ className = '', light = false, place = false, ring = true, draw = true }: { className?: string; light?: boolean; place?: boolean; ring?: boolean; draw?: boolean }) {
  const colour = light ? '#FFF8EF' : '#D7141A';
  const label = useRef<HTMLSpanElement>(null);
  const [gap, setGap] = useState(0);
  useLayoutEffect(() => {
    if (!place || !label.current) return;
    const el = label.current;
    const measure = () => setGap(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [place]);
  return (
    <span className={`relative inline-flex flex-col items-center leading-none ${ring ? `px-[0.5em] pt-[0.2em] ${place ? 'pb-[0.3em]' : 'pb-[0.26em]'}` : ''} ${className}`}>
      {ring && (!place || gap > 0) && <Frame draw={draw} colour={colour} gapPx={gap} />}
      <span className={`relative whitespace-nowrap font-display font-extrabold tracking-[-0.02em] ${light ? 'text-cream' : 'text-red'}`}>
        Nasz Sklep
      </span>
      {place && (
        <span ref={label} className={`absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 pl-[0.9em] pr-[0.66em] text-[0.2em] leading-none font-bold tracking-[0.24em] uppercase whitespace-nowrap ${light ? 'text-cream' : 'text-red'}`}>
          Southampton
        </span>
      )}
    </span>
  );
}

/** Square badge for avatars and the favicon: the name stacked inside the red circle. */
export function Badge({ size = 160, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Nasz Sklep">
      <circle cx="100" cy="100" r="100" fill="#FFF8EF" />
      <rect x="22" y="44" width="156" height="112" rx="46" fill="none" stroke="#D7141A" strokeWidth="5" />
      <text x="100" y="96" textAnchor="middle" fontFamily="'Bricolage Grotesque Variable', 'Arial Black', sans-serif" fontWeight="800" fontSize="44" letterSpacing="-1.5" fill="#D7141A" style={{ fontVariationSettings: '"wdth" 85' }}>Nasz</text>
      <text x="100" y="138" textAnchor="middle" fontFamily="'Bricolage Grotesque Variable', 'Arial Black', sans-serif" fontWeight="800" fontSize="44" letterSpacing="-1.5" fill="#D7141A" style={{ fontVariationSettings: '"wdth" 85' }}>Sklep</text>
      <rect x="54" y="150" width="92" height="12" fill="#FFF8EF" /><text x="100" y="160" textAnchor="middle" fontFamily="'Inter Variable', Arial, sans-serif" fontWeight="700" fontSize="10" letterSpacing="2.6" fill="#D7141A">SOUTHAMPTON</text>
    </svg>
  );
}

const reveal: Variants = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export function Reveal({ children, delay = 0, className = '', as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const reduce = useReducedMotion();
  const C = motion[as];
  return (
    <C className={className} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }} variants={reveal} transition={{ duration: 0.75, delay, ease }}>
      {children}
    </C>
  );
}

export function Stagger({ children, className = '', as = 'ul' }: { children: ReactNode; className?: string; as?: 'ul' | 'div' }) {
  const reduce = useReducedMotion();
  const C = motion[as];
  return (
    <C className={className} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
      {children}
    </C>
  );
}
export const staggerItem: Variants = { hidden: { opacity: 0, y: 24, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } } };

/** The red price burst, taken from the shop's own offer posters. */
export function Burst({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={`${/\babsolute\b/.test(className) ? '' : 'relative '}grid place-items-center text-center text-cream font-display font-extrabold leading-[0.95] ${className}`} style={style}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <path
          d={Array.from({ length: 28 }, (_, i) => {
            const a = (i / 28) * Math.PI * 2;
            const r = i % 2 ? 44 : 50;
            return `${i ? 'L' : 'M'}${50 + r * Math.cos(a)} ${50 + r * Math.sin(a)}`;
          }).join(' ') + 'Z'}
          fill="#D7141A"
        />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#FFF8EF" strokeWidth="1.6" strokeDasharray="2 3" />
      </svg>
      <span className="relative px-2">{children}</span>
    </span>
  );
}

export function ProductImage({ p, className = '' }: { p: Product; className?: string }) {
  if (p.img) {
    return (
      <div className={`relative overflow-hidden ${p.fit === 'contain' ? 'bg-white' : 'bg-paper'} ${className}`}>
        <img
          src={img(p.img)}
          alt=""
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full ${p.fit === 'contain' ? 'object-contain p-[8%]' : 'object-cover'}`}
          style={{ objectPosition: p.pos ?? '50% 50%', ...(p.zoom ? { transform: `scale(${p.zoom})`, transformOrigin: p.pos } : {}) }}
        />
      </div>
    );
  }
  const [bg, fg] = p.tile ?? ['#F3EADB', '#1C1917'];
  return (
    <div className={`relative overflow-hidden grid place-items-center ${className}`} style={{ background: bg }}>
      <div className="text-center px-3" style={{ color: fg }}>
        {p.brand && <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] opacity-80">{p.brand}</p>}
        <p className="font-display font-extrabold text-[clamp(1.2rem,3.4vw,1.9rem)] leading-[0.95] mt-1">{p.pl}</p>
        <p className="text-[0.7rem] mt-2 opacity-70">{p.size}</p>
      </div>
    </div>
  );
}

export function Stepper({ qty, dec, inc, label, wide = false }: { qty: number; dec: () => void; inc: () => void; label: string; wide?: boolean }) {
  return (
    <div className={`${wide ? 'flex w-full justify-between' : 'inline-flex'} items-center rounded-full bg-cream border-2 border-ink h-12`}>
      <button onClick={dec} className="press w-12 h-12 grid place-items-center" aria-label={`Remove one ${label}`}><Minus className="w-5 h-5" /></button>
      <span className="min-w-7 text-center font-bold text-lg tabular-nums" aria-live="polite">{qty}</span>
      <button onClick={inc} className="press w-12 h-12 grid place-items-center" aria-label={`Add one ${label}`}><Plus className="w-5 h-5" /></button>
    </div>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`font-bold text-[0.8rem] uppercase tracking-[0.2em] ${light ? 'text-gold' : 'text-red'}`}>{children}</p>;
}

export const btn = {
  red: 'press inline-flex items-center justify-center gap-2 rounded-full bg-red text-cream font-bold text-[1.05rem] min-h-14 px-7 shadow-[0_6px_0_#8E0D11] active:shadow-[0_2px_0_#8E0D11] active:translate-y-1',
  ink: 'press inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream font-bold text-[1.05rem] min-h-14 px-7',
  light: 'press inline-flex items-center justify-center gap-2 rounded-full bg-white text-ink font-bold text-[1.05rem] min-h-14 px-7 border-2 border-ink',
};

export const field = 'w-full rounded-2xl bg-white border-2 border-ink/80 px-4 min-h-14 text-[1.05rem] outline-none focus:border-red focus:ring-4 focus:ring-red/15';
