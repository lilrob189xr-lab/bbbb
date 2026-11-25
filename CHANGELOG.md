# Changelog

## Product matching and catalog update: Nov 21 2026
See `docs/PRODUCT-MATCHING-2026-11-21.md`. Seven owner-confirmed products renamed (TH + EN), described and matched to photos; ring size, gold/diamond weight and material added only where the owner stated them. Additive fields in `products.ts` (`nameEn`, `material`, `diamondWeight`, `goldWeight`, `ringSize`, `verification`), validator rules, English name line on the product page, English name in shop search. Jubilee gold ring (KR-017) flagged: photo pairing needs owner confirmation, no product code. Design, layout, branch data and other pages unchanged.

## About Us, products, X-Ray, contrast: Nov 20 2026
See `docs/ABOUT-AND-CATALOG-UPDATE.md`. About page rebuilt from approved copy; 19 products published; X-Ray photo on Services; KR-001 serial numbers blurred; site-wide contrast fixes. IMG_3732 not supplied, IMG_3733 excluded.

## Redesign Edition + features: Nov 20 2026
- Visual layer from the Redesign (deep green / ivory / champagne), see `docs/REDESIGN-INTEGRATION.md`
- New: TH/EN switch, LINE greeting copy + toast, open/closed status (Phuket time), mobile call dock, iPhone safe areas
- Data: additive fields only (`hoursEn`, `openMin`, `closeMin`, `labelEn`)
- Checked in Chromium at 390 px and 1440 px against a harness that bundles the real components (32 checks, 0 failures); `next build` / `tsc` not run (no network in the build environment), run `npm install && npm run typecheck && npm run build` locally

## Phase 4 final: owner image confirmation + global design refinement: Nov 18 2026
Images
- Applied owner decisions: KR-006 = gold frame (rotated upright), KR-017 = genuine Jubilee item (cropped to the ring; price slip not published), KR-STORE used on About
- Reconciled 44/18 vs 34/11 (both correct: 44 on disk, 34 integrated + 10 held). One accurate inventory: `docs/IMAGE-INVENTORY-FINAL.csv` (`scripts/build-inventory.py`)
- New statuses in the pipeline: integrated / unpublished (frames, amulet) / about / duplicate. Amulet Frames stays empty
- KR-016 retired as an exact duplicate of KR-003_06. 13 groups are drafts, 3 are unpublished, 1 is About, 1 duplicate
- Originals verified byte-identical to the uploaded ZIP
Design (Shop left unchanged; its language applied everywhere)
- Home: framed hero photograph, logo mark, brand statement, WE BUY section, photo mosaic, branch cards
- About: KR-STORE photo hero, editorial blocks, branch strip. Services: two-column editorial list, branch panels, melting photo
- WE BUY: storefront photograph in the hero (categories, steps, FAQ preserved). Locations: sticky info + photo grid per branch. Contact: LINE panel on green with the original QR
- Shared patterns: offset hairline photo frames, on-photo ivory tags, display headings, consistent label/rule/section rhythm
- Navigation: removed links to pages that do not exist (X-Ray and melting now point to anchors on Services; Reviews removed since no reviews exist)
- Mobile: stacked facts, full-width buttons under 480 px, text-first ordering
Owner style request (Nov 19): airy, Tiffany-inspired direction in general principles only (no copied layout, art or text): white backgrounds, generous whitespace, large photography, thin type. Implemented as a scoped `.air` layer on Home, About, Services, WE BUY, Locations, Contact. Shop, Categories and Product pages are unchanged. Home no longer repeats the full services list.
Validation: see docs/PHASE4-CHECKPOINT.md

## Phase 4 final refinement: Shop interface — Nov 17 2026
- Shop (`/products`): search with clear button, category chips with counts, sort, "ล้างตัวกรอง" reset, result count, category kept in the URL
- Product detail: photo gallery (main photo, thumbnails, arrows, keyboard) shows the whole photo; previous / next product and back-to-shop navigation
- `/categories`: editorial tiles consistent with Home (no empty photo boxes); a category tile opens the Shop with that category selected
- Locations gallery: uniform frames; design language applied consistently to catalog pages
- Draft protection unchanged: drafts stay hidden unless NEXT_PUBLIC_CATALOG_PREVIEW=1; catalog only (no cart, checkout, payment, ordering)
- Preview now runs the real React components (menu, Shop, gallery) and was tested in Chromium (37 checks)

## Phase 4 resumption: owner product collection (KAI_RICHY_DB_v4) — Nov 17 2026
- Audited 44 photos / 18 groups (no corruption; 1 exact duplicate; label problems reported in docs/IMAGE-REVIEW-REPORT.md)
- `scripts/prepare-product-images.py`: mild denoise, luminance-only exposure/contrast, light sharpening; card/gallery/thumb variants; price/spec text overlays cropped out of 3 photos
- 11 groups (34 photos) added as DRAFT catalog records (no names/codes/prices); 7 groups held out; Amulet Frames stays empty
- `src/data/catalog-manifest.json` (generated), `docs/IMAGE_INDEX.csv`, `docs/contact-sheets/`
- Product cards use the refined card variant; draft titles show KR ids
- Originals backed up unchanged in `assets-original/KAI_RICHY_DB_v4*`

## Phase 4 refinement 2 (design, FAQ, logo, photos) — Nov 17 2026
Design (all pages)
- Rewrote `src/app/globals.css`: calmer type scale (hero 44px max, h1 36, h2 30, h3 20; weight 500), tighter section rhythm, consistent hairlines and radii
- Gold is now accent only (lines, numerals); small text uses deep green or charcoal for readable contrast
- Editorial category/WE BUY tiles, bordered branch cards, credibility facts bar on home (built from confirmed data), footer logo
- FIXED: the hamburger icon also showed on desktop (CSS order bug since Phase 3)
- WE BUY hero reduced from 104px to 64px; FAQ is a two-column layout with grouped questions
Content
- FAQ: 11 complete questions in 4 groups, based only on confirmed facts; unconfirmed matters point to the branch's LINE/phone. Placeholder tags removed (`showPendingTags` deleted)
Logo
- `public/images/brand/kai-richy-logo.png`: transparent background (RGBA), original pixels/colors kept; edge matting, no halo; untouched backup in `brand-assets/original/`
Photos
- `scripts/enhance-photos.py`: natural enhancement of the 9 branch photos (originals untouched)
Docs
- `docs/EXTERNAL-IMAGES.md` (no external images used), README run/iPhone instructions


## Phase 4 update (WE BUY) — Nov 17 2026
Added
- `src/app/we-buy/page.tsx`: WE BUY page (hero, What We Buy, How It Works, Contact, FAQ)
- `src/data/webuy.ts`: 7 owner-confirmed buying categories, 3 process steps, 8 FAQ items (6 are neutral placeholders)
- `src/lib/site.ts`: `showPendingTags` (internal review flag, off in production)
- WE BUY styles at the end of `src/app/globals.css`
Changed
- `src/data/navigation.ts`: "WE BUY รับซื้อ" added as 4th item (menu now has 8 items)
- `src/components/layout/Footer.tsx`: WE BUY quick link
- `src/app/globals.css`: header/desktop-nav breakpoint moved from 1100px to 1200px so 8 items fit; header CTA hidden between 1200 and 1359px
- `README.md`: pages list
Unchanged: all other pages, catalog data/logic, assets, exclusions (monk photo, crucifixes, 9B5DB63F, duplicates, 4 amulet frames).

## Redesign Edition — visual layer integration
- Added a final visual override layer in `src/app/globals.css` based on the supplied `KAI_RICHY_Redesign` reference: deep forest surfaces, ivory editorial sections, champagne hairlines, thin typography and square outlined actions.
- Applied the visual system across the existing V5 React routes, including Catalog, Categories and Product Detail; retained V5 components, routing, data sources, catalog filtering, gallery interactions, draft protection, branch facts, navigation and metadata.
- No static Redesign HTML was copied over the Next.js app. No product records, prices, branch facts or contact destinations were invented or changed.
