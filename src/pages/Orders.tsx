import { AnimatePresence, motion } from 'motion/react';
import { Banknote, Check, CheckCircle2, ClipboardList, CreditCard, Package, PackageCheck, Phone, ShoppingBag, Store, Users } from 'lucide-react';
import { gbp, product, useStore, type ShopOrder, type ShopOrderStatus } from '../store.tsx';
import { ProductImage, btn, ease, useT } from '../ui.tsx';
import { SHOP } from '../data.ts';

const FLOW: ShopOrderStatus[] = ['new', 'packing', 'ready', 'collected'];

function useLabels() {
  const t = useT();
  return {
    new: t('Received', 'Przyjęte'),
    packing: t('Being packed', 'Pakujemy'),
    ready: t('Ready to collect', 'Gotowe do odbioru'),
    collected: t('Collected', 'Odebrane'),
  } as Record<ShopOrderStatus, string>;
}

/** What the customer sees after ordering, and from the link in their text message. */
export function TrackOrder({ id }: { id?: string }) {
  const t = useT();
  const { orders, lang } = useStore();
  const labels = useLabels();
  const o = orders.find((x) => x.id === id);
  if (!o) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-extrabold">{t('Order not found', 'Nie znaleziono zamówienia')}</h1><a href="#/" className={`${btn.red} mt-6`}>{t('Home', 'Start')}</a></div>;
  }
  const at = FLOW.indexOf(o.status);
  const icons = [ClipboardList, Package, PackageCheck, CheckCircle2];
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 pt-10 pb-20">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}><CheckCircle2 className="w-16 h-16 text-leaf" /></motion.div>
      <h1 className="mt-4 text-[clamp(2.2rem,6vw,3.4rem)] font-extrabold leading-[0.95]">{t('Thank you. Dziękujemy!', 'Dziękujemy!')}</h1>
      <p className="mt-3 text-lg text-ink/70">{o.method === 'collect' ? t('We’ll pack your order and text you when it’s ready at the counter.', 'Spakujemy zamówienie i wyślemy SMS, gdy będzie gotowe przy ladzie.') : t('We’ll call to agree your delivery day.', 'Zadzwonimy, aby ustalić dzień dostawy.')}</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="rounded-[1.8rem] bg-red text-cream p-6">
          <p className="font-bold uppercase tracking-[0.16em] text-sm text-cream/80">{t('Show this at the counter', 'Pokaż przy ladzie')}</p>
          <p className="mt-2 font-display font-extrabold text-6xl tracking-wider">{o.code}</p>
          <p className="mt-1 text-cream/85">{t('Order', 'Zamówienie')} {o.id}</p>
        </div>
        <div className="rounded-[1.8rem] bg-white p-6 grid gap-2 text-[1.05rem]">
          <p className="flex gap-2"><Store className="w-5 h-5 text-red shrink-0 mt-0.5" />{SHOP.street}, {SHOP.town}</p>
          <p className="flex gap-2"><ShoppingBag className="w-5 h-5 text-red shrink-0 mt-0.5" />{o.when}</p>
          <p className="flex gap-2"><Users className="w-5 h-5 text-red shrink-0 mt-0.5" />{t('Collecting:', 'Odbiera:')} {o.collector}</p>
          <p className="flex gap-2">{o.paid ? <CreditCard className="w-5 h-5 text-leaf shrink-0 mt-0.5" /> : <Banknote className="w-5 h-5 text-red shrink-0 mt-0.5" />}{o.paid ? t('Paid online', 'Opłacone online') : t(`Pay ${gbp(o.total)} when collecting, cash or card`, `Zapłać ${gbp(o.total)} przy odbiorze, gotówką lub kartą`)}</p>
        </div>
      </div>

      <ol className="mt-8 grid grid-cols-4 gap-2" aria-label={t('Order progress', 'Postęp')}>
        {FLOW.map((s, i) => {
          const Icon = icons[i];
          return (
            <li key={s} className="text-center">
              <motion.span animate={{ backgroundColor: i <= at ? '#D7141A' : '#FFFFFF', color: i <= at ? '#FFF8EF' : '#1C1917', scale: i === at ? 1.1 : 1 }} className="mx-auto w-14 h-14 rounded-full grid place-items-center shadow-[0_1px_0_rgb(28_25_23/0.1)]"><Icon className="w-6 h-6" /></motion.span>
              <span className={`mt-2 block text-sm font-bold leading-tight ${i <= at ? 'text-red' : 'text-ink/45'}`}>{labels[s]}</span>
            </li>
          );
        })}
      </ol>

      <ul className="mt-8 rounded-[1.8rem] bg-white p-5 grid gap-3">
        {o.lines.map((l) => { const p = product(l.id); return (
          <li key={`${l.id}${l.trade}`} className="flex items-center gap-3"><ProductImage p={p} className="w-12 h-12 rounded-xl shrink-0" /><span className="flex-1 font-semibold">{l.qty} × {lang === 'pl' ? p.pl : p.en}{l.trade && ` (${t('case', 'karton')})`}</span></li>
        ); })}
        <li className="border-t-2 border-ink/10 pt-3 flex justify-between font-display font-extrabold text-xl"><span>{t('Total', 'Razem')}</span><span>{gbp(o.total)}</span></li>
      </ul>
      <p className="mt-6 text-sm text-ink/55">{t('Demo: open the shop’s orders screen from the footer and move this order along to see the progress update here.', 'Demo: otwórz ekran zamówień sklepu (stopka) i przesuń to zamówienie, aby zobaczyć zmianę tutaj.')}</p>
      <a href="#/shop" className={`${btn.light} mt-6`}>{t('Back to the shop', 'Wróć do sklepu')}</a>
    </div>
  );
}

function OrderCard({ o }: { o: ShopOrder }) {
  const t = useT();
  const { setOrderStatus, lang, say } = useStore();
  const labels = useLabels();
  const next = FLOW[FLOW.indexOf(o.status) + 1];
  const mins = Math.max(1, Math.round((Date.now() - new Date(o.placedAt).getTime()) / 60000));
  const action: Record<ShopOrderStatus, string> = {
    new: t('Start packing', 'Zacznij pakować'),
    packing: t('Mark ready, text customer', 'Gotowe, wyślij SMS'),
    ready: o.paid ? t('Collected', 'Odebrane') : t('Paid and collected', 'Opłacone i odebrane'),
    collected: '',
  };
  return (
    <motion.li layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, ease }} className="rounded-2xl bg-white p-4 shadow-[0_1px_0_rgb(28_25_23/0.08),0_14px_30px_-26px_rgb(28_25_23/0.5)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display font-extrabold text-2xl leading-none">#{o.code}</p>
          <p className="text-sm text-ink/55 mt-1">{o.id} · {mins < 60 ? `${mins} min` : `${Math.round(mins / 60)} h`} {t('ago', 'temu')}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${o.paid ? 'bg-leaf text-cream' : 'bg-gold'}`}>{o.paid ? t('Paid online', 'Opłacone') : t(`Take ${gbp(o.total)}`, `Pobrać ${gbp(o.total)}`)}</span>
      </div>
      {o.trade && <p className="mt-2 inline-block rounded-full bg-ink text-cream text-xs font-bold px-2.5 py-1">{t('Trade', 'Hurt')}{o.business ? ` · ${o.business.split(' (')[0]}` : ''}</p>}
      <p className="mt-3 font-semibold">{o.when}</p>
      <p className="text-[0.95rem] text-ink/70 flex items-center gap-1.5">{o.forSomeoneElse && <Users className="w-4 h-4" />}{o.collector}</p>
      <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="text-[0.95rem] text-red font-semibold inline-flex items-center gap-1"><Phone className="w-4 h-4" />{o.phone}</a>
      <ul className="mt-3 grid gap-1.5 border-t border-ink/10 pt-3">
        {o.lines.map((l) => { const p = product(l.id); return (
          <li key={`${l.id}${l.trade}`} className="flex items-center gap-2 text-[0.95rem]">
            <span className={`w-5 h-5 rounded border-2 grid place-items-center ${o.status !== 'new' ? 'bg-red border-red text-cream' : 'border-ink/30'}`}>{o.status !== 'new' && <Check className="w-3.5 h-3.5" />}</span>
            <span className="font-bold">{l.qty}×</span> {lang === 'pl' ? p.pl : p.en}{l.trade && <span className="text-ink/50"> ({t('case', 'karton')})</span>}
          </li>
        ); })}
      </ul>
      {o.note && <p className="mt-3 rounded-xl bg-gold/30 px-3 py-2 text-[0.95rem]">“{o.note}”</p>}
      {next && (
        <button onClick={() => { setOrderStatus(o.id, next, next === 'collected' ? true : undefined); if (next === 'ready') say(t(`Text sent to ${o.phone}: your order #${o.code} is ready (demo).`, `SMS do ${o.phone}: zamówienie #${o.code} gotowe (demo).`)); }} className={`mt-4 w-full ${o.status === 'ready' ? btn.ink : btn.red}`}>
          {action[o.status]}
        </button>
      )}
      {!next && <p className="mt-3 text-sm font-bold text-leaf">{labels.collected}</p>}
    </motion.li>
  );
}

/** The shop's own screen: every order to pack, ready, or waiting to be picked up. */
export function ShopOrders() {
  const t = useT();
  const { orders } = useStore();
  const labels = useLabels();
  const cols: ShopOrderStatus[] = ['new', 'packing', 'ready'];
  const toTake = orders.filter((o) => o.status !== 'collected' && !o.paid).reduce((s, o) => s + o.total, 0);
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-20">
      <p className="font-bold text-[0.8rem] uppercase tracking-[0.2em] text-red">{t('For the shop', 'Dla sklepu')}</p>
      <h1 className="mt-2 text-[clamp(2.2rem,6vw,3.6rem)] font-extrabold leading-[0.95]">{t('Pick-up orders', 'Zamówienia do odbioru')}</h1>
      <p className="mt-3 text-lg text-ink/70 max-w-2xl">{t('Every online order lands here. Pack it, tap “ready” and the customer gets a text. On the live shop this is the Shopify app on the shop’s phone or till.', 'Każde zamówienie online trafia tutaj. Spakuj, kliknij „gotowe”, a klient dostanie SMS. W prawdziwym sklepie to aplikacja Shopify na telefonie lub kasie.')}</p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...cols.map((c) => [labels[c], orders.filter((o) => o.status === c).length] as const), [t('To take at the till', 'Do pobrania w kasie'), gbp(toTake)] as const].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white p-4"><p className="text-sm text-ink/60">{k}</p><p className="font-display font-extrabold text-3xl">{v}</p></div>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-5 items-start">
        {cols.map((c) => {
          const list = orders.filter((o) => o.status === c);
          return (
            <section key={c} className={`rounded-[1.6rem] p-3 md:p-4 ${c === 'ready' ? 'bg-leaf/12' : c === 'packing' ? 'bg-gold/25' : 'bg-red/8'}`}>
              <h2 className="px-1 flex items-center justify-between font-display font-extrabold text-xl">{labels[c]}<span className="rounded-full bg-white px-3 py-0.5 text-base">{list.length}</span></h2>
              <ul className="mt-3 grid gap-3 min-h-20">
                <AnimatePresence mode="popLayout">{list.map((o) => <OrderCard key={o.id} o={o} />)}</AnimatePresence>
              </ul>
            </section>
          );
        })}
      </div>
      {orders.some((o) => o.status === 'collected') && (
        <details className="mt-8 rounded-2xl bg-white p-5">
          <summary className="font-bold cursor-pointer">{t('Collected today', 'Odebrane dziś')} ({orders.filter((o) => o.status === 'collected').length})</summary>
          <ul className="mt-3 grid gap-1 text-ink/70">{orders.filter((o) => o.status === 'collected').map((o) => <li key={o.id}>#{o.code} · {o.collector} · {gbp(o.total)}</li>)}</ul>
        </details>
      )}
    </div>
  );
}
