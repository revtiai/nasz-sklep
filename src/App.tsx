import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Building2, Check, MapPin, Minus, Plus, Search, ShoppingBasket, Store, Truck, X, Camera, Package } from 'lucide-react';
import { CATEGORIES, PRODUCTS, SHOP, T, type CategoryId, type Lang, type Product } from './data.ts';
import { FolkFlower, Logo, ProductArt, Wycinanka } from './art.tsx';

const gbp = (n: number) => `£${n.toFixed(2)}`;
type Mode = 'retail' | 'trade';
type Line = { id: string; qty: number; mode: Mode };

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [mode, setMode] = useState<Mode>('retail');
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [q, setQ] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const t = (k: keyof typeof T) => T[k][lang];

  const products = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => (cat === 'all' || p.category === cat) && (!term || `${p.pl} ${p.en}`.toLowerCase().includes(term)));
  }, [cat, q]);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((sum, l) => {
    const p = PRODUCTS.find((x) => x.id === l.id)!;
    return sum + l.qty * (l.mode === 'trade' ? p.casePrice : p.price);
  }, 0);

  const add = (p: Product, delta = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === p.id && l.mode === mode);
      if (i === -1) return delta > 0 ? [...prev, { id: p.id, qty: delta, mode }] : prev;
      const next = [...prev];
      const qty = next[i].qty + delta;
      if (qty <= 0) next.splice(i, 1);
      else next[i] = { ...next[i], qty };
      return next;
    });
    if (delta > 0) setBump((b) => b + 1);
  };
  const qtyOf = (p: Product) => lines.find((l) => l.id === p.id && l.mode === mode)?.qty ?? 0;

  const goShop = (c?: CategoryId) => {
    if (c) setCat(c);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-clip pb-20 md:pb-0">
      <a href="#shop" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-ink text-cream px-4 py-2 rounded-full">Skip to shop</a>
      <Header lang={lang} setLang={setLang} mode={mode} setMode={setMode} count={count} bump={bump} openBasket={() => setBasketOpen(true)} t={t} />
      <main>
        <Hero t={t} lang={lang} goShop={() => goShop()} />
        <Marquee />
        <Aisles lang={lang} t={t} active={cat} pick={(c) => goShop(c)} />
        <section id="shop" className="px-4 md:px-8 py-14 md:py-20 max-w-7xl mx-auto scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6">
            <div>
              <p className="font-display font-bold text-red text-sm uppercase tracking-[0.18em] mb-2">{lang === 'en' ? 'The shelves' : 'Na półkach'}</p>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-[0.95]">{lang === 'en' ? 'Fresh in this week' : 'Nowości w tym tygodniu'}</h2>
            </div>
            <PriceToggle mode={mode} setMode={setMode} t={t} large />
          </div>
          {mode === 'trade' && (
            <div className="rise mb-6 rounded-3xl bg-ink text-cream px-5 py-4 flex items-start gap-3">
              <Building2 className="w-5 h-5 mt-0.5 text-mustard shrink-0" aria-hidden="true" />
              <p className="text-sm leading-relaxed">
                {lang === 'en'
                  ? 'Trade prices are per case, for shops, cafés and restaurants with a Nasz Sklep trade account.'
                  : 'Ceny hurtowe są za karton, dla sklepów, kawiarni i restauracji z kontem hurtowym.'}{' '}
                <a href="#trade" className="underline decoration-mustard underline-offset-4 font-semibold">{lang === 'en' ? 'Apply here' : 'Złóż wniosek'}</a>
              </p>
            </div>
          )}
          <div className="sticky top-[68px] md:top-[76px] z-20 -mx-4 px-4 md:mx-0 md:px-0 py-3 bg-cream/95 backdrop-blur-sm">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink/50" aria-hidden="true" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('search')}
                className="w-full h-13 rounded-full bg-white sticker pl-12 pr-4 py-3.5 text-base placeholder:text-ink/45 outline-none"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-4 px-4 md:mx-0 md:px-0">
              {[{ id: 'all' as const, en: T.all.en, pl: T.all.pl }, ...CATEGORIES].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  aria-pressed={cat === c.id}
                  className={`press shrink-0 rounded-full px-4 py-2 text-sm font-semibold border-2 border-ink ${cat === c.id ? 'bg-red text-cream' : 'bg-white'}`}
                >
                  {c[lang]}
                </button>
              ))}
            </div>
          </div>
          {products.length === 0 ? (
            <p className="py-16 text-center text-ink/70">{t('noResults')}</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mt-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} p={p} i={i} lang={lang} mode={mode} qty={qtyOf(p)} add={add} t={t} />
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-ink/55">
            {lang === 'en' ? 'Demo range and example prices. The real catalogue and stock come from the shop.' : 'Przykładowe produkty i ceny. Prawdziwy asortyment doda sklep.'}
          </p>
        </section>
        <Trade lang={lang} onSent={setNotice} />
        <Easy lang={lang} />
        <Story lang={lang} />
        <Visit lang={lang} />
      </main>
      <Footer lang={lang} />
      <MobileBar t={t} count={count} openBasket={() => setBasketOpen(true)} />
      <Basket
        open={basketOpen}
        close={() => setBasketOpen(false)}
        lines={lines}
        setLines={setLines}
        total={total}
        lang={lang}
        t={t}
        checkout={(kind) => {
          setBasketOpen(false);
          setNotice(
            kind === 'card'
              ? lang === 'en'
                ? 'Demo only. In the live Shopify store this opens secure checkout: card, Apple Pay and Google Pay.'
                : 'Wersja demo. W prawdziwym sklepie Shopify otworzy się bezpieczna płatność kartą, Apple Pay i Google Pay.'
              : lang === 'en'
                ? 'Demo only. In the live store this sends the order to Nasz Sklep to confirm stock, price and collection or delivery.'
                : 'Wersja demo. W prawdziwym sklepie zamówienie trafi do Nasz Sklep do potwierdzenia.',
          );
        }}
      />
      {notice && <Toast text={notice} close={() => setNotice(null)} />}
    </div>
  );
}

type TFn = (k: keyof typeof T) => string;

function Header({ lang, setLang, mode, setMode, count, bump, openBasket, t }: { lang: Lang; setLang: (l: Lang) => void; mode: Mode; setMode: (m: Mode) => void; count: number; bump: number; openBasket: () => void; t: TFn }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors ${scrolled ? 'bg-cream/95 backdrop-blur-sm border-b-2 border-ink' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto h-[68px] md:h-[76px] px-4 md:px-8 flex items-center gap-3">
        <a href="#top" aria-label="Nasz Sklep home" className="text-[1.15rem] md:text-[1.4rem]">
          <Logo />
        </a>
        <nav className="hidden md:flex items-center gap-1 ml-6 text-[15px] font-semibold" aria-label="Main">
          <a className="px-3 py-2 rounded-full hover:bg-ink/5" href="#shop">{t('shop')}</a>
          <a className="px-3 py-2 rounded-full hover:bg-ink/5" href="#trade">{t('trade')}</a>
          <a className="px-3 py-2 rounded-full hover:bg-ink/5" href="#visit">{t('visit')}</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block"><PriceToggle mode={mode} setMode={setMode} t={t} /></div>
          <button
            onClick={() => setLang(lang === 'en' ? 'pl' : 'en')}
            className="press h-10 px-3 rounded-full border-2 border-ink bg-white text-sm font-bold"
            aria-label={lang === 'en' ? 'Przełącz na polski' : 'Switch to English'}
          >
            {lang === 'en' ? 'PL' : 'EN'}
          </button>
          <button onClick={openBasket} className="press hidden md:inline-flex h-10 items-center gap-2 rounded-full bg-red text-cream px-4 font-semibold sticker" aria-label={`${t('basket')}, ${count} items`}>
            <ShoppingBasket className="w-5 h-5" aria-hidden="true" /> {t('basket')}
            <span key={bump} className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full bg-cream text-red text-xs font-extrabold ${bump ? 'pop' : ''}`}>{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function PriceToggle({ mode, setMode, t, large = false }: { mode: Mode; setMode: (m: Mode) => void; t: TFn; large?: boolean }) {
  return (
    <div role="group" aria-label="Prices" className={`inline-flex rounded-full border-2 border-ink bg-white p-1 ${large ? 'text-sm' : 'text-xs'} font-bold`}>
      {(['retail', 'trade'] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`press rounded-full ${large ? 'px-5 py-2.5' : 'px-3 py-1.5'} ${mode === m ? (m === 'trade' ? 'bg-ink text-cream' : 'bg-red text-cream') : 'text-ink/70'}`}
        >
          {m === 'retail' ? t('retail') : t('tradePrices')}
        </button>
      ))}
    </div>
  );
}

function Hero({ t, lang, goShop }: { t: TFn; lang: Lang; goShop: () => void }) {
  const floaters: { kind: Parameters<typeof ProductArt>[0]['kind']; cls: string; r: string; d: string }[] = [
    { kind: 'dumplings', cls: 'left-[2%] top-[8%] w-28 md:w-40', r: '-8deg', d: '0s' },
    { kind: 'pickles', cls: 'right-[0%] top-[4%] w-24 md:w-36', r: '10deg', d: '.6s' },
    { kind: 'sausage', cls: 'left-[-4%] bottom-[10%] w-28 md:w-40', r: '6deg', d: '1.2s' },
    { kind: 'bread', cls: 'right-[-2%] bottom-[6%] w-28 md:w-40', r: '-6deg', d: '1.8s' },
    { kind: 'sweets', cls: 'left-[40%] -bottom-[6%] w-20 md:w-28', r: '0deg', d: '2.4s' },
  ];
  return (
    <section id="top" className="relative pt-[92px] md:pt-[112px] pb-14 md:pb-24 px-4 md:px-8 bg-paper">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-6 items-center">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
            <MapPin className="w-3.5 h-3.5 text-red" aria-hidden="true" /> {t('eyebrow')}
          </p>
          <h1 className="mt-5 text-[clamp(2.6rem,10vw,5.6rem)] md:text-[clamp(3rem,5.6vw,4.9rem)] font-extrabold leading-[0.9]">
            {lang === 'en' ? (
              <>A taste of <span className="text-red">home</span>, by the jar or <span className="relative whitespace-nowrap">by the case<Underline /></span>.</>
            ) : (
              <>Smak <span className="text-red">domu</span>, na sztuki albo <span className="relative whitespace-nowrap">na kartony<Underline /></span>.</>
            )}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink/75 max-w-xl leading-relaxed">{t('heroBody')}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={goShop} className="press inline-flex items-center justify-center gap-2 rounded-full bg-red text-cream font-bold text-lg px-7 py-4 sticker-lg">
              {t('shopRange')} <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <a href="#trade" className="press inline-flex items-center justify-center gap-2 rounded-full bg-white font-bold text-lg px-7 py-4 sticker-lg">
              <Building2 className="w-5 h-5" aria-hidden="true" /> {t('openTrade')}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink/80">
            {(lang === 'en' ? ['Case prices for trade', 'Collect from St Mary’s Road', 'Polish & English'] : ['Ceny hurtowe za karton', 'Odbiór na St Mary’s Road', 'Po polsku i po angielsku']).map((x) => (
              <li key={x} className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-leaf" aria-hidden="true" />{x}</li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-square max-w-[560px] w-full mx-auto">
          <Wycinanka className="absolute inset-[6%] w-[88%] h-[88%] spin-slow drop-shadow-[0_10px_0_rgba(31,26,23,0.9)]" />
          {floaters.map((f) => (
            <div key={f.kind} className={`absolute ${f.cls} bob`} style={{ ['--r' as string]: f.r, animationDelay: f.d }}>
              <div className="rounded-full sticker-lg bg-white"><ProductArt kind={f.kind} bg="#FFFFFF" /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Underline() {
  return (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute left-0 -bottom-2 w-full h-3 md:h-4" aria-hidden="true">
      <path d="M4 14c60-10 160-12 292-6" fill="none" stroke="#F2B33D" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Marquee() {
  const words = ['Pierogi', 'Kiełbasa', 'Twaróg', 'Ogórki kiszone', 'Chleb żytni', 'Barszcz', 'Kabanosy', 'Krówki', 'Kefir', 'Kasza gryczana', 'Pierniki', 'Śledzie'];
  const row = [...words, ...words];
  return (
    <div className="bg-red text-cream border-y-2 border-ink overflow-hidden py-3" aria-hidden="true">
      <div className="marquee flex w-max gap-8 font-display font-extrabold text-2xl md:text-3xl whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-8">{w}<FolkFlower className="w-6 h-6" colour="#FFF8EE" /></span>
        ))}
      </div>
    </div>
  );
}

function Aisles({ lang, t, active, pick }: { lang: Lang; t: TFn; active: CategoryId | 'all'; pick: (c: CategoryId) => void }) {
  return (
    <section className="px-4 md:px-8 pt-14 md:pt-20 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-extrabold">{t('categories')}</h2>
      <div className="mt-6 flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2 snap-x">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => pick(c.id)}
            className={`press snap-start shrink-0 w-[42%] sm:w-[30%] md:w-auto rounded-3xl border-2 border-ink p-3 text-left hover:-translate-y-1 ${active === c.id ? 'bg-ink text-cream' : 'bg-white'}`}
          >
            <div className="aspect-square"><ProductArt kind={c.art} bg={c.bg} /></div>
            <p className="mt-2 font-display font-bold leading-tight">{c[lang]}</p>
            <p className={`text-xs ${active === c.id ? 'text-cream/70' : 'text-ink/55'}`}>{lang === 'en' ? c.pl : c.en}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ p, i, lang, mode, qty, add, t }: { p: Product; i: number; lang: Lang; mode: Mode; qty: number; add: (p: Product, d?: number) => void; t: TFn }) {
  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const tagLabel: Record<NonNullable<Product['tag']>, [string, string, string]> = {
    popular: ['Best seller', 'Hit', 'bg-mustard text-ink'],
    new: ['New in', 'Nowość', 'bg-leaf text-cream'],
    chilled: ['Chilled', 'Chłodzone', 'bg-sky text-cream'],
    frozen: ['Frozen', 'Mrożone', 'bg-sky text-cream'],
  };
  const trade = mode === 'trade';
  return (
    <li className="rise rounded-3xl bg-white border-2 border-ink overflow-hidden flex flex-col" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
      <div className="relative p-3 pb-0">
        <div className="aspect-square"><ProductArt kind={p.art} tint={p.tint} bg={cat.bg} /></div>
        {p.tag && (
          <span className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-bold border-2 border-ink ${tagLabel[p.tag][2]}`}>
            {lang === 'en' ? tagLabel[p.tag][0] : tagLabel[p.tag][1]}
          </span>
        )}
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="font-display font-extrabold text-[1.05rem] md:text-xl leading-tight">{p.pl}</h3>
        <p className="text-[13px] md:text-sm text-ink/60 leading-snug mt-0.5">{p.en}</p>
        <p className="text-xs text-ink/50 mt-1">{trade ? `${t('caseOf')} ${p.caseQty} × ${p.size}` : p.size}</p>
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-display font-extrabold text-xl md:text-2xl leading-none">{gbp(trade ? p.casePrice : p.price)}</p>
            {trade && <p className="text-[11px] text-ink/55 mt-1">{gbp(p.casePrice / p.caseQty)} {t('each')}</p>}
          </div>
          {qty === 0 ? (
            <button onClick={() => add(p)} className={`press rounded-full px-3.5 md:px-4 h-10 font-bold text-sm border-2 border-ink inline-flex items-center gap-1 ${trade ? 'bg-ink text-cream' : 'bg-red text-cream'}`} aria-label={`${trade ? t('addCase') : t('add')} ${p.en}`}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{trade ? t('addCase') : t('add')}</span>
            </button>
          ) : (
            <div className="inline-flex items-center rounded-full border-2 border-ink bg-cream h-10">
              <button onClick={() => add(p, -1)} className="press w-9 h-9 grid place-items-center" aria-label={`Remove one ${p.en}`}><Minus className="w-4 h-4" /></button>
              <span className="min-w-6 text-center font-bold tabular-nums" aria-live="polite">{qty}</span>
              <button onClick={() => add(p)} className="press w-9 h-9 grid place-items-center" aria-label={`Add one ${p.en}`}><Plus className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function Trade({ lang, onSent }: { lang: Lang; onSent: (s: string) => void }) {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    onSent(lang === 'en' ? 'Demo only. In the live store this application goes straight to Nasz Sklep.' : 'Wersja demo. W prawdziwym sklepie wniosek trafi prosto do Nasz Sklep.');
  };
  const steps = lang === 'en'
    ? [['Apply once', 'Tell us about your shop, café or kitchen. We approve trade accounts by hand.'], ['Order by the case', 'Switch to trade prices and add whole cases. Reorder last week’s list in a tap.'], ['Collect or arrange delivery', 'Pick up from St Mary’s Road, or agree a regular delivery with us.']]
    : [['Załóż konto', 'Opowiedz nam o swoim sklepie, kawiarni lub kuchni. Konta zatwierdzamy ręcznie.'], ['Zamawiaj kartony', 'Przełącz na ceny hurtowe i dodawaj całe kartony.'], ['Odbiór lub dostawa', 'Odbierz na St Mary’s Road albo umów regularną dostawę.']];
  const field = 'w-full rounded-2xl bg-cream text-ink border-2 border-ink px-4 py-3.5 text-base outline-none focus:bg-white';
  return (
    <section id="trade" className="relative bg-red text-cream border-y-2 border-ink overflow-hidden scroll-mt-16">
      <Wycinanka className="absolute -right-24 -top-24 w-80 h-80 md:w-[28rem] md:h-[28rem] opacity-20 spin-slow" colour="#A8141B" accent="#FFF8EE" leaf="#A8141B" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="font-display font-bold text-mustard text-sm uppercase tracking-[0.18em]">{lang === 'en' ? 'Trade & bulk' : 'Hurt'}</p>
          <h2 className="mt-3 text-4xl md:text-6xl font-extrabold leading-[0.95]">{lang === 'en' ? 'Stocking a shop, café or kitchen?' : 'Zaopatrujesz sklep, kawiarnię lub kuchnię?'}</h2>
          <p className="mt-5 text-lg text-cream/85 max-w-lg">{lang === 'en' ? 'Buy Polish and Eastern European lines by the case, at trade prices, from a shop that has stocked them on St Mary’s Road for years.' : 'Kupuj polskie i wschodnioeuropejskie produkty na kartony, w cenach hurtowych.'}</p>
          <ol className="mt-10 grid gap-4">
            {steps.map(([h, b], i) => (
              <li key={h} className="flex gap-4 items-start rounded-3xl bg-cream text-ink border-2 border-ink p-4 sticker">
                <span className="shrink-0 w-11 h-11 rounded-full bg-mustard border-2 border-ink grid place-items-center font-display font-extrabold text-lg">{i + 1}</span>
                <span><span className="block font-display font-extrabold text-lg">{h}</span><span className="text-ink/70 text-[15px]">{b}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[2rem] bg-cream text-ink border-2 border-ink p-5 md:p-8 sticker-lg self-start">
          {sent ? (
            <div className="py-10 text-center">
              <div className="mx-auto w-20 h-20"><FolkFlower className="w-full h-full spin-slow" /></div>
              <h3 className="mt-4 text-3xl font-extrabold">{lang === 'en' ? 'Dziękujemy!' : 'Dziękujemy!'}</h3>
              <p className="mt-2 text-ink/70">{lang === 'en' ? 'Thanks. We will be in touch about your trade account.' : 'Odezwiemy się w sprawie konta hurtowego.'}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <h3 className="text-2xl md:text-3xl font-extrabold">{lang === 'en' ? 'Apply for a trade account' : 'Wniosek o konto hurtowe'}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="grid gap-1.5 text-sm font-semibold">{lang === 'en' ? 'Your name' : 'Imię i nazwisko'}<input required autoComplete="name" className={field} /></label>
                <label className="grid gap-1.5 text-sm font-semibold">{lang === 'en' ? 'Business name' : 'Nazwa firmy'}<input required autoComplete="organization" className={field} /></label>
                <label className="grid gap-1.5 text-sm font-semibold">{lang === 'en' ? 'Phone' : 'Telefon'}<input required type="tel" autoComplete="tel" inputMode="tel" className={field} /></label>
                <label className="grid gap-1.5 text-sm font-semibold">Email<input type="email" autoComplete="email" className={field} /></label>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold">{lang === 'en' ? 'Type of business' : 'Rodzaj działalności'}
                <select className={field} defaultValue="">
                  <option value="" disabled>{lang === 'en' ? 'Choose one' : 'Wybierz'}</option>
                  {(lang === 'en' ? ['Shop or off-licence', 'Café or restaurant', 'Caterer', 'Other'] : ['Sklep', 'Kawiarnia lub restauracja', 'Catering', 'Inne']).map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">{lang === 'en' ? 'What would you like to stock?' : 'Co chcesz zamawiać?'}<textarea rows={3} className={field} /></label>
              <button className="press mt-1 rounded-full bg-ink text-cream font-bold text-lg py-4 inline-flex items-center justify-center gap-2">{lang === 'en' ? 'Send application' : 'Wyślij wniosek'} <ArrowRight className="w-5 h-5" /></button>
              <p className="text-xs text-ink/55">{lang === 'en' ? 'Demo form: nothing is sent yet.' : 'Formularz demo: nic nie jest wysyłane.'}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Easy({ lang }: { lang: Lang }) {
  const items = lang === 'en'
    ? [[Camera, 'Snap it, list it', 'New stock in? Take a photo on your phone, add a price, and it is in the shop.'], [Package, 'Case and single prices', 'Every product can carry a retail price and a trade case price.'], [Store, 'One till, one stock count', 'Online orders and in-store sales can share the same stock levels.'], [Truck, 'Collection or delivery', 'Offer click and collect from the shop, local delivery, or both.']]
    : [[Camera, 'Zdjęcie i gotowe', 'Nowy towar? Zrób zdjęcie telefonem, dodaj cenę i już jest w sklepie.'], [Package, 'Ceny za sztukę i karton', 'Każdy produkt może mieć cenę detaliczną i hurtową.'], [Store, 'Jeden stan magazynu', 'Zamówienia online i sprzedaż w sklepie korzystają z tego samego stanu.'], [Truck, 'Odbiór lub dostawa', 'Odbiór osobisty, lokalna dostawa albo oba.']];
  return (
    <section className="px-4 md:px-8 py-16 md:py-24 max-w-7xl mx-auto">
      <p className="font-display font-bold text-red text-sm uppercase tracking-[0.18em]">{lang === 'en' ? 'Behind the counter' : 'Za ladą'}</p>
      <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-[0.95] max-w-3xl">{lang === 'en' ? 'Simple to run from a phone.' : 'Łatwe do prowadzenia z telefonu.'}</h2>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(([Icon, h, b]) => {
          const I = Icon as typeof Camera;
          return (
            <div key={h as string} className="rounded-3xl bg-white border-2 border-ink p-6 sticker">
              <span className="w-12 h-12 rounded-2xl bg-mustard border-2 border-ink grid place-items-center"><I className="w-6 h-6" aria-hidden="true" /></span>
              <h3 className="mt-4 text-xl font-extrabold">{h as string}</h3>
              <p className="mt-1.5 text-ink/70">{b as string}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Story({ lang }: { lang: Lang }) {
  return (
    <section className="bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-[auto_1fr] gap-10 items-center">
        <Wycinanka className="w-48 h-48 md:w-72 md:h-72 mx-auto spin-slow" />
        <div>
          <p className="font-display font-bold text-mustard text-sm uppercase tracking-[0.18em]">{lang === 'en' ? 'Our shop' : 'Nasz sklep'}</p>
          <blockquote className="mt-3 text-3xl md:text-5xl font-display font-extrabold leading-[1.02]">
            {lang === 'en' ? '“Nasz Sklep” means “our shop”. For nearly ten years, that is exactly what it has been for St Mary’s.' : '„Nasz Sklep” to nasz sklep. Od prawie dziesięciu lat dla całej okolicy St Mary’s.'}
          </blockquote>
          <p className="mt-6 text-lg text-cream/75 max-w-2xl">
            {lang === 'en'
              ? 'A family-run shop with a long-serving team, stocking the Polish and Eastern European food people grew up with, and now supplying other local businesses too.'
              : 'Rodzinny sklep z wieloletnim zespołem i produktami, na których wszyscy się wychowaliśmy. Teraz zaopatrujemy też lokalne firmy.'}
          </p>
        </div>
      </div>
    </section>
  );
}

function Visit({ lang }: { lang: Lang }) {
  return (
    <section id="visit" className="px-4 md:px-8 py-16 md:py-24 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        <div className="rounded-[2rem] bg-paper border-2 border-ink p-6 md:p-10 sticker-lg">
          <p className="font-display font-bold text-red text-sm uppercase tracking-[0.18em]">{lang === 'en' ? 'Visit us' : 'Odwiedź nas'}</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-[0.95]">{lang === 'en' ? 'Come and say cześć.' : 'Wpadnij powiedzieć cześć.'}</h2>
          <p className="mt-6 text-xl font-semibold flex items-start gap-2"><MapPin className="w-6 h-6 text-red shrink-0 mt-0.5" aria-hidden="true" />{SHOP.address}</p>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
            <dt className="font-semibold">{lang === 'en' ? 'Opening hours' : 'Godziny otwarcia'}</dt><dd className="text-ink/70">{lang === 'en' ? 'To confirm with the shop' : 'Do potwierdzenia'}</dd>
            <dt className="font-semibold">{lang === 'en' ? 'Trade collections' : 'Odbiór hurtowy'}</dt><dd className="text-ink/70">{lang === 'en' ? 'By arrangement' : 'Po uzgodnieniu'}</dd>
          </dl>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a className="press inline-flex items-center justify-center gap-2 rounded-full bg-red text-cream font-bold px-6 py-3.5 sticker" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.mapQuery)}`} target="_blank" rel="noreferrer">
              {lang === 'en' ? 'Get directions' : 'Wyznacz trasę'} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a className="press inline-flex items-center justify-center gap-2 rounded-full bg-white font-bold px-6 py-3.5 sticker" href={SHOP.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
        <div className="rounded-[2rem] overflow-hidden border-2 border-ink min-h-[320px] sticker-lg bg-paper">
          <iframe
            title="Map of Nasz Sklep, St Mary’s Road, Southampton"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.mapQuery)}&z=16&output=embed`}
            className="w-full h-full min-h-[320px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="bg-red text-cream border-t-2 border-ink">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-[1.4fr_1fr_1fr] gap-8">
        <div>
          <div className="text-2xl"><Logo invert /></div>
          <p className="mt-4 text-cream/80 max-w-sm">{lang === 'en' ? 'Polish and Eastern European groceries on St Mary’s Road, Southampton. Retail and trade.' : 'Polskie i wschodnioeuropejskie produkty na St Mary’s Road w Southampton. Detal i hurt.'}</p>
        </div>
        <div className="grid gap-2 text-[15px] font-semibold">
          <a href="#shop" className="hover:underline">{lang === 'en' ? 'Shop' : 'Sklep'}</a>
          <a href="#trade" className="hover:underline">{lang === 'en' ? 'Trade accounts' : 'Konta hurtowe'}</a>
          <a href="#visit" className="hover:underline">{lang === 'en' ? 'Find us' : 'Jak dojechać'}</a>
          <a href={SHOP.facebook} className="hover:underline" target="_blank" rel="noreferrer">Facebook</a>
        </div>
        <div className="text-sm text-cream/75 leading-relaxed">
          {SHOP.company}, registered in England and Wales, company number {SHOP.companyNumber}. {SHOP.address}.
        </div>
      </div>
      <div className="border-t-2 border-ink/20 px-4 py-4 text-center text-xs text-cream/70">
        {lang === 'en' ? 'Design preview by Revti. Products and prices shown are examples.' : 'Projekt demonstracyjny Revti. Produkty i ceny są przykładowe.'}
      </div>
    </footer>
  );
}

function MobileBar({ t, count, openBasket }: { t: TFn; count: number; openBasket: () => void }) {
  return (
    <nav className="md:hidden fixed inset-x-3 bottom-3 z-40 rounded-full bg-ink text-cream border-2 border-ink flex items-center p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_8px_30px_rgba(0,0,0,0.25)]" aria-label="Quick">
      <a href="#shop" className="flex-1 text-center py-2.5 text-sm font-semibold">{t('shop')}</a>
      <a href="#trade" className="flex-1 text-center py-2.5 text-sm font-semibold">{t('trade')}</a>
      <button onClick={openBasket} className="press flex-1 rounded-full bg-red py-2.5 text-sm font-bold inline-flex items-center justify-center gap-1.5">
        <ShoppingBasket className="w-4 h-4" aria-hidden="true" /> {t('basket')} <span className="tabular-nums">({count})</span>
      </button>
    </nav>
  );
}

function Basket({ open, close, lines, setLines, total, lang, t, checkout }: { open: boolean; close: () => void; lines: Line[]; setLines: (f: (l: Line[]) => Line[]) => void; total: number; lang: Lang; t: TFn; checkout: (k: 'card' | 'trade') => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, close]);
  if (!open) return null;
  const hasTrade = lines.some((l) => l.mode === 'trade');
  const change = (i: number, d: number) => setLines((ls) => { const n = [...ls]; const q = n[i].qty + d; if (q <= 0) n.splice(i, 1); else n[i] = { ...n[i], qty: q }; return n; });
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('basket')}>
      <button className="absolute inset-0 bg-ink/50" onClick={close} aria-label="Close basket" />
      <div ref={ref} tabIndex={-1} className="rise absolute right-0 bottom-0 md:top-0 w-full md:w-[440px] max-h-[88vh] md:max-h-none md:h-full bg-cream border-t-2 md:border-t-0 md:border-l-2 border-ink rounded-t-[2rem] md:rounded-none flex flex-col outline-none">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-ink">
          <h2 className="text-2xl font-extrabold">{t('basket')}</h2>
          <button onClick={close} className="press w-10 h-10 rounded-full border-2 border-ink grid place-items-center bg-white" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="py-12 text-center"><FolkFlower className="w-14 h-14 mx-auto" /><p className="mt-4 text-ink/70">{t('empty')}</p></div>
          ) : (
            <ul className="grid gap-3">
              {lines.map((l, i) => {
                const p = PRODUCTS.find((x) => x.id === l.id)!;
                const cat = CATEGORIES.find((c) => c.id === p.category)!;
                const unit = l.mode === 'trade' ? p.casePrice : p.price;
                return (
                  <li key={`${l.id}-${l.mode}`} className="flex gap-3 items-center rounded-2xl bg-white border-2 border-ink p-2.5">
                    <div className="w-16 h-16 shrink-0"><ProductArt kind={p.art} tint={p.tint} bg={cat.bg} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-extrabold leading-tight truncate">{p.pl}</p>
                      <p className="text-xs text-ink/60">{l.mode === 'trade' ? `${t('caseOf')} ${p.caseQty} · ${gbp(unit)}` : `${p.size} · ${gbp(unit)}`}</p>
                      {l.mode === 'trade' && <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-ink text-cream rounded-full px-2 py-0.5">{lang === 'en' ? 'Trade' : 'Hurt'}</span>}
                    </div>
                    <div className="inline-flex items-center rounded-full border-2 border-ink bg-cream">
                      <button onClick={() => change(i, -1)} className="w-8 h-8 grid place-items-center" aria-label={`Remove one ${p.en}`}><Minus className="w-4 h-4" /></button>
                      <span className="min-w-5 text-center font-bold tabular-nums">{l.qty}</span>
                      <button onClick={() => change(i, 1)} className="w-8 h-8 grid place-items-center" aria-label={`Add one ${p.en}`}><Plus className="w-4 h-4" /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t-2 border-ink px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] grid gap-3">
            <div className="flex justify-between items-baseline"><span className="font-semibold">{t('subtotal')}</span><span className="font-display font-extrabold text-3xl">{gbp(total)}</span></div>
            <button onClick={() => checkout('card')} className="press rounded-full bg-red text-cream font-bold text-lg py-4 sticker">{t('checkout')}</button>
            {hasTrade && <button onClick={() => checkout('trade')} className="press rounded-full bg-ink text-cream font-bold py-3.5">{t('sendQuote')}</button>}
          </div>
        )}
      </div>
    </div>
  );
}

function Toast({ text, close }: { text: string; close: () => void }) {
  useEffect(() => { const id = setTimeout(close, 6500); return () => clearTimeout(id); }, [close]);
  return (
    <div role="status" className="rise fixed z-[55] left-3 right-3 bottom-24 md:bottom-6 md:left-auto md:right-6 md:max-w-sm rounded-2xl bg-ink text-cream p-4 pr-12 border-2 border-ink shadow-xl">
      <p className="text-sm leading-relaxed">{text}</p>
      <button onClick={close} className="absolute right-3 top-3 w-8 h-8 grid place-items-center" aria-label="Dismiss"><X className="w-4 h-4" /></button>
    </div>
  );
}
