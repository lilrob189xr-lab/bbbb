# KAI RICHY website (Phase 4 final refinement, awaiting owner review)

Next.js (App Router) + TypeScript. Catalog only: no cart, checkout or payment.

## Run locally (Node 20+)
On your computer, in this folder:
    npm install
    npm run dev       # http://localhost:3000
    npm run typecheck
    npm run validate:catalog   # checks catalog data rules
    npm run build

## Structure
- `src/data/*`: single source of truth (brand, branches, contact, navigation, categories, products, assets)
- `src/components/layout/*`: Header (mobile menu), Footer, Wordmark
- `src/app/globals.css`: design tokens and global styles
- `docs/`: catalog guide and owner review checklist
- `assets-original/`: owner's original files, never modified
- `public/images/`: optimized/public copies (logo and LINE QR only for now)

## Rules encoded in data
- Branch data is fixed; gold melting is Naka only; X-Ray on both branches.
- `products.ts` is empty on purpose: only owner-verified products.
- `assets.ts`: photos marked `excluded`/`unused` must never render (monk photo `861445C7`, crucifixes, `9B5DB63F`, duplicates).

## Pages built so far
Home, About, Services, WE BUY, Locations, Contact, Products, Categories, Product detail.
Not built (later phase): dedicated X-Ray and gold-melting pages, customer reviews, floating contact widget. The menu does not link to them; X-Ray and melting are described on /services.

## Preview on your iPhone (real site)
    npm run dev -- -H 0.0.0.0
Connect the iPhone to the same Wi-Fi and open `http://<your-computer-IP>:3000`.

## Image tools (originals are never modified)
- `npm run images:photos`: web copies of the owner's branch photos (denoise, exposure/contrast on luminance only, light sharpening). Needs Python 3 with Pillow, numpy, opencv-python.
- `npm run images:logo`: transparent logo from `brand-assets/original/KAI-RICHY-logo-ORIGINAL.jpeg` (untouched backup). Needs Pillow, numpy, scipy.
- `npm run images:products`: refined product photos from `assets-original/KAI_RICHY_DB_v4` (card/gallery/thumb). Needs Pillow, numpy, opencv-python.
- `python3 scripts/build-inventory.py`: rebuilds docs/IMAGE-INVENTORY-FINAL.csv from the files that exist.
- Internal review of draft products: `NEXT_PUBLIC_CATALOG_PREVIEW=1 npm run dev` (never in production).
- External supporting images: none used, see `docs/EXTERNAL-IMAGES.md`.

## Redesign Edition
This build keeps the V5 Next.js/React application as the source of truth and applies the supplied Redesign visual direction through the final visual layer in `src/app/globals.css`. Do not replace the React routes with the static HTML files from the reference ZIP: those pages do not include the V5 dynamic catalog and product-detail behavior.
