"use client";
import { useState } from "react";

export interface Testimonial { quote: string; name: string; role: string; img: string }

export default function Tabs({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const t = items[i];
  return (
    <div className="tabs">
      <div className="tabs-menu" role="tablist">
        {items.map((_, n) => (
          <button key={n} type="button" role="tab" aria-selected={i === n} className={`tab-link${i === n ? " w--current" : ""}`} onClick={() => setI(n)}>{n + 1}</button>
        ))}
      </div>
      <div className="tabs-content" role="tabpanel" key={i}>
        <img className="tab-conent-image" src={t.img} alt={t.name} width={150} height={150} />
        <div>
          <h4 className="tab-content-title">{t.name}</h4>
          <p className="tab-paragraph">{t.quote}</p>
          <p className="tab-paragraph" style={{ marginTop: 8, opacity: 0.6, fontSize: 14, textTransform: "uppercase", letterSpacing: ".08em" }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}
