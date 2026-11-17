import { tick } from "./lib/automation";

const g = globalThis as { __ztTimer?: boolean };
if (!g.__ztTimer && process.env.AUTOMATION_SCHEDULER !== "off") {
  g.__ztTimer = true;
  setInterval(() => { tick().catch((e) => console.error("[automation] tick", e)); }, 10 * 60 * 1000).unref();
}
