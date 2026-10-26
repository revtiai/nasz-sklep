import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Heart, IdCard, PackageSearch, Truck } from 'lucide-react';
import { PRODUCTS, categoryOf } from '../data.ts';
import { RULES } from '../rules.ts';
import { gbp, useStore } from '../store.tsx';
import { Burst, ProductImage, Stepper, btn, ease, useT } from '../ui.tsx';
import { PriceSwitch, ProductCard } from './parts.tsx';

export default function ProductPage({ id }: { id?: string }) {
  const t = useT();
  const { lang, trade, add, account, updateAccount, say } = useStore();
  const p = PRODUCTS.find((x) => x.id === id) ?? PRODUCTS[0];
  const [qty, setQty] = useState(1);
  const name = lang === 'pl' ? p.pl : p.en;
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const fav = account?.favourites.includes(p.id);
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-10">
      <a href="#/shop" className="inline-flex items-center gap-2 font-semibold min-h-12"><ArrowLeft className="w-5 h-5" />{t('Back to the shop', 'Wróć do sklepu')}</a>
      <div className="mt-4 grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="relative">
          <ProductImage p={p} className="aspect-square rounded-[2.2rem]" />
          {p.offer && !trade && <Burst className="absolute right-4 top-4 w-28 h-28 text-lg rotate-6">{lang === 'pl' ? p.offer.pl : p.offer.en}</Burst>}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease }}>
          {p.brand && <p className="font-bold uppercase tracking-[0.16em] text-ink/55">{p.brand}</p>}
          <h1 className="mt-1 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[0.95]">{name}</h1>
          <p className="mt-2 text-xl text-ink/65">{lang === 'pl' ? p.en : p.pl}</p>
          <div className="mt-6"><PriceSwitch /></div>
          <div className="mt-6 rounded-[1.8rem] bg-white p-6">
            <p className="font-display font-extrabold text-[2.6rem] leading-none">{gbp(trade ? p.casePrice : p.price)}{p.unit === 'kg' && !trade && <span className="text-xl text-ink/55">/kg</span>}</p>
            <p className="mt-2 text-ink/65">{trade ? t(`Case of ${p.caseQty} · ${gbp(p.casePrice / p.caseQty)} each`, `Karton ${p.caseQty} szt. · ${gbp(p.casePrice / p.caseQty)} za szt.`) : p.size}</p>
            {p.unit === 'kg' && !trade && <p className="mt-1 text-sm text-ink/55">{t('Cut to order at the counter. You pay for the exact weight.', 'Krojone na miejscu. Płacisz za dokładną wagę.')}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Stepper qty={qty} label={name} dec={() => setQty(Math.max(1, qty - 1))} inc={() => setQty(qty + 1)} />
              <button onClick={() => { add(p, qty); say(t(`Added ${qty} × ${p.en}`, `Dodano ${qty} × ${p.pl}`)); }} className={`${btn.red} flex-1`}>{trade ? t('Add cases to basket', 'Dodaj kartony') : t('Add to basket', 'Dodaj do koszyka')}</button>
              {account && (
                <button onClick={() => updateAccount((a) => ({ ...a, favourites: fav ? a.favourites.filter((f) => f !== p.id) : [...a.favourites, p.id] }))} className="press w-14 h-14 rounded-full border-2 border-ink/15 bg-cream grid place-items-center" aria-pressed={fav} aria-label={t('Save to my list', 'Zapisz na liście')}>
                  <Heart className={`w-6 h-6 ${fav ? 'fill-red text-red' : ''}`} />
                </button>
              )}
            </div>
          </div>
          <ul className="mt-6 grid gap-3 text-[1.05rem]">
            <li className="flex gap-3"><Check className="w-6 h-6 text-leaf shrink-0" />{t('Order online, collect from 120 St Mary’s Road', 'Zamów online, odbierz na 120 St Mary’s Road')}</li>
            <li className="flex gap-3"><Truck className="w-6 h-6 text-leaf shrink-0" />{t(`Delivery: free within ${RULES.freeMiles} miles, ${gbp(RULES.fee)} up to ${RULES.maxMiles} miles`, `Dostawa: za darmo do ${RULES.freeMiles} mil, ${gbp(RULES.fee)} do ${RULES.maxMiles} mil`)}</li>
            {categoryOf(p.category).age && <li className="flex gap-3"><IdCard className="w-6 h-6 text-red shrink-0" />{t('18+ only. We check ID when you collect or when we deliver.', 'Tylko 18+. Sprawdzamy dowód przy odbiorze lub dostawie.')}</li>}
            <li className="flex gap-3"><PackageSearch className="w-6 h-6 text-leaf shrink-0" />{t('Need a larger amount?', 'Potrzebujesz więcej?')} <a href="#/request" className="font-bold text-red underline underline-offset-4">{t('Request it', 'Zamów')}</a></li>
          </ul>
          {p.source === 'facebook' && <p className="mt-6 text-sm text-ink/50">{t('Price taken from the shop’s Facebook post.', 'Cena z posta sklepu na Facebooku.')}</p>}
        </motion.div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-extrabold">{t('You might also need', 'Może się przydać')}</h2>
          <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </motion.ul>
        </section>
      )}
    </div>
  );
}
