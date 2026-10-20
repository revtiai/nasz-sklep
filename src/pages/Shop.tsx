import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PackageSearch, Search } from 'lucide-react';
import { CATEGORIES, PRODUCTS, type CategoryId } from '../data.ts';
import { useStore } from '../store.tsx';
import { btn, useT } from '../ui.tsx';
import { PageHead, PriceSwitch, ProductCard } from './parts.tsx';

export default function Shop({ initial }: { initial?: string }) {
  const t = useT();
  const { lang, trade, account } = useStore();
  const [cat, setCat] = useState<CategoryId | 'all'>((CATEGORIES.some((c) => c.id === initial) ? initial : 'all') as CategoryId | 'all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'popular' | 'low' | 'high' | 'offers'>('popular');
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = PRODUCTS.filter((p) => (cat === 'all' || p.category === cat) && (!term || `${p.pl} ${p.en} ${p.brand ?? ''}`.toLowerCase().includes(term)));
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'offers') r = [...r].sort((a, b) => Number(!!b.offer) - Number(!!a.offer));
    return r;
  }, [cat, q, sort]);
  return (
    <>
      <PageHead eyebrow={t('The shop', 'Sklep')} title={t('Everything on the shelves', 'Wszystko z półek')} body={t('Shop by the item, or switch to trade prices to buy by the case.', 'Kupuj na sztuki albo przełącz na ceny hurtowe i kupuj na kartony.')} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <PriceSwitch />
          <label className="flex items-center gap-2 text-[1rem] font-semibold">
            {t('Sort', 'Sortuj')}
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-full bg-white border-2 border-ink/15 min-h-12 px-4 font-semibold">
              <option value="popular">{t('Most popular', 'Najpopularniejsze')}</option>
              <option value="offers">{t('Offers first', 'Najpierw promocje')}</option>
              <option value="low">{t('Price: low to high', 'Cena: od najniższej')}</option>
              <option value="high">{t('Price: high to low', 'Cena: od najwyższej')}</option>
            </select>
          </label>
        </div>
        {trade && !account && (
          <p className="mt-4 rounded-2xl bg-ink text-cream px-5 py-4">{t('You are seeing trade prices. To order by the case you need a trade account.', 'Widzisz ceny hurtowe. Aby zamawiać na kartony, potrzebne jest konto hurtowe.')} <a href="#/trade" className="underline font-bold">{t('Apply or sign in', 'Załóż lub zaloguj się')}</a></p>
        )}
        <div className="sticky top-[72px] md:top-[84px] z-20 -mx-4 px-4 md:mx-0 md:px-0 py-3 bg-cream mt-4">
          <label className="relative block">
            <span className="sr-only">{t('Search', 'Szukaj')}</span>
            <Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-ink/45" aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Search: kabanosy, kasza, Tymbark…', 'Szukaj: kabanosy, kasza, Tymbark…')} className="w-full rounded-full bg-white border-2 border-ink/15 pl-14 pr-5 min-h-14 text-[1.05rem] outline-none focus:border-red" />
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-4 px-4 md:mx-0 md:px-0">
            {[{ id: 'all' as const, en: 'Everything', pl: 'Wszystko' }, ...CATEGORIES].map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={`press shrink-0 rounded-full px-5 min-h-12 font-semibold border-2 ${cat === c.id ? 'bg-red text-cream border-red' : 'bg-white border-ink/15'}`}>
                {lang === 'pl' ? c.pl : c.en}
              </button>
            ))}
          </div>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-16">
            <PackageSearch className="w-14 h-14 mx-auto text-ink/30" />
            <p className="mt-4 text-xl font-semibold">{t('We don’t have that online yet.', 'Nie mamy tego jeszcze online.')}</p>
            <a href="#/request" className={`${btn.red} mt-6`}>{t('Ask us to order it in', 'Poproś o sprowadzenie')}</a>
          </div>
        ) : (
          <motion.ul key={`${cat}-${sort}`} initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mt-4">
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </motion.ul>
        )}
        <div className="mt-12 rounded-[2rem] bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <p className="text-lg"><span className="font-display font-extrabold text-xl">{t('Looking for something else?', 'Szukasz czegoś innego?')}</span><br />{t('The shop stocks far more than is online. Ask and we’ll check.', 'W sklepie jest dużo więcej niż online. Zapytaj, sprawdzimy.')}</p>
          <a href="#/request" className={btn.ink}>{t('Request a product', 'Zamów produkt')}</a>
        </div>
      </div>
    </>
  );
}
