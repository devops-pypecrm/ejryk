import type { Metadata } from "next";
import "./styles/maze/normalize.css";
import "./styles/maze/layout.css";
import "./styles/maze/style.css";
import "./styles/maze-theme.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SiteChrome from "./components/SiteChrome";
import MazeFx from "./components/MazeFx";
import WhatsAppButton from "./components/WhatsAppButton";
import ChatWidget from "./components/ChatWidget";
import Script from "next/script";
import { SITE } from "../data/site";

// Optional free analytics: GA4 and Microsoft Clarity (heatmaps). Only load when the env vars are set.
const GA = process.env.NEXT_PUBLIC_GA_ID, CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID;

const URL_BASE = process.env.SITE_URL || "https://zenitzu.com";
const DESC = "IT consulting and software development from Kochi, India. We design, build and grow websites, apps and software, fast.";

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  title: { default: `${SITE.legal} | Websites, Apps & Software`, template: `%s | ${SITE.legal}` },
  description: DESC,
  alternates: { canonical: "./" },
  openGraph: { type: "website", siteName: SITE.legal, title: `${SITE.legal} | Websites, Apps & Software`, description: DESC, images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.legal }] },
  twitter: { card: "summary_large_image", title: SITE.legal, description: DESC, images: ["/og.png"] },
};

const JSON_LD = {
  "@context": "https://schema.org", "@type": "ProfessionalService", name: SITE.legal, url: URL_BASE, telephone: SITE.phone, email: SITE.email,
  description: DESC, address: { "@type": "PostalAddress", streetAddress: "Edappally", addressLocality: "Kochi", addressRegion: "Kerala", postalCode: "682024", addressCountry: "IN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=Noto+Sans+JP:wght@900&text=%E9%9B%B7&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('fx')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <noscript><style>{".fx [data-reveal],.fx [data-hero]{opacity:1!important;transform:none!important}"}</style></noscript>
      </head>
      <body className="body" suppressHydrationWarning>
        <div id="top">
          <SiteChrome><Header /></SiteChrome>
          {children}
          <SiteChrome><Footer /></SiteChrome>
        </div>
        {GA && /^[A-Z0-9-]+$/i.test(GA) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');`}</Script>
          </>
        )}
        {CLARITY && /^[a-z0-9]+$/i.test(CLARITY) && (
          <Script id="clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY}");`}</Script>
        )}
        <MazeFx />
        <SiteChrome><WhatsAppButton /><ChatWidget /></SiteChrome>
      </body>
    </html>
  );
}
