import { NextRequest } from "next/server";
import { PRESETS, cleanParams, mergedParams, presetById, runNow, slotNow, DAYS } from "../../../../lib/automation";
import { configured } from "../../../../lib/chat";
import { runlog, workflows } from "../../../../lib/store";
import { json, limited, sameOrigin } from "../../../../lib/http";

export async function GET() {
  const [states, logs] = await Promise.all([workflows.list(), runlog.list()]);
  return json({
    claude: configured(), days: DAYS,
    workflows: PRESETS.map(({ id, name, desc, trigger, schedule, params }) => {
      const st = states.find((x) => x.id === id);
      return { id, name, desc, trigger, hasSchedule: !!schedule, fields: params, enabled: !!st?.enabled, params: mergedParams(PRESETS.find((p) => p.id === id)!, st?.params), lastRun: st?.lastRun, lastOk: st?.lastOk, lastMessage: st?.lastMessage };
    }),
    logs: logs.slice(0, 30),
  });
}

// Save settings / toggle a workflow
export async function PUT(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  const b = await req.json().catch(() => ({})), pr = presetById(b.id);
  if (!pr) return json({ error: "Unknown workflow" }, 404);
  const prev = (await workflows.list()).find((x) => x.id === pr.id);
  const params = cleanParams(pr, b.params ?? prev?.params ?? {});
  const enabled = !!b.enabled;
  // Turning a schedule on skips the slot that has already passed, so nothing fires unexpectedly.
  const patch = { enabled, params, ...(enabled && !prev?.enabled && pr.trigger === "schedule" ? { lastSlot: slotNow(pr, params) } : {}) };
  await workflows.upsert(pr.id, patch);
  return json({ ok: true });
}

// Run a scheduled workflow right now
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited("automation-run", 20, 10 * 60 * 1000)) return json({ error: "Slow down a little." }, 429);
  const b = await req.json().catch(() => ({}));
  try { return json(await runNow(String(b.id))); } catch { return json({ error: "This workflow can't be run manually." }, 400); }
}
