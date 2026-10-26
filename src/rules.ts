import { SHOP } from './data.ts';

// The shop's online ordering rules (confirmed by Jas, 26 Oct 2026). Shopify can do the same: local delivery zones by radius
// (free inside 10 miles, £15 up to 20), a minimum order, and ordering hours through an add-on app.
export const RULES = { minimum: 40, freeMiles: 10, maxMiles: 20, fee: 15 };

export type Ordering = { paused: boolean; from: number; to: number };
export const DEFAULT_ORDERING: Ordering = { paused: false, from: 10, to: 18 };

export const HOURS = [
  { en: 'Monday to Friday', pl: 'Poniedziałek – piątek', open: '7:30am', close: '11:30pm' },
  { en: 'Saturday and Sunday', pl: 'Sobota i niedziela', open: '8am', close: '11:30pm' },
];

export const clock = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;

export function orderingOpen(o: Ordering, now = new Date()) {
  const h = now.getHours() + now.getMinutes() / 60;
  return !o.paused && h >= o.from && h < o.to;
}

export function slotsFor(today: boolean, o: Ordering, now = new Date()) {
  const all: string[] = [];
  for (let h = o.from; h + 1 <= o.to; h += 1) all.push(`${clock(h)}–${clock(h + 1)}`);
  if (!today) return all;
  const earliest = now.getHours() + now.getMinutes() / 60 + 2;
  return all.filter((s) => {
    const [hh, mm] = s.split('–')[0].split(':').map(Number);
    return hh + mm / 60 >= earliest;
  });
}

export type DeliveryQuote = { miles: number; fee: number; postcode: string; area: string } | { error: 'not-found' | 'too-far' | 'offline'; miles?: number };

export async function quoteDelivery(raw: string): Promise<DeliveryQuote> {
  const pc = raw.replace(/\s+/g, '').toUpperCase();
  try {
    const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
    if (r.status === 404) return { error: 'not-found' };
    const j = await r.json();
    if (!j.result) return { error: 'not-found' };
    const rad = (d: number) => (d * Math.PI) / 180;
    const a = Math.sin(rad(j.result.latitude - SHOP.lat) / 2) ** 2 + Math.cos(rad(SHOP.lat)) * Math.cos(rad(j.result.latitude)) * Math.sin(rad(j.result.longitude - SHOP.lng) / 2) ** 2;
    const miles = Math.round(2 * 3958.8 * Math.asin(Math.sqrt(a)) * 10) / 10;
    if (miles > RULES.maxMiles) return { error: 'too-far', miles };
    return { miles, fee: miles <= RULES.freeMiles ? 0 : RULES.fee, postcode: j.result.postcode, area: j.result.admin_district || j.result.parish || '' };
  } catch {
    return { error: 'offline' };
  }
}
