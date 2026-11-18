"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./HomeIntro.module.css";

let played = false;

function measureCurtains() {
  const hero = document.getElementById("home");
  if (!hero) return null;

  const bounds = hero.getBoundingClientRect();
  const bars = Array.from(hero.querySelectorAll(".nx-curtain i"), (bar) => {
    const rect = bar.getBoundingClientRect();
    return { left: rect.left - bounds.left, width: rect.width };
  }).sort((a, b) => a.left - b.left);

  return { bounds, bars };
}

export default function HomeIntro() {
  const [geometry, setGeometry] = useState<ReturnType<typeof measureCurtains>>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (played || motion.matches || window.location.hash) return;

    // Schedule playback after mounting so the initial server markup stays usable.
    let timer: number | undefined;
    function cleanup() {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("resize", syncGeometry);
      motion.removeEventListener("change", dismiss);
    }
    function dismiss() {
      cleanup();
      setGeometry(null);
    }
    function syncGeometry() {
      setGeometry(measureCurtains());
    }
    const frame = window.requestAnimationFrame(() => {
      played = true;
      syncGeometry();
      window.addEventListener("resize", syncGeometry);
      timer = window.setTimeout(dismiss, 3000);
    });

    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    window.addEventListener("scroll", dismiss, { passive: true });
    motion.addEventListener("change", dismiss);
    return cleanup;
  }, []);

  if (!geometry) return null;

  const { bounds, bars } = geometry;

  return (
    <div className={styles.intro} aria-hidden="true">
      <div
        className={styles.mark}
        style={{
          "--hero-width": `${bounds.width}px`,
          "--hero-height": `${bounds.height}px`,
          "--hero-center-x": `${bounds.left + bounds.width / 2}px`,
          "--hero-center-y": `${bounds.top + bounds.height / 2}px`,
        } as CSSProperties}
      >
        <div className={styles.strands}>
          {bars.map((bar, index) => (
            <span
              key={index}
              className={styles.strand}
              style={{
                "--offset": `${(index + .5) / bars.length * 100}%`,
                "--width": `${[0.8, 2.1, 1.3, 3.2, 0.45][index % 5]}%`,
                "--landing": `${bar.left}px`,
                "--landing-width": `${bar.width}px`,
              } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
