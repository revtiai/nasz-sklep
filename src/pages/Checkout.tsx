import { useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Banknote, Building2, CreditCard, Store, Truck, UserRound, Users } from 'lucide-react';
import { gbp, product, unitPrice, useStore } from '../store.tsx';
import { ProductImage, btn, field, useT } from '../ui.tsx';
import { PageHead } from './parts.tsx';
import { SHOP } from '../data.ts';

function nextDays(n: number, lang: string) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? (lang === 'pl' ? 'Dziś' : 'Today') : i === 1 ? (lang === 'pl' ? 'Jutro' : 'Tomorrow') : d.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return { key: d.toISOString().slice(0, 10), label, today: i === 0 };
  });
}

function slotsFor(today: boolean) {
  const all = ['9:00–10:00', '10:00–11:00', '11:00–12:00', '12:00–13:00', '13:00–14:00', '14:00–15:00', '15:00–16:00', '16:00–17:00', '17:00–18:00', '18:00–19:00', '19:00–20:00'];
  if (!today) return all;
  const earliest = new Date().getHours() + 2;
  return all.filter((s) => Number(s.split(':')[0]) >= earliest);
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.06 }} className="rounded-[1.8rem] bg-white p-5 md:p-7 min-w-0">
      <h2 className="flex items-center gap-3 text-xl md:text-2xl font-extrabold"><span className="w-9 h-9 rounded-full bg-red text-cream grid place-items-center text-base">{n}</span>{title}</h2>
      <div className="mt-4">{children}</div>
    </motion.section>
  );
}

function Choice({ on, set, icon: Icon, title, body, disabled = false, badge }: { on: boolean; set: () => void; icon: typeof Store; title: string; body: string; disabled?: boolean; badge?: string }) {
  return (
    <label className={`relative press cursor-pointer rounded-2xl p-4 border-2 flex gap-3 items-start ${on ? 'border-red bg-red/5' : 'border-ink/15 bg-cream/40'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <input type="radio" className="sr-only" checked={on} onChange={set} disabled={disabled} />
      <Icon className="w-7 h-7 text-red shrink-0 mt-0.5" aria-hidden="true" />
      <span className="min-w-0"><span className="block font-display font-extrabold text-lg leading-tight">{title}{badge && <span className="ml-2 align-middle inline-block rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold font-sans">{badge}</span>}</span><span className="text-[0.95rem] text-ink/65">{body}</span></span>
    </label>
  );
}

export default function Checkout() {
  const t = useT();
  const { lines, total, lang, account, clear, placeOrder } = useStore();
  const [method, setMethod] = useState<'collect' | 'trade'>('collect');
  const days = nextDays(7, lang);
  const [day, setDay] = useState(days[0].key);
  const today = days.find((d) => d.key === day)?.today ?? false;
  const slots = slotsFor(today);
  const [slot, setSlot] = useState('');
  const [someoneElse, setSomeoneElse] = useState(false);
  const [pay, setPay] = useState<'online' | 'in-store'>('in-store');

  const place = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const dayLabel = days.find((d) => d.key === day)?.label ?? day;
    const order = placeOrder({
      lines: lines.map((l) => ({ ...l })), total, method,
      when: method === 'trade' ? t('Delivery day to agree', 'Dzień dostawy do uzgodnienia') : `${dayLabel}, ${slot}`,
      collector: someoneElse ? `${f.get('collectorName')} (${t('for', 'dla')} ${f.get('name')})` : String(f.get('name')),
      phone: String(f.get(someoneElse ? 'collectorPhone' : 'phone') || f.get('phone')),
      forSomeoneElse: someoneElse, pay, paid: pay === 'online', note: String(f.get('note') || ''), trade: lines.some((l) => l.trade), business: account?.business,
    });
    clear();
    window.location.hash = `/order/${order.id}`;
  };

  if (lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">{t('Your basket is empty.', 'Koszyk jest pusty.')}</h1>
        <a href="#/shop" className={`${btn.red} mt-6`}>{t('Start shopping', 'Zacznij zakupy')}</a>
      </div>
    );
  }

  const ready = method === 'trade' || !!slot;
  return (
    <>
      <PageHead eyebrow={t('Checkout', 'Zamówienie')} title={t('Order now, collect from the shop.', 'Zamów teraz, odbierz w sklepie.')} body={t('We pack your order and have it ready at the counter. Pay online now, or pay when you collect.', 'Spakujemy zamówienie i przygotujemy je przy ladzie. Zapłać online teraz albo przy odbiorze.')} />
      <form onSubmit={place} className="max-w-7xl mx-auto px-4 md:px-8 pb-20 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8 items-start">
        <div className="grid gap-5 min-w-0">
          <Step n={1} title={t('How would you like it?', 'Jak chcesz odebrać?')}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Choice on={method === 'collect'} set={() => setMethod('collect')} icon={Store} title={t('Collect from the shop', 'Odbiór w sklepie')} body={`${SHOP.street}. ${t('Free. Ready in about 2 hours.', 'Za darmo. Gotowe w około 2 godziny.')}`} />
              <Choice on={false} set={() => undefined} icon={Truck} title={t('Home delivery', 'Dostawa do domu')} body={t('We’re working on it.', 'Pracujemy nad tym.')} disabled badge={t('Coming soon', 'Wkrótce')} />
              {account && <Choice on={method === 'trade'} set={() => setMethod('trade')} icon={Building2} title={t('Trade delivery', 'Dostawa hurtowa')} body={t('For trade accounts, on a day we agree.', 'Dla kont hurtowych, w uzgodniony dzień.')} />}
            </div>
          </Step>

          {method === 'collect' && (
            <Step n={2} title={t('When will it be collected?', 'Kiedy odbiór?')}>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {days.map((d) => (
                  <button type="button" key={d.key} onClick={() => { setDay(d.key); setSlot(''); }} aria-pressed={day === d.key} className={`press shrink-0 rounded-2xl px-5 min-h-14 font-bold border-2 ${day === d.key ? 'bg-ink text-cream border-ink' : 'bg-white border-ink/15'}`}>{d.label}</button>
                ))}
              </div>
              {slots.length === 0 ? (
                <p className="mt-3 text-ink/65">{t('Too late for today. Pick another day.', 'Za późno na dziś. Wybierz inny dzień.')}</p>
              ) : (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slots.map((s) => <button type="button" key={s} onClick={() => setSlot(s)} aria-pressed={slot === s} className={`press rounded-xl min-h-12 font-semibold border-2 ${slot === s ? 'bg-red text-cream border-red' : 'bg-white border-ink/15'}`}>{s}</button>)}
                </div>
              )}
              <p className="mt-3 text-sm text-ink/55">{t('Collection times are examples; the shop sets its own hours.', 'Godziny odbioru są przykładowe; sklep ustali własne.')}</p>
            </Step>
          )}

          <Step n={method === 'collect' ? 3 : 2} title={t('Who is collecting?', 'Kto odbierze?')}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Choice on={!someoneElse} set={() => setSomeoneElse(false)} icon={UserRound} title={t('I’ll collect it', 'Odbiorę sam(a)')} body={t('Just bring your order number.', 'Wystarczy numer zamówienia.')} />
              <Choice on={someoneElse} set={() => setSomeoneElse(true)} icon={Users} title={t('Someone else will', 'Odbierze ktoś inny')} body={t('Ordering for family or a neighbour? Tell us who.', 'Zamawiasz dla rodziny lub sąsiada? Podaj kto.')} />
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <label className="grid gap-2 font-semibold">{t('Your name', 'Twoje imię i nazwisko')}<input name="name" required autoComplete="name" defaultValue={account?.business.split(' (')[0]} className={field} /></label>
              <label className="grid gap-2 font-semibold">{t('Your mobile', 'Twój telefon')}<input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className={field} /></label>
              {someoneElse && (
                <>
                  <label className="grid gap-2 font-semibold">{t('Name of the person collecting', 'Imię osoby odbierającej')}<input name="collectorName" required className={field} /></label>
                  <label className="grid gap-2 font-semibold">{t('Their mobile (optional)', 'Jej/jego telefon (opcjonalnie)')}<input name="collectorPhone" type="tel" inputMode="tel" className={field} /></label>
                </>
              )}
            </div>
            <p className="mt-3 text-sm text-ink/60">{t('We text you when it’s packed and ready.', 'Wyślemy SMS, gdy zamówienie będzie gotowe.')}</p>
          </Step>

          <Step n={method === 'collect' ? 4 : 3} title={t('How would you like to pay?', 'Jak chcesz zapłacić?')}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Choice on={pay === 'in-store'} set={() => setPay('in-store')} icon={Banknote} title={t('Pay when collecting', 'Zapłać przy odbiorze')} body={t('Cash or card at the counter.', 'Gotówką lub kartą przy ladzie.')} />
              <Choice on={pay === 'online'} set={() => setPay('online')} icon={CreditCard} title={t('Pay online now', 'Zapłać online teraz')} body={t('Card, Apple Pay or Google Pay. Good if someone else is collecting.', 'Karta, Apple Pay lub Google Pay. Wygodne, gdy odbiera ktoś inny.')} />
            </div>
            <label className="mt-4 grid gap-2 font-semibold">{t('Anything we should know? (optional)', 'Uwagi (opcjonalnie)')}<textarea name="note" rows={2} className={`${field} py-3`} placeholder={t('e.g. slice the kiełbasa thinly', 'np. pokroić kiełbasę cienko')} /></label>
          </Step>
        </div>

        <aside className="lg:sticky lg:top-28 rounded-[2rem] bg-white p-6 md:p-7 min-w-0">
          <h2 className="text-2xl font-extrabold">{t('Your order', 'Twoje zamówienie')}</h2>
          <ul className="mt-4 grid gap-3">
            {lines.map((l) => { const p = product(l.id); return (
              <li key={`${l.id}${l.trade}`} className="flex items-center gap-3"><ProductImage p={p} className="w-12 h-12 rounded-xl shrink-0" /><span className="flex-1 font-semibold leading-tight">{l.qty} × {lang === 'pl' ? p.pl : p.en}{l.trade && <span className="text-ink/50"> ({t('case', 'karton')})</span>}</span><span className="font-bold">{gbp(l.qty * unitPrice(p, l.trade))}</span></li>
            ); })}
          </ul>
          <dl className="mt-5 border-t-2 border-ink/10 pt-4 grid grid-cols-2 gap-y-1.5 text-[1.05rem]">
            <dt>{t('Items', 'Produkty')}</dt><dd className="text-right">{gbp(total)}</dd>
            <dt>{method === 'collect' ? t('Collection', 'Odbiór') : t('Trade delivery', 'Dostawa hurtowa')}</dt><dd className="text-right">{method === 'collect' ? t('Free', 'Za darmo') : t('To agree', 'Do ustalenia')}</dd>
            <dt className="font-display font-extrabold text-2xl mt-2">{t('Total', 'Razem')}</dt><dd className="text-right font-display font-extrabold text-2xl mt-2">{gbp(total)}</dd>
          </dl>
          <button disabled={!ready} className={`${btn.red} w-full mt-5 disabled:opacity-40 disabled:pointer-events-none`}>
            {pay === 'online' ? t(`Pay ${gbp(total)} and place order`, `Zapłać ${gbp(total)} i zamów`) : t('Place order, pay when collecting', 'Zamów, zapłać przy odbiorze')}
          </button>
          {!ready && <p className="mt-2 text-sm text-red font-semibold">{t('Choose a collection time first.', 'Najpierw wybierz godzinę odbioru.')}</p>}
          <p className="mt-3 text-sm text-ink/55">{t('Demo checkout: no payment is taken.', 'Kasa demo: nic nie jest pobierane.')}</p>
        </aside>
      </form>
    </>
  );
}
