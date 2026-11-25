#!/usr/bin/env node
/**
 * Gold price verification (Phase 7B). Needs Node 18+ and internet access. No dependencies.
 *
 * Compares what thai-gold-api returns with figures that a PERSON read from the Gold Traders Association website
 * (https://www.goldtraders.or.th/) at about the same time. This script does not fetch the Association website.
 *
 * Usage (one announcement per run; do at least 5 runs on different announcements):
 *   node scripts/verify-gold.mjs --date 22/11/2569 --time 09:09 --round 1 \
 *        --bar-buy 56,950.00 --bar-sell 57,150.00 --ornament-sell 57,950.00
 * Options: --url <api url> (default: GOLD_API_URL or the built-in default), --log verify-gold-log.json (append result)
 * Exit code 0 = every compared field matched, 1 = mismatch or API problem.
 */
import fs from "node:fs";

const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : undefined; };
const url = arg("url") || process.env.GOLD_API_URL || "https://api.chnwt.dev/thai-gold-api/latest";
const official = {
  date: arg("date"), time: arg("time"), round: arg("round"),
  barBuy: arg("bar-buy"), barSell: arg("bar-sell"), ornamentSell: arg("ornament-sell"),
};
if (!official.barBuy || !official.barSell || !official.ornamentSell || !official.date || !official.time) {
  console.error("Missing arguments. Required: --date --time --bar-buy --bar-sell --ornament-sell (optional: --round)");
  process.exit(2);
}
const num = (s) => (s == null ? null : Number(String(s).replace(/,/g, "")));

let json;
try {
  const res = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  json = await res.json();
} catch (e) {
  console.error("API request failed:", e.message);
  process.exit(1);
}
const r = json?.response ?? {};
const api = {
  date: r.update_date, timeRaw: r.update_time,
  barBuy: r.price?.gold_bar?.buy, barSell: r.price?.gold_bar?.sell, ornamentSell: r.price?.gold?.sell,
};
const apiTime = /(\d{1,2})[:.](\d{2})/.exec(String(api.timeRaw ?? ""));
const apiRound = /ครั้งที่\s*(\d{1,3})/.exec(String(api.timeRaw ?? ""));
const hhmm = apiTime ? `${apiTime[1].padStart(2, "0")}:${apiTime[2]}` : null;

const rows = [
  ["announcement date", official.date, api.date, official.date === api.date],
  ["announcement time", official.time, hhmm, official.time.padStart(5, "0") === hhmm],
  ...(official.round ? [["round (ครั้งที่)", official.round, apiRound?.[1] ?? null, official.round === apiRound?.[1]]] : []),
  ["gold bar buy (gold_bar.buy)", official.barBuy, api.barBuy, num(official.barBuy) === num(api.barBuy)],
  ["gold bar sell (gold_bar.sell)", official.barSell, api.barSell, num(official.barSell) === num(api.barSell)],
  ["ornament sell (gold.sell)", official.ornamentSell, api.ornamentSell, num(official.ornamentSell) === num(api.ornamentSell)],
];
console.log(`API: ${url}\nraw update_time: ${JSON.stringify(api.timeRaw)}\n`);
for (const [k, o, a, ok] of rows) console.log(`${ok ? "MATCH   " : "MISMATCH"}  ${k.padEnd(30)} official=${o}  api=${a}`);
console.log(`\nINFO (not used by the website): gold.buy = ${r.price?.gold?.buy}  <- meaning unverified; do not display`);
const pass = rows.every((x) => x[3]);
console.log(pass ? "\nRESULT: PASS for this announcement" : "\nRESULT: FAIL for this announcement (do not set GOLD_ORNAMENT_VERIFIED=1)");

const log = arg("log");
if (log) {
  let prev = []; try { prev = JSON.parse(fs.readFileSync(log, "utf8")); } catch {}
  prev.push({ checkedAt: new Date().toISOString(), pass, rows: rows.map(([k, o, a, ok]) => ({ k, official: o, api: a, ok })), rawUpdateTime: api.timeRaw });
  fs.writeFileSync(log, JSON.stringify(prev, null, 2));
  const passes = prev.filter((x) => x.pass).length;
  console.log(`Log: ${log} now has ${prev.length} run(s), ${passes} passed. Need >= 5 passing runs on different announcements.`);
}
process.exit(pass ? 0 : 1);
