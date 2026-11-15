import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import { SITE } from "../../data/site";

export const metadata: Metadata = { title: "Contact", description: `Talk to ${SITE.name}: call, WhatsApp, email or visit us in Kochi.` };

const Icon = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const MAP = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;

export default function ContactPage() {
  const boxes = [
    { label: "Call", href: SITE.phoneHref, ext: false, icon: <Icon d={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />} /> },
    { label: "WhatsApp", href: SITE.whatsappHref, ext: true, icon: <Icon d={<><path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-.8-.4-1.5-1.1-1.9-1.9l.8-1-1-2L9 9Z" /></>} /> },
    { label: "Email", href: `mailto:${SITE.email}`, ext: false, icon: <Icon d={<><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>} /> },
    { label: "Visit", href: MAP, ext: true, icon: <Icon d={<><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>} /> },
  ];
  return (
    <>
      <PageHero title="contact" sub="Tell us what you are building. We reply within one working day." />
      <section>
        <div className="contact">
          <div className="w-layout-blockcontainer main-container w-container">
            <div className="contact-stack">
              <div className="contact-cell">
                <div className="conact-infos">
                  {boxes.map((b) => (
                    <a key={b.label} href={b.href} className="contact-social" {...(b.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} data-reveal>
                      <div className="social-box">{b.icon}</div>
                      <div className="contact-social-text"><img src="/maze/arrow-elbow.png" alt="" width={22} height={22} /><span className="social-text">{b.label}</span></div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="contact-cell" data-reveal>
                <div className="form-cell">
                  <h3 className="form-title">Get in touch</h3>
                  <p className="form-intro">Ready to connect? Whether you have a question, an idea or a project in mind, send a message and we will get back to you shortly.</p>
                  <ContactForm />
                </div>
              </div>
            </div>

            <div className="contact-details-stack">
              <div className="contact-details-item" data-reveal><a className="contact-detail-link" href={SITE.phoneHref}><img src="/maze/arrow-elbow.png" alt="" width={34} height={34} /><span className="contact-detail-text">{SITE.phone}</span></a></div>
              <div className="contact-details-item middle-detail" data-reveal><a className="contact-detail-link" href={`mailto:${SITE.email}`}><img src="/maze/arrow-elbow.png" alt="" width={34} height={34} /><span className="contact-detail-text">{SITE.email}</span></a></div>
              <div className="contact-details-item" data-reveal><a className="contact-detail-link" href={MAP} target="_blank" rel="noopener noreferrer"><img src="/maze/arrow-elbow.png" alt="" width={34} height={34} /><span className="contact-detail-text">{SITE.address}</span></a></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
