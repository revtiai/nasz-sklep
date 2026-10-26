// Renders every downloadable brand asset into public/assets/ and zips them.
// Needs a running preview (npm run build && npx vite preview --port 4190) and Google Chrome.
//   PLAYWRIGHT_CORE=/path/to/playwright-core node scripts/export-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');
const base = (process.env.BASE ?? 'http://localhost:4190/').replace(/\/?$/, '/');
const out = path.resolve('public/assets');
fs.rmSync(out, { recursive: true, force: true });
for (const d of ['logo', 'social', 'web', 'share']) fs.mkdirSync(path.join(out, d), { recursive: true });

const b = await chromium.launch({ channel: 'chrome' });
const ready = async (p) => { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500); };

// Logos: transparent PNG at large size, and a vector PDF for printers.
for (const [file, c, place] of [['nasz-sklep-logo-red', 'red', '0'], ['nasz-sklep-logo-cream', 'cream', '0'], ['nasz-sklep-logo-red-southampton', 'red', '1'], ['nasz-sklep-logo-cream-southampton', 'cream', '1']]) {
  const p = await b.newPage({ viewport: { width: 2400, height: 1000 } });
  await p.goto(`${base}social.html?a=logo&c=${c}&place=${place}`, { waitUntil: 'networkidle' });
  await ready(p);
  await p.locator('#logo').screenshot({ path: path.join(out, 'logo', `${file}.png`), omitBackground: true });
  if (c === 'red') {
    const box = await p.locator('#logo').boundingBox();
    await p.addStyleTag({ content: 'html,body{margin:0;background:transparent}' });
    await p.pdf({ path: path.join(out, 'logo', `${file}.pdf`), width: `${Math.ceil(box.width)}px`, height: `${Math.ceil(box.height)}px`, printBackground: false, pageRanges: '1' });
  }
  await p.close();
}
fs.copyFileSync('public/favicon.svg', path.join(out, 'logo', 'nasz-sklep-icon.svg'));
{
  const p = await b.newPage({ viewport: { width: 512, height: 512 } });
  await p.setContent(`<html><body style="margin:0"><img src="data:image/svg+xml;base64,${fs.readFileSync('public/favicon.svg').toString('base64')}" width="512" height="512"></body></html>`);
  await p.screenshot({ path: path.join(out, 'logo', 'nasz-sklep-icon-512.png'), omitBackground: true, clip: { x: 0, y: 0, width: 512, height: 512 } });
  await p.close();
}

// Social: static banners, profile picture, posts and story.
const social = [
  ['profile-picture', 'profile-picture-1080', 1.5],
  ['facebook-cover', 'facebook-cover-1640x624', 1],
  ['linkedin-company', 'linkedin-company-cover-1128x191', 1],
  ['linkedin-personal', 'linkedin-personal-banner-1584x396', 1],
  ['post-online', 'post-order-online-collect', 1],
  ['post-smokehouse', 'post-smokehouse-meats', 1],
  ['post-offer', 'post-offer-of-the-week', 1],
  ['post-request', 'post-request-a-product', 1],
  ['post-trade', 'post-trade-accounts', 1],
  ['post-christmas', 'post-christmas-orders', 1],
  ['story-offer', 'story-offer', 1],
];
const sizes = { 'profile-picture': [720, 720], 'facebook-cover': [1640, 624], 'linkedin-company': [1128, 191], 'linkedin-personal': [1584, 396], 'story-offer': [1080, 1920], 'ig-banner': [3240, 1350] };
for (const [key, file, dpr] of social) {
  const [w, h] = sizes[key] ?? [1080, 1350];
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto(`${base}social.html?a=${key}`, { waitUntil: 'networkidle' });
  await ready(p);
  await p.screenshot({ path: path.join(out, 'social', `${file}.png`), clip: { x: 0, y: 0, width: w, height: h } });
  await p.close();
}
{
  const p = await b.newPage({ viewport: { width: 3240, height: 1350 } });
  await p.goto(`${base}social.html?a=ig-banner`, { waitUntil: 'networkidle' });
  await ready(p);
  await p.screenshot({ path: path.join(out, 'social', 'instagram-grid-banner-preview.png'), clip: { x: 0, y: 0, width: 3240, height: 1350 } });
  for (const i of [0, 1, 2]) await p.screenshot({ path: path.join(out, 'social', `instagram-grid-banner-${i + 1}-of-3.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  await p.close();
}

// Website screens, desktop and phone, captured from the real site.
const desktop = [['home', '#/'], ['shop', '#/shop'], ['product', '#/product/kabanosy'], ['trade', '#/trade'], ['request', '#/request'], ['shop-orders', '#/shop-orders']];
const phone = [['home', '#/'], ['shop', '#/shop'], ['product', '#/product/kabanosy'], ['checkout', '#/checkout'], ['order-ready', 'order'], ['trade-account', 'account'], ['request', '#/request']];
for (const [kind, list, vp, dpr, mob] of [['desktop', desktop, { width: 1440, height: 900 }, 1, false], ['phone', phone, { width: 390, height: 844 }, 2, true]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: mob, hasTouch: mob, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { sessionStorage.setItem('ns-splash', '1'); localStorage.setItem('nasz-sklep-feedback-hint', '1'); });
  const p = await ctx.newPage();
  await p.clock.setFixedTime(new Date(new Date().setHours(11, 0, 0, 0)));
  await p.goto(`${base}#/product/kabanosy`, { waitUntil: 'networkidle' });
  for (let i = 0; i < 3; i++) await p.getByRole('button', { name: /Add to basket/ }).click();
  for (const [name, route] of list) {
    if (route === 'order') {
      await p.goto(`${base}#/checkout`, { waitUntil: 'networkidle' });
      await p.getByRole('button', { name: 'Tomorrow' }).click();
      await p.getByRole('button', { name: '17:00–18:00' }).click();
      await p.fill('input[name=name]', 'Anna Kowalska');
      await p.fill('input[name=phone]', '07700 900111');
      await p.getByText('Pay when collecting', { exact: true }).click();
      await p.getByRole('button', { name: /Place order/ }).click();
      await p.waitForTimeout(800);
      const id = (await p.evaluate(() => location.hash)).split('/').pop();
      const s = JSON.parse(await p.evaluate(() => localStorage.getItem('nasz-sklep-demo')));
      s.orders = s.orders.map((o) => (o.id === id ? { ...o, status: 'ready' } : o));
      await p.evaluate((v) => localStorage.setItem('nasz-sklep-demo', v), JSON.stringify(s));
      await p.reload({ waitUntil: 'networkidle' });
    } else if (route === 'account') {
      await p.goto(`${base}#/account`, { waitUntil: 'networkidle' });
      if (await p.getByRole('button', { name: /demo trade account/i }).count()) await p.getByRole('button', { name: /demo trade account/i }).click();
    } else {
      await p.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(1200);
    await p.addStyleTag({ content: '[role=status],[data-feedback]{display:none!important}' });
    await p.screenshot({ path: path.join(out, 'web', `${kind}-${name}.png`) });
    if (name === 'checkout' && kind === 'phone') {
      await p.getByRole('button', { name: 'Tomorrow' }).click().catch(() => {});
    }
  }
  await ctx.close();
}
await b.close();

for (const f of fs.readdirSync('public/og')) fs.copyFileSync(path.join('public/og', f), path.join(out, 'share', f));
fs.writeFileSync(path.join(out, 'README.txt'), [
  'Nasz Sklep brand assets',
  '',
  'logo/    The logo as transparent PNG (red, cream, with and without Southampton), vector PDF for printers, and the browser/app icon.',
  'social/  Profile picture, static banners for Facebook, LinkedIn and the Instagram grid, posts and a story. Ready to upload as they are.',
  'web/     Screens of the online shop on a computer and on a phone.',
  'share/   The images shown when a link to the site is shared.',
  '',
  'Colours: Red #D7141A · Cream #FFF8EF · Paper #F6EEDF · Ink #1C1917 · Gold #F4B400 · Leaf #2F6B35',
  'Fonts (free): Bricolage Grotesque for headings, Inter for everything else.',
].join('\n'));
execFileSync('zip', ['-qr', 'nasz-sklep-brand-assets.zip', 'logo', 'social', 'web', 'share', 'README.txt', '-x', '*.DS_Store'], { cwd: out });
console.log('assets:', fs.readdirSync(out).join(', '));
