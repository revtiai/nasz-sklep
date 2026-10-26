import { Fragment, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, Building2, CalendarClock, Clock, MapPin, PackageSearch, Phone, RefreshCw, ShoppingBasket, Truck } from 'lucide-react';
import { CATEGORIES, OFFER_IDS, PRODUCTS, SHOP } from '../data.ts';
import { gbp, product, useStore } from '../store.tsx';
import { Burst, Eyebrow, ProductImage, Reveal, Stagger, btn, ease, img, useT } from '../ui.tsx';
import { ProductCard } from './parts.tsx';
import { HOURS } from '../rules.ts';
const ShopMap = lazy(() => import('./ShopMap.tsx').then((m) => ({ default: m.ShopMap })));

export default function Home() {
  return (
    <>
      <Hero />
      <Doors />
      <Aisles />
      <Offers />
      <Smokehouse />
      <RequestBand />
      <TradeSteps />
      <Visit />
    </>
  );
}

// The headline cycles through the reasons people come to the shop, so returning visitors see something new.
const HEADLINES: { en: { text: string; red: number[] }; pl: { text: string; red: number[] } }[] = [
  { en: { text: 'A real taste of home.', red: [4] }, pl: { text: 'Prawdziwy smak domu.', red: [2] } },
  { en: { text: 'Order online, collect today.', red: [3] }, pl: { text: 'Zamów online, odbierz dziś.', red: [3] } },
  { en: { text: 'Stocking a café? Buy by the case.', red: [4, 5, 6] }, pl: { text: 'Masz kawiarnię? Kupuj hurtem.', red: [2, 3] } },
  { en: { text: 'Can’t find it? We’ll order it in.', red: [4, 5, 6] }, pl: { text: 'Nie ma? Sprowadzimy.', red: [2] } },
  { en: { text: 'Kabanosy from the smokehouse.', red: [0] }, pl: { text: 'Kabanosy prosto z wędzarni.', red: [0] } },
  { en: { text: 'Order for Mum. She collects.', red: [3, 4] }, pl: { text: 'Dla mamy? Odbierze sama.', red: [2, 3] } },
];

const SCENES = [
  { img: 'fb/deli-kabanosy.jpg', pos: '50% 60%', en: ['Warm smoked meats', 'Straight from a traditional smokehouse'], pl: ['Ciepłe wędliny', 'Prosto z tradycyjnej wędzarni'], card: 'poledwica-sopocka', burst: ['£13.99', '/kg'] },
  { img: 'fb/veg-cabbage.jpg', pos: '50% 40%', en: ['Fresh fruit and veg', 'New deliveries every week'], pl: ['Świeże warzywa i owoce', 'Nowe dostawy co tydzień'], card: 'kapusta', burst: ['£1.49', 'each'] },
  { img: 'fb/meat-cuts.jpg', pos: '60% 50%', en: ['The meat counter', 'Pork, beef and mince'], pl: ['Mięso z lady', 'Wieprzowina, wołowina i mielone'], card: 'karkowka', burst: ['£7.99', '/kg'] },
  { img: null, pos: '', en: ['The brands you know', 'Wedel, Łowicz, Tymbark, Żywiec and more'], pl: ['Marki, które znasz', 'Wedel, Łowicz, Tymbark, Żywiec i więcej'], card: 'ptasie-mleczko', burst: ['6 for', '£5'] },
] as const;

function BrandsCollage() {
  const items = ['p/tymbark.jpg', 'p/lowicz-sos.jpg', 'p/ptasie-mleczko.jpg', 'p/zywiec.jpg', 'p/kasza.jpg', 'p/winiary.jpg'];
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-paper to-[#f3dcc8] grid grid-cols-3 gap-3 p-5 pt-24">
      {items.map((s, k) => (
        <motion.div key={s} initial={{ y: 30, opacity: 0, rotate: k % 2 ? 4 : -4 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + k * 0.07, duration: 0.6, ease }} className="rounded-3xl bg-white grid place-items-center p-3 shadow-[0_14px_30px_-20px_rgb(28_25_23/0.5)]">
          <img src={img(s)} alt="" className="max-h-full max-w-full object-contain" />
        </motion.div>
      ))}
    </div>
  );
}

function Hero() {
  const t = useT();
  const { lang } = useStore();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % SCENES.length), 4200);
    return () => clearInterval(id);
  }, [reduce, paused]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const scene = SCENES[i];
  const card = product(scene.card);
  const [h, setH] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setH((n) => (n + 1) % HEADLINES.length), 5200);
    return () => clearInterval(id);
  }, [reduce]);
  const line = HEADLINES[h][lang];
  const headline = line.text.split(' ');
  const headlineRed = line.red;
  return (
    <section ref={ref} className="relative px-4 md:px-8 pt-6 md:pt-12 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.85rem] font-bold shadow-[0_1px_0_rgb(28_25_23/0.1)]">
            <MapPin className="w-4 h-4 text-red" aria-hidden="true" /> {SHOP.street}, {SHOP.town}
          </motion.p>
          <h1 className="mt-5 text-[clamp(2.15rem,9.6vw,4rem)] max-[359px]:text-[1.8rem] lg:text-[4.3vw] xl:text-[3.6rem] font-extrabold leading-[0.92] grid lg:max-w-[9.6em]">
            <span className="sr-only">{t('Nasz Sklep: a real taste of home. Polish groceries in Southampton.', 'Nasz Sklep: prawdziwy smak domu. Polskie produkty w Southampton.')}</span>
            {HEADLINES.map((hl, k) => (
              <span key={k} aria-hidden="true" className="invisible [grid-area:1/1] self-end">
                {hl[lang].text.split(' ').map((w, j) => <span key={j} className="inline-block mr-[0.22em] pb-[0.06em]">{w}</span>)}
              </span>
            ))}
            <span className="[grid-area:1/1] self-end">
            <AnimatePresence mode="wait">
              <motion.span key={`${lang}${h}`} aria-hidden="true" className="block" initial="hidden" animate="show" exit="out" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: h === 0 ? 0.2 : 0 } }, out: { transition: { staggerChildren: 0.03 } } }}>
                {headline.map((w, k) => (
                  <span key={k} className="inline-block overflow-hidden align-bottom mr-[0.22em] pb-[0.06em]">
                    <motion.span
                      className={`inline-block ${headlineRed.includes(k) ? 'text-red' : ''}`}
                      variants={{ hidden: reduce ? {} : { y: '110%' }, show: { y: 0, transition: { duration: 0.7, ease } }, out: reduce ? {} : { y: '-110%', transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } } }}
                    >{w}</motion.span>
                  </span>
                ))}
              </motion.span>
            </AnimatePresence>
            </span>
          </h1>
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {HEADLINES.map((_, k) => <span key={k} className="h-1.5 rounded-full transition-all duration-500" style={{ width: k === h ? 28 : 8, background: k === h ? '#D7141A' : 'rgba(28,25,23,.18)' }} />)}
          </div>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease }} className="mt-6 text-[1.2rem] md:text-[1.35rem] text-ink/75 max-w-xl leading-relaxed">
            {t('Polish and Eastern European groceries from St Mary’s Road. Order online to collect from the shop or have it delivered, paying online or on the day. Buying for a business? Order by the case.', 'Polskie i wschodnioeuropejskie produkty z St Mary’s Road. Zamów online z odbiorem w sklepie lub dostawą, płacąc online lub przy odbiorze. Kupujesz dla firmy? Zamawiaj na kartony.')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7, ease }} className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#/shop" className={btn.red}><ShoppingBasket className="w-5 h-5" aria-hidden="true" />{t('Start shopping', 'Zacznij zakupy')}</a>
            <a href="#/trade" className={btn.light}><Building2 className="w-5 h-5" aria-hidden="true" />{t('Trade & bulk buying', 'Zakupy hurtowe')}</a>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mt-8 grid sm:grid-cols-3 gap-3 text-[0.95rem] font-semibold">
            {[[Clock, t('Open 7 days', 'Otwarte 7 dni')], [Truck, t('Collect or delivery', 'Odbiór lub dostawa')], [PackageSearch, t('We order in for you', 'Sprowadzimy na zamówienie')]].map(([I, s], k) => {
              const Icon = I as typeof Clock;
              return <li key={k} className="flex items-center gap-2"><Icon className="w-5 h-5 text-red shrink-0" aria-hidden="true" />{s as string}</li>;
            })}
          </motion.ul>
        </div>

        <div className="relative h-[440px] sm:h-[520px] lg:h-[600px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <motion.div style={reduce ? undefined : { y: y1 }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }} className="absolute right-0 top-0 w-[88%] h-[82%] rounded-[2.2rem] overflow-hidden bg-paper shadow-[0_30px_60px_-30px_rgb(28_25_23/0.6)]">
            <AnimatePresence initial={false}>
              <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
                {scene.img ? (
                  <motion.img src={img(scene.img)} alt="" className="w-full h-full object-cover" style={{ objectPosition: scene.pos }} initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 5.2, ease: 'linear' }} />
                ) : (
                  <BrandsCollage />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 top-0 p-5 pb-12 bg-gradient-to-b from-ink/75 to-transparent text-cream">
              <AnimatePresence mode="wait">
                <motion.div key={`${i}${lang}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }}>
                  <p className="font-display font-extrabold text-2xl md:text-3xl leading-tight">{scene[lang][0]}</p>
                  <p className="text-cream/85">{scene[lang][1]}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute right-3 bottom-4 flex gap-0.5" role="tablist" aria-label={t('Hero pictures', 'Zdjęcia')}>
              {SCENES.map((_, k) => (
                <button key={k} role="tab" aria-selected={k === i} aria-label={`${k + 1}`} onClick={() => setI(k)} className="h-11 px-1 -my-4 grid place-items-center"><span className="block h-3 rounded-full transition-all duration-500" style={{ width: k === i ? 34 : 12, background: k === i ? '#FFF8EF' : 'rgba(255,248,239,.55)' }} /></button>
              ))}
            </div>
          </motion.div>
          <motion.div style={reduce ? undefined : { y: y2 }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8, ease }} className="absolute left-0 bottom-0 w-[44%] max-w-[260px] rounded-[1.6rem] bg-white p-3 shadow-[0_24px_50px_-26px_rgb(28_25_23/0.55)] [perspective:800px]">
            <AnimatePresence mode="wait">
              <motion.a key={card.id} href={`#/product/${card.id}`} className="block" initial={{ opacity: 0, rotateY: -60 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 60 }} transition={{ duration: 0.45, ease }}>
                <ProductImage p={card} className="aspect-square rounded-2xl" />
                <p className="mt-2 font-display font-extrabold leading-tight">{lang === 'pl' ? card.pl : card.en}</p>
                <p className="text-sm text-ink/60">{card.brand ? `${card.brand} · ` : ''}{gbp(card.price)}{card.unit === 'kg' ? '/kg' : ''}</p>
              </motion.a>
            </AnimatePresence>
          </motion.div>
          <div className="absolute right-[3%] bottom-[6%] w-28 h-28 md:w-32 md:h-32">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 10 }} exit={{ scale: 0, rotate: 30 }} transition={{ type: 'spring', stiffness: 220, damping: 15 }} className="w-full h-full">
                <Burst className="w-full h-full text-[1.15rem] md:text-[1.3rem]">{scene.burst[0]}<br /><span className="text-[0.7em]">{lang === 'pl' && scene.burst[1] === 'each' ? 'szt.' : scene.burst[1]}</span></Burst>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Doors() {
  const t = useT();
  const doors = [
    { href: '#/shop', title: t('Shopping for home', 'Zakupy do domu'), body: t('Order online, we pack it, you collect from St Mary’s Road. Pay online or in the shop.', 'Zamów online, spakujemy, odbierzesz na St Mary’s Road. Płatność online lub w sklepie.'), img: 'fb/veg-tomatoes.jpg', tone: 'from-red to-[#b30f14]', icon: ShoppingBasket },
    { href: '#/trade', title: t('Trade & bulk', 'Hurt dla firm'), body: t('For shops, restaurants and caterers. Case prices, regular orders and an account that remembers what you buy.', 'Dla sklepów, restauracji i cateringu. Ceny za karton, stałe zamówienia i konto, które pamięta Twoje zakupy.'), img: 'fb/meat-shelf.jpg', tone: 'from-[#a3101a] to-[#6e0b10]', icon: Building2 },
  ];
  return (
    <section className="px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        {doors.map((d, k) => (
          <Reveal key={d.href} delay={k * 0.1}>
            <a href={d.href} className={`group relative block overflow-hidden rounded-[2rem] bg-gradient-to-br ${d.tone} text-cream min-h-[300px] md:min-h-[360px]`}>
              <img src={img(d.img)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
              <div className="relative p-7 md:p-10 flex flex-col h-full min-h-[300px] md:min-h-[360px]">
                <d.icon className="w-10 h-10" aria-hidden="true" />
                <h2 className="mt-auto text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-none">{d.title}</h2>
                <p className="mt-3 text-[1.1rem] text-cream/90 max-w-md">{d.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-lg">{t('Go', 'Dalej')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Aisles() {
  const t = useT();
  const { lang } = useStore();
  return (
    <section className="px-4 md:px-8 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto">
        <Reveal><Eyebrow>{t('Browse the shop', 'Działy')}</Eyebrow><h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-extrabold">{t('What are you after?', 'Czego szukasz?')}</h2></Reveal>
        <Stagger as="ul" className="mt-8 flex lg:grid lg:grid-cols-7 gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 snap-x">
          {CATEGORIES.map((c) => (
            <motion.li key={c.id} variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }} className="snap-start shrink-0 w-[30%] sm:w-[22%] lg:w-auto">
              <a href={`#/shop/${c.id}`} className="group block text-center">
                <span className="block aspect-square rounded-full overflow-hidden bg-white ring-4 ring-white shadow-[0_14px_30px_-20px_rgb(28_25_23/0.6)]">
                  <img src={img(c.img)} alt="" loading="lazy" className={`w-full h-full ${c.img.startsWith('p/') ? 'object-contain p-3' : 'object-cover'} group-hover:scale-110 transition-transform duration-500`} style={{ objectPosition: c.pos }} />
                </span>
                <span className="mt-3 block font-display font-extrabold text-[1.05rem] md:text-lg leading-tight">{lang === 'pl' ? c.pl : c.en}</span>
              </a>
            </motion.li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** Offers slide sideways as the page scrolls: two at first, the rest arrive one by one. */
function useMatch(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

function Offers() {
  const t = useT();
  const reduce = useReducedMotion();
  const touch = useMatch('(max-width: 1023px), (pointer: coarse)');
  if (reduce && !touch) {
    const items = OFFER_IDS.map((id) => product(id));
    return (
      <section className="pt-16 md:pt-24 max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold">{t('Good deals this week', 'Okazje tygodnia')}</h2>
        <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</ul>
      </section>
    );
  }
  return touch ? <OfferSwipe /> : <OfferTrack />;
}

function OfferSwipe() {
  const t = useT();
  const row = useRef<HTMLUListElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const items = OFFER_IDS.map((id) => product(id));
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const on = () => {
      const max = el.scrollWidth - el.clientWidth;
      const k = max > 0 ? el.scrollLeft / max : 1;
      const f = el.clientWidth / el.scrollWidth;
      if (thumb.current) thumb.current.style.transform = `translateX(${k * (1 / f - 1) * 100}%)`;
      if (thumb.current) thumb.current.style.width = `${f * 100}%`;
      const start = el.scrollLeft < 8;
      const end = el.scrollLeft > max - 8;
      setEnds((e) => (e.start === start && e.end === end ? e : { start, end }));
    };
    on();
    el.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { el.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  const step = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const card = el.querySelector('li');
    const w = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };
  return (
    <section className="pt-16 md:pt-24" aria-roledescription="carousel" aria-label={t('Good deals this week', 'Okazje tygodnia')}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Eyebrow>{t('Special offers', 'Promocje')}</Eyebrow>
        <h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.05]">{t('Good deals this week', 'Okazje tygodnia')}</h2>
        <p className="mt-2 text-ink/60 font-semibold flex items-center gap-1.5">{t('Swipe sideways for more', 'Przesuń w bok po więcej')}<ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" /></p>
      </div>
      <motion.ul ref={row} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} className="mt-5 flex gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory no-scrollbar px-4 md:px-8 scroll-px-4 md:scroll-px-8 pt-1 pb-5">
        {items.map((p) => <ProductCard key={p.id} p={p} className="w-[70vw] sm:w-[40vw] md:w-[30vw] max-w-[280px] shrink-0 snap-start" />)}
        <li aria-hidden="true" className="w-0 shrink-0" />
      </motion.ul>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden"><div ref={thumb} className="h-full rounded-full bg-red will-change-transform" style={{ width: '30%' }} /></div>
          <button type="button" onClick={() => step(-1)} disabled={ends.start} aria-label={t('Previous offers', 'Poprzednie promocje')} className="press shrink-0 w-12 h-12 rounded-full border-2 border-ink/15 bg-white grid place-items-center transition-opacity disabled:opacity-30"><ArrowLeft className="w-5 h-5" /></button>
          <button type="button" onClick={() => step(1)} disabled={ends.end} aria-label={t('More offers', 'Więcej promocji')} className="press shrink-0 w-12 h-12 rounded-full bg-red text-cream grid place-items-center transition-opacity disabled:opacity-30"><ArrowRight className="w-5 h-5" /></button>
        </div>
        <p className="mt-3 text-sm text-ink/50">{t('Offers are from the shop’s past Facebook posts, as examples.', 'Promocje pochodzą z wcześniejszych postów sklepu, jako przykład.')}</p>
      </div>
    </section>
  );
}

function OfferTrack() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    const measure = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 32)); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const xRaw = useTransform(scrollYProgress, [0.04, 0.96], [0, -dist]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 24, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);
  const items = OFFER_IDS.map((id) => product(id));
  return (
    <section ref={section} className="relative mt-16 md:mt-24" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-[72px] md:top-[84px] h-[calc(100vh-72px)] md:h-[calc(100vh-84px)] flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>{t('Special offers', 'Promocje')}</Eyebrow>
            <h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-extrabold">{t('Good deals this week', 'Okazje tygodnia')}</h2>
          </div>
          <p className="hidden md:block text-ink/55 font-semibold">{t('Keep scrolling', 'Przewijaj dalej')} →</p>
        </div>
        <motion.ul ref={track} style={{ x }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="mt-6 flex gap-4 md:gap-5 px-4 md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] w-max will-change-transform [transform:translateZ(0)]">
          {items.map((p) => <ProductCard key={p.id} p={p} className="w-[62vw] sm:w-[38vw] md:w-[26vw] lg:w-[19vw] max-w-[270px] shrink-0" />)}
        </motion.ul>
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-6">
          <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden"><motion.div className="h-full w-full bg-red rounded-full origin-left" style={{ scaleX: bar }} /></div>
          <p className="mt-3 text-sm text-ink/50">{t('Offers are from the shop’s past Facebook posts, as examples.', 'Promocje pochodzą z wcześniejszych postów sklepu, jako przykład.')}</p>
        </div>
      </div>
    </section>
  );
}

function Smokehouse() {
  const t = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yA = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const yB = useTransform(scrollYProgress, [0, 1], ['-6%', '12%']);
  const rot = useTransform(scrollYProgress, [0, 1], [-12, 8]);
  const deli = PRODUCTS.filter((p) => p.category === 'deli').slice(0, 4);
  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-[#f6dfcb] to-cream" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-8 md:pb-12 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal><Eyebrow>{t('From the counter', 'Z lady')}</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="mt-3 text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.92]">{t('Warm smoked meats, the best in the UK.', 'Ciepłe wędliny, najlepsze w UK.')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-5 text-[1.15rem] text-ink/75 max-w-lg">{t('Delivered fresh from a traditional Polish smokehouse and cut to order: kabanosy, polędwica sopocka, kiełbasa wiejska, boczek and baleron.', 'Świeże dostawy z tradycyjnej wędzarni, krojone na miejscu: kabanosy, polędwica sopocka, kiełbasa wiejska, boczek i baleron.')}</p></Reveal>
          <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-3">
            {deli.map((p) => (
              <motion.li key={p.id} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                <a href={`#/product/${p.id}`} className="flex items-center gap-3 rounded-2xl bg-white/80 hover:bg-white p-2.5 transition-colors shadow-[0_1px_0_rgb(28_25_23/0.06)]">
                  <ProductImage p={p} className="w-14 h-14 rounded-xl shrink-0" />
                  <span><span className="block font-display font-extrabold leading-tight">{p.pl}</span><span className="text-sm text-ink/60">£{p.price.toFixed(2)}/kg</span></span>
                </a>
              </motion.li>
            ))}
          </Stagger>
          <Reveal delay={0.1}><a href="#/shop/deli" className={`${btn.red} mt-8`}>{t('See the counter', 'Zobacz wędliny')} <ArrowRight className="w-5 h-5" /></a></Reveal>
        </div>
        <div className="relative h-[460px] md:h-[560px]">
          <motion.img style={reduce ? undefined : { y: yA }} src={img('fb/deli-kielbasa.jpg')} alt={t('Kiełbasa wiejska and smoked bacon at £13.99 a kilo', 'Kiełbasa wiejska i boczek wędzony, 13.99 £/kg')} loading="lazy" decoding="async" className="absolute left-0 top-0 w-[70%] h-[62%] object-cover rounded-[1.8rem] shadow-[0_30px_60px_-34px_rgb(28_25_23/0.6)] will-change-transform" />
          <motion.img style={reduce ? undefined : { y: yB }} src={img('fb/deli-rings.jpg')} alt={t('Smoked sausage rings in baskets', 'Kiełbasa w koszach')} loading="lazy" decoding="async" className="absolute right-0 bottom-0 w-[52%] h-[70%] object-cover rounded-[1.8rem] ring-8 ring-cream shadow-[0_30px_60px_-34px_rgb(28_25_23/0.6)] will-change-transform" />
          <motion.div style={reduce ? undefined : { rotate: rot }} className="absolute left-[8%] bottom-[6%]"><Burst className="w-28 h-28 text-[1.1rem]">£13.99<br /><span className="text-[0.7em]">/kg</span></Burst></motion.div>
        </div>
      </div>
    </section>
  );
}

function RequestBand() {
  const t = useT();
  return (
    <section className="px-4 md:px-8 pt-8 md:pt-12">
      <Reveal className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gold px-6 py-10 md:px-14 md:py-14 grid md:grid-cols-[1.4fr_auto] gap-8 items-center">
          <motion.div className="absolute -right-10 -bottom-16 w-72 h-72 rounded-full bg-white/25" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} aria-hidden="true" />
          <div className="relative">
            <PackageSearch className="w-12 h-12" aria-hidden="true" />
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[0.95]">{t('Can’t find it? We’ll order it in.', 'Nie ma? Sprowadzimy.')}</h2>
            <p className="mt-4 text-[1.15rem] max-w-xl text-ink/80">{t('Tell us the product, brand and how many you need. Snap a photo of the packet if it helps. We’ll let you know when it’s on the shelf.', 'Podaj produkt, markę i ilość. Możesz dodać zdjęcie opakowania. Damy znać, gdy będzie na półce.')}</p>
          </div>
          <a href="#/request" className={`${btn.ink} relative`}>{t('Request a product', 'Zamów produkt')} <ArrowRight className="w-5 h-5" /></a>
        </div>
      </Reveal>
    </section>
  );
}

/** The trade walkthrough is pinned while you scroll; each step takes over in turn and the line fills. */
function useTradeSteps() {
  const t = useT();
  return [
    { icon: Building2, h: t('Open a trade account', 'Załóż konto hurtowe'), b: t('Tell us about your shop, café or restaurant. We check and approve every account ourselves.', 'Opowiedz nam o swojej firmie. Każde konto zatwierdzamy sami.'), img: 'fb/meat-shelf.jpg' },
    { icon: ShoppingBasket, h: t('Order by the case', 'Zamawiaj na kartony'), b: t('See trade prices on every product and add whole cases in one tap.', 'Widzisz ceny hurtowe i dodajesz całe kartony jednym kliknięciem.'), img: 'fb/deli-kabanosy.jpg' },
    { icon: RefreshCw, h: t('Set up a regular order', 'Ustaw stałe zamówienie'), b: t('The same list every week or fortnight. Change, pause or skip it any time.', 'Ta sama lista co tydzień lub dwa. Zmień, wstrzymaj lub pomiń w każdej chwili.'), img: 'fb/veg-tomatoes.jpg' },
    { icon: CalendarClock, h: t('Collect, or delivery by arrangement', 'Odbiór lub dostawa po uzgodnieniu'), b: t('We pack your cases for pick-up at St Mary’s Road. Regular trade deliveries can be arranged.', 'Pakujemy kartony do odbioru na St Mary’s Road. Stałe dostawy hurtowe do uzgodnienia.'), img: 'fb/meat-cuts.jpg' },
  ];
}

function TradeSteps() {
  const reduce = useReducedMotion();
  const touch = useMatch('(max-width: 1023px), (pointer: coarse)');
  return reduce || touch ? <TradeStepsList /> : <TradeStepsPinned />;
}

function TradeStepsList() {
  const t = useT();
  const reduce = useReducedMotion();
  const steps = useTradeSteps();
  return (
    <section className="px-4 md:px-8 pt-14 md:pt-20 max-w-7xl mx-auto">
      <Eyebrow>{t('For businesses', 'Dla firm')}</Eyebrow>
      <h2 className="mt-2 text-[clamp(1.9rem,5vw,3.4rem)] font-extrabold leading-[0.98]">{t('Buying for a business? It’s simple.', 'Kupujesz dla firmy? To proste.')}</h2>
      <ol className="mt-6 grid md:grid-cols-2 gap-3 md:gap-4">
        {steps.map((st, k) => (
          <motion.li key={st.h} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 0.5, delay: (k % 2) * 0.06, ease }} className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] rounded-[1.6rem] bg-white overflow-hidden shadow-[0_1px_0_rgb(28_25_23/0.08)]">
            <img src={img(st.img)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            <div className="p-4 sm:p-5">
              <span className="inline-flex items-center gap-2 font-bold text-red text-sm"><span className="w-7 h-7 rounded-full bg-red text-cream grid place-items-center font-display font-extrabold">{k + 1}</span><st.icon className="w-4 h-4" aria-hidden="true" /></span>
              <h3 className="mt-2 font-display font-extrabold text-[1.2rem] sm:text-[1.35rem] leading-tight">{st.h}</h3>
              <p className="mt-1 text-[0.98rem] text-ink/70 leading-snug">{st.b}</p>
            </div>
          </motion.li>
        ))}
      </ol>
      <a href="#/trade" className={`${btn.red} mt-6`}>{t('Apply for a trade account', 'Załóż konto hurtowe')}<ArrowRight className="w-5 h-5" aria-hidden="true" /></a>
    </section>
  );
}

function TradeStepsPinned() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const steps = useTradeSteps();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length * 0.999)))));
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={ref} className="relative mt-16" style={{ height: `${steps.length * 60 + 40}vh` }}>
      <div className="sticky top-[72px] md:top-[84px] h-[calc(100vh-72px)] md:h-[calc(100vh-84px)] flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-14 items-center">
          <div>
            <Eyebrow>{t('For businesses', 'Dla firm')}</Eyebrow>
            <h2 className="mt-2 text-[clamp(1.9rem,5vw,3.8rem)] font-extrabold leading-[0.95]">{t('Buying for a business? It’s simple.', 'Kupujesz dla firmy? To proste.')}</h2>
            <ol className="mt-6 md:mt-8 relative grid gap-1 md:gap-2">
              <span className="absolute left-[22px] top-3 bottom-3 w-1 rounded-full bg-ink/10" aria-hidden="true" />
              <motion.span className="absolute left-[22px] top-3 bottom-3 w-1 rounded-full bg-red origin-top" style={{ scaleY: fill }} aria-hidden="true" />
              {steps.map((s, k) => (
                <li key={s.h} className="relative flex items-center gap-4 py-1.5 md:py-2.5">
                  <motion.span animate={{ scale: k === active ? 1.12 : 1, backgroundColor: k <= active ? '#D7141A' : '#FFFFFF', color: k <= active ? '#FFF8EF' : '#1C1917' }} transition={{ duration: 0.35 }} className="relative z-10 w-12 h-12 rounded-full grid place-items-center font-display font-extrabold text-lg shadow-[0_1px_0_rgb(28_25_23/0.1)]">{k + 1}</motion.span>
                  <motion.span animate={{ opacity: k === active ? 1 : 0.45, x: k === active ? 6 : 0 }} className="font-display font-extrabold text-[1.15rem] md:text-2xl leading-tight">{s.h}</motion.span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative h-[34vh] md:h-[56vh] min-h-[240px]">
            {steps.map((st, k) => (
              <motion.div key={st.h} initial={false} animate={{ opacity: k === active ? 1 : 0, y: k === active ? 0 : k < active ? -40 : 40, scale: k === active ? 1 : 0.96 }} transition={{ duration: 0.55, ease }} className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_30px_70px_-34px_rgb(28_25_23/0.6)] will-change-transform" style={{ pointerEvents: k === active ? 'auto' : 'none' }} aria-hidden={k !== active}>
                <img src={img(st.img)} alt="" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5c0a0d]/90 via-[#8E0D11]/35 to-transparent" />
                <div className="absolute left-0 right-0 bottom-0 p-6 md:p-9 text-cream">
                  <span className="w-14 h-14 rounded-2xl bg-cream text-red grid place-items-center"><st.icon className="w-7 h-7" aria-hidden="true" /></span>
                  <p className="mt-4 font-display font-extrabold text-2xl md:text-4xl leading-tight">{st.h}</p>
                  <p className="mt-2 text-[1.05rem] md:text-lg text-cream/90 max-w-lg">{st.b}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Visit() {
  const t = useT();
  const { lang } = useStore();
  return (
    <section className="px-4 md:px-8 pt-16 md:pt-24 pb-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-6 items-stretch">
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-red to-[#b30f14] text-cream p-7 md:p-10 h-full">
            <Eyebrow light>{t('Visit the shop', 'Odwiedź sklep')}</Eyebrow>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[0.95]">{t('Pop in, we’re open early till late.', 'Zapraszamy, otwarte od rana do wieczora.')}</h2>
            <p className="mt-6 text-xl font-semibold flex gap-2"><MapPin className="w-6 h-6 shrink-0 mt-1" aria-hidden="true" />{SHOP.street}, {SHOP.town} {SHOP.postcode}</p>
            <div className="mt-3 text-lg flex gap-2"><Clock className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" /><dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5">{HOURS.map((h) => <Fragment key={h.en}><dt>{lang === 'pl' ? h.pl : h.en}</dt><dd className="font-semibold">{h.open}–{h.close}</dd></Fragment>)}</dl></div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream text-red font-bold min-h-14 px-7" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.mapQuery)}`} target="_blank" rel="noreferrer">{t('Directions', 'Jak dojechać')} <ArrowRight className="w-5 h-5" /></a>
              <a className="press inline-flex items-center justify-center gap-2 rounded-full border-2 border-cream/60 font-bold min-h-14 px-7" href={SHOP.phoneHref}><Phone className="w-5 h-5" aria-hidden="true" />{t('Call', 'Zadzwoń')} {SHOP.phone}</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}><Suspense fallback={<div className="rounded-[2rem] bg-paper min-h-[380px] h-full" />}><ShopMap /></Suspense></Reveal>
      </div>
    </section>
  );
}
