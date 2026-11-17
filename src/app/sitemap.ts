import type { MetadataRoute } from "next";
import { CATEGORIES } from "../data/services";
import { POSTS } from "../data/blog";
import { WORK } from "../data/work";

const base = process.env.SITE_URL || "https://zenitzu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/contact", "/services", "/work", "/blog",
    ...CATEGORIES.flatMap((c) => [`/services/${c.slug}`, ...c.services.map((s) => `/services/${c.slug}/${s.slug}`)]),
    ...WORK.map((w) => `/work/${w.slug}`), ...POSTS.map((p) => `/blog/${p.slug}`)];
  return paths.map((p) => ({ url: base + p, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
