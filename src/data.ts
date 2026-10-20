import type { ArtKind } from './art.tsx';

export const SHOP = {
  name: 'Nasz Sklep',
  company: 'Nasz Sklep (Southampton) Limited',
  companyNumber: '10097368',
  address: '120 St Mary’s Road, Southampton SO14 0AW',
  mapQuery: 'Nasz Sklep, 120 St Marys Road, Southampton SO14 0AW',
  facebook: 'https://www.facebook.com/NaszSklepSouthampton',
};

export type CategoryId = 'deli' | 'dairy' | 'bakery' | 'frozen' | 'jars' | 'sweets' | 'drinks' | 'dry';

export const CATEGORIES: { id: CategoryId; en: string; pl: string; art: ArtKind; bg: string }[] = [
  { id: 'deli', en: 'Deli & sausage', pl: 'Wędliny', art: 'sausage', bg: '#F6C9C4' },
  { id: 'dairy', en: 'Dairy', pl: 'Nabiał', art: 'milk', bg: '#DCE6F5' },
  { id: 'bakery', en: 'Bread & bakery', pl: 'Pieczywo', art: 'bread', bg: '#F7E1B8' },
  { id: 'frozen', en: 'Pierogi & frozen', pl: 'Mrożonki', art: 'dumplings', bg: '#E3EEF2' },
  { id: 'jars', en: 'Jars & pickles', pl: 'Przetwory', art: 'pickles', bg: '#DDEEDB' },
  { id: 'sweets', en: 'Sweets & biscuits', pl: 'Słodycze', art: 'sweets', bg: '#FBE3C9' },
  { id: 'drinks', en: 'Drinks', pl: 'Napoje', art: 'bottle', bg: '#F1DCCB' },
  { id: 'dry', en: 'Flour, grains & dry', pl: 'Produkty sypkie', art: 'sack', bg: '#F2E8D2' },
];

export type Product = {
  id: string;
  pl: string;
  en: string;
  category: CategoryId;
  art: ArtKind;
  tint?: string;
  size: string;
  price: number;
  caseQty: number;
  casePrice: number;
  tag?: 'new' | 'popular' | 'chilled' | 'frozen';
};

// Example range for the demo. Prices are placeholders until the shop's own list arrives.
export const PRODUCTS: Product[] = [
  { id: 'kielbasa-podwawelska', pl: 'Kiełbasa podwawelska', en: 'Smoked pork sausage', category: 'deli', art: 'sausage', size: '450 g', price: 4.49, caseQty: 10, casePrice: 36.0, tag: 'popular' },
  { id: 'kabanosy', pl: 'Kabanosy', en: 'Thin dried pork sausages', category: 'deli', art: 'kabanos', size: '250 g', price: 3.99, caseQty: 12, casePrice: 39.0, tag: 'popular' },
  { id: 'szynka', pl: 'Szynka wiejska', en: 'Country-style ham, sliced', category: 'deli', art: 'ham', size: '200 g', price: 3.29, caseQty: 12, casePrice: 32.4, tag: 'chilled' },
  { id: 'sledzie', pl: 'Śledzie w oleju', en: 'Herring fillets in oil', category: 'deli', art: 'fish', size: '300 g', price: 3.49, caseQty: 10, casePrice: 28.5, tag: 'chilled' },
  { id: 'twarog', pl: 'Twaróg półtłusty', en: 'Semi-skimmed curd cheese', category: 'dairy', art: 'cheese', size: '250 g', price: 2.19, caseQty: 16, casePrice: 28.8, tag: 'chilled' },
  { id: 'kefir', pl: 'Kefir naturalny', en: 'Natural kefir', category: 'dairy', art: 'milk', size: '1 l', price: 1.99, caseQty: 12, casePrice: 19.2, tag: 'chilled' },
  { id: 'smietana', pl: 'Śmietana 18%', en: 'Soured cream 18%', category: 'dairy', art: 'milk', tint: '#D6232A', size: '400 g', price: 1.79, caseQty: 12, casePrice: 17.4, tag: 'chilled' },
  { id: 'chleb-zytni', pl: 'Chleb żytni', en: 'Dark rye bread', category: 'bakery', art: 'bread', tint: '#7A4A22', size: '800 g', price: 2.49, caseQty: 8, casePrice: 15.6, tag: 'popular' },
  { id: 'chleb-wiejski', pl: 'Chleb wiejski', en: 'Country loaf', category: 'bakery', art: 'bread', size: '600 g', price: 2.29, caseQty: 8, casePrice: 14.4 },
  { id: 'sernik', pl: 'Sernik', en: 'Baked cheesecake', category: 'bakery', art: 'cake', size: '1 kg', price: 7.99, caseQty: 4, casePrice: 26.0, tag: 'new' },
  { id: 'pierogi-ruskie', pl: 'Pierogi ruskie', en: 'Potato & cheese dumplings', category: 'frozen', art: 'dumplings', size: '1 kg', price: 4.99, caseQty: 8, casePrice: 32.0, tag: 'popular' },
  { id: 'pierogi-mieso', pl: 'Pierogi z mięsem', en: 'Meat dumplings', category: 'frozen', art: 'dumplings', tint: '#F5DDB0', size: '1 kg', price: 5.49, caseQty: 8, casePrice: 35.2, tag: 'frozen' },
  { id: 'uszka', pl: 'Uszka z grzybami', en: 'Mushroom dumplings for barszcz', category: 'frozen', art: 'dumplings', tint: '#EBD9B4', size: '500 g', price: 3.99, caseQty: 10, casePrice: 32.0, tag: 'frozen' },
  { id: 'ogorki', pl: 'Ogórki kiszone', en: 'Brine-fermented cucumbers', category: 'jars', art: 'pickles', size: '900 g', price: 2.79, caseQty: 8, casePrice: 18.4, tag: 'popular' },
  { id: 'barszcz', pl: 'Barszcz czerwony', en: 'Beetroot soup concentrate', category: 'jars', art: 'soup', size: '300 ml', price: 2.49, caseQty: 12, casePrice: 24.0 },
  { id: 'chrzan', pl: 'Chrzan tarty', en: 'Grated horseradish', category: 'jars', art: 'jar', tint: '#EFE7D2', size: '180 g', price: 1.69, caseQty: 12, casePrice: 16.2 },
  { id: 'powidla', pl: 'Powidła śliwkowe', en: 'Plum butter', category: 'jars', art: 'jar', size: '290 g', price: 2.59, caseQty: 12, casePrice: 24.6, tag: 'new' },
  { id: 'krowki', pl: 'Krówki', en: 'Milk fudge sweets', category: 'sweets', art: 'sweets', size: '300 g', price: 2.99, caseQty: 14, casePrice: 33.6, tag: 'popular' },
  { id: 'pierniki', pl: 'Pierniki', en: 'Glazed gingerbread', category: 'sweets', art: 'gingerbread', size: '160 g', price: 1.99, caseQty: 20, casePrice: 32.0 },
  { id: 'wafle', pl: 'Wafle przekładane', en: 'Layered wafers', category: 'sweets', art: 'cake', tint: '#F2D6A0', size: '200 g', price: 1.49, caseQty: 24, casePrice: 28.8 },
  { id: 'kompot', pl: 'Kompot wiśniowy', en: 'Cherry compote drink', category: 'drinks', art: 'bottle', tint: '#9E1F33', size: '900 ml', price: 2.29, caseQty: 6, casePrice: 11.4 },
  { id: 'kwas', pl: 'Kwas chlebowy', en: 'Bread kvass', category: 'drinks', art: 'bottle', size: '1 l', price: 1.99, caseQty: 12, casePrice: 19.2, tag: 'new' },
  { id: 'kasza', pl: 'Kasza gryczana', en: 'Roasted buckwheat', category: 'dry', art: 'sack', tint: '#C9A06A', size: '1 kg', price: 2.89, caseQty: 10, casePrice: 24.5 },
  { id: 'maka', pl: 'Mąka tortowa', en: 'Fine cake flour', category: 'dry', art: 'sack', size: '1 kg', price: 1.49, caseQty: 10, casePrice: 12.0 },
];

export type Lang = 'en' | 'pl';

export const T = {
  shop: { en: 'Shop', pl: 'Sklep' },
  trade: { en: 'Trade & bulk', pl: 'Hurt' },
  visit: { en: 'Visit us', pl: 'Odwiedź nas' },
  basket: { en: 'Basket', pl: 'Koszyk' },
  retail: { en: 'Retail', pl: 'Detal' },
  tradePrices: { en: 'Trade', pl: 'Hurt' },
  eyebrow: { en: 'Southampton · St Mary’s Road', pl: 'Southampton · St Mary’s Road' },
  heroTitle: { en: 'A taste of home, by the jar or by the case.', pl: 'Smak domu, na sztuki albo na kartony.' },
  heroBody: {
    en: 'Polish and Eastern European groceries from a family-run shop. Shop for your kitchen, or open a trade account for your shop, café or restaurant.',
    pl: 'Polskie i wschodnioeuropejskie produkty z rodzinnego sklepu. Zrób zakupy do domu albo załóż konto hurtowe dla swojego sklepu, kawiarni lub restauracji.',
  },
  shopRange: { en: 'Shop the range', pl: 'Zobacz produkty' },
  openTrade: { en: 'Open a trade account', pl: 'Załóż konto hurtowe' },
  categories: { en: 'Browse the aisles', pl: 'Działy sklepu' },
  all: { en: 'Everything', pl: 'Wszystko' },
  search: { en: 'Search pierogi, kabanosy, kefir…', pl: 'Szukaj: pierogi, kabanosy, kefir…' },
  add: { en: 'Add', pl: 'Dodaj' },
  addCase: { en: 'Add case', pl: 'Dodaj karton' },
  each: { en: 'each', pl: 'szt.' },
  caseOf: { en: 'Case of', pl: 'Karton' },
  empty: { en: 'Your basket is empty.', pl: 'Koszyk jest pusty.' },
  checkout: { en: 'Checkout', pl: 'Do kasy' },
  sendQuote: { en: 'Send as trade order', pl: 'Wyślij zamówienie hurtowe' },
  subtotal: { en: 'Subtotal', pl: 'Razem' },
  noResults: { en: 'Nothing matches that yet. Ask in store, we probably have it.', pl: 'Nic nie znaleziono. Zapytaj w sklepie, pewnie mamy.' },
};
