"use client";
import { useEffect, useRef, useState } from "react";

type P = { id: string; label: string; model: string };
type M = { role: "user" | "assistant"; content: string };
const DOT: Record<string, string> = { gemini: "#4285f4", grok: "#111" };
const IDEAS = ["Draft a friendly follow-up to a lead who went quiet", "Outline a proposal for an e-commerce rebuild", "Give 5 LinkedIn post ideas about fast website delivery"];

// Each bot is its own chatbot with its own conversation.
export default function AssistantClient({ providers }: { providers: P[] }) {
  const [active, setActive] = useState(providers[0]?.id || "");
  const [chats, setChats] = useState<Record<string, M[]>>({});
  const [text, setText] = useState("");
  const [busy, setBusy] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [chats, active, busy]);

  if (!providers.length)
    return <div className="adm-card">No bot is configured. Set <code>GEMINI_API_KEY</code> (Google) and/or <code>XAI_API_KEY</code> (Grok) on the server, then reload.</div>;

  const msgs = chats[active] || [];
  const cur = providers.find((p) => p.id === active)!;

  async function send(t: string) {
    t = t.trim();
    if (!t || busy) return;
    const bot = active, next: M[] = [...(chats[bot] || []), { role: "user", content: t }];
    setChats((c) => ({ ...c, [bot]: next })); setText(""); setBusy(bot);
    const r = await fetch("/api/admin/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: bot, messages: next }) });
    const d = await r.json().catch(() => ({}));
    setChats((c) => ({ ...c, [bot]: [...next, { role: "assistant", content: r.ok ? d.reply : `⚠ ${d.error || "Request failed"}` }] }));
    setBusy("");
  }

  return (
    <div className="adm-chat">
      <div className="adm-bots">
        {providers.map((p) => (
          <button key={p.id} className={active === p.id ? "on" : ""} onClick={() => setActive(p.id)}>
            <i style={{ background: DOT[p.id] || "#5a34d0" }} /><b>{p.label}</b><small>{p.model}</small>
            {!!(chats[p.id] || []).length && <em>{(chats[p.id] || []).length}</em>}
          </button>
        ))}
      </div>
      <div className="adm-card adm-chatbox">
        <div className="adm-chatlog">
          {!msgs.length && (
            <div className="adm-chatempty">
              <p>You&apos;re chatting with <b>{cur.label}</b>. This conversation is separate from the other bot.</p>
              <div>{IDEAS.map((i) => <button key={i} className="adm-btn ghost" onClick={() => send(i)}>{i}</button>)}</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`adm-bubble ${m.role}`}>
              <small>{m.role === "user" ? "You" : cur.label}</small>
              <div>{m.content}</div>
              {m.role === "assistant" && <button className="adm-btn ghost" onClick={() => navigator.clipboard.writeText(m.content)}>Copy</button>}
            </div>
          ))}
          {busy === active && <div className="adm-bubble assistant"><small>{cur.label}</small><div>Thinking…</div></div>}
          <div ref={end} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="adm-chatform">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${cur.label}…`} maxLength={4000} />
          <button className="adm-btn" disabled={!!busy || !text.trim()}>Send</button>
          <button type="button" className="adm-btn ghost" onClick={() => setChats((c) => ({ ...c, [active]: [] }))}>Clear</button>
        </form>
      </div>
    </div>
  );
}
