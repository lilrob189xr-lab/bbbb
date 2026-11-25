# Redesign Edition — integration notes

## Source of truth
- Application framework and behavior: V5 (Next.js App Router, React, TypeScript).
- Visual reference: `KAI_RICHY_Redesign.zip` (static HTML/CSS reference only).
- The static HTML files were not copied over the V5 routes.

## Applied in this integration
- Deep forest / forest green surfaces, ivory editorial panels, champagne-gold rules and accents.
- Lighter display typography, generous section spacing, square outlined actions and thin borders.
- Shared header, mobile navigation and footer colors updated through CSS only.
- Existing V5 page structures restyled, including Home, About, Services, WE BUY, Locations, Contact, Categories, Products and Product Detail.
- Catalog card, filter, empty-state and gallery surfaces restyled without changing their React state or event handlers.

## Added in the React layer (features from the Redesign that V5 lacked)
- **TH / EN switch** (`components/i18n/LangProvider.tsx`): Thai by default (`DEFAULT_LANG`), choice saved in `localStorage` (`kr-lang`), `<html lang>` follows it. Only copy that exists in English in the Redesign is translated (menu, hero, buttons, branch status, footer links); everything else stays Thai. FAQ and long copy have no owner-approved English yet.
- **LINE button copies a greeting** (`components/i18n/LineLink.tsx`): the LINE URL cannot pre-fill a message, so tapping copies a short greeting (TH or EN) and shows a toast. Used in the header, mobile menu, dock, Contact CTA, WE BUY, Contact page and inquiry actions.
- **Open / closed status in Phuket time** (`components/i18n/OpenStatus.tsx`): from `openMin` / `closeMin` in `branches.ts`. Shown on Home branch cards, Locations, Contact and WE BUY. Empty until mounted so there is no hydration mismatch.
- **Mobile dock** (`components/layout/MobileDock.tsx`): LINE + call each branch, phones only (<900 px).
- iPhone safe-area support (`viewportFit: cover`, header and menu respect the notch).
- Data (additive only): `branches.ts` gets `hoursEn`, `openMin`, `closeMin`; `navigation.ts` gets `labelEn`. Existing fields and values are unchanged. If you change a branch's `hours`, change `openMin` / `closeMin` too.

## Preserved without modification
- `src/data/**` and `src/lib/catalog.ts` (product data, category definitions, draft gating and catalog rules).
- Catalog interactions (filters, gallery, product navigation), page structure and routes.
- Contact, WE BUY and service data. Branch data only gained fields (see below).
- Navigation destinations, footer destinations, page metadata and SEO configuration.
- Original product and branch image assets.

## Not taken from the Redesign (needs owner decision)
- English About copy ("A Decade of Timeless Elegance", "Since 2016", "The first jeweler at Central Phuket."): the Redesign README flags the wording as awaiting confirmation, so it is not published here.
- Branch name stays "Central Phuket Floresta" (V5), not "Central Phuket" (Redesign).
- The Redesign's `tel:tel:+66…` links on its Locations page are a bug; V5's correct `tel:+66…` values are used.

## Verification status
- CSS parsed with `tinycss2`: 0 syntax errors.
- Confirmed all key catalog, gallery, navigation, data and draft-protection files remain present.
- Full `npm run typecheck`, `npm run validate:catalog` and `npm run build` could not be completed in this environment because dependencies were not installed; `npm install` timed out and `next` / React type packages are unavailable. Run the commands locally after `npm install` before deployment.
- No deployment performed. This remains a review build.
