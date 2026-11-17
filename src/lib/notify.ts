// Free instant alerts for new leads. All optional; set any of these on the server:
//   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID  (create a bot with @BotFather, free)
//   DISCORD_WEBHOOK_URL                    (Discord channel > Integrations > Webhooks, free)
//   NOTIFY_WEBHOOK_URL                     (any URL, e.g. Zapier/Make/n8n: receives {text})
const t = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) }).catch(() => undefined);

export async function notify(text: string) {
  const e = process.env;
  const jobs: Promise<unknown>[] = [];
  if (e.TELEGRAM_BOT_TOKEN && e.TELEGRAM_CHAT_ID) jobs.push(t(`https://api.telegram.org/bot${e.TELEGRAM_BOT_TOKEN}/sendMessage`, { chat_id: e.TELEGRAM_CHAT_ID, text }));
  if (e.DISCORD_WEBHOOK_URL) jobs.push(t(e.DISCORD_WEBHOOK_URL, { content: text.slice(0, 1900) }));
  if (e.NOTIFY_WEBHOOK_URL) jobs.push(t(e.NOTIFY_WEBHOOK_URL, { text }));
  await Promise.all(jobs);
}
export const notifyConfigured = () => !!((process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) || process.env.DISCORD_WEBHOOK_URL || process.env.NOTIFY_WEBHOOK_URL);
