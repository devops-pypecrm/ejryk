import Link from "next/link";
import { SPEED } from "../../data/speed";

const SCALE = 90; // the bar shows how much of a 90-day quarter the work takes

export default function SpeedSection() {
  return (
    <section>
      <div className="nx-speedwrap">
        <div className="w-layout-blockcontainer main-container w-container">
          <div className="nx-speed-head">
            <p className="nx-sub nx-sub-bolt" data-reveal>Our work, on the clock</p>
            <h2 className="nx-speed-title" data-reveal>From idea to live, <span className="nx-mark">fast</span>.</h2>
            <p className="nx-speed-lead" data-reveal>Pick what you need. This is how long we typically take to put it in your hands.</p>
          </div>
          <div className="nx-speed-list">
            {SPEED.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.cat}/${s.slug}`} className="nx-srow" data-reveal style={{ ["--w" as string]: `${Math.max(6, Math.round((s.days / SCALE) * 100))}%` }}>
                <div className="nx-srow-main">
                  <div className="nx-time"><b>{s.value}</b><span>{s.unit}</span></div>
                  <div className="nx-srow-body">
                    <div className="nx-srow-tag"><i>{String(i + 1).padStart(2, "0")}</i> {s.service}</div>
                    <h3><em>{s.hook}</em> {s.headline}</h3>
                    <p>{s.text}</p>
                  </div>
                  <span className="nx-srow-go" aria-hidden="true"><img src="/maze/arrow-right-dark.png" alt="" width={34} height={24} /></span>
                </div>
                <div className="nx-track" aria-hidden="true"><span className="nx-fill" /></div>
              </Link>
            ))}
          </div>
          <p className="nx-speed-note" data-reveal>Typical timelines for a focused scope. Bars show the share of a 90-day quarter. Every project is scoped and confirmed in writing before we start.</p>
        </div>
      </div>
    </section>
  );
}
