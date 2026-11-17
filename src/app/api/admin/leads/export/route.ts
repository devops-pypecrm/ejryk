import { leads } from "../../../../../lib/store";

// CSV export of all leads. Cells starting with = + - @ are prefixed so spreadsheets can't run them as formulas.
const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? "'" + v : v).replace(/"/g, '""')}"`;

export async function GET() {
  const rows = await leads.list();
  const csv = ["Date,Name,Email,Phone,Status,Message,Notes", ...rows.map((l) => [l.createdAt, l.name, l.email, l.phone, l.status, l.message, l.notes].map(cell).join(","))].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="zenitzu-leads.csv"', "Cache-Control": "no-store" } });
}
