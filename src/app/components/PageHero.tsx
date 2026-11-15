import Storm from "./Storm";
export default function PageHero({ title, sub }: { title: string; sub?: string }) {
  return (
    <section>
      <div className="hero inner-pages-hero">
        <Storm single />
        <h1 className="sitemap-title" data-hero>{title}</h1>
        {sub ? <p className="nx-hero-sub" data-hero>{sub}</p> : null}
      </div>
    </section>
  );
}
