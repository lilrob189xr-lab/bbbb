import Link from "next/link";
import type { Category } from "@/data/categories";

/** Typographic tile: no image needed, so it stays elegant while photos are pending. */
export default function CategoryTile({ category, index }: { category: Category; index: number }) {
  return (
    <Link href={`/products?category=${category.slug}`} className="tile">
      <span className="tile__no en">{String(index + 1).padStart(2, "0")}</span>
      <span className="tile__th">{category.nameTh}</span>
      <span className="tile__en en">{category.nameEn}</span>
    </Link>
  );
}
