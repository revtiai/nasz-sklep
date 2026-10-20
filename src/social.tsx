import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import './index.css';
import { Burst, Mark, Wordmark, img } from './ui.tsx';
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
};

function Foot({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 px-16 pb-14 flex items-center justify-between ${dark ? 'text-cream' : 'text-ink'}`}>
      <span className="flex items-center gap-4"><Mark size={72} inverse={dark} /><Wordmark className="text-[52px]" light={dark} /></span>
      <span className="text-right text-[26px] font-semibold leading-tight opacity-85">120 St Mary’s Road<br />Southampton</span>
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
          <div className="absolute inset-x-0 bottom-0 h-[61%]"><Southampton className="w-full h-full" /></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[56px] text-center w-[1100px]">
            <Wordmark className="text-[132px]" />
            <p className="mt-3 text-[34px] font-bold text-ink">Polskie jedzenie w Southampton · <span className="text-red">Polish food in Southampton</span></p>
          </div>
          <div className="absolute right-[150px] top-[48px]"><Burst className="w-[170px] h-[170px] text-[30px] rotate-[8deg]">Hurt<br /><span className="text-[22px]">i detal</span></Burst></div>
        </Frame>
      );
    case 'profile-picture':
      return <Frame w={w} h={h} className="bg-red grid place-items-center"><Mark size={560} /></Frame>;
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
        <Frame w={w} h={h} className="bg-cream">
          <div className="absolute inset-x-0 top-0 h-[16px] bg-red" />
          <p className="absolute left-16 top-20 text-[34px] font-bold uppercase tracking-[0.2em] text-red">Promocja tygodnia</p>
          <p className="absolute left-16 top-[140px] font-display font-extrabold text-[118px] leading-[0.9] w-[760px]">Woda Żywiec Zdrój</p>
          <p className="absolute left-16 top-[400px] text-[36px] text-ink/70">1.5 l, lekko gazowana · lightly sparkling</p>
          <img src={img('p/zywiec.jpg')} alt="" className="absolute left-1/2 -translate-x-1/2 top-[470px] h-[560px] object-contain" />
          <div className="absolute right-16 top-[560px]"><Burst className="w-[300px] h-[300px] text-[80px] rotate-[10deg]">6 za<br />£5</Burst></div>
          <Foot />
        </Frame>
      );
    case 'post-request':
      return (
        <Frame w={w} h={h} className="bg-gold">
          <div className="absolute left-16 right-16 top-24">
            <p className="text-[34px] font-bold uppercase tracking-[0.2em]">Zamów produkt</p>
            <p className="mt-4 font-display font-extrabold text-[150px] leading-[0.86]">Nie ma?<br /><span className="text-red">Sprowadzimy.</span></p>
            <p className="mt-10 text-[44px] font-semibold leading-tight">Napisz, czego szukasz. Jeden słoik albo pięćdziesiąt kartonów.</p>
            <p className="mt-6 text-[34px] text-ink/75">Can’t find it? Tell us and we’ll order it in.</p>
          </div>
          <div className="absolute right-16 top-[860px] flex gap-6">
            {['p/kasza.jpg', 'p/ptasie-mleczko.jpg', 'p/winiary.jpg'].map((s, i) => (
              <div key={s} className="w-[200px] h-[200px] rounded-[40px] bg-white grid place-items-center shadow-[0_20px_40px_-20px_rgba(0,0,0,.5)]" style={{ transform: `rotate(${[-6, 4, -2][i]}deg)` }}>
                <img src={img(s)} alt="" className="w-[150px] h-[150px] object-contain" />
              </div>
            ))}
          </div>
          <Foot />
        </Frame>
      );
    case 'post-trade':
      return (
        <Frame w={w} h={h} className="bg-red text-cream">
          <img src={img('fb/meat-shelf.jpg')} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute left-16 right-16 top-24">
            <p className="text-[34px] font-bold uppercase tracking-[0.2em] text-gold">Dla firm · For businesses</p>
            <p className="mt-4 font-display font-extrabold text-[132px] leading-[0.88]">Hurt na kartony.</p>
            <ul className="mt-12 grid gap-6 text-[46px] font-semibold">
              {['Ceny hurtowe za karton', 'Stałe zamówienia co tydzień', 'Sprowadzimy, czego potrzebujesz', 'Odbiór lub dostawa'].map((x) => (
                <li key={x} className="flex items-center gap-6"><span className="w-[52px] h-[52px] rounded-full bg-cream text-red grid place-items-center text-[34px] font-extrabold">✓</span>{x}</li>
              ))}
            </ul>
            <p className="mt-10 text-[34px] text-cream/85">Shops, cafés and restaurants: open a trade account.</p>
          </div>
          <Foot dark />
        </Frame>
      );
    case 'post-christmas':
      return (
        <Frame w={w} h={h} className="bg-ink text-cream">
          {Array.from({ length: 34 }, (_, i) => <span key={i} className="absolute rounded-full bg-cream/70" style={{ width: 6 + (i % 4) * 3, height: 6 + (i % 4) * 3, left: (i * 197) % 1060, top: (i * 131) % 820 }} />)}
          <div className="absolute left-16 right-16 top-28 text-center">
            <p className="text-[34px] font-bold uppercase tracking-[0.2em] text-gold">Wigilia 2026</p>
            <p className="mt-6 font-display font-extrabold text-[132px] leading-[0.88]">Zamów święta wcześniej.</p>
            <p className="mt-10 text-[44px] font-semibold leading-tight text-cream/90">Wędliny i wszystko na stół wigilijny. Zapytaj w sklepie o zamówienia.</p>
            <p className="mt-6 text-[34px] text-cream/70">Order your Christmas Eve food early.</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[930px]"><Burst className="w-[220px] h-[220px] text-[40px]">Zamów<br />teraz</Burst></div>
          <Foot dark />
        </Frame>
      );
    case 'post-online':
      return (
        <Frame w={w} h={h} className="bg-paper">
          <div className="absolute left-16 right-16 top-24">
            <p className="text-[34px] font-bold uppercase tracking-[0.2em] text-red">Nowość · New</p>
            <p className="mt-4 font-display font-extrabold text-[124px] leading-[0.88]">Nasz Sklep jest teraz online.</p>
            <p className="mt-8 text-[42px] font-semibold leading-tight">Zamów z odbiorem w sklepie lub z dostawą. Our shop is now online.</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[700px] w-[440px] h-[420px] rounded-[60px] bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,.5)] overflow-hidden">
            <div className="h-[86px] bg-cream flex items-center gap-4 px-8"><Mark size={52} /><Wordmark className="text-[36px]" /></div>
            <div className="grid grid-cols-2 gap-4 p-6">
              {['p/tymbark.jpg', 'p/ptasie-mleczko.jpg', 'p/lowicz-sos.jpg', 'p/kasza.jpg'].map((s) => <div key={s} className="h-[130px] rounded-3xl bg-paper grid place-items-center"><img src={img(s)} alt="" className="h-[110px] object-contain" /></div>)}
            </div>
          </div>
          <Foot />
        </Frame>
      );
    case 'story-offer':
      return (
        <Frame w={w} h={h} className="bg-red text-cream">
          <div className="absolute inset-x-0 top-[240px] text-center">
            <p className="text-[44px] font-bold uppercase tracking-[0.2em] text-gold">Promocja</p>
            <p className="mt-6 font-display font-extrabold text-[150px] leading-[0.88]">Zupka<br />Kaczka</p>
            <p className="mt-6 text-[48px]">Vifon · 70 g</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[900px]"><Burst className="w-[460px] h-[460px] text-[120px] rotate-[6deg]">2 za<br />£1.50</Burst></div>
          <div className="absolute inset-x-0 bottom-[160px] text-center"><Wordmark className="text-[96px]" light place /></div>
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
