import type { Metadata } from "next";
import Link from "next/link";
import { branches } from "@/data/branches";
import { T } from "@/components/i18n/LangProvider";
import LineLink from "@/components/i18n/LineLink";
import { photos } from "@/data/photos";
import Photo from "@/components/ui/Photo";
import { buyCategories, buySteps, faqGroups } from "@/data/webuy";
import OpenStatus from "@/components/i18n/OpenStatus";
import SectionHead from "@/components/ui/SectionHead";

export const metadata: Metadata = {
  title: "WE BUY รับซื้อ",
  description: "KAI RICHY รับซื้อทองคำ เครื่องประดับเพชร เครื่องประดับแบรนด์หรู อัญมณีและพลอย พระเครื่องและกรอบพระ สอบถามทาง LINE หรือโทรหาสาขา",
};

export default function WeBuyPage() {
  return (
    <div className="air">
      {/* 1. Hero */}
      <section className="hero wb-hero">
        <div className="container hero__grid">
          <div>
            <p className="label hero__eyebrow en">KAI RICHY</p>
            <h1 className="wb-hero__title en">WE BUY</h1>
            <p className="wb-hero__th">รับซื้อทองคำ เพชร และเครื่องประดับ</p>
            <p className="hero__lead">สอบถามรายการสินค้าที่สนใจขายได้ทาง LINE หรือโทรหาสาขา</p>
            <div className="inquiry">
              <LineLink className="btn btn--primary"><T th="สอบถามทาง LINE" en="Enquire on LINE" /></LineLink>
              <Link className="btn btn--secondary" href="/locations"><T th="สาขาของเรา" en="Our Branches" /></Link>
            </div>
          </div>
          <div className="wb-hero__media frame-offset">
            <Photo photo={photos["636A36E8"]} ratio="4 / 5" priority sizes="(min-width:1024px) 360px, 90vw" focus="center 30%" tag="หน้าร้านริชชี่โกลด์หลอมทอง" />
          </div>
        </div>
      </section>

      {/* 2. What We Buy */}
      <section className="section section--ivory">
        <div className="container">
          <SectionHead label="What We Buy" title="สินค้าที่เรารับซื้อ" />
          <ul className="wtiles">
            {buyCategories.map((c, i) => (
              <li key={c.id} className="wtile">
                <span className="tile__no en">{String(i + 1).padStart(2, "0")}</span>
                <span className="tile__th">{c.nameTh}</span>
                <span className="tile__en en">{c.nameEn}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="section section--white">
        <div className="container">
          <SectionHead label="How It Works" title="ขั้นตอนการสอบถาม" />
          <ol className="steps">
            {buySteps.map((s) => (
              <li key={s.no} className="step">
                <span className="step__no en">{s.no}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Contact */}
      <section className="section section--green">
        <div className="container">
          <SectionHead label="Contact" title="ติดต่อสอบถาม" onGreen>
            <p>ติดต่อเราทาง LINE หรือโทรศัพท์</p>
          </SectionHead>
          <div className="inquiry" style={{ marginBottom: "var(--sp-6)" }}>
            <LineLink className="btn btn--on-green"><T th="เปิด LINE" en="Open LINE" /></LineLink>
          </div>
          <div className="bgrid wb-contact">
            {branches.map((b) => (
              <div key={b.id} className="wb-branch">
                <p className="label" style={{ color: "var(--gold-400)" }}>สาขา {b.number}</p>
                <h3>{b.brandName}</h3>
                <p>{b.nameTh}</p>
                <p>เวลาเปิดทำการ {b.hours}</p>
                <OpenStatus openMin={b.openMin} closeMin={b.closeMin} />
                <p><a className="wb-phone" href={b.phoneHref}>{b.phoneDisplay}</a></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="section section--ivory">
        <div className="container faq-layout">
          <div className="faq-aside">
            <SectionHead label="FAQ" title="คำถามที่พบบ่อย">
              <p>ข้อมูลด้านล่างอ้างอิงจากรายละเอียดที่ร้านยืนยันแล้ว หากต้องการทราบเพิ่มเติมสำหรับสินค้าของคุณ กรุณาติดต่อสาขาโดยตรง</p>
            </SectionHead>
            <div className="inquiry">
              <LineLink className="btn btn--primary"><T th="สอบถามทาง LINE" en="Enquire on LINE" /></LineLink>
              <Link className="btn btn--secondary" href="/locations"><T th="ดูสาขาของเรา" en="Our Branches" /></Link>
            </div>
          </div>
          <div>
            {faqGroups.map((g, gi) => (
              <div key={g.title} className="faq-group">
                <h3 className="label faq-group__title">{g.title}</h3>
                <div className="faq">
                  {g.items.map((f, i) => (
                    <details key={f.q} className="faq__item" open={gi === 0 && i === 0}>
                      <summary>{f.q}</summary>
                      <div className="faq__a">{f.a.map((t) => <p key={t}>{t}</p>)}</div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
