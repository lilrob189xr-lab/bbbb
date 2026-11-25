"use client";

import { useState } from "react";
import Link from "next/link";
import { branches } from "@/data/branches";
import { T, useLang } from "@/components/i18n/LangProvider";
import OpenStatus from "@/components/i18n/OpenStatus";

/**
 * Phase 7C. One Google My Maps embed with both branches, plus a card per branch.
 * Map URL: supplied and confirmed by the owner (Google My Maps, public). No coordinates are stored or created here.
 * Branch facts (name, address, hours, phone, Google Maps link) come from data/branches.ts, the single source.
 */
export const KAI_RICHY_MY_MAP_URL = "https://www.google.com/maps/d/embed?mid=16LjnKfR7cfWem6BLB3TcPYZX2zOkCVY&ehbc=2E312F";

const MAP_TITLE = {
  th: "แผนที่สาขา KAI RICHY ภูเก็ต",
  en: "Map of the KAI RICHY and RICHY GOLD branches",
} as const;

export default function KaiRichyMapSection() {
  const { lang } = useLang();
  // On touch screens the map starts covered, so a finger scrolling the page does not get trapped inside the map.
  const [active, setActive] = useState(false);

  return (
    <section id="map" className="section section--ivory kmap" aria-label={MAP_TITLE[lang]}>
      <div className="container">
        <div className="kmap__frame">
          <iframe
            src={KAI_RICHY_MY_MAP_URL}
            title={MAP_TITLE[lang]}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          {!active && (
            <button type="button" className="kmap__activate" onClick={() => setActive(true)}>
              <span><T th="แตะเพื่อใช้งานแผนที่" en="Tap to use the map" /></span>
            </button>
          )}
        </div>

        <div className="kmap__cards">
          {branches.map((b) => (
            <article key={b.id} className="kmap__card" aria-labelledby={`kmap-${b.id}`}>
              <p className="label gold"><T th={`สาขา ${b.number}`} en={`Branch ${b.number}`} /></p>
              <h3 id={`kmap-${b.id}`}>{b.brandName}</h3>
              <p className="bcard__name">{b.nameTh}</p>
              <dl className="facts">
                <dt><T th="ที่อยู่" en="Address" /></dt>
                <dd>{b.address}</dd>
                <dt><T th="เวลาเปิดทำการ" en="Opening hours" /></dt>
                <dd><T th={b.hours} en={b.hoursEn} /><OpenStatus openMin={b.openMin} closeMin={b.closeMin} /></dd>
                <dt><T th="โทรศัพท์" en="Telephone" /></dt>
                <dd><a href={b.phoneHref}>{b.phoneDisplay}</a></dd>
              </dl>
              <div className="inquiry">
                <a className="btn btn--primary" href={b.phoneHref}><T th="โทร" en="Call" /> {b.phoneDisplay}</a>
                <a className="btn btn--secondary" href={b.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <T th="นำทาง" en="Get directions" /><span className="sr-only"> {b.brandName}</span>
                </a>
                <Link className="link-gold bcard__more" href={`/locations/${b.id}`}>
                  <T th="ดูรายละเอียดสาขา" en="Branch details" /><span className="sr-only"> {b.brandName}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
