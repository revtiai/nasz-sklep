import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import './index.css';
import { Burst, Wordmark, img } from './ui.tsx';
import { StoreProvider } from './store.tsx';
import { Southampton } from './Southampton.tsx';

export const SIZES: Record<string, [number, number]> = {
  'facebook-cover': [1640, 624],
  'profile-picture': [720, 720],
  'post-smokehouse': [1080, 1350],
  'post-offer': [1080, 1350],
  'post-request': [1080, 1350],
  'post-trade': [1080, 1350],
  'post-christmas': [1080, 1350],
  'post-online': [1080, 1350],
  'story-offer': [1080, 1920],
  'ig-banner': [3240, 1350],
  'og-home': [1200, 630],
  'og-shop': [1200, 630],
  'og-trade': [1200, 630],
  'og-request': [1200, 630],
  'og-account': [1200, 630],
  'og-board': [1200, 630],
};

function Foot({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 px-16 pb-14 flex items-center justify-between ${dark ? 'text-cream' : 'text-ink'}`}>
      <span className="flex items-center"><Wordmark className="text-[50px]" light={dark} draw={false} /></span>
      <span className="text-right text-[26px] font-semibold leading-tight opacity-85">120 St Mary’s Road<br />Southampton</span>
    </div>
  );
}

function Head({ eyebrow, title, sub, light = false, big = false }: { eyebrow: string; title: ReactNode; sub: string; light?: boolean; big?: boolean }) {
  return (
    <div className="absolute left-16 right-16 top-[84px]">
      <p className={`text-[30px] font-bold uppercase tracking-[0.2em] ${light ? 'text-gold' : 'text-red'}`}>{eyebrow}</p>
      <p className={`mt-4 font-display font-extrabold leading-[0.9] ${big ? 'text-[120px]' : 'text-[100px]'}`}>{title}</p>
      <p className={`mt-5 text-[34px] ${light ? 'text-cream/85' : 'text-ink/70'}`}>{sub}</p>
    </div>
  );
}

function Frame({ w, h, children, className = '' }: { w: number; h: number; children: ReactNode; className?: string }) {
  return <div className={`relative overflow-hidden ${className}`} style={{ width: w, height: h }}>{children}</div>;
}

export function Asset({ name }: { name: string }) {
  const [w, h] = SIZES[name];
  switch (name) {
    case 'facebook-cover':
      return (
        <Frame w={w} h={h} className="bg-paper">
          <div className="absolute inset-x-0 bottom-0 h-[57%]"><Southampton className="w-full h-full" /></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[30px] text-center w-[1100px]">
            <Wordmark className="text-[104px]" draw={false} />
            <p className="mt-1 text-[32px] font-bold text-ink">Polskie jedzenie w Southampton · <span className="text-red">Polish food in Southampton</span></p>
          </div>
          <div className="absolute right-[150px] top-[48px]"><Burst className="w-[170px] h-[170px] text-[30px] rotate-[8deg]">Hurt<br /><span className="text-[22px]">i detal</span></Burst></div>
        </Frame>
      );
    case 'profile-picture':
      return (
        <Frame w={w} h={h} className="bg-cream grid place-items-center">
          <Wordmark className="text-[112px]" draw={false} />
        </Frame>
      );
    case 'post-smokehouse':
      return (
        <Frame w={w} h={h} className="bg-ink text-cream">
          <img src={img('fb/deli-kabanosy.jpg')} alt="" className="absolute inset-x-0 top-0 h-[64%] w-full object-cover" />
          <div className="absolute inset-x-0 top-[48%] h-[18%] bg-gradient-to-b from-transparent to-ink" />
          <div className="absolute left-16 right-16 top-[62%]">
            <p className="text-[30px] font-bold uppercase tracking-[0.2em] text-gold">Prosto z wędzarni</p>
            <p className="mt-3 font-display font-extrabold text-[104px] leading-[0.9]">Ciepłe wędliny, najlepsze w UK.</p>
            <p className="mt-4 text-[34px] text-cream/80">Warm smoked meats, straight from the smokehouse.</p>
          </div>
          <div className="absolute right-14 top-14"><Burst className="w-[230px] h-[230px] text-[52px] rotate-[8deg]">£13.99<br /><span className="text-[32px]">/kg</span></Burst></div>
          <Foot dark />
        </Frame>
      );
    case 'post-offer':
      return (
        <Frame w={w} h={h} className="bg-gradient-to-b from-[#fde9dc] to-cream">
          <Head eyebrow="Promocja tygodnia · Offer of the week" title={<>Woda <span className="text-red">Żywiec Zdrój</span></>} sub="1.5 l, lekko gazowana · lightly sparkling" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[420px] w-[720px] h-[640px] rounded-[64px] bg-white shadow-[0_50px_90px_-50px_rgba(28,25,23,.55)] grid place-items-center">
            <img src={img('p/zywiec.jpg')} alt="" className="h-[560px] object-contain" />
          </div>
          <div className="absolute right-[90px] top-[360px]"><Burst className="w-[300px] h-[300px] text-[84px] rotate-[10deg]">6 za<br />£5</Burst></div>
          <p className="absolute inset-x-0 top-[1090px] text-center text-[34px] font-bold">Kup 6, zapłać £5 · Buy 6 for £5</p>
          <Foot />
        </Frame>
      );
    case 'post-request':
      return (
        <Frame w={w} h={h} className="bg-gold">
          <Head eyebrow="Zamów produkt · Request a product" title={<>Nie ma?<br /><span className="text-red">Sprowadzimy.</span></>} sub="Can’t find it? Tell us and we’ll order it in." big />
          <div className="absolute inset-x-0 top-[560px] h-[520px]">
            {[['p/kasza.jpg', -8, -300, 40], ['p/ptasie-mleczko.jpg', 3, 0, 0], ['p/winiary.jpg', 9, 300, 50]].map(([src, r, x, y]) => (
              <div key={String(src)} className="absolute left-1/2 top-0 w-[380px] h-[440px] rounded-[56px] bg-white grid place-items-center shadow-[0_40px_70px_-36px_rgba(28,25,23,.6)]" style={{ transform: `translateX(calc(-50% + ${x}px)) translateY(${y}px) rotate(${r}deg)`, zIndex: x === 0 ? 2 : 1 }}>
                <img src={img(String(src))} alt="" className="w-[300px] h-[360px] object-contain" />
              </div>
            ))}
          </div>
          <p className="absolute inset-x-0 top-[1080px] text-center text-[38px] font-bold">Jeden słoik albo pięćdziesiąt kartonów.</p>
          <Foot />
        </Frame>
      );
    case 'post-trade':
      return (
        <Frame w={w} h={h} className="bg-red text-cream">
          <Head eyebrow="Dla firm · For businesses" title={<>Hurt na kartony.</>} sub="Shops, cafés and restaurants: open a trade account." light big />
          <div className="absolute left-1/2 -translate-x-1/2 top-[470px] w-[900px] h-[520px] rounded-[60px] overflow-hidden shadow-[0_50px_90px_-50px_rgba(0,0,0,.7)]">
            <img src={img('fb/meat-shelf.jpg')} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[900px] w-[820px] rounded-[44px] bg-cream text-ink px-12 py-9 grid grid-cols-2 gap-x-8 gap-y-4 text-[32px] font-bold shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)]">
            {['Ceny za karton', 'Stałe zamówienia', 'Sprowadzimy wszystko', 'Odbiór w sklepie'].map((x) => (
              <span key={x} className="flex items-center gap-4"><span className="shrink-0 w-[44px] h-[44px] rounded-full bg-red text-cream grid place-items-center text-[26px]">✓</span>{x}</span>
            ))}
          </div>
          <Foot dark />
        </Frame>
      );
    case 'post-christmas':
      return (
        <Frame w={w} h={h} className="bg-ink text-cream">
          {Array.from({ length: 40 }, (_, i) => <span key={i} className="absolute rounded-full bg-cream/60" style={{ width: 5 + (i % 4) * 3, height: 5 + (i % 4) * 3, left: (i * 197) % 1060, top: (i * 131) % 1240 }} />)}
          <Head eyebrow="Wigilia 2026 · Christmas" title={<>Zamów święta <span className="text-gold">wcześniej.</span></>} sub="Order your Christmas Eve food early, collect when it suits you." light />
          <div className="absolute inset-x-0 top-[500px] flex justify-center gap-6">
            {['p/lowicz-syrop.jpg', 'p/ptasie-mleczko.jpg', 'p/tymbark.jpg'].map((src, i) => (
              <div key={src} className="w-[300px] h-[520px] rounded-[48px] bg-white grid place-items-center" style={{ transform: `rotate(${[-4, 0, 4][i]}deg) translateY(${[30, 0, 30][i]}px)` }}><img src={img(src)} alt="" className="h-[460px] w-[260px] object-contain" /></div>
            ))}
          </div>
          <div className="absolute right-[50px] top-[430px]"><Burst className="w-[200px] h-[200px] text-[36px] rotate-[10deg]">Zamów<br />teraz</Burst></div>
          <Foot dark />
        </Frame>
      );
    case 'post-online':
      return (
        <Frame w={w} h={h} className="bg-paper">
          <Head eyebrow="Nowość · New" title={<>Zamów online.<br /><span className="text-red">Odbierz w sklepie.</span></>} sub="Order online, collect from St Mary’s Road. Pay online or at the counter." />
          <div className="absolute left-1/2 -translate-x-1/2 top-[520px] w-[620px] rounded-[64px] bg-white shadow-[0_50px_90px_-50px_rgba(28,25,23,.55)] overflow-hidden">
            <div className="bg-red text-cream px-12 py-10">
              <p className="text-[26px] font-bold uppercase tracking-[0.18em] text-cream/80">Pokaż przy ladzie</p>
              <p className="font-display font-extrabold text-[130px] leading-none tracking-wider">4821</p>
            </div>
            <div className="px-12 py-9 grid gap-5 text-[30px] font-semibold">
              {[['Przyjęte', true], ['Pakujemy', true], ['Gotowe do odbioru', true]].map(([x], i) => (
                <span key={String(x)} className="flex items-center gap-5"><span className={`w-[52px] h-[52px] rounded-full grid place-items-center text-[28px] ${i === 2 ? 'bg-leaf text-cream' : 'bg-red/15 text-red'}`}>✓</span>{String(x)}</span>
              ))}
            </div>
          </div>
          <Foot />
        </Frame>
      );
    case 'ig-banner':
      return (
        <Frame w={w} h={h} className="bg-paper">
          <div className="absolute inset-x-0 bottom-0 h-[52%]"><Southampton className="w-full h-full" /></div>
          <div className="absolute left-[80px] top-[130px] w-[900px]">
            <p className="text-[40px] font-bold uppercase tracking-[0.2em] text-red">Polskie jedzenie</p>
            <p className="mt-4 font-display font-extrabold text-[120px] leading-[0.9]">Prawdziwy smak domu.</p>
          </div>
          <div className="absolute left-[1080px] w-[1080px] top-[200px] grid place-items-center"><Wordmark className="text-[150px]" draw={false} place /></div>
          <div className="absolute left-[2260px] top-[130px] w-[900px]">
            <p className="text-[40px] font-bold uppercase tracking-[0.2em] text-red">Odwiedź nas</p>
            <p className="mt-4 font-display font-extrabold text-[100px] leading-[0.92]">120 St Mary’s Road, Southampton</p>
          </div>
        </Frame>
      );
    case 'og-home':
      return (
        <Frame w={w} h={h} className="bg-cream">
          <div className="absolute inset-x-0 bottom-0 h-[30%] opacity-70"><Southampton className="w-full h-full" /></div>
          <div className="absolute left-14 top-10 w-[600px]">
            <Wordmark className="text-[58px]" draw={false} place />
            <p className="mt-6 font-display font-extrabold text-[60px] leading-[0.92]">Prawdziwy smak <span className="text-red">domu.</span></p>
            <p className="mt-4 text-[26px] text-ink/70">Polish groceries in Southampton. Shop online or by the case.</p>
          </div>
          <img src={img('fb/deli-kabanosy.jpg')} alt="" className="absolute right-14 top-14 w-[440px] h-[360px] object-cover rounded-[36px] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]" />
          <div className="absolute right-[60px] top-[330px]"><Burst className="w-[150px] h-[150px] text-[30px] rotate-[8deg]">£13.99<br /><span className="text-[20px]">/kg</span></Burst></div>
        </Frame>
      );
    case 'og-shop':
      return (
        <Frame w={w} h={h} className="bg-paper">
          <div className="absolute left-14 top-14 w-[520px]">
            <p className="text-[24px] font-bold uppercase tracking-[0.2em] text-red">Sklep · The shop</p>
            <p className="mt-4 font-display font-extrabold text-[78px] leading-[0.9]">Wszystko z półek.</p>
            <p className="mt-5 text-[28px] text-ink/70">Everything on the shelves, by the item or by the case.</p>
            <div className="mt-10"><Wordmark className="text-[44px]" draw={false} /></div>
          </div>
          <div className="absolute right-12 top-12 grid grid-cols-3 gap-4 w-[560px]">
            {['p/tymbark.jpg', 'p/lowicz-sos.jpg', 'p/ptasie-mleczko.jpg', 'p/zywiec.jpg', 'p/kasza.jpg', 'p/winiary.jpg'].map((src, i) => (
              <div key={src} className="h-[255px] rounded-[30px] bg-white overflow-hidden p-4" style={{ transform: `rotate(${[-2, 2, -1, 1, -2, 2][i]}deg)` }}><img src={img(src)} alt="" className="w-full h-full object-contain" /></div>
            ))}
          </div>
        </Frame>
      );
    case 'og-trade':
      return (
        <Frame w={w} h={h} className="bg-red text-cream">
          <img src={img('fb/meat-shelf.jpg')} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute left-14 top-16 w-[760px]">
            <p className="text-[26px] font-bold uppercase tracking-[0.2em] text-gold">Dla firm · Trade & bulk</p>
            <p className="mt-4 font-display font-extrabold text-[104px] leading-[0.88]">Hurt na kartony.</p>
            <p className="mt-6 text-[30px] text-cream/90">Case prices, regular weekly orders and an account that remembers what you buy.</p>
          </div>
          <div className="absolute left-14 bottom-12"><Wordmark className="text-[46px]" light draw={false} /></div>
          <div className="absolute right-16 bottom-16"><Burst className="w-[190px] h-[190px] text-[34px] rotate-[8deg]">Ceny<br />hurtowe</Burst></div>
        </Frame>
      );
    case 'og-request':
      return (
        <Frame w={w} h={h} className="bg-gold">
          <div className="absolute left-14 top-16 w-[640px]">
            <p className="text-[26px] font-bold uppercase tracking-[0.2em]">Zamów produkt · Request a product</p>
            <p className="mt-4 font-display font-extrabold text-[110px] leading-[0.86]">Nie ma?<br /><span className="text-red">Sprowadzimy.</span></p>
            <p className="mt-6 text-[28px] text-ink/80">Tell us what you need. We’ll order it in.</p>
          </div>
          <div className="absolute right-14 top-20 grid gap-5">
            {['p/kasza.jpg', 'p/ptasie-mleczko.jpg', 'p/winiary.jpg'].map((src, i) => (
              <div key={src} className="w-[200px] h-[150px] rounded-[30px] bg-white overflow-hidden p-3" style={{ transform: `rotate(${[-5, 4, -2][i]}deg) translateX(${[0, -60, 0][i]}px)` }}><img src={img(src)} alt="" className="w-full h-full object-contain" /></div>
            ))}
          </div>
          <div className="absolute left-14 bottom-12"><Wordmark className="text-[44px]" draw={false} /></div>
        </Frame>
      );
    case 'og-account':
      return (
        <Frame w={w} h={h} className="bg-cream">
          <div className="absolute left-14 top-16 w-[560px]">
            <p className="text-[26px] font-bold uppercase tracking-[0.2em] text-red">Konto hurtowe · Trade account</p>
            <p className="mt-4 font-display font-extrabold text-[66px] leading-[0.92]">Zamów ponownie jednym kliknięciem.</p>
            <p className="mt-6 text-[28px] text-ink/70">Past orders, regular orders and your usual list.</p>
          </div>
          <div className="absolute right-14 top-16 w-[460px] rounded-[36px] bg-white p-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,.45)]">
            <p className="font-display font-extrabold text-[34px]">13 października</p>
            <p className="text-[20px] text-ink/55">Delivery, Tuesday morning · £177.50</p>
            {['p/kasza.jpg', 'p/winiary.jpg', 'p/zywiec.jpg'].map((src, i) => (
              <div key={src} className="mt-4 flex items-center gap-4"><span className="w-16 h-16 rounded-2xl bg-paper grid place-items-center"><img src={img(src)} alt="" className="h-12 object-contain" /></span><span className="text-[24px] font-semibold">{[2, 1, 4][i]} × karton</span></div>
            ))}
            <div className="mt-6 rounded-full bg-red text-cream text-center font-bold text-[24px] py-4">Zamów ponownie</div>
          </div>
          <div className="absolute left-14 bottom-12"><Wordmark className="text-[44px]" draw={false} /></div>
        </Frame>
      );
    case 'og-board':
      return (
        <Frame w={w} h={h} className="bg-paper">
          <div className="absolute inset-x-0 top-24 text-center"><Wordmark className="text-[130px]" draw={false} place /></div>
          <p className="absolute inset-x-0 top-[360px] text-center text-[30px] font-bold">Brand guidelines · Księga znaku</p>
          <div className="absolute inset-x-0 bottom-16 flex justify-center gap-4">
            {['#D7141A', '#FFF8EF', '#F6EEDF', '#1C1917', '#F4B400', '#2F6B35'].map((c) => <span key={c} className="w-[110px] h-[90px] rounded-[24px] ring-1 ring-ink/10" style={{ background: c }} />)}
          </div>
        </Frame>
      );
    case 'story-offer':
      return (
        <Frame w={w} h={h} className="bg-red text-cream">
          <div className="absolute inset-x-0 top-[200px] text-center">
            <p className="text-[44px] font-bold uppercase tracking-[0.2em] text-gold">Promocja</p>
            <p className="mt-5 font-display font-extrabold text-[130px] leading-[0.9]">Sos do spaghetti</p>
            <p className="mt-5 text-[48px]">Łowicz · 500 g</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[700px] w-[700px] h-[760px] rounded-[80px] bg-white grid place-items-center shadow-[0_60px_100px_-60px_rgba(0,0,0,.7)]">
            <img src={img('p/lowicz-sos.jpg')} alt="" className="h-[660px] object-contain" />
          </div>
          <div className="absolute right-[80px] top-[620px]"><Burst className="w-[340px] h-[340px] text-[96px] rotate-[8deg]">2 za<br />£3</Burst></div>
          <div className="absolute inset-x-0 bottom-[130px] text-center"><Wordmark className="text-[90px]" light place draw={false} /></div>
        </Frame>
      );
  }
  return null;
}

function Page() {
  const name = new URLSearchParams(location.search).get('a') ?? 'facebook-cover';
  return <StoreProvider><Asset name={name} /></StoreProvider>;
}

if (document.getElementById('social-root')) {
  createRoot(document.getElementById('social-root')!).render(<StrictMode><Page /></StrictMode>);
}
