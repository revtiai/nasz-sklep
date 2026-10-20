// Writes one HTML entry per site section with its own title, description and share image,
// so links shared on WhatsApp, Facebook or Messenger preview the right section.
import fs from 'node:fs';
import path from 'node:path';

const site = (process.env.SITE_URL ?? 'https://revtiai.github.io/nasz-sklep/').replace(/\/?$/, '/');
const dist = path.resolve('dist');
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const pages = [
  { slug: '', route: '/', og: 'og-home', title: 'Nasz Sklep · Polish groceries in Southampton', desc: 'Polish and Eastern European groceries on St Mary’s Road, Southampton. Order online and collect from the shop, or buy by the case with a trade account.' },
  { slug: 'shop', route: '/shop', og: 'og-shop', title: 'Shop · Nasz Sklep Southampton', desc: 'Smoked meats, fresh meat, fruit and veg, and the Polish brands you know. Buy by the item or by the case.' },
  { slug: 'trade', route: '/trade', og: 'og-trade', title: 'Trade & bulk · Nasz Sklep Southampton', desc: 'Trade accounts for shops, cafés and restaurants: case prices, regular weekly orders and an account that remembers what you buy.' },
  { slug: 'request', route: '/request', og: 'og-request', title: 'Request a product · Nasz Sklep Southampton', desc: 'Can’t find it? Tell us the product and how many you need and we’ll order it in.' },
  { slug: 'account', route: '/account', og: 'og-account', title: 'My trade account · Nasz Sklep Southampton', desc: 'Past orders, regular orders and your usual list. Reorder in one tap.' },
];
const meta = (p) => {
  const url = site + (p.slug ? p.slug + '/' : '');
  const img = `${site}og/${p.og}.jpg`;
  return [
    `<title>${p.title}</title>`,
    `<meta name="description" content="${p.desc}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Nasz Sklep" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:locale:alternate" content="pl_PL" />`,
    `<meta property="og:title" content="${p.title}" />`,
    `<meta property="og:description" content="${p.desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${p.title}" />`,
    `<meta name="twitter:description" content="${p.desc}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ].join('\n    ');
};
const strip = (html) => html.replace(/<title>[\s\S]*?<\/title>\s*/, '').replace(/<meta name="description"[^>]*>\s*/, '');
for (const p of pages) {
  let html = strip(base).replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${meta(p)}`);
  if (p.slug) {
    html = html.replace('<head>', `<head>\n    <script>location.replace('../#${p.route}')</script>`).replace(/(src|href)="\.\//g, '$1="../');
    fs.mkdirSync(path.join(dist, p.slug), { recursive: true });
    fs.writeFileSync(path.join(dist, p.slug, 'index.html'), html);
  } else {
    fs.writeFileSync(path.join(dist, 'index.html'), html);
  }
}
const board = path.join(dist, 'board.html');
fs.writeFileSync(board, strip(fs.readFileSync(board, 'utf8')).replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${meta({ slug: 'board.html', og: 'og-board', title: 'Brand guidelines · Nasz Sklep', desc: 'The Nasz Sklep brand: logo, colours, type, photography and social templates.' }).replace(`${site}board.html/`, `${site}board.html`)}`));
console.log('seo: wrote', pages.length, 'section pages and the board');
