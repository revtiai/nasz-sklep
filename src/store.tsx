import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEMO_TRADE, PRODUCTS, type Order, type Product, type RequestItem, type Standing } from './data.ts';
import { DEFAULT_ORDERING, type Ordering } from './rules.ts';

export type Lang = 'en' | 'pl';
export type Line = { id: string; qty: number; trade: boolean };
export type ShopOrderStatus = 'new' | 'packing' | 'ready' | 'collected';
export type ShopOrder = {
  id: string; code: string; placedAt: string; lines: Line[]; total: number;
  method: 'collect' | 'delivery' | 'trade';
  fee?: number; address?: string;
  when: string; collector: string; phone: string; forSomeoneElse: boolean;
  pay: 'online' | 'in-store'; paid: boolean; note: string; status: ShopOrderStatus; trade: boolean; business?: string;
};
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
  orders: ShopOrder[];
  placeOrder: (o: Omit<ShopOrder, 'id' | 'code' | 'placedAt' | 'status'>) => ShopOrder;
  setOrderStatus: (id: string, status: ShopOrderStatus, paid?: boolean) => void;
  toast: string | null;
  say: (s: string | null) => void;
  ordering: Ordering;
  setOrdering: (o: Ordering) => void;
};

const Ctx = createContext<Store | null>(null);
const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();
const SAMPLE_ORDERS: ShopOrder[] = [
  { id: 'NS-10471', code: '4821', placedAt: ago(12), lines: [{ id: 'kabanosy', qty: 1, trade: false }, { id: 'kapusta', qty: 2, trade: false }, { id: 'ptasie-mleczko', qty: 1, trade: false }], total: 22.96, method: 'collect', when: 'Today, 17:00–18:00', collector: 'Anna K.', phone: '07700 000001', forSomeoneElse: false, pay: 'online', paid: true, note: 'Kabanosy thin, please', status: 'new', trade: false },
  { id: 'NS-10468', code: '7340', placedAt: ago(48), lines: [{ id: 'zywiec', qty: 6, trade: false }, { id: 'tchibo', qty: 2, trade: false }], total: 8.98, method: 'collect', when: 'Today, 15:00–16:00', collector: 'Marek (for his mum, Halina)', phone: '07700 000002', forSomeoneElse: true, pay: 'in-store', paid: false, note: '', status: 'packing', trade: false },
  { id: 'NS-10462', code: '1198', placedAt: ago(130), lines: [{ id: 'kielbasa-wiejska', qty: 2, trade: true }, { id: 'majonez', qty: 1, trade: true }], total: 152.6, method: 'collect', when: 'Today, 14:00–15:00', collector: 'Kawiarnia Przykład', phone: '07700 000003', forSomeoneElse: false, pay: 'in-store', paid: false, note: 'Invoice please', status: 'ready', trade: true, business: 'Kawiarnia Przykład (demo)' },
];
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
  const [orders, setOrders] = useState<ShopOrder[]>(saved.orders ?? SAMPLE_ORDERS);
  const [bump, setBump] = useState(0);
  const [basketOpen, setBasketOpen] = useState(false);
  const [toast, say] = useState<string | null>(null);
  const [ordering, setOrdering] = useState<Ordering>(saved.ordering ?? DEFAULT_ORDERING);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ lang, big, trade, lines, account, guestRequests, orders, ordering })); } catch { /* private mode */ }
  }, [lang, big, trade, lines, account, guestRequests, orders, ordering]);
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

  const placeOrder: Store['placeOrder'] = (o) => {
    const n = 10500 + Math.floor(Math.random() * 400);
    const order: ShopOrder = { ...o, id: `NS-${n}`, code: String(1000 + Math.floor(Math.random() * 9000)), placedAt: new Date().toISOString(), status: 'new' };
    setOrders((all) => [order, ...all]);
    if (account) updateAccount((a) => ({ ...a, orders: [{ id: order.id, date: order.placedAt.slice(0, 10), items: o.lines.map((l) => ({ ...l })), total: o.total, method: o.method === 'collect' ? 'Collect from the shop' : o.method === 'delivery' ? 'Home delivery' : 'Trade delivery', status: 'Received' }, ...a.orders] }));
    return order;
  };
  const setOrderStatus: Store['setOrderStatus'] = (id, status, paid) => setOrders((all) => all.map((o) => (o.id === id ? { ...o, status, paid: paid ?? o.paid } : o)));

  const value: Store = {
    lang, setLang, big, setBig, trade, setTrade, lines, add, setQty, clear: () => setLines([]), count, total, bump,
    basketOpen, setBasketOpen, account, signIn, signOut, updateAccount,
    requests: account ? account.requests : guestRequests, addRequest, orders, placeOrder, setOrderStatus, toast, say, ordering, setOrdering,
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
