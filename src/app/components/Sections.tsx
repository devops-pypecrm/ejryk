import BoltLine from "./BoltLine";
import Link from "next/link";
import type { Project } from "../../data/work";
import type { Post } from "../../data/blog";
import type { Category, Service } from "../../data/services";
import { PROCESS, FAQ } from "../../data/site";
import Accordion from "./Accordion";

export function WorkGrid({ items }: { items: Project[] }) {
  return (
    <div className="work-list-wrapper">
      <div className="work-list">
        {items.map((p, i) => (
          <div className="work-item" key={p.slug} data-reveal>
            <div className="work-item-wrapper">
              <Link href={`/work/${p.slug}`} className="project-image-and-category" aria-label={`${p.title} case study`}>
                <img className="project-image" src={`/maze/p/work-${i + 1}.jpg`} alt={`${p.title}: ${p.cat}`} width={1040} height={675} loading={i < 3 ? "eager" : "lazy"} decoding="async" />
                <span className="read-more-link" aria-hidden="true"><span className="read-more-text">view project</span></span>
              </Link>
              <Link href={`/work/${p.slug}`} className="portfolio-text">
                <h4 className="project-title">{p.title}</h4>
                <div className="slash">/</div>
                <div className="portfolio-category">{p.cat}</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogList({ items }: { items: Post[] }) {
  return (
    <div className="blog-list-wrapper">
      <div className="blog-list">
        {items.map((p) => (
          <div className="blog-item" key={p.slug} data-reveal>
            <div className="blog-inner">
              <Link href={`/blog/${p.slug}`} className="blog-image-link" aria-label={p.title}>
                <img className="blog-image" src={`/maze/p/blog-${POST_IMG[p.slug] ?? 1}.jpg`} alt="" width={860} height={645} loading="lazy" decoding="async" />
              </Link>
              <div className="blog-category-and-time">
                <span className="meta-text">{p.category}</span>
                <span className="meta-text">/</span>
                <div className="reading-time">{p.minutes} min</div>
              </div>
              <h2 className="blog-title"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h2>
              <Link href={`/blog/${p.slug}`} className="read-more">read more</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// blog slug -> photo number (kept stable if posts are reordered)
export const POST_IMG: Record<string, number> = {
  "what-to-ask-before-you-hire-a-software-partner": 1,
  "fast-sites-are-a-business-decision": 2,
  "design-systems-for-small-teams": 3,
  "ci-cd-without-the-pager": 4,
  "mobile-first-is-not-mobile-only": 5,
  "seo-and-geo-what-changes": 6,
};

export function ServiceBoxes({ category, items, current }: { category: Category; items: Service[]; current?: string }) {
  return (
    <div className="nx-svc-grid">
      {items.map((s, i) => (
        <Link key={s.slug} href={`/services/${category.slug}/${s.slug}`} className={`nx-svc-box${current === s.slug ? " is-current" : ""}`} data-reveal>
          <span className="n">{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.tagline}</p>
          <img src="/maze/arrow-right-dark.png" alt="" width={36} height={25} />
        </Link>
      ))}
    </div>
  );
}

export function Process() {
  return (
    <section>
      <div className="nx-process">
        <div className="w-layout-blockcontainer main-container w-container">
          <div className="title-main">
            <p className="nx-sub nx-sub-bolt" data-reveal>Five forms, one flash</p>
            <h2 className="work-title" data-reveal>From first call to launch, and the growth that follows.</h2>
          </div>
          <div>
            {PROCESS.map((p) => (
              <div className="nx-step" key={p.n} data-reveal>
                <span className="n">Form {p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ items = FAQ.map((f) => ({ q: f.q, a: f.a })), text = "Unleashing possibilities through our service capabilities.", image = "/maze/p/services-main.jpg" }: { items?: { q: string; a: string }[]; text?: string; image?: string }) {
  return (
    <section>
      <div className="features">
        <div className="w-layout-blockcontainer main-container w-container">
          <div className="feature-stack">
            <div className="feature-cell" data-reveal>
              <div className="feature-text">{text}</div>
              <img className="feature-image" src={image} alt="" width={1000} height={514} loading="lazy" decoding="async" />
            </div>
            <div className="feature-cell" data-reveal>
              <Accordion items={items} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title = "Have a project in mind? Let's build it.", sub }: { title?: string; sub?: string }) {
  return (
    <section>
      <div className="nx-cta-band">
        <span className="nx-speed" aria-hidden="true" />
        <div className="w-layout-blockcontainer main-container w-container">
          <BoltLine dark />
          <h2 data-reveal>{title}</h2>
          {sub ? <p style={{ color: "rgba(255,255,255,.78)", maxWidth: 620, margin: "-10px auto 34px" }} data-reveal>{sub}</p> : null}
          <div data-reveal>
            <Link href="/contact" className="nx-btn is-light">Book a consultation</Link>
            <Link href="/work" className="nx-btn is-ghost">See our work</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
