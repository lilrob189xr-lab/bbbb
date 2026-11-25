# About Us, product publication, X-Ray photo and contrast fixes (Nov 20 2026)

## About Us page (`src/app/about/page.tsx`)
Rebuilt from the owner's approved Thai copy, in the requested order: Hero, Our Beginning, Our Journey (timeline), From Mother to Daughter, Our Commitment, closing statement with links to Branches and Contact.
- Timeline: home in Daorung ~5 years, Thai Watsadu (formerly Home & Beyond) ~3 years, Central Phuket approaching year 3, Naka Market as an additional branch. No cumulative total is shown; the hero says "more than 10 years" only.
- Photos: `IMG_3735` (main, family), `IMG_3734` (brand sign, hero). `IMG_3733` is NOT used (listed as excluded in `assets.ts`). `IMG_3732` was not supplied, so the journey section has no photo yet; add it as a `photos` entry and a `<Photo>` in the Journey section when it arrives.
- Identities: Khun Kai = mother and founder, GREEN dress. Khun Bee = daughter, PINK dress. A third woman (floral dress, right) is in IMG_3735 and has not been identified by the owner, so she is described only visually in the alt text. The approved caption names only Kai and Bee.
- Originals are preserved in `assets-original/06-ABOUT-US/` (and `99-EXCLUDED-DO-NOT-PUBLISH/` for IMG_3733). Web copies in `public/images/about/` have EXIF data removed.
- English labels are small section headings; the story stays in Thai (no approved English story copy).

## Products published (19)
`src/data/products.ts` now has a `PUBLISH` table. Names are short descriptive Thai names drafted from the owner's database types and the photos. They contain no brand names, codes, materials, weights or prices. Edit the names there, and add `confirmed` flags for any further field the owner supplies. `npm run validate:catalog` passes (19 published, 0 draft).
Still unpublished by the earlier owner decision: KR-006, KR-007 (gold frames), KR-015 (amulet pendant), KR-016 (duplicate).
Home shows four featured products (`featuredIds` in `src/app/page.tsx`).

## Watch photos (KR-001): serial numbers blurred
The warranty card in five of the six photos showed a legible serial number and purchase date, and hang tags showed barcodes. `scripts/redact-watch-papers.py` blurs those areas in the web copies only (originals untouched). If `npm run images:products` is run again, run `npm run images:redact` afterwards.

## X-Ray
`IMG_3621` is shown on Services (`#xray` section). Copy only states what is already confirmed: non-destructive X-Ray testing, both branches. Original in `assets-original/07-SERVICES-XRAY/`.

## Contrast fixes (global)
The Redesign Edition CSS set several text colors that were unreadable on their backgrounds (WE BUY numbers 01-07, Contact branch cards ivory on ivory, home category list dark on dark, product names, gold labels at about 3:1). A final CSS block in `globals.css` fixes them. All pages were audited at 390 px and 1440 px with an automated WCAG AA text-contrast check: 0 failures. Text over photographs and hover states are not covered by that check.

## KR-017 ring re-crop
The previous crop cut off the right side of the ring and put the stone on the top edge. Re-cropped from the original (box 45,405 to 275,693 px) so the whole ring has a margin; the price slip stays out. The source is only 368 px wide, so the photo is soft when enlarged. A better original photo would fix that.
