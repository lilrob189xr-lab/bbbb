import Link from "next/link";
import { T } from "@/components/i18n/LangProvider";

export interface NavTarget { slug: string; title: string }

/** Back to the catalog (same category when known) and previous / next product. */
export default function ProductNav({ prev, next, backHref }: { prev?: NavTarget; next?: NavTarget; backHref: string }) {
  return (
    <nav className="pnav" aria-label="เลื่อนดูสินค้า">
      {prev ? <Link href={`/products/${prev.slug}`} className="pnav__item"><span className="label"><T th="ก่อนหน้า" en="Previous" /></span><span>{prev.title}</span></Link> : <span />}
      <Link href={backHref} className="btn btn--secondary"><T th="กลับไปหน้าสินค้า" en="Back to collection" /></Link>
      {next ? <Link href={`/products/${next.slug}`} className="pnav__item pnav__item--next"><span className="label"><T th="ถัดไป" en="Next" /></span><span>{next.title}</span></Link> : <span />}
    </nav>
  );
}
