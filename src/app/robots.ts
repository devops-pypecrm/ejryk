import type { MetadataRoute } from "next";
const base = process.env.SITE_URL || "https://zenitzu.com";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${base}/sitemap.xml` };
}
