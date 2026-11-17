// Starts the in-process scheduler on a long-running Node server (VPS / Docker). On serverless hosts it
// can't run; use an external cron to call /api/cron instead (see README).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
