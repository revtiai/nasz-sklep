import { motion } from 'motion/react';
import { ArrowRight, BadgePercent, Heart, History, MapPin, PackageSearch, Phone, RefreshCw, Truck } from 'lucide-react';
import { SHOP } from '../data.ts';
import { go, useStore } from '../store.tsx';
import { Eyebrow, Reveal, btn, img, useT } from '../ui.tsx';

export default function Trade() {
  const t = useT();
  const { account, signIn } = useStore();
  const perks = [
    [BadgePercent, t('Case prices', 'Ceny za karton'), t('Lower prices when you buy whole cases.', 'Niższe ceny przy całych kartonach.')],
    [History, t('Your past orders', 'Historia zamówień'), t('See everything you’ve bought and reorder in one tap.', 'Wszystkie zakupy i ponowne zamówienie jednym kliknięciem.')],
    [RefreshCw, t('Regular orders', 'Stałe zamówienia'), t('Weekly or fortnightly. Pause or change it whenever you like.', 'Co tydzień lub co dwa. Wstrzymaj lub zmień kiedy chcesz.')],
    [PackageSearch, t('Request products', 'Zamawianie produktów'), t('Ask us to stock what you need and track the request.', 'Poproś o produkt i śledź prośbę.')],
    [Heart, t('Your usual list', 'Twoja lista'), t('Save the things you always buy.', 'Zapisz to, co kupujesz zawsze.')],
    [Truck, t('Packed for pick-up', 'Gotowe do odbioru'), t('Collect your cases from the shop. Regular deliveries by arrangement.', 'Odbierz kartony w sklepie. Stałe dostawy do uzgodnienia.')],
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
            {account ? (
              <a href="#/account" className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream text-ink font-bold min-h-14 px-7">{t('Go to my account', 'Moje konto')} <ArrowRight className="w-5 h-5" /></a>
            ) : (
              <button onClick={() => { signIn(); go('/account'); }} className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream text-ink font-bold min-h-14 px-7">{t('Sign in (try the demo account)', 'Zaloguj (konto demo)')}</button>
            )}
            <a href={SHOP.phoneHref} className="press inline-flex items-center justify-center gap-2 rounded-full border-2 border-cream/60 font-bold min-h-14 px-7"><Phone className="w-5 h-5" aria-hidden="true" />{t('Ask about trade:', 'Zapytaj o hurt:')} {SHOP.phone}</a>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-4 md:pb-6">
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

      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-12 md:pb-16">
        <Reveal>
          <div className="rounded-[2rem] bg-ink text-cream p-7 md:p-10 grid md:grid-cols-[1.2fr_auto] gap-6 md:gap-10 items-center">
            <div>
              <h2 className="text-[clamp(2rem,4.6vw,3rem)] font-extrabold leading-[0.95]">{t('Want a trade account?', 'Chcesz konto hurtowe?')}</h2>
              <p className="mt-3 text-lg text-cream/80 max-w-xl">{t('Ask at the counter or give us a call. We set up every trade account ourselves, then you can order by the case online.', 'Zapytaj przy ladzie lub zadzwoń. Każde konto hurtowe zakładamy sami, potem zamawiasz kartony online.')}</p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <a href={SHOP.phoneHref} className={btn.red}><Phone className="w-5 h-5" aria-hidden="true" />{t('Call', 'Zadzwoń')} {SHOP.phone}</a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.mapQuery)}`} target="_blank" rel="noreferrer" className="press inline-flex items-center justify-center gap-2 rounded-full border-2 border-cream/50 font-bold min-h-14 px-7"><MapPin className="w-5 h-5" aria-hidden="true" />{SHOP.street}</a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
