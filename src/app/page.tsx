import Link from "next/link";
import { SITE } from "../data/site";
import { CATEGORIES } from "../data/services";
import { WORK } from "../data/work";
import { POSTS } from "../data/blog";
import { WorkGrid, BlogList, Process, FaqSection, CtaBand } from "./components/Sections";
import SpeedSection from "./components/SpeedSection";
import Marquee from "./components/Marquee";
import HeroCurtains from "./components/HeroCurtains";
import HomeIntro from "./components/HomeIntro";

export default function Home() {
  return (
    <>
      <HomeIntro />
      <section>
        <div id="home" className="nx-hero3">
          <HeroCurtains />
          <div className="nx-hero3-inner">
            <h1 className="nx-hero3-title" data-hero><span className="nx-grad">Your idea, live in days.</span><br />Not months.</h1>
            <p className="nx-hero3-desc" data-hero>We plan, design, build and grow websites, apps and software for ambitious businesses, all under one roof.</p>
            <div className="nx-hero-cta nx-hero3-cta" data-hero>
              <Link href="/contact" className="nx-btn">Book a consultation</Link>
              <Link href="#on-the-clock" className="nx-btn is-outline">See how fast</Link>
            </div>
          </div>
        </div>
      </section>

      <div id="on-the-clock"><SpeedSection /></div>

      <Process />

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
