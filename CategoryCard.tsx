import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/data/categories";
import type { ProductImage } from "@/data/products";
import DiamondMark from "./DiamondMark";

export default function CategoryCard({ category, count, cover }: { category: Category; count: number; cover: ProductImage | null }) {
  if (!cover) {
    return (
      <Link href={`/products?category=${category.slug}`} className="tile">
        <span className="tile__th">{category.nameTh}</span>
        <span className="tile__en en">{category.nameEn}</span>
        <span className="ccard__count">{count > 0 ? `${count} รายการ` : "ยังไม่มีสินค้าที่พร้อมแสดง"}</span>
      </Link>
    );
  }
  return (
    <Link href={`/products?category=${category.slug}`} className="ccard">
      <span className="ccard__media">
        {cover ? (
          <Image src={cover.src} alt={cover.alt} fill sizes="(min-width:1024px) 33vw, 50vw" style={{ objectFit: "cover" }} />
        ) : (
          <span className="placeholder placeholder--green"><DiamondMark size={44} /></span>
        )}
      </span>
      <span className="ccard__body">
        <span className="ccard__th">{category.nameTh}</span>
        <span className="ccard__en en">{category.nameEn}</span>
        <span className="ccard__count">{count > 0 ? `${count} รายการ` : "ยังไม่มีสินค้าที่พร้อมแสดง"}</span>
      </span>
    </Link>
  );
}
