import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { IdCard, MapPin, PackageSearch, Phone, Search, Store } from 'lucide-react';
import { CATEGORIES, PRODUCTS, SHOP, categoryOf, type CategoryId } from '../data.ts';
import { useStore } from '../store.tsx';
import { btn, useT } from '../ui.tsx';
import { FacebookLink, PageHead, PriceSwitch, ProductCard } from './parts.tsx';

const COUNTS = Object.fromEntries(CATEGORIES.map((c) => [c.id, PRODUCTS.filter((p) => p.category === c.id).length])) as Record<CategoryId, number>;

export default function Shop({ initial }: { initial?: string }) {
  const t = useT();
  const { lang, trade, account } = useStore();
  const fromLink = (CATEGORIES.some((c) => c.id === initial) ? initial : 'all') as CategoryId | 'all';
  const [cat, setCat] = useState<CategoryId | 'all'>(fromLink);
  useEffect(() => setCat(fromLink), [fromLink]);
  const chips = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (fromLink === 'all' || window.innerWidth >= 1024 || !bar.current) return;
    const id = window.setTimeout(() => bar.current && window.scrollTo({ top: bar.current.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 768 ? 84 : 72), behavior: 'smooth' }), 250);
    return () => window.clearTimeout(id);
  }, [fromLink]);
  useEffect(() => {
    const row = chips.current;
    const on = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && on) row.scrollTo({ left: on.offsetLeft - (row.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
  }, [cat]);
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
  const current = cat === 'all' ? null : categoryOf(cat);
  const choose = (id: CategoryId | 'all') => {
    setCat(id);
    if (window.scrollY > 420) window.scrollTo({ top: 300, behavior: 'smooth' });
  };
  const all = [{ id: 'all' as const, en: 'Everything', pl: 'Wszystko' }, ...CATEGORIES];
  return (
    <>
      <PageHead eyebrow={t('The shop', 'Sklep')} title={t('Everything on the shelves', 'Wszystko z półek')} body={t('Shop by the item, or switch to trade prices to buy by the case.', 'Kupuj na sztuki albo przełącz na ceny hurtowe i kupuj na kartony.')} side={<FacebookLink />} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
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
          <p className="mt-4 rounded-2xl bg-ink text-cream px-5 py-4">
            {t('You are seeing trade prices. To order by the case you need a trade account: ask in the shop or call', 'Widzisz ceny hurtowe. Aby zamawiać na kartony, potrzebne jest konto hurtowe: zapytaj w sklepie lub zadzwoń')} <a href={SHOP.phoneHref} className="underline font-bold whitespace-nowrap">{SHOP.phone}</a>. {t('Already have one?', 'Masz już konto?')} <a href="#/account" className="underline font-bold">{t('Sign in', 'Zaloguj się')}</a>
          </p>
        )}
        <div className="mt-4 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8 lg:items-start">
          <nav aria-label={t('Categories', 'Działy')} className="hidden lg:block sticky top-[100px] max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar rounded-[1.6rem] bg-white p-2 mt-3">
            <ul className="grid">
              {all.map((c) => {
                const on = cat === c.id;
                const n = c.id === 'all' ? PRODUCTS.length : COUNTS[c.id];
                return (
                  <li key={c.id}>
                    <button onClick={() => choose(c.id)} aria-pressed={on} className={`w-full flex items-center justify-between gap-2 rounded-xl px-3.5 min-h-10 text-left font-semibold leading-tight transition-colors ${on ? 'bg-red text-cream' : 'hover:bg-cream'}`}>
                      <span>{lang === 'pl' ? c.pl : c.en}</span>
                      <span className={`shrink-0 text-[0.8rem] font-bold ${on ? 'text-cream/80' : 'text-ink/40'}`}>{c.id !== 'all' && categoryOf(c.id).inStoreOnly ? t('In shop', 'W sklepie') : n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="min-w-0">
            <div ref={bar} className="sticky top-[72px] md:top-[84px] z-20 -mx-4 px-4 md:mx-0 md:px-0 py-3 bg-cream">
              <label className="relative block">
                <span className="sr-only">{t('Search', 'Szukaj')}</span>
                <Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-ink/45" aria-hidden="true" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Search: kabanosy, kasza, Tymbark…', 'Szukaj: kabanosy, kasza, Tymbark…')} className="w-full rounded-full bg-white border-2 border-ink/15 pl-14 pr-5 min-h-14 text-[1.05rem] outline-none focus:border-red" />
              </label>
              <div ref={chips} className="lg:hidden relative flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-4 px-4 md:mx-0 md:px-0">
                {all.map((c) => (
                  <button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={`press shrink-0 rounded-full px-5 min-h-12 font-semibold border-2 ${cat === c.id ? 'bg-red text-cream border-red' : 'bg-white border-ink/15'}`}>
                    {lang === 'pl' ? c.pl : c.en}
                  </button>
                ))}
              </div>
            </div>
            {current && (
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-extrabold leading-tight">{lang === 'pl' ? current.pl : current.en}</h2>
                {current.age && !current.inStoreOnly && <p className="flex items-center gap-2 font-semibold text-ink/70"><IdCard className="w-5 h-5 text-red" aria-hidden="true" />{t('18+ only. We check ID on collection or delivery.', 'Tylko 18+. Sprawdzamy dowód przy odbiorze lub dostawie.')}</p>}
              </div>
            )}
            {current?.inStoreOnly ? (
              <div className="mt-4 rounded-[2rem] bg-white p-7 md:p-10 grid md:grid-cols-[auto_1fr] gap-5 md:gap-7 items-center">
                <span className="w-16 h-16 rounded-2xl bg-ink text-cream grid place-items-center"><Store className="w-8 h-8" aria-hidden="true" /></span>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold leading-tight">{t(`${current.en} are sold in the shop only.`, `${current.pl}: tylko w sklepie.`)}</p>
                  <p className="mt-2 text-lg text-ink/70">{t('18+ only, and we check ID. Pop in to St Mary’s Road or call to check what’s in stock.', 'Tylko 18+, sprawdzamy dowód. Zajrzyj na St Mary’s Road lub zadzwoń, aby sprawdzić dostępność.')}</p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <a href={SHOP.phoneHref} className={btn.red}><Phone className="w-5 h-5" aria-hidden="true" />{t('Call', 'Zadzwoń')} {SHOP.phone}</a>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.mapQuery)}`} target="_blank" rel="noreferrer" className={btn.ink}><MapPin className="w-5 h-5" aria-hidden="true" />{t('Directions', 'Jak dojechać')}</a>
                  </div>
                </div>
              </div>
            ) : list.length === 0 ? (
              <div className="text-center py-16">
                <PackageSearch className="w-14 h-14 mx-auto text-ink/30" />
                <p className="mt-4 text-xl font-semibold">{t('We don’t have that online yet.', 'Nie mamy tego jeszcze online.')}</p>
                <a href="#/request" className={`${btn.red} mt-6`}>{t('Ask us to order it in', 'Poproś o sprowadzenie')}</a>
              </div>
            ) : (
              <motion.ul key={`${cat}-${sort}`} initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mt-4">
                {list.map((p) => <ProductCard key={p.id} p={p} />)}
              </motion.ul>
            )}
          </div>
        </div>
        <div className="mt-12 rounded-[2rem] bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <p className="text-lg"><span className="font-display font-extrabold text-xl">{t('Looking for something else?', 'Szukasz czegoś innego?')}</span><br />{t('The shop stocks far more than is online. Ask and we’ll check.', 'W sklepie jest dużo więcej niż online. Zapytaj, sprawdzimy.')}</p>
          <a href="#/request" className={btn.ink}>{t('Request a product', 'Zamów produkt')}</a>
        </div>
      </div>
    </>
  );
}
