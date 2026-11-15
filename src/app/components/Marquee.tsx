import Link from "next/link";
import { ALL_SERVICES } from "../../data/services";

const href = (s: (typeof ALL_SERVICES)[number]) => `/services/${s.category.slug}/${s.slug}`;

export default function Marquee({ title = "Service Offerings" }: { title?: string }) {
  const half = Math.ceil(ALL_SERVICES.length / 2);
  const a = ALL_SERVICES.slice(0, half);
  const b = ALL_SERVICES.slice(half);
  return (
    <section>
      <div className="services">
        <h2 className="service-title" data-reveal>{title}</h2>
        <div className="services-black">
          <div className="services-black-wrapper">
            {[...a, ...a].map((s, i) => (
              <Link key={i} href={href(s)} className="service-black-item" tabIndex={i >= a.length ? -1 : undefined} aria-hidden={i >= a.length ? true : undefined}>
                <span className="service-item-inner">
                  <span className="service-white-text">{s.title}</span>
                  <img src="/maze/arrow-white.png" alt="" className="arrow-white" />
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="services-color">
          <div className="services-color-wrap">
            {[...b, ...b].map((s, i) => (
              <Link key={i} href={href(s)} className="services-color-item" tabIndex={i >= b.length ? -1 : undefined} aria-hidden={i >= b.length ? true : undefined}>
                <span className="service-item-inner">
                  <img src="/maze/arrow-dark.png" alt="" className="arrow-black" />
                  <span className="services-black-text">{s.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
