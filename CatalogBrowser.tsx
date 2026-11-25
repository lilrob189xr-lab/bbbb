"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CardModel } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import { useLang } from "@/components/i18n/LangProvider";

interface Props {
  items: CardModel[];
  categories: { slug: string; nameTh: string; nameEn: string }[];
  /** null = product-type filter hidden (types not yet confirmed by the owner) */
  types: { id: string; nameTh: string }[] | null;
  /** keep ?category= in the address bar (off in the static review preview) */
  syncUrl?: boolean;
}

type Sort = "name-asc" | "name-desc" | "category";

export default function CatalogBrowser({ items, categories, types, syncUrl = true }: Props) {
  const { lang } = useLang();
  /** Thai text is unchanged; English only where the owner approved it. */
  const L = (th: string, en: string) => (lang === "en" ? en : th);
  const params = useSearchParams();
  const initial = params.get("category");
  const [category, setCategory] = useState<string>(initial && categories.some((c) => c.slug === initial) ? initial : "all");
  const [type, setType] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("name-asc");

  // Keep the category in the URL so the browser Back button and shared links return to the same view.
  useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (category === "all") url.searchParams.delete("category"); else url.searchParams.set("category", category);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [category, syncUrl]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const i of items) if (i.categorySlug) m[i.categorySlug] = (m[i.categorySlug] ?? 0) + 1;
    return m;
  }, [items]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = items.filter(
      (i) =>
        (category === "all" || i.categorySlug === category) &&
        (type === "all" || i.typeId === type) &&
        (!term || i.searchText.includes(term))
    );
    const byName = (a: CardModel, b: CardModel) => a.title.localeCompare(b.title, "th", { numeric: true });
    return [...list].sort((a, b) =>
      sort === "name-desc" ? byName(b, a) : sort === "category" ? a.categoryOrder - b.categoryOrder || byName(a, b) : byName(a, b)
    );
  }, [items, category, type, q, sort]);

  const filtered = category !== "all" || type !== "all" || q.trim() !== "";
  const reset = () => { setCategory("all"); setType("all"); setQ(""); };

  const emptyMessage =
    items.length === 0 || (category !== "all" && !q.trim() && type === "all")
      ? L("ขณะนี้ยังไม่มีสินค้าที่พร้อมแสดงในหมวดหมู่นี้", "No products are available to show in this category yet.")
      : L("ไม่พบสินค้าที่ตรงกับการค้นหา", "No products match your search.");

  return (
    <div>
      <div className="catalog-toolbar" role="search">
        <label className="field field--grow field--search">
          <span className="sr-only">{L("ค้นหาสินค้า", "Search products")}</span>
          <input type="search" placeholder={L("ค้นหาสินค้า", "Search products")} value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button type="button" className="field__clear" aria-label={L("ล้างคำค้นหา", "Clear search")} onClick={() => setQ("")}>×</button>}
        </label>
        <label className="field">
          <span className="sr-only">{L("เรียงลำดับ", "Sort")}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="name-asc">{L("ชื่อสินค้า A–Z", "Name A–Z")}</option>
            <option value="name-desc">{L("ชื่อสินค้า Z–A", "Name Z–A")}</option>
            <option value="category">{L("หมวดหมู่", "Category")}</option>
          </select>
        </label>
      </div>

      <div className="chips" role="group" aria-label={L("กรองตามหมวดหมู่", "Filter by category")}>
        <button type="button" className="chip" aria-pressed={category === "all"} onClick={() => setCategory("all")}>
          {L("ทั้งหมด", "All")} <span className="chip__n">{items.length}</span>
        </button>
        {categories.map((c) => (
          <button key={c.slug} type="button" className="chip" aria-pressed={category === c.slug} onClick={() => setCategory(c.slug)}>
            {lang === "en" ? c.nameEn : c.nameTh} <span className="chip__n">{counts[c.slug] ?? 0}</span>
          </button>
        ))}
      </div>

      {types && (
        <div className="chips chips--sub" role="group" aria-label={L("กรองตามประเภท", "Filter by type")}>
          <button type="button" className="chip" aria-pressed={type === "all"} onClick={() => setType("all")}>{L("ทุกประเภท", "All types")}</button>
          {types.map((t) => (
            <button key={t.id} type="button" className="chip" aria-pressed={type === t.id} onClick={() => setType(t.id)}>{t.nameTh}</button>
          ))}
        </div>
      )}

      <div className="catalog-status">
        <p className="catalog-count" aria-live="polite">{lang === "en" ? `Showing ${results.length} items` : `แสดง ${results.length} รายการ`}</p>
        {filtered && <button type="button" className="catalog-reset" onClick={reset}>{L("ล้างตัวกรอง", "Clear filters")}</button>}
      </div>

      {results.length > 0 ? (
        <div className="pgrid">
          {results.map((i, idx) => <ProductCard key={i.id} item={i} priority={idx < 4} />)}
        </div>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
}
