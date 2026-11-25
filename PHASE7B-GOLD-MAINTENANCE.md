# Phase 7B — Gold price reference: maintenance guide

Baseline: Phase 7A.2 (approved). Scope: Home and Services gold price block only.

## What is shown
Exactly three prices, all from one announcement: **gold bar buy**, **gold bar sell**, **ornament gold sell**.
The page also shows the **announcement time** (from the Association) and the **last synced time** (our server) separately,
a status badge (Up to date / Not updated), the actual data source, and the approved disclaimer.

Never shown: any ornament "buy" price. The Association publishes a "tax base" for ornament gold, not a buying price, and the
third-party API's `gold.buy` field has an unverified meaning. Do not add it without independent verification.

## Architecture
```
Association -> thai-gold-api (third party, temporary) -> provider -> validate -> /api/gold -> browser
```
| File | Role |
|---|---|
| `src/lib/gold-price/types.ts` | Types, `GOLD_CLIENT_POLICY` (display timing) |
| `src/lib/gold-price/provider-thai-gold-api.ts` | Source adapter + field mapping. **Replace this file to change source.** |
| `src/lib/gold-price/validate.ts` | Validation rules (`GOLD_RULES`), date/time parsing, announcement ordering |
| `src/lib/gold.ts` | Server entry `getGold()` (validates, attaches sync times, 60 s per-instance micro-cache). `provider` selects the active source |
| `src/app/api/gold/route.ts` | JSON endpoint, CDN cache `s-maxage=60, stale-while-revalidate=120` |
| `src/components/brand/GoldPrice.tsx` | UI + browser-side ordering guard and last-verified retention |

### Changing the data source
Write a new `GoldProvider` (see `types.ts`) that returns a `RawCandidate`, then point `provider` in `src/lib/gold.ts` at it.
Validation and UI do not change. `GOLD_API_URL` (https only) overrides the thai-gold-api address.

## Environment variables
| Name | Default | Meaning |
|---|---|---|
| `GOLD_API_URL` | thai-gold-api default | https URL of the source. Non-https values are rejected (the block shows "unavailable"). |
| `GOLD_ORNAMENT_VERIFIED` | unset | Set to `1` ONLY after `scripts/verify-gold.mjs` passes on at least 5 announcements. Until then the ornament row is hidden. |

## Timestamps and caching
`sync.fetchedAt` = when the data was really fetched from the source (moved earlier by the source's own `Age` header if it served a
cached copy). `sync.serverTime` = when the response was built. They differ whenever a cache answered. "Last synced" on the page
shows `fetchedAt`. Cache layers: upstream fetch `no-store` (so its age is known) -> per-instance micro-cache (data younger than
60 s, keeps the original `fetchedAt`) -> CDN (60 s + 120 s stale). The browser adds the HTTP `Age` header of the response to
`serverTime`, so a response replayed by the CDN is aged correctly. To check after deployment: `curl -sI <site>/api/gold` should
show an `age` header on cached hits (if a host strips it, the displayed age can be short by up to ~3 min).

## Persistence limits (read this)
The server is **stateless**. Serverless instances do not share memory and restart at any time, so the server does not remember
a "last verified" price. Consequences:
- A visitor whose tab has already shown a price keeps it (labelled "Not updated" after 15 min of failed syncs, hidden after 2 h).
- A visitor who opens the site while the source is down sees "unavailable", even if someone else saw a price a minute earlier.
- Two instances may briefly serve different announcements. Each response carries its own announcement and sync time, and the
  browser never replaces a newer announcement with an older one.
- Durable server-side storage (e.g. a host KV store) would remove the second limitation. It was not added (extra infrastructure).

## Thresholds and their evidence
All values are PROVISIONAL. Evidence = 7 announced data points (1 from the Association site, 6 from news reports citing it).

| Date | Bar buy / sell | Ornament sell | Spread | Ornament − bar sell |
|---|---|---|---|---|
| 24 Sep 2025 (round 9) | 56,900 / 57,000 | 57,800 | 100 | 800 |
| 26 Feb 2026 (close) | 75,950 / 76,150 | 76,950 | 200 | 800 |
| 5 Mar 2026 | 76,950 / 77,150 | 77,950 | 200 | 800 |
| 19 Mar 2026 (round 56) | 72,700 / 72,900 | 73,700 | 200 | 800 |
| 20 Mar 2026 (round 1) | 72,050 / 72,250 | 73,050 | 200 | 800 |
| 20 Mar 2026 (round 57) | 72,250 / 72,450 | 73,250 | 200 | 800 |
| 22 Nov 2026 (round 1, Association site) | 56,950 / 57,150 | 57,950 | 200 | 800 |

Also observed: up to 57 announcements per day (the API's own example shows round 69); one day's bar sell moved 75,400 -> 72,900 (-3.3%); largest single-round change seen 650 THB (~0.9%).

| Rule | Value | Basis |
|---|---|---|
| Price band | 20,000 – 200,000 THB | Evidence range 56,900–77,150; unit mix-up guard only |
| Bar spread | 0 < (sell−buy)/sell ≤ 1% | Evidence 0.18–0.35% |
| Ornament sell / bar sell | 1.00 – 1.05 (hidden if outside) | Evidence 1.0104–1.0140; offset ≠ 800 is only noted |
| Jump confirmation | > 5% move needs two polls to agree | Evidence: ~0.9% per round, 3–5% per day |
| Warn / hide when sync fails | 15 min / 2 h | Business policy, not market data |
| Future announcement | rejected if > 10 min ahead | Assumption |

Re-check these against real announcements after go-live and adjust `GOLD_RULES` / `GOLD_CLIENT_POLICY`.

## Field mapping status (thai-gold-api -> site)
| API field | Used as | Status |
|---|---|---|
| `price.gold_bar.buy` | bar buy | UNVERIFIED against live API |
| `price.gold_bar.sell` | bar sell | UNVERIFIED against live API |
| `price.gold.sell` | ornament sell | UNVERIFIED against live API (hidden until `GOLD_ORNAMENT_VERIFIED=1`) |
| `update_date`, `update_time` | announcement date / time / round | Format UNVERIFIED |
| `price.gold.buy` | not read | Meaning unverified |

## Go-live checklist
1. On a machine with internet: `npm run build` and fix anything it reports (not run in the build environment).
2. Run `scripts/verify-gold.mjs` for at least 5 different announcements (read the figures from goldtraders.or.th yourself):
   `node scripts/verify-gold.mjs --date 22/11/2569 --time 09:09 --round 1 --bar-buy 56,950.00 --bar-sell 57,150.00 --ornament-sell 57,950.00 --log verify-gold-log.json`
3. Confirm the page shows the same announcement date/time as the Association site, on iPhone Safari and desktop.
4. If all 5 pass, set `GOLD_ORNAMENT_VERIFIED=1`. If any fail, keep it unset and report the mismatches.
5. Send `docs/GOLD-ACCESS-REQUEST-TH.md` (filled in) to the Association; replace the provider when they answer.

## Known limitations
- The data source is a third-party service without a service guarantee; it may change or stop.
- The Association's terms of use were not verified. Written permission has been requested (see the request draft).
- Prices load in the browser after the page opens (not in the initial HTML).
- The display is "latest announced", not real-time: the Association announces many times a day and we poll every 2 minutes.
