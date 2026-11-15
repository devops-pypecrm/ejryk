"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Light, scroll-triggered reveals plus the hero entrance. No cursor tracking, no scroll-jacking.
export default function MazeFx() {
  const path = usePathname();
  const flash = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // A soft double flash of thunder when moving between pages (not on first load: the hero storm covers that).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = flash.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("go");
    void el.offsetWidth;
    el.classList.add("go");
  }, [path]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce) {
      reveal.forEach((el) => el.classList.add("is-in"));
      document.querySelectorAll<HTMLElement>("[data-hero]").forEach((el) => { el.style.opacity = "1"; });
      return;
    }

    // stagger siblings
    const seen = new Map<Element, number>();
    reveal.forEach((el) => {
      const p = el.parentElement as Element;
      const n = seen.get(p) ?? 0;
      seen.set(p, n + 1);
      el.style.transitionDelay = `${Math.min(n, 6) * 70}ms`;
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    reveal.forEach((el) => io.observe(el));

    // hero entrance
    const ctx = gsap.context(() => {
      const big = document.querySelector<HTMLElement>(".hero-big-text[data-hero]");
      const img = document.querySelector<HTMLElement>(".herro-image[data-hero]");
      const small = Array.from(document.querySelectorAll<HTMLElement>(".hero-small-text[data-hero], .nx-hero-cta[data-hero], .nx-hero-sub[data-hero]"));
      const title = document.querySelector<HTMLElement>(".sitemap-title[data-hero]");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (big) tl.fromTo(big, { opacity: 0, filter: "blur(28px)", letterSpacing: "0.07em", y: 30 }, { opacity: 1, filter: "blur(0px)", letterSpacing: "-0.02em", y: 0, duration: 1.7 }, 0);
      if (img) tl.fromTo(img, { opacity: 0, scale: 0.88, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.2 }, 0.35);
      if (title) tl.fromTo(title, { opacity: 0, filter: "blur(14px)", y: 24 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 1 }, 0.05);
      if (small.length) tl.fromTo(small, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.8);
    });

    return () => { io.disconnect(); ctx.revert(); };
  }, [path]);

  return <div ref={flash} className="nx-thunder" aria-hidden="true" />;
}
