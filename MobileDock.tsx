"use client";

import { branches } from "@/data/branches";
import { T } from "@/components/i18n/LangProvider";
import LineLink from "@/components/i18n/LineLink";

/** Bottom action bar on phones: LINE and one tap to call each branch. Hidden on wider screens (CSS). */
export default function MobileDock() {
  return (
    <div className="dock" role="navigation" aria-label="Quick contact">
      <LineLink><T th="สอบถามทาง LINE" en="Enquire on LINE" /></LineLink>
      {branches.map((b) => (
        <a key={b.id} href={b.phoneHref}>
          <T th={`โทร ${b.brandName}`} en={`Call ${b.brandName}`} />
        </a>
      ))}
    </div>
  );
}
