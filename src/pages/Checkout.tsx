import { useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Banknote, Building2, Clock, CreditCard, IdCard, MapPin, Store, Truck, UserRound, Users } from 'lucide-react';
import { gbp, product, unitPrice, useStore } from '../store.tsx';
import { ProductImage, btn, field, useT } from '../ui.tsx';
import { PageHead } from './parts.tsx';
import { SHOP, categoryOf } from '../data.ts';
import { RULES, clock, orderingOpen, quoteDelivery, slotsFor, type DeliveryQuote } from '../rules.ts';

function nextDays(n: number, lang: string) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? (lang === 'pl' ? 'Dziś' : 'Today') : i === 1 ? (lang === 'pl' ? 'Jutro' : 'Tomorrow') : d.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return { key: d.toISOString().slice(0, 10), label, today: i === 0 };
  });
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.06 }} className="rounded-[1.8rem] bg-white p-5 md:p-7 min-w-0">
      <h2 className="flex items-center gap-3 text-xl md:text-2xl font-extrabold"><span className="w-9 h-9 shrink-0 rounded-full bg-red text-cream grid place-items-center text-base">{n}</span>{title}</h2>
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
  const { lines, total, lang, account, clear, placeOrder, ordering } = useStore();
  const [method, setMethod] = useState<'collect' | 'delivery' | 'trade'>('collect');
  const days = nextDays(7, lang);
  const [day, setDay] = useState(days[0].key);
  const today = days.find((d) => d.key === day)?.today ?? false;
  const slots = slotsFor(today, ordering);
  const [slot, setSlot] = useState('');
  const [someoneElse, setSomeoneElse] = useState(false);
  const [pay, setPay] = useState<'online' | 'in-store'>('in-store');
  const [postcode, setPostcode] = useState('');
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [checking, setChecking] = useState(false);

  const open = orderingOpen(ordering);
  const short = Math.max(0, RULES.minimum - total);
  const fee = method === 'delivery' && quote && !('error' in quote) ? quote.fee : 0;
  const grand = total + fee;
  const delivered = method === 'delivery';

  const check = async () => {
    if (!postcode.trim()) return;
    setChecking(true);
    setQuote(await quoteDelivery(postcode));
    setChecking(false);
  };

  const place = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const dayLabel = days.find((d) => d.key === day)?.label ?? day;
    const order = placeOrder({
      lines: lines.map((l) => ({ ...l })), total: grand, method, fee,
      address: delivered ? `${f.get('address')}, ${quote && !('error' in quote) ? quote.postcode : postcode}` : undefined,
      when: method === 'trade' ? t('Delivery day to agree', 'Dzień dostawy do uzgodnienia') : `${dayLabel}, ${slot}`,
      collector: someoneElse && !delivered ? `${f.get('collectorName')} (${t('for', 'dla')} ${f.get('name')})` : String(f.get('name')),
      phone: String(f.get(someoneElse && !delivered ? 'collectorPhone' : 'phone') || f.get('phone')),
      forSomeoneElse: someoneElse && !delivered, pay, paid: pay === 'online', note: String(f.get('note') || ''), trade: lines.some((l) => l.trade), business: account?.business,
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

  const quoted = quote && !('error' in quote) ? quote : null;
  const blocker = !open
    ? ordering.paused ? t('Online orders are paused right now. Please try again later.', 'Zamówienia online są chwilowo wstrzymane.') : t(`Online orders are open ${clock(ordering.from)}–${clock(ordering.to)}.`, `Zamówienia online przyjmujemy ${clock(ordering.from)}–${clock(ordering.to)}.`)
    : short > 0 ? t(`The minimum online order is ${gbp(RULES.minimum)}. Add ${gbp(short)} more.`, `Minimalne zamówienie online to ${gbp(RULES.minimum)}. Dodaj jeszcze ${gbp(short)}.`)
    : delivered && !quoted ? t('Check your postcode for delivery first.', 'Najpierw sprawdź kod pocztowy.')
    : method !== 'trade' && !slot ? (delivered ? t('Choose a delivery time first.', 'Najpierw wybierz godzinę dostawy.') : t('Choose a collection time first.', 'Najpierw wybierz godzinę odbioru.'))
    : '';

  return (
    <>
      <PageHead eyebrow={t('Checkout', 'Zamówienie')} title={t('Order now, collect or have it delivered.', 'Zamów z odbiorem lub dostawą.')} body={t(`Collect from the shop for free, or we deliver: free within ${RULES.freeMiles} miles, ${gbp(RULES.fee)} further away. Minimum online order ${gbp(RULES.minimum)}.`, `Odbiór w sklepie za darmo albo dostawa: za darmo do ${RULES.freeMiles} mil, dalej ${gbp(RULES.fee)}. Minimalne zamówienie ${gbp(RULES.minimum)}.`)} />
      {!open && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-2 mb-5">
          <p className="rounded-2xl bg-gold/40 px-5 py-4 font-semibold flex gap-3"><Clock className="w-6 h-6 shrink-0" aria-hidden="true" />{blocker} {t('You can still fill your basket and order when we open.', 'Możesz dalej dodawać do koszyka i zamówić, gdy otworzymy.')}</p>
        </div>
      )}
      <form onSubmit={place} className="max-w-7xl mx-auto px-4 md:px-8 pb-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8 items-start">
        <div className="grid gap-5 min-w-0">
          <Step n={1} title={t('How would you like it?', 'Jak chcesz otrzymać?')}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Choice on={method === 'collect'} set={() => { setMethod('collect'); setSlot(''); }} icon={Store} title={t('Collect from the shop', 'Odbiór w sklepie')} body={`${SHOP.street}. ${t('Free.', 'Za darmo.')}`} />
              <Choice on={delivered} set={() => { setMethod('delivery'); setSlot(''); }} icon={Truck} title={t('Home delivery', 'Dostawa do domu')} body={t(`Free within ${RULES.freeMiles} miles, ${gbp(RULES.fee)} up to ${RULES.maxMiles} miles.`, `Za darmo do ${RULES.freeMiles} mil, ${gbp(RULES.fee)} do ${RULES.maxMiles} mil.`)} />
              {account && <Choice on={method === 'trade'} set={() => setMethod('trade')} icon={Building2} title={t('Trade delivery', 'Dostawa hurtowa')} body={t('For trade accounts, on a day we agree.', 'Dla kont hurtowych, w uzgodniony dzień.')} />}
            </div>
            {delivered && (
              <div className="mt-4 rounded-2xl bg-cream/60 p-4">
                <label className="grid gap-2 font-semibold">{t('Your postcode', 'Twój kod pocztowy')}
                  <span className="flex gap-2">
                    <input value={postcode} onChange={(e) => { setPostcode(e.target.value); setQuote(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } }} placeholder="SO14 0BL" autoComplete="postal-code" className={`${field} flex-1 min-w-0 uppercase`} />
                    <button type="button" onClick={check} disabled={checking || !postcode.trim()} className={`${btn.ink} shrink-0 disabled:opacity-40`}>{checking ? t('Checking…', 'Sprawdzam…') : t('Check', 'Sprawdź')}</button>
                  </span>
                </label>
                {quote && (
                  <p className={`mt-3 font-semibold flex gap-2 ${'error' in quote ? 'text-red' : 'text-leaf'}`}><MapPin className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    {'error' in quote
                      ? quote.error === 'too-far' ? t(`About ${quote.miles} miles away. We deliver up to ${RULES.maxMiles} miles, so please choose collection.`, `Około ${quote.miles} mil. Dowozimy do ${RULES.maxMiles} mil, wybierz odbiór.`)
                        : quote.error === 'not-found' ? t('We couldn’t find that postcode. Check it and try again.', 'Nie znaleziono kodu pocztowego.') : t('We couldn’t check right now. Try again in a moment.', 'Nie udało się sprawdzić. Spróbuj ponownie.')
                      : t(`${quote.postcode}${quote.area ? `, ${quote.area}` : ''}: about ${quote.miles} miles away. Delivery ${quote.fee ? gbp(quote.fee) : 'is free'}.`, `${quote.postcode}: około ${quote.miles} mil. Dostawa ${quote.fee ? gbp(quote.fee) : 'za darmo'}.`)}
                  </p>
                )}
                {quoted && <label className="mt-4 grid gap-2 font-semibold">{t('House number and street', 'Numer domu i ulica')}<input name="address" required autoComplete="street-address" className={field} /></label>}
              </div>
            )}
          </Step>

          {method !== 'trade' && (
            <Step n={2} title={delivered ? t('When should we deliver?', 'Kiedy dostarczyć?') : t('When will it be collected?', 'Kiedy odbiór?')}>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {days.map((d) => (
                  <button type="button" key={d.key} onClick={() => { setDay(d.key); setSlot(''); }} aria-pressed={day === d.key} className={`press shrink-0 rounded-2xl px-5 min-h-14 font-bold border-2 ${day === d.key ? 'bg-ink text-cream border-ink' : 'bg-white border-ink/15'}`}>{d.label}</button>
                ))}
              </div>
              {slots.length === 0 ? (
                <p className="mt-3 text-ink/65">{t('No times left today. Pick another day.', 'Brak godzin na dziś. Wybierz inny dzień.')}</p>
              ) : (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slots.map((s) => <button type="button" key={s} onClick={() => setSlot(s)} aria-pressed={slot === s} className={`press rounded-xl min-h-12 font-semibold border-2 ${slot === s ? 'bg-red text-cream border-red' : 'bg-white border-ink/15'}`}>{s}</button>)}
                </div>
              )}
              <p className="mt-3 text-sm text-ink/55">{t(`Online orders run ${clock(ordering.from)}–${clock(ordering.to)}, with at least 2 hours to pack.`, `Zamówienia online ${clock(ordering.from)}–${clock(ordering.to)}, co najmniej 2 godziny na spakowanie.`)}</p>
            </Step>
          )}

          <Step n={method === 'trade' ? 2 : 3} title={delivered ? t('Your details', 'Twoje dane') : t('Who is collecting?', 'Kto odbierze?')}>
            {!delivered && (
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <Choice on={!someoneElse} set={() => setSomeoneElse(false)} icon={UserRound} title={t('I’ll collect it', 'Odbiorę sam(a)')} body={t('Just bring your order number.', 'Wystarczy numer zamówienia.')} />
                <Choice on={someoneElse} set={() => setSomeoneElse(true)} icon={Users} title={t('Someone else will', 'Odbierze ktoś inny')} body={t('Ordering for family or a neighbour? Tell us who.', 'Zamawiasz dla rodziny lub sąsiada? Podaj kto.')} />
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="grid gap-2 font-semibold">{t('Your name', 'Twoje imię i nazwisko')}<input name="name" required autoComplete="name" defaultValue={account?.business.split(' (')[0]} className={field} /></label>
              <label className="grid gap-2 font-semibold">{t('Your mobile', 'Twój telefon')}<input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className={field} /></label>
              {someoneElse && !delivered && (
                <>
                  <label className="grid gap-2 font-semibold">{t('Name of the person collecting', 'Imię osoby odbierającej')}<input name="collectorName" required className={field} /></label>
                  <label className="grid gap-2 font-semibold">{t('Their mobile (optional)', 'Jej/jego telefon (opcjonalnie)')}<input name="collectorPhone" type="tel" inputMode="tel" className={field} /></label>
                </>
              )}
            </div>
            <p className="mt-3 text-sm text-ink/60">{delivered ? t('We text you when your order is on its way.', 'Wyślemy SMS, gdy zamówienie będzie w drodze.') : t('We text you when it’s packed and ready.', 'Wyślemy SMS, gdy zamówienie będzie gotowe.')}</p>
          </Step>

          <Step n={method === 'trade' ? 3 : 4} title={t('How would you like to pay?', 'Jak chcesz zapłacić?')}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Choice on={pay === 'in-store'} set={() => setPay('in-store')} icon={Banknote} title={delivered ? t('Pay on delivery', 'Zapłać przy dostawie') : t('Pay when collecting', 'Zapłać przy odbiorze')} body={delivered ? t('Cash or card at the door.', 'Gotówką lub kartą przy drzwiach.') : t('Cash or card at the counter.', 'Gotówką lub kartą przy ladzie.')} />
              <Choice on={pay === 'online'} set={() => setPay('online')} icon={CreditCard} title={t('Pay online now', 'Zapłać online teraz')} body={t('Card, Apple Pay or Google Pay.', 'Karta, Apple Pay lub Google Pay.')} />
            </div>
            <label className="mt-4 grid gap-2 font-semibold">{t('Anything we should know? (optional)', 'Uwagi (opcjonalnie)')}<textarea name="note" rows={2} className={`${field} py-3`} placeholder={delivered ? t('e.g. ring the bell twice', 'np. zadzwoń dwa razy') : t('e.g. slice the kiełbasa thinly', 'np. pokroić kiełbasę cienko')} /></label>
          </Step>
        </div>

        <aside className="lg:sticky lg:top-28 rounded-[2rem] bg-white p-6 md:p-7 min-w-0">
          <h2 className="text-2xl font-extrabold">{t('Your order', 'Twoje zamówienie')}</h2>
          <ul className="mt-4 grid gap-3">
            {lines.map((l) => { const p = product(l.id); return (
              <li key={`${l.id}${l.trade}`} className="flex items-center gap-3"><ProductImage p={p} className="w-12 h-12 rounded-xl shrink-0" /><span className="flex-1 min-w-0 font-semibold leading-tight">{l.qty} × {lang === 'pl' ? p.pl : p.en}{l.trade && <span className="text-ink/50"> ({t('case', 'karton')})</span>}</span><span className="font-bold">{gbp(l.qty * unitPrice(p, l.trade))}</span></li>
            ); })}
          </ul>
          <dl className="mt-5 border-t-2 border-ink/10 pt-4 grid grid-cols-2 gap-y-1.5 text-[1.05rem]">
            <dt>{t('Items', 'Produkty')}</dt><dd className="text-right">{gbp(total)}</dd>
            <dt>{method === 'collect' ? t('Collection', 'Odbiór') : delivered ? t('Delivery', 'Dostawa') : t('Trade delivery', 'Dostawa hurtowa')}</dt>
            <dd className="text-right">{method === 'collect' ? t('Free', 'Za darmo') : delivered ? (quoted ? (quoted.fee ? gbp(quoted.fee) : t('Free', 'Za darmo')) : t('Check postcode', 'Sprawdź kod')) : t('To agree', 'Do ustalenia')}</dd>
            <dt className="font-display font-extrabold text-2xl mt-2">{t('Total', 'Razem')}</dt><dd className="text-right font-display font-extrabold text-2xl mt-2">{gbp(grand)}</dd>
          </dl>
          {short > 0 && (
            <div className="mt-4">
              <div className="h-2 rounded-full bg-ink/10 overflow-hidden"><div className="h-full rounded-full bg-red origin-left" style={{ transform: `scaleX(${Math.min(1, total / RULES.minimum)})` }} /></div>
              <p className="mt-2 text-sm font-semibold">{t(`Add ${gbp(short)} more to reach the ${gbp(RULES.minimum)} minimum.`, `Dodaj jeszcze ${gbp(short)} do minimum ${gbp(RULES.minimum)}.`)}</p>
            </div>
          )}
          <button disabled={!!blocker} className={`${btn.red} w-full mt-5 disabled:opacity-40 disabled:pointer-events-none`}>
            {pay === 'online' ? t(`Pay ${gbp(grand)} and place order`, `Zapłać ${gbp(grand)} i zamów`) : delivered ? t('Place order, pay on delivery', 'Zamów, zapłać przy dostawie') : t('Place order, pay when collecting', 'Zamów, zapłać przy odbiorze')}
          </button>
          {blocker && open && <p className="mt-2 text-sm text-red font-semibold">{blocker}</p>}
          {lines.some((l) => categoryOf(product(l.id).category).age) && <p className="mt-3 rounded-xl bg-cream px-3.5 py-2.5 text-sm font-semibold flex gap-2"><IdCard className="w-5 h-5 text-red shrink-0" aria-hidden="true" />{delivered ? t('Your order has 18+ items. We check ID when we deliver.', 'Zamówienie zawiera produkty 18+. Sprawdzimy dowód przy dostawie.') : t('Your order has 18+ items. Bring ID when you collect.', 'Zamówienie zawiera produkty 18+. Zabierz dowód przy odbiorze.')}</p>}
          <p className="mt-3 text-sm text-ink/55">{t(`Questions? Call the shop on ${SHOP.phone}.`, `Pytania? Zadzwoń: ${SHOP.phone}.`)} {t('Demo checkout: no payment is taken.', 'Kasa demo: nic nie jest pobierane.')}</p>
        </aside>
      </form>
    </>
  );
}
