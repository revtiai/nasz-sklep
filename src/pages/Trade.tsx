import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BadgePercent, Building2, CalendarClock, Heart, History, PackageSearch, RefreshCw, Truck } from 'lucide-react';
import { go, useStore } from '../store.tsx';
import { Eyebrow, Reveal, btn, field, img, useT } from '../ui.tsx';

export default function Trade() {
  const t = useT();
  const { account, signIn, say } = useStore();
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); say(t('Demo: in the live shop this goes straight to Nasz Sklep.', 'Demo: w prawdziwym sklepie wniosek trafi do Nasz Sklep.')); };
  const perks = [
    [BadgePercent, t('Case prices', 'Ceny za karton'), t('Lower prices when you buy whole cases.', 'Niższe ceny przy całych kartonach.')],
    [History, t('Your past orders', 'Historia zamówień'), t('See everything you’ve bought and reorder in one tap.', 'Wszystkie zakupy i ponowne zamówienie jednym kliknięciem.')],
    [RefreshCw, t('Regular orders', 'Stałe zamówienia'), t('Weekly or fortnightly. Pause or change it whenever you like.', 'Co tydzień lub co dwa. Wstrzymaj lub zmień kiedy chcesz.')],
    [PackageSearch, t('Request products', 'Zamawianie produktów'), t('Ask us to stock what you need and track the request.', 'Poproś o produkt i śledź prośbę.')],
    [Heart, t('Your usual list', 'Twoja lista'), t('Save the things you always buy.', 'Zapisz to, co kupujesz zawsze.')],
    [Truck, t('Delivery days', 'Dni dostaw'), t('Collect from the shop or choose a delivery day.', 'Odbiór w sklepie lub wybrany dzień dostawy.')],
  ] as const;
  return (
    <>
      <section className="relative text-cream overflow-hidden mx-3 md:mx-6 mt-2 rounded-[2.2rem] bg-gradient-to-br from-red to-[#7d0b10]">
        <img src={img('fb/meat-shelf.jpg')} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-bold uppercase tracking-[0.2em] text-gold text-[0.8rem]">{t('Trade & bulk', 'Hurt')}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 text-[clamp(2.6rem,7vw,5.2rem)] font-extrabold leading-[0.92] max-w-4xl">{t('Stocking a shop, café or kitchen?', 'Zaopatrujesz sklep, kawiarnię lub kuchnię?')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 text-[1.2rem] text-cream/85 max-w-2xl">{t('Buy Polish and Eastern European food by the case from a shop that has stocked it on St Mary’s Road for nearly ten years.', 'Kupuj polskie i wschodnioeuropejskie jedzenie na kartony w sklepie, który działa na St Mary’s Road od prawie dziesięciu lat.')}</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })} className={btn.red}>{t('Apply for a trade account', 'Załóż konto hurtowe')}</button>
            {account ? (
              <a href="#/account" className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream text-ink font-bold min-h-14 px-7">{t('Go to my account', 'Moje konto')} <ArrowRight className="w-5 h-5" /></a>
            ) : (
              <button onClick={() => { signIn(); go('/account'); }} className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream text-ink font-bold min-h-14 px-7">{t('Sign in (try the demo account)', 'Zaloguj (konto demo)')}</button>
            )}
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <Reveal><Eyebrow>{t('What you get', 'Co zyskujesz')}</Eyebrow><h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-extrabold">{t('An account that remembers your order', 'Konto, które pamięta Twoje zamówienia')}</h2></Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perks.map(([Icon, h, b], i) => (
            <Reveal key={h} delay={(i % 3) * 0.06}>
              <div className="rounded-[1.8rem] bg-white p-6 h-full">
                <span className="w-14 h-14 rounded-2xl bg-red text-cream grid place-items-center"><Icon className="w-7 h-7" aria-hidden="true" /></span>
                <h3 className="mt-4 text-2xl font-extrabold">{h}</h3>
                <p className="mt-1.5 text-[1.05rem] text-ink/70">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 bg-gradient-to-b from-cream via-paper to-cream">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <Reveal>
            <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[0.95]">{t('Apply for a trade account', 'Wniosek o konto hurtowe')}</h2>
            <p className="mt-3 text-lg text-ink/70">{t('Takes about two minutes. We’ll call you to set things up.', 'Zajmie około dwóch minut. Zadzwonimy, aby wszystko ustawić.')}</p>
          </Reveal>
          {sent ? (
            <Reveal className="mt-8 rounded-[2rem] bg-white p-8 text-center">
              <CalendarClock className="w-14 h-14 mx-auto text-red" />
              <p className="mt-4 text-2xl font-extrabold">{t('Thank you. Dziękujemy!', 'Dziękujemy!')}</p>
              <p className="mt-2 text-lg text-ink/70">{t('We’ll be in touch about your trade account.', 'Odezwiemy się w sprawie konta hurtowego.')}</p>
            </Reveal>
          ) : (
            <form onSubmit={submit} className="mt-8 grid gap-5">
              <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Business name', 'Nazwa firmy')}<input required autoComplete="organization" className={field} /></label>
              <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Your name', 'Imię i nazwisko')}<input required autoComplete="name" className={field} /></label>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="grid gap-2 font-semibold text-[1.05rem]">{t('Phone', 'Telefon')}<input required type="tel" inputMode="tel" autoComplete="tel" className={field} /></label>
                <label className="grid gap-2 font-semibold text-[1.05rem]">Email<input type="email" autoComplete="email" className={field} /></label>
              </div>
              <fieldset className="grid gap-3">
                <legend className="font-semibold text-[1.05rem] mb-2">{t('What kind of business?', 'Rodzaj działalności')}</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[t('Shop', 'Sklep'), t('Restaurant or café', 'Restauracja lub kawiarnia'), t('Caterer', 'Catering'), t('Other', 'Inne')].map((o, i) => (
                    <label key={o} className="flex items-center gap-3 rounded-2xl bg-white border-2 border-ink/15 px-4 min-h-14 font-semibold has-[:checked]:border-red has-[:checked]:bg-red/5">
                      <input type="radio" name="kind" defaultChecked={i === 0} className="w-5 h-5 accent-red" />{o}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-2 font-semibold text-[1.05rem]">{t('What would you like to buy, and how often?', 'Co chcesz zamawiać i jak często?')}<textarea rows={4} className={`${field} py-3`} /></label>
              <button className={btn.red}>{t('Send application', 'Wyślij wniosek')} <ArrowRight className="w-5 h-5" /></button>
              <p className="text-sm text-ink/55 flex gap-2"><Building2 className="w-4 h-4 shrink-0 mt-0.5" />{t('Demo form. Nothing is sent yet.', 'Formularz demo. Nic nie jest wysyłane.')}</p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
