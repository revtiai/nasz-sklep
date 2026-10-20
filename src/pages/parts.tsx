import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { gbp, useStore } from '../store.tsx';
import { Burst, ProductImage, Stepper, staggerItem, useT } from '../ui.tsx';
import type { Product } from '../data.ts';

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
      </a>
      <div className="p-4 flex flex-col flex-1">
        {p.brand && <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ink/50">{p.brand}</p>}
        <a href={`#/product/${p.id}`} className="font-display font-extrabold text-[1.2rem] md:text-[1.3rem] leading-[1.1] mt-0.5 py-1 -my-1 hover:text-red">{name}</a>
        <p className="text-[0.9rem] text-ink/60 leading-snug mt-1">{sub}</p>
        <p className="text-[0.85rem] text-ink/55 mt-1">{trade ? t(`Case of ${p.caseQty}`, `Karton ${p.caseQty} szt.`) : p.size}</p>
        <div className="mt-auto pt-4 flex items-end justify-between gap-2 flex-wrap">
          <div>
            <p className="font-display font-extrabold text-[1.6rem] leading-none">{gbp(trade ? p.casePrice : p.price)}{p.unit === 'kg' && !trade && <span className="text-base font-bold text-ink/55">/kg</span>}</p>
            {trade && <p className="text-[0.8rem] text-ink/55 mt-1">{gbp(p.casePrice / p.caseQty)} {t('each', 'za szt.')}</p>}
          </div>
          {qty === 0 ? (
            <button onClick={() => add(p)} className={`press inline-flex items-center gap-1.5 rounded-full min-h-12 px-4 font-bold ${trade ? 'bg-ink text-cream' : 'bg-red text-cream'}`} aria-label={`${t('Add', 'Dodaj')} ${name}`}>
              <Plus className="w-5 h-5" aria-hidden="true" />{trade ? t('Add case', 'Dodaj karton') : t('Add', 'Dodaj')}
            </button>
          ) : (
            <Stepper qty={qty} label={name} dec={() => add(p, -1)} inc={() => add(p)} />
          )}
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

export function PageHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-14 pb-6">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-bold text-[0.8rem] uppercase tracking-[0.2em] text-red">{eyebrow}</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-2 text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.95]">{title}</motion.h1>
      {body && <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-ink/70 max-w-2xl">{body}</motion.p>}
    </div>
  );
}
