import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import { ServiceBoxes, FaqSection, CtaBand, Process } from "../components/Sections";
import { CATEGORIES, ALL_SERVICES } from "../../data/services";

export const metadata: Metadata = { title: "Services", description: `Strategy, design, engineering and growth: ${ALL_SERVICES.length} services under one roof.` };

export default function ServicesPage() {
  return (
    <>
      <PageHero title="services" sub={`Four disciplines, ${ALL_SERVICES.length} specialisms. Hire one, or let one team run the whole thing.`} />
      <section>
        <div className="nx-wrap">
          <div className="w-layout-blockcontainer main-container w-container">
            {CATEGORIES.map((c, i) => (
              <div className="nx-cat-block" key={c.slug}>
                <div className="nx-cat-head" data-reveal>
                  <div>
                    <p className="nx-sub">0{i + 1} / {c.services.length} services</p>
                    <h2>{c.title}</h2>
                    <p>{c.description}</p>
                  </div>
                  <Link href={`/services/${c.slug}`} className="nx-btn">explore {c.short.toLowerCase()}</Link>
                </div>
                <ServiceBoxes category={c} items={c.services} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Process />
      <FaqSection />
      <CtaBand />
    </>
  );
}
