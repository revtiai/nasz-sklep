import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useStore } from './store.tsx';
import type { Product } from './data.ts';

export const BASE = import.meta.env.BASE_URL;
export const img = (path: string) => `${BASE}img/${path}`;
export const ease = [0.22, 1, 0.36, 1] as const;

export function useT() {
  const { lang } = useStore();
  return (en: string, pl: string) => (lang === 'pl' ? pl : en);
}

/** The shop's name, set as on the sign. This is the brand: it does not change. */
export function Wordmark({ className = '', light = false, place = false }: { className?: string; light?: boolean; place?: boolean }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className={`font-display font-extrabold tracking-[-0.03em] ${light ? 'text-cream' : 'text-red'}`} style={{ fontVariationSettings: '"wdth" 88' }}>
        Nasz Sklep
      </span>
      {place && <span className={`mt-[0.18em] text-[0.32em] font-bold tracking-[0.32em] uppercase ${light ? 'text-cream/80' : 'text-ink/70'}`}>Southampton</span>}
    </span>
  );
}

/** Digital-only mark: "NS" on the red sign plaque. For favicons, social avatars and the app icon. */
export function Mark({ size = 48, className = '', inverse = false }: { size?: number; className?: string; inverse?: boolean }) {
  const bg = inverse ? '#FFF8EF' : '#D7141A';
  const fg = inverse ? '#D7141A' : '#FFF8EF';
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} role="img" aria-label="Nasz Sklep">
      <rect width="64" height="64" rx="16" fill={bg} />
      <rect x="5" y="5" width="54" height="54" rx="11.5" fill="none" stroke={fg} strokeWidth="2.4" />
      <text x="32" y="43.5" textAnchor="middle" fontFamily="'Bricolage Grotesque Variable', 'Arial Black', sans-serif" fontWeight="800" fontSize="29" letterSpacing="-1.4" fill={fg} style={{ fontVariationSettings: '"wdth" 80' }}>NS</text>
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
    <span className={`relative grid place-items-center text-center text-cream font-display font-extrabold leading-[0.95] ${className}`} style={style}>
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

export function Stepper({ qty, dec, inc, label }: { qty: number; dec: () => void; inc: () => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full bg-cream border-2 border-ink h-12">
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
