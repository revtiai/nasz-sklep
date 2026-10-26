import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Facebook, Plus } from 'lucide-react';
import { gbp, useStore } from '../store.tsx';
import { Burst, ProductImage, Stepper, staggerItem, useT } from '../ui.tsx';
import { SHOP, categoryOf, type Product } from '../data.ts';

export function ProductCard({ p, className = '' }: { p: Product; className?: string }) {
  const t = useT();
  const { lang, trade, lines, add } = useStore();
  const qty = lines.find((l) => l.id === p.id && l.trade === trade)?.qty ?? 0;
  const name = lang === 'pl' ? p.pl : p.en;
  const sub = lang === 'pl' ? p.en : p.pl;
  return (
    <motion.li variants={staggerItem} className={`${className} flex`}>
      <div className="group w-full rounded-[1.6rem] bg-white overflow-hidden flex flex-col shadow-[0_1px_0_rgb(28_25_23/0.08),0_14px_30px_-24px_rgb(28_25_23/0.4)] hover:-translate-y-1 transition-transform duration-300">
      <a href={`#/product/${p.id}`} className="relative block" aria-label={name}>
        <ProductImage p={p} className="aspect-square" />
        {p.offer && !trade && (
          <Burst className="absolute right-2 top-2 w-[4.6rem] h-[4.6rem] text-[0.78rem] rotate-[8deg] group-hover:rotate-[-4deg] transition-transform duration-500">{lang === 'pl' ? p.offer.pl : p.offer.en}</Burst>
        )}
        {categoryOf(p.category).age && <span className="absolute left-2 top-2 rounded-full bg-ink text-cream text-[0.8rem] font-bold px-2.5 py-1 leading-none">18+</span>}
      </a>
      <div className="p-4 flex flex-col flex-1">
        {p.brand && <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ink/50">{p.brand}</p>}
        <a href={`#/product/${p.id}`} className="font-display font-extrabold text-[1.2rem] md:text-[1.3rem] leading-[1.1] mt-0.5 py-1 -my-1 hover:text-red">{name}</a>
        <p className="text-[0.9rem] text-ink/60 leading-snug mt-1">{sub}</p>
        <p className="text-[0.85rem] text-ink/55 mt-1">{trade ? t(`Case of ${p.caseQty}`, `Karton ${p.caseQty} szt.`) : p.size}</p>
        <div className="mt-auto pt-4">
          <p className="font-display font-extrabold text-[1.6rem] leading-none">{gbp(trade ? p.casePrice : p.price)}{p.unit === 'kg' && !trade && <span className="text-base font-bold text-ink/55">/kg</span>}</p>
          {trade && <p className="text-[0.8rem] text-ink/55 mt-1">{gbp(p.casePrice / p.caseQty)} {t('each', 'za szt.')}</p>}
          <div className="mt-3">
            {qty === 0 ? (
              <button onClick={() => add(p)} className={`press w-full inline-flex items-center justify-center gap-1.5 rounded-full min-h-12 px-4 font-bold ${trade ? 'bg-ink text-cream' : 'bg-red text-cream'}`} aria-label={`${t('Add', 'Dodaj')} ${name}`}>
                <Plus className="w-5 h-5" aria-hidden="true" />{trade ? t('Add case', 'Dodaj karton') : t('Add', 'Dodaj')}
              </button>
            ) : (
              <Stepper wide qty={qty} label={name} dec={() => add(p, -1)} inc={() => add(p)} />
            )}
          </div>
        </div>
      </div>
      </div>
    </motion.li>
  );
}

export function PriceSwitch() {
  const t = useT();
  const { trade, setTrade, account } = useStore();
  return (
    <div role="group" aria-label={t('Prices', 'Ceny')} className="inline-flex rounded-full bg-white border-2 border-ink/15 p-1.5 font-bold">
      <button onClick={() => setTrade(false)} aria-pressed={!trade} className={`press rounded-full px-5 min-h-11 ${!trade ? 'bg-red text-cream' : 'text-ink/70'}`}><span className="sm:hidden">{t('Shop', 'Sklep')}</span><span className="hidden sm:inline">{t('Shop prices', 'Ceny sklepowe')}</span></button>
      <button onClick={() => setTrade(true)} aria-pressed={trade} className={`press rounded-full px-5 min-h-11 ${trade ? 'bg-ink text-cream' : 'text-ink/70'}`}>
        <span className="sm:hidden">{t('Trade (case)', 'Hurt (karton)')}</span><span className="hidden sm:inline">{t('Trade, by the case', 'Hurt, na kartony')}</span>{!account && <span className="sr-only"> ({t('needs a trade account to order', 'wymaga konta hurtowego')})</span>}
      </button>
    </div>
  );
}

export function PageHead({ eyebrow, title, body, side }: { eyebrow: string; title: string; body?: string; side?: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-14 pb-6 md:flex md:items-end md:justify-between md:gap-8">
      <div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-bold text-[0.8rem] uppercase tracking-[0.2em] text-red">{eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-2 text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.95]">{title}</motion.h1>
        {body && <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-ink/70 max-w-2xl">{body}</motion.p>}
      </div>
      {side && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-5 md:mt-0 shrink-0">{side}</motion.div>}
    </div>
  );
}

/** The shop's Facebook page, Nasz Sklep. */
export function FacebookLink() {
  const t = useT();
  return (
    <a href={SHOP.facebook} target="_blank" rel="noreferrer" className="press inline-flex items-center gap-3 rounded-full bg-white border-2 border-ink/15 hover:border-[#1877F2] pl-2 pr-5 min-h-14 font-bold">
      <span className="w-10 h-10 rounded-full bg-[#1877F2] text-white grid place-items-center"><Facebook className="w-5 h-5 fill-current" strokeWidth={0} aria-hidden="true" /></span>
      <span className="leading-tight text-left"><span className="block">{t('Nasz Sklep on Facebook', 'Nasz Sklep na Facebooku')}</span><span className="block text-[0.85rem] font-semibold text-ink/55">{t('Offers and new stock first', 'Promocje i nowości')}</span></span>
    </a>
  );
}
