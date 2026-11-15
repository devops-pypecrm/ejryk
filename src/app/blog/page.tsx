import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import { BlogList, CtaBand } from "../components/Sections";
import { POSTS } from "../../data/blog";

export const metadata: Metadata = { title: "Blog", description: "Practical ideas on technology, design, product and growth." };

export default function BlogPage() {
  return (
    <>
      <PageHero title="blog" sub="Practical ideas on technology, design, product and growth." />
      <section>
        <div className="blog" style={{ paddingTop: 90 }}>
          <div className="w-layout-blockcontainer main-container w-container">
            <BlogList items={POSTS} />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
