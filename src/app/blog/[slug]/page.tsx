import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "../../components/PageHero";
import { CtaBand, POST_IMG } from "../../components/Sections";
import { POSTS, getPost } from "../../../data/blog";
import { SITE, TEAM } from "../../../data/site";

export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const author = TEAM[0];
  return (
    <>
      <PageHero title="blog" />
      <section>
        <article className="single-post-wrapper">
          <img className="single-blog-img" src={`/maze/p/blog-${POST_IMG[p.slug] ?? 1}.jpg`} alt="" width={860} height={645} />
          <div className="blog-category-and-time single-blog-category">
            <span className="meta-text">{p.category}</span>
            <span className="meta-text">/</span>
            <span className="meta-text">{p.date}</span>
            <div className="reading-time">{p.minutes} min read</div>
          </div>
          <h1>{p.title}</h1>
          <div className="post-body">{p.body.map((t, i) => <p key={i}>{t}</p>)}</div>
          <div className="author-bio">
            <h4 className="author-bio-title">Written by the {SITE.name} team</h4>
            <p className="author-bio-text">{author.name} and the team share what they learn building products for clients. <Link href="/contact" style={{ textDecoration: "underline" }}>Talk to us</Link> about yours.</p>
          </div>
          <div className="nx-next" style={{ marginTop: 50 }}>
            <Link href="/blog" className="nx-btn">all articles</Link>
          </div>
        </article>
      </section>
      <CtaBand />
    </>
  );
}
