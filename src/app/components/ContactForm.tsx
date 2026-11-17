"use client";
import { useState } from "react";
import { SITE } from "../../data/site";

// Saves the enquiry to the private admin inbox. If that fails, the visitor gets a mail link as a fallback.
export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setState("sending");
        try {
          const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
          if (r.ok) { setState("done"); form.reset(); return; }
          setMsg((await r.json().catch(() => ({}))).error || "");
        } catch {}
        setState("error");
      }}
    >
      <label className="nx-field"><span>Full Name *</span><input className="input-field" name="name" type="text" required maxLength={120} /></label>
      <label className="nx-field"><span>Email Address *</span><input className="input-field" name="email" type="email" required maxLength={200} /></label>
      <label className="nx-field"><span>Phone Number</span><input className="input-field" name="phone" type="tel" maxLength={40} /></label>
      <label className="nx-field"><span>Message *</span><textarea className="input-field textarea" name="message" required maxLength={4000} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      <div className="send-div">
        <div className="required-text">* Required fields</div>
        <button type="submit" className="submit-button" disabled={state === "sending"}>{state === "sending" ? "sending…" : "send"}</button>
      </div>
      {state === "done" && <p role="status" style={{ marginTop: 18, fontWeight: 600 }}>Thank you! We have your message and will reply shortly.</p>}
      {state === "error" && <p role="alert" style={{ marginTop: 18 }}>{msg || "Something went wrong."} You can also email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or WhatsApp {SITE.whatsapp}.</p>}
    </form>
  );
}
