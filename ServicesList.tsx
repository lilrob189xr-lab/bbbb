import { services, branchTag } from "@/data/services";

export default function ServicesList({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={`slist${compact ? " slist--compact" : ""}`}>
      {services.map((s, i) => {
        const tag = branchTag(s);
        return (
          <li key={s.id} className="slist__item">
            <span className="slist__no en">{String(i + 1).padStart(2, "0")}</span>
            <span className="slist__body">
              <span className="slist__th">{s.nameTh}</span>
              <span className="slist__en en">{s.nameEn}</span>
              {tag && <span className="slist__tag">{tag}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
