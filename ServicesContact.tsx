import { branches } from "@/data/branches";
import { servicesContact } from "@/data/services";
import { T } from "@/components/i18n/LangProvider";
import LineLink from "@/components/i18n/LineLink";

/** Services-page contact block: owner-approved CONTACT US copy + the existing verified LINE and branch phone links. */
export default function ServicesContact() {
  return (
    <section className="section section--green cta" aria-labelledby="svc-contact-h">
      <div className="container cta__inner">
        <p className="label" style={{ color: "var(--gold-400)" }}>{servicesContact.label}</p>
        <h2 id="svc-contact-h"><T th={servicesContact.title.th} en={servicesContact.title.en} /></h2>
        <p className="reading"><T th={servicesContact.body.th} en={servicesContact.body.en} /></p>
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
