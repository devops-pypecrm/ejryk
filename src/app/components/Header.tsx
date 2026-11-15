"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { CATEGORIES, ALL_SERVICES } from "../../data/services";
import { SITE } from "../../data/site";

const LINKS = [
  { label: "home", href: "/" },
  { label: "about", href: "/about" },
  { label: "services", href: "/services", mega: true },
  { label: "work", href: "/work" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
];

export default function Header() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [svc, setSvc] = useState(false);

  useEffect(() => { setOpen(false); setSvc(false); }, [path]);

  const isCur = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

  return (
    <div className="header">
      <div className="w-layout-blockcontainer main-container w-container">
        <div className="navbar">
          <Logo />
          <nav className={`main-menu${open ? " is-open" : ""}`} aria-label="Main">
            {LINKS.map((l) =>
              l.mega ? (
                <div key={l.href} className={`nx-has-mega${svc ? " is-open" : ""}`}>
                  <Link
                    href={l.href}
                    className={`menu-item nx-svc-toggle${isCur(l.href) ? " w--current" : ""}`}
                    aria-haspopup="true"
                    aria-expanded={svc}
                    onClick={(e) => {
                      if (typeof window !== "undefined" && window.matchMedia("(max-width: 991px)").matches) { e.preventDefault(); setSvc((v) => !v); }
                    }}
                  >
                    {l.label}
                  </Link>
                  <div className="nx-mega-wrap">
                    <div className="nx-mega">
                      <div className="nx-mega-head">
                        <span>All services · {CATEGORIES.length} disciplines · {ALL_SERVICES.length} specialisms</span>
                        <Link href="/services">view all services <img src="/maze/arrow-right-dark.png" alt="" width={22} height={15} style={{ width: 22, height: "auto" }} /></Link>
                      </div>
                      <div className="nx-mega-grid">
                        {CATEGORIES.map((c, i) => (
                          <div className="nx-mega-col" key={c.slug}>
                            <Link href={`/services/${c.slug}`} className="nx-mega-title"><small>0{i + 1}</small>{c.title}</Link>
                            <p>{c.tagline}</p>
                            <ul>
                              {c.services.map((s) => (
                                <li key={s.slug}>
                                  <Link href={`/services/${c.slug}/${s.slug}`}><img src="/maze/arrow-elbow.png" alt="" width={14} height={14} />{s.title}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="nx-mega-foot">
                        <span>Not sure where to start?</span>
                        <a href={SITE.phoneHref}>{SITE.phone}</a>
                        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        <Link href="/contact" className="nx-pill">Book a consultation</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={l.href} href={l.href} className={`menu-item${isCur(l.href) ? " w--current" : ""}`}>{l.label}</Link>
              )
            )}
          </nav>
          <button type="button" className={`menu-button${open ? " is-open" : ""}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </div>
  );
}
