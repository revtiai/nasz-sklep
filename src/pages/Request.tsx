import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, CheckCircle2, Clock, PackageCheck, Search } from 'lucide-react';
import { useStore } from '../store.tsx';
import { btn, field, useT } from '../ui.tsx';
import { PageHead } from './parts.tsx';

export function RequestStatus({ status }: { status: 'received' | 'sourcing' | 'in-stock' }) {
  const t = useT();
  const steps = [
    ['received', t('Received', 'Przyjęte'), Clock],
    ['sourcing', t('Finding it', 'Szukamy'), Search],
    ['in-stock', t('On the shelf', 'Na półce'), PackageCheck],
  ] as const;
  const at = steps.findIndex(([s]) => s === status);
  return (
    <ol className="flex gap-1.5" aria-label={t('Request progress', 'Postęp')}>
      {steps.map(([s, label, Icon], i) => (
        <li key={s} className={`flex-1 rounded-xl px-2 py-2 text-center text-[0.8rem] font-bold ${i <= at ? (i === at ? 'bg-red text-cream' : 'bg-red/15 text-red') : 'bg-ink/5 text-ink/45'}`}>
          <Icon className="w-4 h-4 mx-auto mb-0.5" aria-hidden="true" />{label}
        </li>
      ))}
    </ol>
  );
}

export default function RequestPage() {
  const t = useT();
  const { addRequest, requests, account, say } = useStore();
  const [photo, setPhoto] = useState<string | undefined>();
  const [done, setDone] = useState<string | null>(null);
  const [product, setProduct] = useState('');
  const popular = ['Ogórki kiszone z beczki', 'Twaróg Piątnica', 'Kiszona kapusta', 'Pierogi ruskie', 'Kwas chlebowy', 'Barszcz Krakus', 'Chleb żytni', 'Śledzie w oleju'];
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = addRequest({ product: String(f.get('product')), brand: String(f.get('brand') || ''), qty: String(f.get('qty') || ''), how: String(f.get('how')), photo });
    setDone(r.id);
    say(t('Request sent. We’ll let you know.', 'Prośba wysłana. Damy znać.'));
    e.currentTarget.reset();
    setProduct('');
    setPhoto(undefined);
  };
  const how = [
    [Search, t('Tell us what you need', 'Napisz, czego szukasz'), t('Name, brand, how many. A photo helps.', 'Nazwa, marka, ilość. Zdjęcie pomaga.')],
    [Clock, t('We find a supplier', 'Szukamy dostawcy'), t('We check with our wholesalers in the UK and Poland.', 'Sprawdzamy u hurtowników w UK i w Polsce.')],
    [PackageCheck, t('We tell you it’s in', 'Dajemy znać'), t('Collect it, or add it to your regular order.', 'Odbierz lub dodaj do stałego zamówienia.')],
  ] as const;
  return (
    <>
      <PageHead eyebrow={t('Request a product', 'Zamów produkt')} title={t('Can’t find it? We’ll order it in.', 'Nie ma? Sprowadzimy.')} body={t('For one jar or fifty cases. Tell us what you need and we’ll come back to you.', 'Jeden słoik czy pięćdziesiąt kartonów. Napisz, czego potrzebujesz, odezwiemy się.')} />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ol className="grid md:grid-cols-3 gap-4">
          {how.map(([Icon, h, b], i) => (
            <motion.li key={h} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.6 }} className="relative rounded-[1.6rem] bg-white p-5 flex gap-4 items-start">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 260, damping: 15 }} className="shrink-0 w-12 h-12 rounded-2xl bg-gold grid place-items-center"><Icon className="w-6 h-6" aria-hidden="true" /></motion.span>
              <span><span className="block text-sm font-bold text-red">{i + 1}</span><span className="block font-display font-extrabold text-xl leading-tight">{h}</span><span className="text-ink/65">{b}</span></span>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-10 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
        <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 md:p-8 grid gap-5">
          <div>
            <p className="font-semibold text-[1.05rem]">{t('Popular requests', 'Często zamawiane')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popular.map((x) => (
                <button type="button" key={x} onClick={() => setProduct(x)} aria-pressed={product === x} className={`press rounded-full px-4 min-h-11 font-semibold border-2 ${product === x ? 'bg-red text-cream border-red' : 'bg-cream border-ink/10'}`}>{x}</button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 font-semibold text-[1.05rem]">{t('What product?', 'Jaki produkt?')}<input name="product" required value={product} onChange={(e) => setProduct(e.target.value)} placeholder={t('e.g. Ogórki kiszone in a barrel', 'np. ogórki kiszone z beczki')} className={field} /></label>
          <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Brand, if it matters', 'Marka (jeśli ważna)')}<input name="brand" className={field} /></label>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="grid gap-2 font-semibold text-[1.05rem]">{t('How many?', 'Ile?')}<input name="qty" placeholder={t('e.g. 2 cases', 'np. 2 kartony')} className={field} /></label>
            <label className="grid gap-2 font-semibold text-[1.05rem]">{t('How often?', 'Jak często?')}
              <select name="how" className={field} defaultValue="Once">
                <option value="Once">{t('Just once', 'Jednorazowo')}</option>
                <option value="Weekly">{t('Every week', 'Co tydzień')}</option>
                <option value="Fortnightly">{t('Every two weeks', 'Co dwa tygodnie')}</option>
                <option value="Monthly">{t('Every month', 'Co miesiąc')}</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 font-semibold text-[1.05rem]">
            {t('Photo of the packet (optional)', 'Zdjęcie opakowania (opcjonalnie)')}
            <span className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-ink/25 p-4 cursor-pointer hover:border-red transition-colors">
              {photo ? <motion.img initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={photo} alt="" className="w-20 h-20 rounded-xl object-cover" /> : <span className="w-20 h-20 rounded-xl bg-paper grid place-items-center"><Camera className="w-8 h-8 text-ink/50" /></span>}
              <span className="font-normal text-ink/70">{t('Take a photo or choose one', 'Zrób zdjęcie lub wybierz')}</span>
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const r = new FileReader();
                r.onload = () => setPhoto(String(r.result));
                r.readAsDataURL(file);
              }} />
            </span>
          </label>
          {!account && <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Phone or email, so we can tell you', 'Telefon lub email, abyśmy dali znać')}<input name="contact" required className={field} /></label>}
          <button className={btn.red}>{t('Send request', 'Wyślij prośbę')}</button>
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-leaf text-cream p-4 flex items-center gap-3">
                <motion.span initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}><CheckCircle2 className="w-8 h-8" /></motion.span>
                <span className="font-bold">{t(`Request ${done} received. We’ll be in touch.`, `Prośba ${done} przyjęta. Odezwiemy się.`)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        <aside className="lg:sticky lg:top-28">
          <h2 className="text-2xl font-extrabold">{t('Your requests', 'Twoje prośby')}</h2>
          {requests.length === 0 ? (
            <p className="mt-3 text-ink/65 text-lg">{t('Nothing yet. Requests you send appear here so you can follow them.', 'Na razie nic. Wysłane prośby pojawią się tutaj.')}</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              <AnimatePresence initial={false}>
                {requests.map((r) => (
                  <motion.li key={r.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="rounded-[1.6rem] bg-white p-5">
                    <div className="flex justify-between gap-3"><p className="font-display font-extrabold text-xl leading-tight">{r.product}</p><span className="text-sm text-ink/50 shrink-0">{r.id}</span></div>
                    <p className="text-ink/65 mt-1">{[r.brand, r.qty, r.how].filter(Boolean).join(' · ')}</p>
                    <div className="mt-3"><RequestStatus status={r.status} /></div>
                    {r.note && <p className="mt-3 text-[0.95rem] text-leaf font-semibold">{r.note}</p>}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </aside>
      </div>
    </>
  );
}
