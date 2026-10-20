# Nasz Sklep: online shop

Storefront design for Nasz Sklep, a Polish and Eastern European grocery at 120 St Mary's Road, Southampton
(Nasz Sklep (Southampton) Limited, company 10097368). It serves shoppers and trade buyers (shops, cafés,
restaurants) who buy by the case.

- Live preview: https://revtiai.github.io/nasz-sklep/
- Brand board: https://revtiai.github.io/nasz-sklep/board.html

## What the preview does

- Splash, scroll and page animations (motion), reduced-motion respected.
- Polish/English switch (Polish browsers start in Polish), larger-text button, big tap targets, a fixed bottom bar on phones.
- Shop with search, aisles, offers (the red price burst), product pages.
- Shop prices or trade prices by the case, in one switch.
- Trade accounts: past orders with "order again", a regular weekly order (pause, skip, add cases), saved list, details.
- Request a product: name, brand, quantity, how often, photo of the packet; requests show their progress.
- Checkout: collect from the shop with a time slot, home delivery with a postcode check, or trade delivery on a set day.
- Footer: an engraved-style Southampton waterfront with the Bargate, Civic Centre clock tower, cranes and ships sailing past.

Everything runs in the browser for the demo (saved in local storage). Products and prices are examples. Prices marked as
from Facebook come from the shop's own posts. Pack photos: Open Food Facts contributors (CC BY-SA). Counter and shelf
photos: the shop's Facebook page.

## Going live (recommended path)

Shopify runs the shop; this design becomes the Shopify theme.

| Need | Shopify answer |
| --- | --- |
| Adding products from a phone | Shopify app: photo, name, price, done |
| Payments | Shopify Payments: card, Apple Pay, Google Pay |
| Collection and local delivery | Built in: pickup locations, delivery zones by postcode, minimum order |
| Trade prices by the case | Case variants plus a wholesale pricing app keyed to a "trade" customer tag |
| Trade logins and order history | Shopify customer accounts |
| Regular weekly orders | A subscriptions app (for example Shopify Subscriptions) |
| Product requests | Shopify Forms, or the request form posting to email |
| On-demand delivery | Uber Direct app, if wanted later |

Shopify Basic is about £25 a month (around £19 a month paid yearly) plus card fees. Shopify's built-in B2B needs Plus and is not needed here.

Alternative: keep this React site and read products from Shopify's Storefront API (headless). More flexible, more upkeep.

## Run locally

```
npm install
npm run dev
```

`npm run build` writes `dist/` (the shop, `board.html` and `social.html`, which renders each social asset by `?a=`).
GitHub Actions deploys `main` to GitHub Pages with `BASE_PATH=/nasz-sklep/`. For a custom domain, build with `BASE_PATH=/`
and point the domain at the host (Vercel, Netlify or GitHub Pages).
