import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import Tabs from "../components/Tabs";
import { CtaBand } from "../components/Sections";
import { SITE, STATS, TEAM, TESTIMONIALS, CLIENTS } from "../../data/site";

export const metadata: Metadata = { title: "About", description: `${SITE.legal} is an IT consulting and software development company based in Kochi, Kerala.` };

export default function AboutPage() {
  return (
    <>
      <PageHero title="about" sub={`${SITE.legal} is an IT consulting and software development company based in Kochi, Kerala.`} />
      <section>
        <div className="about-section">
          <div className="mission-stack">
            <div className="mission-image">
              <img className="circle" src="/maze/glow.png" alt="" width={603} height={527} />
              <div className="nx-mark-big" aria-hidden="true">N</div>
            </div>
            <div className="mission-column" data-reveal>
              <h2 className="mission-title">mission</h2>
              <p className="mission-paragraph">To help ambitious businesses turn technology into a growth engine, by advising, designing, building and marketing under one roof.</p>
            </div>
            <div className="mission-column" data-reveal>
              <h2 className="mission-title">vision</h2>
              <p className="mission-paragraph">To be the partner growing companies call first, known for honest advice and software that lasts.</p>
            </div>
          </div>
          <img className="team-image" src="/maze/p/about-team.jpg" alt="The team working around a table" width={1200} height={800} loading="lazy" data-reveal />
          <h2 className="team-title" data-reveal>Company overview</h2>
          <p className="team-paragraph" data-reveal>
            {SITE.legal} is a software and IT consulting company based in Edappally, Kochi. For the past two years we have helped start-ups and growing businesses decide what to build, design it well, engineer it properly and then keep it growing.
            <br /><br />
            Strategy, design, development and marketing sit in one team, so the people who shape your brand are in the same room as the people who ship your product. That means fewer hand-offs, faster decisions and results you can measure.
          </p>
        </div>
      </section>

      <section>
        <div className="team-members-wrapper">
          <h2 className="team-heading" data-reveal>Welcome to the innovation oasis, where every team member is a catalyst for success.</h2>
          <div className="team-member-container">
            <div className="team-members">
              {TEAM.map((m) => (
                <div className="member-item" key={m.name} data-reveal>
                  <img src={m.img} className="member-image" alt={m.name} width={560} height={720} loading="lazy" />
                  <h4 className="member-title">{m.name}</h4>
                  <div className="job-title">{m.role}</div>
                  <div className="author-social-wrapper">
                    <div className="author-socials member-socials">
                      <a href="#" className="author-social-links">LI</a>
                      <span className="author-social-links">-</span>
                      <a href="#" className="author-social-links">X</a>
                      <span className="author-social-links">-</span>
                      <a href="#" className="author-social-links">GH</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="clients">
          <div className="w-layout-blockcontainer main-container w-container">
            <h2 className="service-title clients-title" data-reveal>our clients</h2>
            <div className="cleint-stack">
              {CLIENTS.slice(0, 6).map((c) => (<div className="client-item" key={c} data-reveal>{c}</div>))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="stats-and-testimonials">
          <div className="w-layout-blockcontainer main-container w-container">
            <h2 className="service-title clients-title" data-reveal>Stats &amp; testimonials</h2>
            <div className="stats-stack">
              <div className="stats-cell" data-reveal>
                {STATS.map((s) => (
                  <div className="stats-box" key={s.label}>
                    <img src="/maze/arrow-elbow.png" className="arrow-icon" alt="" width={44} height={31} />
                    <div className="stats-text"><strong>{s.value}{s.suffix}</strong> {s.label}</div>
                  </div>
                ))}
              </div>
              <div data-reveal>
                <Tabs items={TESTIMONIALS.map((t, i) => ({ ...t, img: `/maze/p/testi-${i + 1}.jpg` }))} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
