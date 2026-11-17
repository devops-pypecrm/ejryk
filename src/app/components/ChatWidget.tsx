"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../../data/site";

type M = { role: "user" | "assistant"; content: string };
type Bot = { id: string; label: string };
const BRAND: Record<string, { name: string; color: string }> = {
  gemini: { name: "Gemini", color: "#4285f4" },
  grok: { name: "Grok", color: "#111" },
};
const CHIPS = ["What services do you offer?", "How fast can you build a website?", "How do I get a quote?"];

// **bold** and line breaks only; everything else stays plain text (no HTML injection).
const fmt = (t: string) => t.split(/(\*\*[^*]+\*\*)/g).map((s, i) => (s.startsWith("**") && s.endsWith("**") ? <strong key={i}>{s.slice(2, -2)}</strong> : s));

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [bots, setBots] = useState<Bot[] | null>(null);
  const [active, setActive] = useState("");
  const [chats, setChats] = useState<Record<string, M[]>>({});   // a separate conversation per bot
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || bots) return;
    fetch("/api/chat").then((r) => r.json()).then((d) => { setBots(d.bots || []); setActive(d.bots?.[0]?.id || ""); }).catch(() => setBots([]));
  }, [open, bots]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [chats, open, busy, active]);

  const msgs = chats[active] || [];

  async function send(t: string) {
    t = t.trim();
    if (!t || busy || !active) return;
    const bot = active, next = [...(chats[bot] || []), { role: "user" as const, content: t }];
    setChats((c) => ({ ...c, [bot]: next })); setText(""); setBusy(true);
    let reply = "Connection problem. Please try again or message us on WhatsApp.";
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: bot, messages: next }) });
      const d = await r.json().catch(() => ({}));
      reply = r.ok ? d.reply : d.error || reply;
    } catch { /* keep default */ }
    setChats((c) => ({ ...c, [bot]: [...next, { role: "assistant", content: reply }] }));
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
          {bots && bots.length > 1 && (
            <div className="nx-chat-tabs" role="tablist" aria-label="Choose an assistant">
              {bots.map((b) => (
                <button key={b.id} role="tab" aria-selected={active === b.id} className={active === b.id ? "on" : ""} onClick={() => setActive(b.id)}>
                  <i style={{ background: BRAND[b.id]?.color || "#5a34d0" }} />{BRAND[b.id]?.name || b.label}
                </button>
              ))}
            </div>
          )}
          <div className="nx-chat-body" aria-live="polite">
            {bots === null && <p className="bot">Loading…</p>}
            {bots?.length === 0 && <p className="bot">Chat isn&apos;t available right now. Message us on <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> or use the <a href="/contact">contact form</a>.</p>}
            {bots && bots.length > 0 && (
              <>
                <p className="bot">Hi! I&apos;m the {BRAND[active]?.name || "Zenitzu"} assistant. Ask about our services, timelines or how to get started.</p>
                {!msgs.length && <div className="nx-chat-chips">{CHIPS.map((c) => <button key={c} onClick={() => send(c)}>{c}</button>)}</div>}
              </>
            )}
            {msgs.map((m, i) => <p key={i} className={m.role === "user" ? "me" : "bot"}>{fmt(m.content)}</p>)}
            {busy && <p className="bot typing"><span /><span /><span /></p>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="nx-chat-form">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" maxLength={2000} aria-label="Message" disabled={!bots?.length} />
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
