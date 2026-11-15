import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "../../../components/PageHero";
import { ServiceBoxes, FaqSection, CtaBand, Process } from "../../../components/Sections";
import { CATEGORIES, ALL_SERVICES, getCategory, getService } from "../../../../data/services";

export function generateStaticParams() { return ALL_SERVICES.map((s) => ({ category: s.category.slug, service: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string; service: string }> }): Promise<Metadata> {
  const { category, service } = await params;
  const s = getService(category, service);
  return s ? { title: s.title, description: s.summary.slice(0, 155) } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ category: string; service: string }> }) {
  const { category, service } = await params;
  const c = getCategory(category);
  const s = getService(category, service);
  if (!c || !s) notFound();
  const idx = CATEGORIES.findIndex((x) => x.slug === c.slug);
  const related = c.services.filter((x) => x.slug !== s.slug);
  return (
    <>
      <PageHero title={s.title} sub={s.tagline} />
      <section>
        <div className="single-wrapper">
          <div className="w-layout-blockcontainer main-container w-container">
            <div className="upper-single-work">
              <div className="upper-cell" data-reveal>
                <h2 className="work-details-title">Service overview</h2>
                <p>{s.summary}</p>
              </div>
              <div className="upper-cell" data-reveal>
                <h2 className="work-details-title">At a glance</h2>
                <div className="work-detail-box"><span className="work-detail-small-title">Discipline</span><div className="work-detail-text"><Link href={`/services/${c.slug}`} style={{ textDecoration: "underline", textUnderlineOffset: 4 }}>{c.title}</Link></div></div>
                <div className="work-detail-box"><span className="work-detail-small-title">Typical outcome</span><div className="work-detail-text">{s.outcome.value} {s.outcome.label}</div></div>
                <div className="work-detail-box"><span className="work-detail-small-title">Tools</span><div className="nx-tags" style={{ marginTop: 6 }}>{s.stack.slice(0, 4).map((t) => <span key={t}>{t}</span>)}</div></div>
                <Link href="/contact" className="client-website-button">start a project</Link>
              </div>
            </div>

            <div className="work-images-and-infos">
              <div className="work-upper-images-grid">
                <img className="work-single-image" src="/maze/p/detail-a.jpg" alt="" width={700} height={462} loading="lazy" data-reveal />
                <img className="work-single-image" src="/maze/p/detail-b.jpg" alt="" width={700} height={462} loading="lazy" data-reveal />
                <img className="work-single-image is-wide" src={`/maze/p/cat-${idx + 1}.jpg`} alt={c.title} width={1400} height={720} loading="lazy" data-reveal />
              </div>
              <div className="work-infos">
                <div className="work-info-cell" data-reveal>
                  <h4 className="work-info-title">What you get</h4>
                  <ul className="nx-list">
                    {s.deliverables.map((d, i) => <li key={d}><span>{String(i + 1).padStart(2, "0")}</span>{d}</li>)}
                  </ul>
                </div>
                <div className="work-info-cell" data-reveal>
                  <h4 className="work-info-title">Tools and stack</h4>
                  <ul className="nx-chips">{s.stack.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
                <div className="work-info-cell" data-reveal>
                  <h4 className="work-info-title">Typical outcome</h4>
                  <p className="nx-outcome-big">{s.outcome.value}</p>
                  <p className="nx-outcome-text">{s.outcome.label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Process />
      <FaqSection items={s.faq} text={`Questions about ${s.title.toLowerCase()}, answered.`} image={`/maze/p/cat-${idx + 1}.jpg`} />

      {related.length > 0 && (
        <section>
          <div className="nx-wrap" style={{ paddingTop: 20 }}>
            <div className="w-layout-blockcontainer main-container w-container">
              <div className="nx-cat-head" data-reveal><h2>More in {c.short.toLowerCase()}</h2></div>
              <ServiceBoxes category={c} items={related} />
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
