import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEMO_TRADE, PRODUCTS, type Order, type Product, type RequestItem, type Standing } from './data.ts';

export type Lang = 'en' | 'pl';
export type Line = { id: string; qty: number; trade: boolean };
export type Account = { business: string; contact: string; orders: Order[]; standing: Standing[]; requests: RequestItem[]; favourites: string[] } | null;

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  big: boolean;
  setBig: (b: boolean) => void;
  trade: boolean;
  setTrade: (b: boolean) => void;
  lines: Line[];
  add: (p: Product, delta?: number, trade?: boolean) => void;
  setQty: (id: string, trade: boolean, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  bump: number;
  basketOpen: boolean;
  setBasketOpen: (b: boolean) => void;
  account: Account;
  signIn: () => void;
  signOut: () => void;
  updateAccount: (f: (a: NonNullable<Account>) => NonNullable<Account>) => void;
  requests: RequestItem[];
  addRequest: (r: Omit<RequestItem, 'id' | 'date' | 'status'>) => RequestItem;
  toast: string | null;
  say: (s: string | null) => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = 'nasz-sklep-demo';
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
};
export const product = (id: string) => PRODUCTS.find((p) => p.id === id)!;
export const unitPrice = (p: Product, trade: boolean) => (trade ? p.casePrice : p.price);

export function StoreProvider({ children }: { children: ReactNode }) {
  const saved = useMemo(read, []);
  const browserPl = typeof navigator !== 'undefined' && /^pl\b/i.test(navigator.language);
  const [lang, setLang] = useState<Lang>(saved.lang ?? (browserPl ? 'pl' : 'en'));
  const [big, setBig] = useState<boolean>(saved.big ?? false);
  const [trade, setTrade] = useState<boolean>(saved.trade ?? false);
  const [lines, setLines] = useState<Line[]>(saved.lines ?? []);
  const [account, setAccount] = useState<Account>(saved.account ?? null);
  const [guestRequests, setGuestRequests] = useState<RequestItem[]>(saved.guestRequests ?? []);
  const [bump, setBump] = useState(0);
  const [basketOpen, setBasketOpen] = useState(false);
  const [toast, say] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ lang, big, trade, lines, account, guestRequests })); } catch { /* private mode */ }
  }, [lang, big, trade, lines, account, guestRequests]);
  useEffect(() => { document.documentElement.lang = lang === 'pl' ? 'pl' : 'en-GB'; }, [lang]);
  useEffect(() => { document.documentElement.style.fontSize = big ? '20px' : '18px'; }, [big]);

  const add = useCallback((p: Product, delta = 1, asTrade?: boolean) => {
    const t = asTrade ?? trade;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === p.id && l.trade === t);
      if (i === -1) return delta > 0 ? [...prev, { id: p.id, qty: delta, trade: t }] : prev;
      const next = [...prev];
      const qty = next[i].qty + delta;
      if (qty <= 0) next.splice(i, 1); else next[i] = { ...next[i], qty };
      return next;
    });
    if (delta > 0) setBump((b) => b + 1);
  }, [trade]);
  const setQty = useCallback((id: string, t: boolean, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => !(l.id === id && l.trade === t)) : prev.map((l) => (l.id === id && l.trade === t ? { ...l, qty } : l))));
  }, []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * unitPrice(product(l.id), l.trade), 0);

  const signIn = () => { setAccount({ ...DEMO_TRADE, favourites: ['kielbasa-wiejska', 'kapusta', 'majonez', 'zywiec'] }); setTrade(true); };
  const signOut = () => { setAccount(null); setTrade(false); };
  const updateAccount = (f: (a: NonNullable<Account>) => NonNullable<Account>) => setAccount((a) => (a ? f(a) : a));

  const addRequest: Store['addRequest'] = (r) => {
    const item: RequestItem = { ...r, id: `R-${2040 + Math.floor(Math.random() * 900)}`, date: new Date().toISOString().slice(0, 10), status: 'received' };
    if (account) updateAccount((a) => ({ ...a, requests: [item, ...a.requests] }));
    else setGuestRequests((g) => [item, ...g]);
    return item;
  };

  const value: Store = {
    lang, setLang, big, setBig, trade, setTrade, lines, add, setQty, clear: () => setLines([]), count, total, bump,
    basketOpen, setBasketOpen, account, signIn, signOut, updateAccount,
    requests: account ? account.requests : guestRequests, addRequest, toast, say,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx)!;

export function useRoute() {
  const get = () => (window.location.hash.replace(/^#/, '') || '/');
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => { setRoute(get()); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const go = (path: string) => {
  if (window.location.hash.replace(/^#/, '') === path) window.scrollTo({ top: 0, behavior: 'smooth' });
  else window.location.hash = path;
};

export const gbp = (n: number) => `£${n.toFixed(2)}`;
