import type { Branch } from "@/data/branches";
import { T } from "@/components/i18n/LangProvider";
import OpenStatus from "@/components/i18n/OpenStatus";

/** Branch card for a service page. Renders only if the branch offers the service (flags live in branches.ts). */
export default function BranchServiceCard({ branch: b, service }: { branch: Branch; service: "xray" | "melting" }) {
  const available = service === "xray" ? b.services.xray : b.services.goldMelting;
  if (!available) return null;
  return (
    <article className="mini mini--large contact-card svc-branch">
      <p className="label gold">สาขา {b.number}</p>
      <h3>{b.brandName}</h3>
      <p>{b.nameTh}</p>
      <p className="svc-branch__ok"><span aria-hidden="true">✓</span> <T th="มีบริการที่สาขานี้" en="Available at this branch" /></p>
      <dl className="facts">
        <dt><T th="ที่อยู่" en="Address" /></dt><dd>{b.address}</dd>
        <dt><T th="เวลาเปิดทำการ" en="Hours" /></dt><dd><T th={b.hours} en={b.hoursEn} /></dd>
        <dt><T th="สถานะ" en="Status" /></dt><dd><OpenStatus openMin={b.openMin} closeMin={b.closeMin} /></dd>
        <dt><T th="โทรศัพท์" en="Phone" /></dt><dd><a href={b.phoneHref}>{b.phoneDisplay}</a></dd>
      </dl>
      <div className="inquiry">
        <a className="btn btn--primary" href={b.phoneHref}><T th="โทร" en="Call" /> {b.phoneDisplay}</a>
        <a className="btn btn--secondary" href={b.mapsUrl} target="_blank" rel="noopener noreferrer"><T th="เปิด Google Maps" en="Open Google Maps" /></a>
      </div>
    </article>
  );
}
