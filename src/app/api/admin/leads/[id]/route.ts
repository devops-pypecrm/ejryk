import { NextRequest } from "next/server";
import { leads, LeadStatus } from "../../../../../lib/store";
import { json, sameOrigin, str } from "../../../../../lib/http";

const STATUSES: LeadStatus[] = ["new", "contacted", "won", "lost"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const patch: { status?: LeadStatus; notes?: string } = {};
  if (STATUSES.includes(b.status)) patch.status = b.status;
  if (typeof b.notes === "string") patch.notes = str(b.notes, 4000);
  const row = await leads.update(id, patch);
  return row ? json(row) : json({ error: "Not found" }, 404);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const { id } = await params;
  return (await leads.remove(id)) ? json({ ok: true }) : json({ error: "Not found" }, 404);
}
