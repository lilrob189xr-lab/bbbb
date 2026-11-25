import { branches } from "@/data/branches";
import { T } from "@/components/i18n/LangProvider";
import LineLink from "@/components/i18n/LineLink";

export default function ContactCta() {
  return (
    <section className="section section--green cta">
      <div className="container cta__inner">
        <p className="label" style={{ color: "var(--gold-400)" }}>Contact</p>
        <h2><T th="สอบถามสินค้าและบริการ" en="Product & Service Enquiries" /></h2>
        <p className="reading"><T th="ติดต่อเราทาง LINE หรือโทรหาสาขาที่สะดวก" en="Reach us on LINE or call the branch most convenient for you." /></p>
        <div className="inquiry inquiry--center">
          <LineLink className="btn btn--on-green"><T th="สอบถามทาง LINE" en="Enquire on LINE" /></LineLink>
          {branches.map((b) => (
            <a key={b.id} className="btn btn--on-green" href={b.phoneHref}>
              <T th="โทร" en="Call" /> {b.brandName} {b.phoneDisplay}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
