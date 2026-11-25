"use client";

import { useEffect, useRef, useState } from "react";
import { branches } from "@/data/branches";
import { contact } from "@/data/contact";
import { T } from "@/components/i18n/LangProvider";
import LineLink from "@/components/i18n/LineLink";

const Chat = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z" strokeLinejoin="round" />
  </svg>
);
const Close = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

const SHORT: Record<string, string> = { "kai-richy-floresta": "Central Phuket Floresta", "richy-gold-naka": "Naka" };

/** Floating contact menu (recovered from Phase 6, rebuilt for V5). Uses only existing verified contact data. */
export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: Event) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <div className="fc" ref={root} data-open={open}>
      <ul id="fc-panel" className="fc__panel" hidden={!open} aria-label="ช่องทางติดต่อ / Contact">
        <li>
          <LineLink className="fc__item">
            <span className="fc__t"><T th="สอบถามทาง LINE" en="Enquire on LINE" /></span>
            <span className="fc__s">LINE</span>
          </LineLink>
        </li>
        <li>
          <a className="fc__item" href={contact.facebook} target="_blank" rel="noopener noreferrer" onClick={close}>
            <span className="fc__t">Facebook</span>
            <span className="fc__s">Kai Richy</span>
          </a>
        </li>
        {branches.map((b) => (
          <li key={b.id}>
            <a className="fc__item" href={b.phoneHref} onClick={close}>
              <span className="fc__t"><T th="โทร" en="Call" /> {SHORT[b.id]}</span>
              <span className="fc__s">{b.brandName} · {b.phoneDisplay}</span>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button" className="fc__btn" aria-expanded={open} aria-controls="fc-panel"
        aria-label={open ? "ปิดช่องทางติดต่อ / Close contact menu" : "ช่องทางติดต่อ / Contact menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <Close /> : <Chat />}
      </button>
    </div>
  );
}
