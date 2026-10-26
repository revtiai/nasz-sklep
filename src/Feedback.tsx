import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, Crosshair, Mail, MessageSquarePlus, Send, Trash2, X } from 'lucide-react';

// Review tool for the client: notes are kept on their own device and sent to AJ in one go.
// Switch off before launch by setting REVIEW to false.
export const REVIEW = true;

const KEY = 'nasz-sklep-feedback-v1';
const SEEN = 'nasz-sklep-feedback-hint';
const EMAIL = 'aj@revti.ai';

type Note = { id: string; where: string; target?: string; text: string };

const read = (): Note[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};
const write = (n: Note[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* private mode: notes live for this visit only */ }
};

const PAGES: [RegExp, string][] = [
  [/^#?\/?$/, 'Home'], [/^#\/shop-orders/, 'Shop orders screen'], [/^#\/shop/, 'Shop'], [/^#\/product/, 'Product page'],
  [/^#\/trade/, 'Trade and bulk'], [/^#\/request/, 'Request a product'], [/^#\/account/, 'Account'],
  [/^#\/checkout/, 'Checkout'], [/^#\/order/, 'Order tracking'],
];

const clean = (s: string | null | undefined, n = 60) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);

function pageName(place: 'site' | 'board') {
  if (place === 'board') return 'Brand guidelines';
  const h = location.hash || '#/';
  const name = PAGES.find(([r]) => r.test(h))?.[1] ?? 'Website';
  return `Website › ${name}`;
}

function sectionAt(y: number, skip?: Element | null) {
  let best = '';
  for (const el of document.querySelectorAll('h1, h2, h3, [data-section]')) {
    if (skip && skip.contains(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || r.top > y) continue;
    best = clean((el as HTMLElement).dataset.section || el.textContent, 50);
  }
  return best;
}

function describe(el: Element) {
  const img = el.closest('img, svg, picture') as HTMLElement | null;
  const alt = img instanceof HTMLImageElement ? clean(img.alt) : '';
  if (alt) return `Photo: ${alt}`;
  const own = img ? '' : clean((el as HTMLElement).innerText, 70) || clean(el.getAttribute('aria-label'));
  if (own.length > 2) return own;
  const box = el.closest('[aria-label], li, a, button, figure, article') as HTMLElement | null;
  const label = clean(box?.getAttribute('aria-label')) || clean((box?.innerText || '').split('\n').filter(Boolean).slice(0, 2).join(' · '), 70);
  if (label) return img ? `Photo: ${label}` : label;
  return img ? 'A picture' : clean(el.tagName.toLowerCase());
}

function format(notes: Note[]) {
  const lines = ['Nasz Sklep: changes from Jas', ''];
  notes.forEach((n, i) => {
    lines.push(`${i + 1}. ${n.where}`);
    if (n.target) lines.push(`   On: "${n.target}"`);
    lines.push(`   ${n.text}`, '');
  });
  lines.push('(NASZ-SKLEP-FEEDBACK v1)');
  return lines.join('\n');
}

export function Feedback({ place }: { place: 'site' | 'board' }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(read);
  const [text, setText] = useState('');
  const [where, setWhere] = useState('');
  const [target, setTarget] = useState<string | undefined>();
  const [pointing, setPointing] = useState(false);
  const [hint, setHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clearing, setClearing] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => { write(notes); }, [notes]);
  useEffect(() => {
    let seen = true;
    try { seen = !!localStorage.getItem(SEEN); } catch { /* ignore */ }
    if (seen) return;
    const a = setTimeout(() => setHint(true), 2500);
    const b = setTimeout(() => { setHint(false); try { localStorage.setItem(SEEN, '1'); } catch { /* ignore */ } }, 11000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  const start = () => {
    const sec = sectionAt(innerHeight * 0.45, panel.current);
    setWhere(`${pageName(place)}${sec ? ` › ${sec}` : ''}`);
    setTarget(undefined);
    setHint(false);
    setOpen(true);
  };

  useEffect(() => {
    if (!pointing) return;
    const pick = (e: MouseEvent) => {
      const el = e.target as Element;
      if (el.closest('[data-feedback]')) return;
      e.preventDefault(); e.stopPropagation();
      const r = el.getBoundingClientRect();
      const sec = sectionAt(r.top + 1);
      setWhere(`${pageName(place)}${sec ? ` › ${sec}` : ''}`);
      setTarget(describe(el));
      const box = document.createElement('div');
      box.style.cssText = `position:fixed;left:${r.left - 4}px;top:${r.top - 4}px;width:${r.width + 8}px;height:${r.height + 8}px;border:3px solid #D7141A;border-radius:12px;pointer-events:none;z-index:95;transition:opacity .6s`;
      document.body.appendChild(box);
      setTimeout(() => { box.style.opacity = '0'; }, 900);
      setTimeout(() => box.remove(), 1600);
      setPointing(false);
      setOpen(true);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPointing(false); setOpen(true); } };
    document.addEventListener('click', pick, true);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', pick, true); document.removeEventListener('keydown', esc); };
  }, [pointing, place]);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setNotes((n) => [...n, { id: Date.now().toString(36), where, target, text: t }]);
    setText('');
    setTarget(undefined);
  };

  const body = format(notes);
  const send = async () => {
    const nav = navigator as Navigator & { share?: (d: { text: string; title?: string }) => Promise<void> };
    if (nav.share && matchMedia('(pointer: coarse)').matches) {
      try { await nav.share({ title: 'Nasz Sklep changes', text: body }); return; } catch { /* cancelled */ return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  const bottom = place === 'site' ? 'bottom-[104px] lg:bottom-6 lg:left-6 lg:right-auto' : 'bottom-5';

  return (
    <div data-feedback="" className="print:hidden">
      <AnimatePresence>
        {hint && !open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className={`fixed right-4 ${place === 'site' ? 'bottom-[172px] lg:bottom-[92px] lg:left-6 lg:right-auto' : 'bottom-[88px]'} z-[70] max-w-[250px] rounded-2xl bg-ink text-cream px-4 py-3 text-[0.95rem] leading-snug shadow-xl`}>
            Want something changed? Tap here and write it on the page.
            <span className={`absolute -bottom-1.5 right-8 w-3 h-3 rotate-45 bg-ink ${place === 'site' ? 'lg:left-8 lg:right-auto' : ''}`} />
          </motion.div>
        )}
      </AnimatePresence>

      {!open && !pointing && (
        <button type="button" onClick={start} className={`press fixed right-4 ${bottom} z-[70] inline-flex items-center gap-2 rounded-full bg-red text-cream pl-4 pr-5 min-h-14 font-bold shadow-[0_14px_30px_-12px_rgb(28_25_23/0.55)]`} aria-label={`Suggest a change${notes.length ? `, ${notes.length} notes so far` : ''}`}>
          <MessageSquarePlus className="w-5 h-5" aria-hidden="true" />Suggest a change
          {notes.length > 0 && <span className="min-w-7 h-7 px-1.5 grid place-items-center rounded-full bg-cream text-red text-sm font-extrabold">{notes.length}</span>}
        </button>
      )}

      {pointing && (
        <div className="fixed inset-x-0 top-0 z-[90] flex justify-center p-3 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink text-cream pl-5 pr-2 py-2 shadow-xl">
            <Crosshair className="w-5 h-5 text-gold" aria-hidden="true" />
            <span className="font-semibold">Tap the thing you want changed</span>
            <button type="button" onClick={() => { setPointing(false); setOpen(true); }} className="press min-h-11 px-4 rounded-full bg-cream/15 font-bold">Cancel</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[80] bg-ink/40" />
            <motion.div ref={panel} role="dialog" aria-label="Your notes for AJ" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.25 }}
              className="fixed z-[85] inset-x-0 bottom-0 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[420px] max-h-[88svh] overflow-y-auto overscroll-contain rounded-t-[1.8rem] sm:rounded-[1.8rem] bg-cream text-ink shadow-[0_30px_70px_-20px_rgb(28_25_23/0.6)]" data-lenis-prevent="">
              <div className="sticky top-0 bg-cream px-5 pt-5 pb-3 flex items-start justify-between gap-3 border-b border-ink/10">
                <div>
                  <p className="font-display font-extrabold text-[1.4rem] leading-tight">Your notes for AJ</p>
                  <p className="text-[0.9rem] text-ink/60 mt-0.5">Write what you'd like changed. Your notes stay on this device until you send them.</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="press w-11 h-11 shrink-0 rounded-full bg-ink/5 grid place-items-center" aria-label="Close"><X className="w-5 h-5" /></button>
              </div>

              <div className="px-5 py-4">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-red">About</p>
                  <p className="mt-1 font-semibold leading-snug">{where || pageName(place)}</p>
                  {target && <p className="mt-1 text-[0.95rem] text-ink/70">On: “{target}”</p>}
                  <button type="button" onClick={() => { setOpen(false); setPointing(true); }} className="press mt-3 inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-4 min-h-11 font-semibold text-[0.95rem]">
                    <Crosshair className="w-4 h-4" aria-hidden="true" />{target ? 'Point at something else' : 'Point at the exact thing'}
                  </button>
                  <label className="block mt-4">
                    <span className="sr-only">Your note</span>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="e.g. Make the photos bigger, change the opening hours, add our phone number…" className="w-full rounded-2xl border-2 border-ink/15 bg-cream px-4 py-3 text-[1.05rem] outline-none focus:border-red resize-y" />
                  </label>
                  <button type="button" onClick={add} disabled={!text.trim()} className="press mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-red text-cream min-h-12 font-bold disabled:opacity-40">
                    <Check className="w-5 h-5" aria-hidden="true" />Add note
                  </button>
                </div>

                {notes.length > 0 && (
                  <div className="mt-5">
                    <p className="font-display font-extrabold text-lg">{notes.length} {notes.length === 1 ? 'note' : 'notes'} so far</p>
                    <ol className="mt-2 grid gap-2">
                      {notes.map((n, i) => (
                        <li key={n.id} className="rounded-2xl bg-white p-3.5 flex gap-3">
                          <span className="w-7 h-7 shrink-0 rounded-full bg-red text-cream grid place-items-center text-sm font-extrabold">{i + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.8rem] text-ink/55 leading-snug">{n.where}{n.target ? ` · “${n.target}”` : ''}</p>
                            <p className="mt-0.5 leading-snug break-words">{n.text}</p>
                          </div>
                          <button type="button" onClick={() => setNotes((all) => all.filter((x) => x.id !== n.id))} className="press w-10 h-10 shrink-0 rounded-full grid place-items-center text-ink/50 hover:text-red" aria-label={`Delete note ${i + 1}`}><Trash2 className="w-4 h-4" /></button>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-4 rounded-2xl bg-ink text-cream p-4">
                      <p className="font-semibold">Done? Send them all to AJ in one go.</p>
                      <button type="button" onClick={send} className="press mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-ink min-h-12 font-bold">
                        <Send className="w-5 h-5" aria-hidden="true" />Send to AJ
                      </button>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <a href={`mailto:${EMAIL}?subject=${encodeURIComponent('Nasz Sklep changes')}&body=${encodeURIComponent(body)}`} className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream/12 min-h-11 font-semibold"><Mail className="w-4 h-4" aria-hidden="true" />Email</a>
                        <button type="button" onClick={copy} className="press inline-flex items-center justify-center gap-2 rounded-full bg-cream/12 min-h-11 font-semibold">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy'}</button>
                      </div>
                      <p className="mt-3 text-[0.85rem] text-cream/65">Send to AJ opens WhatsApp. Pick AJ, then press send.</p>
                    </div>

                    <button type="button" onClick={() => { if (clearing) { setNotes([]); setClearing(false); } else { setClearing(true); setTimeout(() => setClearing(false), 3000); } }} className="press mt-3 w-full min-h-11 rounded-full text-[0.95rem] font-semibold text-ink/60">
                      {clearing ? 'Tap again to delete all notes' : 'Clear all notes after sending'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
