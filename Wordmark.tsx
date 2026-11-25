import Link from "next/link";
import { brand } from "@/data/brand";

/** Typographic wordmark for the header. The original logo artwork is used unaltered elsewhere. */
export default function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="KAI RICHY หน้าแรก">
      <span className="wordmark__name">{brand.name}</span>
      <span className="wordmark__sub">{brand.descriptor}</span>
    </Link>
  );
}
