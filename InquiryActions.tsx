import { branches } from "@/data/branches";
import { T } from "@/components/i18n/LangProvider";
import LineLink from "@/components/i18n/LineLink";

/** Inquiry only (LINE / phone). No purchasing functionality. */
export default function InquiryActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`inquiry${compact ? " inquiry--compact" : ""}`}>
      <LineLink className="btn btn--primary"><T th="สอบถามทาง LINE" en="Enquire on LINE" /></LineLink>
      {!compact &&
        branches.map((b) => (
          <a key={b.id} className="btn btn--secondary" href={b.phoneHref}>
            <T th="โทร" en="Call" /> {b.brandName} {b.phoneDisplay}
          </a>
        ))}
    </div>
  );
}
