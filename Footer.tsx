import Link from "next/link";
import Image from "next/image";
import { branches } from "@/data/branches";
import { contact } from "@/data/contact";
import { brand } from "@/data/brand";
import { T } from "@/components/i18n/LangProvider";

const quickLinks = [
  { label: "สินค้าและเครื่องประดับ", en: "Collection", href: "/products" },
  { label: "หมวดหมู่สินค้า", en: "Categories", href: "/categories" },
  { label: "สินค้าและบริการ", en: "Services", href: "/services" },
  { label: "WE BUY รับซื้อ", en: "We Buy", href: "/we-buy" },
  { label: "รู้จักเรา", en: "About", href: "/about" },
  { label: "สาขาของเรา", en: "Branches", href: "/locations" },
  { label: "ติดต่อเรา", en: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label="KAI RICHY หน้าแรก">
              <Image src={brand.logoArtwork.src} alt={brand.logoArtwork.alt} width={brand.logoArtwork.width} height={brand.logoArtwork.height} sizes="132px" />
            </Link>
            <p>{brand.taglineTh}</p>
          </div>

          {branches.map((b) => (
            <section key={b.id} className="footer-branch" aria-label={b.nameTh}>
              <span className="label">สาขา {b.number}</span>
              <h3>{b.brandName}</h3>
              <address>
                <strong>{b.nameTh}</strong>
                {b.locationNote && <><br />{b.locationNote}</>}
                <br />
                {b.address}
              </address>
              <dl>
                <dt>เวลาเปิดทำการ</dt>
                <dd>{b.hours}</dd>
                <dt>โทรศัพท์</dt>
                <dd><a href={b.phoneHref}>{b.phoneDisplay}</a></dd>
                <dt>แผนที่</dt>
                <dd><a href={b.mapsUrl} target="_blank" rel="noopener noreferrer">เปิดใน Google Maps</a></dd>
              </dl>
            </section>
          ))}

          <nav className="footer-links" aria-label="ลิงก์ด่วน">
            <h3>เมนู</h3>
            <ul>
              {quickLinks.map((l) => (
                <li key={l.href}><Link href={l.href}><T th={l.label} en={l.en} /></Link></li>
              ))}
              <li><a href={contact.line.url} target="_blank" rel="noopener noreferrer">LINE</a></li>
              <li><a href={contact.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">© {new Date().getFullYear()} KAI RICHY. สงวนลิขสิทธิ์</div>
      </div>
    </footer>
  );
}
