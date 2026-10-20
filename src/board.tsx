import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import './index.css';
import { FolkFlower, Logo, ProductArt, Wycinanka, type ArtKind } from './art.tsx';

const base = import.meta.env.BASE_URL;
const COLOURS = [
  ['Czerwień', 'Shop red', '#D6232A', 'Logo, buttons, the trade band', 'text-cream'],
  ['Krem', 'Cream', '#FFF8EE', 'Page background', 'text-ink'],
  ['Atrament', 'Ink', '#1F1A17', 'Text, outlines, trade mode', 'text-cream'],
  ['Musztarda', 'Mustard', '#F2B33D', 'Highlights, best sellers', 'text-ink'],
  ['Liść', 'Leaf', '#2E7D4F', 'New in, ticks', 'text-cream'],
  ['Błękit', 'Folk blue', '#2C5AA0', 'Chilled and frozen', 'text-cream'],
] as const;
const ART: ArtKind[] = ['sausage', 'kabanos', 'ham', 'cheese', 'milk', 'bread', 'dumplings', 'pickles', 'jar', 'soup', 'sweets', 'gingerbread', 'bottle', 'sack', 'cake', 'fish'];
const BG = ['#F6C9C4', '#DCE6F5', '#F7E1B8', '#E3EEF2', '#DDEEDB', '#FBE3C9', '#F1DCCB', '#F2E8D2'];

function Card({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[2rem] border-2 border-ink bg-white p-6 md:p-8 ${className}`}>
      <p className="font-display font-bold text-red text-xs uppercase tracking-[0.2em] mb-4">{title}</p>
      {children}
    </section>
  );
}

function Board() {
  return (
    <div className="min-h-screen bg-paper p-4 md:p-10">
      <div className="max-w-[1400px] mx-auto grid gap-5">
        <header className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-red text-cream p-8 md:p-14">
          <Wycinanka className="absolute -right-20 -top-20 w-[26rem] h-[26rem] opacity-90" colour="#A8141B" accent="#F2B33D" leaf="#2E7D4F" />
          <div className="relative">
            <p className="font-display font-bold text-mustard text-sm uppercase tracking-[0.2em]">Brand board · draft for review</p>
            <div className="mt-6 text-[clamp(2.4rem,7vw,5.5rem)]"><Logo invert /></div>
            <p className="mt-6 text-2xl md:text-4xl font-display font-extrabold max-w-3xl leading-tight">A taste of home, by the jar or by the case.</p>
            <p className="mt-3 text-cream/80 max-w-2xl">Polish and Eastern European groceries, St Mary’s Road, Southampton. Retail and trade.</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          <Card title="Logo" className="md:col-span-2">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-cream border-2 border-ink grid place-items-center p-8 text-3xl"><Logo /></div>
              <div className="rounded-2xl bg-red border-2 border-ink grid place-items-center p-8 text-3xl"><Logo invert /></div>
              <div className="rounded-2xl bg-ink border-2 border-ink grid place-items-center p-8"><span className="w-24 h-24 rounded-[1.6rem] bg-red grid place-items-center"><FolkFlower className="w-16 h-16" colour="#FFF8EE" /></span></div>
            </div>
            <p className="mt-4 text-ink/70 text-[15px]">The shop sign, kept and tidied: the same red plaque and name, with a folk flower added. The flower on its own is the app icon and favicon.</p>
          </Card>
          <Card title="Pattern">
            <div className="grid grid-cols-2 gap-3">
              <Wycinanka className="w-full" />
              <Wycinanka className="w-full" colour="#1F1A17" accent="#D6232A" leaf="#F2B33D" />
            </div>
            <p className="mt-4 text-ink/70 text-[15px]">Wycinanki, Polish paper-cut art. A warm nod to home that also feels fresh.</p>
          </Card>
        </div>

        <Card title="Colour">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {COLOURS.map(([pl, en, hex, use, txt]) => (
              <div key={hex} className={`rounded-2xl border-2 border-ink p-4 min-h-40 flex flex-col ${txt}`} style={{ background: hex }}>
                <p className="font-display font-extrabold text-xl">{pl}</p>
                <p className="text-sm opacity-80">{en}</p>
                <p className="mt-auto font-mono text-sm">{hex}</p>
                <p className="text-xs opacity-75">{use}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-5">
          <Card title="Type">
            <p className="font-display font-extrabold text-6xl leading-none">Bricolage Grotesque</p>
            <p className="font-display font-extrabold text-4xl mt-3">Pierogi ruskie · Śledzie · Żurek</p>
            <p className="mt-6 text-2xl">Inter for everything else: prices, labels, forms.</p>
            <p className="mt-2 text-ink/70">Both are free, read clearly at any size and carry every Polish letter: ą ć ę ł ń ó ś ź ż.</p>
          </Card>
          <Card title="Buttons and labels">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="rounded-full bg-red text-cream font-bold text-lg px-7 py-4 sticker-lg">Shop the range</span>
              <span className="rounded-full bg-white font-bold text-lg px-7 py-4 sticker-lg">Open a trade account</span>
              <span className="rounded-full bg-ink text-cream font-bold px-5 py-3">Add case</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="rounded-full px-3 py-1 text-sm font-bold border-2 border-ink bg-mustard">Best seller</span>
              <span className="rounded-full px-3 py-1 text-sm font-bold border-2 border-ink bg-leaf text-cream">New in</span>
              <span className="rounded-full px-3 py-1 text-sm font-bold border-2 border-ink bg-sky text-cream">Chilled</span>
              <span className="rounded-full px-3 py-1 text-sm font-bold border-2 border-ink bg-ink text-cream">Trade</span>
            </div>
            <p className="mt-6 text-ink/70 text-[15px]">Big, round, high-contrast buttons with a thick outline, easy to see and tap for every customer.</p>
          </Card>
        </div>

        <Card title="Illustration set">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {ART.map((a, i) => <div key={a}><ProductArt kind={a} bg={BG[i % BG.length]} /></div>)}
          </div>
          <p className="mt-4 text-ink/70 text-[15px]">Sticker-style drawings for the aisles and placeholders. Real product photos, taken on a phone in the shop, replace them product by product.</p>
        </Card>

        <Card title="The storefront">
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-4 items-start">
            <img src={`${base}board/d-0.png`} alt="Desktop home page" className="rounded-2xl border-2 border-ink w-full" />
            <img src={`${base}board/m-1.png`} alt="Phone shop page" className="rounded-2xl border-2 border-ink w-full" />
            <img src={`${base}board/m-5.png`} alt="Phone basket with a trade case" className="rounded-2xl border-2 border-ink w-full" />
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-5">
          <Card title="How it sounds">
            <ul className="grid gap-3 text-lg">
              <li><b>Warm, like the counter.</b> “Come and say cześć.”</li>
              <li><b>Plain English first,</b> Polish product names always shown.</li>
              <li><b>Clear for trade.</b> Case sizes and per-item prices side by side.</li>
              <li><b>No jargon.</b> Short sentences, big text.</li>
            </ul>
          </Card>
          <Card title="Built on Shopify">
            <ul className="grid gap-3 text-lg">
              <li>Add a product from a phone photo in under a minute.</li>
              <li>Retail price and trade case price on every product.</li>
              <li>Card, Apple Pay and Google Pay checkout.</li>
              <li>Click and collect from St Mary’s Road, delivery when wanted.</li>
            </ul>
          </Card>
        </div>
        <p className="text-center text-xs text-ink/55 py-4">Draft by Revti for Nasz Sklep (Southampton) Limited. Products, prices and wording are examples for review.</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Board /></StrictMode>);
