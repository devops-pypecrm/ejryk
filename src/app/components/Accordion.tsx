"use client";
import { useState } from "react";

export default function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion">
      <div className="accordion_content">
        {items.map((it, i) => (
          <div key={it.q} className={`accordion_item${open === i ? " is-open" : ""}`}>
            <button type="button" className="accordion_toggle" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="accordion-title">{it.q}</span>
              <span className="nx-acc-icon" aria-hidden="true" />
            </button>
            <div className="nx-acc-panel"><div><p className="accordion-paragraph">{it.a}</p></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
