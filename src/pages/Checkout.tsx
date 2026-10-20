import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Store, Truck, Building2 } from 'lucide-react';
import { gbp, product, unitPrice, useStore } from '../store.tsx';
import { ProductImage, btn, field, useT } from '../ui.tsx';
import { PageHead } from './parts.tsx';
import { SHOP } from '../data.ts';

const AREAS = ['SO14', 'SO15', 'SO16', 'SO17', 'SO18', 'SO19'];

function nextDays(n: number, lang: string) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) };
  });
}

export default function Checkout() {
  const t = useT();
  const { lines, total, lang, account, updateAccount, clear } = useStore();
  const [method, setMethod] = useState<'collect' | 'delivery' | 'trade'>(account ? 'trade' : 'collect');
  const [day, setDay] = useState('');
  const [slot, setSlot] = useState('');
  const [postcode, setPostcode] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const area = postcode.trim().toUpperCase().split(' ')[0];
  const inArea = AREAS.includes(area);
  const fee = method === 'delivery' ? (total >= 40 ? 0 : 3.5) : method === 'trade' ? (total >= 150 ? 0 : 10) : 0;
  const days = nextDays(6, lang);
  const slots = ['9:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00'];

  const place = (e: FormEvent) => {
    e.preventDefault();
    const id = `NS-${10500 + Math.floor(Math.random() * 400)}`;
    if (account) updateAccount((a) => ({ ...a, orders: [{ id, date: new Date().toISOString().slice(0, 10), items: lines.map((l) => ({ ...l })), total: total + fee, method: method === 'collect' ? 'Collect from the shop' : 'Delivery', status: 'Received' }, ...a.orders] }));
    clear();
    setDone(id);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}><CheckCircle2 className="w-20 h-20 text-leaf mx-auto" /></motion.div>
        <h1 className="mt-5 text-4xl font-extrabold">{t('Thank you. Dziękujemy!', 'Dziękujemy!')}</h1>
        <p className="mt-3 text-lg text-ink/70">{t(`Order ${done} is in. This is a demo, so no payment was taken. On the live shop you’d pay securely by card, Apple Pay or Google Pay, and get a text and email.`, `Zamówienie ${done} przyjęte. To demo, więc nic nie pobrano. W prawdziwym sklepie zapłacisz kartą, Apple Pay lub Google Pay i dostaniesz SMS i email.`)}</p>
        <a href={account ? '#/account' : '#/'} className={`${btn.red} mt-8`}>{account ? t('See my orders', 'Moje zamówienia') : t('Back to the shop', 'Wróć do sklepu')}</a>
      </div>
    );
  }

  return (
    <>
      <PageHead eyebrow={t('Checkout', 'Zamówienie')} title={t('Collection or delivery?', 'Odbiór czy dostawa?')} />
      <form onSubmit={place} className="max-w-7xl mx-auto px-4 md:px-8 pb-20 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        <div className="grid gap-6">
          <fieldset className="grid sm:grid-cols-3 gap-3">
            <legend className="sr-only">{t('How would you like it?', 'Sposób odbioru')}</legend>
            {([
              ['collect', Store, t('Collect from the shop', 'Odbiór w sklepie'), t('Free · ready in 2 hours', 'Za darmo · gotowe w 2 godziny')],
              ['delivery', Truck, t('Home delivery', 'Dostawa do domu'), t('Free over £40 · Southampton', 'Za darmo od £40 · Southampton')],
              ['trade', Building2, t('Trade delivery', 'Dostawa hurtowa'), t('Free over £150 · your delivery day', 'Za darmo od £150 · Twój dzień')],
            ] as const).map(([id, Icon, h, b]) => (
              <label key={id} className={`press cursor-pointer rounded-[1.6rem] p-5 border-2 ${method === id ? 'border-red bg-red/5' : 'border-ink/15 bg-white'} ${id === 'trade' && !account ? 'opacity-50 pointer-events-none' : ''}`}>
                <input type="radio" name="method" className="sr-only" checked={method === id} onChange={() => setMethod(id)} disabled={id === 'trade' && !account} />
                <Icon className="w-8 h-8 text-red" aria-hidden="true" />
                <p className="mt-3 font-display font-extrabold text-xl leading-tight">{h}</p>
                <p className="text-[0.95rem] text-ink/65 mt-1">{id === 'trade' && !account ? t('Trade accounts only', 'Tylko konta hurtowe') : b}</p>
              </label>
            ))}
          </fieldset>

          {method === 'delivery' && (
            <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Your postcode', 'Kod pocztowy')}
              <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="SO14 0BL" autoComplete="postal-code" className={field} required />
              {postcode.length >= 3 && <span className={`font-bold ${inArea ? 'text-leaf' : 'text-red'}`}>{inArea ? t('Great, we deliver to you.', 'Super, dowozimy do Ciebie.') : t('Sorry, that’s outside our delivery area for now. You can still collect.', 'Niestety, poza obszarem dostaw. Możesz odebrać w sklepie.')}</span>}
            </label>
          )}

          <div>
            <p className="font-semibold text-[1.05rem] mb-3">{method === 'collect' ? t('When will you collect?', 'Kiedy odbierzesz?') : t('Which day?', 'Który dzień?')}</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {days.map((d) => (
                <button type="button" key={d.key} onClick={() => setDay(d.key)} aria-pressed={day === d.key} className={`press shrink-0 rounded-2xl px-5 min-h-16 font-bold border-2 ${day === d.key ? 'bg-ink text-cream border-ink' : 'bg-white border-ink/15'}`}>{d.label}</button>
              ))}
            </div>
            {day && method !== 'trade' && (
              <div className="mt-3 flex flex-wrap gap-2">
                {slots.map((s) => <button type="button" key={s} onClick={() => setSlot(s)} aria-pressed={slot === s} className={`press rounded-full px-5 min-h-12 font-semibold border-2 ${slot === s ? 'bg-red text-cream border-red' : 'bg-white border-ink/15'}`}>{s}</button>)}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Name', 'Imię i nazwisko')}<input required autoComplete="name" defaultValue={account?.business.split(' (')[0]} className={field} /></label>
            <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Mobile number', 'Telefon komórkowy')}<input required type="tel" inputMode="tel" autoComplete="tel" className={field} /></label>
          </div>
          {method !== 'collect' && <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Delivery address', 'Adres dostawy')}<input required autoComplete="street-address" className={field} /></label>}
          <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Anything we should know? (optional)', 'Uwagi (opcjonalnie)')}<textarea rows={3} className={`${field} py-3`} placeholder={t('e.g. slice the kiełbasa thinly', 'np. pokroić kiełbasę cienko')} /></label>
        </div>

        <aside className="lg:sticky lg:top-28 rounded-[2rem] bg-white p-6 md:p-7">
          <h2 className="text-2xl font-extrabold">{t('Your order', 'Twoje zamówienie')}</h2>
          {lines.length === 0 ? <p className="mt-3 text-ink/65">{t('Your basket is empty.', 'Koszyk jest pusty.')} <a href="#/shop" className="text-red font-bold underline">{t('Go shopping', 'Do sklepu')}</a></p> : (
            <ul className="mt-4 grid gap-3">
              {lines.map((l) => { const p = product(l.id); return (
                <li key={`${l.id}${l.trade}`} className="flex items-center gap-3"><ProductImage p={p} className="w-12 h-12 rounded-xl shrink-0" /><span className="flex-1 font-semibold leading-tight">{l.qty} × {lang === 'pl' ? p.pl : p.en}{l.trade && <span className="text-ink/50"> ({t('case', 'karton')})</span>}</span><span className="font-bold">{gbp(l.qty * unitPrice(p, l.trade))}</span></li>
              ); })}
            </ul>
          )}
          <dl className="mt-5 border-t-2 border-ink/10 pt-4 grid grid-cols-2 gap-y-1.5 text-[1.05rem]">
            <dt>{t('Items', 'Produkty')}</dt><dd className="text-right">{gbp(total)}</dd>
            <dt>{method === 'collect' ? t('Collection', 'Odbiór') : t('Delivery', 'Dostawa')}</dt><dd className="text-right">{fee ? gbp(fee) : t('Free', 'Za darmo')}</dd>
            <dt className="font-display font-extrabold text-2xl mt-2">{t('Total', 'Razem')}</dt><dd className="text-right font-display font-extrabold text-2xl mt-2">{gbp(total + fee)}</dd>
          </dl>
          <button disabled={lines.length === 0 || !day || (method === 'delivery' && !inArea)} className={`${btn.red} w-full mt-5 disabled:opacity-40 disabled:pointer-events-none`}>{t('Place order', 'Złóż zamówienie')}</button>
          <p className="mt-3 text-sm text-ink/55">{t(`Demo checkout. Delivery areas, fees and times are examples to agree with ${SHOP.name}.`, `Kasa demo. Obszary, opłaty i godziny do uzgodnienia z ${SHOP.name}.`)}</p>
        </aside>
      </form>
    </>
  );
}
