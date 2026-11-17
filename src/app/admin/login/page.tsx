"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="adm-card adm-login"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr("");
        const f = new FormData(e.currentTarget);
        const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: f.get("username"), password: f.get("password") }) });
        if (r.ok) { router.replace("/admin"); router.refresh(); return; }
        setErr((await r.json().catch(() => ({}))).error || "Sign in failed.");
        setBusy(false);
      }}
    >
      <div className="adm-bolt">⚡</div>
      <h1>Team sign in</h1>
      <p>Private area. Authorised staff only.</p>
      <label>Username<input name="username" type="text" autoComplete="username" required autoFocus /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {err ? <div className="adm-err" role="alert">{err}</div> : null}
      <button className="adm-btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
