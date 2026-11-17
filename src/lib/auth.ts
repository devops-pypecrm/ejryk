// Signed-cookie sessions using Web Crypto, so the same code runs in middleware (edge) and in route handlers (node).
export const COOKIE = "zt_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const enc = new TextEncoder();
const dec = new TextDecoder();

const b64u = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64u = (s: string) => {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

export const authConfigured = () =>
  !!process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32 && !!process.env.ADMIN_USER && !!process.env.ADMIN_PASSWORD;

async function hmacKey() {
  return crypto.subtle.importKey("raw", enc.encode(process.env.AUTH_SECRET || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

export async function createSession(email: string): Promise<string> {
  const body = b64u(enc.encode(JSON.stringify({ e: email, exp: Date.now() + SESSION_TTL_MS })));
  const sig = b64u(await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body)));
  return `${body}.${sig}`;
}

export async function verifySession(token?: string | null): Promise<{ email: string } | null> {
  if (!token || !authConfigured()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = b64u(await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body)));
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const p = JSON.parse(dec.decode(fromB64u(body)));
    if (typeof p.exp !== "number" || p.exp < Date.now()) return null;
    if (p.e !== process.env.ADMIN_USER) return null;
    return { email: p.e };
  } catch {
    return null;
  }
}

export const cookieOptions = (maxAgeSeconds = SESSION_TTL_MS / 1000) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: maxAgeSeconds,
});
