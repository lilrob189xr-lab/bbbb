"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { T } from "@/components/i18n/LangProvider";
import { GOLD_CLIENT_POLICY as P, type GoldApiOk, type GoldSnapshot } from "@/lib/gold-price/types";
import { dataAgeMs, decideIncoming, isGoldOk, parseAgeHeader, serverNowMs } from "@/lib/gold-price/validate";

/** `cdnAgeMs` = how long a CDN had held this response when it reached us (HTTP `Age`), so replayed responses are not mistaken for fresh ones. */
type Held = { payload: GoldApiOk; recvPerf: number; cdnAgeMs: number };

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const p2 = (n: number) => String(n).padStart(2, "0");

/** Thailand time (UTC+7) parts for an epoch ms. */
function bkk(ms: number) {
  const d = new Date(ms + 7 * 3600e3);
  return { y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes() };
}
const dateTh = (y: number, mo: number, d: number) => `${p2(d)}/${p2(mo)}/${y + 543}`;
const dateEn = (y: number, mo: number, d: number) => `${d} ${MONTHS_EN[mo - 1]} ${y}`;

/** Reference gold price (Home + Services). Prices come only from /api/gold; nothing is hard-coded. */
export default function GoldPrice({ variant }: { variant: "home" | "services" }) {
  const [held, setHeld] = useState<Held | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tick, setTick] = useState(0);
  const heldRef = useRef<Held | null>(null);
  const pendingRef = useRef<GoldApiOk | null>(null);

  useEffect(() => {
    let alive = true;
    const ageNow = (h: Held) => dataAgeMs(h.payload.sync, h.cdnAgeMs, performance.now() - h.recvPerf);
    const accept = (payload: GoldApiOk, cdnAgeMs: number) => {
      const h: Held = { payload, recvPerf: performance.now(), cdnAgeMs };
      heldRef.current = h;
      pendingRef.current = null;
      if (alive) setHeld(h);
    };
    const load = async () => {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), P.fetchTimeoutMs);
      try {
        const res = await fetch("/api/gold", { cache: "no-store", signal: ctl.signal });
        const json: unknown = await res.json();
        if (!res.ok || !isGoldOk(json)) throw new Error("bad");
        const cdnAgeMs = parseAgeHeader(res.headers.get("age"));
        const cur = heldRef.current;
        // A held price older than hideAfterMs is no longer shown, so it cannot be used to doubt a newer announcement.
        const decision = decideIncoming(cur ? { payload: cur.payload, expired: ageNow(cur) > P.hideAfterMs } : null, pendingRef.current, json, P.jumpConfirmRatio);
        if (decision === "accept") accept(json, cdnAgeMs);
        else if (decision === "pend") pendingRef.current = json; // unusually large move: show it only when a later poll agrees (the server is stateless, so confirmation happens here)
        /* "ignore": older announcement, or an older copy of the same one. Keep what is held. */
      } catch {
        /* keep the last verified data; its age keeps growing and the page labels it */
      } finally {
        clearTimeout(t);
        if (alive) setLoaded(true);
      }
    };
    load();
    const id = setInterval(() => { if (document.visibilityState === "visible") load(); }, P.refreshMs);
    const clock = setInterval(() => setTick((n) => n + 1), 30_000);
    const onVis = () => {
      const h = heldRef.current;
      if (document.visibilityState === "visible" && (!h || performance.now() - h.recvPerf > P.refreshMs)) load();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => { alive = false; clearInterval(id); clearInterval(clock); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  void tick; // re-render so ages stay current
  const nowPerf = loaded && held ? performance.now() : 0;
  let data: GoldSnapshot | null = null;
  let ageMs = 0, syncMs = 0, nowMs = 0;
  if (held) {
    syncMs = Date.parse(held.payload.sync.fetchedAt); // when the data was really fetched, not when the response was built
    const elapsed = nowPerf - held.recvPerf;
    nowMs = serverNowMs(held.payload.sync, held.cdnAgeMs, elapsed);
    ageMs = dataAgeMs(held.payload.sync, held.cdnAgeMs, elapsed);
    if (ageMs <= P.hideAfterMs) data = held.payload.data;
  }
  const stale = !!data && ageMs > P.warnAfterMs;

  const a = data?.announcement;
  const ad = a ? a.dateISO.split("-").map(Number) : [0, 0, 0];
  const annTh = a ? `${dateTh(ad[0], ad[1], ad[2])} ${a.time} น.${a.round ? ` (ครั้งที่ ${a.round})` : ""}` : "";
  const annEn = a ? `${dateEn(ad[0], ad[1], ad[2])}, ${a.time}${a.round ? ` (round ${a.round})` : ""}` : "";
  const s = held ? bkk(syncMs) : null;
  const syncTh = s ? `${dateTh(s.y, s.mo, s.d)} ${p2(s.h)}:${p2(s.mi)} น.` : "";
  const syncEn = s ? `${dateEn(s.y, s.mo, s.d)}, ${p2(s.h)}:${p2(s.mi)}` : "";
  const today = held ? bkk(nowMs) : null;
  const notToday = !!(a && today && !stale && a.dateISO !== `${today.y}-${p2(today.mo)}-${p2(today.d)}`);

  const items = data
    ? [
        { key: "bar-buy", th: "ทองคำแท่ง", en: "Gold bar", act: { th: "รับซื้อ", en: "We buy" }, v: data.bar.buy },
        { key: "bar-sell", th: "ทองคำแท่ง", en: "Gold bar", act: { th: "ขายออก", en: "Sell" }, v: data.bar.sell },
        ...(data.ornament.sell ? [{ key: "orn-sell", th: "ทองรูปพรรณ", en: "Ornament gold", act: { th: "ขายออก", en: "Sell" }, v: data.ornament.sell }] : []),
      ]
    : [];

  return (
    <section className={`section section--ivory gp gp--${variant}`} aria-labelledby={`gp-h-${variant}`}>
      <div className="container gp__wrap">
        <header className="gp__head">
          <p className="label">Gold Price Reference</p>
          <h2 id={`gp-h-${variant}`} className="gp__title"><T th="ราคาทองคำอ้างอิง" en="Reference Gold Price" /></h2>
          {data && a && (
            <dl className="gp__status">
              <div>
                <dt><T th="ประกาศล่าสุดจากสมาคม" en="Latest announcement" /></dt>
                <dd><T th={annTh} en={annEn} /></dd>
              </div>
              <div>
                <dt><T th="ซิงก์ข้อมูลล่าสุด" en="Last synced" /></dt>
                <dd>
                  <T th={syncTh} en={syncEn} />{" "}
                  <span className={`gp__badge ${stale ? "gp__badge--stale" : "gp__badge--ok"}`}>
                    <T th={stale ? "ไม่ได้อัปเดต" : "ปกติ"} en={stale ? "Not updated" : "Up to date"} />
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </header>

        <div className="gp__main">
          {!loaded && <p className="gp__msg" role="status"><T th="กำลังโหลดราคาทองคำ…" en="Loading gold prices…" /></p>}

          {loaded && !data && (
            <p className="gp__warn" role="status">
              <T th="ขณะนี้ไม่สามารถแสดงราคาทองคำได้ กรุณาสอบถามราคาล่าสุดกับสาขา" en="Gold prices are unavailable at the moment. Please ask a branch for the latest price." />
            </p>
          )}

          {data && stale && (
            <p className="gp__warn" role="status">
              <T
                th={`ไม่สามารถอัปเดตราคาได้ในขณะนี้ ราคาด้านล่างเป็นข้อมูลที่ประกาศเมื่อ ${annTh} ไม่ใช่ราคาปัจจุบัน`}
                en={`Prices could not be updated right now. The prices below were announced on ${annEn} and are not current.`}
              />
            </p>
          )}

          {data && notToday && (
            <p className="gp__note">
              <T th={`ยังไม่มีประกาศใหม่ตั้งแต่วันที่ ${dateTh(ad[0], ad[1], ad[2])}`} en={`No newer announcement since ${dateEn(ad[0], ad[1], ad[2])}`} />
            </p>
          )}

          {items.length > 0 && (
            <dl className={`gp__list gp__list--${items.length}${stale ? " gp__list--stale" : ""}`}>
              {items.map((g) => (
                <div className="gp__row" key={g.key}>
                  <dt>
                    <span className="gp__what"><T th={g.th} en={g.en} /> <span className="gp__pct en">96.5%</span></span>
                    <span className="gp__act"><T th={g.act.th} en={g.act.en} /></span>
                  </dt>
                  <dd><span className="en">{g.v}</span> <span className="gp__u"><T th="บาท" en="THB" /></span></dd>
                </div>
              ))}
            </dl>
          )}

          <p className="gp__fine">
            {data && (
              <>
                <T th="แหล่งข้อมูล: " en="Source: " />
                <a className="link-gold" href={data.source.url} target="_blank" rel="noopener noreferrer">
                  <T th={data.source.name} en={data.source.nameEn} />
                </a>
                {data.source.thirdParty && (
                  <T th={` (ดึงผ่าน ${data.source.via} บริการของบุคคลที่สาม)`} en={` (retrieved via ${data.source.via}, a third-party service)`} />
                )}
                {" · "}
              </>
            )}
            <T
              th="ราคาที่แสดงเป็นราคาอ้างอิงจากสมาคมค้าทองคำแห่งประเทศไทย ราคาเสนอซื้อจริงขึ้นอยู่กับประเภทสินค้า น้ำหนัก เปอร์เซ็นต์ทอง และผลการตรวจสอบจากทางร้าน"
              en="Prices shown are reference prices from the Gold Traders Association of Thailand. Actual purchase offers depend on the type of item, weight, gold purity and the shop's inspection results."
            />
            {variant === "home" && (
              <>
                {" "}
                <Link className="link-gold" href="/services#gold-precious-metals"><T th="ดูบริการรับซื้อทองคำและโลหะมีค่า" en="View our gold & precious metals buying service" /></Link>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
