import { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'motion/react';
import { ArrowRight, Check, Plus, ShoppingBasket } from 'lucide-react';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import './index.css';
import { BASE, Burst, Stepper, Wordmark, btn, field, img } from './ui.tsx';
import { StoreProvider } from './store.tsx';
import { Southampton } from './Southampton.tsx';
import { Asset, SIZES } from './social.tsx';
import { PriceSwitch, ProductCard } from './pages/parts.tsx';
import { PRODUCTS } from './data.ts';

const COLOURS = [
  ['Czerwień', 'Shop red', '#D7141A', 'The sign, buttons, offers', 'text-cream'],
  ['Krem', 'Cream', '#FFF8EF', 'Page background', 'text-ink'],
  ['Papier', 'Paper', '#F6EEDF', 'Panels, the footer', 'text-ink'],
  ['Atrament', 'Ink', '#1C1917', 'Text, trade', 'text-cream'],
  ['Złoto', 'Gold', '#F4B400', 'Requests, highlights', 'text-ink'],
  ['Zieleń', 'Leaf', '#2F6B35', 'Ready, confirmed', 'text-cream'],
] as const;

const CHAPTERS = [['brand', '01', 'Brand'], ['social', '02', 'Social'], ['shop', '03', 'Online shop'], ['ui', '04', 'Web UI']] as const;

function Chapter({ id, n, title, intro, children, tone = 'bg-cream' }: { id: string; n: string; title: string; intro: string; children: ReactNode; tone?: string }) {
  return (
    <section id={id} className={`${tone} scroll-mt-20`}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid md:grid-cols-[auto_1fr] gap-4 md:gap-10 items-end border-b-2 border-ink/10 pb-8 mb-12">
          <p className="font-display font-extrabold text-[clamp(4rem,10vw,8rem)] leading-[0.8] text-red">{n}</p>
          <div>
            <h2 className="text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-none">{title}</h2>
            <p className="mt-3 text-lg text-ink/70 max-w-2xl">{intro}</p>
          </div>
        </motion.div>
        <div className="grid gap-6">{children}</div>
      </div>
    </section>
  );
}

function Block({ label, children, className = '', note }: { label: string; children: ReactNode; className?: string; note?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.6 }} className={`rounded-[2rem] bg-white p-6 md:p-9 ${className}`}>
      <p className="font-bold text-red text-xs uppercase tracking-[0.22em] mb-5">{label}</p>
      {children}
      {note && <p className="mt-5 text-ink/70 text-[1.02rem] max-w-3xl">{note}</p>}
    </motion.div>
  );
}

function Scaled({ name, width }: { name: string; width: number }) {
  const [w, h] = SIZES[name];
  const z = width / w;
  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_24px_48px_-30px_rgba(0,0,0,.6)] shrink-0" style={{ width, height: h * z }}>
      <div style={{ zoom: z }}><Asset name={name} /></div>
    </div>
  );
}

function Phone({ src, label }: { src: string; label: string }) {
  return (
    <figure className="text-center">
      <div className="mx-auto w-full max-w-[260px] aspect-[390/844] rounded-[2.4rem] bg-ink p-2.5 shadow-[0_30px_60px_-34px_rgba(0,0,0,.7)]">
        <div className="w-full h-full rounded-[1.9rem] overflow-hidden bg-cream"><img src={`${BASE}board/${src}`} alt={label} className="w-full h-full object-cover object-top" loading="lazy" /></div>
      </div>
      <figcaption className="mt-3 font-semibold">{label}</figcaption>
    </figure>
  );
}

function Browser({ src, label }: { src: string; label: string }) {
  return (
    <figure>
      <div className="rounded-2xl overflow-hidden ring-1 ring-ink/10 shadow-[0_30px_60px_-34px_rgba(0,0,0,.5)] bg-white">
        <div className="h-9 bg-paper flex items-center gap-2 px-4">{['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}<span className="ml-4 text-xs text-ink/50">naszsklep · {label}</span></div>
        <img src={`${BASE}board/${src}`} alt={label} className="w-full aspect-[16/10] object-cover object-top" loading="lazy" />
      </div>
      <figcaption className="mt-3 font-semibold">{label}</figcaption>
    </figure>
  );
}

function LogoReplay() {
  const [k, setK] = useState(0);
  return (
    <div>
      <div className="rounded-2xl bg-cream grid place-items-center min-h-[300px] p-8">
        <Wordmark key={k} className="text-[clamp(3rem,7vw,5.4rem)]" place />
      </div>
      <button onClick={() => setK(k + 1)} className="mt-4 text-sm font-bold text-red underline underline-offset-4">Replay the animation</button>
    </div>
  );
}

function Board() {
  const sample = PRODUCTS.find((p) => p.id === 'sos-lowicz')!;
  return (
    <div className="bg-paper min-h-screen overflow-x-clip">
      <nav className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-ink/10">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 h-16 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <Wordmark className="text-xl shrink-0" draw={false} />
          {CHAPTERS.map(([id, n, t]) => <a key={id} href={`#${id}`} className="shrink-0 font-semibold text-sm hover:text-red"><span className="text-red mr-1">{n}</span>{t}</a>)}
        </div>
      </nav>

      <header className="relative overflow-hidden bg-red text-cream">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 pt-20 pb-40 md:pb-56 relative z-10">
          <p className="font-bold text-gold text-sm uppercase tracking-[0.22em]">Brand guidelines · Księga znaku · Draft for review</p>
          <div className="mt-8 text-[clamp(3.2rem,11vw,8.5rem)]"><Wordmark light place /></div>
          <p className="mt-10 text-[clamp(1.6rem,3.6vw,3rem)] font-display font-extrabold max-w-4xl leading-[1.02]">Prawdziwy smak domu. A real taste of home.</p>
          <p className="mt-4 text-cream/85 max-w-2xl text-lg">Polish and Eastern European groceries, 120 St Mary’s Road, Southampton. For homes, shops and kitchens.</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[34%] opacity-25 [filter:invert(1)]"><Southampton className="w-full h-full" /></div>
      </header>

      <Chapter id="brand" n="01" title="Brand" intro="Everything comes from what the shop already has: the red sign over the door, the offer posters and the counter.">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
          <Block label="The logo" note="Exactly as on the shopfront: the red name inside the rounded red frame, with Southampton set into the bottom line. On the website the frame draws itself in as the page opens.">
            <LogoReplay />
          </Block>
          <Block label="Versions">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-red grid place-items-center p-5 min-h-[120px]"><Wordmark className="text-[clamp(0.9rem,1.5vw,1.2rem)]" light draw={false} /></div>
              <div className="rounded-2xl bg-ink grid place-items-center p-5 min-h-[120px]"><Wordmark className="text-[clamp(0.9rem,1.5vw,1.2rem)]" light draw={false} /></div>
              <div className="rounded-2xl bg-cream ring-1 ring-ink/10 grid place-items-center p-5 min-h-[120px]"><Wordmark className="text-[clamp(0.9rem,1.5vw,1.2rem)]" draw={false} /></div>
              <div className="rounded-2xl bg-paper grid place-items-center p-5 min-h-[120px]"><img src={`${BASE}favicon.svg`} alt="Browser icon" className="w-16 h-16" /></div>
            </div>
            <p className="mt-5 text-ink/70">Cream on red or ink, red on light. The framed N is the browser tab icon.</p>
          </Block>
        </div>
        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
          <Block label="Profile picture" note="Just the name in its frame. Fits inside the circle Facebook, Instagram and WhatsApp crop to.">
            <div className="flex justify-center"><div className="w-[240px] h-[240px] rounded-full overflow-hidden ring-1 ring-ink/10"><div style={{ zoom: 240 / 720 }}><Asset name="profile-picture" /></div></div></div>
          </Block>
          <Block label="Colour">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLOURS.map(([pl, en, hex, use, txt]) => (
                <div key={hex} className={`rounded-2xl p-4 min-h-36 flex flex-col ${txt} ${hex === '#FFF8EF' ? 'ring-1 ring-ink/10' : ''}`} style={{ background: hex }}>
                  <p className="font-display font-extrabold text-2xl">{pl}</p>
                  <p className="text-sm opacity-80">{en}</p>
                  <p className="mt-auto font-mono text-sm">{hex}</p>
                  <p className="text-xs opacity-75">{use}</p>
                </div>
              ))}
            </div>
          </Block>
        </div>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
          <Block label="Type" note="Both free. Big and clear for every customer, with every Polish letter: ą ć ę ł ń ó ś ź ż.">
            <p className="font-display font-extrabold text-[clamp(2.6rem,6vw,4.6rem)] leading-none">Bricolage Grotesque</p>
            <p className="font-display font-extrabold text-3xl mt-3">Kiełbasa · Żurek · Śledzie · Pączki</p>
            <p className="mt-6 text-2xl">Inter, for prices, buttons and forms.</p>
          </Block>
          <Block label="The price burst" note="From the shop’s own offer posters. Marks every deal, online and on Facebook.">
            <div className="flex items-center justify-center gap-6 py-4">
              <Burst className="w-36 h-36 text-2xl rotate-6">2 za<br />£3</Burst>
              <Burst className="w-28 h-28 text-lg -rotate-6">£13.99<br />/kg</Burst>
            </div>
          </Block>
        </div>
        <Block label="Photography" note="Honest phone photos of the counter and shelves from the shop’s Facebook page. Branded products use clean pack shots.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['fb/deli-kabanosy.jpg', 'fb/deli-kielbasa.jpg', 'fb/meat-cuts.jpg', 'fb/veg-cabbage.jpg'].map((s) => <img key={s} src={img(s)} alt="" className="rounded-2xl aspect-square object-cover w-full" />)}
          </div>
        </Block>
        <Block label="Southampton, drawn by hand" note="An engraved-style drawing of the city: the Bargate, the old walls, the Civic Centre clock tower, the docks, and Nasz Sklep on a St Mary’s terrace. On the website the ships sail across the footer.">
          <div className="rounded-2xl bg-paper overflow-hidden h-[300px] md:h-[380px]"><Southampton className="w-full h-full" /></div>
        </Block>
      </Chapter>

      <Chapter id="social" n="02" title="Social" intro="Static banners and ready-to-post images for Facebook and Instagram. Polish first, English underneath, one message per post." tone="bg-paper">
        <Block label="Facebook cover (static banner)">
          <div className="overflow-x-auto no-scrollbar"><Scaled name="facebook-cover" width={1220} /></div>
        </Block>
        <Block label="Instagram grid banner" note="Three posts that line up into one banner across the top row of the profile. Post the right one first, then the middle, then the left.">
          <div className="overflow-x-auto no-scrollbar">
            <div className="relative w-[1220px]">
              <Scaled name="ig-banner" width={1220} />
              <span className="absolute top-0 bottom-0 left-1/3 w-1 bg-paper" /><span className="absolute top-0 bottom-0 left-2/3 w-1 bg-paper" />
            </div>
          </div>
        </Block>
        <Block label="Posts and story">
          <div className="flex flex-wrap justify-center gap-5">
            {['post-online', 'post-smokehouse', 'post-offer', 'post-request', 'post-trade', 'post-christmas'].map((n) => <Scaled key={n} name={n} width={270} />)}
            <Scaled name="story-offer" width={190} />
          </div>
        </Block>
      </Chapter>

      <Chapter id="shop" n="03" title="Online shop" intro="What customers and the shop see. Order online, collect from St Mary’s Road, pay online or at the counter. Trade customers buy by the case.">
        <div className="grid md:grid-cols-2 gap-6">
          <Browser src="d-home.png" label="Home" />
          <Browser src="d-orders.png" label="The shop’s pick-up orders screen" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <Phone src="m-shop.png" label="Shop" />
          <Phone src="m-checkout.png" label="Checkout: collect from the shop" />
          <Phone src="m-tracked.png" label="Order ready to collect" />
          <Phone src="m-account.png" label="Trade account" />
        </div>
        <Block label="The pick-up journey">
          <ol className="grid md:grid-cols-4 gap-4">
            {[['Order online', 'Pick a collection time. Someone else can collect.'], ['Pay your way', 'Online now, or cash or card at the counter.'], ['We pack it', 'The order appears on the shop’s screen.'], ['Collect', 'A text when it’s ready. Show the 4-digit code.']].map(([h, b], i) => (
              <li key={h} className="rounded-2xl bg-paper p-5"><span className="w-10 h-10 rounded-full bg-red text-cream grid place-items-center font-display font-extrabold">{i + 1}</span><p className="mt-3 font-display font-extrabold text-xl">{h}</p><p className="text-ink/70">{b}</p></li>
            ))}
          </ol>
        </Block>
      </Chapter>

      <Chapter id="ui" n="04" title="Web UI" intro="The building blocks of the site, live. Large tap targets, high contrast and plain words, for customers of every age." tone="bg-paper">
        <div className="grid md:grid-cols-2 gap-6">
          <Block label="Buttons">
            <div className="flex flex-wrap gap-3">
              <span className={btn.red}><ShoppingBasket className="w-5 h-5" />Start shopping</span>
              <span className={btn.light}>Trade &amp; bulk buying</span>
              <span className={btn.ink}>Request a product <ArrowRight className="w-5 h-5" /></span>
            </div>
            <p className="mt-5 text-ink/70">At least 56px tall. Red for the main action on a page, one per screen.</p>
          </Block>
          <Block label="Price switch and quantity">
            <PriceSwitch />
            <div className="mt-5 flex items-center gap-4"><Stepper qty={2} label="demo" dec={() => undefined} inc={() => undefined} /><span className="inline-flex items-center gap-1.5 rounded-full min-h-12 px-4 font-bold bg-red text-cream"><Plus className="w-5 h-5" />Add</span></div>
          </Block>
        </div>
        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <Block label="Product card">
            <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: {} }}><ProductCard p={sample} /></motion.ul>
          </Block>
          <div className="grid gap-6">
            <Block label="Labels">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full px-3 py-1 text-sm font-bold bg-leaf text-cream">Paid online</span>
                <span className="rounded-full px-3 py-1 text-sm font-bold bg-gold">Take £8.98</span>
                <span className="rounded-full px-3 py-1 text-sm font-bold bg-ink text-cream">Trade</span>
                <span className="rounded-full px-3 py-1 text-sm font-bold bg-gold">Coming soon</span>
                <span className="rounded-full px-4 py-2 font-semibold border-2 border-ink/15 bg-white">Smoked meats</span>
                <span className="rounded-full px-4 py-2 font-semibold border-2 border-red bg-red text-cream">Everything</span>
              </div>
            </Block>
            <Block label="Form field">
              <label className="grid gap-2 font-semibold max-w-md">Your mobile<input className={field} defaultValue="07700 900123" /></label>
            </Block>
            <Block label="Order progress">
              <ol className="grid grid-cols-4 gap-2 max-w-xl">
                {['Received', 'Being packed', 'Ready to collect', 'Collected'].map((s, i) => (
                  <li key={s} className="text-center"><span className={`mx-auto w-12 h-12 rounded-full grid place-items-center ${i <= 2 ? 'bg-red text-cream' : 'bg-white ring-1 ring-ink/10'}`}><Check className="w-5 h-5" /></span><span className={`mt-2 block text-sm font-bold ${i <= 2 ? 'text-red' : 'text-ink/45'}`}>{s}</span></li>
                ))}
              </ol>
            </Block>
          </div>
        </div>
        <Block label="Motion" note="The logo frame draws in once. The hero headline and photos change every few seconds. Sections rise into place as you scroll; offers and the trade steps move with the scroll. Everything stops for people who turn motion off on their phone.">
          <div className="grid sm:grid-cols-3 gap-3 text-center font-semibold">
            {['Frame draws in · 1.3 s', 'Headline changes · every 5 s', 'Sections rise · 0.7 s'].map((x) => <div key={x} className="rounded-2xl bg-paper p-5">{x}</div>)}
          </div>
        </Block>
      </Chapter>

      <footer className="bg-cream py-12 text-center text-sm text-ink/55">Draft by Revti for Nasz Sklep (Southampton) Limited. Prices and products are examples for review.</footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><StoreProvider><Board /></StoreProvider></StrictMode>);
