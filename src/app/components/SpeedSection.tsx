import Link from "next/link";
import { SPEED } from "../../data/speed";

const SCALE = 90; // the bar shows how much of a 90-day quarter the work takes

export default function SpeedSection() {
  return (
    <section className="nx-speedwrap" aria-labelledby="speed-title">
      <div className="w-layout-blockcontainer main-container w-container">
        <div className="nx-speed-head">
          <p className="nx-sub nx-sub-bolt" data-reveal>Our work, on the clock</p>
          <h2 id="speed-title" className="nx-speed-title" data-reveal>From idea to live, <span>fast.</span></h2>
          <p className="nx-speed-lead" data-reveal>Pick what you need. This is how long we typically take to put it in your hands.</p>
        </div>
        <div className="nx-speed-list">
          {SPEED.map((s) => (
            <Link key={s.slug} href={`/services/${s.cat}/${s.slug}`} className="nx-srow" data-reveal style={{ ["--w" as string]: `${s.days / SCALE * 100}%` }}>
              <div className="nx-srow-top">
                <h3>{s.service}</h3>
                <span className="nx-srow-go" aria-hidden="true">&#8599;</span>
              </div>
              <div className="nx-time"><b>{s.value}</b><span>{s.unit}</span></div>
              <p className="nx-srow-headline">{s.headline}</p>
              <p className="nx-srow-desc">{s.text}</p>
              <div className="nx-track" aria-hidden="true"><span className="nx-fill" /></div>
            </Link>
          ))}
        </div>
        <p className="nx-speed-note" data-reveal>Typical timelines for a focused scope. Bars show the share of a 90-day quarter. Every project is scoped and confirmed in writing before we start.</p>
      </div>
    </section>
  );
}
