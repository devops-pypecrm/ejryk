import Link from "next/link";
import BoltLine from "./BoltLine";
import Logo from "./Logo";
import { SITE } from "../../data/site";
import { CATEGORIES } from "../../data/services";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-inner">
        <div className="w-layout-blockcontainer main-container w-container">
          <BoltLine dark />
          <div className="footer-stack">
            <div className="footer-cell">
              <div className="footer-logo"><Logo bare /></div>
              <p className="footer-tag">{SITE.tagline}. Strategy, design, engineering and growth, under one roof.</p>
            </div>
            <div className="footer-cell">
              <h4 className="nx-foot-title">Contact</h4>
              <a href={`mailto:${SITE.email}`} className="footer-text footer-text-links">{SITE.email}</a>
              <a href={SITE.phoneHref} className="footer-text footer-text-links">{SITE.phone}</a>
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="footer-text footer-text-links">WhatsApp {SITE.whatsapp}</a>
              <div className="footer-text">{SITE.address}</div>
            </div>
            <div className="footer-cell">
              <h4 className="nx-foot-title">Services</h4>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/services/${c.slug}`} className="footer-text footer-text-links">{c.title}</Link>
              ))}
              <Link href="/work" className="footer-text footer-text-links">Work</Link>
              <Link href="/blog" className="footer-text footer-text-links">Blog</Link>
            </div>
            <div className="footer-cell">
              <h4 className="nx-foot-title">Follow</h4>
              {SITE.socials.map((s) => (
                <a key={s.label} href={s.href} className="social-link-block w-inline-block" target="_blank" rel="noopener noreferrer">
                  <div className="social-arrow" />
                  <div className="footer-text foot-social">{s.label}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="w-layout-blockcontainer main-container w-container" style={{ marginTop: 70 }}>
          <div className="copyright">
            <div className="copyright-text">{SITE.legal} - {SITE.tagline}: © {new Date().getFullYear()}</div>
            <a href="#top" className="back-to-top w-inline-block" aria-label="Back to top"><img src="/maze/backtop.png" alt="" className="back-to-top-image" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
