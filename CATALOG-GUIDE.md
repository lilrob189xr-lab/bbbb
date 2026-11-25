# Catalog guide

Catalog only: no cart, checkout, payment or purchasing.

## Two kinds of classification
| | Source | Status | Public? |
|---|---|---|---|
| Categories (6): diamond, gold, silver, nak, watches, amulet-frames | Owner | confirmed | Yes |
| Jewelry types: ring, necklace, earrings, bracelet, pendant, set, other | Prepared from photos | **preliminary** | No (hidden until `catalogConfig.showProductTypeFilter = true`) |

## Confirmed vs pending
Every product has `confirmed` flags (name, category, productType, description, productCode, price, attributes).
A value may exist only when its flag is `true`. `npm run validate:catalog` fails otherwise.
Draft records keep `name: null`, `productCode: null`, `price: null`, `attributes: []`.
The `internal` block (suggested category/types, notes, source photo) is never shown on the public site.

## Add a product
Append a record to `src/data/products.ts` (copy a draft record, new `id` and `slug`).
Add its photo to `public/images/products/` (resize only; never retouch) and register the original in `src/data/assets.ts`.

## Publish a product (only after the owner confirms)
1. Fill `name` and `category`; set `confirmed.name` and `confirmed.category` to `true`.
2. Fill description, code, price or attributes only if the owner gave them; set the matching flags.
3. Set `status: "published"`. Run `npm run validate:catalog`.
Published products need a confirmed name, a confirmed category and at least one image.

## Add or edit a category
Edit `src/data/categories.ts`. Pages, filters and category cards read from it; no component changes needed.

## Confirm the jewelry types
After the owner approves the type list, set each type's `status: "confirmed"` in `src/data/productTypes.ts`,
set `showProductTypeFilter: true` in `src/lib/catalog.ts`, and set `productType` plus `confirmed.productType` on products.

## Internal review mode
`NEXT_PUBLIC_CATALOG_PREVIEW=1 npm run dev` shows the draft records with a "ฉบับร่าง" badge, noindex.
Never deploy production with this variable set.

## Excluded images
Assets with category `excluded` or `unused` in `src/data/assets.ts` can never be used by a product (validator fails). Currently excluded at owner request: the monk photo (`861445C7`) and the Buddha amulet frame photos (`E19D1E68`, `EC6DCE4B`, `F322B99F`, `F2781520`). Originals stay in `assets-original/`. The Amulet Frames category still exists and is shown as an empty category until the owner provides product photos for it.
