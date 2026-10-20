import { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'motion/react';
import { ArrowRight, Check, Download, Plus, ShoppingBasket } from 'lucide-react';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import './index.css';
import { BASE, Burst, Stepper, Wordmark, btn, field, img } from './ui.tsx';
import { StoreProvider } from './store.tsx';
import { Southampton } from './Southampton.tsx';
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

const CHAPTERS = [['brand', '01', 'Brand'], ['social', '02', 'Social'], ['desktop', '03', 'Website: computer'], ['phone', '04', 'Website: phone'], ['ui', '05', 'Web UI']] as const;
declare const __ASSET_VERSION__: string;
const A = (f: string) => `${BASE}assets/${f}?v=${__ASSET_VERSION__}`;
const ZIP = A('nasz-sklep-brand-assets.zip');

function Get({ file, label = 'Download', light = false }: { file: string; label?: string; light?: boolean }) {
  return (
    <a href={A(file)} download className={`press inline-flex items-center gap-2 rounded-full px-4 min-h-11 text-sm font-bold ${light ? 'bg-cream text-red' : 'bg-ink text-cream hover:bg-red'}`}>
      <Download className="w-4 h-4" aria-hidden="true" />{label}
    </a>
  );
}

function Shot({ file, title, size, ratio, className = '' }: { file: string; title: string; size?: string; ratio?: string; className?: string }) {
  return (
    <figure className={`min-w-0 ${className}`}>
      <div className="rounded-2xl overflow-hidden bg-paper ring-1 ring-ink/10 shadow-[0_20px_40px_-30px_rgba(0,0,0,.5)]">
        <img src={A(file)} alt={title} loading="lazy" decoding="async" className="w-full h-auto block" style={ratio ? { aspectRatio: ratio, objectFit: 'cover', objectPosition: 'top' } : undefined} />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span><span className="block font-semibold leading-tight">{title}</span>{size && <span className="text-sm text-ink/55">{size}</span>}</span>
        <Get file={file} />
      </figcaption>
    </figure>
  );
}

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
        <div className="grid gap-6 [&>*]:min-w-0">{children}</div>
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

function LogoReplay() {
  const [k, setK] = useState(0);
  return (
    <div>
      <div className="rounded-2xl bg-cream grid place-items-center min-h-[300px] p-8">
        <Wordmark key={k} className="text-[clamp(1.75rem,10.5vw,5.4rem)]" place />
      </div>
      <button onClick={() => setK(k + 1)} className="mt-4 text-sm font-bold text-red underline underline-offset-4">Replay the animation</button>
    </div>
  );
}

function Board() {
  const cards = ['kabanosy', 'sos-lowicz', 'zywiec', 'tchibo'].map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);
  const posts: [string, string][] = [
    ['social/post-order-online-collect.png', 'Order online, collect in store'],
    ['social/post-smokehouse-meats.png', 'Smokehouse meats'],
    ['social/post-offer-of-the-week.png', 'Offer of the week (template)'],
    ['social/post-request-a-product.png', 'Request a product'],
    ['social/post-trade-accounts.png', 'Trade accounts'],
    ['social/post-christmas-orders.png', 'Christmas orders'],
  ];
  return (
    <div className="bg-paper min-h-screen overflow-x-clip">
      <nav className="sticky top-0 z-30 bg-cream border-b border-ink/10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-10 h-16 flex items-center gap-5 overflow-x-auto no-scrollbar">
          <Wordmark className="text-lg shrink-0" draw={false} />
          {CHAPTERS.map(([id, n, t]) => <a key={id} href={`#${id}`} className="shrink-0 font-semibold text-sm hover:text-red py-3"><span className="text-red mr-1">{n}</span>{t}</a>)}
          <a href={ZIP} download className="shrink-0 ml-auto inline-flex items-center gap-1.5 rounded-full bg-red text-cream px-4 min-h-10 text-sm font-bold"><Download className="w-4 h-4" />All assets</a>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-red text-cream">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 pt-16 md:pt-20 pb-36 md:pb-52 relative z-10">
          <p className="font-bold text-gold text-sm uppercase tracking-[0.22em]">Brand guidelines · Księga znaku</p>
          <div className="mt-8 text-[clamp(2.6rem,10vw,8rem)]"><Wordmark light place /></div>
          <p className="mt-10 text-[clamp(1.6rem,3.6vw,3rem)] font-display font-extrabold max-w-4xl leading-[1.02]">Prawdziwy smak domu. A real taste of home.</p>
          <p className="mt-4 text-cream/85 max-w-2xl text-lg">Polish and Eastern European groceries, 120 St Mary’s Road, Southampton. For homes, shops and kitchens.</p>
          <a href={ZIP} download className="press mt-8 inline-flex items-center gap-2 rounded-full bg-cream text-red font-bold min-h-14 px-7"><Download className="w-5 h-5" />Download all brand assets (zip)</a>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[30%] opacity-25 [filter:invert(1)]"><Southampton className="w-full h-full" still /></div>
      </header>

      <Chapter id="brand" n="01" title="Brand" intro="Everything comes from what the shop already has: the red sign over the door, the offer posters and the counter.">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 [&>*]:min-w-0">
          <Block label="The logo" note="Exactly as on the shopfront: the red name inside the rounded red frame, with Southampton set into the bottom line. On the website the frame draws itself in as the page opens.">
            <LogoReplay />
            <div className="mt-5 flex flex-wrap gap-2">
              <Get file="logo/nasz-sklep-logo-red-southampton.png" label="PNG, with Southampton" />
              <Get file="logo/nasz-sklep-logo-red.png" label="PNG, name only" />
              <Get file="logo/nasz-sklep-logo-red-southampton.pdf" label="PDF for printers" />
            </div>
          </Block>
          <Block label="Versions">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-red grid place-items-center p-4 min-h-[110px]"><img src={A('logo/nasz-sklep-logo-cream.png')} alt="Cream logo on red" className="w-[85%]" /></div>
              <div className="rounded-2xl bg-ink grid place-items-center p-4 min-h-[110px]"><img src={A('logo/nasz-sklep-logo-cream.png')} alt="Cream logo on ink" className="w-[85%]" /></div>
              <div className="rounded-2xl bg-cream ring-1 ring-ink/10 grid place-items-center p-4 min-h-[110px]"><img src={A('logo/nasz-sklep-logo-red.png')} alt="Red logo on cream" className="w-[85%]" /></div>
              <div className="rounded-2xl bg-paper grid place-items-center p-4 min-h-[110px]"><img src={A('logo/nasz-sklep-icon.svg')} alt="Browser and app icon" className="w-16 h-16" /></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Get file="logo/nasz-sklep-logo-cream.png" label="Cream PNG" />
              <Get file="logo/nasz-sklep-logo-cream-southampton.png" label="Cream, with Southampton" />
              <Get file="logo/nasz-sklep-icon-512.png" label="App icon" />
            </div>
            <p className="mt-4 text-ink/70">Cream on red or ink, red on light. Transparent backgrounds, so they sit on anything.</p>
          </Block>
        </div>
        <div className="grid md:grid-cols-[1fr_2fr] gap-6 [&>*]:min-w-0">
          <Block label="Profile picture" note="For Facebook, Instagram and WhatsApp Business. The whole logo sits inside the circle they crop to.">
            <div className="flex justify-center"><img src={A('social/profile-picture-1080.png')} alt="Profile picture" className="w-full max-w-[240px] aspect-square rounded-full ring-1 ring-ink/10" /></div>
            <div className="mt-5 flex justify-center"><Get file="social/profile-picture-1080.png" /></div>
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
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 [&>*]:min-w-0">
          <Block label="Type" note="Both free from Google Fonts. Big and clear for every customer, with every Polish letter: ą ć ę ł ń ó ś ź ż.">
            <p className="font-display font-extrabold text-[clamp(2.2rem,6vw,4.6rem)] leading-none">Bricolage Grotesque</p>
            <p className="font-display font-extrabold text-[clamp(1.4rem,3vw,1.9rem)] mt-3">Kiełbasa · Żurek · Śledzie · Pączki</p>
            <p className="mt-6 text-xl md:text-2xl">Inter, for prices, buttons and forms.</p>
          </Block>
          <Block label="The price burst" note="From the shop’s own offer posters. Marks every deal, online and on Facebook.">
            <div className="flex items-center justify-center gap-6 py-4">
              <Burst className="w-32 h-32 text-2xl rotate-6">2 za<br />£3</Burst>
              <Burst className="w-24 h-24 text-base -rotate-6">£13.99<br />/kg</Burst>
            </div>
          </Block>
        </div>
        <Block label="Photography" note="Honest phone photos of the counter and shelves from the shop’s Facebook page. Branded products use clean pack shots.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['fb/deli-kabanosy.jpg', 'fb/deli-kielbasa.jpg', 'fb/meat-cuts.jpg', 'fb/veg-cabbage.jpg'].map((s) => <img key={s} src={img(s)} alt="" loading="lazy" className="rounded-2xl aspect-square object-cover w-full" />)}
          </div>
        </Block>
        <Block label="Southampton, drawn by hand" note="An engraved-style drawing of the city: the Bargate, the old walls, the Civic Centre clock tower, the docks, and Nasz Sklep on a St Mary’s terrace. On the website the ships sail across the footer.">
          <div className="rounded-2xl bg-paper overflow-hidden h-[200px] sm:h-[300px] md:h-[380px]"><Southampton className="w-full h-full" /></div>
        </Block>
      </Chapter>

      <Chapter id="social" n="02" title="Social" intro="Static, ready-to-upload images for Facebook, Instagram and LinkedIn. Nothing moves, so every platform accepts them. Polish first, English underneath." tone="bg-paper">
        <Block label="Static banners">
          <div className="grid gap-8">
            <Shot file="social/facebook-cover-1640x624.png" title="Facebook cover" size="1640 × 624 · upload as the page cover photo" />
            <div className="grid md:grid-cols-2 gap-8 [&>*]:min-w-0">
              <Shot file="social/linkedin-personal-banner-1584x396.png" title="LinkedIn banner, personal profile" size="1584 × 396" />
              <Shot file="social/linkedin-company-cover-1128x191.png" title="LinkedIn cover, company page" size="1128 × 191 · left side stays clear for the page logo" />
            </div>
          </div>
        </Block>
        <Block label="Instagram grid banner" note="Three posts that line up into one banner across the top row of the profile. Post 3 first, then 2, then 1.">
          <img src={A('social/instagram-grid-banner-preview.png')} alt="Instagram grid banner preview" loading="lazy" className="w-full rounded-2xl ring-1 ring-ink/10" />
          <div className="mt-5 flex flex-wrap gap-2">
            {[1, 2, 3].map((n) => <Get key={n} file={`social/instagram-grid-banner-${n}-of-3.png`} label={`Part ${n} of 3`} />)}
          </div>
        </Block>
        <Block label="Posts and story">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 [&>*]:min-w-0">
            {posts.map(([f, t]) => <Shot key={f} file={f} title={t} size="1080 × 1350" />)}
            <Shot file="social/story-offer.png" title="Story: offer (template)" size="1080 × 1920" />
          </div>
        </Block>
      </Chapter>

      <Chapter id="desktop" n="03" title="Website: computer" intro="The online shop on a laptop or desktop. Order online, collect from St Mary’s Road; trade customers buy by the case.">
        <div className="grid md:grid-cols-2 gap-8 [&>*]:min-w-0">
          <Shot file="web/desktop-home.png" title="Home" size="1440 × 900" />
          <Shot file="web/desktop-shop.png" title="Shop" size="1440 × 900" />
          <Shot file="web/desktop-product.png" title="Product" size="1440 × 900" />
          <Shot file="web/desktop-trade.png" title="Trade and bulk" size="1440 × 900" />
          <Shot file="web/desktop-request.png" title="Request a product" size="1440 × 900" />
          <Shot file="web/desktop-shop-orders.png" title="The shop’s pick-up orders screen" size="1440 × 900" />
        </div>
      </Chapter>

      <Chapter id="phone" n="04" title="Website: phone" intro="The same shop on a phone: big buttons, a menu bar along the bottom, Polish or English in one tap, and a larger-text option." tone="bg-paper">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 [&>*]:min-w-0">
          {[['web/phone-home.png', 'Home'], ['web/phone-shop.png', 'Shop'], ['web/phone-product.png', 'Product'], ['web/phone-checkout.png', 'Checkout: collect from the shop'], ['web/phone-order-ready.png', 'Order ready to collect'], ['web/phone-trade-account.png', 'Trade account'], ['web/phone-request.png', 'Request a product']].map(([f, t]) => (
            <figure key={f} className="min-w-0">
              <div className="mx-auto w-full max-w-[250px] rounded-[2.2rem] bg-ink p-[7px] shadow-[0_30px_60px_-34px_rgba(0,0,0,.7)]">
                <img src={A(f)} alt={t} loading="lazy" decoding="async" className="block w-full h-auto aspect-[390/844] rounded-[1.8rem] bg-cream" />
              </div>
              <figcaption className="mt-3 flex flex-col items-center gap-2 text-center"><span className="font-semibold leading-tight">{t}</span><Get file={f} /></figcaption>
            </figure>
          ))}
        </div>
        <Block label="The pick-up journey">
          <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[['Order online', 'Pick a collection time. Someone else can collect.'], ['Pay your way', 'Online now, or cash or card at the counter.'], ['We pack it', 'The order appears on the shop’s screen.'], ['Collect', 'A text when it’s ready. Show the 4-digit code.']].map(([h, b], i) => (
              <li key={h} className="rounded-2xl bg-paper p-5"><span className="w-10 h-10 rounded-full bg-red text-cream grid place-items-center font-display font-extrabold">{i + 1}</span><p className="mt-3 font-display font-extrabold text-xl">{h}</p><p className="text-ink/70">{b}</p></li>
            ))}
          </ol>
        </Block>
      </Chapter>

      <Chapter id="ui" n="05" title="Web UI" intro="The building blocks of the site, live. Large tap targets, high contrast and plain words, for customers of every age.">
        <div className="grid md:grid-cols-2 gap-6 [&>*]:min-w-0">
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
            <div className="mt-5 flex flex-wrap items-center gap-4"><Stepper qty={2} label="demo" dec={() => undefined} inc={() => undefined} /><span className="inline-flex items-center gap-1.5 rounded-full min-h-12 px-4 font-bold bg-red text-cream"><Plus className="w-5 h-5" />Add</span></div>
          </Block>
        </div>
        <Block label="Product cards" note="The same card everywhere: photo, Polish and English name, size, price and one big Add button. Offers get the red burst; meat and deli are priced by the kilo.">
          <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="flex lg:grid lg:grid-cols-4 gap-3 md:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar rounded-[1.6rem] bg-paper p-3 md:p-5">
            {cards.map((p) => <ProductCard key={p.id} p={p} className="w-[62vw] max-w-[250px] shrink-0 snap-start lg:w-auto lg:max-w-none" />)}
          </motion.ul>
        </Block>
        <div className="grid md:grid-cols-2 gap-6 [&>*]:min-w-0">
          <Block label="Labels">
            <p className="text-sm font-semibold text-ink/55">On orders</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {[['Paid online', 'bg-leaf text-cream'], ['Take £8.98', 'bg-gold text-ink'], ['Trade', 'bg-ink text-cream'], ['Coming soon', 'bg-gold text-ink']].map(([l, c]) => (
                <span key={l} className={`inline-flex items-center min-h-8 rounded-full px-3 text-sm font-bold leading-none ${c}`}>{l}</span>
              ))}
            </div>
            <p className="mt-5 text-sm font-semibold text-ink/55">Shop filters</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center min-h-12 rounded-full px-5 font-semibold border-2 border-red bg-red text-cream">Everything</span>
              <span className="inline-flex items-center min-h-12 rounded-full px-5 font-semibold border-2 border-ink/15 bg-white">Smoked meats</span>
            </div>
          </Block>
          <Block label="Form field">
            <label className="grid gap-2 font-semibold max-w-md">Your mobile<input className={field} defaultValue="07700 900123" /></label>
            <p className="mt-4 text-ink/70">Big labels above every box, never inside it, so they stay readable while typing.</p>
          </Block>
          <Block label="Order progress" note="The customer sees this on their order page. The shop moves each order along from its own screen, and a text goes out when it is ready.">
            <ol className="grid grid-cols-4 gap-2">
              {['Received', 'Being packed', 'Ready to collect', 'Collected'].map((s, i) => (
                <li key={s} className="text-center"><span className={`mx-auto w-11 h-11 rounded-full grid place-items-center ${i <= 2 ? 'bg-red text-cream' : 'bg-white ring-1 ring-ink/15 text-ink/40'}`}><Check className="w-5 h-5" /></span><span className={`mt-2 block text-xs sm:text-sm font-bold leading-tight ${i <= 2 ? 'text-red' : 'text-ink/45'}`}>{s}</span></li>
              ))}
            </ol>
          </Block>
          <Block label="Motion" note="Everything stops for people who turn motion off on their phone.">
            <div className="grid gap-2">
              {[['Logo frame draws in', '1.3 s, once'], ['Headline changes', 'every 5 s'], ['Sections rise into place', '0.7 s']].map(([a, b]) => (
                <div key={a} className="flex items-center justify-between gap-4 rounded-2xl bg-paper px-5 min-h-14"><span className="font-semibold whitespace-nowrap">{a}</span><span className="text-sm text-ink/60 whitespace-nowrap">{b}</span></div>
              ))}
            </div>
          </Block>
        </div>
      </Chapter>

      <footer className="bg-red text-cream py-14 text-center px-5">
        <Wordmark className="text-3xl" light draw={false} />
        <p className="mt-6"><Get file="nasz-sklep-brand-assets.zip" label="Download all brand assets (zip)" light /></p>
        <p className="mt-6 text-sm text-cream/75">Prepared by Revti for Nasz Sklep (Southampton) Limited. Prices and products shown are examples.</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><StoreProvider><Board /></StoreProvider></StrictMode>);
