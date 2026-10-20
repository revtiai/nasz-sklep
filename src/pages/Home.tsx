import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, Building2, CalendarClock, Clock, MapPin, PackageSearch, RefreshCw, ShoppingBasket, Truck } from 'lucide-react';
import { CATEGORIES, OFFER_IDS, PRODUCTS, SHOP } from '../data.ts';
import { product, useStore } from '../store.tsx';
import { Burst, Eyebrow, ProductImage, Reveal, Stagger, btn, ease, img, useT } from '../ui.tsx';
import { ProductCard } from './parts.tsx';

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

function Hero() {
  const t = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-48%']);
  const words = t('A real taste of home.', 'Prawdziwy smak domu.').split(' ');
  return (
    <section ref={ref} className="relative px-4 md:px-8 pt-6 md:pt-12 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.85rem] font-bold shadow-[0_1px_0_rgb(28_25_23/0.1)]">
            <MapPin className="w-4 h-4 text-red" aria-hidden="true" /> {SHOP.street}, {SHOP.town}
          </motion.p>
          <h1 className="mt-5 text-[clamp(3rem,9.5vw,6.2rem)] font-extrabold leading-[0.9]">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
                <motion.span className={`inline-block ${i === words.length - 1 ? 'text-red' : ''}`} initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.8, ease }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease }} className="mt-6 text-[1.2rem] md:text-[1.35rem] text-ink/75 max-w-xl leading-relaxed">
            {t('Polish and Eastern European groceries from St Mary’s Road. Order online to collect or have it delivered, or open a trade account and buy by the case.', 'Polskie i wschodnioeuropejskie produkty z St Mary’s Road. Zamów online z odbiorem lub dostawą albo załóż konto hurtowe i kupuj na kartony.')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7, ease }} className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#/shop" className={btn.red}><ShoppingBasket className="w-5 h-5" aria-hidden="true" />{t('Start shopping', 'Zacznij zakupy')}</a>
            <a href="#/trade" className={btn.light}><Building2 className="w-5 h-5" aria-hidden="true" />{t('Trade & bulk buying', 'Zakupy hurtowe')}</a>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mt-8 grid sm:grid-cols-3 gap-3 text-[0.95rem] font-semibold">
            {[[Clock, t('Open 7 days', 'Otwarte 7 dni')], [Truck, t('Collect or delivery', 'Odbiór lub dostawa')], [PackageSearch, t('We order in for you', 'Sprowadzimy na zamówienie')]].map(([I, s], i) => {
              const Icon = I as typeof Clock;
              return <li key={i} className="flex items-center gap-2"><Icon className="w-5 h-5 text-red shrink-0" aria-hidden="true" />{s as string}</li>;
            })}
          </motion.ul>
        </div>
        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
          <motion.div style={reduce ? undefined : { y: y1 }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }} className="absolute right-0 top-0 w-[86%] h-[82%] rounded-[2.2rem] overflow-hidden shadow-[0_30px_60px_-30px_rgb(28_25_23/0.6)]">
            <img src={img('fb/deli-kabanosy.jpg')} alt={t('Kabanosy and smoked pork loin in a basket at Nasz Sklep', 'Kabanosy i polędwica w koszu w Nasz Sklep')} className="w-full h-full object-cover" fetchPriority="high" />
            <div className="absolute inset-x-0 top-0 p-5 pb-10 bg-gradient-to-b from-ink/80 to-transparent text-cream">
              <p className="font-display font-extrabold text-2xl md:text-3xl leading-tight">{t('Warm smoked meats', 'Ciepłe wędliny')}</p>
              <p className="text-cream/85">{t('Straight from a traditional smokehouse', 'Prosto z tradycyjnej wędzarni')}</p>
            </div>
          </motion.div>
          <motion.div style={reduce ? undefined : { y: y2 }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8, ease }} className="absolute left-0 bottom-2 w-[46%] rounded-[1.6rem] bg-white p-3 shadow-[0_24px_50px_-26px_rgb(28_25_23/0.55)]">
            <ProductImage p={product('ptasie-mleczko')} className="aspect-square rounded-2xl" />
            <p className="mt-2 font-display font-extrabold leading-tight">Ptasie Mleczko</p>
            <p className="text-sm text-ink/60">E. Wedel · £4.99</p>
          </motion.div>
          <motion.div style={reduce ? undefined : { y: y3 }} initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 10 }} transition={{ delay: 0.7, type: 'spring', stiffness: 180, damping: 14 }} className="absolute right-[4%] bottom-[8%] w-28 h-28 md:w-32 md:h-32">
            <Burst className="w-full h-full text-[1.05rem] md:text-[1.2rem]">{t('6 for £5', '6 za £5')}<br /><span className="text-[0.7em] font-bold">Żywiec Zdrój</span></Burst>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Doors() {
  const t = useT();
  const doors = [
    { href: '#/shop', title: t('Shopping for home', 'Zakupy do domu'), body: t('Single items at shop prices. Collect from St Mary’s Road or get it delivered.', 'Pojedyncze produkty w cenach sklepowych. Odbiór na St Mary’s Road lub dostawa.'), img: 'fb/veg-tomatoes.jpg', tone: 'bg-red text-cream', icon: ShoppingBasket },
    { href: '#/trade', title: t('Trade & bulk', 'Hurt dla firm'), body: t('For shops, restaurants and caterers. Case prices, regular orders and an account that remembers what you buy.', 'Dla sklepów, restauracji i cateringu. Ceny za karton, stałe zamówienia i konto, które pamięta Twoje zakupy.'), img: 'fb/meat-shelf.jpg', tone: 'bg-ink text-cream', icon: Building2 },
  ];
  return (
    <section className="px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        {doors.map((d, i) => (
          <Reveal key={d.href} delay={i * 0.1}>
            <a href={d.href} className={`group relative block overflow-hidden rounded-[2rem] ${d.tone} min-h-[300px] md:min-h-[360px]`}>
              <img src={img(d.img)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 group-hover:scale-105 transition-all duration-700" />
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

function Offers() {
  const t = useT();
  const track = useRef<HTMLUListElement>(null);
  const scroll = (d: number) => track.current?.scrollBy({ left: d * Math.min(window.innerWidth * 0.8, 900), behavior: 'smooth' });
  return (
    <section className="pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-end justify-between gap-4">
        <Reveal>
          <Eyebrow>{t('Special offers', 'Promocje')}</Eyebrow>
          <h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-extrabold">{t('Good deals this week', 'Okazje tygodnia')}</h2>
        </Reveal>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} className="press w-14 h-14 rounded-full bg-white border-2 border-ink/15 grid place-items-center" aria-label={t('Previous', 'Poprzednie')}><ArrowLeft /></button>
          <button onClick={() => scroll(1)} className="press w-14 h-14 rounded-full bg-red text-cream grid place-items-center" aria-label={t('Next', 'Następne')}><ArrowRight /></button>
        </div>
      </div>
      <motion.ul ref={track} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} className="mt-8 flex gap-4 overflow-x-auto no-scrollbar snap-x px-4 md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4">
        {OFFER_IDS.map((id) => <ProductCard key={id} p={product(id)} className="snap-start shrink-0 w-[72%] sm:w-[40%] md:w-[30%] lg:w-[22%]" />)}
      </motion.ul>
      <p className="max-w-7xl mx-auto px-4 md:px-8 text-sm text-ink/50">{t('Offers shown are from the shop’s past Facebook posts, as examples.', 'Promocje pochodzą z wcześniejszych postów sklepu, jako przykład.')}</p>
    </section>
  );
}

function Smokehouse() {
  const t = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yA = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const yB = useTransform(scrollYProgress, [0, 1], ['-6%', '10%']);
  const deli = PRODUCTS.filter((p) => p.category === 'deli').slice(0, 4);
  return (
    <section ref={ref} className="mt-20 md:mt-28 bg-ink text-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal><Eyebrow light>{t('From the counter', 'Z lady')}</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="mt-3 text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.92]">{t('Warm smoked meats, the best in the UK.', 'Ciepłe wędliny, najlepsze w UK.')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-5 text-[1.15rem] text-cream/80 max-w-lg">{t('Delivered fresh from a traditional Polish smokehouse and cut to order: kabanosy, polędwica sopocka, kiełbasa wiejska, boczek and baleron.', 'Świeże dostawy z tradycyjnej wędzarni, krojone na miejscu: kabanosy, polędwica sopocka, kiełbasa wiejska, boczek i baleron.')}</p></Reveal>
          <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-3">
            {deli.map((p) => (
              <motion.li key={p.id} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                <a href={`#/product/${p.id}`} className="flex items-center gap-3 rounded-2xl bg-cream/8 hover:bg-cream/14 p-2.5 transition-colors">
                  <ProductImage p={p} className="w-14 h-14 rounded-xl shrink-0" />
                  <span><span className="block font-display font-extrabold leading-tight">{p.pl}</span><span className="text-sm text-cream/70">£{p.price.toFixed(2)}/kg</span></span>
                </a>
              </motion.li>
            ))}
          </Stagger>
          <Reveal delay={0.1}><a href="#/shop/deli" className={`${btn.red} mt-8`}>{t('See the counter', 'Zobacz wędliny')} <ArrowRight className="w-5 h-5" /></a></Reveal>
        </div>
        <div className="relative h-[460px] md:h-[560px]">
          <motion.img style={reduce ? undefined : { y: yA }} src={img('fb/deli-kielbasa.jpg')} alt={t('Kiełbasa wiejska and smoked bacon at £13.99 a kilo', 'Kiełbasa wiejska i boczek wędzony, 13.99 £/kg')} loading="lazy" className="absolute left-0 top-0 w-[70%] h-[62%] object-cover rounded-[1.8rem]" />
          <motion.img style={reduce ? undefined : { y: yB }} src={img('fb/deli-rings.jpg')} alt={t('Smoked sausage rings in baskets', 'Kiełbasa w koszach')} loading="lazy" className="absolute right-0 bottom-0 w-[52%] h-[70%] object-cover rounded-[1.8rem] ring-8 ring-ink" />
          <div className="absolute left-[8%] bottom-[6%]"><Burst className="w-28 h-28 text-[1.1rem] -rotate-6">£13.99<br /><span className="text-[0.7em]">/kg</span></Burst></div>
        </div>
      </div>
    </section>
  );
}

function RequestBand() {
  const t = useT();
  return (
    <section className="px-4 md:px-8 pt-16 md:pt-24">
      <Reveal className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gold px-6 py-10 md:px-14 md:py-14 grid md:grid-cols-[1.4fr_auto] gap-8 items-center">
          <div>
            <PackageSearch className="w-12 h-12" aria-hidden="true" />
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[0.95]">{t('Can’t find it? We’ll order it in.', 'Nie ma? Sprowadzimy.')}</h2>
            <p className="mt-4 text-[1.15rem] max-w-xl text-ink/80">{t('Tell us the product, brand and how many you need. Snap a photo of the packet if it helps. We’ll let you know when it’s on the shelf.', 'Podaj produkt, markę i ilość. Możesz dodać zdjęcie opakowania. Damy znać, gdy będzie na półce.')}</p>
          </div>
          <a href="#/request" className={btn.ink}>{t('Request a product', 'Zamów produkt')} <ArrowRight className="w-5 h-5" /></a>
        </div>
      </Reveal>
    </section>
  );
}

function TradeSteps() {
  const t = useT();
  const steps = [
    [Building2, t('Open a trade account', 'Załóż konto hurtowe'), t('Tell us about your shop, café or restaurant. We check and approve every account ourselves.', 'Opowiedz nam o swojej firmie. Każde konto zatwierdzamy sami.')],
    [ShoppingBasket, t('Order by the case', 'Zamawiaj na kartony'), t('See trade prices on every product and add whole cases in one tap.', 'Widzisz ceny hurtowe i dodajesz całe kartony jednym kliknięciem.')],
    [RefreshCw, t('Set up a regular order', 'Ustaw stałe zamówienie'), t('Same list every week or fortnight. Change, pause or skip it any time.', 'Ta sama lista co tydzień lub dwa. Zmień, wstrzymaj lub pomiń w każdej chwili.')],
    [CalendarClock, t('Collect or delivered', 'Odbiór lub dostawa'), t('Pick up from St Mary’s Road or choose a delivery day that suits you.', 'Odbierz na St Mary’s Road albo wybierz dzień dostawy.')],
  ] as const;
  return (
    <section className="px-4 md:px-8 pt-20 md:pt-28">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
        <div className="lg:sticky lg:top-32 self-start">
          <Reveal><Eyebrow>{t('For businesses', 'Dla firm')}</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="mt-3 text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[0.95]">{t('Buying for a business? It’s simple.', 'Kupujesz dla firmy? To proste.')}</h2></Reveal>
          <Reveal delay={0.1}><a href="#/trade" className={`${btn.ink} mt-8`}>{t('Trade accounts', 'Konta hurtowe')} <ArrowRight className="w-5 h-5" /></a></Reveal>
        </div>
        <ol className="grid gap-5">
          {steps.map(([Icon, h, b], i) => (
            <Reveal as="li" key={h} delay={0.05}>
              <div className="rounded-[1.8rem] bg-white p-6 md:p-8 flex gap-5 items-start shadow-[0_1px_0_rgb(28_25_23/0.08)]">
                <span className="shrink-0 w-14 h-14 rounded-2xl bg-red text-cream grid place-items-center"><Icon className="w-7 h-7" aria-hidden="true" /></span>
                <div>
                  <p className="text-sm font-bold text-red">{t('Step', 'Krok')} {i + 1}</p>
                  <h3 className="text-2xl font-extrabold leading-tight">{h}</h3>
                  <p className="mt-2 text-[1.05rem] text-ink/70">{b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Visit() {
  const t = useT();
  return (
    <section className="px-4 md:px-8 py-20 md:py-28">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        <Reveal>
          <div className="rounded-[2rem] bg-red text-cream p-7 md:p-10 h-full">
            <Eyebrow light>{t('Visit the shop', 'Odwiedź sklep')}</Eyebrow>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[0.95]">{t('Pop in, we’re open early till late.', 'Zapraszamy, otwarte od rana do wieczora.')}</h2>
            <p className="mt-6 text-xl font-semibold flex gap-2"><MapPin className="w-6 h-6 shrink-0 mt-1" aria-hidden="true" />{SHOP.street}, {SHOP.town} {SHOP.postcode}</p>
            <p className="mt-3 text-lg flex gap-2"><Clock className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />{t('Open 7 days. Hours to confirm with the shop.', 'Otwarte 7 dni w tygodniu. Godziny do potwierdzenia.')}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream text-red font-bold min-h-14 px-7" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.mapQuery)}`} target="_blank" rel="noreferrer">{t('Directions', 'Jak dojechać')} <ArrowRight className="w-5 h-5" /></a>
              <a className="press inline-flex items-center justify-center gap-2 rounded-full border-2 border-cream/60 font-bold min-h-14 px-7" href={SHOP.messenger} target="_blank" rel="noreferrer">{t('Message us', 'Napisz do nas')}</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[2rem] overflow-hidden min-h-[340px] h-full bg-paper">
            <iframe title={t('Map of Nasz Sklep', 'Mapa: Nasz Sklep')} src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.mapQuery)}&z=16&output=embed`} className="w-full h-full min-h-[340px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
