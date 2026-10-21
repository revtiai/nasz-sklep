import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, History, LogOut, Pause, Play, Plus, RefreshCw, Settings, PackageSearch } from 'lucide-react';
import { gbp, product, unitPrice, useStore } from '../store.tsx';
import { ProductImage, btn, ease, field, useT } from '../ui.tsx';
import { PageHead, ProductCard } from './parts.tsx';
import { RequestStatus } from './Request.tsx';

type Tab = 'orders' | 'regular' | 'requests' | 'list' | 'details';

export default function Account() {
  const { account, signIn } = useStore();
  if (!account) return <SignIn onDemo={signIn} />;
  return <Dashboard />;
}

function SignIn({ onDemo }: { onDemo: () => void }) {
  const t = useT();
  const { say } = useStore();
  const submit = (e: FormEvent) => { e.preventDefault(); say(t('Demo: use the demo account button below.', 'Demo: użyj przycisku konta demo poniżej.')); };
  return (
    <>
      <PageHead eyebrow={t('My account', 'Moje konto')} title={t('Sign in', 'Zaloguj się')} body={t('Trade customers sign in to see case prices, past orders and regular orders.', 'Klienci hurtowi logują się, aby zobaczyć ceny za karton, historię i stałe zamówienia.')} />
      <div className="max-w-xl mx-auto px-4 md:px-8 pb-10">
        <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 md:p-8 grid gap-5">
          <label className="grid gap-2 font-semibold text-[1.05rem]">Email<input type="email" autoComplete="email" className={field} /></label>
          <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Password', 'Hasło')}<input type="password" autoComplete="current-password" className={field} /></label>
          <button className={btn.ink}>{t('Sign in', 'Zaloguj się')}</button>
          <div className="relative text-center text-ink/45 text-sm"><span className="bg-white px-3 relative z-10">{t('or', 'lub')}</span><span className="absolute inset-x-0 top-1/2 h-px bg-ink/10" /></div>
          <button type="button" onClick={onDemo} className={btn.red}>{t('Try the demo trade account', 'Wypróbuj konto demo')}</button>
          <p className="text-[0.95rem] text-ink/60 text-center">{t('No account yet?', 'Nie masz konta?')} <a href="#/trade" className="font-bold text-red underline underline-offset-4">{t('Apply for trade', 'Załóż konto hurtowe')}</a></p>
        </form>
      </div>
    </>
  );
}

function Dashboard() {
  const t = useT();
  const { account, signOut, add, updateAccount, setBasketOpen, say, lang } = useStore();
  const [tab, setTab] = useState<Tab>('orders');
  if (!account) return null;
  const tabs: [Tab, string, typeof History][] = [
    ['orders', t('Orders', 'Zamówienia'), History],
    ['regular', t('Regular order', 'Stałe zamówienie'), RefreshCw],
    ['requests', t('Requests', 'Prośby'), PackageSearch],
    ['list', t('My list', 'Moja lista'), Heart],
    ['details', t('Details', 'Dane'), Settings],
  ];
  const reorder = (items: { id: string; qty: number; trade?: boolean }[]) => {
    items.forEach((i) => add(product(i.id), i.qty, true));
    setBasketOpen(true);
    say(t('Added to your basket.', 'Dodano do koszyka.'));
  };
  const date = (d: string) => new Date(d).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'long' });
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-[0.8rem] uppercase tracking-[0.2em] text-red">{t('Trade account', 'Konto hurtowe')}</p>
          <h1 className="mt-2 text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold leading-[0.95]">{t('Hello', 'Dzień dobry')}, {account.business.split(' (')[0]}</h1>
        </div>
        <button onClick={signOut} className={btn.light}><LogOut className="w-5 h-5" />{t('Sign out', 'Wyloguj')}</button>
      </div>
      <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0" role="tablist">
        {tabs.map(([id, label, Icon]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`press shrink-0 inline-flex items-center gap-2 rounded-full px-5 min-h-14 font-bold border-2 ${tab === id ? 'bg-ink text-cream border-ink' : 'bg-white border-ink/15'}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />{label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }} className="mt-8">
          {tab === 'orders' && (
            <ul className="grid gap-4">
              {account.orders.map((o) => (
                <li key={o.id} className="rounded-[1.8rem] bg-white p-5 md:p-7">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div><p className="font-display font-extrabold text-2xl">{date(o.date)}</p><p className="text-ink/60">{o.id} · {o.method}</p></div>
                    <div className="text-right"><p className="font-display font-extrabold text-2xl">{gbp(o.total)}</p><p className="text-leaf font-bold">{o.status}</p></div>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {o.items.map((i) => (
                      <li key={i.id} className="flex items-center gap-2 rounded-full bg-paper pr-4"><ProductImage p={product(i.id)} className="w-10 h-10 rounded-full" /><span className="font-semibold">{i.qty} × {lang === 'pl' ? product(i.id).pl : product(i.id).en}</span></li>
                    ))}
                  </ul>
                  <button onClick={() => reorder(o.items)} className={`${btn.red} mt-5`}><RefreshCw className="w-5 h-5" />{t('Order this again', 'Zamów ponownie')}</button>
                </li>
              ))}
            </ul>
          )}
          {tab === 'regular' && (
            <div className="grid gap-4">
              {account.standing.map((s) => {
                const total = s.items.reduce((n, i) => n + i.qty * unitPrice(product(i.id), true), 0);
                return (
                  <div key={s.id} className="rounded-[1.8rem] bg-white p-5 md:p-7">
                    <div className="flex flex-wrap justify-between gap-3 items-start">
                      <div>
                        <p className="font-display font-extrabold text-2xl">{s.name}</p>
                        <p className="text-ink/65 text-lg">{t(`Every ${s.every}, delivered on ${s.day}`, `Co ${s.every === 'week' ? 'tydzień' : s.every === 'fortnight' ? 'dwa tygodnie' : 'miesiąc'}, dostawa: ${s.day}`)}</p>
                        <p className={`mt-1 font-bold ${s.paused ? 'text-red' : 'text-leaf'}`}>{s.paused ? t('Paused', 'Wstrzymane') : t('Active. Next delivery Tuesday.', 'Aktywne. Następna dostawa we wtorek.')}</p>
                      </div>
                      <p className="font-display font-extrabold text-2xl">{gbp(total)}</p>
                    </div>
                    <ul className="mt-4 grid sm:grid-cols-3 gap-3">
                      {s.items.map((i) => {
                        const p = product(i.id);
                        return (
                          <li key={i.id} className="flex items-center gap-3 rounded-2xl bg-paper p-2.5">
                            <ProductImage p={p} className="w-14 h-14 rounded-xl shrink-0" />
                            <div className="flex-1"><p className="font-bold leading-tight">{lang === 'pl' ? p.pl : p.en}</p><p className="text-sm text-ink/60">{i.qty} × {t('case', 'karton')}</p></div>
                            <button onClick={() => updateAccount((a) => ({ ...a, standing: a.standing.map((x) => x.id === s.id ? { ...x, items: x.items.map((y) => y.id === i.id ? { ...y, qty: y.qty + 1 } : y) } : x) }))} className="press w-11 h-11 rounded-full bg-white grid place-items-center" aria-label={t('One more case', 'Jeszcze jeden karton')}><Plus className="w-5 h-5" /></button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button onClick={() => updateAccount((a) => ({ ...a, standing: a.standing.map((x) => (x.id === s.id ? { ...x, paused: !x.paused } : x)) }))} className={btn.light}>
                        {s.paused ? <><Play className="w-5 h-5" />{t('Restart', 'Wznów')}</> : <><Pause className="w-5 h-5" />{t('Pause', 'Wstrzymaj')}</>}
                      </button>
                      <button onClick={() => say(t('Next delivery skipped.', 'Pominięto następną dostawę.'))} className={btn.light}>{t('Skip next delivery', 'Pomiń następną')}</button>
                    </div>
                  </div>
                );
              })}
              <p className="text-ink/60">{t('On the live shop, regular orders run on Shopify subscriptions, so they are charged and confirmed automatically.', 'W prawdziwym sklepie stałe zamówienia działają jako subskrypcje Shopify.')}</p>
            </div>
          )}
          {tab === 'requests' && (
            <div>
              <ul className="grid md:grid-cols-2 gap-4">
                {account.requests.map((r) => (
                  <li key={r.id} className="rounded-[1.8rem] bg-white p-5">
                    <div className="flex justify-between gap-3"><p className="font-display font-extrabold text-xl leading-tight">{r.product}</p><span className="text-sm text-ink/50">{r.id}</span></div>
                    <p className="text-ink/65 mt-1">{[r.brand, r.qty, r.how].filter(Boolean).join(' · ')}</p>
                    <div className="mt-3"><RequestStatus status={r.status} /></div>
                    {r.note && <p className="mt-3 text-leaf font-semibold">{r.note}</p>}
                  </li>
                ))}
              </ul>
              <a href="#/request" className={`${btn.red} mt-6`}><PackageSearch className="w-5 h-5" />{t('Request another product', 'Zamów kolejny produkt')}</a>
            </div>
          )}
          {tab === 'list' && (
            <motion.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {account.favourites.map((id) => <ProductCard key={id} p={product(id)} />)}
            </motion.ul>
          )}
          {tab === 'details' && (
            <div className="rounded-[1.8rem] bg-white p-6 md:p-8 grid gap-5 max-w-2xl">
              <label className="grid gap-2 font-semibold">{t('Business name', 'Nazwa firmy')}<input defaultValue={account.business} className={field} /></label>
              <label className="grid gap-2 font-semibold">{t('Delivery address', 'Adres dostawy')}<input defaultValue="Example Street, Southampton SO14" className={field} /></label>
              <label className="grid gap-2 font-semibold">{t('Preferred delivery day', 'Dzień dostawy')}
                <select className={field} defaultValue="Tuesday">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => <option key={d}>{d}</option>)}</select>
              </label>
              <p className="text-ink/60">{t('Payment terms such as pay on invoice are set by the shop for each trade account.', 'Warunki płatności, np. faktura, ustala sklep dla każdego konta.')}</p>
              <button onClick={() => say(t('Saved (demo).', 'Zapisano (demo).'))} className={btn.ink}>{t('Save', 'Zapisz')}</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
