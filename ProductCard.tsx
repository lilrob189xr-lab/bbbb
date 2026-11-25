import Link from "next/link";
import Image from "next/image";
import type { CardModel } from "@/lib/catalog";
import DiamondMark from "./DiamondMark";
import { T } from "@/components/i18n/LangProvider";

export default function ProductCard({ item, priority = false }: { item: CardModel; priority?: boolean }) {
  return (
    <article className={`pcard${item.isDraft ? " pcard--draft" : ""}`}>
      <Link href={`/products/${item.slug}`} className="pcard__media" aria-label={item.title}>
        {item.image ? (
          <Image
            src={item.image.card?.src ?? item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
            style={{ objectFit: "cover", objectPosition: item.image.focus ?? "center" }}
            priority={priority}
          />
        ) : (
          <span className="placeholder"><DiamondMark /></span>
        )}
        {item.isDraft && <span className="badge-draft">ฉบับร่าง · รอเจ้าของร้านยืนยัน</span>}
      </Link>
      <div className="pcard__body">
        {item.categoryTh && <p className="pcard__cat label"><T th={item.categoryTh} en={item.categoryEn ?? undefined} /></p>}
        <h3 className="pcard__title"><Link href={`/products/${item.slug}`}>{item.title}</Link></h3>
        {!item.isDraft && <Link href={`/products/${item.slug}`} className="link-gold pcard__cta"><T th="สอบถามสินค้า" en="Ask about this item" /></Link>}
      </div>
    </article>
  );
}
