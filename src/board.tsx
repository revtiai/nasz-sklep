import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import './index.css';
import { BASE, Badge, Burst, Wordmark, img } from './ui.tsx';
import { StoreProvider } from './store.tsx';
import { Southampton } from './Southampton.tsx';
import { Asset, SIZES } from './social.tsx';

const COLOURS = [
  ['Czerwień', 'Shop red', '#D7141A', 'The sign, buttons, offers', 'text-cream'],
  ['Krem', 'Cream', '#FFF8EF', 'Backgrounds', 'text-ink'],
  ['Papier', 'Paper', '#F6EEDF', 'Panels and the footer', 'text-ink'],
  ['Atrament', 'Ink', '#1C1917', 'Text and trade', 'text-cream'],
  ['Złoto', 'Gold', '#F4B400', 'Highlights, requests', 'text-ink'],
  ['Zieleń', 'Leaf', '#2F6B35', 'Fresh, confirmations', 'text-cream'],
] as const;

function Card({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[2rem] bg-white p-6 md:p-9 ${className}`}>
      <p className="font-bold text-red text-xs uppercase tracking-[0.22em] mb-5">{title}</p>
      {children}
    </section>
  );
}

function Scaled({ name, width }: { name: string; width: number }) {
  const [w, h] = SIZES[name];
  const z = width / w;
  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_20px_40px_-30px_rgba(0,0,0,.6)]" style={{ width, height: h * z }}>
      <div style={{ zoom: z }}><Asset name={name} /></div>
    </div>
  );
}

function Board() {
  return (
    <div className="min-h-screen bg-paper p-4 md:p-10">
      <div className="max-w-[1400px] mx-auto grid gap-5">
        <header className="relative overflow-hidden rounded-[2rem] bg-red text-cream p-8 md:p-14 min-h-[360px]">
          <div className="relative z-10">
            <p className="font-bold text-gold text-sm uppercase tracking-[0.22em]">Brand board · draft for review</p>
            <div className="mt-6 text-[clamp(3rem,9vw,7rem)]"><Wordmark light /></div>
            <p className="mt-4 text-2xl md:text-4xl font-display font-extrabold max-w-3xl leading-tight">Prawdziwy smak domu. A real taste of home.</p>
            <p className="mt-3 text-cream/85 max-w-2xl text-lg">Polish and Eastern European groceries, 120 St Mary’s Road, Southampton. For homes, shops and kitchens.</p>
          </div>
          
        </header>

        <div className="grid md:grid-cols-2 gap-5">
          <Card title="1 · The logo: the name, circled">
            <div className="rounded-2xl bg-cream p-10 grid place-items-center min-h-[260px]"><Wordmark className="text-[5rem]" place /></div>
            <p className="mt-5 text-ink/75 text-[1.05rem]">The shop’s own name, unchanged, with the circle from its original logo drawn in red around it. On the website the ring draws itself around the name as the page opens.</p>
          </Card>
          <Card title="2 · Versions">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-red grid place-items-center p-6 min-h-[140px]"><Wordmark className="text-[2.2rem]" light draw={false} /></div>
              <div className="rounded-2xl bg-ink grid place-items-center p-6 min-h-[140px]"><Wordmark className="text-[2.2rem]" light draw={false} /></div>
              <div className="rounded-2xl bg-paper grid place-items-center p-4"><Badge size={130} /></div>
              <div className="rounded-2xl bg-cream grid place-items-center p-4"><img src={`${BASE}favicon.svg`} alt="" className="w-16 h-16" /></div>
            </div>
            <p className="mt-5 text-ink/75 text-[1.05rem]">Red or ink backgrounds use the cream version. The round badge is the profile picture for Facebook, Instagram and WhatsApp; the small circle is the browser icon.</p>
          </Card>
        </div>

        <Card title="3 · Colour">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {COLOURS.map(([pl, en, hex, use, txt]) => (
              <div key={hex} className={`rounded-2xl p-4 min-h-44 flex flex-col ${txt} ${hex === '#FFF8EF' ? 'ring-1 ring-ink/10' : ''}`} style={{ background: hex }}>
                <p className="font-display font-extrabold text-2xl">{pl}</p>
                <p className="text-sm opacity-80">{en}</p>
                <p className="mt-auto font-mono text-sm">{hex}</p>
                <p className="text-xs opacity-75">{use}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-5">
          <Card title="4 · Type">
            <p className="font-display font-extrabold text-6xl leading-none">Bricolage Grotesque</p>
            <p className="font-display font-extrabold text-4xl mt-3">Kiełbasa · Żurek · Śledzie · Pączki</p>
            <p className="mt-6 text-2xl">Inter for prices, buttons and forms.</p>
            <p className="mt-2 text-ink/70 text-lg">Both free. Large and clear for every customer, with every Polish letter: ą ć ę ł ń ó ś ź ż.</p>
          </Card>
          <Card title="5 · The price burst">
            <div className="flex items-center gap-6">
              <Burst className="w-36 h-36 text-2xl rotate-6">2 za<br />£3</Burst>
              <Burst className="w-28 h-28 text-lg -rotate-6">£13.99<br />/kg</Burst>
            </div>
            <p className="mt-5 text-ink/75 text-[1.05rem]">Taken from the shop’s own offer posters and tidied up. It marks every deal, online and on Facebook.</p>
          </Card>
        </div>

        <Card title="6 · Photography: the real shop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['fb/deli-kabanosy.jpg', 'fb/deli-kielbasa.jpg', 'fb/meat-cuts.jpg', 'fb/veg-cabbage.jpg'].map((s) => <img key={s} src={img(s)} alt="" className="rounded-2xl aspect-square object-cover w-full" />)}
          </div>
          <p className="mt-5 text-ink/75 text-[1.05rem]">Honest phone photos of the counter and shelves, straight from the shop’s Facebook page. Branded products use clean pack shots.</p>
        </Card>

        <Card title="7 · Southampton, drawn by hand">
          <div className="rounded-2xl bg-paper overflow-hidden h-[340px]"><Southampton className="w-full h-full" /></div>
          <p className="mt-5 text-ink/75 text-[1.05rem]">An engraved-style drawing of the city: the Bargate, the old walls, the Civic Centre clock tower, the docks and a cruise ship sailing past, with Nasz Sklep on the terrace. On the website the ships sail across the footer.</p>
        </Card>

        <Card title="8 · Facebook and Instagram">
          <Scaled name="facebook-cover" width={1300} />
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['post-smokehouse', 'post-offer', 'post-request', 'post-trade', 'post-online', 'post-christmas'].map((n) => <Scaled key={n} name={n} width={300} />)}
            <div className="grid gap-4 content-start"><Scaled name="profile-picture" width={150} /><p className="text-sm text-ink/60">Profile picture for Facebook, Instagram and WhatsApp Business.</p></div>
            <Scaled name="story-offer" width={180} />
          </div>
          <p className="mt-5 text-ink/75 text-[1.05rem]">Polish first, English underneath. One message per post, a big headline, the red burst for offers.</p>
        </Card>

        <Card title="9 · Link previews">
          <div className="grid md:grid-cols-3 gap-4">
            {['og-home', 'og-shop', 'og-trade', 'og-request', 'og-account', 'og-board'].map((n) => <Scaled key={n} name={n} width={400} />)}
          </div>
          <p className="mt-5 text-ink/75 text-[1.05rem]">Each section of the site has its own preview card for WhatsApp, Facebook and Messenger.</p>
        </Card>

        <Card title="10 · The online shop">
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-4 items-start">
            <img src={`${BASE}board/d-home.png`} alt="Website home page on a computer" className="rounded-2xl w-full ring-1 ring-ink/10" />
            <img src={`${BASE}board/m-home.png`} alt="Website on a phone" className="rounded-2xl w-full ring-1 ring-ink/10" />
            <img src={`${BASE}board/m-account.png`} alt="Trade account on a phone" className="rounded-2xl w-full ring-1 ring-ink/10" />
          </div>
        </Card>
        <p className="text-center text-xs text-ink/55 py-4">Draft by Revti for Nasz Sklep (Southampton) Limited. Prices and products are examples for review.</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><StoreProvider><Board /></StoreProvider></StrictMode>);
