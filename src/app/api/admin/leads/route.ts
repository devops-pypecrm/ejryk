import { leads } from "../../../../lib/store";
import { json } from "../../../../lib/http";
export async function GET() { return json(await leads.list()); }
