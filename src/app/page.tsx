import Link from "next/link";
import { SITE } from "../data/site";
import { CATEGORIES } from "../data/services";
import { WORK } from "../data/work";
import { POSTS } from "../data/blog";
import { WorkGrid, BlogList, Process, FaqSection, CtaBand } from "./components/Sections";
import Storm from "./components/Storm";
import Marquee from "./components/Marquee";

export default function Home() {
  return (
    <>
      <section>
        <div id="home" className="hero">
          <Storm />
          <div className="hero-text-and-image">
            <img className="herro-image" data-hero src="/maze/p/hero.jpg" alt="A laptop glowing in a dark room" width={802} height={530} fetchPriority="high" />
            <h1 className="hero-big-text" data-hero>{SITE.name}</h1>
          </div>
          <div className="hero-small-text" data-hero>
            Thunder-fast IT consulting and software development.<br />
            Strategy, design, engineering and growth, under one roof.
          </div>
          <div className="nx-hero-cta" data-hero>
            <Link href="/contact" className="nx-btn is-light">Book a consultation</Link>
            <Link href="/services" className="nx-btn is-ghost">Explore services</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="work">
          <div className="w-layout-blockcontainer main-container w-container">
            <div className="title-main">
              <h2 className="work-title" data-reveal>Products we have shipped, brands we have grown, systems we have scaled.</h2>
            </div>
            <WorkGrid items={WORK.slice(0, 6)} />
            <div className="nx-more" data-reveal><Link href="/work" className="nx-btn">view all work</Link></div>
          </div>
        </div>
      </section>

      <section>
        <div className="awards">
          <div className="w-layout-blockcontainer main-container w-container">
            <div className="awards-title">
              <h2 className="award-heading" data-reveal>One team, four disciplines.</h2>
              <div className="text-block" data-reveal>Strategy, design, engineering and growth work as a single squad, so nothing is lost in hand-offs.</div>
            </div>
            <div className="awards-wrapper">
              {CATEGORIES.map((c, i) => (
                <Link href={`/services/${c.slug}`} className="award-item" key={c.slug} data-reveal>
                  <div className="award-text">0{i + 1} / {c.services.length} services</div>
                  <div className="award-inner-style">
                    <div className="award-line" />
                    <h4 className="award-title">{c.title}</h4>
                    <img className="award-arrow" src="/maze/arrow-right-dark.png" alt="" width={34} height={24} />
                  </div>
                  <p className="nx-award-desc">{c.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Process />

      <section>
        <div className="blog">
          <div className="w-layout-blockcontainer main-container w-container">
            <div className="title-main">
              <h2 className="work-title" data-reveal>Stay informed, where every story unfolds and knowledge takes shape.</h2>
            </div>
            <BlogList items={POSTS.slice(0, 3)} />
          </div>
        </div>
      </section>

      <Marquee />
      <FaqSection />
      <CtaBand />
    </>
  );
}
