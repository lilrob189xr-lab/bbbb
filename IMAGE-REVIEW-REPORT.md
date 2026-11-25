# Image review report (final, Phase 4)  Nov 18 2026

All owner decisions from the final Phase 4 instruction are applied. Originals are untouched (verified byte-for-byte against the uploaded ZIP).
The single authoritative list is `docs/IMAGE-INVENTORY-FINAL.csv` (74 rows, regenerate with `python3 scripts/build-inventory.py`).

## 1. The 44 / 18 vs 34 / 11 discrepancy: resolved
Both numbers were correct; they counted different things.
- **On disk (owner collection KAI_RICHY_DB_v4):** 44 images in 18 groups. Matches `IMAGE_INDEX.csv` and `PRODUCT_DATABASE.csv`.
- **Previously integrated:** 34 images in 11 groups. The other 10 images in 7 groups (KR-006, 007, 014, 015, 016, 017, STORE) were held for decisions.
- Nothing was lost or discarded. 34 + 10 = 44; 11 + 7 = 18.
- Earlier uploads: 29 image files on disk. `ASSET-INVENTORY.csv` lists 30; the file `7E06C4E2...` (UNSORTED) is **not in the archive** (recorded as MISSING_FROM_ARCHIVE; please re-send if it matters).

## 2. Final status of all 44 owner-collection images
| Group | Images | Final status |
|---|---|---|
| KR-001 Watch, 002, 003 Belt, 004, 005, 008, 009, 010, 011, 012, 013 | 34 | Draft catalog records (hidden until you publish; no name, code, price shown) |
| KR-014 | 1 | Identified as mixed gold pieces on a tray (the owner labels of KR-014 and KR-016 were swapped). Draft catalog record |
| KR-017 | 1 | Corrected: genuine Jubilee diamond ring. **Cropped to the ring only**; the price slip is not published. Draft catalog record. Low resolution (about 250 px wide crop): fine for small cards, not for large display |
| KR-006 | 2 | Corrected: gold frame (owner-confirmed). Photos were stored sideways and are rotated upright. **Unpublished** |
| KR-007 | 2 | Hollow gold frames. **Unpublished** |
| KR-015 | 2 | Buddha amulet pendant (front, inscribed reverse). **Unpublished** |
| KR-016 | 1 | Byte-identical duplicate of KR-003_06 (the belt). Not used twice; kept in the inventory |
| KR-STORE | 1 | **Used on the About page** as a genuine store photo, not as a product |

**Amulet Frames stays empty.** Confirming KR-006 as a gold frame does not publish it anywhere. No product record exists in that category, and the validator rejects publishing without a confirmed name and category.

## 3. Text baked into photos
- Price/spec text cropped out of KR-002_01, KR-008_02, KR-009_01 and KR-017_01 (the originals still contain it; they are never shown).
- Watch photos KR-001_01 to _04 show a handwritten date tag and card numbers on the watch papers. Not edited; these are drafts and hidden. Decide on blurring before publishing.
- KR-STORE shows banknotes on the counter. Used as supplied (owner-approved); crop or replace it if you prefer.

## 4. Photo placement on the site
Home, About, Services, WE BUY, Locations and Contact use only your genuine photographs (`used_on` column in the inventory).
- Not placed: `394AFAAD` (candid selfie). It remains in the inventory and can be added back. This is a design decision, reversible.
- Never shown: monk photo `861445C7`, crucifixes, `9B5DB63F`, the amulet-frame photos, duplicates.
- `78CD1ABB` (metalwork, Naka) is available but not placed.

## 5. Names and brands (still unpublished)
Owner-database names such as Rolex, Cartier, Piaget, Lukfook and Jubilee are kept as internal notes only (`internal.ownerLabelUnverified`). Nothing is shown publicly until you confirm the exact wording.

## 6. Resolution
Owner product photos are video frames (450x800 to 800x600). They suit cards and galleries but not full-width banners, so no product photo is used as a banner.
