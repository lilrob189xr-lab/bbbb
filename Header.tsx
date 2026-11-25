"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import { mainNav } from "@/data/navigation";
import { branches } from "@/data/branches";
import { T, LangToggle, useLang } from "@/components/i18n/LangProvider";
import LineLink from "@/components/i18n/LineLink";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang } = useLang();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Close the menu after navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock page scroll while the menu is open; close on Escape.
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Wordmark />

        <nav className="desktop-nav" aria-label="เมนูหลัก">
          <ul>
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.href} className="nav-dd">
                  <Link href={item.href} className="nav-link" aria-current={isActive(item.href) ? "page" : undefined}>
                    <T th={item.label} en={item.labelEn} />
                  </Link>
                  <div className="nav-dd__menu">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} aria-current={pathname === c.href ? "page" : undefined}>
                        <T th={c.label} en={c.labelEn} />
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={isActive(item.href) ? "page" : undefined}>
                    <T th={item.label} en={item.labelEn} />
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <LineLink className="btn btn--on-green header-cta"><T th="สอบถามทาง LINE" en="Enquire on LINE" /></LineLink>

        <LangToggle />

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-panel"
          aria-label={lang === "en" ? (open ? "Close menu" : "Open menu") : open ? "ปิดเมนู" : "เปิดเมนู"}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div id="mobile-panel" className={`mobile-panel${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="เมนูมือถือ">
          <ul className="mobile-nav">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) && !item.children ? "page" : undefined} tabIndex={open ? 0 : -1}>
                  <T th={item.label} en={item.labelEn} />
                </Link>
                {item.children && (
                  <ul>
                    {item.children.slice(1).map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} aria-current={pathname === c.href ? "page" : undefined} tabIndex={open ? 0 : -1}>
                          <T th={c.label} en={c.labelEn} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-actions">
          <LineLink className="btn btn--on-green" tabIndex={open ? 0 : -1}><T th="สอบถามทาง LINE" en="Enquire on LINE" /></LineLink>
          {branches.map((b) => (
            <a key={b.id} className="btn btn--on-green" href={b.phoneHref} tabIndex={open ? 0 : -1}>
              <T th="โทร" en="Call" /> {b.brandName} · {b.phoneDisplay}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
