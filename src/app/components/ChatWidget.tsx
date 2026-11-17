"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../../data/site";

type M = { role: "user" | "assistant"; content: string };
const CHIPS = ["What services do you offer?", "How fast can you build a website?", "How do I get a quote?"];

// **bold** only; everything else stays plain text (no HTML injection).
const fmt = (t: string) => t.split(/(\*\*[^*]+\*\*)/g).map((s, i) => (s.startsWith("**") && s.endsWith("**") ? <strong key={i}>{s.slice(2, -2)}</strong> : s));

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);
  const [msgs, setMsgs] = useState<M[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || ready !== null) return;
    fetch("/api/chat").then((r) => r.json()).then((d) => setReady(!!d.available)).catch(() => setReady(false));
  }, [open, ready]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, open, busy]);

  async function send(t: string) {
    t = t.trim();
    if (!t || busy) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next); setText(""); setBusy(true);
    let reply = "Connection problem. Please try again or message us on WhatsApp.";
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const d = await r.json().catch(() => ({}));
      reply = r.ok ? d.reply : d.error || reply;
    } catch { /* keep default */ }
    setMsgs([...next, { role: "assistant", content: reply }]);
    setBusy(false);
  }

  return (
    <>
      {open && (
        <section className="nx-chat" role="dialog" aria-label="Chat with Zenitzu">
          <header className="nx-chat-head">
            <span className="nx-chat-logo">⚡</span>
            <div><b>Ask Zenitzu</b><small><i /> Online · replies in seconds</small></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>
          <div className="nx-chat-body" aria-live="polite">
            {ready === null && <p className="bot">Loading…</p>}
            {ready === false && <p className="bot">Chat isn&apos;t available right now. Message us on <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> or use the <a href="/contact">contact form</a>.</p>}
            {ready && (
              <>
                <p className="bot">Hi! I&apos;m the Zenitzu assistant. Ask about our services, timelines or how to get started.</p>
                {!msgs.length && <div className="nx-chat-chips">{CHIPS.map((c) => <button key={c} onClick={() => send(c)}>{c}</button>)}</div>}
              </>
            )}
            {msgs.map((m, i) => <p key={i} className={m.role === "user" ? "me" : "bot"}>{fmt(m.content)}</p>)}
            {busy && <p className="bot typing"><span /><span /><span /></p>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="nx-chat-form">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" maxLength={2000} aria-label="Message" disabled={!ready} />
            <button disabled={busy || !text.trim()} aria-label="Send">↑</button>
          </form>
        </section>
      )}
      <button className="nx-chat-fab" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close chat" : "Open chat"}>
        {open ? "×" : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12z" /></svg>}
      </button>
    </>
  );
}
