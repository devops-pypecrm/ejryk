import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "../../components/PageHero";
import { CtaBand } from "../../components/Sections";
import { WORK, getProject } from "../../../data/work";

export function generateStaticParams() { return WORK.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: `${p.title}: ${p.cat}`, description: p.overview.slice(0, 155) } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = WORK.findIndex((w) => w.slug === slug);
  const next = WORK[(i + 1) % WORK.length];
  return (
    <>
      <PageHero title={p.title} sub={p.cat} />
      <section>
        <div className="single-wrapper">
          <div className="w-layout-blockcontainer main-container w-container">
            <div className="upper-single-work">
              <div className="upper-cell" data-reveal>
                <h2 className="work-details-title">Project overview</h2>
                <p>{p.overview}</p>
              </div>
              <div className="upper-cell" data-reveal>
                <h2 className="work-details-title">Project info</h2>
                <div className="work-detail-box"><span className="work-detail-small-title">Client</span><div className="work-detail-text">{p.client}</div></div>
                <div className="work-detail-box"><span className="work-detail-small-title">Date</span><div className="work-detail-text">{p.date}</div></div>
                <div className="work-detail-box"><span className="work-detail-small-title">Services</span><div className="work-detail-text">{p.services.join(", ")}</div></div>
                <Link href="/contact" className="client-website-button">start a similar project</Link>
              </div>
            </div>

            <div className="work-images-and-infos">
              <div className="work-upper-images-grid">
                <img className="work-single-image" src="/maze/p/detail-a.jpg" alt="" width={700} height={462} loading="lazy" data-reveal />
                <img className="work-single-image" src="/maze/p/detail-b.jpg" alt="" width={700} height={462} loading="lazy" data-reveal />
                <img className="work-single-image is-wide" src={`/maze/p/work-${i + 1}-wide.jpg`} alt={p.title} width={1480} height={976} loading="lazy" data-reveal />
              </div>
              <div className="work-under-images">
                <div className="three-column-work-image" data-reveal><img className="work-single-image" src="/maze/p/detail-c.jpg" alt="" width={440} height={593} loading="lazy" /></div>
                <div className="three-column-work-image" data-reveal><img className="work-single-image" src="/maze/p/detail-d.jpg" alt="" width={440} height={593} loading="lazy" /></div>
                <div className="three-column-work-image" data-reveal><img className="work-single-image" src="/maze/p/detail-e.jpg" alt="" width={440} height={593} loading="lazy" /></div>
              </div>
              <div className="work-infos">
                {p.approach.map((a) => (
                  <div className="work-info-cell" key={a.title} data-reveal>
                    <h4 className="work-info-title">{a.title}</h4>
                    <p className="work-info-text">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="nx-next">
              <div><small>NEXT PROJECT</small><Link href={`/work/${next.slug}`}>{next.title} →</Link></div>
              <Link href="/work" className="nx-btn">all work</Link>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
