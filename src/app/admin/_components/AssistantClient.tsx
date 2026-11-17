"use client";
import { useEffect, useRef, useState } from "react";

type M = { role: "user" | "assistant"; content: string };
const IDEAS = ["Draft a friendly follow-up to a lead who went quiet", "Outline a proposal for an e-commerce rebuild", "Give 5 LinkedIn post ideas about fast website delivery"];

export default function AssistantClient({ ready, model }: { ready: boolean; model: string }) {
  const [msgs, setMsgs] = useState<M[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, busy]);

  if (!ready) return <div className="adm-card">Claude isn&apos;t connected. Set <code>ANTHROPIC_API_KEY</code> on the server, then reload.</div>;

  async function send(t: string) {
    t = t.trim();
    if (!t || busy) return;
    const next: M[] = [...msgs, { role: "user", content: t }];
    setMsgs(next); setText(""); setBusy(true);
    const r = await fetch("/api/admin/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
    const d = await r.json().catch(() => ({}));
    setMsgs([...next, { role: "assistant", content: r.ok ? d.reply : `⚠ ${d.error || "Request failed"}` }]);
    setBusy(false);
  }

  return (
    <div className="adm-chat">
      <div className="adm-bots"><button className="on"><i style={{ background: "#d97757" }} /><b>Claude</b><small>{model}</small></button></div>
      <div className="adm-card adm-chatbox">
        <div className="adm-chatlog">
          {!msgs.length && (
            <div className="adm-chatempty">
              <p>Ask Claude anything about the business: replies, proposals, posts, SEO, planning.</p>
              <div>{IDEAS.map((i) => <button key={i} className="adm-btn ghost" onClick={() => send(i)}>{i}</button>)}</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`adm-bubble ${m.role}`}>
              <small>{m.role === "user" ? "You" : "Claude"}</small>
              <div>{m.content}</div>
              {m.role === "assistant" && <button className="adm-btn ghost" onClick={() => navigator.clipboard.writeText(m.content)}>Copy</button>}
            </div>
          ))}
          {busy && <div className="adm-bubble assistant"><small>Claude</small><div>Thinking…</div></div>}
          <div ref={end} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="adm-chatform">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message Claude…" maxLength={4000} />
          <button className="adm-btn" disabled={busy || !text.trim()}>Send</button>
          <button type="button" className="adm-btn ghost" onClick={() => setMsgs([])}>Clear</button>
        </form>
      </div>
    </div>
  );
}
