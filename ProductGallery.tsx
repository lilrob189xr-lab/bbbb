"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/data/products";
import { useLang } from "@/components/i18n/LangProvider";

/** Main photo + thumbnail strip. The whole photo stays visible (no cropping) on a neutral ivory frame. */
export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const { lang } = useLang();
  const en = lang === "en";
  const [i, setI] = useState(0);
  const n = images.length;
  const cur = images[i];
  if (!cur) return null;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <div className="gallery-pd" onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}>
      <div className="gallery-pd__main">
        <Image key={cur.src} src={cur.src} alt={cur.alt} fill sizes="(min-width:1024px) 50vw, 100vw" priority style={{ objectFit: "contain" }} />
        {n > 1 && (
          <>
            <button type="button" className="gallery-pd__nav gallery-pd__nav--prev" aria-label={en ? "Previous image" : "ภาพก่อนหน้า"} onClick={() => go(-1)}>‹</button>
            <button type="button" className="gallery-pd__nav gallery-pd__nav--next" aria-label={en ? "Next image" : "ภาพถัดไป"} onClick={() => go(1)}>›</button>
            <span className="gallery-pd__count" aria-live="polite">{i + 1} / {n}</span>
          </>
        )}
      </div>
      {n > 1 && (
        <ul className="gallery-pd__thumbs" aria-label={en ? "Product images" : "รูปภาพสินค้า"}>
          {images.map((im, k) => (
            <li key={im.assetId}>
              <button type="button" className="gallery-pd__thumb" aria-label={en ? `View image ${k + 1}` : `ดูภาพที่ ${k + 1}`} aria-current={k === i ? "true" : undefined} onClick={() => setI(k)}>
                <Image src={im.thumb?.src ?? im.src} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
