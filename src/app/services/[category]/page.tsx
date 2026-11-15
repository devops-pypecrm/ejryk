import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "../../components/PageHero";
import { ServiceBoxes, CtaBand } from "../../components/Sections";
import { CATEGORIES, getCategory } from "../../../data/services";

export function generateStaticParams() { return CATEGORIES.map((c) => ({ category: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = getCategory((await params).category);
  return c ? { title: c.title, description: c.description } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const idx = CATEGORIES.findIndex((x) => x.slug === c.slug);
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  return (
    <>
      <PageHero title={c.title} sub={c.tagline} />
      <section>
        <div className="nx-wrap">
          <div className="w-layout-blockcontainer main-container w-container">
            <div className="nx-cat-head" data-reveal>
              <div>
                <p className="nx-sub">0{idx + 1} / {c.services.length} services</p>
                <p className="nx-lead" style={{ margin: 0 }}>{c.description}</p>
              </div>
              <Link href="/contact" className="nx-btn">talk to us</Link>
            </div>
            <ServiceBoxes category={c} items={c.services} />

            <div style={{ marginTop: 110 }}>
              <div className="nx-cat-head" data-reveal><h2>Other disciplines</h2></div>
              <div className="nx-svc-grid">
                {others.map((o) => (
                  <Link key={o.slug} href={`/services/${o.slug}`} className="nx-svc-box" data-reveal>
                    <span className="n">{o.services.length} services</span>
                    <h3>{o.title}</h3>
                    <p>{o.tagline}</p>
                    <img src="/maze/arrow-right-dark.png" alt="" width={36} height={25} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
