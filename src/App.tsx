import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Home as HomeIcon, MessageCircle, PackageSearch, Phone, Search, ShoppingBasket, User, X } from 'lucide-react';
import { StoreProvider, gbp, product, unitPrice, useRoute, useStore } from './store.tsx';
import { ProductImage, Stepper, Wordmark, btn, ease, useT } from './ui.tsx';
import Lenis from 'lenis';
import { Southampton } from './Southampton.tsx';
import { SHOP } from './data.ts';
import { HOURS, RULES } from './rules.ts';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductPage from './pages/Product.tsx';
import Trade from './pages/Trade.tsx';
import RequestPage from './pages/Request.tsx';
import Account from './pages/Account.tsx';
import Checkout from './pages/Checkout.tsx';
import { ShopOrders, TrackOrder } from './pages/Orders.tsx';
import { Feedback, REVIEW } from './Feedback.tsx';

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const route = useRoute();
  const reduce = useReducedMotion();
  useEffect(() => { window.scrollTo(0, 0); }, [route]);
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)) });
    let id = 0;
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, [reduce]);
  const [path, arg] = route.split('/').filter(Boolean);
  const page = (() => {
    switch (path) {
      case undefined: return <Home />;
      case 'shop': return <Shop initial={arg} />;
      case 'product': return <ProductPage id={arg} />;
      case 'trade': return <Trade />;
      case 'request': return <RequestPage />;
      case 'account': return <Account />;
      case 'checkout': return <Checkout />;
      case 'order': return <TrackOrder id={arg} />;
      case 'shop-orders': return <ShopOrders />;
      default: return <Home />;
    }
  })();
  return (
    <div className="min-h-screen overflow-x-clip pb-24 lg:pb-0">
      <Splash />
      <Header route={route} />
      <AnimatePresence mode="wait">
        <motion.main key={path ?? 'home'} id="main" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
          {page}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <BottomBar route={route} />
      <Basket />
      <Toast />
      {REVIEW && <Feedback place="site" />}
    </div>
  );
}

function Splash() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    try { return !reduce && !sessionStorage.getItem('ns-splash'); } catch { return !reduce; }
  });
  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem('ns-splash', '1'); } catch { /* ignore */ }
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] bg-red grid place-items-center" exit={{ y: '-100%' }} transition={{ duration: 0.7, ease }} aria-hidden="true">
          <div className="text-center">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease }} className="text-[clamp(3rem,11vw,5.5rem)]">
              <Wordmark light />
            </motion.div>
            <motion.p initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={{ opacity: 1, letterSpacing: '0.4em' }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-3 text-cream/85 text-sm font-bold uppercase">Southampton</motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ route }: { route: string }) {
  const t = useT();
  const { lang, setLang, big, setBig, count, bump, setBasketOpen, account } = useStore();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const nav = [
    ['/shop', t('Shop', 'Sklep')],
    ['/trade', t('Trade & bulk', 'Hurt')],
    ['/request', t('Request a product', 'Zamów produkt')],
  ];
  return (
    <header className={`sticky top-0 z-40 transition-[background-color,box-shadow] ${scrolled ? 'bg-cream shadow-[0_1px_0_rgb(28_25_23/0.12)]' : 'bg-cream'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-[72px] md:h-[84px] flex items-center gap-4">
        <a href="#/" className="flex items-center min-h-12 shrink-0 -ml-2" aria-label="Nasz Sklep, home">
          <Wordmark className="text-[1.35rem] md:text-[1.6rem]" />
        </a>
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 ml-2 xl:ml-6" aria-label="Main">
          {nav.map(([href, label]) => (
            <a key={href} href={`#${href}`} className={`px-3 xl:px-4 py-2.5 rounded-full font-semibold whitespace-nowrap hover:bg-ink/5 ${route.startsWith(href) ? 'bg-ink/5 text-red' : ''}`}>{label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setBig(!big)} className="press hidden sm:grid h-12 min-w-12 px-3 place-items-center rounded-full border-2 border-ink/15 font-bold" aria-pressed={big} aria-label={t('Larger text', 'Większy tekst')}>
            <span><span className="text-sm">A</span><span className="text-lg">A</span></span>
          </button>
          <button onClick={() => setLang(lang === 'en' ? 'pl' : 'en')} className="press h-12 px-3.5 rounded-full border-2 border-ink/15 font-bold inline-flex items-center gap-1.5" aria-label={lang === 'en' ? 'Zmień język na polski' : 'Switch to English'}>
            <span className={lang === 'pl' ? 'text-red' : 'text-ink/40'}>PL</span><span className="text-ink/25">/</span><span className={lang === 'en' ? 'text-red' : 'text-ink/40'}>EN</span>
          </button>
          <a href="#/account" className="press hidden lg:inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 xl:px-4 font-semibold border-2 border-ink/15 whitespace-nowrap" aria-label={account ? account.business.split(' (')[0] : t('Sign in', 'Zaloguj')}>
            <User className="w-5 h-5" aria-hidden="true" /> <span className="hidden xl:inline max-w-[12rem] truncate">{account ? account.business.split(' (')[0] : t('Sign in', 'Zaloguj')}</span>
          </a>
          <button onClick={() => setBasketOpen(true)} className="press hidden lg:inline-flex h-12 items-center gap-2 rounded-full bg-red text-cream px-4 xl:px-5 font-bold whitespace-nowrap" aria-label={`${t('Basket', 'Koszyk')}, ${count}`}>
            <ShoppingBasket className="w-5 h-5" aria-hidden="true" /> <span className="hidden xl:inline">{t('Basket', 'Koszyk')}</span>
            <span key={bump} className={`min-w-7 h-7 px-1.5 grid place-items-center rounded-full bg-cream text-red text-sm font-extrabold ${bump ? 'pop' : ''}`}>{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function BottomBar({ route }: { route: string }) {
  const t = useT();
  const { count, bump, setBasketOpen } = useStore();
  const items: [string, typeof HomeIcon, string][] = [
    ['/', HomeIcon, t('Home', 'Start')],
    ['/shop', Search, t('Shop', 'Sklep')],
    ['/request', PackageSearch, t('Request', 'Zamów')],
    ['/account', User, t('Account', 'Konto')],
  ];
  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-cream border-t-2 border-ink/10 pb-[env(safe-area-inset-bottom)]" aria-label={t('Quick menu', 'Szybkie menu')}>
      <div className="grid grid-cols-5">
        {items.map(([href, Icon, label]) => {
          const active = href === '/' ? route === '/' : route.startsWith(href);
          return (
            <a key={href} href={`#${href}`} className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-16 text-[0.8rem] font-semibold ${active ? 'text-red' : 'text-ink/75'}`} aria-current={active ? 'page' : undefined}>
              <Icon className="w-6 h-6" aria-hidden="true" />{label}
            </a>
          );
        })}
        <button onClick={() => setBasketOpen(true)} className="flex flex-col items-center justify-center gap-1 py-2.5 min-h-16 text-[0.8rem] font-bold text-red relative">
          <span className="relative">
            <ShoppingBasket className="w-6 h-6" aria-hidden="true" />
            {count > 0 && <span key={bump} className="pop absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-red text-cream text-[0.7rem] grid place-items-center">{count}</span>}
          </span>
          {t('Basket', 'Koszyk')}
        </button>
      </div>
    </nav>
  );
}

function Basket() {
  const t = useT();
  const { basketOpen, setBasketOpen, lines, setQty, total, lang } = useStore();
  useEffect(() => {
    if (!basketOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setBasketOpen(false);
    window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); };
  }, [basketOpen, setBasketOpen]);
  return (
    <AnimatePresence>
      {basketOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('Basket', 'Koszyk')}>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/45" onClick={() => setBasketOpen(false)} aria-label={t('Close', 'Zamknij')} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.4, ease }} className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-cream flex flex-col">
            <div className="flex items-center justify-between px-5 h-[72px] border-b-2 border-ink/10">
              <h2 className="text-2xl font-extrabold">{t('Your basket', 'Twój koszyk')}</h2>
              <button onClick={() => setBasketOpen(false)} className="press w-12 h-12 grid place-items-center rounded-full bg-white border-2 border-ink/15" aria-label={t('Close', 'Zamknij')}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4" data-lenis-prevent>
              {lines.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBasket className="w-14 h-14 mx-auto text-ink/25" />
                  <p className="mt-4 text-lg">{t('Your basket is empty.', 'Koszyk jest pusty.')}</p>
                  <a href="#/shop" onClick={() => setBasketOpen(false)} className={`${btn.red} mt-6`}>{t('Start shopping', 'Zacznij zakupy')}</a>
                </div>
              ) : (
                <ul className="grid gap-3">
                  {lines.map((l) => {
                    const p = product(l.id);
                    return (
                      <li key={`${l.id}${l.trade}`} className="flex gap-3 items-center rounded-3xl bg-white p-3 shadow-[0_1px_0_rgb(28_25_23/0.08)]">
                        <ProductImage p={p} className="w-20 h-20 rounded-2xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-extrabold leading-tight">{lang === 'pl' ? p.pl : p.en}</p>
                          <p className="text-sm text-ink/60">{l.trade ? t(`Case of ${p.caseQty}`, `Karton ${p.caseQty} szt.`) : p.size} · {gbp(unitPrice(p, l.trade))}</p>
                          {l.trade && <span className="inline-block mt-1 text-[0.7rem] font-bold uppercase tracking-wider bg-ink text-cream rounded-full px-2 py-0.5">{t('Trade', 'Hurt')}</span>}
                          <div className="mt-2"><Stepper qty={l.qty} label={p.en} dec={() => setQty(l.id, l.trade, l.qty - 1)} inc={() => setQty(l.id, l.trade, l.qty + 1)} /></div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {lines.length > 0 && (
              <div className="border-t-2 border-ink/10 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] grid gap-3">
                <div className="flex justify-between items-baseline"><span className="text-lg font-semibold">{t('Total', 'Razem')}</span><span className="font-display font-extrabold text-3xl">{gbp(total)}</span></div>
                {total < RULES.minimum && (
                  <div>
                    <div className="h-2 rounded-full bg-ink/10 overflow-hidden"><div className="h-full rounded-full bg-red origin-left" style={{ transform: `scaleX(${Math.min(1, total / RULES.minimum)})` }} /></div>
                    <p className="mt-2 text-[0.95rem] font-semibold">{t(`Add ${gbp(RULES.minimum - total)} more. The minimum online order is ${gbp(RULES.minimum)}.`, `Dodaj jeszcze ${gbp(RULES.minimum - total)}. Minimalne zamówienie to ${gbp(RULES.minimum)}.`)}</p>
                  </div>
                )}
                <a href="#/checkout" onClick={() => setBasketOpen(false)} className={btn.red}>{t('Checkout: collect or delivery', 'Do kasy: odbiór lub dostawa')}</a>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Toast() {
  const { toast, say } = useStore();
  useEffect(() => { if (!toast) return; const id = setTimeout(() => say(null), 4200); return () => clearTimeout(id); }, [toast, say]);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div role="status" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className={`fixed z-[60] left-3 right-3 ${REVIEW ? "bottom-[176px] lg:bottom-24" : "bottom-24 lg:bottom-6"} lg:left-auto lg:right-6 lg:max-w-sm rounded-2xl bg-ink text-cream px-5 py-4 text-[1rem] shadow-2xl`}>
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  const t = useT();
  const { lang } = useStore();
  const links: [string, string][] = [
    ['#/shop', t('Shop', 'Sklep')],
    ['#/trade', t('Trade & bulk', 'Hurt')],
    ['#/request', t('Request a product', 'Zamów produkt')],
    ['#/account', t('My account', 'Moje konto')],
    [SHOP.facebook, 'Facebook'],
    ['#/shop-orders', t('For the shop: orders', 'Dla sklepu: zamówienia')],
  ];
  return (
    <footer className="relative bg-gradient-to-b from-cream via-paper to-paper overflow-hidden flex flex-col min-h-[680px] md:min-h-[min(100svh,860px)]">
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-10 md:pt-12">
        <Wordmark className="text-[2.4rem] md:text-[3rem]" place />
        <p className="mt-4 text-ink/75 max-w-xl">{t('Polish and Eastern European food on St Mary’s Road. For your kitchen, your shop or your restaurant.', 'Polskie i wschodnioeuropejskie jedzenie na St Mary’s Road. Do domu, sklepu i restauracji.')}</p>
        <nav className="mt-8" aria-label="Footer">
          <ul className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-x-2 gap-y-1">
            {links.map(([href, label], i) => (
              <li key={href} className="flex items-center justify-center">
                {i > 0 && <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-red mx-4" aria-hidden="true" />}
                <a href={href} className="group relative px-2 py-3 font-semibold" {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {label}
                  <span className="absolute left-2 right-2 bottom-2 h-0.5 bg-red origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-sm text-ink/60 max-w-2xl">
          {SHOP.company} · {t('Company', 'Firma nr')} {SHOP.companyNumber} · {SHOP.street}, {SHOP.town} {SHOP.postcode}
        </p>
        <p className="mt-2 text-xs text-ink/45 max-w-2xl">{t('Design preview by Revti. Products and prices are examples. Pack photos from Open Food Facts (CC BY-SA).', 'Projekt demonstracyjny Revti. Produkty i ceny przykładowe. Zdjęcia opakowań: Open Food Facts (CC BY-SA).')}</p>
        <p className="mt-4 text-[0.95rem] text-ink/70">{HOURS.map((h) => `${lang === 'pl' ? h.pl : h.en} ${h.open}–${h.close}`).join(' · ')}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={SHOP.phoneHref} className="press inline-flex items-center gap-2 rounded-full bg-red text-cream px-5 min-h-12 font-bold"><Phone className="w-5 h-5" />{t('Call', 'Zadzwoń')} {SHOP.phone}</a>
          <a href={SHOP.messenger} target="_blank" rel="noreferrer" className="press inline-flex items-center gap-2 rounded-full bg-white px-5 min-h-12 font-semibold border-2 border-ink/15"><MessageCircle className="w-5 h-5 text-red" />{t('Message the shop', 'Napisz do sklepu')}</a>
        </div>
      </div>
      <Southampton className="relative flex-1 w-full min-h-[320px] mt-[-4vh] pointer-events-none" focusShopOnMobile />
      
    </footer>
  );
}
