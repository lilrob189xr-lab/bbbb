import { branches } from "@/data/branches";
import { T } from "@/components/i18n/LangProvider";

/**
 * Credibility strip built only from confirmed facts in branches.ts.
 * Phase 7A.2: single-line strip (daily opening, branch count, X-Ray) — replaces the separate Home highlights.
 */
export default function FactsBar() {
  const everyDay = branches.every((b) => b.hours.startsWith("ทุกวัน"));
  const xrayBoth = branches.every((b) => b.services.xray);
  return (
    <section className="facts-bar" aria-label="ข้อมูลโดยสรุป">
      <div className="container">
        <ul className="facts-bar__grid facts-bar__grid--inline">
          {everyDay && (
            <li className="facts-bar__item">
              <span className="facts-bar__k"><T th="เปิดทุกวัน" en="Open Daily" /></span>
              <span className="facts-bar__v"><T th="Open Daily" en="Both branches" /></span>
            </li>
          )}
          <li className="facts-bar__item">
            <span className="facts-bar__k"><T th={`${branches.length} สาขา`} en={`${branches.length} Branches`} /></span>
            <span className="facts-bar__v"><T th="In Phuket" en="In Phuket" /></span>
          </li>
          {xrayBoth && (
            <li className="facts-bar__item">
              <span className="facts-bar__k en">X-Ray</span>
              <span className="facts-bar__v"><T th="ตรวจสอบโลหะ" en="Precious Metal Testing" /></span>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
