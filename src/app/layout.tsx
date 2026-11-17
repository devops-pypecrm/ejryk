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
import { SITE } from "../data/site";

export const metadata: Metadata = {
  title: { default: `${SITE.legal} | ${SITE.tagline}`, template: `%s | ${SITE.legal}` },
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=Noto+Sans+JP:wght@900&text=%E9%9B%B7&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('fx')" }} />
        <noscript><style>{".fx [data-reveal],.fx [data-hero]{opacity:1!important;transform:none!important}"}</style></noscript>
      </head>
      <body className="body" suppressHydrationWarning>
        <div id="top">
          <SiteChrome><Header /></SiteChrome>
          {children}
          <SiteChrome><Footer /></SiteChrome>
        </div>
        <MazeFx />
        <SiteChrome><WhatsAppButton /></SiteChrome>
      </body>
    </html>
  );
}
