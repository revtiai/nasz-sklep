export const SHOP = {
  name: 'Nasz Sklep',
  place: 'Southampton',
  company: 'Nasz Sklep (Southampton) Limited',
  companyNumber: '10097368',
  street: '120 St Mary’s Road',
  town: 'Southampton',
  postcode: 'SO14 0BL',
  mapQuery: 'Nasz Sklep, 120 St Marys Road, Southampton SO14 0BL',
  facebook: 'https://www.facebook.com/NaszSklepwSouthampton/',
  messenger: 'https://m.me/NaszSklepwSouthampton',
  phone: '07816 359020',
  phoneHref: 'tel:+447816359020',
  lat: 50.910576,
  lng: -1.399281,
};

export type CategoryId = 'meat' | 'deli' | 'dairy' | 'veg' | 'bakery' | 'breakfast' | 'grains' | 'jars' | 'baking' | 'frozen' | 'sweets' | 'drinks' | 'household' | 'alcohol' | 'vapes' | 'cosmetics';

export type Category = { id: CategoryId; en: string; pl: string; img?: string; pos?: string; tone?: [string, string]; age?: boolean; inStoreOnly?: boolean };

// The shop's own categories, in the order Jas sent them (26 October 2026).
// tone: circle colours where there is no photo yet. age: 18+ with an ID check. inStoreOnly: listed but not sold online.
export const CATEGORIES: Category[] = [
  { id: 'meat', en: 'Fresh Meat', pl: 'Świeże mięso', img: 'fb/meat-cuts.jpg', pos: '70% 50%' },
  { id: 'deli', en: 'Deli & Cold Meats', pl: 'Wędliny i delikatesy', img: 'fb/deli-kabanosy.jpg', pos: '50% 80%' },
  { id: 'dairy', en: 'Dairy & Eggs', pl: 'Nabiał i jajka', tone: ['#FFFFFF', '#D7141A'] },
  { id: 'veg', en: 'Fruit & Vegetables', pl: 'Owoce i warzywa', img: 'fb/veg-tomatoes.jpg', pos: '50% 60%' },
  { id: 'bakery', en: 'Bakery', pl: 'Pieczywo', tone: ['#F4B400', '#1C1917'] },
  { id: 'breakfast', en: 'Cereals & Breakfast', pl: 'Płatki i śniadanie', tone: ['#FFE08A', '#8E0D11'] },
  { id: 'grains', en: 'Pasta, Rice & Grains', pl: 'Makaron, ryż i kasze', img: 'p/kasza.jpg' },
  { id: 'jars', en: 'Jars, Sauces & Pickles', pl: 'Słoiki, sosy i kiszonki', img: 'p/lowicz-sos.jpg' },
  { id: 'baking', en: 'Baking & Cooking', pl: 'Do pieczenia i gotowania', tone: ['#D7141A', '#FFF8EF'] },
  { id: 'frozen', en: 'Frozen Foods', pl: 'Mrożonki', tone: ['#1C1917', '#FFF8EF'] },
  { id: 'sweets', en: 'Snacks & Sweets', pl: 'Przekąski i słodycze', img: 'p/ptasie-mleczko.jpg' },
  { id: 'drinks', en: 'Drinks', pl: 'Napoje', img: 'p/tymbark.jpg' },
  { id: 'household', en: 'Household & Toiletries', pl: 'Chemia i higiena', tone: ['#E6EEDC', '#2F6B35'] },
  { id: 'alcohol', en: 'Alcohol', pl: 'Alkohol', tone: ['#8E0D11', '#F4B400'], age: true },
  { id: 'vapes', en: 'Vapes', pl: 'E-papierosy', tone: ['#F6EEDF', '#1C1917'], age: true, inStoreOnly: true },
  { id: 'cosmetics', en: 'Cosmetics', pl: 'Kosmetyki', tone: ['#F8D7DA', '#A4161A'] },
];

export const categoryOf = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

export type Product = {
  id: string;
  pl: string;
  en: string;
  brand?: string;
  category: CategoryId;
  img?: string;
  pos?: string;
  zoom?: number;
  fit?: 'cover' | 'contain';
  tile?: [string, string];
  size: string;
  unit?: 'kg' | 'each';
  price: number;
  offer?: { en: string; pl: string };
  caseQty: number;
  casePrice: number;
  source?: 'facebook';
};

// Prices marked source: 'facebook' come from the shop's own posts; every other price is an example to replace.
export const PRODUCTS: Product[] = [
  { id: 'kabanosy', pl: 'Kabanosy', en: 'Thin smoked pork sausages', brand: 'Polska Wieś', category: 'deli', img: 'fb/deli-kabanosy.jpg', pos: '40% 88%', zoom: 1.9, size: 'per kg', unit: 'kg', price: 13.99, caseQty: 5, casePrice: 62.5, source: 'facebook' },
  { id: 'poledwica-sopocka', pl: 'Polędwica sopocka', en: 'Smoked pork loin', brand: 'Polska Wieś', category: 'deli', img: 'fb/deli-kabanosy.jpg', pos: '34% 46%', zoom: 2.1, size: 'per kg', unit: 'kg', price: 13.99, caseQty: 5, casePrice: 62.5, source: 'facebook' },
  { id: 'baleron', pl: 'Baleron wędzony', en: 'Smoked pork shoulder', brand: 'Polska Wieś', category: 'deli', img: 'fb/deli-kabanosy.jpg', pos: '62% 28%', zoom: 2.3, size: 'per kg', unit: 'kg', price: 13.99, caseQty: 5, casePrice: 62.5, source: 'facebook' },
  { id: 'kielbasa-wiejska', pl: 'Kiełbasa wiejska', en: 'Country smoked sausage', brand: 'Polska Wieś', category: 'deli', img: 'fb/deli-kielbasa.jpg', pos: '42% 62%', zoom: 1.8, size: 'per kg', unit: 'kg', price: 13.99, caseQty: 5, casePrice: 62.5, source: 'facebook' },
  { id: 'boczek', pl: 'Boczek wędzony', en: 'Smoked bacon', brand: 'Polska Wieś', category: 'deli', img: 'fb/deli-kielbasa.jpg', pos: '82% 62%', zoom: 1.9, size: 'per kg', unit: 'kg', price: 13.99, caseQty: 5, casePrice: 62.5, source: 'facebook' },
  { id: 'krakowska-ring', pl: 'Kiełbasa podsuszana', en: 'Smoked sausage rings', category: 'deli', img: 'fb/deli-rings.jpg', pos: '50% 70%', size: 'per kg', unit: 'kg', price: 12.49, caseQty: 5, casePrice: 56.0 },
  { id: 'parowki', pl: 'Parówki', en: 'Frankfurters', brand: 'JBB', category: 'deli', tile: ['#F5E6CF', '#B3261E'], size: '1 kg', price: 5.49, offer: { en: 'Now £5.49', pl: 'Teraz £5.49' }, caseQty: 6, casePrice: 28.8, source: 'facebook' },
  { id: 'karkowka', pl: 'Karkówka', en: 'Pork neck steaks', category: 'meat', img: 'fb/meat-cuts.jpg', pos: '82% 58%', zoom: 1.8, size: 'per kg', unit: 'kg', price: 7.99, caseQty: 5, casePrice: 35.0 },
  { id: 'schab', pl: 'Schab', en: 'Pork loin joint', category: 'meat', img: 'fb/meat-cuts.jpg', pos: '30% 62%', zoom: 1.7, size: 'per kg', unit: 'kg', price: 8.49, caseQty: 5, casePrice: 38.0 },
  { id: 'mielone', pl: 'Mięso mielone', en: 'Pork mince', category: 'meat', img: 'fb/meat-shelf.jpg', pos: '92% 60%', zoom: 2.2, size: '500 g', price: 3.49, caseQty: 10, casePrice: 30.0 },
  { id: 'kapusta', pl: 'Kapusta młoda', en: 'Young cabbage', category: 'veg', img: 'fb/veg-cabbage.jpg', pos: '50% 45%', size: 'each', unit: 'each', price: 1.49, caseQty: 10, casePrice: 12.0, source: 'facebook' },
  { id: 'pomidory', pl: 'Pomidory', en: 'Tomatoes', category: 'veg', img: 'fb/veg-tomatoes.jpg', pos: '50% 55%', size: 'per kg', unit: 'kg', price: 2.99, caseQty: 6, casePrice: 15.0 },
  { id: 'wloszczyzna', pl: 'Włoszczyzna', en: 'Soup vegetable pack', category: 'veg', tile: ['#E6EEDC', '#2F6B35'], size: 'pack', price: 1.99, caseQty: 10, casePrice: 16.0 },
  { id: 'sos-lowicz', pl: 'Sos do spaghetti', en: 'Spaghetti sauce', brand: 'Łowicz', category: 'jars', img: 'p/lowicz-sos.jpg', fit: 'contain', size: '500 g', price: 2.19, offer: { en: '2 for £3', pl: '2 za £3' }, caseQty: 8, casePrice: 13.6, source: 'facebook' },
  { id: 'majonez', pl: 'Majonez Dekoracyjny', en: 'Mayonnaise', brand: 'Winiary', category: 'jars', img: 'p/winiary.jpg', fit: 'contain', size: '400 ml', price: 2.79, caseQty: 12, casePrice: 27.6 },
  { id: 'ketchup', pl: 'Ketchup łagodny', en: 'Mild ketchup', brand: 'Pudliszki', category: 'jars', img: 'p/pudliszki.jpg', fit: 'contain', size: '480 g', price: 2.29, caseQty: 12, casePrice: 22.8 },
  { id: 'kasza', pl: 'Kasza gryczana prażona', en: 'Roasted buckwheat', brand: 'Melvit', category: 'grains', img: 'p/kasza.jpg', fit: 'contain', size: '4 × 100 g', price: 1.99, caseQty: 10, casePrice: 16.5 },
  { id: 'vifon', pl: 'Zupka Kaczka', en: 'Duck flavour noodle soup', brand: 'Vifon', category: 'grains', tile: ['#FFE08A', '#C8102E'], size: '70 g', price: 0.89, offer: { en: '2 for £1.50', pl: '2 za £1.50' }, caseQty: 24, casePrice: 15.6, source: 'facebook' },
  { id: 'ptasie-mleczko', pl: 'Ptasie Mleczko waniliowe', en: 'Vanilla marshmallow chocolates', brand: 'E. Wedel', category: 'sweets', img: 'p/ptasie-mleczko.jpg', fit: 'contain', size: '360 g', price: 4.99, caseQty: 8, casePrice: 33.6 },
  { id: 'prince-polo', pl: 'Prince Polo XXL', en: 'Chocolate wafer bar', brand: 'Olza', category: 'sweets', img: 'p/prince-polo.jpg', fit: 'contain', size: '50 g', price: 0.79, caseQty: 28, casePrice: 17.9 },
  { id: 'wedel-gorzka', pl: 'Czekolada gorzka 64%', en: 'Dark chocolate 64%', brand: 'E. Wedel', category: 'sweets', img: 'p/wedel.jpg', fit: 'contain', size: '90 g', price: 1.79, caseQty: 20, casePrice: 28.0 },
  { id: 'jezyki', pl: 'Jeżyki Classic', en: 'Caramel and peanut biscuits', brand: 'Goplana', category: 'sweets', img: 'p/jezyki.jpg', fit: 'contain', size: '140 g', price: 1.99, caseQty: 18, casePrice: 28.8 },
  { id: 'twoj-sekret', pl: 'Twój Sekret', en: 'Boxed chocolates', brand: 'Mieszko', category: 'sweets', tile: ['#F3E3C3', '#7A4E1D'], size: '197 g', price: 4.49, caseQty: 10, casePrice: 38.0, source: 'facebook' },
  { id: 'zywiec', pl: 'Woda Żywiec Zdrój', en: 'Spring water, lightly sparkling', brand: 'Żywiec Zdrój', category: 'drinks', img: 'p/zywiec.jpg', fit: 'contain', size: '1.5 l', price: 0.99, offer: { en: '6 for £5', pl: '6 za £5' }, caseQty: 6, casePrice: 4.5, source: 'facebook' },
  { id: 'tymbark', pl: 'Sok 100% jabłko', en: 'Apple juice', brand: 'Tymbark', category: 'drinks', img: 'p/tymbark.jpg', fit: 'contain', size: '1 l', price: 1.69, caseQty: 12, casePrice: 16.8 },
  { id: 'hellena', pl: 'Oranżada', en: 'Orangeade', brand: 'Hellena', category: 'drinks', tile: ['#FFD9A8', '#D9480F'], size: '1.25 l', price: 1.39, offer: { en: '2 for £2.50', pl: '2 za £2.50' }, caseQty: 6, casePrice: 6.6, source: 'facebook' },
  { id: 'syrop-lowicz', pl: 'Syrop', en: 'Fruit syrup', brand: 'Łowicz', category: 'drinks', tile: ['#F8D7DA', '#A4161A'], size: '400 ml', price: 2.49, offer: { en: '2 for £3', pl: '2 za £3' }, caseQty: 12, casePrice: 24.0, source: 'facebook' },
  { id: 'tchibo', pl: 'Kawa Family', en: 'Ground coffee', brand: 'Tchibo', category: 'drinks', img: 'p/tchibo.jpg', fit: 'contain', size: '250 g', price: 1.99, offer: { en: 'Was £2.49', pl: 'Było £2.49' }, caseQty: 12, casePrice: 21.6, source: 'facebook' },
  { id: 'ekland', pl: 'Herbata owocowa', en: 'Fruit tea', brand: 'Ekland', category: 'drinks', tile: ['#E9D8F0', '#5B2A86'], size: '20 bags', price: 1.79, offer: { en: '2 for £3', pl: '2 za £3' }, caseQty: 12, casePrice: 17.4, source: 'facebook' },
  { id: 'twarog', pl: 'Twaróg półtłusty', en: 'Curd cheese, half fat', brand: 'Piątnica', category: 'dairy', tile: ['#E3ECF7', '#1D4E89'], size: '250 g', price: 1.99, caseQty: 10, casePrice: 17.0 },
  { id: 'smietana', pl: 'Śmietana 18%', en: 'Soured cream 18%', brand: 'Piątnica', category: 'dairy', tile: ['#E3ECF7', '#1D4E89'], size: '400 g', price: 1.79, caseQty: 10, casePrice: 15.0 },
  { id: 'kefir', pl: 'Kefir naturalny', en: 'Natural kefir', category: 'dairy', tile: ['#EEF3E6', '#2F6B35'], size: '400 g', price: 1.39, caseQty: 12, casePrice: 14.4 },
  { id: 'jajka', pl: 'Jajka z wolnego wybiegu', en: 'Free-range eggs', category: 'dairy', tile: ['#F3E3C3', '#7A4E1D'], size: '6 eggs', price: 1.89, caseQty: 10, casePrice: 16.0 },
  { id: 'chleb-zytni', pl: 'Chleb żytni', en: 'Rye bread', category: 'bakery', tile: ['#E8D3B5', '#5A3A1A'], size: '800 g', price: 2.49, caseQty: 6, casePrice: 12.6 },
  { id: 'kajzerki', pl: 'Kajzerki', en: 'Kaiser rolls', category: 'bakery', tile: ['#F3E3C3', '#7A4E1D'], size: '6 rolls', price: 1.79, caseQty: 8, casePrice: 12.0 },
  { id: 'paczki', pl: 'Pączki z różą', en: 'Doughnuts with rose jam', category: 'bakery', tile: ['#F8D7DA', '#8E0D11'], size: '4 pack', price: 2.99, caseQty: 6, casePrice: 15.0 },
  { id: 'platki-owsiane', pl: 'Płatki owsiane górskie', en: 'Rolled oats', brand: 'Melvit', category: 'breakfast', tile: ['#EFE6D2', '#2F6B35'], size: '500 g', price: 1.49, caseQty: 12, casePrice: 15.0 },
  { id: 'miod', pl: 'Miód wielokwiatowy', en: 'Wildflower honey', category: 'breakfast', tile: ['#FFE08A', '#7A4E1D'], size: '400 g', price: 4.49, caseQty: 6, casePrice: 22.8 },
  { id: 'dzem', pl: 'Dżem truskawkowy', en: 'Strawberry jam', brand: 'Łowicz', category: 'breakfast', tile: ['#F8D7DA', '#A4161A'], size: '280 g', price: 2.29, caseQty: 8, casePrice: 15.6 },
  { id: 'makaron-nitki', pl: 'Makaron nitki', en: 'Fine soup noodles', brand: 'Lubella', category: 'grains', tile: ['#FFF1B8', '#1D4E89'], size: '500 g', price: 1.29, caseQty: 12, casePrice: 13.2 },
  { id: 'ogorki', pl: 'Ogórki kiszone', en: 'Pickled cucumbers', brand: 'Krakus', category: 'jars', tile: ['#E6EEDC', '#2F6B35'], size: '900 g', price: 2.49, caseQty: 6, casePrice: 13.2 },
  { id: 'maka', pl: 'Mąka pszenna typ 450', en: 'Plain wheat flour', brand: 'Basia', category: 'baking', tile: ['#F6EEDF', '#B3261E'], size: '1 kg', price: 1.49, caseQty: 10, casePrice: 12.0 },
  { id: 'budyn', pl: 'Budyń śmietankowy', en: 'Cream custard mix', brand: 'Dr. Oetker', category: 'baking', tile: ['#E3ECF7', '#B3261E'], size: '40 g', price: 0.59, caseQty: 25, casePrice: 11.25 },
  { id: 'kucharek', pl: 'Przyprawa Kucharek', en: 'Vegetable seasoning', brand: 'Kucharek', category: 'baking', tile: ['#FFE08A', '#B3261E'], size: '200 g', price: 1.99, caseQty: 12, casePrice: 19.2 },
  { id: 'pierogi-ruskie', pl: 'Pierogi ruskie', en: 'Potato and cheese dumplings', category: 'frozen', tile: ['#DCEBF5', '#1D4E89'], size: '450 g', price: 2.99, caseQty: 10, casePrice: 24.0 },
  { id: 'pierogi-mieso', pl: 'Pierogi z mięsem', en: 'Meat dumplings', category: 'frozen', tile: ['#DCEBF5', '#8E0D11'], size: '450 g', price: 3.29, caseQty: 10, casePrice: 26.0 },
  { id: 'uszka', pl: 'Uszka z grzybami', en: 'Mushroom dumplings for barszcz', category: 'frozen', tile: ['#E6EEDC', '#5A3A1A'], size: '400 g', price: 3.49, caseQty: 10, casePrice: 28.0 },
  { id: 'paluszki', pl: 'Paluszki klasyczne', en: 'Salted pretzel sticks', brand: 'Lajkonik', category: 'sweets', tile: ['#FFE08A', '#1D4E89'], size: '300 g', price: 1.49, caseQty: 12, casePrice: 15.0 },
  { id: 'ludwik', pl: 'Płyn do naczyń', en: 'Washing-up liquid', brand: 'Ludwik', category: 'household', tile: ['#E6EEDC', '#2F6B35'], size: '450 g', price: 1.49, caseQty: 12, casePrice: 15.0 },
  { id: 'bialy-jelen', pl: 'Mydło hipoalergiczne', en: 'Hypoallergenic soap', brand: 'Biały Jeleń', category: 'household', tile: ['#F6EEDF', '#1C1917'], size: '100 g', price: 0.99, caseQty: 24, casePrice: 18.0 },
  { id: 'tyskie', pl: 'Piwo Tyskie Gronie', en: 'Polish lager', brand: 'Tyskie', category: 'alcohol', tile: ['#F3E3C3', '#8E0D11'], size: '500 ml can', price: 1.49, caseQty: 24, casePrice: 30.0 },
  { id: 'zywiec-piwo', pl: 'Piwo Żywiec', en: 'Polish lager', brand: 'Żywiec', category: 'alcohol', tile: ['#E6EEDC', '#B3261E'], size: '500 ml can', price: 1.59, caseQty: 24, casePrice: 32.0 },
  { id: 'zubrowka', pl: 'Żubrówka Bison Grass', en: 'Bison grass vodka', brand: 'Żubrówka', category: 'alcohol', tile: ['#E6EEDC', '#2F6B35'], size: '500 ml', price: 13.99, caseQty: 6, casePrice: 78.0 },
  { id: 'ziaja-krem', pl: 'Krem oliwkowy', en: 'Olive face cream', brand: 'Ziaja', category: 'cosmetics', tile: ['#E6EEDC', '#2F6B35'], size: '50 ml', price: 2.99, caseQty: 12, casePrice: 30.0 },
  { id: 'plyn-micelarny', pl: 'Płyn micelarny', en: 'Micellar water', brand: 'Bielenda', category: 'cosmetics', tile: ['#F8D7DA', '#A4161A'], size: '500 ml', price: 3.49, caseQty: 12, casePrice: 36.0 },
];

export const OFFER_IDS = ['vifon', 'sos-lowicz', 'zywiec', 'tchibo', 'ekland', 'hellena', 'parowki', 'syrop-lowicz'];

export type Order = { id: string; date: string; items: { id: string; qty: number; trade: boolean }[]; total: number; method: string; status: string };
export type Standing = { id: string; name: string; every: 'week' | 'fortnight' | 'month'; day: string; items: { id: string; qty: number }[]; paused: boolean };
export type RequestItem = { id: string; date: string; product: string; brand: string; qty: string; how: string; status: 'received' | 'sourcing' | 'in-stock'; note?: string; photo?: string };

export const DEMO_TRADE = {
  business: 'Kawiarnia Przykład (demo)',
  contact: 'Demo account',
  orders: [
    { id: 'NS-10482', date: '2026-10-13', items: [{ id: 'kielbasa-wiejska', qty: 2, trade: true }, { id: 'kapusta', qty: 3, trade: true }, { id: 'kasza', qty: 1, trade: true }], total: 177.5, method: 'Delivery, Tuesday morning', status: 'Delivered' },
    { id: 'NS-10417', date: '2026-10-06', items: [{ id: 'kabanosy', qty: 1, trade: true }, { id: 'majonez', qty: 2, trade: true }, { id: 'zywiec', qty: 4, trade: true }], total: 135.7, method: 'Collected from the shop', status: 'Collected' },
  ] as Order[],
  standing: [{ id: 'S1', name: 'Weekly kitchen order', every: 'week', day: 'Tuesday', items: [{ id: 'kielbasa-wiejska', qty: 2 }, { id: 'kapusta', qty: 3 }, { id: 'mielone', qty: 1 }], paused: false }] as Standing[],
  requests: [
    { id: 'R-2031', date: '2026-10-09', product: 'Ogórki kiszone (barrel)', brand: 'Any', qty: '2 tubs a week', how: 'Weekly', status: 'sourcing' },
    { id: 'R-2017', date: '2026-09-28', product: 'Twaróg półtłusty', brand: 'Piątnica', qty: '1 case', how: 'Weekly', status: 'in-stock', note: 'Now on the shelf. Added to your weekly order list.' },
  ] as RequestItem[],
};
